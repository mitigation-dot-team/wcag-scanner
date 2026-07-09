# Mitigation dot Team - WCAG Scanner


## Usage

```bash
# Register commands in package.json
npm run scan -- src/app/login/login.component.html
npm run scan -- "src/**/*.html"
npm run scan -- src/app/user.component.ts
npm run scan -- demo.html --fix
```

### Example

```html
<img src="logo.png">

<div (click)="save()">
    Save
</div>

<input type="text">
```

After execution

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

