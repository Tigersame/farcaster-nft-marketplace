# Contributing to Farcaster MiniKit NFT Marketplace

Thank you for your interest in contributing to the Farcaster MiniKit NFT Marketplace! This guide will help you get started with contributing to the project.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18+** and npm
- **Git** for version control
- A **Farcaster account** for testing frames
- Basic knowledge of **React**, **TypeScript**, and **Web3**

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/farcaster-nft-marketplace.git
   cd farcaster-nft-marketplace
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/farcaster-nft-marketplace.git
   ```

## 📝 Development Workflow

### 1. Create a Feature Branch
Always create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (if available)
npm test

# Test the build
npm run build
```

### 4. Commit Your Changes
We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```bash
# Examples:
git commit -m "feat: add NFT filtering by category"
git commit -m "fix: resolve dark mode toggle persistence"
git commit -m "docs: update Frame API documentation"
git commit -m "refactor: optimize SocialProof component"
```

**Commit Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Include screenshots if UI changes are involved
- Add appropriate labels

## 🏗️ Project Architecture

### Key Technologies
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Wagmi v2** for Web3 integration
- **Farcaster SDK** for social features

### Folder Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── contexts/           # React contexts (Theme, etc.)
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

### Component Guidelines
- Use TypeScript interfaces for props
- Implement proper dark mode support
- Follow responsive design principles
- Include JSDoc comments for complex functions

## 🎯 Areas for Contribution

### 🐛 Bug Fixes
- UI/UX improvements
- Performance optimizations
- Accessibility enhancements
- Cross-browser compatibility

### ⭐ New Features
- Advanced NFT filtering and search
- Real smart contract integration
- Enhanced Farcaster Frame interactions
- Mobile optimizations
- Analytics and tracking

### 📖 Documentation
- Code comments and JSDoc
- API documentation
- User guides and tutorials
- Architecture documentation

### 🧪 Testing
- Unit tests for components
- Integration tests for API routes
- End-to-end testing for user flows
- Frame testing utilities

## 🎨 Code Style Guidelines

### TypeScript
```typescript
// Use proper interfaces
interface NFTCardProps {
  nft: NFT;
  onPurchase: (tokenId: string) => void;
  className?: string;
}

// Use arrow functions for components
const NFTCard: React.FC<NFTCardProps> = ({ nft, onPurchase, className }) => {
  // Implementation
};

export default NFTCard;
```

### React Components
```typescript
// Use descriptive prop names
const SocialProof: React.FC<{
  showActivity: boolean;
  activityCount: number;
}> = ({ showActivity, activityCount }) => {
  // Implementation
};

// Use custom hooks for complex logic
const useNFTData = (tokenId: string) => {
  // Hook implementation
};
```

### CSS/Tailwind
```typescript
// Use consistent dark mode classes
const containerClasses = `
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border border-gray-200 dark:border-gray-700
`;

// Group related classes
const buttonClasses = `
  px-4 py-2 rounded-lg font-medium
  bg-blue-600 hover:bg-blue-700
  text-white transition-colors
`;
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `NFTCard.tsx`)
- Hooks: `camelCase.ts` (e.g., `useNFTData.ts`)
- Utils: `camelCase.ts` (e.g., `formatPrice.ts`)
- Pages: `kebab-case.tsx` (e.g., `my-listings.tsx`)

## 🧪 Testing Guidelines

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { NFTCard } from './NFTCard';

describe('NFTCard', () => {
  it('renders NFT information correctly', () => {
    const mockNFT = {
      id: '1',
      name: 'Test NFT',
      price: '0.1 ETH'
    };
    
    render(<NFTCard nft={mockNFT} onPurchase={jest.fn()} />);
    
    expect(screen.getByText('Test NFT')).toBeInTheDocument();
    expect(screen.getByText('0.1 ETH')).toBeInTheDocument();
  });
});
```

### Frame Testing
```typescript
// Test Frame responses
describe('/api/frames/nft/[tokenId]', () => {
  it('returns valid Frame HTML', async () => {
    const response = await fetch('/api/frames/nft/1');
    const html = await response.text();
    
    expect(html).toContain('fc:frame');
    expect(html).toContain('fc:frame:button:1');
  });
});
```

## 🚀 Deployment Testing

Before submitting PRs that affect production features:

1. **Test locally**: Ensure your changes work in development
2. **Test build**: Run `npm run build` and verify no errors
3. **Test Frame endpoints**: Verify Frame responses are valid
4. **Test dark mode**: Ensure proper theme switching
5. **Test responsiveness**: Check mobile and desktop layouts

## 📋 Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
- [ ] All checks pass (lint, type-check, build)
- [ ] PR title follows conventional commit format
- [ ] Description clearly explains the changes

## 🐛 Reporting Issues

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (OS, browser, Node version)
5. **Screenshots** (if UI-related)
6. **Console errors** (if any)

### Issue Template
```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- OS: [e.g. Windows 11, macOS 13]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node.js: [e.g. 18.17.0]
```

## 🎯 Feature Requests

When requesting features, please:

1. **Check existing issues** to avoid duplicates
2. **Provide clear use case** and motivation
3. **Suggest implementation** approach (if possible)
4. **Consider backwards compatibility**
5. **Add relevant labels** (enhancement, feature, etc.)

## 🤝 Code Review Process

### For Contributors
- Be open to feedback and suggestions
- Respond promptly to review comments
- Make requested changes in additional commits
- Squash commits before merge (if requested)

### For Reviewers
- Be constructive and specific in feedback
- Focus on code quality, security, and maintainability
- Suggest improvements rather than just pointing out issues
- Approve when ready, request changes if needed

## 🏆 Recognition

Contributors will be:
- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Invited to join the core team for sustained contributions

## 📞 Getting Help

- **GitHub Discussions**: For general questions and ideas
- **Issues**: For bugs and feature requests
- **Discord/Farcaster**: Join our community channels
- **Email**: Contact maintainers directly for sensitive issues

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold this code.

### Our Standards
- **Be respectful** and inclusive
- **Be collaborative** and constructive
- **Focus on what's best** for the community
- **Show empathy** towards others

---

Thank you for contributing to the Farcaster MiniKit NFT Marketplace! Your contributions help make this project better for everyone. 🚀