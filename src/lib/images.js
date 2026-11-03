const BASE = 'https://images.unsplash.com/photo-'

export const photoUrl = (id, w, q = 72) => `${BASE}${id}?auto=format&fit=crop&w=${w}&q=${q}`

export const photoSrcSet = (id, widths = [480, 768, 1080, 1440, 1920]) =>
  widths.map((w) => `${photoUrl(id, w)} ${w}w`).join(', ')

export const PHOTOS = {
  hero: '1608506436795-af65d01305bf',
  heroSilhouette: '1645400379459-f6fd3d963fd4',
  foamMercedes: '1761312834150-4beefff097a7',
  interiorLeather: '1605437241278-c1806d14a4d9',
  polishing: '1708805282706-f44730b7e527',
  ceramicApplicator: '1652898072202-5084dc85b850',
  foamWheel: '1608506375591-b90e1f955e4b',
  emblemBeading: '1653749573430-3ed4b826222c',
  grilleGloss: '1618642542397-ef97a739f1d7',
  handsPolish: '1708805282676-0c15476eb8a2',
  porscheRear: '1570980404730-a0e14fef178f',
  headlightBmw: '1714434087918-4b9abedef3c6',
  garageBlack: '1720080829677-4a3156adddbd',
  leatherSeats: '1553818501-e9926ea1ea8f',
  studioBmw: '1787178605268-36282fb87172',
}
