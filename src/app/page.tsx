import { Badge } from "@/components/brand/Badges";
import { Arrow, Wheel } from "@/components/Ornament";
import { brands, dishes } from "@/content/home";
import { addressLine, isProduction, site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${site.name} Jharsuguda | Biryani, Samosa & Thali`,
  description: site.description,
  path: "/",
});

const Band = ({ className = "" }: { className?: string }) => <div className={`band ${className}`} aria-hidden="true" />;

function Chapter({ b, flip }: { b: (typeof brands)[keyof typeof brands]; flip?: boolean }) {
  return (
    <article id={b.key} aria-labelledby={`${b.key}-title`} className={`chapter cv chapter-${b.key}${flip ? " flip" : ""}`}>
      <Band className="band-top" />
      <div className="wrap chapter-grid">
        <div className="copy" data-rise>
          <p className="numeral" aria-hidden="true">
            {b.numeral}
          </p>
          {!isProduction && (
            <p className="odia" lang="or">
              {b.odia}
              <span className="draft-tag"> · draft, awaiting native-language review</span>
            </p>
          )}
          <h2 id={`${b.key}-title`} className="chapter-title">
            {b.headline}
          </h2>
          <p className="lead">{b.body}</p>
          <ul className="keywords" aria-label={`${b.name} character`}>
            {b.keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <a href="#the-food" className="link-quiet">
            {b.name} on the table <Arrow />
          </a>
        </div>
        <figure className="badge-stage" data-badge>
          <Badge kind={b.key} className="badge-xl" />
          {b.key === "biryani" && (
            <div className="steam" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          )}
          <figcaption>Photograph to come · {b.shot}</figcaption>
        </figure>
      </div>
      <Band className="band-bottom" />
    </article>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ═════════ I — ARRIVAL ═════════ */}
      <section aria-labelledby="hero-title" className="hero paper">
        <Wheel className="hero-wheel" />
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Kali Mandir Road · Jharsuguda · Opening soon</p>
            <h1 id="hero-title" className="f-display">
              <span className="sr-only">TRISTAR Jharsuguda: </span>
              <span className="hw hw-b">Biryani,</span>
              <span className="hw hw-s">samosa</span>
              <span className="hw hw-t">and thali.</span>
            </h1>
            <p className="lead">A new table on Kali Mandir Road, set in the colours and crafts of Odisha. TRISTAR is opening soon in Jharsuguda.</p>
            <div className="hero-ctas">
              <a href="#biryani" className="btn">
                Meet the three tables
              </a>
              <a href="#visit" className="link-quiet">
                Find us <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-badge" aria-hidden="true">
            <div className="hero-glow" />
            <Badge kind="tristar" className="badge-hero" />
          </div>
        </div>

        <Band />
        <nav className="wrap hero-index" aria-label="The three tables">
          {Object.values(brands).map((b) => (
            <a key={b.key} href={`/#${b.key}`} className={`hi hi-${b.key}`}>
              <Badge kind={b.key} mini className="hi-badge" />
              <span className="hi-text">
                <span className="hi-name">{b.name}</span>
                <span className="hi-kw">{b.keywords.join(" · ")}</span>
              </span>
            </a>
          ))}
        </nav>
      </section>

      {/* ═════════ II — ONE FAMILY ═════════ */}
      <section aria-labelledby="family-title" className="family cv">
        <div className="wrap family-grid">
          <div data-rise>
            <p className="eyebrow">One family</p>
            <h2 id="family-title" className="f-display">
              Three dishes, three identities, one address in Jharsuguda.
            </h2>
            <p className="lead">
              TRISTAR is the parent. Biryani, Samosa and Thali each carry an emblem of their own — a clay handi, a chhatri over golden pastry, a plate of
              bowls — drawn with the same hand and the same warm palette.
            </p>
          </div>
          <ul className="family-badges" aria-label="TRISTAR’s three identities" data-rise>
            {Object.values(brands).map((b) => (
              <li key={b.key}>
                <a href={`/#${b.key}`} aria-label={b.name}>
                  <Badge kind={b.key} className="badge-md" />
                  <span className="family-label">{b.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════════ III–V — THE THREE TABLES ═════════ */}
      <div id="worlds">
        <Chapter b={brands.biryani} />
        <Chapter b={brands.samosa} flip />
        <Chapter b={brands.thali} />
      </div>

      {/* ═════════ VI — THE TABLE ═════════ */}
      <section id="the-food" aria-labelledby="food-title" className="table-sec cv paper">
        <div className="wrap">
          <p className="eyebrow">The table</p>
          <h2 id="food-title" className="f-display" data-rise>
            Four things to eat.
          </h2>
          <p className="lead" data-rise>
            Chicken biryani, mutton samosa, vegetable samosa and thali — the dishes TRISTAR is opening with. Studio photography replaces the framed
            places below once it is shot.
          </p>
          <ol className="dishes">
            {dishes.map((d) => (
              <li key={d.name} className={`dish dish-${d.brand}`} data-rise>
                <div className="slot" aria-hidden="true">
                  <Badge kind={d.brand} className="slot-badge" />
                  <span>
                    Photograph
                    <br />
                    to come · {d.shot}
                  </span>
                </div>
                <h3>{d.name}</h3>
                <p>{d.descriptor}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═════════ VII — VISIT ═════════ */}
      <section id="visit" aria-labelledby="visit-title" className="visit cv">
        <Band className="band-top" />
        <div className="wrap visit-grid">
          <div data-rise>
            <p className="eyebrow">Visit</p>
            <h2 id="visit-title" className="f-display">
              Kali Mandir Road, Jharsuguda.
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
