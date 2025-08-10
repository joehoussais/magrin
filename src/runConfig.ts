export const runConfig = { 
  useRoute: false, 
  routeId: "", 
  segmentId: "39787410" 
};

// Scoring system for the run event
export function runTeamPoints(rank: number, x: number, alpha = 1.3) {
  if (x <= 0) throw new Error("x must be >= 1");
  if (x === 1) return 50;
  if (rank < 1 || rank > x) throw new Error("rank out of range");
  const floor = Math.max(5, Math.round(50 / (x + 1)));
  if (rank === x) return floor;
  const frac = (x - rank) / (x - 1);
  return floor + Math.round((50 - floor) * Math.pow(frac, alpha));
}

// Calculate points for all teams
export function calculateRunPoints(teamCount: number) {
  const points = [];
  for (let rank = 1; rank <= teamCount; rank++) {
    points.push(runTeamPoints(rank, teamCount));
  }
  return points;
}
