import { useState } from 'react';
import { calculateRunPoints } from '../runConfig';

type TeamRanking = {
  teamId: string;
  teamName: string;
  rank: number;
  points: number;
  bonusPoints: number;
  totalPoints: number;
  hasRecord: boolean;
};

export default function RunAdmin({ 
  data, 
  onChange, 
  isAdmin 
}: { 
  data: any; 
  onChange: (d: any) => void; 
  isAdmin: boolean; 
}) {
  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const handleRankChange = (teamId: string, newRank: number) => {
    const teamCount = data.teams.length;
    const points = calculateRunPoints(teamCount);
    
    const updatedRankings = rankings.map(r => {
      if (r.teamId === teamId) {
        return {
          ...r,
          rank: newRank,
          points: points[newRank - 1] || 0,
          totalPoints: (points[newRank - 1] || 0) + r.bonusPoints
        };
      }
      return r;
    });
    
    setRankings(updatedRankings);
  };

  const handleBonusToggle = (teamId: string) => {
    const updatedRankings = rankings.map(r => {
      if (r.teamId === teamId) {
        const newBonus = !r.hasRecord ? 10 : 0;
        return {
          ...r,
          hasRecord: !r.hasRecord,
          bonusPoints: newBonus,
          totalPoints: r.points + newBonus
        };
      }
      return r;
    });
    
    setRankings(updatedRankings);
  };

  const applyResults = () => {
    // Update the main data with run results
    const updatedData = { ...data };
    
    rankings.forEach(ranking => {
      if (!updatedData.scores.byTeamEvent[ranking.teamId]) {
        updatedData.scores.byTeamEvent[ranking.teamId] = {};
      }
      updatedData.scores.byTeamEvent[ranking.teamId].running = ranking.totalPoints;
    });
    
    onChange(updatedData);
    setShowAdmin(false);
  };

  const initializeRankings = () => {
    const teamCount = data.teams.length;
    const points = calculateRunPoints(teamCount);
    
    const initialRankings: TeamRanking[] = data.teams.map((team: any, index: number) => ({
      teamId: team.id,
      teamName: team.name,
      rank: index + 1,
      points: points[index] || 0,
      bonusPoints: 0,
      totalPoints: points[index] || 0,
      hasRecord: false
    }));
    
    setRankings(initialRankings);
    setShowAdmin(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">🏃‍♂️ Run Results (Admin)</h3>
        {!showAdmin && (
          <button
            onClick={initializeRankings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enter Results
          </button>
        )}
      </div>

      {showAdmin && (
        <div className="space-y-4">
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-gray-700">
              <strong>Instructions:</strong> Rank teams from 1st to last place. Check the box if a team member beat the segment record for +10 bonus points.
            </p>
          </div>

          <div className="space-y-3">
            {rankings.map((ranking, index) => (
              <div key={ranking.teamId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-gray-600 w-8">#{index + 1}</span>
                  <span className="font-medium text-gray-800 flex-1">{ranking.teamName}</span>
                  
                  <select
                    value={ranking.rank}
                    onChange={(e) => handleRankChange(ranking.teamId, parseInt(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {data.teams.map((_: any, i: number) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  
                  <span className="text-sm text-gray-600 w-12">{ranking.points} pts</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={ranking.hasRecord}
                      onChange={() => handleBonusToggle(ranking.teamId)}
                      className="rounded"
                    />
                    <span className="text-yellow-600">⭐ Record</span>
                  </label>
                  
                  <span className="font-bold text-lg text-green-600 w-16 text-right">
                    {ranking.totalPoints}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={applyResults}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Apply to Leaderboard
            </button>
            <button
              onClick={() => setShowAdmin(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
