import Link from "next/link";
import { BiryaniLogo, ThaliLogo, TristarWordmark } from "@/components/brand/Logos";
import { Arrow, HandiArt, SamosaArt, ThaliArt } from "@/components/scenes/Art";
import { brands, dishes, experienceLines } from "@/content/home";
import { addressLine, site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${site.name} Jharsuguda | Biryani, Samosa & Thali`,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* ═════════ SCENE 01 — THE ARRIVAL ═════════ */}
      <section aria-labelledby="hero-title" className="hero grain">
        <div className="atmos" aria-hidden="true">
          <div className="heat" />
          <div className="steam">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="slash" />
          <div className="ring" />
        </div>

        <div className="wrap hero-inner">
          <TristarWordmark neon className="hero-sign" />

          <h1 id="hero-title" className="hero-words">
            <span className="sr-only">TRISTAR Jharsuguda: </span>
            <Link href="/#biryani" className="hw hw-biryani f-biryani">
              Biryani
            </Link>
            <Link href="/#samosa" className="hw hw-samosa f-samosa">
              Samosa
            </Link>
            <Link href="/#thali" className="hw hw-thali f-thali">
              Thali
            </Link>
          </h1>

          <div className="hero-foot">
            <p className="lead">
              Three food worlds. One destination on Kali Mandir Road, Jharsuguda. <strong className="text-[var(--bone)]">Opening soon.</strong>
            </p>
            <div className="hero-ctas">
              <Link href="/#worlds" className="btn btn-solid">
                Enter the three worlds <Arrow />
              </Link>
              <Link href="/#visit" className="btn">
                Find us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ SCENE 02 — THREE WORLDS ═════════ */}
      <div id="worlds">
        <div className="wrap worlds-head">
          <p className="eyebrow text-[var(--bone-dim)]">Scene 02 · Three worlds</p>
          <h2 className="h-section mt-4 max-w-4xl">One address. Three worlds of food.</h2>
          <p className="lead mt-6">
            TRISTAR is three food segments — Biryani, Samosa and Thali — each with its own look, sound and pace. Pick a world.
          </p>
        </div>

        {/* — BIRYANI — */}
        <article id="biryani" aria-labelledby="biryani-title" className="world world-biryani" data-world="biryani">
          <div className="world-bg" aria-hidden="true" data-layer />
          <span className="ghost-word f-biryani" aria-hidden="true">
            Biryani
          </span>
          <div className="wrap">
            <div className="copy">
              <BiryaniLogo className="world-logo" title="Biryani logo concept" />
              <p className="keywords eyebrow">
                {brands.biryani.keywords.map((k) => (
                  <span key={k}>{k}</span>
                ))}
              </p>
              <h2 id="biryani-title" className="f-biryani text-[clamp(3rem,1.4rem+6vw,7rem)] leading-[0.95] text-[var(--ember)]">
                Chicken biryani in Jharsuguda
              </h2>
              <p className="lead mt-6">{brands.biryani.body}</p>
              <p className="note">Menu details and photography will be published as they are finalised.</p>
              <Link href="/#the-food" className="btn">
                See the dish <Arrow />
              </Link>
            </div>
            <HandiArt className="art w-full max-w-[34rem] justify-self-center" />
          </div>
        </article>

        {/* — SAMOSA — */}
        <article id="samosa" aria-labelledby="samosa-title" className="world world-samosa" data-world="samosa">
          <div className="world-bg" aria-hidden="true" data-layer />
          <span className="ghost-word f-samosa" aria-hidden="true">
            Samosa
          </span>
          <div className="wrap">
            <div className="copy">
              <p className="keywords eyebrow">
                {brands.samosa.keywords.map((k) => (
                  <span key={k}>{k}</span>
                ))}
              </p>
              <h2 id="samosa-title" className="samosa-title f-samosa" data-kinetic>
                <span className="sr-only">Samosa in Jharsuguda</span>
                {"Samosa".split("").map((c, i) => (
                  <span key={i} aria-hidden="true">
                    {c}
                  </span>
                ))}
              </h2>
              <p className="lead mt-6">{brands.samosa.body}</p>
              <p className="note">Mutton samosa · Vegetable samosa. Photography to follow.</p>
              <Link href="/#the-food" className="btn">
                See the samosas <Arrow />
              </Link>
            </div>
            <div className="art samosa-stage">
              <SamosaArt className="w-full max-w-[34rem]" />
            </div>
          </div>
        </article>

        {/* — THALI — */}
        <article id="thali" aria-labelledby="thali-title" className="world world-thali" data-world="thali">
          <div className="world-bg" aria-hidden="true" data-layer />
          <div className="wrap">
            <div className="copy">
              <ThaliLogo className="world-logo !h-28 w-auto" title="Thali logo concept" />
              <p className="keywords eyebrow">
                {brands.thali.keywords.map((k) => (
                  <span key={k}>{k}</span>
                ))}
              </p>
              <h2 id="thali-title" className="f-thali">
                Thali
                <span className="sr-only"> in Jharsuguda</span>
              </h2>
              <p className="lead mt-6">{brands.thali.body}</p>
              <p className="note">Varieties and contents not yet confirmed — nothing is listed until it is.</p>
              <Link href="/#the-food" className="btn">
                About the thali <Arrow />
              </Link>
            </div>
            <ThaliArt className="art w-full max-w-[40rem] justify-self-center" />
          </div>
        </article>
      </div>

      {/* ═════════ SCENE 03 — THE FOOD ═════════ */}
      <section id="the-food" aria-labelledby="food-title" className="food">
        <div className="wrap">
          <p className="eyebrow text-[var(--bone-dim)]">Scene 03 · The food</p>
          <h2 id="food-title" className="h-section mt-4 max-w-4xl">
            Four things to eat.
          </h2>
          <p className="lead mt-6">
            Chicken biryani, mutton samosa, vegetable samosa and thali — the dishes TRISTAR is opening with in Jharsuguda. Studio
            photography replaces the marked slots once it is shot.
          </p>

          <ol className="mt-12 md:mt-16">
            {dishes.map((d) => (
              <li key={d.name} className="food-row" data-brand={d.brand}>
                <span className="idx">{d.index}</span>
                <h3 className={`f-${d.brand}`}>{d.name}</h3>
                <p className="text-[var(--bone-dim)]">{d.descriptor}</p>
                <div className="slot">
                  <div className="slot-shape">
                    <span>
                      Photo to come
                      <br />
                      {d.shot.split(" · ")[0]}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═════════ SCENE 04 — THE EXPERIENCE ═════════ */}
      <section id="the-experience" aria-labelledby="exp-title" className="experience">
        <div className="wrap">
          <p className="eyebrow text-[var(--bone-dim)]">Scene 04 · The experience</p>
          <h2 id="exp-title" className="h-section mt-4 max-w-4xl">
            Heat. Crunch. Abundance.
          </h2>
          <div className="kinetic" aria-hidden="true">
            {experienceLines.map((l) => (
              <span key={l.word} className={`k-${l.word.toLowerCase()}`} data-slide>
                {l.word}
              </span>
            ))}
          </div>
          <p className="lead">
            Three ideas run through every plate and every pixel. Photographs of the dining room and the people cooking will appear here
            after they are shot — we do not show premises that do not yet exist on camera.
          </p>
          <div className="photo-frames mt-10" role="group" aria-label="Restaurant photography slots">
            {["Room · wide", "Kitchen · hands at work", "Detail · light and texture"].map((t) => (
              <div key={t} className="photo-frame">
                {t} — photography to come
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ SCENE 05 — THE LOCATION ═════════ */}
      <section id="visit" aria-labelledby="visit-title" className="visit">
        <svg className="crosshair" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false">
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="68" />
          <circle cx="100" cy="100" r="40" />
          <path d="M100 0V200M0 100H200" />
          <circle cx="100" cy="100" r="6" fill="currentColor" />
        </svg>
        <div className="wrap relative z-10">
          <p className="eyebrow text-[var(--bone-dim)]">Scene 05 · The location</p>
          <div className="visit-grid mt-4">
            <div>
              <h2 id="visit-title">
                <span className="block">Find us on</span>
                <em>Kali Mandir Road,</em>
                <span className="block">Jharsuguda.</span>
              </h2>
              <p className="lead mt-8">
                {site.name} is opening soon in Jharsuguda, Odisha — a restaurant near Kali Mandir Road for chicken biryani, samosa and
                thali.
              </p>
            </div>
            <dl className="facts">
              <div>
                <dt>Address</dt>
                <dd>{addressLine()}</dd>
              </div>
              <div>
                <dt>Opening</dt>
                <dd>Date to be announced</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>To be announced</dd>
              </div>
              <div>
                <dt>Directions</dt>
                <dd>Map link will be added once the business listing is verified</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
