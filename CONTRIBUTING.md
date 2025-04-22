# Contributing to CodeGen

First and foremost, thank you for considering contributing to CodeGen! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

- **Check if the bug has already been reported** by searching through the project's issues.
- If you're unable to find an existing issue, **open a new one**. Be sure to include:
  - A clear, descriptive title
  - Steps to reproduce the issue
  - Expected behavior
  - Actual behavior
  - Screenshots (if applicable)
  - Your environment (browser, OS, etc.)

### Suggesting Features

- **Check if the feature has already been suggested** by searching through the project's issues.
- If you're unable to find an existing suggestion, **open a new issue**. Clearly describe:
  - The feature you'd like to see
  - Why it would be valuable to the project
  - Any thoughts on implementation

### Pull Requests

1. **Fork the repository**
2. **Create a branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
   - Follow the coding style of the project
   - Add or update tests as necessary
   - Update documentation as needed
4. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
   - Use clear, descriptive commit messages
   - Reference issues and pull requests where appropriate
5. **Push to your branch** (`git push origin feature/amazing-feature`)
6. **Open a pull request**
   - Include a clear description of the changes
   - Link to any relevant issues

## Development Setup

1. Clone your fork of the repository

   ```bash
   git clone https://github.com/your-username/CodeGen.git
   cd CodeGen
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env.local
   # Configure the environment variables as needed
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Style Guide

- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for classes and React components
- Use UPPERCASE for constants
- End all files with a newline

### CSS/SCSS Style Guide

- Use 2 spaces for indentation
- Use hyphen-separated naming convention
- Organize properties alphabetically

## Additional Notes

### Issue and Pull Request Labels

- `bug`: Something isn't working as expected
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers to the project
- `help wanted`: Extra attention is needed

---

Thank you for your contributions and for making CodeGen better!
