<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Permanent website design rule

- Follow the established Everydays Travel UI on every new or edited page, including blog and SEO content. Reuse existing components, design tokens, typography, colours, spacing, buttons and forms before adding new patterns.
- Use the shared Navbar and preserve its transparent-at-top, solid-navy-on-scroll behaviour, including restored scroll positions. Do not create page-specific header variants unless the user explicitly requests them.
- Do not introduce breadcrumbs at the top of new pages. Blog pages must not show a visible breadcrumb. Structured breadcrumb metadata may remain.
- Keep the site's existing Inter typography; do not introduce editorial serif fonts or a separate visual theme for the blog. An article layout must still look like this website.
- Preserve the blog's sticky working quote form and responsive quote access while applying these shared styles.
- Any exception needs an explicit user request; these rules apply permanently to future work in this repository.
