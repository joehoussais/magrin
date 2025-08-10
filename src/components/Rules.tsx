export default function Rules() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Magrin Ekiden - The Perfect Run</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          A team relay around the Magrin Town Hall loop. Total of 6 laps. The course map sits next to this text so you can see the loop clearly.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Quick rules:</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Format:</strong> Ekiden style relay, 6 total laps of the Town Hall loop.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Teams:</strong> 3 or more runners.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Relay order:</strong> You choose the order and who runs which laps.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Limit per runner:</strong> Maximum 3 laps per person.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Baton zone:</strong> Hand off must happen inside the marked zone near the start line.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Timing:</strong> Official time is taken when your runner completes lap 6. We record lap splits when possible.</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">How to win:</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>The first team to complete lap 6 wins the run event points for the TER.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Extra fun awards may include fastest lap, best relay hand off, and most positions gained on a lap. These are shown on the leaderboard and announced at the ceremony.</span>
          </li>
        </ul>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">👥 Race Supervision</h3>
          <p className="text-gray-700 mb-2">
            <strong>Isabelle and Eric</strong> will be supervising the race and counting the number of laps completed by each team.
          </p>
          <p className="text-sm text-gray-600">
            Official results will be determined by their lap counting and timing verification.
          </p>
        </div>
      </div>
    </div>
  );
}
