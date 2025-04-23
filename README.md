# Phase 3 - Secure User Profile Dashboard

## Overview

This is a secure Node.js + Express.js web application for managing user profiles. It supports:

- Local authentication
- Profile form with validation and encryption
- Protection against XSS and SQL injection
- Secure session management
- GitHub Actions for automated security audits

---

## 📦 Installation

open your terminal and input:
git clone https://github.com/yourusername/phase3-dashboard.git
cd phase3-dashboard
npm install

## 📦 Start the Server

open your terminal and input:
node server.js

Then visit http://localhost:3000/login

🔐 Input Validation Techniques
Validation is handled using express-validator in middlewares/validation.js:

name: 3–50 alphabetic characters only

email: must be in valid email format

bio: maximum 500 characters, no HTML tags or special characters (<, >, &, ', etc.)

🧼 Output Encoding
User inputs are sanitized and escaped using escape-html before being rendered to prevent XSS attacks.

Example:
const escapeHtml = require("escape-html");
name = escapeHtml(name);
bio = escapeHtml(bio);

🔐 Encryption
Sensitive fields like email and bio are encrypted using AES before saving to data/users.json.

Encryption logic is in utils/encryption.js using Node’s built-in crypto module.

🧪 Dependency Management
We use npm audit to detect vulnerabilities.
Automated security checks are configured with GitHub Actions (.github/workflows/security.yml) to run audits on push or schedule.

✅ Secure Features Checklist

✅ Validation on all input fields
✅ Escaping output to prevent XSS
✅ AES encryption for sensitive data
✅ HTTPS-ready session config
✅ GitHub CI workflow for audits

##Lessons Learned

Implementing express-validator taught me how to secure user input without blocking usability.

I learned how to safely encrypt and store data in JSON.

Understanding XSS and SQL injection helped me write more defensive code.

Setting up GitHub Actions helped me understand automated security workflows.

# Phase 4 - Security Testing and Ethical and Legal Considerations

### 🎯 Critical Assets

- **User data**: Name, email, and bio stored in `users.json`
- **Session data**: Session IDs and cookies maintaining login state
- **Authentication logic**: Login and logout routes (`/login`, `/logout`)
- **Profile update form**: Allows users to submit or update name, email, and bio
- **Local data file**: Stores encrypted user information
- **Third-party dependencies**: Libraries like `express`, `express-session`, `validator`, `escape-html`

---

### 🧨 Potential Threats

1. SQL Injection through the login form
2. Cross-site Scripting (XSS) via the bio field
3. Session Fixation or Hijacking
4. Plain-text storage of sensitive user data
5. Vulnerabilities in outdated npm dependencies
6. User impersonation via session manipulation
7. Unauthorized local access to `users.json`

---

### 🛠 STRIDE Threat Model Table

| Threat Description                         | STRIDE Category             | Impact | Likelihood | Risk Level | Notes |
|-------------------------------------------|------------------------------|--------|------------|------------|-------|
| XSS in bio field                           | Information Disclosure (I)   | Medium | High       | High       | Can lead to script injection or session theft |
| SQL Injection in login                     | Tampering (T)                | High   | Medium     | High       | May allow login bypass |
| Storing data in plain text                 | Information Disclosure (I)   | High   | Medium     | High       | Exposes sensitive information |
| Outdated npm dependencies                  | Tampering (T)                | Medium | Medium     | Medium     | May include known vulnerabilities |
| Session Fixation or Hijacking              | Elevation of Privilege (E)   | High   | Low        | Medium     | Risk if session ID is not regenerated |
| User impersonation (session misuse)        | Spoofing (S)                 | High   | Low        | Medium     | Identity spoofing through session manipulation |
| Unauthorized access to `users.json`        | Repudiation (R)              | Medium | Medium     | Medium     | Potential for data breach and manipulation |

---

### 🔍 Manual Testing

I manually tested common web vulnerabilities, including:

- **SQL Injection**: Attempted `' OR '1'='1` in the email input field during login. Result: login failed as expected. ✅
- **Cross-site Scripting (XSS)**: Injected `<script>alert("XSS")</script>` in the bio field. Result: blocked with validation message. ✅

These manual tests confirmed that basic input validation and output encoding were effective.

---

### 🔧 Dependency Check

I used the following command to analyze outdated or vulnerable dependencies: ```bash
npm audit


### ✅ Applied Fixes

Based on the findings from Part B, the following security improvements were implemented:

- **Input Validation**:  
  All user inputs (name, email, bio) are validated using `express-validator` to prevent SQL injection and malformed data.

- **Output Encoding**:  
  The `escape-html` package is used to encode user-submitted content before rendering, effectively preventing XSS attacks in the bio field.

- **Session Security**:  
  Session fixation mitigation is applied by regenerating the session ID after successful login using `req.session.regenerate()`.

- **Data Encryption**:  
  Sensitive fields (email and bio) are encrypted before being stored in `users.json` using Node.js's `crypto` module.

- **Dependency Updates**:  
  All outdated and vulnerable packages were upgraded using:
  ```bash
  npm audit fix


### ✅ Ethical Responsibilities of Security Professionals

All testing activities were performed in a controlled, non-production environment using a locally hosted web application. No real user data was used or accessed during testing.  
Security tests such as SQL injection, XSS attacks, and session manipulation were executed with the sole purpose of improving the application’s security posture.  
As a security-conscious developer, I followed ethical standards by ensuring that no testing impacted other users, systems, or services. All simulated attacks were done with full authorization and intent to improve the codebase.

---

### ✅ Legal Implications of Security Testing

This project does not process real user data or operate in a live production environment.  
However, in a real-world deployment, the application would be subject to data privacy laws such as the **Personal Information Protection and Electronic Documents Act (PIPEDA)** in Canada, and possibly the **General Data Protection Regulation (GDPR)** if serving EU users.  
To ensure legal compliance, user inputs were validated and encrypted, and no sensitive data was stored without proper protection. All actions during the development and testing phases were conducted with awareness of and respect for applicable data privacy and cybersecurity laws.


### 🔍 Security Testing

Security testing was conducted through a combination of **manual input-based attacks** and **automated scanning tools**:

- Simulated **SQL injection** attempts in the login form using inputs like `' OR '1'='1`
- Performed **XSS injection tests** in the bio field with `<script>alert("XSS")</script>`
- Ran `npm audit` to scan and fix vulnerable dependencies
- Used **OWASP ZAP** for dynamic analysis and vulnerability scanning of the local application (`http://localhost:3000`)

These tests helped reveal weaknesses related to input validation, dependency vulnerabilities, and session management.

---

### 🛠️ Vulnerability Fixes

Fixes implemented based on the test results:

- Used `express-validator` to sanitize and validate all user input (name, email, bio)
- Added `escape-html` to encode HTML entities, preventing XSS payloads from rendering
- Applied `req.session.regenerate()` after login to prevent session fixation attacks
- Encrypted sensitive user fields (email and bio) using the `crypto` module with AES-256 encryption
- Resolved medium-severity dependency issues with `npm audit fix`

All fixes were tested again and verified to be effective.

---

### 🧰 Testing Tools

| Tool | Purpose |
|------|---------|
| `express-validator` | Input validation (prevent SQL injection, malformed data) |
| `escape-html` | Output encoding (prevent XSS) |
| `crypto` (Node.js) | AES encryption for sensitive user data |
| `npm audit` | Detect and fix known package vulnerabilities |
| `OWASP ZAP` | Dynamic vulnerability scanning of the web application |

---

### 🎓 Lessons Learned

- Input validation alone is not enough — output encoding is also critical for complete protection.
- Even simple web applications need proper session and encryption handling to prevent exploitation.
- Tools like `OWASP ZAP` and `npm audit` help identify issues that are hard to detect manually.
- Ethical and legal awareness is an essential part of being a responsible web developer.
- Clear documentation and step-by-step tracking of issues/fixes make long-term maintenance easier.

This project significantly deepened my understanding of web security concepts and reinforced best practices for protecting user data and web infrastructure.

