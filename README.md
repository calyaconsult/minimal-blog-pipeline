# Minimal Blog Pipeline

A minimal, zero-framework static blog pipeline built with Node.js. It compiles an entire collection of blog posts authored in a single Markdown file (`content/posts.md`) into a static, fast, responsive blog with RSS 2.0 feed generation.

---

## Features

- **Single-File Content Authoring:** Store all your blog posts in one Markdown file (`content/posts.md`), separated cleanly by `<!-- POST-SEPARATOR -->`.
- **Zero Frontend Frameworks:** Rendered using simple, transparent JavaScript template literals without client-side JavaScript or bulky runtime dependencies.
- **Editorial Typography & Styling:** Clean, readable typography using Source Serif 4 and Inter, styled with responsive custom CSS.
- **Static HTML Output:** Generates self-contained static HTML pages in `dist/` ready to be deployed to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any static web server.
- **Automatic RSS Feed:** Builds a compliant `rss.xml` feed from your posts.
- **Post Layouts:**
  - **Homepage (`dist/index.html`):** Features a hero section for the latest post, a 2-column card grid for recent posts, and an archive list for earlier articles.
  - **Article Pages (`dist/posts/<slug>/index.html`):** Clean reading column paired with a sticky sidebar displaying links to latest articles.

---

## Project Structure

```text
minimal-blog-pipeline/
├── assets/
│   └── style.css          # Site stylesheet copied directly into dist/assets/
├── content/
│   └── posts.md           # Single markdown source file containing all posts
├── dist/                  # Generated static site output (HTML, assets, RSS)
│   ├── assets/
│   │   └── style.css
│   ├── index.html
│   ├── posts/
│   │   └── <slug>/
│   │       └── index.html
│   └── rss.xml
├── src/
│   ├── templates/
│   │   └── page.js        # HTML template functions for index and post pages
│   └── build.js           # Static site build generator script
└── README.md
```

---

## Prerequisites

- **Node.js** (v18 or higher recommended; Node v20+ with ES Module support)
- **npm** or your preferred package manager

---

## Getting Started

### 1. Install Dependencies

The build script relies on the following packages:
- [`gray-matter`](https://github.com/jonschlinkert/gray-matter) for YAML front matter extraction
- [`markdown-it`](https://github.com/markdown-it/markdown-it) for Markdown parsing and HTML rendering
- [`rss`](https://github.com/dylang/node-rss) for RSS 2.0 XML feed generation

If you are initializing or installing dependencies in the repository, you can install them using:

```bash
npm install gray-matter markdown-it rss
```

### 2. Build the Static Site

Run the build script:

```bash
node src/build.js
```

This will:
1. Parse all post entries in `content/posts.md`.
2. Clean and recreate the `dist/` directory.
3. Copy `assets/` into `dist/assets/`.
4. Generate `dist/index.html`.
5. Generate individual post pages at `dist/posts/<slug>/index.html`.
6. Generate the RSS feed at `dist/rss.xml`.

---

## Authoring Posts

All posts live inside `content/posts.md`. Each post begins with YAML front matter and entries are separated by `<!-- POST-SEPARATOR -->`.

### Post Format Example

```markdown
---
title: "Your Post Title"
date: "2026-04-10"
slug: "your-post-slug"
description: "A short summary describing your article."
---

Your post body in Markdown format here.

## Subheading

- Bullet points
- More text...

<!-- POST-SEPARATOR -->

---
title: "Another Post Title"
date: "2026-04-05"
slug: "another-post-slug"
description: "Description of the earlier article."
---

Content for the next article...
```

### Front Matter Fields

| Field | Required | Description |
|---|---|---|
| `title` | **Yes** | The title of the blog post. |
| `slug` | **Yes** | Unique URL identifier (determines the folder in `/posts/<slug>/`). |
| `date` | **Yes** | ISO-compatible publication date string (e.g., `YYYY-MM-DD`). |
| `description` | No | Short excerpt or summary displayed on index and sidebar links. |

---

## Configuration

Site metadata is configured in `src/build.js`:

```javascript
const SITE = {
  title: 'Field Notes',
  description: 'A static blog generated from one Markdown file.',
  siteUrl: 'https://example.com',
  language: 'en',
  author: 'Your Name'
};
```

Update these values to match your site title, author name, and domain URL.

---

## Previewing Locally

You can preview the generated site locally using any static web server:

```bash
npx serve dist
# or
python3 -m http.server -d dist 8080
```

Open `http://localhost:8080` (or the port indicated) in your browser.

---

## License

MIT (or your preferred open-source license).
