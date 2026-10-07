// @ts-check
/**
 * Blog posts: the details every page needs (titles, descriptions, dates). The article text lives in
 * post-bodies.js, which only the blog pages load. Plain JavaScript, so the app, the build-time
 * renderer and scripts/postbuild.mjs (page shells, sitemap, RSS feed) all read the same source.
 *
 * Writing rules: answer the question in the first paragraph; only state facts about Project Premier
 * that appear elsewhere on the site; link every outside fact to its official source; no em or en
 * dashes; plain words over marketing words.
 */

/**
 * @typedef {{ slug: string, title: string, seoTitle: string, description: string, excerpt: string, audience: string, date: string, updated: string, keywords: string[] }} Post
 */

/** @type {Post[]} */
export const POSTS = [
  {
    slug: "how-to-refer-a-young-person-to-project-premier",
    title: "How do I refer a young person to Project Premier?",
    seoTitle: "How do I refer a young person to Project Premier?",
    description:
      "For youth workers, schools, agencies and families in Toronto: what you need, how the referral form works, getting consent and what happens after you submit.",
    excerpt:
      "What you need before you start, how the referral form works, getting consent, and what happens after you press submit.",
    audience: "Youth workers, schools, agencies and families",
    date: "2026-10-06",
    updated: "2026-10-06",
    keywords: ["refer a youth Toronto", "youth referral form", "youth program referral GTA", "refer a young person to a music program"],
  },
  {
    slug: "where-can-young-artists-record-music-for-free-in-toronto",
    title: "Where can young artists record music for free in Toronto?",
    seoTitle: "Where can young artists record music for free in Toronto?",
    description:
      "Free places to record music in Toronto: Toronto Public Library hubs, City of Toronto youth spaces with studios, free home recording apps and studio training.",
    excerpt:
      "Library hubs, City youth spaces with recording studios, free apps for recording at home, and what to do when you want more than studio time.",
    audience: "Young artists",
    date: "2026-10-06",
    updated: "2026-10-06",
    keywords: ["free recording studio Toronto", "free studio time for youth Toronto", "where to record music Toronto", "youth recording studio Toronto"],
  },
  {
    slug: "what-do-you-learn-in-a-recording-arts-program",
    title: "What do you actually learn in a recording arts program?",
    seoTitle: "What do you actually learn in a recording arts program?",
    description:
      "The skills a recording arts program builds, from microphones and signal flow to editing and mixing, and what hands-on studio learning looks like in Toronto.",
    excerpt: "From microphones and signal flow to editing and mixing, plus the skills nobody writes on the syllabus.",
    audience: "Young artists and parents",
    date: "2026-10-06",
    updated: "2026-10-06",
    keywords: ["recording arts program Toronto", "audio engineering for youth", "music production program Toronto", "learn recording and mixing"],
  },
  {
    slug: "do-i-own-my-music-music-rights-for-young-artists-in-canada",
    title: "Do I own my music? Music rights basics for young artists in Canada",
    seoTitle: "Do I own my music? Music rights for young artists in Canada",
    description:
      "Plain answers for young artists in Canada: when you own a song, the two copyrights in every track, splits with co-writers, SOCAN, Re:Sound and contracts.",
    excerpt: "When you own a song, the two copyrights inside every track, splits with co-writers and producers, and how royalties reach you.",
    audience: "Young artists",
    date: "2026-10-06",
    updated: "2026-10-06",
    keywords: ["music copyright Canada", "do I own my music", "SOCAN for new artists", "music rights for young artists"],
  },
  {
    slug: "how-do-young-artists-make-money-from-music",
    title: "How do young artists actually make money from music?",
    seoTitle: "How do young artists actually make money from music?",
    description:
      "How young artists earn from music in Canada, from shows and streaming to royalties, sync, production work and grants, and how to run it like a business.",
    excerpt: "Shows, streaming, royalties, sync, production work, teaching and grants, and the business habits that tie them together.",
    audience: "Young artists",
    date: "2026-10-06",
    updated: "2026-10-06",
    keywords: ["how to make money from music", "music career for young artists", "music income Canada", "music business for youth Toronto"],
  },
  {
    slug: "can-a-music-program-help-a-teen-who-is-struggling",
    title: "Can a music program help a teen who is struggling?",
    seoTitle: "Can a music program help a teen who is struggling?",
    description:
      "For families and youth workers in Toronto: what a structured music program can offer a young person going through a hard time, and how to find the right fit.",
    excerpt: "What a structured music program can offer a young person going through a hard time, and how to tell if it could fit.",
    audience: "Families and youth workers",
    date: "2026-10-06",
    updated: "2026-10-06",
    keywords: ["programs for struggling teens Toronto", "music program for at-risk youth", "youth mentorship program Toronto", "help for teens on probation Toronto"],
  },
];

/** @param {string} slug */
export const postBySlug = (slug) => POSTS.find((p) => p.slug === slug);
