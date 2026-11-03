// Photos are self-hosted in public/images as <name>-<width>.webp so they load from the same origin as the site
const WIDTHS = [640, 1080, 1600]

export const photoUrl = (name, w = 1080) => `${import.meta.env.BASE_URL}images/${name}-${w}.webp`

export const photoSrcSet = (name) => WIDTHS.map((w) => `${photoUrl(name, w)} ${w}w`).join(', ')

export const PHOTOS = {
  hero: 'hero',
  heroSilhouette: 'hero-silhouette',
  foamMercedes: 'foam-mercedes',
  interiorLeather: 'interior-leather',
  polishing: 'polishing',
  ceramicApplicator: 'ceramic-applicator',
  foamWheel: 'foam-wheel',
  emblemBeading: 'emblem-beading',
  grilleGloss: 'grille-gloss',
  handsPolish: 'hands-polish',
  porscheRear: 'porsche-rear',
  headlightBmw: 'headlight-bmw',
  garageBlack: 'garage-black',
  leatherSeats: 'leather-seats',
  studioBmw: 'studio-bmw',
}
