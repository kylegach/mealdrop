## Plan: Replace "View all restaurants" with Search

Replace the "View all restaurants" button in the homepage Banner with a search input + submit button. Searching navigates to a new `/search?q={query}` results page that filters existing API data client-side. The search submit button uses `buttonSecondary` (#E5F8BC) background with white text. UI-only — no backend changes.

---

### Phase 1: Add `secondary` variant to Button component

1. **Modify `packages/ui/src/components/Button/Button.tsx`** — Add a new `secondary` boolean prop (similar to existing `clear` prop). When `secondary` is true, use `color.buttonSecondary` for background, `color.buttonSecondaryHover` for hover, and `color.white` for text color. Add `$secondary` transient prop to `StyledButton` and wire it into the existing css template literal.

2. **Update `packages/ui/src/components/Button/Button.stories.tsx`** — Add interaction stories:
   - `Secondary` — visual render
   - `SecondaryClick` — play function: `fn()` for `onClick`, `userEvent.click()`, assert `onClick` called
   - `SecondaryDisabled` — play function: assert `toBeDisabled()` (matches existing `Disabled` story pattern)

### Phase 2: Search input in the Banner

3. **Modify `apps/web/src/pages/HomePage/components/Banner/Banner.tsx`** — Replace the `<Link to="/categories"><Button>View all restaurants</Button></Link>` block with a search form:
   - A `<form>` with `onSubmit` that calls `useNavigate()` to go to `/search?q={query}`
   - A styled text `<input>` (can use the existing `Input` from `@mealdrop/ui` or a custom styled input for banner-specific styling) with placeholder "Search for restaurant or food…"
   - A `<Button secondary>Search</Button>` submit button
   - **Vertically stacked, centered layout**: the form takes **2/3 width** of `ContentContainer`, with the input on top (full width of the form) and the button centered below it. Both input and button should have **matching/similar heights** (e.g. consistent padding to produce ~48px tall elements). On mobile, the form expands to full-width. Use a styled form wrapper with `width: 66%` (with a mobile media query for `width: 100%`), `display: flex; flex-direction: column; align-items: center; gap: 1rem`.

4. **Update `apps/web/src/pages/HomePage/components/Banner/Banner.stories.tsx`** — Add interaction stories:
   - `Desktop` / `Mobile` — existing visual stories (now show search form)
   - `SearchSubmit` — play function: `userEvent.type()` into input, `userEvent.click()` Search button, assert navigation to `/search?q=...`
   - `EmptySearchSubmit` — play function: click Search with empty input, assert no navigation (validation)

### Phase 3: Search Results Page

5. **Create `apps/web/src/pages/SearchResultsPage/SearchResultsPage.tsx`** — New page component following the **`CategoryListPage` layout pattern**:
   - **Page shell**: `PageTemplate` → `TopBanner` (dynamic title: "Search results for \u2018{q}\u2019" when query is present, fallback "Search results"; `onBackClick={() => navigate(-1)}`) → `div.container` for centered content
   - **Description**: `StyledBody` with result count or contextual message — use `margin-bottom: 2.5rem` (no separate heading needed since the TopBanner title already shows the query)
   - Read `q` from URL via `useSearchParams`
   - Reuse `useFetchRestaurants()` from `apps/web/src/api/hooks.ts`
   - Filter client-side: match `q` against restaurant `name`, `specialty`, `categories[]`, and menu items (`menu.food[].name`, `menu.dessert[].name`, `menu.drinks[].name`)
   - Use H3 for section titles ("Restaurants", "Menu Items")
   - **Restaurants section**: responsive CSS Grid of `RestaurantCard` components using the same `repeat(auto-fill, minmax(...))` pattern as `CategoryList`'s `StyledContainer` — `minmax(150px, 1fr)` default, `minmax(280px, 1fr)` at `breakpoints.M`, `minmax(420px, 1fr)` at `breakpoints.XL`, with 12px / 24px gap and `padding-bottom: 5rem`
   - **Menu Items section**: list rows showing item name, price, parent restaurant name — clicking navigates to `/restaurants/:id`
   - Loading: `RestaurantCardSkeleton` / `Spinner` while fetching
   - Empty state: `ErrorBlock` or illustration when no matches
   - Follow the status-driven rendering pattern from `RestaurantDetailPage` (`status === 'loading'` → skeleton, `'500'` → error with retry, `'success'` → results)

6. **Create `apps/web/src/pages/SearchResultsPage/index.tsx`** — Barrel export

### Phase 4: Routing

7. **Modify `apps/web/src/Routes.tsx`** — Add `<Route path="/search" element={<SearchResultsPage />} />` (*depends on step 5*). Import `SearchResultsPage` from its barrel.

### Phase 5: Stories & Interaction Tests

8. **Create `apps/web/src/pages/SearchResultsPage/SearchResultsPage.stories.tsx`** — Stories with MSW handlers (follow `UserFlows.stories.tsx` pattern using `http.get(BASE_URL, ...)`) and `deeplink` parameter for setting URL search params:
   - `WithResults` — deeplink `/search?q=burger`; play: assert `RestaurantCard`s and menu items render
   - `NoResults` — deeplink `/search?q=xyznonexistent`; play: assert empty state visible
   - `Loading` — MSW `delay('infinite')`; play: assert spinner/skeleton visible
   - `Error` — MSW returns 500; play: assert `ErrorBlock`, click retry button
   - `ClickRestaurantResult` — play: click a `RestaurantCard`, assert navigation to `/restaurants/:id`
   - `ClickMenuItem` — play: click a menu item row, assert navigation to restaurant detail

9. **Update `apps/web/src/pages/UserFlows.stories.tsx`** — **Critical fix**: `ToCategoryListPage` (line 54) clicks "View all restaurants" which no longer exists. Changes:
   - Add `ToSearchResultsPage` flow: types query in banner, submits, verifies results page
   - Update `ToCategoryListPage` to navigate via the categories section or header instead of the removed button
   - All downstream composing flows (`ToCategoryDetailPage` → `ToRestaurantDetailPage` → `ToCheckoutPage` → `ToSuccessPage`) must still chain correctly

---

**Relevant files**
- `packages/ui/src/components/Button/Button.tsx` — Add `secondary` variant using `color.buttonSecondary` / `color.buttonSecondaryHover` / `color.white`
- `packages/ui/src/components/Button/Button.stories.tsx` — Secondary + SecondaryClick + SecondaryDisabled stories with play functions
- `packages/ui/src/styles/theme.ts` — Already has `buttonSecondary` (#E5F8BC) and `buttonSecondaryHover` defined; no changes needed
- `apps/web/src/pages/HomePage/components/Banner/Banner.tsx` — Replace button with search form (input + secondary Button), vertically stacked centered layout at 2/3 container width
- `apps/web/src/pages/HomePage/components/Banner/Banner.stories.tsx` — SearchSubmit + EmptySearchSubmit interaction stories
- `apps/web/src/pages/SearchResultsPage/SearchResultsPage.tsx` — New results page (create), mirrors `CategoryListPage` layout
- `apps/web/src/pages/SearchResultsPage/index.tsx` — Barrel export (create)
- `apps/web/src/pages/SearchResultsPage/SearchResultsPage.stories.tsx` — 6 interaction stories (create)
- `apps/web/src/Routes.tsx` — Add `/search` route
- `apps/web/src/pages/UserFlows.stories.tsx` — Fix broken `ToCategoryListPage` chain + add `ToSearchResultsPage` flow
- `apps/web/src/api/hooks.ts` — Reuse `useFetchRestaurants()` for data (read-only reference)
- `apps/web/src/types/index.ts` — Reference `Restaurant`, `FoodMenuItem` types (read-only reference)
- `apps/web/src/pages/CategoryListPage/CategoryListPage.tsx` — **Layout reference**: `PageTemplate` → `TopBanner` → `div.container` → `StyledHeading` / `StyledBody` → grid (read-only reference)
- `apps/web/src/pages/CategoryListPage/components/CategoryList/CategoryList.tsx` — **Grid reference**: responsive `repeat(auto-fill, minmax(...))` pattern with breakpoints (read-only reference)

**Verification**
1. `run-story-tests` — all story interaction tests and accessibility checks pass (Button, Banner, SearchResultsPage, UserFlows)
2. `preview-stories` on each updated/new story set to visually confirm rendering
3. `npx vitest run` in `apps/web` — no regressions

**Decisions**
- Client-side filtering only using existing `useFetchRestaurants()` — no backend changes
- Search scope: restaurant name, specialty, categories, plus all menu item names (food, dessert, drinks)
- URL-driven search (`/search?q=...`) for shareability and back-button support
- AwardWinningSection's link is NOT changed — only the Banner button
- No autocomplete/suggestions dropdown — simple form submit navigating to results page
- No search icon added to the icon set — the button uses text "Search" only
- Empty search submissions should be blocked (basic validation)
- All interactive features covered by play functions: button click, form submit, empty validation, result clicking, error retry, loading states
- `UserFlows.stories.tsx` chain must be repaired since "View all restaurants" text is removed
- **Layout**: Search form is vertically stacked (input above button, both similar height ~48px), centered at 2/3 container width, full-width on mobile
- **SearchResultsPage layout**: Mirrors `CategoryListPage` — `PageTemplate` → `TopBanner` (dynamic title with query) → `div.container` → body → responsive CSS Grid

**Further Considerations**
1. A search icon could be added to the SVG sprite map and used in the search button or input for visual clarity — can be a follow-up
2. Persistent search bar in the Header for site-wide search — natural follow-up, out of scope here