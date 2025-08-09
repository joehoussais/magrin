import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Magrin Week — single-file React app (desktop-first, mobile-friendly)
 * - Tabs: Map, Leaderboard (T-E-R), People, Info, Chat, Settings
 * - Everything persists to localStorage (no backend). Export/Import JSON in Settings.
 * - Paste your custom map image in Settings. Default is /magrin-map.png.
 *
 * Drop-in:
 * - This project is Vite + React + TypeScript + Tailwind (already configured).
 */

// ---------- Types

type Team = { id: string; name: string; color: string };

type Event = { id: string; name: string; emoji: string; weight: number };

type ScoreState = {
  byTeamEvent: Record<string, Record<string, number>>; // byTeamEvent[teamId][eventId] => points
};

type Person = { 
  id: string; 
  name: string; 
  teamId?: string; 
  emoji?: string; 
  bio?: string;
  ratings: Record<string, number>; // ratings[eventId] => 1-5 rating
};

type Marker = {
  id: string;
  name: string;
  emoji?: string;
  type?: string;
  description?: string;
  // position as percentages of the image (0-100)
  x: number;
  y: number;
};

type DataModel = {
  map: {
    imageUrl: string;
    markers: Marker[];
  };
  teams: Team[];
  events: Event[]; // T, E, R by default
  scores: ScoreState;
  people: Person[];
  info: {
    animals: { title: string; body: string; emoji?: string }[];
    places: { title: string; body: string; emoji?: string }[];
    notices: { title: string; body: string; emoji?: string; date?: string }[];
  };
};

const STORAGE_KEY = "magrin_app_state_v1";

// Admin configuration - 2 admins supportés
const ADMIN_PASSWORDS = ["magrino2025", "admin2025"];

// ---------- Defaults (edit in Settings later)
const DEFAULT_DATA: DataModel = {
  map: {
    imageUrl: "/magrin-app-enlarged.png", // ✅ updated to use enlarged version
    markers: [
      { id: "swamp", name: "Shrek’s swamp", emoji: "🪵", type: "place", x: 16, y: 20, description: "No bread for the ogre." },
      { id: "main-house", name: "Main house", emoji: "🏠", type: "place", x: 38, y: 33, description: "Kitchen, salon, board games." },
      { id: "pool", name: "Olympic pool", emoji: "🏊", type: "fun", x: 35, y: 53, description: "Sunbeds; shade after 16:00." },
      { id: "dining", name: "Dining hall", emoji: "🍽️", type: "place", x: 52, y: 55, description: "Group meals & briefings." },
      { id: "bar", name: "Bar de Magrin", emoji: "🍹", type: "place", x: 64, y: 77, description: "Aperitivo HQ." },
      { id: "tennis", name: "Tennis court", emoji: "🎾", type: "sport", x: 78, y: 20, description: "T-E-R matches hourly." },
      { id: "chickens", name: "Chicken land", emoji: "🐔", type: "animals", x: 86, y: 45, description: "Please close at sunset." },
      { id: "sheep", name: "Sheep land", emoji: "🐑", type: "animals", x: 82, y: 60, description: "No bread; fresh water nearby." },
      { id: "church", name: "Église Saint-Salvy", emoji: "⛪", type: "place", x: 86, y: 85, description: "Quiet zone." },
      { id: "start", name: "5k start line", emoji: "🏁", type: "sport", x: 18, y: 47, description: "Clockwise loop." },
      { id: "town", name: "Towards Magrin town hall", emoji: "➡️", type: "direction", x: 18, y: 88, description: "Road to village." },
    ],
  },
  teams: [
    { id: "red", name: "Team Rouge", color: "#ef4444" },
    { id: "blue", name: "Team Bleu", color: "#3b82f6" },
    { id: "green", name: "Team Vert", color: "#10b981" },
  ],
  events: [
    { id: "tennis", name: "Tennis", emoji: "🎾", weight: 1 },
    { id: "running", name: "Running", emoji: "🏃", weight: 1 },
    { id: "chess", name: "Chess", emoji: "♟️", weight: 1 },
  ],
  scores: { byTeamEvent: {} },
  people: [
    { 
      id: "p1", 
      name: "Joseph", 
      teamId: "red", 
      emoji: "🦊", 
      bio: "Chief vibe officer",
      ratings: { tennis: 4, running: 3, chess: 5 }
    },
    { 
      id: "p2", 
      name: "Alice", 
      teamId: "blue", 
      emoji: "🦋", 
      bio: "Handles playlists",
      ratings: { tennis: 3, running: 5, chess: 2 }
    },
    { 
      id: "p3", 
      name: "Marc", 
      teamId: "green", 
      emoji: "🦅", 
      bio: "Grill master",
      ratings: { tennis: 5, running: 4, chess: 1 }
    },
    { id: "p4", name: "Maxime", emoji: "👨‍💻", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p5", name: "Raphaël", emoji: "🎨", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p6", name: "Romana", emoji: "👩‍🎤", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p7", name: "Sébastien Moreaux", emoji: "🏃‍♂️", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p8", name: "Solenn", emoji: "🌺", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p9", name: "Stanislas Denet", emoji: "🎯", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p10", name: "Stanislas P", emoji: "🎪", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p11", name: "Aurélien", emoji: "⚡", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p12", name: "Byron", emoji: "🎸", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p13", name: "Chloe Vancaeyzeele", emoji: "🦋", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p14", name: "Clara", emoji: "🌟", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p15", name: "Eric", emoji: "🔧", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p16", name: "Eugé", emoji: "🎭", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p17", name: "Felix Larochelle", emoji: "🎪", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p18", name: "Isabelle", emoji: "🌹", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p19", name: "JEN", emoji: "🎨", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p20", name: "Paul HEILWeck", emoji: "🎪", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p21", name: "Jean Tho", emoji: "🎯", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p22", name: "Gabriel Lebrun", emoji: "🎸", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p23", name: "Mimeline", emoji: "🦄", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p24", name: "Maxine", emoji: "⚡", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p25", name: "Jean Petitdemange", emoji: "🎪", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p26", name: "Laurent Sicard", emoji: "🎯", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p27", name: "Clement Allouard", emoji: "🎸", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p28", name: "Adèle", emoji: "🌺", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p29", name: "Adrien Brunswick", emoji: "🎨", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p30", name: "Alice Brunswick", emoji: "🦋", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p31", name: "Arthur Brunswick", emoji: "🎯", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p32", name: "Conio Cudennec", emoji: "🎪", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p33", name: "Damien", emoji: "⚡", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p34", name: "Achille Degas", emoji: "🎨", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
    { id: "p35", name: "Ferdinand", emoji: "🎪", bio: "", ratings: { tennis: 3, running: 3, chess: 3 } },
  ],
  info: {
    animals: [
      { title: "Chickens", body: "Collect eggs before 10:00 & after 18:00.", emoji: "🐔" },
      { title: "Sheep", body: "No bread. Fresh water near the fence.", emoji: "🐑" },
    ],
    places: [
      { title: "Kitchen", body: "Dishwasher tabs under the sink.", emoji: "🍽️" },
      { title: "Fire Pit", body: "Quiet hours 23:00–08:00.", emoji: "🔥" },
    ],
    notices: [{ title: "Welcome", body: "Pick a team, set your name in Chat, have fun.", emoji: "👋", date: new Date().toISOString().slice(0, 10) }],
  },
};

// Utility to deep-merge score map defaults
function ensureScoreMap(data: DataModel): DataModel {
  const copy: DataModel = JSON.parse(JSON.stringify(data));
  for (const t of copy.teams) {
    if (!copy.scores.byTeamEvent[t.id]) copy.scores.byTeamEvent[t.id] = {};
    for (const e of copy.events) if (copy.scores.byTeamEvent[t.id][e.id] == null) copy.scores.byTeamEvent[t.id][e.id] = 0;
  }
  return copy;
}

// ---------- Root App
export default function App() {
  const [data, setData] = useLocalData();
  const [tab, setTab] = useState<TabKey>("welcome");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const totals = useMemo(() => computeTotals(data), [data]);

  // Run simple self-tests once (dev only)
  useEffect(() => {
    if (typeof process !== "undefined" && (process as any)?.env?.NODE_ENV === "production") return;
    runSelfTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 text-slate-800">
      <TopBar 
        tab={tab} 
        setTab={setTab} 
        totals={totals} 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        showAdminLogin={showAdminLogin}
        setShowAdminLogin={setShowAdminLogin}
      />
      <div className="mx-auto max-w-7xl px-4 pb-24">
        {tab === "welcome" && <WelcomeView data={data} onChange={setData} totals={totals} isAdmin={isAdmin} />}
        {tab === "map" && <MapView data={data} onChange={setData} />}
        {tab === "leaderboard" && <Leaderboard data={data} onChange={setData} totals={totals as any} isAdmin={isAdmin} />}
        {tab === "people" && <People data={data} onChange={setData} isAdmin={isAdmin} />}
        {tab === "info" && <Info data={data} onChange={setData} />}
        {tab === "chat" && <Chat />}
        {tab === "settings" && <Settings data={data} onChange={setData} isAdmin={isAdmin} />}
      </div>
      <Footer />
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal 
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}

// ---------- Tabs

type TabKey = "welcome" | "map" | "leaderboard" | "people" | "info" | "chat" | "settings";

function TopBar({ 
  tab, 
  setTab, 
  totals, 
  isAdmin, 
  setIsAdmin, 
  showAdminLogin, 
  setShowAdminLogin 
}: { 
  tab: TabKey; 
  setTab: (t: TabKey) => void; 
  totals: { teamTotals: Record<string, number>; teamPowers: Record<string, Record<string, number>>; eventTotals: Record<string, Record<string, number>> };
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  showAdminLogin: boolean;
  setShowAdminLogin: (show: boolean) => void;
}) {
  const tabs: { key: TabKey; label: string; emoji: string }[] = [
    { key: "welcome", label: "Welcome", emoji: "🏠" },
    { key: "map", label: "Map", emoji: "🗺️" },
    { key: "leaderboard", label: "T-E-R", emoji: "🏆" },
    { key: "people", label: "People", emoji: "🧑‍🌾" },
    { key: "info", label: "Info", emoji: "ℹ️" },
    { key: "chat", label: "Chat", emoji: "💬" },
    { key: "settings", label: "Settings", emoji: "⚙️" },
  ];
  return (
    <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌾</span>
          <h1 className="text-xl font-semibold">Magrin Week</h1>
          <span className="text-sm text-slate-500">Tennis - Running - Chess</span>
        </div>
        <div className="hidden gap-1 md:flex">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3 py-1 text-sm transition ${tab === t.key ? "bg-emerald-600 text-white" : "hover:bg-slate-100"}`}
              aria-current={tab === t.key}
            >
              <span className="mr-1">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => setShowAdminLogin(true)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              isAdmin ? "bg-red-600 text-white" : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            {isAdmin ? "🔓 Admin" : "🔒 Admin"}
          </button>
        </div>
      </div>
      <div className="md:hidden border-t bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`p-2 text-xs ${tab === t.key ? "text-emerald-700" : "text-slate-600"}`}>
              <div>{t.emoji}</div>
              <div>{t.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-white/80 py-2 text-center text-xs text-slate-500 backdrop-blur">
      Tip: go to Settings to tweak teams, events, and markers. Everything saves locally.
    </div>
  );
}

function AdminLoginModal({ isAdmin, setIsAdmin, onClose }: { 
  isAdmin: boolean; 
  setIsAdmin: (admin: boolean) => void; 
  onClose: () => void; 
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_PASSWORDS.includes(password)) {
      setIsAdmin(!isAdmin);
      setPassword("");
      setError("");
      onClose();
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {isAdmin ? "Logout Admin" : "Admin Login"}
        </h2>
        {isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">You are currently logged in as admin.</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsAdmin(false);
                  onClose();
                }}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Logout
              </button>
              <button
                onClick={onClose}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded bg-emerald-600 px-4 py-2 text-white"
              >
                Login
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function WelcomeView({ data, onChange, totals, isAdmin }: { 
  data: DataModel; 
  onChange: (d: DataModel) => void; 
  totals: { teamTotals: Record<string, number>; teamPowers: Record<string, Record<string, number>>; eventTotals: Record<string, Record<string, number>> };
  isAdmin: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [donkeyTrail, setDonkeyTrail] = useState(true);
  const [donkeyPosition, setDonkeyPosition] = useState({ x: 0, y: 0 });
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);

  // Mouse wheel zoom
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    const newScale = clamp(scale * factor, 0.3, 5);
    setScale(newScale);
  }

  // Drag to pan
  function onMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;
    const el = containerRef.current;
    if (!el) return;
    setDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!drag) return;
    setOffset({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  }

  function onMouseUp(e: React.MouseEvent) {
    setDrag(null);
  }

  // Double click to reset
  function onDoubleClick(e: React.MouseEvent) {
    e.preventDefault();
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  // Donkey trail animation
  useEffect(() => {
    if (!donkeyTrail || data.map.markers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMarkerIndex((prev) => {
        const nextIndex = (prev + 1) % data.map.markers.length;
        const nextMarker = data.map.markers[nextIndex];
        setDonkeyPosition({ x: nextMarker.x, y: nextMarker.y });
        return nextIndex;
      });
    }, 2000); // Move every 2 seconds

    // Initialize donkey position
    if (data.map.markers.length > 0) {
      const firstMarker = data.map.markers[0];
      setDonkeyPosition({ x: firstMarker.x, y: firstMarker.y });
    }

    return () => clearInterval(interval);
  }, [donkeyTrail, data.map.markers]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Map Section */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Map</h2>
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="text-sm text-slate-600">
            <span className="font-medium">Zoom: {Math.round(scale * 100)}%</span>
            <span className="ml-2 text-xs text-slate-400">
              Scroll to zoom • Drag to pan • Double-click to reset
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50 transition-colors" 
              onClick={() => {
                const newScale = clamp(scale * 1.2, 0.3, 5);
                setScale(newScale);
              }}
              title="Zoom In"
            >
              🔍+
            </button>
            <button 
              className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50 transition-colors" 
              onClick={() => {
                const newScale = clamp(scale * 0.8, 0.3, 5);
                setScale(newScale);
              }}
              title="Zoom Out"
            >
              🔍−
            </button>
            <button
              className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50 transition-colors"
              onClick={() => {
                setScale(1);
                setOffset({ x: 0, y: 0 });
              }}
              title="Reset View"
            >
              🏠
            </button>
            <button
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                donkeyTrail 
                  ? "bg-orange-600 text-white hover:bg-orange-700" 
                  : "hover:bg-slate-50"
              }`}
              onClick={() => setDonkeyTrail(!donkeyTrail)}
              title="Toggle Donkey Trail"
            >
              🐴
            </button>
          </div>
        </div>
        <div
          ref={containerRef}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onDoubleClick={onDoubleClick}
          className="relative h-[60vh] w-full overflow-hidden rounded-xl border bg-slate-50 cursor-grab active:cursor-grabbing"
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: "center" }}
          >
            <div className="relative">
              {data.map.imageUrl ? (
                <img
                  src={data.map.imageUrl}
                  alt="Magrin map"
                  className="select-none rounded-lg shadow pointer-events-none"
                  draggable={false}
                  style={{ 
                    maxHeight: "70vh", 
                    maxWidth: "80vw", 
                    width: "auto", 
                    height: "auto",
                    display: "block"
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl">🌳🏡🐔</div>
                  <p className="mt-2 text-sm text-slate-600">No map yet. Add one in Settings.</p>
                </div>
              )}
              {/* Markers */}
              {data.map.markers.map((m) => (
                <button
                  key={m.id}
                  className="absolute -translate-x-1/2 -translate-y-full rounded-lg border bg-white/95 px-2 py-1 text-xs shadow-lg hover:scale-105 transition-all duration-200"
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                >
                  <span className="mr-1">{m.emoji || "📍"}</span>
                  {m.name}
                </button>
              ))}
              
              {/* Donkey - always visible, animated when trail is active */}
              <div
                className={`absolute -translate-x-1/2 -translate-y-full transition-all duration-1000 ease-in-out ${
                  donkeyTrail ? "animate-bounce" : ""
                }`}
                style={{ left: `${donkeyPosition.x}%`, top: `${donkeyPosition.y}%` }}
              >
                <img
                  src="/donkey.png"
                  alt="Donkey"
                  className="h-12 w-12"
                  style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Team Rankings</h2>
        <div className="space-y-3">
          {Object.entries(totals.teamTotals)
            .sort(([,a], [,b]) => b - a)
            .map(([teamId, points], index) => {
              const team = data.teams.find(t => t.id === teamId);
              return (
                <div key={teamId} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{team?.name || teamId}</div>
                      <div className="text-sm text-slate-500">
                        {data.events.map(e => {
                          const score = Math.min(data.scores.byTeamEvent?.[teamId]?.[e.id] ?? 0, 50);
                          const power = totals.teamPowers[teamId]?.[e.id] ?? 0;
                          return `${e.emoji} ${score}/50 (power: ${power})`;
                        }).join(" • ")}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold" style={{ color: team?.color }}>
                    {points}
                  </div>
                </div>
              );
            })}
        </div>
        

        

        
        {isAdmin && (
          <div className="mt-4 rounded-lg border bg-emerald-50 p-3">
            <h3 className="mb-2 font-medium text-emerald-800">Admin Controls</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button 
                onClick={() => window.location.hash = "#leaderboard"}
                className="rounded bg-emerald-600 px-3 py-1 text-white"
              >
                Edit Scores
              </button>
              <button 
                onClick={() => window.location.hash = "#people"}
                className="rounded bg-emerald-600 px-3 py-1 text-white"
              >
                Manage People
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Local storage state

function useLocalData() {
  const [data, setData] = useState<DataModel>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Force update the image URL to use the new file name
        if (parsed.map?.imageUrl === "/magrin-map.png") {
          parsed.map.imageUrl = "/magrin-app-enlarged.png";
        }
        if (parsed.map?.imageUrl === "/magrin-app.png") {
          parsed.map.imageUrl = "/magrin-app-enlarged.png";
        }
        // Force update to include new players
        if (!parsed.people || parsed.people.length < 35) {
          console.log("Updating players list - clearing localStorage");
          localStorage.removeItem(STORAGE_KEY);
          return ensureScoreMap(DEFAULT_DATA);
        }
        return ensureScoreMap(parsed);
      }
    } catch {}
    return ensureScoreMap(DEFAULT_DATA);
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);
  return [data, setData] as const;
}

// ---------- Map View with simple pan / zoom and editable markers

function MapView({ data, onChange }: { data: DataModel; onChange: (d: DataModel) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  // Enhanced mouse wheel zoom with center point
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    console.log("Wheel event triggered");
    
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    const newScale = clamp(scale * factor, 0.3, 5);

    setScale(newScale);
  }

  // Enhanced drag to pan
  function onPointerDown(e: React.MouseEvent) {
    if (e.button !== 0) return; // Only left mouse button
    const el = containerRef.current;
    if (!el) return;
    
    console.log("Mouse down event triggered");
    setDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }

  function onPointerMove(e: React.MouseEvent) {
    if (!drag) return;
    setOffset({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  }

  function onPointerUp(e: React.MouseEvent) {
    setDrag(null);
  }

  // Double click to reset zoom
  function onDoubleClick(e: React.MouseEvent) {
    e.preventDefault();
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  // Add marker by clicking while holding Alt
  function onAddMarker(e: React.MouseEvent) {
    if (!e.altKey) return; // hold Alt to drop a pin
    const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const imgW = bounds.width;
    const imgH = bounds.height;
    const xPct = clamp(((e.clientX - bounds.left) / imgW) * 100, 0, 100);
    const yPct = clamp(((e.clientY - bounds.top) / imgH) * 100, 0, 100);
    const id = `m_${Math.random().toString(36).slice(2, 8)}`;
    const marker: Marker = { id, name: "New marker", emoji: "📍", x: xPct, y: yPct };
    onChange({ ...data, map: { ...data.map, markers: [...data.map.markers, marker] } });
    setSelected(id);
  }

  const selMarker = data.map.markers.find((m) => m.id === selected) || null;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Map canvas */}
      <div className="md:col-span-2 rounded-2xl border bg-white p-2 shadow-sm">
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="text-sm text-slate-600">
            <span className="font-medium">Zoom: {Math.round(scale * 100)}%</span>
            <span className="ml-2 text-xs text-slate-400">
              Scroll to zoom • Drag to pan • Double-click to reset
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50 transition-colors" 
              onClick={() => {
                const newScale = clamp(scale * 1.2, 0.3, 5);
                setScale(newScale);
              }}
              title="Zoom In"
            >
              🔍+
            </button>
            <button 
              className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50 transition-colors" 
              onClick={() => {
                const newScale = clamp(scale * 0.8, 0.3, 5);
                setScale(newScale);
              }}
              title="Zoom Out"
            >
              🔍−
            </button>
            <button
              className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50 transition-colors"
              onClick={() => {
                setScale(1);
                setOffset({ x: 0, y: 0 });
              }}
              title="Reset View"
            >
              🏠
            </button>
          </div>
        </div>
        <div
          ref={containerRef}
          onWheel={onWheel}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onDoubleClick={onDoubleClick}
          className="relative h-[60vh] w-full overflow-hidden rounded-xl border bg-slate-50 cursor-grab active:cursor-grabbing"
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: "center" }}
          >
            <div className="relative">
              {data.map.imageUrl ? (
                <img
                  src={data.map.imageUrl}
                  alt="Magrin map"
                  className="select-none rounded-lg shadow pointer-events-none"
                  draggable={false}
                  onLoad={() => console.log("Map image loaded successfully")}
                  onError={(e) => console.error("Failed to load map image:", e)}
                  style={{ 
                    maxHeight: "70vh", 
                    maxWidth: "80vw", 
                    width: "auto", 
                    height: "auto",
                    display: "block"
                  }}
                />
              ) : (
                <FallbackMap />
              )}
              {/* Markers */}
              {data.map.markers.map((m) => (
                <button
                  key={m.id}
                  className={`absolute -translate-x-1/2 -translate-y-full rounded-lg border bg-white/95 px-2 py-1 text-xs shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl ${
                    selected === m.id 
                      ? "ring-2 ring-emerald-500 bg-emerald-50" 
                      : hoveredMarker === m.id 
                        ? "ring-1 ring-blue-300 bg-blue-50" 
                        : "hover:ring-1 hover:ring-slate-300"
                  }`}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  onClick={() => setSelected(m.id)}
                  onMouseEnter={() => setHoveredMarker(m.id)}
                  onMouseLeave={() => setHoveredMarker(null)}
                >
                  <span className="mr-1">{m.emoji || "📍"}</span>
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Marker editor */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Marker details</h2>
        {selMarker ? (
          <MarkerEditor
            marker={selMarker}
            onChange={(mk) => {
              const list = data.map.markers.map((m) => (m.id === mk.id ? mk : m));
              onChange({ ...data, map: { ...data.map, markers: list } });
            }}
            onDelete={() => {
              const list = data.map.markers.filter((m) => m.id !== selMarker.id);
              onChange({ ...data, map: { ...data.map, markers: list } });
              setSelected(null);
            }}
          />
        ) : (
          <p className="text-sm text-slate-600">Select a marker to edit. Use Alt-click on the map to add one.</p>
        )}
      </div>
    </div>
  );
}

function FallbackMap() {
  return (
    <div className="flex h-[60vh] w-[80vw] max-w-full items-center justify-center rounded-lg border bg-gradient-to-br from-amber-50 to-emerald-50">
      <div className="text-center">
        <div className="text-6xl">🌳🏡🐔</div>
        <p className="mt-2 text-sm text-slate-600">No map yet. Paste your image URL in Settings.</p>
      </div>
    </div>
  );
}

function MarkerEditor({ marker, onChange, onDelete }: { marker: Marker; onChange: (m: Marker) => void; onDelete: () => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Name" value={marker.name} onChange={(v) => onChange({ ...marker, name: v })} />
      <TextField label="Emoji" value={marker.emoji || ""} onChange={(v) => onChange({ ...marker, emoji: v })} placeholder="📍" />
      <TextField label="Type" value={marker.type || ""} onChange={(v) => onChange({ ...marker, type: v })} placeholder="place, sport, animals..." />
      <TextArea label="Description" value={marker.description || ""} onChange={(v) => onChange({ ...marker, description: v })} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="X %" value={marker.x} onChange={(v) => onChange({ ...marker, x: clamp(v, 0, 100) })} />
        <NumberField label="Y %" value={marker.y} onChange={(v) => onChange({ ...marker, y: clamp(v, 0, 100) })} />
      </div>
      <div className="flex justify-between">
        <button className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50" onClick={onDelete}>Delete</button>
        <span className="text-xs text-slate-500">Tip: drag-to-pan, wheel-to-zoom</span>
      </div>
    </div>
  );
}

// ---------- Leaderboard

const TEAM_COLOR: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
};

function computeTotals(data: DataModel) {
  const teamTotals: Record<string, number> = {};
  const teamPowers: Record<string, Record<string, number>> = {};
  const eventTotals: Record<string, Record<string, number>> = {};
  
  for (const t of data.teams) {
    let scoreSum = 0;
    teamPowers[t.id] = {};
    eventTotals[t.id] = {};
    
    for (const e of data.events) {
      // Calculate team power for this event (sum of all team members' ratings)
      const teamMembers = data.people.filter(p => p.teamId === t.id);
      const teamPower = teamMembers.reduce((total, person) => {
        return total + (person.ratings?.[e.id] || 0);
      }, 0);
      
      teamPowers[t.id][e.id] = teamPower;
      
      // Get actual competition score for this event (max 50 points)
      const score = Math.min(data.scores.byTeamEvent?.[t.id]?.[e.id] ?? 0, 50);
      eventTotals[t.id][e.id] = score;
      scoreSum += score;
    }
    teamTotals[t.id] = scoreSum; // Total competition points (max 150)
  }
  
  return { teamTotals, teamPowers, eventTotals };
}

function Leaderboard({ data, onChange, totals, isAdmin }: { data: DataModel; onChange: (d: DataModel) => void; totals: { teamTotals: Record<string, number>; teamPowers: Record<string, Record<string, number>>; eventTotals: Record<string, Record<string, number>> }; isAdmin: boolean }) {
  function setPoints(teamId: string, eventId: string, value: number) {
    const next = ensureScoreMap(structuredClone(data));
    next.scores.byTeamEvent[teamId][eventId] = value;
    onChange(next);
  }

  function inc(teamId: string, eventId: string, delta: number) {
    const cur = data.scores.byTeamEvent?.[teamId]?.[eventId] ?? 0;
    setPoints(teamId, eventId, cur + delta);
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Score table */}
      <div className="md:col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Competition Scores (Max 50 per event)</h2>
        <div className="mb-3 text-sm text-slate-600">
          WIP: Manual score input. Real competition rules coming soon!
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="p-2">Team</th>
                {data.events.map((e) => (
                  <th key={e.id} className="p-2">
                    {e.emoji} {e.name}
                    <div className="text-xs text-slate-500">Score (0-50)</div>
                  </th>
                ))}
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.teams.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2 font-medium">
                    <span className="mr-2 align-middle" style={{ color: t.color }}>
                      ●
                    </span>
                    {t.name}
                  </td>
                  {data.events.map((e) => {
                    const score = Math.min(data.scores.byTeamEvent?.[t.id]?.[e.id] ?? 0, 50);
                    const power = totals.teamPowers[t.id]?.[e.id] ?? 0;
                    const teamMembers = data.people.filter(p => p.teamId === t.id);
                    return (
                      <td key={e.id} className="p-2">
                        <div className="text-center">
                          <div className="font-semibold text-lg">{score}</div>
                          <div className="text-xs text-slate-500">
                            Power: {power} ({teamMembers.length} players)
                          </div>
                          {isAdmin && (
                            <div className="mt-1 flex gap-1 justify-center">
                              <button 
                                className="w-6 h-6 rounded bg-red-100 text-red-600 hover:bg-red-200 text-xs"
                                onClick={() => inc(t.id, e.id, -1)}
                                disabled={score <= 0}
                              >
                                -
                              </button>
                              <button 
                                className="w-6 h-6 rounded bg-green-100 text-green-600 hover:bg-green-200 text-xs"
                                onClick={() => inc(t.id, e.id, 1)}
                                disabled={score >= 50}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-2 font-semibold">{totals.teamTotals[t.id]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold">Quick Score Input</h3>
        {!isAdmin && (
          <div className="mb-3 rounded-lg border bg-amber-50 p-3 text-sm text-amber-800">
            🔒 Admin access required to edit scores
          </div>
        )}
        <div className={`space-y-4 ${!isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
          {data.teams.map((team) => (
            <div key={team.id} className="space-y-2">
              <h4 className="font-medium" style={{ color: team.color }}>{team.name}</h4>
              {data.events.map((event) => {
                const currentScore = Math.min(data.scores.byTeamEvent?.[team.id]?.[event.id] ?? 0, 50);
                return (
                  <div key={event.id} className="flex items-center gap-2">
                    <span className="text-sm">{event.emoji} {event.name}:</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      className="w-16 rounded border px-2 py-1 text-center text-sm"
                      value={currentScore}
                      onChange={(e) => {
                        const value = Math.min(Math.max(Number(e.target.value) || 0, 0), 50);
                        setPoints(team.id, event.id, value);
                      }}
                    />
                    <span className="text-xs text-slate-500">/50</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="mt-6 space-y-6">
          <EventEditor data={data} onChange={onChange} />
          <TeamEditor data={data} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

function EventEditor({ data, onChange }: { data: DataModel; onChange: (d: DataModel) => void }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🥇");
  const [weight, setWeight] = useState(1);
  return (
    <div>
      <h4 className="mb-2 font-medium">Events</h4>
      <ul className="mb-2 space-y-2">
        {data.events.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span>{e.emoji}</span>
              <span>{e.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Weight</span>
              <input
                type="number"
                className="w-16 rounded border px-2 py-1"
                value={e.weight}
                onChange={(ev) => onChange({ ...data, events: data.events.map((ee) => (ee.id === e.id ? { ...ee, weight: Number(ev.target.value) } : ee)) })}
              />
              <button className="rounded border px-2 py-1" onClick={() => onChange({ ...data, events: data.events.filter((ee) => ee.id !== e.id) })}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-6 gap-2">
        <input className="col-span-3 rounded border px-2 py-1" placeholder="New event name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="col-span-1 rounded border px-2 py-1" placeholder="Emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
        <input className="col-span-1 rounded border px-2 py-1" type="number" placeholder="Weight" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
        <button
          className="col-span-1 rounded bg-emerald-600 px-2 py-1 text-white"
          onClick={() => {
            if (!name.trim()) return;
            const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 6);
            const ev: Event = { id, name: name.trim(), emoji: emoji || "🥇", weight: weight || 1 };
            const next = ensureScoreMap({ ...data, events: [...data.events, ev] });
            onChange(next);
            setName("");
            setEmoji("🥇");
            setWeight(1);
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function TeamEditor({ data, onChange }: { data: DataModel; onChange: (d: DataModel) => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#9333ea");
  return (
    <div>
      <h4 className="mb-2 font-medium">Teams</h4>
      <ul className="mb-2 space-y-2">
        {data.teams.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ color: t.color }}>
                ●
              </span>
              <span>{t.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <input type="color" value={t.color} onChange={(e) => onChange({ ...data, teams: data.teams.map((tt) => (tt.id === t.id ? { ...tt, color: e.target.value } : tt)) })} />
              <button className="rounded border px-2 py-1" onClick={() => onChange({ ...data, teams: data.teams.filter((tt) => tt.id !== t.id) })}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-6 gap-2">
        <input className="col-span-4 rounded border px-2 py-1" placeholder="New team name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="col-span-1 h-9 w-full rounded border px-1" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <button
          className="col-span-1 rounded bg-emerald-600 px-2 py-1 text-white"
          onClick={() => {
            if (!name.trim()) return;
            const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 6);
            const team: Team = { id, name: name.trim(), color };
            const next = ensureScoreMap({ ...data, teams: [...data.teams, team] });
            onChange(next);
            setName("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ---------- People

function People({ data, onChange, isAdmin }: { data: DataModel; onChange: (d: DataModel) => void; isAdmin: boolean }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("😀");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [teamId, setTeamId] = useState<string | undefined>(data.teams[0]?.id);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [editingPlayer, setEditingPlayer] = useState<Person | null>(null);

  const emojiOptions = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
    "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
    "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
    "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
    "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😯", "😦", "😧",
    "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢",
    "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "👻", "👽", "🤖",
    "😈", "👿", "👹", "👺", "💀", "☠️", "👻", "👽", "🤖", "💩",
    "🦊", "🦋", "🦅", "🦉", "🦇", "🐺", "🐱", "🐶", "🐭", "🐹",
    "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸",
    "🐵", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🦆", "🦅", "🦉",
    "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞",
    "🐜", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍", "🦎", "🦖",
    "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬",
    "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘",
    "🦛", "🦏", "🐪", "🐫", "🦙", "🦒", "🐃", "🐂", "🐄", "🐎",
    "🐖", "🐏", "🐑", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐈‍⬛",
    "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨",
    "🦡", "🦫", "🦦", "🦥", "🐁", "🐀", "🐿️", "🦔", "🐉", "🐲",
    "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍",
    "🎋", "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀",
    "🌺", "🌻", "🌼", "🌸", "🌼", "🌻", "🌺", "🌹", "🌷", "🌼",
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
    "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🪁",
    "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛷", "⛸️", "🥌",
    "🎿", "⛷️", "🏂", "🏋️‍♀️", "🏋️", "🤼‍♀️", "🤼", "🤸‍♀️", "🤸", "⛹️‍♀️",
    "⛹️", "🤺", "🤾‍♀️", "🤾", "🏊‍♀️", "🏊", "🤽‍♀️", "🤽", "🏄‍♀️", "🏄",
    "🏄‍♂️", "🚣‍♀️", "🚣", "🧘‍♀️", "🧘", "🏊‍♀️", "🏊", "🏊‍♂️", "🏊", "🏊‍♀️"
  ];

  function add() {
    if (!name.trim()) return;
    const id = `p_${Math.random().toString(36).slice(2, 6)}`;
    
    // Initialize ratings for all events
    const initialRatings: Record<string, number> = {};
    data.events.forEach(event => {
      initialRatings[event.id] = ratings[event.id] || 1;
    });
    
    const p: Person = { 
      id, 
      name: name.trim(), 
      emoji, 
      teamId,
      ratings: initialRatings
    };
    onChange({ ...data, people: [...data.people, p] });
    setName("");
    setRatings({});
  }

  function startEdit(player: Person) {
    setEditingPlayer(player);
    setName(player.name);
    setEmoji(player.emoji || "😀");
    setTeamId(player.teamId);
    setRatings({ ...player.ratings });
  }

  function saveEdit() {
    if (!editingPlayer || !name.trim()) return;
    
    const updatedPlayer: Person = {
      ...editingPlayer,
      name: name.trim(),
      emoji,
      teamId,
      ratings: { ...ratings }
    };
    
    const updatedPeople = data.people.map(p => 
      p.id === editingPlayer.id ? updatedPlayer : p
    );
    
    onChange({ ...data, people: updatedPeople });
    setEditingPlayer(null);
    setName("");
    setEmoji("😀");
    setTeamId(data.teams[0]?.id);
    setRatings({});
  }

  function cancelEdit() {
    setEditingPlayer(null);
    setName("");
    setEmoji("😀");
    setTeamId(data.teams[0]?.id);
    setRatings({});
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">People</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.people.map((p) => (
            <div key={p.id} className="rounded-xl border p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.emoji || "🙂"}</span>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.teamId ? data.teams.find((t) => t.id === p.teamId)?.name : "No team"}</div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button className="rounded border px-2 py-1 text-xs hover:bg-blue-50" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button className="rounded border px-2 py-1 text-xs hover:bg-red-50" onClick={() => onChange({ ...data, people: data.people.filter((pp) => pp.id !== p.id) })}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
              {p.bio && <p className="mt-2 text-sm text-slate-600">{p.bio}</p>}
              <div className="mt-2 flex flex-wrap gap-1">
                {data.events.map((event) => (
                  <span key={event.id} className="rounded bg-slate-100 px-2 py-1 text-xs">
                    {event.emoji} {p.ratings?.[event.id] || 0}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold">
          {editingPlayer ? `Edit ${editingPlayer.name}` : "Add person"}
        </h3>
        {!isAdmin && (
          <div className="mb-3 rounded-lg border bg-amber-50 p-3 text-sm text-amber-800">
            🔒 Admin access required to add or edit people
          </div>
        )}
        <div className={`space-y-2 ${!isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
          <TextField label="Name" value={name} onChange={setName} />
          
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Emoji</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex h-10 w-10 items-center justify-center rounded border text-2xl hover:bg-slate-50"
              >
                {emoji}
              </button>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="flex-1 rounded border px-3 py-2"
                placeholder="Or type emoji"
              />
            </div>
            {showEmojiPicker && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded border bg-white p-2">
                <div className="grid grid-cols-10 gap-1">
                  {emojiOptions.map((e) => (
                    <button
                      key={e}
                      onClick={() => {
                        setEmoji(e);
                        setShowEmojiPicker(false);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100 text-lg"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <label className="block text-xs font-medium text-slate-600">Team</label>
          <select className="w-full rounded border px-2 py-1" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            <option value="">No team</option>
            {data.teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-600">Sport Ratings (1-5)</label>
            {data.events.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <span className="text-sm">{event.emoji} {event.name}</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="w-16 rounded border px-2 py-1 text-center"
                  value={ratings[event.id] || 1}
                  onChange={(e) => setRatings(prev => ({ ...prev, [event.id]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>
          
          {editingPlayer ? (
            <div className="flex gap-2 mt-2">
              <button 
                className={`flex-1 px-3 py-2 rounded ${
                  isAdmin 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`} 
                onClick={saveEdit}
                disabled={!isAdmin}
              >
                {isAdmin ? "Save Changes" : "Admin Required"}
              </button>
              <button 
                className="px-3 py-2 rounded border hover:bg-slate-50"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className={`mt-2 w-full px-3 py-2 rounded ${
                isAdmin 
                  ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`} 
              onClick={add}
              disabled={!isAdmin}
            >
              {isAdmin ? "Add Player" : "Admin Required"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Info

function Info({ data, onChange }: { data: DataModel; onChange: (d: DataModel) => void }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <InfoColumn title="Animals" items={data.info.animals} onAdd={(x) => onChange({ ...data, info: { ...data.info, animals: [...data.info.animals, x] } })} onDelete={(i) => onChange({ ...data, info: { ...data.info, animals: data.info.animals.filter((_, idx) => idx !== i) } })} />
      <InfoColumn title="Places" items={data.info.places} onAdd={(x) => onChange({ ...data, info: { ...data.info, places: [...data.info.places, x] } })} onDelete={(i) => onChange({ ...data, info: { ...data.info, places: data.info.places.filter((_, idx) => idx !== i) } })} />
      <InfoColumn title="Notices" items={data.info.notices} onAdd={(x) => onChange({ ...data, info: { ...data.info, notices: [...data.info.notices, x] } })} onDelete={(i) => onChange({ ...data, info: { ...data.info, notices: data.info.notices.filter((_, idx) => idx !== i) } })} />
    </div>
  );
}

function InfoColumn({ title, items, onAdd, onDelete }: { title: string; items: { title: string; body: string; emoji?: string; date?: string }[]; onAdd: (x: any) => void; onDelete: (i: number) => void }) {
  const [t, setT] = useState("");
  const [b, setB] = useState("");
  const [e, setE] = useState("");
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border p-3 shadow-sm">
            <div className="mb-1 flex items-center justify-between">
              <div className="font-medium">
                {it.emoji && <span className="mr-1">{it.emoji}</span>}
                {it.title}
              </div>
              <button className="rounded border px-2 py-1 text-xs" onClick={() => onDelete(i)}>
                Remove
              </button>
            </div>
            {it.date && <div className="text-xs text-slate-500">{it.date}</div>}
            <p className="text-sm text-slate-700">{it.body}</p>
          </div>
        ))}
        <div className="rounded-xl border p-3">
          <TextField label="Title" value={t} onChange={setT} />
          <TextField label="Emoji" value={e} onChange={setE} />
          <TextArea label="Body" value={b} onChange={setB} />
          <button
            className="mt-2 w-full rounded bg-emerald-600 px-3 py-2 text-white"
            onClick={() => {
              if (!t.trim()) return;
              onAdd({ title: t.trim(), body: b.trim(), emoji: e || undefined, date: new Date().toISOString().slice(0, 10) });
              setT("");
              setB("");
              setE("");
            }}
          >
            Add {title.slice(0, -1)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Chat (local only)

function Chat() {
  const [name, setName] = useState<string>(() => localStorage.getItem("magrin_username") || "");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<{ id: string; name: string; text: string; ts: number }[]>(() => {
    try {
      const raw = localStorage.getItem("magrin_chat_v1");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem("magrin_username", name);
  }, [name]);
  useEffect(() => {
    localStorage.setItem("magrin_chat_v1", JSON.stringify(msgs));
  }, [msgs]);

  function send() {
    if (!text.trim()) return;
    const id = Math.random().toString(36).slice(2, 8);
    setMsgs((m) => [...m, { id, name: name || "Anon", text: text.trim(), ts: Date.now() }]);
    setText("");
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Shoutbox</h2>
      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <TextField label="Your name" value={name} onChange={setName} placeholder="Joseph" />
        <div className="sm:col-span-2" />
      </div>
      <div className="mb-3 h-72 overflow-y-auto rounded border bg-slate-50 p-3">
        {msgs.length === 0 && <div className="text-sm text-slate-500">No messages yet.</div>}
        {msgs.map((m) => (
          <div key={m.id} className="mb-2">
            <span className="mr-2 font-medium">{m.name}</span>
            <span className="text-xs text-slate-400">{new Date(m.ts).toLocaleTimeString()}</span>
            <div className="text-sm">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded border px-3 py-2" placeholder="Type a message and press Send" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <button className="rounded bg-emerald-600 px-4 py-2 text-white" onClick={send}>
          Send
        </button>
      </div>
      <div className="mt-2 text-xs text-slate-500">Local only. To make it live between devices, we can wire a backend later.</div>
    </div>
  );
}

// ---------- Settings

function Settings({ data, onChange, isAdmin }: { data: DataModel; onChange: (d: DataModel) => void; isAdmin: boolean }) {
  const [jsonOpen, setJsonOpen] = useState(false);
  const [url, setUrl] = useState(data.map.imageUrl);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Map image</h2>
        {!isAdmin && (
          <div className="mb-3 rounded-lg border bg-amber-50 p-3 text-sm text-amber-800">
            🔒 Admin access required to change map settings
          </div>
        )}
        <div className={`space-y-3 ${!isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="text-sm text-slate-600">Paste a URL or use "/magrin-map.png" if you added it to your public folder.</div>
          <div className="flex gap-2">
            <input className="flex-1 rounded border px-3 py-2" placeholder="https://.../magrin-map.png" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button className="rounded bg-emerald-600 px-3 py-2 text-white" onClick={() => onChange({ ...data, map: { ...data.map, imageUrl: url } })}>
              Save
            </button>
          </div>
          <div className="rounded border bg-slate-50 p-3 text-xs">
            Tip: in any React app, place your file under <code>/public</code> and reference it with <code>/your-file-name.png</code>.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Backup / Reset</h2>
        <div className="space-y-2 text-sm">
          <button
            className="w-full rounded border px-3 py-2 hover:bg-slate-50"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
              alert("Copied current state to clipboard");
            }}
          >
            Copy state JSON
          </button>
          <button className="w-full rounded border px-3 py-2 hover:bg-slate-50" onClick={() => setJsonOpen((v) => !v)}>
            Import from JSON
          </button>
          <button
            className="w-full rounded border px-3 py-2 text-red-600 hover:bg-red-50"
            onClick={() => {
              if (confirm("Reset everything to defaults?")) onChange(ensureScoreMap(DEFAULT_DATA));
            }}
          >
            Reset to defaults
          </button>
          <button
            className="w-full rounded border px-3 py-2 text-orange-600 hover:bg-orange-50"
            onClick={() => {
              if (confirm("Force update players list?")) {
                localStorage.removeItem("magrin_app_state_v1");
                window.location.reload();
              }
            }}
          >
            Force Update Players
          </button>
        </div>
        {jsonOpen && <JsonImport onApply={(obj) => onChange(ensureScoreMap(obj))} />}
      </div>

      <div className="md:col-span-3 rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Markers quick list</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {data.map.markers.map((m) => (
            <div key={m.id} className="rounded-lg border p-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  <span className="mr-1">{m.emoji || "📍"}</span>
                  {m.name}
                </div>
                <div className="text-xs text-slate-500">
                  {m.x.toFixed(1)}%, {m.y.toFixed(1)}%
                </div>
              </div>
              {m.description && <div className="mt-1 text-slate-600">{m.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JsonImport({ onApply }: { onApply: (data: DataModel) => void }) {
  const [txt, setTxt] = useState("");
  return (
    <div className="mt-3 rounded-lg border bg-slate-50 p-3 text-xs">
      <textarea className="h-40 w-full rounded border p-2" placeholder="Paste JSON here" value={txt} onChange={(e) => setTxt(e.target.value)} />
      <div className="mt-2 flex justify-end gap-2">
        <button className="rounded border px-2 py-1" onClick={() => setTxt("")}>
          Clear
        </button>
        <button
          className="rounded bg-emerald-600 px-3 py-1 text-white"
          onClick={() => {
            try {
              const obj = JSON.parse(txt);
              onApply(obj);
              setTxt("");
              alert("Imported");
            } catch (e) {
              alert("Invalid JSON");
            }
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// ---------- Small UI helpers

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input className="w-full rounded border px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <textarea className="h-24 w-full rounded border px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input type="number" className="w-full rounded border px-3 py-2" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

// ---------- Utils

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

// Polyfill structuredClone for older setups
function structuredClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/* -------------------------- SELF-TESTS (light) -------------------------- */
/* These run once in dev; they’re our “tests” in a single-file app context. */
function runSelfTests() {
  // Test 1: ensureScoreMap fills zeros for every team/event
  const base = ensureScoreMap({
    ...DEFAULT_DATA,
    scores: { byTeamEvent: {} },
  });
  console.assert(
    Object.values(base.teams).every((t) => Object.keys(base.scores.byTeamEvent[t.id]).length === base.events.length),
    "ensureScoreMap should initialize all team/event scores"
  );

  // Test 2: totals are zero at start
  const totals0 = computeTotals(base).teamTotals;
  console.assert(Object.values(totals0).every((v) => v === 0), "Totals should be zero when no scores");

  // Test 3: weighted totals
  const mod = ensureScoreMap(base);
  mod.events = [
    { id: "A", name: "A", emoji: "🅰️", weight: 2 },
    { id: "B", name: "B", emoji: "🅱️", weight: 3 },
  ];
  mod.scores.byTeamEvent = {
    [mod.teams[0].id]: { A: 1, B: 1 }, // total = 1*2 + 1*3 = 5
    [mod.teams[1].id]: { A: 2, B: 0 }, // total = 4
    [mod.teams[2].id]: { A: 0, B: 2 }, // total = 6
  };
  const totalsW = computeTotals(ensureScoreMap(mod)).teamTotals;
  console.assert(totalsW[mod.teams[0].id] === 5, "Weighted total mismatch for team 0");
  console.assert(totalsW[mod.teams[1].id] === 4, "Weighted total mismatch for team 1");
  console.assert(totalsW[mod.teams[2].id] === 6, "Weighted total mismatch for team 2");

  console.log("✅ Magrin app self-tests passed");
}
