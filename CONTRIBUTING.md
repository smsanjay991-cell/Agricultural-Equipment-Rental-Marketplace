# Contributing to AgriRent 🌾

Thank you for your interest in contributing to **AgriRent**! We welcome contributions from developers, designers, and agricultural domain experts.

---

## 🚀 How to Contribute

### 1. Fork & Clone Repository
```bash
git clone https://github.com/your-username/Agricultural-Equipment-Rental-Marketplace.git
cd Agricultural-Equipment-Rental-Marketplace
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Setup Development Environment
```bash
# Setup Backend
cd server
npm install
cp .env.example .env

# Setup Frontend
cd ../client
npm install
npm run dev
```

### 4. Commit Conventions
We follow clear commit message prefixes:
- `feat:` New feature addition
- `fix:` Bug fix
- `docs:` Documentation updates
- `style:` Formatting or CSS tweaks
- `refactor:` Code refactoring

---

## 🛠️ Pull Request Checklist
- [ ] Code builds without errors (`npm run build` in `client`).
- [ ] All new functions include descriptive comments/JSDoc.
- [ ] Follow established ESLint and Prettier styling guidelines.
- [ ] Tested across mobile and desktop viewport sizes.
