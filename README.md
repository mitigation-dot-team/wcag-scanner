# Mitigation dot Team - WCAG Scanner

Automate scanning of HTML/JS/TS/CSS files, pages, and components to detect changes needed for WCAG 2.2 accessibility evaluation. 

> Mitigation API Key will be required in the next releases. Get yours at https://mitigation.team

## Usage

```bash
name: WCAG Scanner
on:
  pull_request:
    types: [opened, synchronize, reopened]
permissions:
  pull-requests: write
  contents: read
jobs:
  scan:
    name: Accessibility Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22' # Specify your required Node version
          cache: 'pnpm'      # Automatically caches your pnpm store
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Run WCAG Scanner Action
        uses: mitigation-dot-team/wcag-scanner@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }} # Uses the automatic GH token
          path: "src/**/*.{html,ts}"
```

### How it works

The scanner will look for caveats such as:
```html
<img src="logo.png">

<div (click)="save()">
    Save
</div>

<input type="text">
```

After execution, the scanner will post a comment on the Pull Request, notifying what needs to be fixed or addressed before going to production.

```plain
login.component.html

✖ WCAG 1.1.1
Missing alt attribute on <img> tag
Line 4

✖ WCAG 2.1.1
Non-interactive element <div> with (click) handler missing role and/or tabindex
Line 9

✖ WCAG 3.3.2
Input of type "text" missing associated label or aria-label
Line 14
```

## Common rules

- Images without alt text.
- Inputs without labels.
- Buttons without accessible names.
- `<div>` or `<span>` with `(click)` handlers missing keyboard support.
- Headings (`h1–h6`) out of order.
- Elements with positive `tabindex`.
- Links without text.
- Invalid aria-* attributes.
- Duplicate IDs.
- Forms without accessible error messages.
- Tables without headers (`<th>`).
- iframes without a title.
- Empty headings.
- aria-hidden on interactive elements.
- Controls without focus indicators.
- Color contrast (when detectable).
- Required fields without accessible indicators.

## Roadmap

[ ] Slack notification
[ ] Custom rules
[ ] PR block
[ ] Performance improvement


Powered by [Mitigation dot Team](https://mitigation.team?utm_source=wcag_scanner_repository&utm_medium=comment&utm_campaign=wcag_scanner&utm_ref=github_action)