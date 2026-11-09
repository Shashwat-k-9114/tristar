import Image from "next/image";
import { BanquetForm } from "@/components/BanquetForm";
import { DayNight } from "@/components/DayNight";
import { InboxLink } from "@/components/InboxLink";
import { LaunchCards } from "@/components/LaunchCards";
import { MenuBrowser } from "@/components/MenuBrowser";
import { Navbar } from "@/components/Navbar";
import { ReserveForm } from "@/components/ReserveForm";
import { Reveal } from "@/components/Reveal";
import { StoryText } from "@/components/StoryText";
import { Wheel } from "@/components/Wheel";
import { KALINGA_CATS, UTKAL_CATS } from "@/lib/menu";
import { EMAIL, PHONE_HREF, PHONE_TEXT } from "@/lib/site";

const Legend = () => (
  <div className="legend">
    <span><i className="dot n"></i>Non-vegetarian</span>
    <span><i className="dot v"></i>Vegetarian</span>
    <span><i className="dot vg"></i>Vegan</span>
    <a className="lnk" href="/1947-menu-booklet.pdf" target="_blank" rel="noopener">Download the menu (PDF)</a>
  </div>
);

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="home">
        <section className="hero">
          <div className="wide">
            <div className="hero-stage">
              <Wheel className="l" />
              <Wheel className="r" />
              <Image className="hero-dancer dl" src="/img/dancer-left.png" alt="" aria-hidden="true" width={379} height={674} sizes="(max-width:833px) 140px, 320px" loading="eager" />
              <Image className="hero-dancer dr" src="/img/dancer-right.png" alt="" aria-hidden="true" width={205} height={413} sizes="(max-width:833px) 90px, 180px" loading="eager" />
              <div className="hero-copy">
                <span className="eyebrow">Since 1947 · Opening 2027</span>
                <h1>Three legacies, united.<br />One Odia table.</h1>
                <p className="sub">The Kalinga Kitchen, Utkal Biryani House and Chilika Banquet — heritage cooking and celebration, together.</p>
                <div className="cta"><a className="pill" href="#reserve">Pre-book a table</a><a className="lnk" href="#story">Our story</a></div>
              </div>
            </div>
            <LaunchCards />
            <div className="trio">
              <a className="tr rv" href="#kalinga">
                <Image src="/img/building-day.jpg" alt="The Kalinga Kitchen, first floor of the TriStar Building" width={1010} height={948} sizes="(max-width:833px) 100vw, 410px" loading="eager" style={{ objectPosition: "50% 40%" }} />
                <span className="cap"><b>The Kalinga Kitchen</b><i>First floor</i></span>
              </a>
              <a className="tr rv" href="#utkal">
                <Image src="/img/terrace.jpg" alt="Open terrace dining at Utkal Biryani House" width={1044} height={568} sizes="(max-width:833px) 100vw, 410px" loading="eager" />
                <span className="cap"><b>Utkal Biryani House</b><i>Open terrace</i></span>
              </a>
              <a className="tr rv" href="#chilika">
                <div className="soon"><Image className="plate" src="/img/logo-chilika.png" alt="Chilika Banquet" width={532} height={471} sizes="260px" loading="eager" /></div>
                <span className="cap"><b>Chilika Banquet</b><i>Coming soon</i></span>
              </a>
            </div>
          </div>
        </section>

        <div className="shelf">
          <div className="wide">
            <div className="shelf-row rv">
              <a className="sh" href="#kalinga"><div className="th"><Image className="cov" src="/img/signboard.jpg" alt="" width={1536} height={1024} sizes="84px" loading="eager" /></div><b>The Kalinga Kitchen</b><i>First floor</i></a>
              <a className="sh" href="#utkal"><div className="th"><Image src="/img/logo-utkal.png" alt="" width={598} height={598} sizes="84px" loading="eager" /></div><b>Utkal Biryani House</b><i>Open terrace</i></a>
              <a className="sh" href="#chilika"><div className="th"><Image src="/img/logo-chilika.png" alt="" width={532} height={471} sizes="84px" loading="eager" /></div><b>Chilika Banquet</b><i>Coming soon</i></a>
              <a className="sh" href="#story"><div className="th"><Image className="cov" src="/img/signboard.jpg" alt="" width={1536} height={1024} sizes="84px" loading="eager" /></div><b>Our story</b></a>
              <a className="sh" href="#menu-kalinga"><div className="th"><Image className="cov" src="/img/packaging-box.jpg" alt="" width={565} height={619} sizes="84px" loading="eager" /></div><b>Menu</b><i>37 dishes</i></a>
              <a className="sh" href="#takeaway"><div className="th"><Image className="cov" src="/img/packaging-bag.jpg" alt="" width={1069} height={580} sizes="84px" loading="eager" /></div><b>Takeaway</b></a>
              <a className="sh" href="#visit"><div className="th"><Image className="cov" src="/img/building-day.jpg" alt="" width={1010} height={948} sizes="84px" loading="eager" /></div><b>Visit</b></a>
            </div>
          </div>
        </div>

        <section className="statement" id="story">
          <div className="wrap">
            <div className="rv story-h"><span className="eyebrow">Our story</span><h2 className="h-sec">It began with <span className="m">Smt. Anuri.</span></h2></div>
            <StoryText />
            <figure className="signboard rv">
              <Image src="/img/signboard.jpg" alt="The Kalinga Kitchen signboard — Authentic Odia and Regional Cuisine, Est. 1947" width={1536} height={1024} sizes="(max-width:1128px) 100vw, 980px" loading="lazy" />
              <figcaption>The Kalinga Kitchen · Authentic Odia &amp; Regional Cuisine · Est. 1947</figcaption>
            </figure>
          </div>
        </section>

        <section id="houses" style={{ paddingTop: 40 }}>
          <div className="wide">
            <div className="rv" style={{ marginBottom: 48 }}><h2 className="h-sec">The Houses. <span className="m">Three ways to gather.</span></h2></div>
            <div className="tiles">
              <article className="tile rv" id="kalinga">
                <div className="tx"><span className="eyebrow">The Kalinga Kitchen · First floor</span><h3>Her recipes. Our table.</h3>
                  <p className="sm">Authentic Odia rasoi — thalis, podas and singada, from her recipes.</p>
                  <p className="open">Opening 26 January 2027</p>
                  <div className="cta"><a className="pill" href="#menu-kalinga">View menu</a><a className="lnk" href="#story">Read the story</a></div></div>
                <div className="media" style={{ marginTop: "auto", alignItems: "center" }}>
                  <Image src="/img/signboard.jpg" alt="The Kalinga Kitchen signboard" width={1536} height={1024} sizes="320px" loading="lazy" style={{ width: "min(320px,80%)", aspectRatio: "4/3", objectFit: "cover", objectPosition: "center 35%", borderRadius: 22, margin: "0 auto 46px" }} />
                </div>
              </article>
              <article className="tile dark rv on-dark" id="utkal">
                <div className="tx"><span className="eyebrow">Utkal Biryani House · Open terrace</span><h3>Biryani, the matka way.</h3>
                  <p className="sm">Sealed in earthen pots and cooked low and slow, so every grain carries the spice, the ghee and the smoke.</p>
                  <p className="open">Opening 14 February 2027</p>
                  <div className="cta"><a className="pill" href="#menu-utkal">View biryani menu</a><a className="lnk" href="#reserve">Reserve</a></div></div>
                <div className="media"><Image src="/img/staff.jpg" alt="Utkal Biryani House team in Odia handloom attire" width={1110} height={578} sizes="(max-width:1000px) 100vw, 620px" loading="lazy" style={{ objectPosition: "40% 30%" }} /></div>
              </article>
              <article className="tile wide2 rv" id="chilika">
                <Image className="logo" src="/img/logo-chilika.png" alt="Chilika Banquet" width={532} height={471} sizes="300px" loading="lazy" />
                <div className="tx"><span className="eyebrow">Chilika Banquet</span><h3>Celebrate with Odia grace.</h3>
                  <p className="sm">A banquet for weddings, receptions and celebrations — for 50 to 100 guests.</p>
                  <p className="open">Coming soon</p>
                  <div className="cta"><a className="pill" href="#banquet">Plan an event</a><a className="lnk" href="#banquet">Learn more</a></div></div>
              </article>
            </div>
          </div>
        </section>

        <section className="menu" id="menu-kalinga">
          <div className="wide">
            <div className="menu-top rv">
              <div><span className="eyebrow">The Kalinga Kitchen · First floor</span><h2 className="h-sec">The Kalinga Kitchen <span className="m">menu.</span></h2></div>
              <p className="lede">Thalis, pulao, slow-roasted podas, handi and crisp singadas — from her recipes, with traditional techniques and local spices.</p>
            </div>
            <MenuBrowser cats={KALINGA_CATS} tabsLabel="Kalinga Kitchen menu sections" />
            <Legend />
          </div>
        </section>

        <section className="menu menu-b" id="menu-utkal">
          <div className="wide">
            <div className="menu-top rv">
              <div>
                <span className="eyebrow">Utkal Biryani House · Open terrace</span>
                <h2 className="h-sec">Earthen-pot biryani. <span className="m">Utkal’s Masterpiece</span> <small style={{ display: "block", fontSize: ".45em", fontWeight: 600, letterSpacing: 0, marginTop: 10, color: "var(--orange,#ff9f0a)" }}>(aroma to remember)</small></h2>
              </div>
              <p className="lede">Our signature biryani, layered and dum-cooked in sealed earthen pots — so every grain carries the spice, the ghee and the smoke.</p>
            </div>
            <MenuBrowser cats={UTKAL_CATS} />
            <Legend />
            <div className="welcome rv"><span className="wl">Complimentary</span><h3 className="neon">Welcome gesture</h3><p>Our gift to every guest at Utkal Biryani House.</p></div>
            <div className="promises rv">
              <div><h4>Fresh Chhena Poda</h4><p>Every guest receives a complimentary 100g serving of our baked cottage cheese dessert. Premium takeaway packs are available.</p></div>
              <div><h4>Fresh Tender Coconut Water</h4><p>Your welcome drink is complimentary, on the house. Additional coconuts are available for ₹200 each.</p></div>
              <div><h4>Pure Drinking Water</h4><p>Complimentary chilled water service. Warm or hot water is always available upon request.</p></div>
            </div>
            <p className="fine">All non-vegetarian items are sourced fresh daily and prepared under strict hygiene standards. Slow-roasted poda items need preparation time, so please order in advance. We use no artificial colourings or commercial flavour enhancers. Taxes extra as applicable. Prices in ₹. Dish photos are illustrative <a style={{ color: "var(--link)" }} href="/img/dishes/CREDITS.txt" target="_blank" rel="noopener">(photo credits)</a>.</p>
          </div>
        </section>

        <section className="tv">
          <div className="wide">
            <div className="tiles">
              <article className="tile rv" id="takeaway">
                <div className="tx"><span className="eyebrow">Takeaway</span><h3>Packed with care.</h3>
                  <p className="sm">Thalis and biryani, freshly prepared and hygienically packed — so the table can follow you home.</p>
                  <ul className="facts"><li><span>Chhena Poda to take home</span><b>₹1,000 / kg</b></li><li><span>Packaging</span><b>Leak-proof, sustainable</b></li></ul>
                  <div className="cta"><a className="lnk" href="#menu-kalinga">See the menus</a></div></div>
                <div className="take-media">
                  <Image src="/img/packaging-box.jpg" alt="Utkal Biryani House thali box" width={565} height={619} sizes="(max-width:1000px) 40vw, 250px" loading="lazy" />
                  <Image src="/img/packaging-bag.jpg" alt="Utkal Biryani House jute takeaway bag" width={1069} height={580} sizes="(max-width:1000px) 60vw, 380px" loading="lazy" />
                </div>
              </article>
              <article className="tile dark rv on-dark" id="visit">
                <div className="tx"><span className="eyebrow">Visit</span><h3>Find us under one roof.</h3>
                  <p className="sm">The Kalinga Kitchen and Utkal Biryani House, together at TriStar 1947.</p>
                  <ul className="facts">
                    <li><span>The Kalinga Kitchen · First floor</span><b>Opens 26 January 2027</b></li>
                    <li><span>Utkal Biryani House · Open terrace</span><b>Opens 14 February 2027</b></li>
                    <li><span>Chilika Banquet</span><b>Coming soon</b></li>
                    <li><span>Address</span><b>First Floor, TriStar Building (HDFC Bank Building), Kalimandir Road, Jharsuguda – 768202</b></li>
                    <li><span>Mon – Thu</span><b>11:30 – 22:30</b></li>
                    <li><span>Fri – Sun</span><b>11:00 – 23:00</b></li>
                  </ul>
                </div>
                <DayNight />
              </article>
            </div>
          </div>
        </section>

        <section className="banquet" id="banquet">
          <div className="wide">
            <div className="rv"><span className="eyebrow">Chilika Banquet</span><h2 className="h-sec">Celebrate with <span className="m">Odia grace.</span></h2></div>
            <div className="bq">
              <div className="card rv">
                <Image className="logo-img bq-logo" src="/img/logo-chilika.png" alt="Chilika Banquet" width={532} height={471} sizes="220px" loading="lazy" />
                <p className="sm">A banquet for weddings, receptions and celebrations, with in-house Odia and Mughlai catering.</p>
                <ul className="facts"><li><span>Capacity</span><b>50 – 100 guests</b></li><li><span>Catering</span><b>Live cooking counters</b></li><li><span>Arrival</span><b>Valet parking</b></li></ul>
              </div>
              <BanquetForm />
            </div>
          </div>
        </section>

        <section className="reserve" id="reserve">
          <div className="wrap">
            <div className="center rv"><span className="eyebrow">Reservations</span><h2 className="h-sec">Pre-book a <span className="m">table.</span></h2><p className="sub">Bookings are open for opening day and after. Choose your house — we will call to confirm.</p></div>
            <ReserveForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="wide">
          <p className="f-note">Prices in ₹. Taxes extra as applicable. Slow-roasted poda items require preparation time — please order in advance. Images are illustrative impressions.</p>
          <div className="f-cols">
            <div><h4>TriStar 1947</h4><ul><li><a href="#story">Our story</a></li><li><a href="#houses">The houses</a></li><li><a href="#menu-kalinga">Kalinga Kitchen menu</a></li><li><a href="#menu-utkal">Earthen-pot biryani menu</a></li></ul></div>
            <div><h4>Experience</h4><ul><li><a href="#reserve">Reserve a table</a></li><li><a href="#banquet">Chilika Banquet (coming soon)</a></li><li><a href="#takeaway">Takeaway</a></li></ul></div>
            <div><h4>Hours</h4><ul><li>Mon – Thu · 11:30 – 22:30</li><li>Fri – Sun · 11:00 – 23:00</li><li>Open terrace dining · 7 – 10 PM</li></ul></div>
            <div><h4>Contact</h4><ul><li>First Floor, TriStar Building (HDFC Bank Building), Kalimandir Road, Jharsuguda – 768202</li><li><a href={PHONE_HREF}>{PHONE_TEXT}</a></li><li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li></ul></div>
          </div>
          <div className="f-bot"><span>Copyright © 2026 TriStar 1947 · Tristar Foods LLP. All rights reserved.</span><InboxLink /></div>
        </div>
      </footer>

      <Reveal />
    </>
  );
}
