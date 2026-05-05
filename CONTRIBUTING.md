# Contributing to LMS

Welcome! We are excited that you are interested in contributing to the LMS project. This document provides guidelines for contributing and explains our development workflow.


## 📜 Code of Conduct

Help us keep this project open and inclusive. Please be respectful and professional in all interactions.

## 🛠️ Development Workflow

1. **Fork and Clone**: Create a fork of the repository and clone it to your local machine.
2. **Install Dependencies**: Run `npm install` in the root and `backend` directories.
3. **Run Locally**: Use `npm run dev` to start the development environment.
4. **Create a Branch**: Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.
5. **Quality Checks**:
    - Ensure your code passes linting: `npm run lint`.
    - Ensure all tests pass: `npm run test`.
    - Husky pre-commit hooks will automatically run these checks on your staged files.

## 💬 Commit Message Convention

We follow the **Conventional Commits** specification for all commit messages:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

Example: `feat: add scroll-to-top button`

## 🚀 Pull Requests

1. **Describe your changes**: Provide a clear description of the problem and your solution.
2. **Link Issues**: If your PR fixes an open issue, link it in the description.
3. **Request Review**: Tag a maintainer for review.

---

Thank you for contributing!
