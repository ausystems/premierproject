// @ts-check
/**
 * The article text of each blog post, keyed by slug (details in posts.js). Loaded with the blog pages.
 *
 * Blocks: { p }, { h2 }, { h3 }, { ul: [] }, { ol: [] }, { quote, cite }, { note }, { cta: "refer" | "contact" }.
 * Inline markup inside text: [label](href) for links and **bold** for emphasis.
 */

/**
 * @typedef {{ p?: string, h2?: string, h3?: string, ul?: string[], ol?: string[], quote?: string, cite?: string, note?: string, cta?: "refer" | "contact" }} Block
 */

/** @type {Record<string, Block[]>} */
export const BODIES = {
  "how-to-refer-a-young-person-to-project-premier": [
    {
      p: "**Short answer:** fill in the [referral form](/referral). It takes a few minutes. You share your own details and the young person's name and age, plus a phone number where they can be reached, then choose a reason for the referral and confirm you have their consent. Our team then contacts you and the young person about taking part.",
    },
    { h2: "Who can make a referral" },
    {
      p: "Referrals come from organizations and from individuals who know a young person and believe our programs could help. Youth workers, school staff, probation officers, community agencies and family members can all use the same form. The form asks for your job title or position. If you are a parent or guardian, say so there.",
    },
    {
      p: "Project Premier works with marginalized youth across the Greater Toronto Area. The reasons on the form cover a young person who is in conflict with the law, on probation, expelled, or missing school (truancy). There is also an **Other** option, so a referral never has to fit a box.",
    },
    { h2: "What you need before you start" },
    {
      ul: [
        "Consent from the young person, or from a parent or legal guardian if they are under 18.",
        "Their first and last name, and their age.",
        "A phone number where we can reach them.",
        "Your name or your organization's name and your job title or position. A phone number or email for you is optional, but it lets us follow up quickly.",
        "Anything that would help with placement, such as their interests, their goals or the best time to call. There is a notes box for this.",
      ],
    },
    { h2: "How to fill in the referral form" },
    {
      ol: [
        "Open the [referral form](/referral).",
        "Under **Referring organization**, enter your organization or your own name, and your job title or position.",
        "Under **Your contact details**, add the phone number and email where we can reach you with questions.",
        "Under **About the youth**, fill in the young person's details, including a phone number where they can be reached.",
        "Under **Reason for referral**, choose the reason that fits. If you choose Other, describe it in a few words.",
        "Add any notes, read the consent statement, and select **Submit Referral**.",
      ],
    },
    { h2: "Getting consent first" },
    {
      p: "Before you submit, the young person needs to agree to their information being shared with Project Premier. If they are under 18, consent comes from their parent or legal guardian. Submitting the form confirms that consent has been given.",
    },
    {
      p: "A short conversation makes the first call easier for everyone. Tell them what Project Premier is and that the programs cover [music, recording arts, life skills and business development](/programs). Let them know someone from our team will reach out to talk about taking part.",
    },
    { h2: "Tips for a referral that helps" },
    {
      ul: [
        "Mention what they are already into: writing lyrics, making beats, recording, performing, or the business side of music.",
        "Note when they are usually free. Sessions run on Fridays and Saturdays.",
        "Share the best way to reach them, and anything that makes a phone call easier or harder.",
        "Keep it factual and kind. The notes are there to help us support them well.",
      ],
    },
    { h2: "What happens after you submit" },
    {
      p: "You will see a confirmation that the referral has been received. From there, our team contacts the referring organization and the young person about program participation. Programs take place at 130 Queens Quay East on the Toronto waterfront.",
    },
    { p: "The information you share is used for these purposes, which are also listed on the referral page:" },
    {
      ul: [
        "Assessing eligibility and suitability for Project Premier programs.",
        "Contacting the referring organization and the referred youth about program participation.",
        "Program intake, scheduling and support services.",
        "Evaluating how well the programs work and reporting on them, in a de-identified way.",
      ],
    },
    { h2: "How the information is protected" },
    {
      p: "Project Premier handles personal information in line with the Personal Information Protection and Electronic Documents Act (PIPEDA) and, where it applies, Ontario's Freedom of Information and Protection of Privacy Act (FIPPA). Information is not shared with third parties without consent, except where the law requires it, and it is kept only as long as the program or the law needs it. The [privacy policy](/privacy) has the details.",
    },
    { h2: "Questions before you refer?" },
    {
      p: "Email [info@projectpremier.org](mailto:info@projectpremier.org). We typically respond within one to two business days. If the young person would rather reach out themselves, our address and hours are on the [contact page](/contact).",
    },
    { cta: "refer" },
  ],
  "where-can-young-artists-record-music-for-free-in-toronto": [
    {
      p: "**Short answer:** start with the City of Toronto's Enhanced Youth Spaces, which have recording studios and free music recording programs, and the Toronto Public Library's Digital Innovation Hubs, which offer free equipment with a library card. You can also get a long way at home with free apps. When you want hands-on studio training with professionals, that is what our [Recording Arts program](/programs) is for.",
    },
    { h2: "City of Toronto Enhanced Youth Spaces" },
    {
      p: "The City runs Enhanced Youth Spaces in community centres across Toronto. They are supervised spaces for young people, with amenities that include recording studios. The free programs the City lists include DJing and music recording, and some locations also run music engineering and artist development programs.",
    },
    {
      p: "Most spaces are open Monday to Friday from noon to 8 p.m., though some keep different hours, and age ranges depend on the program. The [City's youth spaces page](https://www.toronto.ca/explore-enjoy/parks-recreation/program-activities/youth-recreation/) has a table of every location with a contact name and phone number, so call ahead and ask when the studio is free.",
    },
    { h2: "Toronto Public Library Digital Innovation Hubs" },
    {
      p: "The library runs [Digital Innovation Hubs](https://tpl.ca/using-the-library/computer-services/digital-innovation-services/digital-innovation-hubs/) in 13 branches across the city. They are free to use for people of all ages with a library card, and they offer professional software alongside specialized equipment. Some hubs include recording spaces. The renovated York Woods branch, for example, [opened with a podcast recording studio](https://tpl.ca/news/revitalized-library-reopens-in-jane-and-finch-community-showcasing-new-services-and-innovative-featu/).",
    },
    {
      p: "Equipment differs from branch to branch and changes over time, so check the hub page or call the branch before you go. Library cards are free for Toronto residents.",
    },
    { h3: "Make the most of a booked session" },
    {
      ul: [
        "Bring your own headphones, and your beat or instrumental on a USB stick or in cloud storage.",
        "Warm up and run your lyrics before you arrive, so studio time goes on recording.",
        "Record several full takes, then the parts you want to fix.",
        "Save your project files and audio before you leave, with the date and song name in the file name.",
      ],
    },
    { h2: "Recording at home without spending money" },
    {
      p: "A quiet room and the phone or laptop you already have will take you further than you think. These free tools cover the basics:",
    },
    {
      ul: [
        "[GarageBand](https://www.apple.com/ca/mac/garageband/), free on Apple devices.",
        "[BandLab](https://www.bandlab.com/), a free app for recording and mixing in the browser or on your phone.",
        "[Audacity](https://www.audacityteam.org/), a free audio editor for Windows and Mac computers.",
        "Your phone's voice recorder, for catching ideas the moment they arrive.",
      ],
    },
    { h3: "Five ways to make a home recording sound better" },
    {
      ul: [
        "Record in a small room with soft things around you, like a closet full of clothes. They soak up echo.",
        "Keep the same distance from the microphone for every take, about a hand's width or two.",
        "Switch off fans and appliances, and silence your notifications.",
        "Record a few seconds of silence first, then listen back for hum or hiss before you start.",
        "Leave some room in your levels. If the meter hits the top, turn the input down and record again.",
      ],
    },
    { h2: "When you want more than studio time" },
    {
      p: "Free studio time is a great start. What it does not always come with is a professional in the room who can teach you as you go. At Project Premier, Recording Arts means hands-on experience in professional studios with top producers and engineers, and it sits beside our other programs, from songwriting to business, so the craft and the career grow together.",
    },
    {
      p: "Sessions run on Fridays and Saturdays at 130 Queens Quay East on the Toronto waterfront. If you have a youth worker or a teacher who knows your goals, they can [refer you](/referral). You can also [get in touch](/contact) yourself.",
    },
    { cta: "contact" },
  ],
  "what-do-you-learn-in-a-recording-arts-program": [
    {
      p: "**Short answer:** a recording arts program teaches how a song gets from a performance in a room to a finished track. You learn to set up and use microphones, run a recording session, edit takes in software and shape the sound in a mix. The best programs teach it hands-on in real studios, next to people who do the work professionally.",
    },
    { h2: "The building blocks" },
    { h3: "Signal flow" },
    {
      p: "Every recording follows a path: the microphone picks up the sound, a preamp raises it to a usable level, an audio interface turns it into data, and software records it. When something goes wrong in a session, knowing that path is how you find the problem in seconds instead of minutes.",
    },
    { h3: "Microphones and placement" },
    {
      p: "You learn why a dynamic microphone suits loud sources and live rooms, why a condenser catches more detail in a quiet booth, and how a few centimetres of distance or a small change of angle changes the sound. Placement is often the difference between a vocal that needs heavy fixing and one that already sounds finished.",
    },
    { h3: "Levels and headroom" },
    {
      p: "Recording too quietly adds noise. Recording too loudly distorts in a way you cannot undo. Programs teach you to set levels so the loudest moments still have room to spare, which keeps every later step easier.",
    },
    { h3: "Running a session" },
    {
      p: "A good engineer keeps a session moving. That means having the project ready before the artist arrives, setting up a headphone mix the artist is comfortable with, labelling tracks as you go, and knowing when to call for another take and when to move on.",
    },
    { h2: "Editing and production" },
    {
      p: "Once the audio is recorded, the work moves into a digital audio workstation (DAW) such as Pro Tools, Logic Pro, Ableton Live or FL Studio. The skills carry across all of them:",
    },
    {
      ul: [
        "Comping: building one strong performance from the best parts of several takes.",
        "Timing and tuning edits that stay natural.",
        "Arranging: when the drums drop out, when the hook comes back, how a song builds.",
        "File management and backups, so a lost drive never costs you a song.",
      ],
    },
    { h2: "Mixing basics" },
    {
      p: "Mixing is where separate recordings start to sound like one record. A first course usually covers:",
    },
    {
      ul: [
        "Balance and panning: how loud each part is, and where it sits from left to right.",
        "EQ: removing what muddies a sound and bringing out what makes it clear.",
        "Compression: keeping a performance consistent so it sits steadily in the mix.",
        "Reverb and delay: giving a dry recording a sense of space.",
        "Referencing: checking the mix on different speakers and headphones, and comparing it with songs you admire.",
      ],
    },
    {
      p: "Mastering is the final step that prepares a song for release. Many artists hand it to a specialist, but understanding what it does helps you deliver a mix that masters well.",
    },
    { h2: "The skills nobody writes on the syllabus" },
    {
      p: "Studios run on people skills as much as technical ones. You learn to listen closely and describe what you hear, to give and take notes without ego, to show up on time with your files in order, and to track who wrote and produced what, so credits and splits are clear later. Our guide to [music rights](/blog/do-i-own-my-music-music-rights-for-young-artists-in-canada) explains why that last one matters.",
    },
    { h2: "What it looks like at Project Premier" },
    {
      p: "Our Recording Arts program is hands-on experience in professional studios with top producers and engineers. It is one of four programs that work together: Music builds songwriting and performance, while Life Skills and Business Development cover what a sustainable career needs, from time management to marketing. Sessions take place on Fridays and Saturdays at 130 Queens Quay East on the Toronto waterfront.",
    },
    {
      quote: "Now, I'm in the studio, learning from real professionals and building a career in music.",
      cite: "Youth Voice, Project Premier",
    },
    {
      p: "To join, ask a youth worker or teacher to [refer you](/referral), or [contact us](/contact) directly. You can read more about each program on the [programs page](/programs).",
    },
    { cta: "refer" },
  ],
  "do-i-own-my-music-music-rights-for-young-artists-in-canada": [
    {
      note: "This guide is general information, not legal advice. For your own situation, speak with a lawyer. [Artists' Legal Advice Services](https://www.alasontario.ca/) offers free summary legal advice to creators living in Ontario.",
    },
    {
      p: "**Short answer:** in Canada, you own the copyright in an original song as soon as you create it and get it down in some lasting form, like a recording or written lyrics. You do not need to register it first. Most tracks, though, contain more than one copyright and often more than one owner, so the useful question is what exactly you own, and with whom.",
    },
    { h2: "Copyright is automatic" },
    {
      p: "Copyright exists as soon as an original work is created. Registering it with the [Canadian Intellectual Property Office](https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en/copyright) is optional. A registration certificate can serve as evidence if ownership is ever disputed, but even without one, dated drafts, session files, voice memos and messages with collaborators are all useful proof that a song is yours.",
    },
    { h2: "Every track holds two copyrights" },
    {
      ul: [
        "**The song** (the musical work): the melody and the lyrics. It belongs to whoever wrote it.",
        "**The recording** (the sound recording, often called the master): one particular recorded version of the song. It usually belongs to the person or company that arranged and paid for that recording.",
      ],
    },
    {
      p: "If you write a song and record it yourself, you likely own both. If a label or someone else pays for the recording, they may own the master while you keep your share of the song. Knowing which is which tells you what you are free to license or sign away.",
    },
    { h2: "Co-writers, producers and beats" },
    {
      ul: [
        "**Co-writers share the song.** Agree on the percentages before release and write them down. A one-page split sheet signed by everyone in the session is enough to start.",
        "**Producers can be co-writers.** If a producer creates music that is part of the song, they often share in it, depending on what you agree. Talk about it early, not after the song takes off.",
        "**A leased beat comes with limits.** A non-exclusive lease lets you use a beat under the terms in the licence, which can cap streams or sales and allows others to use the same beat. Read the terms before you release.",
        "**Exclusive rights cost more and give you more.** Get any exclusive deal in writing, with what you are buying spelled out.",
      ],
    },
    { h2: "How royalties reach you: SOCAN and Re:Sound" },
    {
      p: "Two Canadian organizations collect money when music is played in public, on the radio, on TV or online, and pay it to the people behind the music:",
    },
    {
      ul: [
        "[SOCAN](https://www.socan.com/) pays songwriters and music publishers when their songs are performed. Writers can join online at no cost once a song of theirs has been released or performed in public, and members register each song they write.",
        "[Re:Sound](https://www.resound.ca/) collects for performers and for the makers of sound recordings when those recordings are broadcast or played in public. These are often called neighbouring rights.",
      ],
    },
    {
      p: "Money from streams and downloads of the recording itself usually reaches the owner of the master through a digital distributor. Read any distributor's terms before you upload, so you know what you keep and what you pay.",
    },
    { h2: "How long copyright lasts" },
    {
      p: "In Canada, copyright in a song generally lasts for the life of its author plus 70 years after the end of the year they die. Canada extended the term from 50 to 70 years in 2022.",
    },
    { h2: "Before you sign anything" },
    {
      ul: [
        "Read every page, and ask about anything you do not understand.",
        "Find out which rights you are giving, and for how long.",
        "Know how and when you get paid, and what has to happen first.",
        "Ask whether, and when, rights come back to you.",
        "Get advice before you sign, and keep a copy of everything.",
      ],
    },
    {
      quote:
        "This program taught me the importance of owning my music rights and understanding copyright. I also learned how to manage my music and release the right content to grow.",
      cite: "Youth Voice, Project Premier",
    },
    { h2: "Learning the business side at Project Premier" },
    {
      p: "Our Business Development program covers entrepreneurship, branding, marketing and financial management, so the young artists we work with can protect what they make and build a sustainable career from it. See all four programs on the [programs page](/programs), or read how young artists [earn money from music](/blog/how-do-young-artists-make-money-from-music).",
    },
    { cta: "contact" },
  ],
  "how-do-young-artists-make-money-from-music": [
    {
      p: "**Short answer:** most working musicians earn from several small streams rather than one big one. Live shows, streaming and sales, royalties, licensing music for film and TV, producing or engineering for other artists, teaching, merch and grants can all add up. The skill that ties them together is running your music like a small business.",
    },
    { h2: "Live performance" },
    {
      p: "Shows are often the first real money an artist makes, and the best way to turn listeners into fans. Start where you can play regularly and learn to put on a tight set. Keep track of who books you, so one good show leads to the next.",
    },
    { h2: "Streaming and sales" },
    {
      p: "A digital distributor places your music on streaming services and stores and passes on the income from your recordings. Streaming pays a small amount per play, so it grows with your audience. Releasing music consistently tends to matter more than waiting for one perfect song.",
    },
    { h2: "Royalties you may be missing" },
    {
      p: "If you write songs, join [SOCAN](https://www.socan.com/) and register them, so you are paid when your songs are performed in public, on air or online. If you perform on recordings or own your masters, [Re:Sound](https://www.resound.ca/) collects another kind of royalty when those recordings are broadcast or played in public. Our guide to [music rights in Canada](/blog/do-i-own-my-music-music-rights-for-young-artists-in-canada) explains the difference.",
    },
    { h2: "Sync licensing" },
    {
      p: "Sync means licensing your music for film, TV, advertising or games. It can pay well, but buyers need music they can clear quickly, so you need clean ownership of both the song and the recording, with every co-writer and producer agreed in writing.",
    },
    { h2: "Selling your skills" },
    {
      p: "The skills you build making your own music are valuable to other artists. Producing beats, recording and mixing, playing on sessions, and teaching lessons or workshops all bring in income while you grow your own catalogue. They also build relationships, which is where many opportunities come from.",
    },
    { h2: "Merch and direct support" },
    {
      p: "Fans who love your music often want a way to support you directly. Merch at shows and online helps, and so does a simple email list that you own, because it keeps you connected to fans no matter which platform is popular next year.",
    },
    { h2: "Grants for music projects" },
    {
      p: "Public and non-profit funders in Canada support music projects such as recordings and tours, including [FACTOR](https://www.factor.ca/), the [Canada Council for the Arts](https://canadacouncil.ca/), the [Ontario Arts Council](https://www.arts.on.ca/) and the [Toronto Arts Council](https://torontoartscouncil.org/). Each has its own eligibility rules and deadlines, so read the guidelines carefully and give yourself time to write a strong application.",
    },
    { h2: "Run it like a business" },
    {
      ul: [
        "**Know your brand:** what your music stands for and how it looks and sounds everywhere you show up.",
        "**Own your audience:** collect emails and phone numbers, not just followers.",
        "**Track every dollar:** income from music is taxable, so keep records of what comes in and what you spend.",
        "**Set money aside** for taxes and for your next release.",
        "**Put agreements in writing:** splits, features, beat licences and bookings.",
      ],
    },
    { h2: "Where Project Premier comes in" },
    {
      p: "Our Business Development program covers entrepreneurship, branding, marketing and financial management, and Life Skills builds the habits behind them, like time management and financial literacy. Together with Music and Recording Arts, they give young artists across the GTA both the craft and the business sense a career needs.",
    },
    {
      quote:
        "Before Project Premier, my past made breaking into the music industry feel impossible. This program gave me the education, guidance, and hands-on experience I needed.",
      cite: "Youth Voice, Project Premier",
    },
    {
      p: "Explore the [programs](/programs), or ask a youth worker or teacher to [refer you](/referral).",
    },
    { cta: "refer" },
  ],
  "can-a-music-program-help-a-teen-who-is-struggling": [
    {
      note: "If a young person is in crisis or thinking about harming themselves, get help now. [Kids Help Phone](https://kidshelpphone.ca/) is free and available 24/7: call [1-800-668-6868](tel:18006686868) or text CONNECT to 686868. Anyone in Canada can also call or text [9-8-8](tel:988), the [Suicide Crisis Helpline](https://988.ca/). In an emergency, call [911](tel:911).",
    },
    {
      p: "**Short answer:** it can, when the program is built for it. A good music program gives a young person a reason to show up, adults who take their ideas seriously, skills they can see improving, and peers working toward the same goal. It does not replace counselling or treatment, but it can sit alongside them and give a young person something real to work toward.",
    },
    { h2: "What a structured program offers" },
    { h3: "A reason to show up" },
    {
      p: "Regular sessions on set days give the week a shape. For a young person who has been out of school or out of routine, that structure is often the first thing that changes.",
    },
    { h3: "Mentors who have done it" },
    {
      p: "Working with professionals who make music for a living matters. Young people can tell when an adult respects their work, and that respect makes feedback easier to hear.",
    },
    { h3: "Progress you can hear" },
    {
      p: "A finished song is proof of progress. Hearing your own work improve from one month to the next builds a kind of confidence that is hard to get any other way.",
    },
    { h3: "People who get it" },
    {
      p: "Collaborating with other young creators turns a solitary hobby into a community, and community is often what keeps young people coming back.",
    },
    { h3: "A path forward" },
    {
      p: "When music is paired with life skills and business education, a passion becomes a plan, with real options for work and further training.",
    },
    { h2: "Signs it could be a good fit" },
    {
      ul: [
        "They already write lyrics, make beats or record on their phone.",
        "They learn better by doing than by sitting in a classroom.",
        "They have had a setback at school or with the law, and need a fresh start.",
        "They are curious about careers in music or business.",
        "They need a goal that belongs to them.",
      ],
    },
    { h2: "How to bring it up" },
    {
      p: "Lead with their interest, not the problem. Ask what they would make if they had a real studio and people to learn from. Show them what other young people say about the program. Let them ask questions directly, and if you are a youth worker or teacher, offer to make the referral together so it feels like their decision.",
    },
    { h2: "What young people tell us" },
    {
      quote:
        "Project Premier changed my life. I went from feeling lost to having a real plan for my future.",
      cite: "Youth Voice, Project Premier",
    },
    {
      quote:
        "Being surrounded by other artists gave me a strong sense of collaboration. This experience helped me gain both knowledge and confidence in my career.",
      cite: "Youth Voice, Project Premier",
    },
    { h2: "How Project Premier works" },
    {
      p: "Project Premier works with marginalized youth across the Greater Toronto Area, giving them the mentorship and opportunities they need to succeed. Our programs cover [music, recording arts, life skills and business development](/programs), with sessions on Fridays and Saturdays at 130 Queens Quay East on the Toronto waterfront.",
    },
    {
      p: "Young people can come to us through a referral from a youth worker, school, probation officer, agency or family member. You can [refer a young person](/referral) in a few minutes. If you have questions first, read our [step-by-step referral guide](/blog/how-to-refer-a-young-person-to-project-premier) or [contact us](/contact).",
    },
    { cta: "refer" },
  ],
};

/** Plain text of inline markup: links keep their label, emphasis markers are dropped. */
export const plainText = (/** @type {string} */ text) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");

/** Reading time in minutes, at 220 words a minute. */
export const readingMinutes = (/** @type {string} */ slug) => {
  const words = (BODIES[slug] || [])
    .flatMap((b) => [b.p, b.h2, b.h3, b.quote, b.note, ...(b.ul || []), ...(b.ol || [])])
    .filter(Boolean)
    .map((t) => plainText(/** @type {string} */ (t)))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
};
