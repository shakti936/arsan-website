/**
 * What /studio shows before a Sanity project exists.
 *
 * The two commands below need a browser login, so they cannot be run for
 * whoever is reading this — which is precisely why the instructions belong on
 * the page rather than in a doc. Deliberately plain: this is a dev-time
 * scaffold, it is `noindex`, and it must not depend on the site's fonts or
 * design tokens, because it renders outside the locale layout that provides
 * them.
 */
const STEPS: [string, string][] = [
  ["Authenticate with Sanity", "bunx sanity login"],
  [
    "Create the project and write its ids to .env.local",
    "bunx sanity init --env .env.local",
  ],
  ["Restart the dev server", "bun run dev"],
];

export function StudioSetup() {
  return (
    <main
      style={{
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        maxWidth: "44rem",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        color: "#061e39",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.5rem" }}>
        Sanity Studio is not connected yet
      </h1>
      <p style={{ margin: "0 0 2rem", color: "#0d2a4d" }}>
        The schema is in the repo and the site is running on its in-repo
        content. Three steps connect them. The first opens a browser, so it has
        to be run by a person.
      </p>
      <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
        {STEPS.map(([label, command]) => (
          <li key={command} style={{ marginBottom: "1.25rem" }}>
            {label}
            <pre
              style={{
                background: "#f2efec",
                padding: "0.75rem 1rem",
                overflowX: "auto",
                margin: "0.5rem 0 0",
                fontSize: "0.875rem",
              }}
            >
              <code>{command}</code>
            </pre>
          </li>
        ))}
      </ol>
      <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#163a63" }}>
        Nothing breaks in the meantime —{" "}
        <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> being unset is a supported
        state, and every page keeps rendering from <code>src/content/</code>.
      </p>
    </main>
  );
}
