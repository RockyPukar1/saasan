# Contributing to Saasan

Thank you for your interest in contributing to Saasan! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Reporting Issues

- Use the GitHub issue tracker to report bugs or request features
- Check existing issues before creating new ones
- Provide detailed information about the issue
- Include steps to reproduce bugs

### Suggesting Enhancements

- Use GitHub Discussions for feature requests
- Clearly describe the enhancement and its benefits
- Consider the impact on Nepal's anti-corruption efforts

### Code Contributions

- Fork the repository
- Create a feature branch from `main`
- Make your changes following our coding standards
- Add tests for new functionality
- Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 12+
- Git
- Docker (optional)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/saasan.git
cd saasan

# Run automated setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# Start development
npm run dev
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use camelCase for variables and functions
- Use PascalCase for components and classes

### React/React Native

- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript interfaces for props
- Follow the component structure in existing code

### Backend

- Use async/await instead of promises
- Implement proper error handling
- Use Knex.js for database queries
- Follow RESTful API conventions

## 🧪 Testing

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for at least 80% code coverage

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:backend
npm run test:dashboard
npm run test:mobile
```

## 📋 Pull Request Process

### Before Submitting

1. Ensure your code follows our coding standards
2. Run tests and ensure they pass
3. Update documentation if needed
4. Test your changes thoroughly

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Screenshots (if UI changes)

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🏛️ Project Structure

```
saasan/
├── saasan-mobile-rn/          # React Native mobile app
│   ├── app/                   # App screens and navigation
│   ├── components/            # Reusable components
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API services
│   └── types/                 # TypeScript type definitions
├── saasan-dashboard-react/    # React admin dashboard
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── types/             # TypeScript types
├── saasan-node-be/            # Node.js backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── models/            # Data models
│   │   └── types/             # TypeScript types
└── scripts/                   # Utility scripts
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Accessibility**: Ensure the app is usable by people with disabilities
- **Responsive**: Design for mobile-first, then desktop
- **Cultural Sensitivity**: Consider Nepali cultural context
- **Language Support**: Support both English and Nepali

### Color Scheme

- Primary: Red (#DC2626) - Represents urgency and action
- Secondary: Blue (#2563EB) - Trust and reliability
- Success: Green (#059669) - Positive actions
- Warning: Yellow (#D97706) - Caution
- Error: Red (#DC2626) - Problems and corruption

### Typography

- Headings: Bold, clear hierarchy
- Body text: Readable, appropriate line height
- Nepali text: Use appropriate fonts for Devanagari script

## 🌐 Internationalization

### Language Support

- English (primary)
- Nepali (secondary)
- Use translation keys for all user-facing text
- Store translations in context files

### Cultural Considerations

- Respect Nepali cultural values
- Use appropriate imagery and symbols
- Consider local political context
- Be sensitive to regional differences

## 🔒 Security Guidelines

### Data Protection

- Never commit sensitive data to version control
- Use environment variables for configuration
- Implement proper authentication and authorization
- Follow OWASP security guidelines

### Privacy

- Respect user privacy
- Implement proper data retention policies
- Provide clear privacy notices
- Allow users to delete their data

## 📚 Documentation

### Code Documentation

- Use JSDoc for functions and classes
- Document complex algorithms
- Include usage examples
- Keep documentation up to date

### API Documentation

- Document all API endpoints
- Include request/response examples
- Specify error codes and messages
- Update when making changes

## 🚀 Deployment

### Environment Setup

- Use environment variables for configuration
- Implement proper logging
- Set up monitoring and alerts
- Follow security best practices

### Database Migrations

- Always create migration scripts for schema changes
- Test migrations on development data
- Include rollback procedures
- Document migration steps

## 🤝 Community Guidelines

### Communication

- Be respectful and inclusive
- Use clear and constructive language
- Help others learn and grow
- Follow the code of conduct

### Collaboration

- Work together towards common goals
- Share knowledge and best practices
- Give credit where due
- Be open to feedback and suggestions

## 📞 Getting Help

### Resources

- GitHub Issues for bug reports
- GitHub Discussions for questions
- Documentation in the README
- Code comments and examples

### Contact

- Create an issue for technical questions
- Use discussions for general questions
- Tag maintainers for urgent issues

## 🏆 Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation
- Social media acknowledgments

## 📄 License

By contributing to Saasan, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Saasan and helping fight corruption in Nepal! 🇳🇵
