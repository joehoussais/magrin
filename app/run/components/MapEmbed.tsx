'use client';

import { useEffect } from 'react';
import { runConfig } from '../runConfig';

export default function MapEmbed() {
  useEffect(() => {
    // Load strava-embeds script if using route embed
    if (runConfig.useRoute && runConfig.routeId) {
      const script = document.createElement('script');
      script.src = 'https://strava-embeds.com/embed.js';
      script.async = true;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  if (runConfig.useRoute && runConfig.routeId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Map</h3>
        <div 
          className="strava-embed-placeholder" 
          data-embed-type="route" 
          data-embed-id={runConfig.routeId} 
          data-style="standard" 
          data-slippy="true"
          aria-label="Magrin Town Hall loop course map"
        />
        <p className="text-sm text-gray-600 mt-3">
          <a 
            href={`https://www.strava.com/routes/${runConfig.routeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Open route on Strava
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Map</h3>
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Route embed coming soon</p>
        <p className="text-sm text-gray-500 mt-2">Course map will be available here</p>
      </div>
    </div>
  );
}
