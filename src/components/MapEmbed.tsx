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
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Aerial View</h3>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2850.1234567890123!2d2.123456789012345!3d43.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDA3JzM0LjQiTiAywrAwNyc0NS42IkU!5e0!3m2!1sen!2sfr!4v1234567890123"
          width="100%" 
          height="450"
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Aerial view of Magrin Town Hall loop course"
        />
      </div>
      <p className="text-sm text-gray-600 mt-3">
        <a 
          href="https://www.google.com/maps?q=Magrin+France"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Open in Google Maps
        </a>
      </p>
    </div>
  );
}
