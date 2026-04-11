function escapeHtml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlShell({ title, description, body, pathToRoot = '.' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="alternate" type="application/rss+xml" title="RSS" href="${pathToRoot}/rss.xml">
  <link rel="stylesheet" href="${pathToRoot}/assets/style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="${pathToRoot}/index.html">Field Notes</a>
      <nav class="site-nav" aria-label="Primary">
        <a href="${pathToRoot}/index.html">Home</a>
        <a href="${pathToRoot}/rss.xml">RSS</a>
      </nav>
    </div>
  </header>
  ${body}
</body>
</html>`;
}

function formatCard(post, pathToRoot = '.') {
  return `<article class="post-card">
    <p class="eyebrow">${escapeHtml(post.dateDisplay)}</p>
    <h3><a href="${pathToRoot}${post.url}">${escapeHtml(post.title)}</a></h3>
    <p>${escapeHtml(post.description)}</p>
  </article>`;
}

function formatTextLink(post, pathToRoot = '.') {
  return `<li><a href="${pathToRoot}${post.url}">${escapeHtml(post.title)}</a> <span>${escapeHtml(post.dateDisplay)}</span></li>`;
}

export function renderIndex({ site, posts }) {
  const pathToRoot = '.';

  if (!posts || posts.length === 0) {
    return htmlShell({
      title: site.title,
      description: site.description,
      body: `<main id="main" class="wrap home-main"><p>No posts found.</p></main>`,
      pathToRoot
    });
  }

  const hero = posts[0];
  const rowPosts = posts.slice(1, 3);
  const linkPosts = posts.slice(3, 9);

  const body = `<main id="main" class="wrap home-main">
    <section class="hero" aria-labelledby="latest-post">
      <p class="section-label">Latest post</p>
      <article class="hero-post">
        <p class="eyebrow">${escapeHtml(hero.dateDisplay)}</p>
        <h1 id="latest-post"><a href="${pathToRoot}${hero.url}">${escapeHtml(hero.title)}</a></h1>
        <p class="hero-summary">${escapeHtml(hero.description)}</p>
      </article>
    </section>

    <section class="grid-two" aria-labelledby="recent-posts">
      <h2 id="recent-posts" class="section-heading">Recent posts</h2>
      <div class="card-grid">
        ${rowPosts.map(post => formatCard(post, pathToRoot)).join('')}
      </div>
    </section>

    <section class="text-list" aria-labelledby="archive-links">
      <h2 id="archive-links" class="section-heading">Earlier posts</h2>
      <ul>
        ${linkPosts.map(post => formatTextLink(post, pathToRoot)).join('')}
      </ul>
    </section>
  </main>`;

  return htmlShell({
    title: site.title,
    description: site.description,
    body,
    pathToRoot
  });
}

export function renderPost({ site, post, latestLinks }) {
  const pathToRoot = '../..';
  const body = `<main id="main" class="wrap article-layout">
    <article class="article-column">
      <p class="eyebrow">${escapeHtml(post.dateDisplay)}</p>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="article-summary">${escapeHtml(post.description)}</p>
      <div class="article-body">
        ${post.bodyHtml}
      </div>
    </article>

    <aside class="sidebar-column" aria-labelledby="latest-links">
      <div class="sidebar-box">
        <h2 id="latest-links">Latest posts</h2>
        <ul class="sidebar-links">
          ${latestLinks.map(post => formatTextLink(post, pathToRoot)).join('')}
        </ul>
      </div>
    </aside>
  </main>`;

  return htmlShell({
    title: `${post.title} · ${site.title}`,
    description: post.description,
    body,
    pathToRoot
  });
}
