# premierproject

The Project Premier website: Vite, React and TypeScript, pre-rendered at build time so every page
ships as complete HTML.

## Build

```sh
npm install
npm run build
```

`npm run build` bundles the app, renders every page to static HTML, then writes `sitemap.xml`,
`rss.xml`, `llms.txt` and the 404 page (see `scripts/postbuild.mjs`).

## Search engine verification

Set these in Vercel (Project Settings, Environment Variables) and redeploy. Every page then carries
the matching meta tag.

| Variable | Where to get it |
| --- | --- |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console, add a URL-prefix property, choose "HTML tag", copy only the `content` value |
| `BING_SITE_VERIFICATION` | Bing Webmaster Tools, "HTML Meta Tag" option, copy only the `content` value |

After verifying, submit `https://premierproject.vercel.app/sitemap.xml` in both tools.

## Pages, titles and descriptions

All search metadata lives in `src/seo/pages.js` (title tags up to 60 characters, descriptions up to
160). Structured data is built in `src/seo/ld.js`.

## Writing a blog post

1. Add the post's details to `src/content/posts.js`: a slug, the question as the title, a description,
   and the dates.
2. Add its text to `src/content/post-bodies.js` under the same slug.
3. Make its share card: `python3 scripts/share-images.py` (needs `pip install pillow fonttools brotli`).
   The build stops if a post has no card.
4. Build. The post gets its page, sitemap entry, RSS item and llms.txt line automatically.

House rules: answer the question in the first paragraph, link outside facts to their official
source, never use em or en dashes, and keep every photo and logo in its true colours.

## Moving to projectpremier.org

The site URL is set once in `src/seo/ld.js` (`SITE_URL`) and repeated in `index.html`,
`public/robots.txt` and `public/llms.txt`. Change all four when the domain is connected.
