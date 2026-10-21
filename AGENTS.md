<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Use TanStack file routes for each content page; product/project parent routes render Outlet for details, so direct links work.
- Keep shared site structure in src/components/site.tsx and browser-safe catalogue data in src/lib/site-data.ts, to maintain consistent presentation.
- Keep all brand visual roles in src/styles.css semantic tokens, so identity changes apply site-wide.
- Until official data and delivery services are supplied, label project/standard previews clearly and prepare enquiries locally without claiming delivery.
