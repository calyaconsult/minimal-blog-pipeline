import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import RSS from 'rss';
import { renderIndex, renderPost } from './templates/page.js';

const ROOT = process.cwd();
const CONTENT_FILE = path.join(ROOT, 'content', 'posts.md');
const DIST_DIR = path.join(ROOT, 'dist');
const POSTS_DIR = path.join(DIST_DIR, 'posts');
const ASSETS_DIR = path.join(ROOT, 'assets');
const SITE = {
  title: 'Field Notes',
  description: 'A static blog generated from one Markdown file.',
  siteUrl: 'https://example.com',
  language: 'en',
  author: 'Your Name'
};

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function splitPostsFile(raw) {
  return raw
    .split(/\n<!-- POST-SEPARATOR -->\n/g)
    .map(block => block.trim())
    .filter(Boolean);
}

function toIsoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${value}`);
  return date;
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function loadPosts() {
  const raw = await fs.readFile(CONTENT_FILE, 'utf8');
  const blocks = splitPostsFile(raw);

  const posts = blocks.map((block, index) => {
    const parsed = matter(block);
    const title = parsed.data.title?.trim();
    const slug = parsed.data.slug?.trim();
    const description = parsed.data.description?.trim() || '';
    const date = parsed.data.date;

    if (!title || !slug || !date) {
      throw new Error(`Post ${index + 1} is missing title, slug, or date.`);
    }

    const published = toIsoDate(date);
    return {
      title,
      slug,
      description,
      date: published,
      dateDisplay: published.toLocaleDateString('en-CH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      bodyHtml: md.render(parsed.content),
      excerpt: description,
      url: `/posts/${slug}/`
    };
  });

  const seen = new Set();
  for (const post of posts) {
    if (seen.has(post.slug)) throw new Error(`Duplicate slug: ${post.slug}`);
    seen.add(post.slug);
  }

  return posts.sort((a, b) => b.date - a.date);
}

async function ensureCleanDist() {
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(POSTS_DIR, { recursive: true });
  await fs.cp(ASSETS_DIR, path.join(DIST_DIR, 'assets'), { recursive: true });
}

async function writeIndex(posts) {
  const html = renderIndex({ site: SITE, posts });
  await fs.writeFile(path.join(DIST_DIR, 'index.html'), html, 'utf8');
}

async function writePosts(posts) {
  for (const post of posts) {
    const latestLinks = posts.filter(p => p.slug !== post.slug).slice(0, 8);
    const html = renderPost({ site: SITE, post, latestLinks });
    const dir = path.join(POSTS_DIR, post.slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), html, 'utf8');
  }
}

async function writeRss(posts) {
  const feed = new RSS({
    title: SITE.title,
    description: SITE.description,
    feed_url: `${SITE.siteUrl}/rss.xml`,
    site_url: SITE.siteUrl,
    language: SITE.language,
    managingEditor: SITE.author,
    webMaster: SITE.author,
    pubDate: posts[0]?.date,
    ttl: 60
  });

  for (const post of posts) {
    feed.item({
      title: post.title,
      description: escapeXml(post.description),
      url: `${SITE.siteUrl}${post.url}`,
      guid: `${SITE.siteUrl}${post.url}`,
      date: post.date,
      author: SITE.author
    });
  }

  await fs.writeFile(path.join(DIST_DIR, 'rss.xml'), feed.xml({ indent: true }), 'utf8');
}

async function build() {
  const posts = await loadPosts();
  await ensureCleanDist();
  await writeIndex(posts);
  await writePosts(posts);
  await writeRss(posts);
  console.log(`Built ${posts.length} posts.`);
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});
