import Image from "next/image";
import Link from "next/link";
import { Arrow, IkatPanel, JaliPanel, PatternBand, SunRays, WheelMotif } from "@/components/art/Ornaments";
import { Skyline } from "@/components/art/Skyline";
import { dishes, experienceNotes, landStories } from "@/content/home";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${site.name} | ${site.tagline}`,
  description:
    "1947 – The Odia Diner is a restaurant celebrating the food, craft and hospitality of Odisha, India. Opening soon. Discover Odia cuisine, culture and our story.",
  path: "/",
});

/** A line of display type that rises from behind a mask. */
function Line({ children, delay, hero }: { children: React.ReactNode; delay?: number; hero?: boolean }) {
  return (
    <span className={`mask ${hero ? "hero-rise" : ""}`} style={hero ? ({ "--d": `${delay ?? 0}s` } as React.CSSProperties) : undefined}>
      <span data-rise={hero ? undefined : ""}>{children}</span>
    </span>
  );
}

function Glyph({ kind }: { kind: (typeof landStories)[number]["glyph"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true, focusable: false } as const;
  switch (kind) {
    case "temple":
      return (
        <svg viewBox="0 0 120 120" className="h-24 w-24" {...common}>
          <path d="M44 100 C44 70 50 46 56 34 L64 34 C70 46 76 70 76 100 Z" />
          <ellipse cx="60" cy="31" rx="10" ry="3" />
          <path d="M60 28 V12 M60 12 l12 3 l-10 3" />
          <path d="M20 100 H100 M30 100 V86 H44 M90 100 V86 H76" />
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 120 120" className="h-24 w-24" {...common}>
          <circle cx="60" cy="40" r="14" />
          <path d="M10 70 q12 -12 25 0 t25 0 t25 0 t25 0" />
          <path d="M10 88 q12 -12 25 0 t25 0 t25 0 t25 0" />
          <path d="M10 106 q12 -12 25 0 t25 0 t25 0 t25 0" />
        </svg>
      );
    case "loom":
      return <IkatPanel className="h-28 w-28" />;
    case "pot":
      return (
        <svg viewBox="0 0 120 120" className="h-24 w-24" {...common}>
          <path d="M26 56 H94 C94 88 80 102 60 102 C40 102 26 88 26 56 Z" />
          <path d="M22 56 H98" />
          <path d="M44 44 q-6 -10 0 -20 M60 44 q-6 -10 0 -20 M76 44 q-6 -10 0 -20" />
        </svg>
      );
  }
}

const cardTone = ["bg-terracotta", "bg-olive-deep", "bg-cocoa", "bg-terracotta-deep"];

export default function HomePage() {
  return (
    <>
      {/* ═════════ ACT I — THE INVOCATION ═════════ */}
      <section
        aria-labelledby="hero-title"
        data-parallax-root
        className="grain grain-dark relative isolate flex min-h-svh items-center overflow-hidden bg-cocoa text-ivory"
      >
        {/* Sky glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 70% at 50% 108%, rgba(229,164,78,.55) 0%, rgba(168,62,36,.45) 32%, rgba(40,22,15,0) 66%), linear-gradient(180deg,#1b0d08 0%,#28160f 55%,#3a1f14 100%)",
          }}
        />
        <div
          aria-hidden="true"
          data-parallax="0.05"
          className="absolute bottom-[-18vmin] left-1/2 -z-10 aspect-square w-[88vmin] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, #f0c27f 0%, #e5a44e 38%, rgba(229,164,78,0) 68%)", opacity: 0.55 }}
        />

        {/* Skyline depth layers */}
        <Skyline layer="far" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[25vh] min-h-32 w-full opacity-90" />
        <div data-parallax="0.07" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10">
          <Skyline layer="mid" className="h-[20vh] min-h-28 w-full" />
        </div>
        <Skyline layer="near" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[10vh] min-h-12 w-full" />

        <div className="wrap grid items-center gap-10 pb-[24vh] pt-28 md:pb-[26vh] lg:grid-cols-12 lg:gap-6">
          {/* Medallion */}
          <div className="relative mx-auto w-[min(62vw,19rem)] lg:order-2 lg:col-span-5 lg:w-[min(36vw,30rem)] lg:justify-self-end">
            <SunRays className="hero-rays absolute left-1/2 top-1/2 -z-10 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 text-saffron/25" />
            <div className="hero-medallion rounded-full bg-ivory p-[3%] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(229,164,78,0.5)]">
              <Image
                src="/brand/1947-logo.png"
                alt="1947 – The Odia Diner emblem: a Kalinga-style temple against a rising sun above the numerals 1947 and a lotus"
                width={1254}
                height={1254}
                priority
                sizes="(min-width:1024px) 30rem, 62vw"
                className="h-auto w-full rounded-full"
              />
            </div>
          </div>

          {/* Headline */}
          <div className="lg:order-1 lg:col-span-7">
            <p className="hero-fade t-eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 text-saffron" style={{ "--d": "0.05s" } as React.CSSProperties}>
              <span className="inline-block rounded-full border border-saffron/70 px-3 py-1">Opening Soon</span>
              <span>Odisha, India</span>
            </p>
            <h1 id="hero-title" className="t-display mt-6 !text-[clamp(3rem,1.4rem+4.6vw,6.6rem)] text-ivory">
              <Line hero delay={0}>A Culinary Ode</Line>
              <Line hero delay={0.08}>
                to <em className="font-medium italic text-saffron">Odisha.</em>
              </Line>
            </h1>
            <p lang="or" className="hero-fade mt-5 text-xl text-saffron-soft md:text-2xl" style={{ "--d": "0.25s" } as React.CSSProperties}>
              ଓଡ଼ିଶାର ସ୍ୱାଦ
            </p>
            <p className="hero-fade t-lead mt-6 max-w-xl text-ivory/85" style={{ "--d": "0.3s" } as React.CSSProperties}>
              1947 – The Odia Diner is a restaurant celebrating the food, craft and hospitality of Odisha. We are
              preparing to open; our location and opening date will be announced here.
            </p>
            <div className="hero-fade mt-9 flex flex-wrap gap-4" style={{ "--d": "0.4s" } as React.CSSProperties}>
              <Link href="/#the-land" className="btn btn-saffron">
                Discover Our Story <Arrow className="arrow" />
              </Link>
              <Link href="/#the-flavours" className="btn btn-ghost-light">
                Explore Our Menu <Arrow className="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ ACT II — THE LAND ═════════ */}
      <section id="the-land" aria-labelledby="land-title" className="section on-ivory bg-ivory">
        <div className="wrap">
          <PatternBand id="land-band" className="mb-16 text-terracotta/45 md:mb-24" />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="t-eyebrow text-terracotta">Act II · The Land</p>
              <h2 id="land-title" className="t-h2 mt-5">
                <Line>Between the temple</Line>
                <Line>
                  and the <em className="italic text-terracotta">sea.</em>
                </Line>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-10" data-reveal>
              <p className="t-lead">
                Odisha, on India’s eastern coast, is a land of ancient temple towns, a vast coastal lagoon, hand-woven
                textiles and a gentle, deeply seasonal cuisine. 1947 – The Odia Diner takes its cue from this
                landscape.
              </p>
              <p className="mt-5 text-cocoa/75">
                What follows is context, not a claim: a short orientation to the culture that Odia food comes from.
              </p>
            </div>
          </div>
        </div>

        <ul className="rail mt-16 md:mt-24" tabIndex={0} aria-label="Stories of the land — scroll sideways">
          {landStories.map((s, i) => (
            <li key={s.kicker} className="list-none" data-reveal data-delay={i * 0.08}>
              <article className="flex h-full flex-col overflow-hidden bg-ivory-deep">
                <div className={`${cardTone[i]} flex h-44 items-center justify-center text-saffron-soft`}>
                  <Glyph kind={s.glyph} />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="t-eyebrow text-terracotta">{s.kicker}</p>
                  <h3 className="t-h3 mt-3">{s.title}</h3>
                  <p className="mt-4 text-[0.97rem] text-cocoa/80">{s.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ═════════ ACT III — THE FLAVOURS ═════════ */}
      <section id="the-flavours" aria-labelledby="flavours-title" className="section grain grain-dark overflow-hidden bg-terracotta text-ivory">
        <WheelMotif className="pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] text-ivory/10" />
        <div className="wrap relative z-10">
          <p className="t-eyebrow text-saffron-soft">Act III · The Flavours</p>
          <h2 id="flavours-title" className="t-h2 mt-5 max-w-3xl">
            <Line>Flavours of the</Line>
            <Line>
              <em className="italic text-saffron-soft">Odia</em> table.
            </Line>
          </h2>
          <p className="t-lead mt-8 max-w-2xl text-ivory/90" data-reveal>
            Six traditions that define Odia home cooking. They are the cuisine that inspires 1947 —{" "}
            <strong className="font-semibold">not our menu</strong>, which will be published once it is finalised.
          </p>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {dishes.map((d, i) => (
              <li key={d.name} className="list-none" data-reveal data-delay={(i % 3) * 0.08}>
                <article className="dish flex h-full flex-col bg-cocoa p-8 text-ivory">
                  <p className="t-eyebrow text-saffron">{d.tag}</p>
                  <p lang="or" aria-hidden="true" className="dish-glyph mt-8 text-6xl leading-tight text-ivory/90 md:text-7xl">
                    {d.odia}
                  </p>
                  <h3 className="t-h3 mt-6">
                    {d.name} <span lang="or" className="sr-only">{d.odia}</span>
                  </h3>
                  <p className="mt-4 text-[0.97rem] text-ivory/75">{d.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════════ ACT IV — THE EXPERIENCE ═════════ */}
      <section id="the-experience" aria-labelledby="experience-title" className="section on-ivory bg-ivory">
        <div className="wrap">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="t-eyebrow text-terracotta">Act IV · The Experience</p>
              <h2 id="experience-title" className="t-h2 mt-5">
                <Line>The room is being</Line>
                <Line>
                  made <em className="italic text-terracotta">ready.</em>
                </Line>
              </h2>
              <p className="t-lead mt-8" data-reveal>
                Photography of our dining room and hospitality will appear here after we open. Until then, these
                panels are brand-inspired illustrations of the palette and craft that guide 1947 — they are{" "}
                <strong className="font-semibold">not pictures of our premises</strong>.
              </p>
              <dl className="mt-10 space-y-6">
                {experienceNotes.map((n) => (
                  <div key={n.title} className="border-t border-cocoa/15 pt-5" data-reveal>
                    <dt className="t-h3 !text-2xl">{n.title}</dt>
                    <dd className="mt-1 text-cocoa/75">{n.body}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:col-span-7" role="group" aria-label="Brand-inspired illustrations">
              <figure data-wipe className="relative col-span-2 aspect-[16/9] overflow-hidden bg-cocoa text-saffron/70">
                <JaliPanel className="absolute inset-0 h-full w-full" />
                <figcaption className="absolute bottom-3 left-3 bg-cocoa/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory">
                  Illustration · Lattice motif
                </figcaption>
              </figure>
              <figure data-wipe className="relative aspect-square overflow-hidden bg-olive-deep text-ivory/80">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <WheelMotif className="h-full w-full" />
                </div>
                <figcaption className="absolute bottom-3 left-3 bg-cocoa/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory">
                  Illustration · Wheel
                </figcaption>
              </figure>
              <figure data-wipe className="relative aspect-square overflow-hidden bg-saffron text-terracotta-deep">
                <IkatPanel className="absolute inset-0 h-full w-full opacity-80" />
                <figcaption className="absolute bottom-3 left-3 bg-cocoa/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory">
                  Illustration · Ikat
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ ACT V — THE INVITATION ═════════ */}
      <section id="the-invitation" aria-labelledby="invitation-title" className="section grain grain-dark overflow-hidden bg-olive-deep text-ivory">
        <div className="wrap relative z-10">
          <p className="t-eyebrow text-saffron-soft">Act V · The Invitation</p>
          <h2 id="invitation-title" className="t-display mt-5 !text-[clamp(3rem,1.5rem+7vw,8rem)]">
            <Line>
              Opening <em className="italic text-saffron-soft">soon.</em>
            </Line>
          </h2>
          <p className="t-lead mt-8 max-w-2xl text-ivory/90" data-reveal>
            We will share our address, opening date and ways to reach us here as soon as they are confirmed — nothing
            is shown until it is real.
          </p>

          <dl className="mt-14 grid gap-px bg-ivory/20 sm:grid-cols-3">
            {[
              ["Opening date", "To be announced"],
              ["Location", `${site.region} — city and address to be announced`],
              ["Enquiries", "Contact details will be published here"],
            ].map(([k, v]) => (
              <div key={k} className="bg-olive-deep p-8" data-reveal>
                <dt className="t-eyebrow text-saffron-soft">{k}</dt>
                <dd className="t-h3 mt-4 !text-[1.6rem]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
