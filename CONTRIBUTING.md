# Contributing to PiDriveOS

Thank you for your interest in contributing to PiDriveOS! We welcome contributions from the community to help make this open-source self-driving platform better for everyone.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to be respectful and collaborative.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub. Include as much detail as possible:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Expected vs. actual behavior.
- Your hardware setup (Pi model, camera, etc.).
- Relevant logs or screenshots.

### Suggesting Enhancements

We love new ideas! If you have a suggestion for a feature or improvement:
- Open an issue and label it as an "enhancement".
- Describe the feature and why it would be useful.
- Provide examples of how it might work.

### Pull Requests

1. **Fork the repository** and create your branch from `main`.
2. **Install dependencies** using `npm install`.
3. **Make your changes**. Ensure your code follows the existing style and is well-documented.
4. **Test your changes**. If you're adding hardware support, verify it with real components if possible.
5. **Lint your code** using `npm run lint`.
6. **Submit a pull request**. Provide a clear description of your changes and link to any related issues.

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pidriveos.git
   cd pidriveos
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Style Guidelines

- Use TypeScript for all new code.
- Follow the existing component structure in `src/components`.
- Use Tailwind CSS for styling.
- Keep components small and focused.
- Document complex logic with comments.

## Safety First

When contributing code that interacts with hardware (motors, servos, etc.), **always** include safety checks. Never assume the hardware is in a safe state.

---

Thank you for helping us build the future of autonomous driving!
