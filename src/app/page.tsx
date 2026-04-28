'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [selectedIcons, setSelectedIcons] = useState<string[]>(['javascript', 'typescript', 'react', 'nextjs', 'tailwindcss', 'nodejs']);
  const [theme, setTheme] = useState('dark');
  const [perline, setPerline] = useState(15);
  const [baseUrl, setBaseUrl] = useState('');
  const [mounted, setMounted] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestName, setRequestName] = useState('');
  const [requestLink, setRequestLink] = useState('');
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [localInput, setLocalInput] = useState('');

  const toggleIcon = (id: string) => {
    const normalizedId = id.toLowerCase().trim();
    if (!normalizedId) return;
    setSelectedIcons((prev) => {
      const newIcons = prev.includes(normalizedId)
        ? prev.filter((i) => i !== normalizedId)
        : [...prev, normalizedId];
      return newIcons;
    });
  };

  useEffect(() => {
    // Only sync if the change came from outside the input (e.g. gallery click)
    const normalizedLocal = localInput.split(',').map(s => s.trim()).filter(Boolean);
    if (JSON.stringify(normalizedLocal) !== JSON.stringify(selectedIcons)) {
      setLocalInput(selectedIcons.join(', '));
    }
  }, [selectedIcons]);

  useEffect(() => {
    setMounted(true);
    setBaseUrl(window.location.origin);
    setTimestamp(Date.now().toString());

    // Fetch available icons
    fetch('/api/icons/list')
      .then(res => res.json())
      .then(data => setAvailableIcons(data.icons || []))
      .catch(err => console.error('Failed to load icons list:', err));
  }, []);

  // Update timestamp when relevant state changes to bust cache
  useEffect(() => {
    if (mounted) {
      setTimestamp(Date.now().toString());
    }
  }, [selectedIcons, theme, perline, mounted]);

  const markdownLink = `![My Skills](${baseUrl}/api/icons?i=${selectedIcons.join(',')}&theme=${theme}&perline=${perline})`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('Sending...');

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iconName: requestName, iconLink: requestLink }),
      });
      if (res.ok) {
        setRequestStatus('Thank you! Request received.');
        setRequestName('');
        setRequestLink('');
      } else {
        setRequestStatus('Error submitting request.');
      }
    } catch (err) {
      setRequestStatus('Connection error.');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter">
            SkillIcons<span className="text-purple-500">Plus</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <a href="#configurator" className="hover:text-white transition-colors">Configurator</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#request" className="hover:text-white transition-colors">Request</a>
          </div>
          <div className="flex items-center gap-4">
            {/* Navbar empty for now */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Your Stack, <br /> More <span className="text-purple-500">Powerful</span>.
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Beautiful, dynamic tech icons for your GitHub profile.
            Now with easy sharing and community requests.
          </p>
        </div>
      </div>

      {/* Configurator Section */}
      <section id="configurator" className="container mx-auto px-6 py-10 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left Side: Controls */}
          <div className="space-y-8 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 backdrop-blur-2xl shadow-2xl">
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-medium text-gray-400">Selected Icons</label>
                <span className="text-xs text-gray-600">Comma separated IDs</span>
              </div>
              <input
                type="text"
                value={localInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalInput(val);
                  // Update the actual icons array, filtering out empty entries while typing
                  const icons = val.split(',').map(s => s.trim()).filter(Boolean);
                  setSelectedIcons(icons);
                }}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                placeholder="js, ts, react, tailwind..."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedIcons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => toggleIcon(icon)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-[10px] font-medium text-purple-400 hover:bg-purple-500/20 transition-colors group"
                  >
                    {icon}
                    <svg className="w-3 h-3 text-purple-500/50 group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-4">Theme</label>
                <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-2xl">
                  {['dark', 'light'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${theme === t ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-4">Icons Per Line</label>
                <input
                  type="number"
                  min="1"
                  value={perline}
                  onChange={(e) => setPerline(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <label className="block text-sm font-medium text-gray-400 mb-4">Markdown Code</label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-black/60 rounded-2xl border border-white/5 p-1 overflow-hidden">
                  <code className="flex-1 px-4 py-3 text-xs text-purple-300/80 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {markdownLink}
                  </code>
                  <button
                    onClick={() => copyToClipboard(markdownLink)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="sticky top-24 space-y-8">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-semibold tracking-tight">Live Preview</h3>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-purple-500 rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000" />
              <div className="relative bg-white/[0.03] rounded-[2.5rem] border border-white/5 p-12 min-h-[400px] flex flex-col items-center justify-center backdrop-blur-3xl overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/icons?i=${selectedIcons.join(',')}&theme=${theme}&perline=${perline}${timestamp ? `&t=${timestamp}` : ''}`}
                  alt="Preview"
                  className="max-w-full drop-shadow-[0_20px_50px_rgba(168,85,247,0.3)] transition-transform duration-500 hover:scale-105"
                />

                <div className="mt-12 space-y-2 text-center">
                  <p className="text-sm font-medium text-gray-500">Preview generated in real-time</p>
                  <p className="text-[10px] text-gray-700 uppercase tracking-[0.2em]">High Performance SVG API</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Icon Gallery Section */}
      <section id="gallery" className="container mx-auto px-6 py-20 scroll-mt-20">
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Icon Gallery</h2>
              <p className="text-gray-500">Discover all {availableIcons.length} available icons.</p>
            </div>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
            {availableIcons
              .filter(icon => icon.includes(searchQuery.toLowerCase()))
              .map((icon) => (
                <button
                  key={icon}
                  onClick={() => toggleIcon(icon)}
                  className={`group relative p-3 rounded-xl border transition-all hover:scale-110 active:scale-95 ${selectedIcons.includes(icon) ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  title={icon}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/icons?i=${icon}&theme=${theme}${timestamp ? `&t=${timestamp}` : ''}`}
                    alt={icon}
                    className="w-full h-auto"
                  />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-black border border-white/10 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">{icon}</span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* Request Grid */}
      <section className="container mx-auto px-6 py-32 flex justify-center">


        {/* Request Icon */}
        <div id="request" className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 scroll-mt-20 max-w-2xl w-full">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Request Icon</h2>
          </div>

          <form onSubmit={handleRequest} className="space-y-4">
            <input
              type="text"
              placeholder="Icon Name (e.g. Bun)"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
            <input
              type="url"
              placeholder="Link to SVG/Logo (Optional)"
              value={requestLink}
              onChange={(e) => setRequestLink(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20">
              Submit Request
            </button>
            {requestStatus && (
              <p className="text-center text-sm text-blue-400 mt-4">{requestStatus}</p>
            )}
          </form>
        </div>

      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="text-gray-600 text-sm tracking-widest uppercase mb-4">SkillIconsPlus</div>
        <p className="text-gray-400">© 2026 Crafted by Ivan for the Global Developer Community.</p>
        <div className="mt-8 flex justify-center gap-8 text-gray-500">
          <a href="https://github.com/Rinkoff" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>
    </main>
  );
}
