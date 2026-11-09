import Link from "next/link";
import { Arrow, HandiArt, SamosaArt, ThaliArt } from "@/components/art/Art";
import { BiryaniLogo, SamosaLogo, ThaliLogo } from "@/components/brand/Logos";
import { brands, dishes } from "@/content/home";
import { addressLine, site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${site.name} Jharsuguda | Biryani, Samosa & Thali`,
  description: site.description,
  path: "/",
});

const Mask = ({ children }: { children: React.ReactNode }) => (
  <span className="mask">
    <span data-mask>{children}</span>
  </span>
);

function Chapter({ b, flip }: { b: (typeof brands)[keyof typeof brands]; flip?: boolean }) {
  const Logo = { biryani: BiryaniLogo, samosa: SamosaLogo, thali: ThaliLogo }[b.key];
  const Art = { biryani: HandiArt, samosa: SamosaArt, thali: ThaliArt }[b.key];
  return (
    <article id={b.key} aria-labelledby={`${b.key}-title`} className={`chapter cv chapter-${b.key}${flip ? " flip" : ""}`}>
      <div className="chapter-light" aria-hidden="true" data-light />
      <div className="wrap chapter-grid">
        <div className="copy" data-rise>
          <p className="numeral" aria-hidden="true">
            {b.numeral}
          </p>
          <Logo className="chapter-logo" />
          <h2 id={`${b.key}-title`} className={`chapter-title f-${b.key}`}>
            <Mask>{b.headline}</Mask>
          </h2>
          <p className="lead">{b.body}</p>
          <ul className="keywords" aria-label={`${b.name} character`}>
            {b.keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <Link prefetch={false} href="/#the-food" className="link-quiet">
            {b.name} on the table <Arrow />
          </Link>
        </div>
        <figure className={`frame-wrap frame-wrap-${b.key}`}>
          <div className="frame">
            <div className="frame-in">
              <div className="frame-art" data-reveal>
                {b.key === "biryani" && (
                  <div className="steam" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                )}
                <div className="frame-parallax" data-parallax>
                  <Art className="art" />
                </div>
              </div>
            </div>
          </div>
          <figcaption>Photograph to come · {b.shot}</figcaption>
        </figure>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Lancet (pointed) arch — the Samosa frame shape, resolution-independent */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="lancet" clipPathUnits="objectBoundingBox">
            <path d="M0 1 V0.44 C0 0.24 0.36 0.1 0.5 0 C0.64 0.1 1 0.24 1 0.44 V1 Z" />
          </clipPath>
        </defs>
      </svg>
      {/* ═════════ I — ARRIVAL ═════════ */}
      <section aria-labelledby="hero-title" className="hero grain">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Kali Mandir Road · Jharsuguda · Opening soon</p>
            <h1 id="hero-title" className="f-display">
              <span className="sr-only">TRISTAR Jharsuguda: </span>
              <span className="hl">Biryani,</span>
              <span className="hl">
                <em>samosa</em>
              </span>
              <span className="hl">and thali.</span>
            </h1>
            <p className="lead">One address, three quiet chapters of food. TRISTAR is opening soon in Jharsuguda, Odisha.</p>
            <div className="hero-ctas">
              <Link prefetch={false} href="/#biryani" className="btn">
                Begin with the table
              </Link>
              <Link prefetch={false} href="/#visit" className="link-quiet">
                Find us <Arrow />
              </Link>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="frame">
              <div className="frame-in">
                <div className="frame-art">
                  <div className="steam">
                    <i />
                    <i />
                    <i />
                  </div>
                  <HandiArt className="art" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="wrap hero-index" aria-label="The three chapters">
          {Object.values(brands).map((b) => (
            <Link prefetch={false} key={b.key} href={`/#${b.key}`} className={`hi hi-${b.key}`}>
              <span className="hi-n" aria-hidden="true">
                {b.numeral}
              </span>
              <span className="hi-name f-display">{b.name}</span>
              <span className="hi-kw">{b.keywords.join(" · ")}</span>
            </Link>
          ))}
        </nav>
      </section>

      {/* ═════════ II — PREMISE ═════════ */}
      <section aria-labelledby="premise-title" className="premise cv">
        <div className="wrap premise-grid">
          <h2 id="premise-title" className="f-display" data-rise>
            Three dishes, three identities, one address in Jharsuguda.
          </h2>
          <div className="premise-copy" data-rise>
            <p className="lead">
              TRISTAR is the parent. Biryani, Samosa and Thali are its three chapters — each with its own letterform, shape and light, held together by
              the same restraint.
            </p>
            <ul className="premise-logos" aria-label="TRISTAR’s three identities">
              <li>
                <Link prefetch={false} href="/#biryani" aria-label="Biryani">
                  <BiryaniLogo />
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/#samosa" aria-label="Samosa">
                  <SamosaLogo />
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/#thali" aria-label="Thali">
                  <ThaliLogo />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═════════ III–V — THE THREE CHAPTERS ═════════ */}
      <div id="worlds">
        <Chapter b={brands.biryani} />
        <Chapter b={brands.samosa} flip />
        <Chapter b={brands.thali} />
      </div>

      {/* ═════════ VI — THE TABLE ═════════ */}
      <section id="the-food" aria-labelledby="food-title" className="table-sec cv grain">
        <div className="wrap">
          <p className="eyebrow">The table</p>
          <h2 id="food-title" className="f-display" data-rise>
            Four things to eat.
          </h2>
          <p className="lead" data-rise>
            Chicken biryani, mutton samosa, vegetable samosa and thali — the dishes TRISTAR is opening with. Studio photography replaces the marked frames
            once it is shot.
          </p>
          <ol className="dishes">
            {dishes.map((d) => (
              <li key={d.name} className={`dish dish-${d.brand}`} data-rise>
                <span className="dish-n" aria-hidden="true">
                  {d.index}
                </span>
                <h3 className={`f-${d.brand}`}>{d.name}</h3>
                <p>{d.descriptor}</p>
                <span className="dish-slot" aria-hidden="true">
                  <span>{d.shot}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═════════ VII — VISIT ═════════ */}
      <section id="visit" aria-labelledby="visit-title" className="visit cv">
        <div className="wrap visit-grid">
          <div data-rise>
            <p className="eyebrow">Visit</p>
            <h2 id="visit-title" className="f-display">
              <Mask>Kali Mandir Road, </Mask>
              <Mask>
                <em>Jharsuguda.</em>
              </Mask>
            </h2>
            <p className="lead">
              {site.name} is opening soon in Jharsuguda, Odisha — a restaurant on Kali Mandir Road for chicken biryani, samosa and thali.
            </p>
          </div>
          <dl className="facts" data-rise>
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
              <dd>A map link will be added once the business listing is verified</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
