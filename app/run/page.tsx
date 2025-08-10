import MapEmbed from './components/MapEmbed';
import SegmentEmbed from './components/SegmentEmbed';
import Rules from './components/Rules';
import Notes from './components/Notes';
import { runConfig } from './runConfig';

export default function RunPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="sticky top-8 space-y-6">
            <MapEmbed />
            <SegmentEmbed />
          </div>
        </div>
      </div>
    </div>
  );
}
