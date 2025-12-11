# MealDrop UI Package Extraction Plan

## Overview

This document outlines the plan to extract shared UI components, styles, hooks, templates, and documentation from `apps/web` into a new `packages/ui` package. This shared package will use Vite, Storybook, and all development tools in the same way as the web app, making it reusable across multiple applications.

## Current State

The following directories are currently in `apps/web/src/`:
- `components/` - UI components (Button, Badge, Modal, etc.)
- `docs/` - Storybook documentation (Colors, Typography, etc.)
- `hooks/` - Shared React hooks (useBodyScrollLock, useKeyboard, etc.)
- `styles/` - Shared styles (theme, breakpoints, GlobalStyle, etc.)
- `templates/` - Page templates

## Goals

1. Create a reusable UI package that can be shared across multiple apps
2. Maintain Storybook for component development and documentation
3. Keep all existing dev tools (Vite, TypeScript, Vitest, ESLint)
4. Ensure zero disruption to existing functionality
5. Set up proper build pipeline for the package

## Migration Status

**Last Updated:** December 10, 2025

### Phase Checklist

- ✅ **Phase 1: Create Package Structure** - COMPLETED
  - Created package directory, package.json, configs
  - Set up Vite, TypeScript, and Vitest
  
- ✅ **Phase 2: Move Files to Package** - COMPLETED
  - Moved components, hooks, styles, templates, docs
  - Copied Storybook configuration
  - Copied required assets
  
- ✅ **Phase 3: Create Package Exports** - COMPLETED
  - Created main index.ts barrel export
  - Created component barrel exports
  - Created styles barrel export
  
- ✅ **Phase 4: Update Dependencies** - COMPLETED
  - Verified all dependencies in UI package
  - Added @mealdrop/ui to web app
  
- ✅ **Phase 5: Update Import Paths in Web App** - COMPLETED
  - Updated 21 files with imports from local paths to @mealdrop/ui
  - Updated App.tsx, all pages, and nested components
  
- ✅ **Phase 6: Update Turbo Configuration** - COMPLETED
  - Verified Turbo build dependencies
  - Updated TypeScript paths in root and web app
  - TypeScript now resolves @mealdrop/ui imports
  
- ✅ **Phase 7: Handle Circular Dependencies** - COMPLETED
  - Copied app-state to UI package (cart and order slices)
  - Copied helpers to UI package (getCurrency, toCurrency, isMobile)
  - Copied stub data to UI package (cart-items, restaurants)
  - Copied types to UI package (ShopItem, FoodMenuItem, Restaurant)
  - Added Redux dependencies (@reduxjs/toolkit, react-redux)
  - Fixed TypeScript errors in selectors
  
- ⏸️ **Phase 8: Testing and Verification** - PENDING
  - Build UI package
  - Test Storybook
  - Run tests
  - Verify web app

### Current Status

**✅ 7/8 Phases Complete (87.5%)**

**Known Issues:**
- None - UI package builds successfully!

**Next Steps:**
- Phase 8: Final testing and verification

---

## Phase 1: Create Package Structure

### 1.1 Create `packages/ui` Directory Structure

```
packages/ui/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── .storybook/
│   ├── main.ts
│   ├── preview.tsx
│   ├── manager.ts
│   ├── preview-head.html
│   ├── manager-head.html
│   ├── demo-mode.tsx
│   ├── withDeeplink.tsx
│   └── vitest.setup.ts
├── src/
│   ├── index.ts          # Main export file
│   ├── components/
│   ├── docs/
│   ├── hooks/
│   ├── styles/
│   └── templates/
└── public/                # Static assets for Storybook
```

### 1.2 Create `packages/ui/package.json`

**Key points:**
- Name: `@mealdrop/ui`
- Main export: `./src/index.ts` (for development)
- Build output: `./dist/index.js` (for production)
- Include all Storybook and testing dependencies
- Include React, styled-components, and other UI dependencies

**Scripts:**
```json
{
  "dev": "vite build --watch",
  "build": "vite build",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build --output-dir build/storybook",
  "test": "vitest",
  "test:ci": "vitest run",
  "lint": "eslint --fix .",
  "check": "tsc --noEmit"
}
```

**Main field configuration:**
```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": {
      "import": "./dist/styles/index.mjs",
      "require": "./dist/styles/index.js",
      "types": "./dist/styles/index.d.ts"
    }
  }
}
```

### 1.3 Create `packages/ui/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": "src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "composite": true
  },
  "include": ["src", ".storybook/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### 1.4 Create `packages/ui/vite.config.ts`

Configure Vite for library mode:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MealdropUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
        },
      },
    },
  },
})
```

## Phase 2: Move Files to Package

### 2.1 Copy Directories

Move from `apps/web/src/` to `packages/ui/src/`:
- `components/` → `packages/ui/src/components/`
- `docs/` → `packages/ui/src/docs/`
- `hooks/` → `packages/ui/src/hooks/`
- `styles/` → `packages/ui/src/styles/`
- `templates/` → `packages/ui/src/templates/`

### 2.2 Copy Storybook Configuration

Copy from `apps/web/.storybook/` to `packages/ui/.storybook/`:
- `main.ts`
- `preview.tsx`
- `manager.ts`
- `preview-head.html`
- `manager-head.html`
- `demo-mode.tsx`
- `withDeeplink.tsx`
- `vitest.setup.ts`

Update paths in `.storybook/main.ts` to reference the new structure.

### 2.3 Copy Required Assets

Copy necessary static assets from `apps/web/public/` to `packages/ui/public/`:
- Fonts (if used by components)
- Icons (if used by components)
- Any other assets referenced by UI components

### 2.4 Copy Test Configuration

Copy and adapt test configuration:
- `vitest.config.ts` (update paths)
- Test setup files if specific to UI

## Phase 3: Create Package Exports

### 3.1 Create `packages/ui/src/index.ts`

Main barrel export file:
```typescript
// Components
export * from './components/AnimatedIllustration'
export * from './components/Badge'
export * from './components/Breadcrumb'
export * from './components/Button'
export * from './components/Category'
export * from './components/ErrorBlock'
export * from './components/Footer'
export * from './components/FooterCard'
export * from './components/Header'
export * from './components/Icon'
export * from './components/IconButton'
export * from './components/Logo'
export * from './components/Modal'
export * from './components/PageSection'
export * from './components/Portal'
export * from './components/RestaurantCard'
export * from './components/Review'
export * from './components/ShoppingCart'
export * from './components/ShoppingCartMenu'
export * from './components/Sidebar'
export * from './components/Spinner'
export * from './components/TopBanner'
export * from './components/forms'
export * from './components/typography'

// Hooks
export * from './hooks'

// Styles
export * from './styles'

// Templates
export * from './templates'
```

### 3.2 Create Component Barrel Exports

Ensure each component directory has an `index.ts` that exports its public API:
- `components/Button/index.tsx`
- `components/Modal/index.ts`
- etc.

### 3.3 Create `packages/ui/src/styles/index.ts`

Export styles barrel:
```typescript
export { default as theme } from './theme'
export { default as GlobalStyle } from './GlobalStyle'
export { default as CSSReset } from './CSSReset'
export * from './breakpoints'
```

## Phase 4: Update Dependencies

### 4.1 Add Dependencies to `packages/ui/package.json`

**Production dependencies:**
- `react` (peer dependency)
- `react-dom` (peer dependency)
- `styled-components` (peer or regular)
- Any other dependencies used by components

**Dev dependencies:**
- `@vitejs/plugin-react`
- `vite`
- `vite-plugin-dts`
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `happy-dom`
- All Storybook dependencies
- TypeScript and types

### 4.2 Update `apps/web/package.json`

Add dependency on the new package:
```json
{
  "dependencies": {
    "@mealdrop/ui": "workspace:*"
  }
}
```

Remove dependencies that are now only in the UI package (if not used elsewhere).

## Phase 5: Update Import Paths in Web App ✅ COMPLETED

### 5.1 Update Imports in `apps/web`

Change all imports from local paths to package imports:

**Before:**
```typescript
import { Button } from '../components/Button'
import { useBodyScrollLock } from '../hooks'
import { theme } from '../styles/theme'
```

**After:**
```typescript
import { Button } from '@mealdrop/ui'  // Components from main entry
import { useBodyScrollLock } from '@mealdrop/ui/hooks'  // Hooks from /hooks entry
import { lightTheme, darkTheme, GlobalStyle, breakpoints } from '@mealdrop/ui/styles'  // Styles from /styles entry
import { PageTemplate } from '@mealdrop/ui/templates'  // Templates from /templates entry
```

**Note:** The package has separate entry points:
- `@mealdrop/ui` - Components only
- `@mealdrop/ui/styles` - Theme, GlobalStyle, breakpoints
- `@mealdrop/ui/hooks` - React hooks
- `@mealdrop/ui/templates` - Page templates

### 5.2 Update Files That Import UI

Files that need updating in `apps/web/src/`:
- `pages/` - All page components
- `App.tsx`
- Any remaining components in `apps/web/src/` (if any)

### 5.3 Use Search and Replace

Use VS Code's workspace search to find and replace:
- Search: `from ['"](\.\./)+components/`
- Search: `from ['"](\.\./)+hooks`
- Search: `from ['"](\.\./)+styles/`
- Search: `from ['"](\.\./)+templates/`

Replace with `@mealdrop/ui` imports.

## Phase 6: Update Turbo Configuration ✅ COMPLETED

### 6.1 Update `turbo.json`

Add UI package build configuration:
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["build/**", "dist/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    }
  }
}
```

The `^build` dependency ensures the UI package is built before the web app.

### 6.2 Update Root TypeScript Configuration

Ensure TypeScript can resolve workspace packages:
```json
{
  "compilerOptions": {
    "paths": {
      "@mealdrop/ui": ["./packages/ui/src"],
      "@mealdrop/ui/*": ["./packages/ui/src/*"]
    }
  }
}
```

## Phase 7: Handle Circular Dependencies

### 7.1 Identify Dependencies

Check if any UI components depend on:
- `apps/web/src/api/` - API client
- `apps/web/src/app-state/` - Redux store
- `apps/web/src/types/` - Type definitions
- `apps/web/src/stub/` - Mock data

### 7.2 Resolution Strategies

**Option A: Move shared types to `packages/types`**
- Create `packages/types` for shared TypeScript types
- Both `@mealdrop/ui` and `@mealdrop/web` depend on it

**Option B: Make UI components accept data as props**
- Remove direct dependencies on API/state
- Pass data down from parent components
- Keep UI components pure and reusable

**Option C: Keep certain components in web app**
- If components are tightly coupled to app logic, keep them in `apps/web`
- Only move truly reusable components

**Recommended:** Start with Option B, then extract types if needed.

## Phase 8: Testing and Verification

### 8.1 Build the UI Package

```bash
cd packages/ui
yarn build
```

Verify:
- `dist/` directory is created
- `dist/index.js` and `dist/index.mjs` exist
- `dist/index.d.ts` type definitions exist

### 8.2 Test Storybook in UI Package

```bash
cd packages/ui
yarn storybook
```

Verify:
- Storybook runs on port 6006
- All stories load correctly
- Component interactions work
- Documentation is visible

### 8.3 Test Web App

```bash
yarn dev
```

Verify:
- Web app runs without errors
- All components render correctly
- No missing imports
- Hot reload works

### 8.4 Run All Tests

```bash
yarn test:ci
```

Verify:
- All tests pass
- No import errors
- Component tests work in both packages

### 8.5 Build All

```bash
yarn build
```

Verify:
- UI package builds successfully
- Web app builds successfully
- No TypeScript errors
- Turbo caching works

## Phase 9: Cleanup

### 9.1 Remove Old Directories from Web App

After verifying everything works, remove from `apps/web/src/`:
- `components/` directory
- `docs/` directory
- `hooks/` directory
- `styles/` directory
- `templates/` directory

### 9.2 Update Web App Storybook

Remove or update `apps/web/.storybook/` configuration:
- **Option A:** Remove entirely (use only UI package Storybook)
- **Option B:** Keep for app-specific stories (pages, user flows)

### 9.3 Update Documentation

Update README files:
- Root `README.md` - Document the monorepo structure
- `packages/ui/README.md` - Document UI package usage
- `apps/web/README.md` - Update imports and dependencies

## Phase 10: Deployment Configuration Updates

### 10.1 Update Netlify/Vercel Configuration

Ensure build commands account for UI package:
```json
{
  "buildCommand": "turbo run build --filter=web"
}
```

Turbo will automatically build dependencies (`@mealdrop/ui`) first.

### 10.2 Update Chromatic Configuration

If using Chromatic for UI package:
```bash
cd packages/ui
yarn chromatic
```

Or update `apps/web/chromatic.config.json` to point to UI package stories.

## Migration Checklist

### Phase 1: Create Package Structure
- [x] Create `packages/ui` directory ✅
- [x] Create `packages/ui/package.json` ✅
- [x] Create `packages/ui/tsconfig.json` ✅
- [x] Create `packages/ui/vite.config.ts` ✅
- [x] Create `packages/ui/vitest.config.ts` ✅
- [x] Install `vite-plugin-dts` dependency ✅

### Phase 2: Move Files
- [x] Move `components/` to `packages/ui/src/components/` ✅
- [x] Move `docs/` to `packages/ui/src/docs/` ✅
- [x] Move `hooks/` to `packages/ui/src/hooks/` ✅
- [x] Move `styles/` to `packages/ui/src/styles/` ✅
- [x] Move `templates/` to `packages/ui/src/templates/` ✅
- [x] Move `assets/` to `packages/ui/src/assets/` ✅
- [x] Copy `.storybook/` to `packages/ui/.storybook/` ✅
- [x] Copy necessary assets from `public/` ✅
- [x] Update Storybook config paths ✅

### Phase 3: Create Exports
- [ ] Create `packages/ui/src/index.ts` barrel export
- [ ] Verify all components have proper exports
- [ ] Create `packages/ui/src/styles/index.ts`
- [ ] Create `packages/ui/src/hooks/index.ts`

### Phase 4: Dependencies
- [ ] Add dependencies to `packages/ui/package.json`
- [ ] Add `@mealdrop/ui` to `apps/web/package.json`
- [ ] Run `yarn install`

### Phase 5: Update Imports
- [ ] Update imports in `apps/web/src/pages/`
- [ ] Update imports in `apps/web/src/App.tsx`
- [ ] Update any other files importing UI components
- [ ] Search for any remaining relative imports

### Phase 6: Configuration
- [ ] Update `turbo.json` for UI package builds
- [ ] Update root `tsconfig.json` with path aliases (if needed)
- [ ] Verify TypeScript resolution works

### Phase 7: Handle Dependencies
- [ ] Identify circular dependencies
- [ ] Refactor components to remove tight coupling
- [ ] Extract shared types if needed

### Phase 8: Testing
- [ ] Build UI package: `cd packages/ui && yarn build`
- [ ] Test UI Storybook: `cd packages/ui && yarn storybook`
- [ ] Test web app: `yarn dev`
- [ ] Run all tests: `yarn test:ci`
- [ ] Build all: `yarn build`
- [ ] Verify Turbo caching works

### Phase 9: Cleanup
- [ ] Remove old directories from `apps/web/src/`
- [ ] Update or remove `apps/web/.storybook/`
- [ ] Update documentation

### Phase 10: Deployment
- [ ] Verify deployment builds work
- [ ] Update Chromatic config if needed
- [ ] Test production build

## Key Considerations

### Peer Dependencies

Mark React and styled-components as peer dependencies in `packages/ui/package.json`:
```json
{
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "styled-components": "^6.1.15"
  }
}
```

This ensures the consuming app provides these dependencies.

### Build Output

The UI package will be built using Vite in library mode:
- ES modules for modern bundlers
- CommonJS for compatibility
- TypeScript declarations for type safety
- Tree-shakeable exports

### Development Workflow

When developing the UI package:
1. Run `yarn dev` in UI package (watch mode)
2. Run `yarn dev` in web app
3. Changes in UI package trigger rebuilds
4. Web app hot-reloads with changes

### Storybook Strategy

**Recommended approach:**
- Keep Storybook in `packages/ui` for component documentation
- Optionally keep `apps/web/.storybook/` for app-specific stories (user flows, full pages)
- This gives you both component-level and integration-level documentation

### TypeScript Resolution

Two approaches for TypeScript resolution:

**Option A: Build Output (Recommended for production)**
```json
{
  "dependencies": {
    "@mealdrop/ui": "workspace:*"
  }
}
```
Imports resolve to built `dist/` files.

**Option B: Source Resolution (Better DX)**
```json
{
  "compilerOptions": {
    "paths": {
      "@mealdrop/ui": ["../../packages/ui/src"]
    }
  }
}
```
Imports resolve directly to source files (faster, better debugging).

Use Option A for production builds, Option B for development.

### Asset Management

For assets used by components:
- Include fonts in `packages/ui/public/`
- Icons can be inline SVGs or imports
- Images should be passed as props (keep them in apps)
- Consider using a CDN for large assets

## Timeline Estimate

- **Phase 1-2**: 2-3 hours (setup and moving files)
- **Phase 3-4**: 1-2 hours (exports and dependencies)
- **Phase 5**: 2-3 hours (updating imports)
- **Phase 6-7**: 1-2 hours (configuration and dependencies)
- **Phase 8**: 2-3 hours (testing and verification)
- **Phase 9-10**: 1 hour (cleanup and deployment)

**Total**: 1-2 days for complete migration and testing

## Success Criteria

✅ UI package builds successfully with Vite
✅ UI package has working Storybook
✅ Web app imports from `@mealdrop/ui` successfully
✅ All tests pass in both packages
✅ Development workflow is smooth (hot reload works)
✅ Production build succeeds for all packages
✅ No circular dependencies
✅ TypeScript types work correctly
✅ Turbo caching provides performance benefits

## Rollback Plan

If issues arise:
1. Keep original files in a backup branch
2. Can revert imports back to relative paths
3. Can move files back to `apps/web`
4. Test incrementally (move one directory at a time)

## Future Enhancements

After initial extraction:
1. **Visual regression testing** - Chromatic on UI package
2. **Component versioning** - Semantic versioning for UI package
3. **Documentation site** - Deploy Storybook as standalone site
4. **Accessibility testing** - Add automated a11y tests
5. **Performance monitoring** - Bundle size tracking
6. **Additional packages** - Extract `types`, `utils`, `api` as needed

---

## Migration Progress

### ✅ Phase 1: Create Package Structure - COMPLETED (December 10, 2025)

**What was completed:**
1. ✅ Created `packages/ui/` directory structure with `src/`, `.storybook/`, and `public/`
2. ✅ Created `packages/ui/package.json`:
   - Package name: `@mealdrop/ui`
   - Configured exports for ESM/CJS with types
   - Set React, React DOM, and styled-components as peer dependencies
   - Added all Storybook and testing dependencies
   - Included `vite-plugin-dts@4.5.4` for TypeScript declarations
3. ✅ Created `packages/ui/tsconfig.json`:
   - Extends root TypeScript config
   - Configured for library output with declarations
   - Set baseUrl to `src` for clean imports
4. ✅ Created `packages/ui/vite.config.ts`:
   - Configured Vite in library mode
   - Multiple entry points (index, styles)
   - ESM and CJS output formats
   - External dependencies (React, styled-components)
   - TypeScript declaration generation with dts plugin
5. ✅ Created `packages/ui/vitest.config.ts`:
   - Configured for happy-dom environment
   - Proper coverage exclusions
6. ✅ Ran `yarn install` - All dependencies installed successfully

**Files created:**
- `/packages/ui/package.json`
- `/packages/ui/tsconfig.json`
- `/packages/ui/vite.config.ts`
- `/packages/ui/vitest.config.ts`
- `/packages/ui/src/` (directory)
- `/packages/ui/.storybook/` (directory)
- `/packages/ui/public/` (directory)

**Verification:**
- ✅ Workspace recognized `@mealdrop/ui` package
- ✅ All dependencies resolved correctly
- ✅ `vite-plugin-dts` installed and configured

**Next:** Phase 2 - Move files from `apps/web` to `packages/ui`

### ✅ Phase 2: Move Files to Package - COMPLETED (December 10, 2025)

**What was completed:**
1. ✅ Moved directories from `apps/web/src/` to `packages/ui/src/`:
   - `components/` - All UI components
   - `docs/` - Storybook documentation
   - `hooks/` - Shared React hooks
   - `styles/` - Theme, breakpoints, GlobalStyle
   - `templates/` - Page templates
   - `assets/` - Images, fonts, animations (copied to both packages since both need them)

2. ✅ Copied Storybook configuration:
   - All 8 files from `apps/web/.storybook/` to `packages/ui/.storybook/`
   - Updated `preview.tsx` to remove app-state dependency
   - Created minimal Redux store for Storybook stories

3. ✅ Copied required assets to `packages/ui/public/`:
   - `sprite-map.svg` - Icon sprite map
   - `mockServiceWorker.js` - MSW for API mocking in Storybook

4. ✅ Updated Storybook configuration:
   - Paths in `main.ts` already correct (relative paths)
   - Modified `preview.tsx` to work without full app-state
   - Removed dependency on `helpers/getCurrency.ts`

**Files moved:**
- From `apps/web/src/` to `packages/ui/src/`: components, docs, hooks, styles, templates
- `assets/` - Copied to both `packages/ui/src/assets/` AND `apps/web/src/assets/` (both need them)
- From `apps/web/.storybook/` to `packages/ui/.storybook/`: all config files
- From `apps/web/public/` to `packages/ui/public/`: sprite-map.svg, mockServiceWorker.js

**Known issues to address in Phase 7:**
- Some components (Header, ShoppingCart, ShoppingCartMenu) depend on `app-state`
- These components import `CartItem` type and Redux hooks
- Will need to refactor these to accept data as props or extract shared types
- Assets are duplicated in both packages (could be optimized later with shared package or CDN)

**Next:** Phase 3 - Create package exports

### ✅ Phase 3: Create Package Exports - COMPLETED (December 10, 2025)

**What was completed:**
1. ✅ Created `packages/ui/src/index.ts` - Main barrel export file:
   - Exports all 24+ components
   - Exports all hooks
   - Exports all styles
   - Exports all templates

2. ✅ Created component barrel exports:
   - `packages/ui/src/components/forms/index.ts` - Exports Input and Select
   - `packages/ui/src/templates/index.ts` - Exports PageTemplate
   - Most components already had index files from Phase 2

3. ✅ Created `packages/ui/src/styles/index.ts` - Styles barrel export:
   - Exports lightTheme and darkTheme
   - Exports GlobalStyle component
   - Exports resetCSS
   - Exports breakpoints utilities

**Files created:**
- `/packages/ui/src/index.ts`
- `/packages/ui/src/components/forms/index.ts`
- `/packages/ui/src/templates/index.ts`
- `/packages/ui/src/styles/index.ts`

**Verification:**
- ✅ All created files pass TypeScript type checking
- ✅ No syntax or export errors in barrel files
- ✅ All exports properly structured

**Known issues (to be addressed in Phase 7):**
- Some components depend on `app-state/`, `helpers/`, `stub/`, and `Routes`
- These dependencies prevent full build but are expected
- Will be resolved in Phase 7 by making components accept props or extracting shared code

**Next:** Phase 4 - Update dependencies

### ✅ Phase 4: Update Dependencies - COMPLETED (December 10, 2025)

**What was completed:**
1. ✅ Verified `packages/ui/package.json` has all required dependencies:
   - **Peer Dependencies**: react ^19.0.0, react-dom ^19.0.0, styled-components ^6.1.15
   - **Production Dependencies**: react-loading-skeleton, react-lottie-player, react-multi-carousel, react-transition-group, stylis, use-dark-mode
   - **Dev Dependencies**: All Vite, Vitest, Storybook, and testing library packages properly configured

2. ✅ Verified `apps/web/package.json` has UI package dependency:
   - Added `@mealdrop/ui: workspace:*`
   - Kept UI-related dependencies in web app (they're used directly in app code)

**Verification:**
- ✅ All dependencies properly configured
- ✅ Peer dependencies correctly set up
- ✅ Web app references UI package with workspace protocol

**Build Status:**
- ⚠️ Build fails due to missing modules (helpers, app-state, stub) - expected and documented
- These will be resolved in Phase 7 (Handle Circular Dependencies)

**Next:** Phase 5 - Update import paths in web app

### ✅ Phase 5: Update Import Paths in Web App - COMPLETED (December 10, 2025)

**What was completed:**
1. ✅ Updated all import paths in `apps/web` from local paths to `@mealdrop/ui`:
   - Main pages: HomePage, CategoryListPage, CategoryDetailPage, RestaurantDetailPage, CheckoutPage, SuccessPage
   - App.tsx - Updated theme and GlobalStyle imports
   - All nested components: Banner, AwardWinningSection, CategoryList, RestaurantsSection, FoodSection, FoodItemModal, FoodItem, StepIndicator, ContactDetails, DeliveryDetails
   - Storybook configuration (.storybook/preview.tsx)

**Files updated (21 files):**
- `apps/web/src/App.tsx`
- `apps/web/.storybook/preview.tsx`
- All page components in `apps/web/src/pages/`
- All nested page components

**Import pattern changes (using separate entry points):**
- From: `import { Button } from '../../../../components/Button'`
- To: `import { Button } from '@mealdrop/ui'`
- From: `import { breakpoints } from '../../../../styles/breakpoints'`
- To: `import { breakpoints } from '@mealdrop/ui/styles'`
- From: `import { PageTemplate } from '../../templates/PageTemplate'`
- To: `import { PageTemplate } from '@mealdrop/ui/templates'`

**Package entry points:**
- `@mealdrop/ui` → Components only (main export)
- `@mealdrop/ui/styles` → Theme, GlobalStyle, breakpoints, resetCSS
- `@mealdrop/ui/hooks` → React hooks (useBodyScrollLock, useKeyboard)
- `@mealdrop/ui/templates` → Page templates (PageTemplate)

**Verification:**
- ✅ All 21 files successfully updated with correct entry points
- ✅ Main index.ts only exports components
- ⚠️ TypeScript errors expected (Cannot find module '@mealdrop/ui/*') - will resolve after Phase 6 & 7

**Next:** Phase 6 - Update Turbo Configuration

### ✅ Phase 6: Update Turbo Configuration - COMPLETED (December 10, 2025)

**What was completed:**
1. ✅ Verified `turbo.json` configuration:
   - Already has `"dependsOn": ["^build"]` for build task
   - Already has correct outputs: `["build/**", ".next/**", "dist/**"]`
   - Build dependencies properly configured to build UI package before web app

2. ✅ Updated root `tsconfig.json`:
   - Added `baseUrl: "."`
   - Added paths for all @mealdrop/ui entry points:
     - `@mealdrop/ui` → `./packages/ui/src/index.ts`
     - `@mealdrop/ui/styles` → `./packages/ui/src/styles/index.ts`
     - `@mealdrop/ui/hooks` → `./packages/ui/src/hooks/index.ts`
     - `@mealdrop/ui/templates` → `./packages/ui/src/templates/index.ts`

3. ✅ Updated `apps/web/tsconfig.json`:
   - Changed `baseUrl` from `"src"` to `"."`
   - Added paths for all @mealdrop/ui entry points (with relative paths from web app)
   - Ensures TypeScript can resolve imports in development

**Files modified:**
- `/tsconfig.json` (root)
- `/apps/web/tsconfig.json`
- `/turbo.json` (verified - already correct)

**Verification:**
- ✅ TypeScript now resolves @mealdrop/ui imports correctly
- ✅ No more "Cannot find module '@mealdrop/ui'" errors in web app
- ⚠️ Remaining errors are expected: missing app-state, helpers, stub (Phase 7)

**TypeScript Path Resolution:**
```jsonc
// Root tsconfig.json
{
  "baseUrl": ".",
  "paths": {
    "@mealdrop/ui": ["./packages/ui/src/index.ts"],
    "@mealdrop/ui/styles": ["./packages/ui/src/styles/index.ts"],
    "@mealdrop/ui/hooks": ["./packages/ui/src/hooks/index.ts"],
    "@mealdrop/ui/templates": ["./packages/ui/src/templates/index.ts"]
  }
}

// apps/web/tsconfig.json
{
  "baseUrl": ".",
  "paths": {
    "@mealdrop/ui": ["../../packages/ui/src/index.ts"],
    "@mealdrop/ui/styles": ["../../packages/ui/src/styles/index.ts"],
    // ... etc
  }
}
```

**Next:** Phase 7 - Handle Circular Dependencies

### ✅ Phase 7: Handle Circular Dependencies - COMPLETED (December 10, 2025)

**Strategy:**
Per user request, copied all necessary files from the web app to the UI package to resolve circular dependencies. Duplication will be handled later through refactoring.

**What was completed:**
1. ✅ Copied `helpers/` directory to `packages/ui/src/helpers/`:
   - `getCurrency.ts` - Currency utility function
   - `index.ts` - Exports toCurrency and isMobile helpers
   
2. ✅ Copied `types/` directory to `packages/ui/src/types/`:
   - `index.ts` - Type definitions for ShopItem, FoodMenuItem, Restaurant
   
3. ✅ Copied `stub/` directory to `packages/ui/src/stub/`:
   - `cart-items.ts` - Mock cart data for Storybook
   - `restaurants.ts` - Mock restaurant data for Storybook
   
4. ✅ Copied `app-state/` directory to `packages/ui/src/app-state/`:
   - `cart/` - Cart Redux slice (CartItem type, actions, reducer, selectors)
   - `order/` - Order Redux slice (actions, reducer, selectors)
   - `store.ts` - Redux store configuration with RootState and AppDispatch types
   - `hooks.ts` - Typed Redux hooks (useAppDispatch, useAppSelector)
   - `index.ts` - Barrel exports
   
5. ✅ Added Redux dependencies to `packages/ui/package.json`:
   - Added `@reduxjs/toolkit: ^2.6.0` to dependencies
   - Added `react-redux: ^9.2.0` to dependencies
   - Added `@types/react-redux: ^7.1.34` to devDependencies
   
6. ✅ Fixed TypeScript errors:
   - Added explicit type annotations for reducer callbacks
   - Imported CartItem type in selectors
   - All TypeScript errors resolved

**Files created:**
- `/packages/ui/src/helpers/getCurrency.ts`
- `/packages/ui/src/helpers/index.ts`
- `/packages/ui/src/types/index.ts`
- `/packages/ui/src/stub/cart-items.ts`
- `/packages/ui/src/stub/restaurants.ts`
- `/packages/ui/src/app-state/cart/cart.ts`
- `/packages/ui/src/app-state/cart/selectors.ts`
- `/packages/ui/src/app-state/cart/index.ts`
- `/packages/ui/src/app-state/order/order.ts`
- `/packages/ui/src/app-state/order/selectors.ts`
- `/packages/ui/src/app-state/order/index.ts`
- `/packages/ui/src/app-state/store.ts`
- `/packages/ui/src/app-state/hooks.ts`
- `/packages/ui/src/app-state/index.ts`

**Verification:**
- ✅ `yarn install` completed successfully
- ✅ UI package builds successfully with `yarn build`
- ✅ All TypeScript errors resolved
- ✅ Components can now import from helpers, app-state, stub, and types
- ✅ Build output includes all entry points (index, styles, hooks, templates)

**Build output:**
```
dist/ui.css                    45.53 kB
dist/index.mjs                477.83 kB (components)
dist/styles.mjs                11.36 kB
dist/hooks.mjs                  0.15 kB
dist/templates.mjs              0.91 kB
+ TypeScript declarations
```

**Note:** 
- Files are now duplicated between `apps/web` and `packages/ui`
- This duplication is temporary and will be resolved later through:
  - Creating shared `packages/types` package
  - Refactoring components to be more pure (accept props instead of Redux)
  - Consolidating helpers into a shared utilities package

**Next:** Phase 8 - Testing and Verification

---

**Document Version**: 1.5
**Created**: December 10, 2025
**Last Updated**: December 10, 2025
**Author**: GitHub Copilot
