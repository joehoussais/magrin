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
