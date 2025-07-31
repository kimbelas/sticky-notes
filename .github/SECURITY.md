# Security Policy

## Supported Versions

We actively maintain security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

We take the security of our sticky notes application seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Reporting Process

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Send details to the repository maintainer
2. **GitHub Security Advisories**: Use the "Report a vulnerability" feature in the Security tab

### What to Include

When reporting a vulnerability, please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- **Initial Response**: Within 48 hours of report
- **Confirmation**: Within 1 week of report
- **Fix Timeline**: Critical issues will be addressed within 30 days

## Security Features

Our application implements the following security measures:

### Data Protection
- Environment variables for sensitive configuration
- No sensitive data stored in client-side code
- Secure database connection handling

### Input Validation
- Room code format validation (6 alphanumeric characters)
- GraphQL input validation and sanitization
- XSS prevention through React's built-in escaping

### Authentication & Authorization
- Room-based access control
- No user authentication required (by design)
- Rate limiting considerations for API endpoints

### Infrastructure Security
- Secure HTTP headers configuration
- Dependency vulnerability scanning
- Regular security audits via GitHub Actions

## Security Best Practices

When contributing to this project, please follow these security guidelines:

### Code Security
- Never commit sensitive information (API keys, passwords, etc.)
- Use environment variables for configuration
- Validate all user inputs
- Follow secure coding practices

### Dependencies
- Keep dependencies up to date
- Monitor for security vulnerabilities
- Use `npm audit` before committing changes

### API Security
- Implement proper error handling (don't expose internal details)
- Use parameterized queries to prevent injection attacks
- Validate and sanitize all inputs

## Automated Security Scanning

This repository includes automated security scanning:

- **Daily**: Dependency vulnerability scanning
- **On every PR**: Security linting and code analysis
- **Weekly**: Comprehensive security audit
- **Continuous**: CodeQL analysis for security issues

## Security Tools

We use the following tools for security:

- **ESLint Security Plugin**: Static analysis for security issues
- **npm audit**: Dependency vulnerability scanning
- **CodeQL**: Semantic code analysis
- **Dependabot**: Automated dependency updates
- **TruffleHog**: Secret scanning

## Secure Development Lifecycle

1. **Design**: Security considerations during feature planning
2. **Development**: Security-focused code reviews
3. **Testing**: Security testing in CI/CD pipeline
4. **Deployment**: Secure deployment practices with Vercel
5. **Monitoring**: Ongoing security monitoring and updates

## Known Security Considerations

### Room Code Security
- Room codes are 6-character alphanumeric strings
- No built-in expiration (rooms persist indefinitely)
- No access logs or audit trails
- Consider implementing rate limiting for room creation

### Data Persistence
- All data stored in MongoDB with room-based isolation
- No user authentication or encryption at rest
- Room codes provide the only access control

### Client-Side Security
- All note data is visible to anyone with the room code
- No client-side encryption of note content
- Room codes are stored in localStorage

## Recommendations for Users

- Treat room codes as passwords - don't share them publicly
- Be cautious about sensitive information in notes
- Use unique room codes for different groups/purposes
- Regularly review and clean up unused rooms

## Contact

For questions about this security policy, please create an issue or contact the maintainers.