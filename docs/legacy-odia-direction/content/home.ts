/**
 * Homepage editorial content. Every statement describes Odia culture or cuisine
 * in general terms and has been cross-checked; nothing here claims a fact about
 * the restaurant that has not been supplied by its owners.
 */

export const landStories = [
  {
    kicker: "Temples of Kalinga",
    title: "Towers that curve toward the sky",
    body: "Odisha’s temple architecture — the curving towers of Bhubaneswar and Puri, and the chariot-shaped Sun Temple at Konark, a UNESCO World Heritage Site since 1984 — is among the great building traditions of India. A temple silhouette of this kind also crowns our emblem.",
    glyph: "temple",
  },
  {
    kicker: "Coast & lagoon",
    title: "Where river, lagoon and Bay of Bengal meet",
    body: "Chilika, one of the largest brackish-water lagoons in the world, and a long Bay of Bengal coastline shape the region’s fish and prawn cooking — from mustard-ground besara to simple fried preparations.",
    glyph: "wave",
  },
  {
    kicker: "Craft",
    title: "Cloth that tells stories",
    body: "Pattachitra, the cloth-scroll painting tradition associated with Puri and the craft village of Raghurajpur, and Sambalpuri ikat, woven from pre-dyed yarn in western Odisha, show how pattern, colour and patience define Odia craft.",
    glyph: "loom",
  },
  {
    kicker: "The Odia kitchen",
    title: "Mustard, greens, lentils and rice",
    body: "Pancha phutana — a five-seed spice blend — mustard, leafy saga, sun-dried lentil badi, coconut and rice sit at the centre of everyday Odia cooking, from a cooling bowl of pakhala to slow-simmered dalma.",
    glyph: "pot",
  },
] as const;

export const dishes = [
  {
    odia: "ପଖାଳ",
    name: "Pakhala",
    tag: "Rice, water, summer",
    body: "Cooked rice soaked in water — sometimes lightly fermented, sometimes finished with curd — served cool with fried greens, badi chura or fried fish. Odias informally mark Pakhala Dibasa on 20 March.",
  },
  {
    odia: "ଦାଲମା",
    name: "Dalma",
    tag: "Lentils & vegetables",
    body: "Split lentils simmered with seasonal vegetables and finished with a fragrant tempering. A staple of the Odia home table, with endless household variations.",
  },
  {
    odia: "ସନ୍ତୁଲା",
    name: "Santula",
    tag: "Gentle vegetables",
    body: "A lightly cooked medley of vegetables, gently seasoned — the quiet, clean-flavoured counterpoint to richer curries on the Odia plate.",
  },
  {
    odia: "ମାଛ ବେସର",
    name: "Machha Besara",
    tag: "Fish in mustard",
    body: "Fish simmered in a pungent paste of ground mustard, a signature of Odia fish cookery along the river and coastal belt.",
  },
  {
    odia: "ଛେନା ପୋଡ଼",
    name: "Chhena Poda",
    tag: "Baked sweet",
    body: "A slow-baked sweet of fresh chhena (cottage cheese) and sugar, caramelised at the edges — one of Odisha’s best-loved desserts.",
  },
  {
    odia: "ପିଠା",
    name: "Pitha",
    tag: "Festival cakes",
    body: "A family of rice-based cakes: Enduri pitha steamed in turmeric leaf for Prathamastami, poda pitha baked for Raja. Each marks a moment in the Odia year.",
  },
] as const;

export const experienceNotes = [
  { title: "Terracotta", body: "Earth-fired clay and temple stone — the warmth of our primary colour." },
  { title: "Saffron light", body: "The glow of an Odisha sunrise over a temple spire, as in the emblem." },
  { title: "Leaf & lotus", body: "Olive greens and the lotus, symbols of nourishment and renewal." },
] as const;
