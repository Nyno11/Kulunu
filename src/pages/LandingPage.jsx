import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface font-body">
      <div className="max-w-5xl mx-auto px-6">
        {/* Nav */}
        <nav className="flex items-center gap-7 py-5">
          <Link to="/" className="flex items-center gap-2.5 mr-auto">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg bg-gradient-to-br from-brand to-navy">k</div>
            <span className="font-heading font-black text-xl tracking-tight">kulunu</span>
          </Link>
          <Link to="/discover" className="text-sm font-medium text-gray-600 hover:text-brand hidden md:block">Discover</Link>
          <a href="#how" className="text-sm font-medium text-gray-600 hover:text-brand hidden md:block">How it works</a>
          <a href="#organizers" className="text-sm font-medium text-gray-600 hover:text-brand hidden md:block">For organizers</a>
          <Link to="/discover" className="px-5 py-2.5 rounded-full text-white text-sm font-bold bg-brand">Explore events</Link>
        </nav>

        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-14 md:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 bg-blue-50 text-brand">
              <span className="w-2 h-2 rounded-full animate-pulse bg-brand"></span>
              Live in your city
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-black leading-none tracking-tighter mb-5">
              Every event.<br/>One place.<br/><span className="text-brand">Zero hassle.</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-500 max-w-md mb-8">
              Kulunu is where events find their people. Discover what's on, book in seconds, and walk in with a QR ticket — no printouts, no queues.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/discover" className="px-7 py-4 rounded-2xl text-white font-bold bg-brand">Find an event</Link>
              <Link to="/login" className="px-6 py-4 rounded-2xl font-semibold border border-gray-200">Host on Kulunu</Link>
            </div>
            <div className="flex gap-9 mt-10 flex-wrap">
              {[['4,200+','events listed'],['180k','tickets scanned'],['98%','check-ins under 5s']].map(([num,label]) => (
                <div key={label}>
                  <div className="text-2xl font-heading font-black">{num}</div>
                  <div className="text-sm text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="hidden md:flex justify-center relative">
            <div className="absolute inset-y-8 -inset-x-4 rounded-3xl bg-gradient-to-br from-navy to-navy-light"></div>
            <div className="relative w-72 rounded-3xl p-3.5 border mt-11 -mb-8 shadow-xl bg-card border-gray-200">
              <div className="rounded-2xl overflow-hidden border bg-white border-gray-200">
                <div className="p-4 pb-3">
                  <div className="text-xs text-gray-400 mb-1">Saturday, 23 Aug</div>
                  <div className="font-heading font-bold text-base mb-3">Happening near you</div>
                  <div className="flex gap-2">
                    {['All','Music','Tech','Food'].map((c,i) => (
                      <span key={c} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${i===0 ? 'bg-brand text-white' : 'bg-blue-50 text-brand'}`}>{c}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 px-3.5 pb-4">
                  {[
                    {name:'Lagos Sound Sessions',meta:'Sat · 7 PM · Hard Rock',price:'₦15,000'},
                    {name:'DevFest Meetup',meta:'Sun · 10 AM · Civic Hub',price:'Free'},
                    {name:'Street Food Festival',meta:'Sun · 12 PM · Marina Park',price:'₦5,000'}
                  ].map(e => (
                    <div key={e.name} className="border border-gray-200 rounded-2xl p-3 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm">{e.name}</div>
                        <div className="text-xs text-gray-400">{e.meta}</div>
                      </div>
                      <div className="text-xs font-bold text-brand">{e.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-14">
          <div className="text-xs font-bold uppercase tracking-widest mb-2 text-brand">How it works</div>
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight mb-10">Three taps from<br/>couch to crowd.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {n:'01',t:'Discover',b:"Browse what's on near you — filtered by vibe, date, and price. Follow organizers you love and never miss a drop."},
              {n:'02',t:'Book in seconds',b:'Pay with card or mobile money. Your ticket lands in the app instantly — named, numbered, and shareable.'},
              {n:'03',t:'Scan in at the door',b:"Show your QR, hear the beep, you're in. No printouts, no guest-list arguments, no waiting."}
            ].map(s => (
              <div key={s.n} className="rounded-3xl p-7 border shadow-md bg-white border-gray-200">
                <div className="text-xs font-heading font-bold mb-3 text-brand">{s.n}</div>
                <h3 className="text-xl font-heading font-bold mb-2">{s.t}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{s.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Organizers */}
        <section id="organizers" className="my-14 rounded-3xl p-12 md:p-14 text-white grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-navy to-navy-light">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2 text-blue-300">For organizers</div>
            <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight mb-4">Sell out. Scan in.<br/>See everything.</h2>
            <p className="text-base leading-relaxed opacity-80 mb-7 max-w-sm">List an event in minutes, watch sales live, and run the door from your phone. Payouts land the next business day.</p>
            <Link to="/login" className="inline-block bg-white rounded-2xl px-7 py-4 font-bold text-sm text-navy">Start hosting</Link>
          </div>
          <div className="rounded-2xl p-6 border" style={{background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.14)'}}>
            <div className="flex justify-between items-center mb-5">
              <div className="font-bold">Street Food Festival</div>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background: 'rgba(76,175,125,.25)', color: 'oklch(0.85 0.12 150)'}}>LIVE</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Tickets sold','1,284 / 1,500'],['Revenue','₦6.4M'],['Checked in','862'],['Avg. scan','3.2s']].map(([l,v]) => (
                <div key={l} className="rounded-2xl p-4" style={{background: 'rgba(255,255,255,.07)'}}>
                  <div className="text-xs opacity-60 mb-1">{l}</div>
                  <div className="text-2xl font-heading font-black">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-20">
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4">The next great night out<br/>is already on Kulunu.</h2>
          <p className="text-lg text-gray-500 mb-8">Free for attendees. Minutes to list for organizers.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/discover" className="px-8 py-4 rounded-2xl text-white font-bold bg-brand">Browse events now</Link>
            <Link to="/login" className="px-8 py-4 rounded-2xl text-white font-bold bg-navy">List your event</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 flex flex-col sm:flex-row justify-between items-center gap-5 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black bg-gradient-to-br from-brand to-navy">k</div>
            <span className="font-heading font-bold text-gray-700">kulunu</span>
          </div>
          <div className="flex gap-6">
            {['How it works','Organizers','Privacy','Terms'].map(l => <a key={l} href="#" className="hover:text-gray-600">{l}</a>)}
          </div>
          <div>© 2026 Kulunu</div>
        </footer>
      </div>
    </div>
  );
}
