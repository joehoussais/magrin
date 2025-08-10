import { runConfig } from '../runConfig';

export default function SegmentEmbed() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Segment Times</h3>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
        <iframe 
          src={`https://www.strava.com/segments/${runConfig.segmentId}/embed`}
          frameBorder="0" 
          scrolling="no" 
          width="100%" 
          height="405"
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          aria-label="Strava segment leaderboard for Magrin Town Hall loop"
        />
      </div>
      <p className="text-sm text-gray-600 mt-3">
        <a 
          href={`https://www.strava.com/segments/${runConfig.segmentId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Open on Strava
        </a>
      </p>
    </div>
  );
}
