import React, { useEffect, useRef } from 'react';

const experienceData = [
  {
    role: 'Full Stack Developer',
    company: 'LAKCHE',
    period: 'Sep 2025 — Present',
    type: 'Full-time',
    description:
      'At Lakche, I work on full-stack projects involving both frontend and backend development. Beyond building features, I conduct cybersecurity assessments and penetration testing on each application to identify and fix vulnerabilities before deployment. I also support ongoing maintenance and security monitoring to ensure deployed systems remain secure and stable.',
    tags: ['React.js', 'Express.js', 'JavaScript', 'Node.js', 'PostgreSQL', 'MySQL', 'Tailwind CSS', 'MongoDB', 'Cybersecurity', 'Penetration Testing'],
  },
  {
    role: 'Full-Stack Developer',
    company: 'Elexis Tech',
    period: 'Aug 2025 — Present',
    type: 'Contract',
    description:
      'Developed and maintained full-stack web and mobile applications, building responsive user interfaces, scalable backend APIs, and secure database solutions. Collaborated with cross-functional teams to deliver high-quality software, integrated third-party services, optimized application performance, and deployed production-ready applications.',
    tags: ['React Native', 'React.js', 'Express.js', 'Firebase', 'MongoDB', 'Zustand', 'AWS', 'JavaScript', 'TypeScript', 'Git', 'REST APIs'],
  },
  {
    role: 'Full Stack Developer',
    company: 'KENKEPUTA INC.',
    period: 'Feb 2025 — Sep 2025',
    type: 'Full-time',
    description:
      'At Kenkeputa, I contribute to the development of various software projects, including mobile apps, websites, and backend systems. I specialize in building frontend applications using Flutter, developing backend services with Python and Node.js, and creating responsive websites with React. My role involves collaborating with teams to deliver high-quality digital solutions tailored to client needs.',
    tags: ['Flutter', 'Python', 'Node.js', 'React', 'FastAPI', 'Express.js', 'Mobile Apps', 'Backend Systems'],
  },
  {
    role: 'Web Developer',
    company: 'SLS Bridge Solutions',
    period: 'Dec 2024 — Jun 2025',
    type: 'Full-time',
    description:
      'Maintained and updated the company\'s website to reflect current marketing campaigns and offers. Optimized website performance for speed, SEO, and enhanced user experience. Diagnosed and resolved website bugs to ensure smooth functionality across all devices and browsers. Implemented and managed integrations with email marketing platforms, analytics tools, and tracking pixels.',
    tags: ['HTML', 'CSS', 'JavaScript', 'WordPress', 'SEO', 'Mailchimp', 'Google Analytics', 'Node.js'],
  },
  {
    role: 'Full Stack Developer',
    company: 'HNG Tech Internship',
    period: 'Jan 2024 — Nov 2024',
    type: 'Internship',
    description:
      'Built, styled, and shipped high-quality websites, design systems, mobile apps, and cross-platform digital experiences for a diverse array of clients. Led the development and architecture of technical tools like content management systems, REST APIs, and continuous integration pipelines. Worked alongside product & project managers, designers, and other engineers to transform creative concepts into refined digital experiences at an agile cadence.',
    tags: ['JavaScript', 'TypeScript', 'React', 'CSS', 'Node.js', 'Express.js', 'Tailwind CSS', 'REST APIs', 'CI/CD'],
  },
];

function Experience() {
  const sectionRef = useRef();

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.exp-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('exp-card-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="experience" className="experience-section" ref={sectionRef}>
      <div className="section-header">
        <span className="section-tag">Career</span>
        <h1>Work Experience</h1>
        <p className="section-subtitle">A timeline of my professional journey in software development and cybersecurity.</p>
      </div>
      <div className="exp-timeline">
        <div className="timeline-line" />
        {experienceData.map((exp, i) => (
          <div className={`exp-card ${i % 2 === 0 ? 'exp-left' : 'exp-right'}`} key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
            <div className="exp-dot">
              <span className="exp-dot-inner" />
            </div>
            <div className="exp-content">
              <div className="exp-meta">
                <span className="exp-period">{exp.period}</span>
                <span className="exp-type">{exp.type}</span>
              </div>
              <h3 className="exp-company">{exp.company}</h3>
              <h4 className="exp-role">{exp.role}</h4>
              <p className="exp-desc">{exp.description}</p>
              <div className="exp-tags">
                {exp.tags.map((tag, j) => (
                  <span className="exp-tag" key={j}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Experience;
