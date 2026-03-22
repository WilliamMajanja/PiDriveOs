# Security Policy

## Reporting a Vulnerability

We take security seriously at PiDriveOS. If you discover a security vulnerability, please report it to us as soon as possible.

**Do NOT open a public issue.** Instead, please email the maintainers at [your-email@example.com] (replace with your real email if you'd like).

Include as much detail as possible:
- A description of the vulnerability.
- Steps to reproduce it.
- Potential impact.
- Any suggested fixes or mitigations.

We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Supported Versions

Only the latest version of PiDriveOS is supported for security updates. We recommend always running the latest version from the `main` branch.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Safety and Security

PiDriveOS interacts with physical hardware. Security vulnerabilities could lead to physical safety risks.

### Best Practices

1. **Physical Kill Switch:** Always maintain a physical emergency kill switch that cuts power to the motors.
2. **Isolated Network:** Run PiDriveOS on an isolated Wi-Fi network to prevent unauthorized access.
3. **Change Default Passwords:** Change the default `pi` user password on your Raspberry Pi immediately.
4. **Regular Updates:** Keep your Raspberry Pi OS and PiDriveOS dependencies up to date.
5. **Firewall:** Use `ufw` or a similar firewall to restrict access to the dashboard (port 3000).

## Disclosure Policy

We follow a responsible disclosure policy. We will not disclose details of a vulnerability until a fix is available and users have had time to update.

---

Thank you for helping us keep PiDriveOS safe!
