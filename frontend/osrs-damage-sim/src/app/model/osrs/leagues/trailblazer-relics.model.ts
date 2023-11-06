export const allTrailblazerRelics = ["Brawler's Resolve"] as const;

export type TrailblazerRelic = (typeof allTrailblazerRelics)[number];
