import MapEmbed from './MapEmbed';
import SegmentEmbed from './SegmentEmbed';
import Rules from './Rules';
import Notes from './Notes';

export default function RunView() {
  return (
    <div className="space-y-6 py-6">
      {/* Mobile Layout - Single Column */}
      <div className="lg:hidden space-y-6">
        <Rules />
        <MapEmbed />
        <SegmentEmbed />
        <Notes />
      </div>

      {/* Desktop Layout - Two Columns */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        {/* Left Column - Content */}
        <div className="space-y-6">
          <Rules />
          <Notes />
        </div>

        {/* Right Column - Sticky Embeds */}
        <div className="sticky top-24 space-y-6">
          <MapEmbed />
          <SegmentEmbed />
        </div>
      </div>
    </div>
  );
}
