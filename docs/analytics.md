# Website analytics

The portfolio uses [Umami Cloud](https://cloud.umami.is) for visitor analytics.
Open the dashboard for `calvinw.me` to see traffic, approximate country/region/city,
referrers, devices, browsers, languages, and page views. Location comes from the
visitor's IP address and can be inaccurate, particularly with VPNs or mobile networks.

The public website ID is `90daee70-0fea-4c34-8b4b-cd61fc052819`. It is embedded in
`src/app/layout.tsx`; no secret key or environment variable is required. Deploy
the code to production to start collection. It cannot recover earlier visits.

The script loads after hydration in production builds, is omitted from Vercel
preview deployments, and only sends events on `calvinw.me` or `www.calvinw.me`.
It respects the browser's Do Not Track setting. Ad blockers may also prevent
collection, so visitor counts are estimates.

Page views cover all portfolio versions. The current design also records:

- `resume_click`, `email_click`, `github_click`, `linkedin_click`: contact-link clicks.
- `entry_open`: opening an entry from the list, with its `entry` slug and `category`.
- `entry_link_click`: an entry's outgoing link, with its `entry` slug and `link` type.

Resume clicks do not confirm a download or reading; email clicks do not confirm
an email was sent. Direct links to an already-open entry count as page views,
not `entry_open` clicks. Filters and entry dialogs update the URL query, so
Umami can record those URL changes as additional page views. Query parameters
are retained, including UTM campaign tags; avoid putting personal information
in shared URLs. No custom visitor identity or session replay is configured.

## Verify after deployment

Visit `https://www.calvinw.me`, open a portfolio entry, and click the resume link.
In browser developer tools, confirm that `https://cloud.umami.is/script.js`
loads and that requests to `https://gateway.umami.is/api/send` succeed. Confirm
the visit and named events appear in the Umami dashboard. If your browser blocks
analytics or has Do Not Track enabled, no events may appear.

To exclude your own future visits, run `localStorage.setItem('umami.disabled', '1')`
in the browser console on your site and reload. To undo this, run
`localStorage.removeItem('umami.disabled')` and reload. This setting is per browser
and origin.

References: [tracking events](https://docs.umami.is/docs/track-events),
[tracker configuration](https://docs.umami.is/docs/tracker-configuration),
[metric definitions](https://docs.umami.is/docs/metric-definitions).
