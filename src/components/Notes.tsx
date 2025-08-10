export default function Notes() {
  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Notes:</h2>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>GPS segment times can differ from our official lap timing.</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Please keep the course clear for runners, cheer loudly, and be nice to the chickens.</span>
        </li>
      </ul>
    </div>
  );
}
