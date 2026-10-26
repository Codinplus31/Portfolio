import React, { useEffect, useRef, useState, useMemo } from 'react';
import { securityReports, SEVERITY_ORDER } from './securityData';

/* ======== HELPERS ======== */
const STATUS_LABELS = {
  resolved: 'Resolved',
  patched: 'Patched',
  reported: 'Reported',
  disclosed: 'Disclosed',
  'in-progress': 'In Progress',
};

function initialsOf(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/* ======== REUSABLE COMPONENTS ======== */
function TargetIcon({ report, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  if (report.icon && !failed) {
    return (
      <img
        src={report.icon}
        alt={report.target}
        className={`sec-target-icon ${size}`}
        onError={() => setFailed(true)}
      />
    );
  }
  return <span className={`sec-target-initials ${size}`}>{initialsOf(report.target)}</span>;
}

function AttackFlowPanel({ steps }) {
  return (
    <div className="attack-flow">
      {steps.map((s, i) => (
        <div className="attack-step" key={i}>
          <div className="attack-step-icon">{s.icon}</div>
          <div className="attack-step-number">Step {s.step}</div>
          <h4>{s.title}</h4>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ImpactGrid({ items }) {
  return (
    <div className="impact-grid">
      {items.map((item, i) => (
        <div className="impact-item" key={i}>
          <div className="impact-icon">{item.icon}</div>
          <h4>{item.title}</h4>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function RemediationList({ items }) {
  return (
    <ol className="sec-remediation-list">
      {items.map((item, i) => (
        <li key={i}>
          <span className="sec-remediation-number">{i + 1}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function EmailTimeline({ emails }) {
  return (
    <div className="sec-email-timeline">
      {emails.map((email, i) => (
        <div className={`sec-email-item ${email.direction}`} key={i}>
          <div className="sec-email-dot" />
          <div className="sec-email-card">
            <div className="sec-email-header">
              <span className="sec-email-date">{email.date}</span>
              <span className={`sec-email-direction ${email.direction}`}>
                {email.direction === 'sent' ? '↗ Sent' : '↙ Received'}
              </span>
            </div>
            <div className="sec-email-sender">{email.sender}</div>
            <p className="sec-email-summary">{email.summary}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScreenshotGallery({ screenshots, onOpen }) {
  return (
    <div className="sec-screenshot-gallery">
      {screenshots.map((img, i) => (
        <div className="sec-screenshot-item" key={i} onClick={() => onOpen(img.src)}>
          <img src={img.src} alt={img.caption} loading="lazy" />
          <div className="sec-screenshot-overlay">
            <span className="sec-screenshot-number">{i + 1}</span>
            <p>{img.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoBlock({ badge, badgeClass, title, description, videoSrc, extraClass, thumbnailTime }) {
  const videoRef = useRef(null);
  const firstPlayRef = useRef(true);

  const showThumbnailFrame = () => {
    const video = videoRef.current;
    if (!video || typeof thumbnailTime !== 'number') return;
    const safeTime = Number.isFinite(video.duration)
      ? Math.min(thumbnailTime, Math.max(video.duration - 0.1, 0))
      : thumbnailTime;
    video.currentTime = safeTime;
    video.pause();
  };

  const startFromBeginning = () => {
    const video = videoRef.current;
    if (!video || typeof thumbnailTime !== 'number' || !firstPlayRef.current) return;
    firstPlayRef.current = false;
    video.currentTime = 0;
  };

  return (
    <div className={`sec-video-block ${extraClass || ''}`}>
      <div className="sec-video-header">
        <div className={`sec-video-badge ${badgeClass}`}>
          {badgeClass === 'reported' ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Z"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.399l-.451.003.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
          )}
          {badge}
        </div>
        <h3>{title}</h3>
        <p className="sec-video-desc">{description}</p>
      </div>
      <div className="sec-video-player">
        <video
          ref={videoRef}
          controls
          preload={typeof thumbnailTime === 'number' ? 'auto' : 'metadata'}
          playsInline
          onLoadedMetadata={showThumbnailFrame}
          onPlay={startFromBeginning}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

function VulnList({ vulns, expandedCode, onToggleCode }) {
  return (
    <div className="vfs-vulns">
      {vulns.map((vuln, i) => (
        <div className="vfs-vuln-card" key={i}>
          <div className="vfs-vuln-header">
            <span className="vfs-vuln-num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{vuln.title}</h3>
              <span className={`severity-badge ${vuln.severity.toLowerCase()}`}>{vuln.severity}</span>
            </div>
          </div>
          <p className="vfs-vuln-desc">{vuln.desc}</p>
          <div className="vfs-vuln-details">
            {vuln.endpoint && (
              <div className="vfs-detail">
                <span className="vfs-detail-label">Endpoint</span>
                <span className="code-text">{vuln.endpoint}</span>
              </div>
            )}
            {vuln.proof && (
              <div className="vfs-detail">
                <span className="vfs-detail-label">Proof</span>
                <span className="sec-meta-value">{vuln.proof}</span>
              </div>
            )}
          </div>
          {vuln.code && (
            <div className="vfs-code-section">
              <button className="vfs-code-toggle" onClick={() => onToggleCode(i)}>
                <span>{expandedCode === i ? '⟨/⟩ Hide' : '⟨/⟩ View'} Exploit Code</span>
                <svg className={`sec-chevron ${expandedCode === i ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </button>
              {expandedCode === i && (
                <div className="vfs-code-block"><pre><code>{vuln.code}</code></pre></div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CollapsiblePanel({ id, label, open, onToggle, children }) {
  return (
    <div className={`sec-panel ${open ? 'expanded' : ''}`}>
      <button className="sec-panel-toggle" onClick={() => onToggle(open ? '' : id)}>
        <span>{label}</span>
        <svg className="sec-chevron" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
      </button>
      {open && <div className="sec-panel-content">{children}</div>}
    </div>
  );
}

/* ======== REPORT CARD (grid item) ======== */
function ReportCard({ report, onOpen }) {
  const findings = report.vulnerabilities ? report.vulnerabilities.length : 1;
  return (
    <button className={`sec-card sev-${report.severity}`} onClick={() => onOpen(report.id)}>
      <div className="sec-card-top">
        <TargetIcon report={report} size="md" />
        <div className="sec-card-badges">
          <span className={`severity-badge ${report.severity}`}>{report.severity}</span>
          {report.status && (
            <span className={`sec-status-chip status-${report.status}`}>
              {STATUS_LABELS[report.status] || report.status}
            </span>
          )}
        </div>
      </div>
      <div className="sec-card-body">
        <span className="sec-card-target">{report.target}</span>
        <h3 className="sec-card-title">{report.title}</h3>
        {report.tagline && <p className="sec-card-tagline">{report.tagline}</p>}
      </div>
      <div className="sec-card-footer">
        <span className="sec-card-findings">
          {findings} {findings === 1 ? 'finding' : 'findings'}
        </span>
        <span className="sec-card-cta">
          View report
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
        </span>
      </div>
    </button>
  );
}

/* ======== REPORT DETAIL VIEW ======== */
function ReportDetail({ report, onBack, onOpenImage }) {
  const [expandedPanel, setExpandedPanel] = useState(report.attackSteps ? 'attack' : (report.impact ? 'impact' : ''));
  const [expandedCode, setExpandedCode] = useState(null);

  return (
    <div className="sec-report-wrapper">
      <button className="sec-back-btn" onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>
        All reports
      </button>

      {/* Header card */}
      <div className="sec-report-card sec-animate">
        <div className="sec-report-header">
          <div className="sec-report-title-row">
            <div className="sec-report-identity">
              <TargetIcon report={report} size="lg" />
              <div>
                <span className="sec-card-target">{report.target}</span>
                <h2>{report.title}</h2>
              </div>
            </div>
            <span className={`severity-badge ${report.severity}`}>{report.severity}</span>
          </div>

          {report.meta && report.meta.length > 0 && (
            <div className="sec-report-meta">
              {report.meta.map((m, i) => (
                <div className="sec-meta-item" key={i}>
                  <span className="sec-meta-label">{m.label}</span>
                  <span className={`sec-meta-value ${m.code ? 'code-text' : ''} ${m.success ? 'outcome-success' : ''}`}>
                    {m.success && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                    )}
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {(report.attackSteps || report.impact || report.remediation) && (
          <div className="sec-panels">
            {report.attackSteps && (
              <CollapsiblePanel id="attack" label="🎯 Attack Flow" open={expandedPanel === 'attack'} onToggle={setExpandedPanel}>
                <AttackFlowPanel steps={report.attackSteps} />
              </CollapsiblePanel>
            )}
            {report.impact && (
              <CollapsiblePanel id="impact" label="💥 Impact Summary" open={expandedPanel === 'impact'} onToggle={setExpandedPanel}>
                <ImpactGrid items={report.impact} />
              </CollapsiblePanel>
            )}
            {report.remediation && (
              <CollapsiblePanel id="remediation" label="🛡️ Suggested Remediation" open={expandedPanel === 'remediation'} onToggle={setExpandedPanel}>
                <RemediationList items={report.remediation} />
              </CollapsiblePanel>
            )}
          </div>
        )}
      </div>

      {/* Individual vulnerabilities */}
      {report.vulnerabilities && report.vulnerabilities.length > 0 && (
        <div className="sec-animate">
          <VulnList
            vulns={report.vulnerabilities}
            expandedCode={expandedCode}
            onToggleCode={(i) => setExpandedCode(expandedCode === i ? null : i)}
          />
        </div>
      )}

      {/* Timeline */}
      {report.timeline && report.timeline.length > 0 && (
        <div className="sec-timeline-section sec-animate">
          <h2 className="sec-timeline-title">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>
            Responsible Disclosure Timeline
          </h2>
          <EmailTimeline emails={report.timeline} />
        </div>
      )}

      {/* Videos */}
      {report.videos && report.videos.length > 0 && (
        <div className="sec-evidence sec-animate">
          <h2 className="sec-evidence-title">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg>
            Proof of Concept {report.videos.length === 1 ? 'Video' : 'Videos'}
          </h2>
          {report.videos.map((v, i) => (
            <VideoBlock key={i} {...v} />
          ))}
        </div>
      )}

      {/* Screenshots */}
      {report.screenshots && report.screenshots.length > 0 && (
        <div className="sec-screenshots sec-animate">
          <h2 className="sec-evidence-title">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>
            Screenshots
          </h2>
          <ScreenshotGallery screenshots={report.screenshots} onOpen={onOpenImage} />
        </div>
      )}
    </div>
  );
}

/* ======== MAIN COMPONENT ======== */
function Security() {
  const sectionRef = useRef();
  const [activeId, setActiveId] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const activeReport = useMemo(
    () => securityReports.find((r) => r.id === activeId) || null,
    [activeId]
  );

  // Stats
  const stats = useMemo(() => {
    const total = securityReports.length;
    const counts = SEVERITY_ORDER.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    securityReports.forEach((r) => { counts[r.severity] = (counts[r.severity] || 0) + 1; });
    const findings = securityReports.reduce(
      (sum, r) => sum + (r.vulnerabilities ? r.vulnerabilities.length : 1),
      0
    );
    return { total, counts, findings };
  }, []);

  // Available severities for filter chips (only ones that exist)
  const availableSeverities = useMemo(
    () => SEVERITY_ORDER.filter((s) => (stats.counts[s] || 0) > 0),
    [stats]
  );

  // Filtered + searched grid
  const visibleReports = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...securityReports]
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
      .filter((r) => {
      if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.target.toLowerCase().includes(q) ||
        (r.tagline || '').toLowerCase().includes(q)
      );
    });
  }, [query, severityFilter]);

  // Scroll-in animations (re-run when switching views)
  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.sec-animate');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('sec-visible');
        });
      },
      { threshold: 0.08 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [activeId, visibleReports]);

  const openReport = (id) => {
    setActiveId(id);
    if (sectionRef.current) sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const backToGrid = () => setActiveId(null);

  return (
    <div id="security" className="security-section" ref={sectionRef}>
      <div className="section-header sec-animate">
        <span className="section-tag">Cybersecurity</span>
        <h1>Security Research</h1>
        <p className="section-subtitle">
          Responsible vulnerability disclosure and independent security research.
        </p>
      </div>

      {!activeReport ? (
        <>
          {/* Stats strip */}
          <div className="sec-stats sec-animate">
            <div className="sec-stat">
              <span className="sec-stat-num">{stats.total}</span>
              <span className="sec-stat-label">Reports</span>
            </div>
            <div className="sec-stat">
              <span className="sec-stat-num">{stats.findings}</span>
              <span className="sec-stat-label">Findings</span>
            </div>
            {(stats.counts.critical || 0) > 0 && (
              <div className="sec-stat critical">
                <span className="sec-stat-num">{stats.counts.critical}</span>
                <span className="sec-stat-label">Critical</span>
              </div>
            )}
            {(stats.counts.high || 0) > 0 && (
              <div className="sec-stat high">
                <span className="sec-stat-num">{stats.counts.high}</span>
                <span className="sec-stat-label">High</span>
              </div>
            )}
          </div>

          {/* Controls: search + severity filter */}
          <div className="sec-controls sec-animate">
            <div className="sec-search">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>
              <input
                type="text"
                placeholder="Search by target, title…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="sec-filter-chips">
              <button
                className={`sec-filter-chip ${severityFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSeverityFilter('all')}
              >
                All
              </button>
              {availableSeverities.map((s) => (
                <button
                  key={s}
                  className={`sec-filter-chip sev-${s} ${severityFilter === s ? 'active' : ''}`}
                  onClick={() => setSeverityFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Report grid */}
          {visibleReports.length > 0 ? (
            <div className="sec-grid sec-animate">
              {visibleReports.map((report) => (
                <ReportCard key={report.id} report={report} onOpen={openReport} />
              ))}
            </div>
          ) : (
            <p className="sec-empty sec-animate">No reports match your search.</p>
          )}
        </>
      ) : (
        <ReportDetail report={activeReport} onBack={backToGrid} onOpenImage={setLightboxImg} />
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="sec-lightbox" onClick={() => setLightboxImg(null)}>
          <div className="sec-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="sec-lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
            <img src={lightboxImg} alt="Screenshot" />
          </div>
        </div>
      )}

      {/* Bugcrowd Profile */}
      <div className="sec-bugcrowd sec-animate">
        <div className="bugcrowd-card">
          <div className="bugcrowd-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div className="bugcrowd-info">
            <h3>Bugcrowd Profile</h3>
            <p>View my vulnerability reports and security research on Bugcrowd — the world's leading crowdsourced cybersecurity platform.</p>
          </div>
          <a href="https://bugcrowd.com/h/codinplus" target="_blank" rel="noopener noreferrer" className="bugcrowd-btn">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/></svg>
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
}

export default Security;
