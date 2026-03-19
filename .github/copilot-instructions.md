# Project Guidelines

## Storybook MCP Tools

This project has Storybook MCP tools available via the `mealdrop-sb-mcp` MCP server. Always use these tools when working with UI components, stories, and documentation. Use the MCP tools to gather accurate component information.

- Use `list-all-documentation` to discover available components and their IDs
  - Pay attention to the `id` under each H1 component section, as this is needed for the `storybookId` in the next step
- Use `get-documentation` to retrieve component docs, props, usage examples, and stories
- Use `get-documentation-for-story` for additional docs from specific story variants
- Use `get-storybook-story-instructions` before creating or editing components or stories
- Use `preview-stories` after changing any component or story
- Use `run-story-tests` to validate changes

These MCP tools are the source of truth for component APIs, props, variants, and usage patterns. Always prefer them over manually reading source files.

## Never read `packages/ui/` source files

This rule applies **everywhere in the project**, not just when editing files in `packages/ui/`. When working in `apps/web/` or any other package that imports from `@mealdrop/ui`, do NOT use `read_file`, `grep_search`, `semantic_search`, or any file-reading tool to inspect source files inside `packages/ui/`. This includes checking exports, verifying component sub-components (e.g. skeleton variants), or looking up implementation details.

Instead, always use the MCP tools:
- `get-documentation` to learn a component's full API, props, and exported members
- `get-documentation-for-story` to see how specific variants (loading states, skeletons, etc.) are used

## Never modify `packages/ui/` source files

Do NOT directly edit any source files in `packages/ui/`, including stories (e.g. `Button.tsx`, `Input.tsx`, `Button.stories.tsx`, etc.).

Instead, create a new component in `apps/web/src/components/` that composes existing UI components from `packages/ui/` and add stories for that new component. The `packages/ui` Storybook is not run locally and is only used for documentation purposes. All development and testing of UI components should be done in the context of the `apps/web` application, which imports from `packages/ui`.
