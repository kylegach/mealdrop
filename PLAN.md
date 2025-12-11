# MealDrop Monorepo Migration Plan

## Overview

This document outlines the plan to convert MealDrop from a single-app repository into a Turborepo monorepo structure. While initially containing one app, this structure provides a foundation for future scalability and code sharing.

## Current State

MealDrop is a React food delivery application built with:
- **React 19** with TypeScript
- **Vite** for build tooling
- **Styled Components** for styling
- **Redux Toolkit** for state management
- **Vitest** and React Testing Library for testing
- **Storybook** for component development
- **Yarn 4.2.1** as package manager

## Phase 1: Initial Structure Setup

### 1.1 Root Level Changes

1. **Install Turborepo**
   ```bash
   yarn add turbo -D -W
   ```

2. **Create `turbo.json`** configuration file for pipeline definitions

3. **Update root `package.json`**
   - Change to workspace root configuration
   - Add Turborepo scripts (`dev`, `build`, `test`, `lint`, etc.)
   - Remove application-specific dependencies
   - Keep shared dev tools (Prettier, Husky, lint-staged)

4. **Configure Yarn Workspaces**
   - Update `package.json` with workspaces configuration

### 1.2 Target Directory Structure

```
mealdrop/
├── apps/
│   └── web/                    # Current app moved here
│       ├── package.json
│       ├── vite.config.ts
│       ├── vitest.config.ts
│       ├── vitest.workspace.ts
│       ├── tsconfig.json
│       ├── index.html
│       ├── chromatic.config.json
│       ├── test-runner-jest.config.js
│       ├── src/
│       ├── public/
│       └── .storybook/
├── packages/                   # Future shared packages
│   └── .gitkeep                # Empty for now
├── package.json                # Root workspace package.json
├── turbo.json
├── tsconfig.json               # Base TypeScript config
├── eslint.config.js            # Shared ESLint config
├── vercel.json
└── README.md
```

## Phase 2: Move Existing Application

### 2.1 Create `apps/web` Directory

Move all application code to `apps/web/`:

**Application Code:**
- `src/` - All source code
- `public/` - Public assets

**Configuration Files:**
- `vite.config.ts`
- `vitest.config.ts`
- `vitest.workspace.ts`
- `tsconfig.json`
- `index.html`
- `chromatic.config.json`
- `test-runner-jest.config.js`
- `.storybook/` (if exists as a directory)

### 2.2 Create `apps/web/package.json`

```json
{
  "name": "@mealdrop/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc && vite build",
    "build-storybook": "storybook build --output-dir build/storybook",
    "build-storybook:test": "storybook build --output-dir build/storybook --test",
    "chromatic": "chromatic --project-token $CHROMATIC_PROJECT_TOKEN --exit-zero-on-changes --only-changed",
    "clean": "rm -rf build dist .turbo node_modules",
    "dev": "vite",
    "lint": "eslint --fix .",
    "preview": "vite preview",
    "storybook": "storybook dev -p 6006",
    "test": "vitest",
    "test:ci": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test-storybook": "test-storybook",
    "test-storybook:ci": "concurrently --kill-others --success first --names \"SB,TEST\" --prefix-colors \"magenta,blue\" \"yarn build-storybook:test && npx serve build/storybook --listen 6006 --no-request-logging\" \"wait-on tcp:6006 && yarn test-storybook\"",
    "check": "tsc --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "^4.1.3",
    "@reduxjs/toolkit": "^2.6.0",
    "axios": "^1.8.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "react-hooks-helper": "^1.6.0",
    "react-loading-skeleton": "^3.5.0",
    "react-lottie-player": "^2.1.0",
    "react-multi-carousel": "^2.8.5",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.2.0",
    "react-transition-group": "^4.4.5",
    "styled-components": "^6.1.15",
    "stylis": "^4.3.6",
    "typescript": "^5.7.3",
    "use-dark-mode": "^2.3.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@babel/core": "^7.26.9",
    "@chromatic-com/storybook": "4.2.0-next.1",
    "@storybook/addon-a11y": "10.0.0-beta.13",
    "@storybook/addon-coverage": "^2.0.0",
    "@storybook/addon-designs": "^10.0.2-next.0",
    "@storybook/addon-docs": "10.0.0-beta.13",
    "@storybook/addon-themes": "10.0.0-beta.13",
    "@storybook/addon-vitest": "10.0.0-beta.13",
    "@storybook/react-vite": "10.0.0-beta.13",
    "@storybook/test-runner": "0.23.1--canary.fe81472.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^20.17.19",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@types/react-hooks-helper": "^1.6.6",
    "@types/react-redux": "^7.1.34",
    "@types/react-transition-group": "^4.4.12",
    "@types/stylis": "^4.2.7",
    "@types/testing-library__jest-dom": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/browser": "^3.0.7",
    "@vitest/coverage-v8": "^3.0.7",
    "babel-loader": "8.4.1",
    "babel-plugin-istanbul": "^6.1.1",
    "babel-plugin-open-source": "^1.3.4",
    "c8": "^7.14.0",
    "chromatic": "^11.26.1",
    "concurrently": "^9.1.2",
    "happy-dom": "^17.1.8",
    "istanbul": "^0.4.5",
    "jest-junit": "^16.0.0",
    "msw": "^2.7.3",
    "msw-storybook-addon": "^2.0.5",
    "playwright": "^1.50.1",
    "react-is": "^19.0.0",
    "react-test-renderer": "^19.0.0",
    "storybook": "10.0.0-beta.13",
    "storybook-addon-test-codegen": "2.0.2--canary.048203f.0",
    "vite": "^6.2.0",
    "vitest": "^3.0.7",
    "vitest-axe": "^0.1.0",
    "vitest-canvas-mock": "^0.3.3",
    "wait-on": "^8.0.2"
  },
  "msw": {
    "workerDirectory": "public"
  }
}
```

## Phase 3: Configure Turborepo

### 3.1 Create `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["build/**", ".next/**", "dist/**"]
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["build/storybook/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "storybook": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test:ci": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test-storybook": {
      "dependsOn": ["build-storybook"]
    },
    "test-storybook:ci": {
      "dependsOn": ["build-storybook"],
      "cache": false
    },
    "check": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 3.2 Root `package.json` Configuration

```json
{
  "name": "mealdrop",
  "version": "0.1.0",
  "private": true,
  "packageManager": "yarn@4.2.1",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "build-all": "turbo run build build-storybook",
    "build-storybook": "turbo run build-storybook",
    "storybook": "turbo run storybook",
    "test": "turbo run test",
    "test:ci": "turbo run test:ci",
    "test:coverage": "turbo run test:coverage",
    "lint": "turbo run lint",
    "check": "turbo run check",
    "clean": "turbo run clean && rm -rf node_modules .turbo",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "chromatic": "turbo run chromatic",
    "prepare": "husky",
    "pre-commit": "lint-staged"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@typescript-eslint/eslint-plugin": "^7.18.0",
    "@typescript-eslint/parser": "^7.18.0",
    "eslint": "^9.21.0",
    "eslint-config-prettier": "^10.0.2",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-prettier": "^5.2.3",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-storybook": "10.0.0-beta.13",
    "eslint-plugin-unicorn": "^57.0.0",
    "globals": "^16.0.0",
    "husky": "^9.1.7",
    "lint-staged": "^15.4.3",
    "prettier": "^3.5.2",
    "turbo": "^2.3.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.25.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": "eslint --fix",
    "*.{html,md,json}": "prettier --write"
  }
}
```

## Phase 4: Update Configuration Files

### 4.1 TypeScript Configuration

**Root `tsconfig.json` (base configuration):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**`apps/web/tsconfig.json`:**
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

### 4.2 ESLint Configuration

Keep root `eslint.config.js` for shared rules. Apps can extend or override as needed.

## Phase 5: Future Extensibility

### 5.1 Potential Shared Packages

Even with one app now, the structure supports future shared packages:

- **`packages/ui`** - Shared components from Storybook
  - Reusable components
  - Design system primitives
  - Component documentation

- **`packages/config`** - Shared configuration
  - ESLint configs
  - TypeScript configs
  - Vitest configs
  - Shared build tooling

- **`packages/types`** - Shared TypeScript types
  - Domain models
  - API contracts
  - Shared interfaces

- **`packages/utils`** - Shared helper functions
  - Currency formatting
  - Date utilities
  - Common helpers

- **`packages/api`** - API client logic
  - HTTP client
  - API endpoints
  - Request/response handlers

- **`packages/state`** - Redux store
  - Shared state logic
  - Redux slices
  - Selectors

### 5.2 Benefits of This Structure

1. **Scalability** - Easy to add more apps:
   - Admin panel
   - Marketing site
   - Mobile app
   - Partner portal

2. **Code Sharing** - Extract common code later:
   - Shared components
   - Business logic
   - Utilities

3. **Independent Deployments** - Each app can:
   - Deploy separately
   - Have its own CI/CD
   - Use different deployment platforms

4. **Caching** - Turborepo caches:
   - Build outputs
   - Test results
   - Lint results
   - Type checking

5. **Parallel Execution** - Faster CI/CD:
   - Run tasks in parallel
   - Only rebuild what changed
   - Smart task orchestration

## Phase 6: CI/CD Updates

### 6.1 Update CI Pipeline

1. **Adjust build commands:**
   ```bash
   turbo run build --filter=web
   turbo run test:ci --filter=web
   turbo run lint --filter=web
   ```

2. **Leverage Turborepo remote caching:**
   - Configure Vercel Remote Cache
   - Or use Turborepo Cloud
   - Speeds up CI builds significantly

3. **Update Chromatic workflow:**
   ```bash
   turbo run chromatic --filter=web
   ```

4. **Example GitHub Actions workflow:**
   ```yaml
   - name: Install dependencies
     run: yarn install --immutable
   
   - name: Build
     run: yarn turbo run build --filter=web
   
   - name: Test
     run: yarn turbo run test:ci --filter=web
   
   - name: Lint
     run: yarn turbo run lint --filter=web
   ```

## Phase 7: Documentation Updates

### 7.1 Update README.md

- Document monorepo structure
- Explain workspace commands
- Add development workflow
- Include Turborepo benefits

### 7.2 Create Workspace Documentation

- **CONTRIBUTING.md** - How to contribute
- **WORKSPACE.md** - Workspace structure and commands
- Add docs on adding new apps/packages

## Migration Checklist

- [x] **Install Turborepo** - `yarn add turbo -D` ✅ **COMPLETED**
- [x] **Create directory structure** ✅ **COMPLETED**
  - [x] Create `apps/` directory
  - [x] Create `packages/` directory with `.gitkeep`
- [x] **Move files to `apps/web`** ✅ **COMPLETED**
  - [x] Move `src/` directory
  - [x] Move `public/` directory
  - [x] Move config files (vite, vitest, tsconfig, etc.)
  - [x] Move `index.html`
- [x] **Create new package.json files** ✅ **COMPLETED**
  - [x] Update root `package.json` (workspace config)
  - [x] Create `apps/web/package.json`
- [x] **Create configuration files** ✅ **COMPLETED**
  - [x] Create `turbo.json`
  - [x] Create root `tsconfig.json`
  - [x] Update `apps/web/tsconfig.json`
- [x] **Install dependencies** ✅ **COMPLETED**
  - [x] Run `yarn install` at root
- [ ] **Test commands**
  - [ ] Test `yarn dev`
  - [ ] Test `yarn build`
  - [ ] Test `yarn storybook`
  - [ ] Test `yarn test`
  - [ ] Test `yarn lint`
  - [ ] Test `yarn check`
- [ ] **Test Storybook**
  - [ ] Verify Storybook runs
  - [ ] Verify Storybook builds
  - [ ] Test Chromatic integration
- [ ] **Update CI/CD**
  - [ ] Update GitHub Actions (if applicable)
  - [ ] Update deployment workflows
  - [ ] Test CI builds
- [ ] **Documentation**
  - [ ] Update README.md
  - [ ] Update CONTRIBUTING.md
  - [ ] Add workspace documentation
- [ ] **Git cleanup**
  - [ ] Update `.gitignore` if needed
  - [ ] Commit changes
  - [ ] Test fresh clone and build

## Key Considerations

### Package Manager
- Using **Yarn 4.2.1** with PnP or node_modules
- Turborepo works well with Yarn workspaces
- Consider migration path if switching to pnpm later

### Minimal Disruption
- Start with one app to minimize breaking changes
- Set up infrastructure for future growth
- Gradual migration of shared code to packages

### Gradual Extraction
- Extract shared code when needed, not upfront
- Start with most reusable components
- Create packages as clear boundaries emerge

### Build Performance
- Turborepo caching speeds up:
  - Repeated builds
  - Test runs
  - Lint operations
  - Type checking
- Remote caching for CI/CD

### Storybook
- Keep Storybook in app initially
- Can move to dedicated package later
- Could become `apps/storybook` if needed

## Timeline Estimate

- **Phase 1-2**: 2-4 hours (setup and file moving)
- **Phase 3-4**: 2-3 hours (configuration)
- **Phase 5**: Ongoing (as needed)
- **Phase 6**: 1-2 hours (CI/CD updates)
- **Phase 7**: 1-2 hours (documentation)

**Total**: 1-2 days for complete migration and testing

## Rollback Plan

If issues arise during migration:

1. Keep original structure in a backup branch
2. Can revert by merging backup branch
3. Test thoroughly before merging to main
4. Consider feature flag for gradual rollout

## Success Criteria

✅ All existing functionality works
✅ Development workflow unchanged for developers
✅ Build times same or faster
✅ CI/CD pipelines work correctly
✅ Deployments successful to Netlify/Vercel
✅ Storybook functions properly
✅ All tests pass
✅ Documentation updated

## Next Steps After Migration

1. **Identify shared code** - Look for duplication opportunities
2. **Create first shared package** - Start with utilities or types
3. **Add second app** (if needed) - Test multi-app workflow
4. **Set up remote caching** - Configure Turborepo Cloud or Vercel
5. **Optimize build pipeline** - Fine-tune Turborepo configuration

---

## Migration Progress

### ✅ Phase 1: Initial Structure Setup - COMPLETED (December 10, 2025)

**What was completed:**
1. ✅ Installed Turborepo (`turbo@^2.6.3`) as a dev dependency
2. ✅ Created `apps/` and `packages/` directory structure
3. ✅ Created `turbo.json` with all task pipeline configurations
4. ✅ Updated root `package.json`:
   - Changed name to "mealdrop"
   - Added workspaces configuration (`apps/*`, `packages/*`)
   - Converted all scripts to use Turborepo (`turbo run <task>`)
   - Updated lint-staged to include JSON files

**Files modified:**
- `/package.json` - Transformed into workspace root
- `/turbo.json` - Created with task pipeline
- `/apps/` - Created directory
- `/packages/.gitkeep` - Created directory with placeholder

**Next:** Phase 2 - Move existing application to `apps/web`

### ✅ Phase 2: Move Existing Application - COMPLETED (December 10, 2025)

**What was completed:**
1. ✅ Created `apps/web/` directory
2. ✅ Moved application code:
   - Moved `src/` directory to `apps/web/src/`
   - Moved `public/` directory to `apps/web/public/`
3. ✅ Moved configuration files to `apps/web/`:
   - `vite.config.ts`
   - `vitest.config.ts`
   - `vitest.workspace.ts`
   - `tsconfig.json`
   - `index.html`
   - `chromatic.config.json`
   - `test-runner-jest.config.js`
   - `.storybook/` directory
4. ✅ Created `apps/web/package.json` with all app-specific dependencies
5. ✅ Updated root `package.json`:
   - Removed all application-specific dependencies
   - Kept only shared dev tools (ESLint, Prettier, Husky, TypeScript, Turbo)
6. ✅ Created base `tsconfig.json` at root
7. ✅ Updated `apps/web/tsconfig.json` to extend from root
8. ✅ Ran `yarn install` to set up workspace

**Files modified:**
- `/package.json` - Removed app dependencies, kept workspace tools
- `/tsconfig.json` - Created base TypeScript config
- `/apps/web/package.json` - Created with app dependencies
- `/apps/web/tsconfig.json` - Updated to extend root config
- Application files moved from root to `apps/web/`

**Verification:**
- ✅ Workspace recognized `@mealdrop/web` package
- ✅ `yarn check` command runs successfully through Turborepo
- ✅ TypeScript compilation works correctly

**Next:** Phase 4 - Update deployment configurations (netlify.toml, vercel.json)

---

**Document Version**: 1.2
**Last Updated**: December 10, 2025
**Author**: GitHub Copilot
