export default function ScoringSystem() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🏆 Scoring System</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Team Ranking Points</h3>
          <p className="text-gray-700 mb-3">
            Points are awarded based on your team's final position. The system adapts to the number of teams participating.
          </p>
          
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-800 mb-2">Formula:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>1st place:</strong> Always 50 points</li>
              <li>• <strong>Last place:</strong> Minimum 5-10 points (depends on team count)</li>
              <li>• <strong>Other positions:</strong> Graduated scale with steeper drop at the top</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded p-3 border">
              <div className="font-medium text-gray-800 mb-1">4 Teams:</div>
              <div className="text-gray-600">1st: 50, 2nd: 34, 3rd: 20, 4th: 10</div>
            </div>
            <div className="bg-white rounded p-3 border">
              <div className="font-medium text-gray-800 mb-1">6 Teams:</div>
              <div className="text-gray-600">1st: 50, 2nd: 39, 3rd: 29, 4th: 20, 5th: 12, 6th: 7</div>
            </div>
            <div className="bg-white rounded p-3 border">
              <div className="font-medium text-gray-800 mb-1">8 Teams:</div>
              <div className="text-gray-600">1st: 50, 2nd: 42, 3rd: 34, 4th: 27, 5th: 21, 6th: 15, 7th: 10, 8th: 6</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Bonus Points</h3>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2 text-lg">⭐</span>
              <div>
                <p className="font-medium text-gray-800">Segment Record Bonus: +10 points</p>
                <p className="text-sm text-gray-600 mt-1">
                  If any runner beats the all-time record on the Magrin Town Hall segment, their team gets 10 bonus points!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Important Notes</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>DNF (Did Not Finish):</strong> 0 points</li>
            <li>• <strong>Penalties:</strong> Applied as time penalties, not point deductions</li>
            <li>• <strong>General Classification:</strong> Run points are added to your team's total TER score</li>
            <li>• <strong>Supervision:</strong> Isabelle and Eric will count laps and verify results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
