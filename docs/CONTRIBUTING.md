# Contributing to Lipeaks FC Games

🎮 Thank you for your interest in contributing to Lipeaks FC Games! This guide will help you get started with contributing to our project.

## 🌟 Ways to Contribute

- 🐛 **Bug Reports**: Report issues you encounter
- 💡 **Feature Requests**: Suggest new features or improvements
- 🔧 **Code Contributions**: Submit bug fixes or new features
- 📚 **Documentation**: Improve documentation and guides
- 🌍 **Translation**: Help translate the interface to more languages
- 🎨 **Design**: Contribute UI/UX improvements

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.0 or higher)
- npm or yarn
- Git
- Basic knowledge of Vue.js 3 and JavaScript

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lipeaks_fc_games.git
   cd lipeaks_fc_games
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/fx0883/lipeaks_fc_games.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- Use **Vue 3 Composition API** with `<script setup>`
- Follow **ESLint** configuration
- Use **semantic commit messages**
- Write **clear comments** for complex logic
- Maintain **consistent naming conventions**

### File Structure

```
src/
├── components/     # Reusable Vue components
├── views/         # Page components
├── composables/   # Vue composables
├── stores/        # Pinia stores
├── services/      # Business logic
├── i18n/          # Internationalization
└── utils/         # Utility functions
```

### Naming Conventions

- **Components**: PascalCase (e.g., `GameCard.vue`)
- **Files**: kebab-case (e.g., `game-service.js`)
- **Variables**: camelCase (e.g., `gameData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_GAMES`)

## 🌍 Internationalization

### Adding New Languages

1. Create language file in `src/i18n/locales/`:
   ```bash
   src/i18n/locales/[language-code].json
   ```

2. Follow existing structure from `en-US.json`

3. Add language to `src/i18n/index.js`

4. Test all UI elements in the new language

### Translation Guidelines

- Keep **consistent terminology**
- Consider **cultural context**
- Test for **UI layout issues**
- Maintain **placeholder and variable** formats

## 🐛 Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the bug
- **Expected vs actual behavior**
- **Browser and OS** information
- **Screenshots** if applicable
- **Console errors** if any

### Bug Report Template

```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Environment
- Browser: [e.g., Chrome 91]
- OS: [e.g., Windows 10]
- Device: [e.g., Desktop/Mobile]

## Screenshots
[If applicable]
```

## 💡 Feature Requests

For feature requests, please provide:

- **Clear description** of the feature
- **Use case** and benefits
- **Possible implementation** approach
- **Alternative solutions** considered

## 🔧 Code Contributions

### Pull Request Process

1. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines

3. **Test your changes** thoroughly

4. **Commit with descriptive messages**:
   ```bash
   git commit -m "feat: add game statistics feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add game search functionality
fix: resolve mobile layout issues
docs: update API documentation
style: format code according to ESLint
```

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Changes are tested
- [ ] Documentation updated if needed
- [ ] No breaking changes (or documented)
- [ ] Related issues linked

## 🧪 Testing

### Manual Testing

- Test on **multiple browsers** (Chrome, Firefox, Safari)
- Test on **different devices** (Desktop, Tablet, Mobile)
- Test **all language versions**
- Verify **game functionality**

### Before Submitting

- [ ] All games load correctly
- [ ] UI works on mobile devices
- [ ] All languages display properly
- [ ] No console errors
- [ ] Performance is acceptable

## 🎨 UI/UX Guidelines

### Design Principles

- **Gaming-focused** aesthetic
- **Mobile-first** responsive design
- **Accessibility** compliance
- **Consistent** visual hierarchy
- **Fast loading** and smooth animations

### Color Scheme

- Primary: Gaming blue (`#4f46e5`)
- Secondary: Gaming green (`#10b981`)
- Accent: Gaming gold (`#f59e0b`)
- Dark mode support

### Component Guidelines

- Use **existing components** when possible
- Follow **consistent spacing** (0.25rem increments)
- Implement **hover states** for interactive elements
- Add **loading states** for async operations

## 🌟 Special Areas for Contribution

### High Priority Areas

1. **Mobile Optimization**
   - Touch controls improvement
   - Performance optimization
   - UI responsiveness

2. **Game Features**
   - Save states functionality
   - More emulator cores
   - Game compatibility improvements

3. **Internationalization**
   - Additional language support
   - RTL language improvements
   - Cultural adaptations

4. **Performance**
   - Loading time optimization
   - Memory usage reduction
   - Bundle size optimization

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Documentation**: Check existing docs first

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints
- Help others learn and grow

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Spam or off-topic content
- Sharing private information

## 🏆 Recognition

Contributors will be:

- Listed in project README
- Mentioned in release notes
- Given credit for significant contributions
- Invited to be maintainers for substantial ongoing contributions

## 📚 Additional Resources

- [Vue.js 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [EmulatorJS Documentation](https://github.com/EmulatorJS/EmulatorJS)
- [Project Architecture Guide](./technical-implementation-guide.md)

---

Thank you for contributing to Lipeaks FC Games! 🎮✨