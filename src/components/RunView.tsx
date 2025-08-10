import MapEmbed from './MapEmbed';
import SegmentEmbed from './SegmentEmbed';
import Rules from './Rules';
import Notes from './Notes';
import ScoringSystem from './ScoringSystem';
import RunAdmin from './RunAdmin';

export default function RunView({ data, onChange, isAdmin }: { 
  data: any; 
  onChange: (d: any) => void; 
  isAdmin: boolean; 
}) {
  return (
    <div className="space-y-6 py-6">
      {/* Hero Section with Shrek and Obelix */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-orange-50 border-2 border-green-200 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-orange-100/20"></div>
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Image */}
            <div className="flex-shrink-0">
              <img 
                src="/shrek and obelix.jpg" 
                alt="Shrek and Obelix - Magrin Run Legends" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-xl shadow-lg border-4 border-white object-cover"
              />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
                🏃 Magrin Ekiden Run
              </h1>
              <p className="text-lg md:text-xl text-green-700 mb-3">
                Join Shrek and Obelix for the ultimate adventure!
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  🕘 August 14th, 11:30 AM
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  🏁 5K Race
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  🏆 Team Competition
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Magrin Ekiden Run Page */}
      {/* Mobile Layout - Single Column */}
      <div className="lg:hidden space-y-6">
        <Rules />
        <SegmentEmbed />
        <MapEmbed />
        <Notes />
        <ScoringSystem />
        <RunAdmin data={data} onChange={onChange} isAdmin={isAdmin} />
      </div>

      {/* Desktop Layout - Two Columns */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        {/* Left Column - Content */}
        <div className="space-y-6">
          <Rules />
          <Notes />
          <ScoringSystem />
          <RunAdmin data={data} onChange={onChange} isAdmin={isAdmin} />
        </div>

        {/* Right Column - Sticky Embeds */}
        <div className="sticky top-24 space-y-6">
          <SegmentEmbed />
          <MapEmbed />
        </div>
      </div>
    </div>
  );
}
