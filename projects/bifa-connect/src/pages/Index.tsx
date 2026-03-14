import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { BRICS_TIMEZONES, useTimezone } from '@/context/TimezoneContext';
import { competitions, matches } from '@/data/mockData';
import LanguageSelector from '@/components/LanguageSelector';
import { Globe, Shield, Trophy, Users, ChevronRight, Play, Activity, Clock, FileText, Star, Zap, AlertCircle } from 'lucide-react';

const newsItems = [
  { id: 1, title: 'BIFA Champions Cup 2026 Group Stage Underway — 8 Clubs Compete Across 5 Nations', date: '2026-07-19', category: 'Competition', flag: '🏆' },
  { id: 2, title: 'BRICS+ Expansion: Egypt, Saudi Arabia & UAE Apply for BIFA Membership', date: '2026-07-18', category: 'Governance', flag: '🌍' },
  { id: 3, title: 'BIFA Digital Platform Launch — Phase 1 MVP Goes Live', date: '2026-07-15', category: 'Technology', flag: '💻' },
  { id: 4, title: 'Raj Kumar (India) Named BIFA Referee of the Year 2025', date: '2026-07-10', category: 'Awards', flag: '🏅' },
  { id: 5, title: 'Anti-Doping Program Enhanced — WADA Partnership Confirmed for 2026', date: '2026-07-08', category: 'Governance', flag: '🛡️' },
];

export default function Index() {
  const navigate = useNavigate();
  const { language, setLanguage, t, currentLang } = useLanguage();
  const { getCurrentTimeInTimezone } = useTimezone();
  const [times, setTimes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'results' | 'upcoming'>('upcoming');

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, string> = {};
      BRICS_TIMEZONES.slice(0, 12).forEach(tz => {
        newTimes[tz.timezone] = getCurrentTimeInTimezone(tz.timezone);
      });
      setTimes(newTimes);
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [getCurrentTimeInTimezone]);

  const upcomingMatches = matches.filter(m => m.status === 'scheduled');
  const liveMatches = matches.filter(m => m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');

  const stats = [
    { label: t('memberNations'), value: '10', icon: '🌍' },
    { label: t('registeredPlayers'), value: '12,840', icon: '⚽' },
    { label: t('licensedReferees'), value: '2,156', icon: '🟨' },
    { label: t('activeCompetitions'), value: '8', icon: '🏆' },
  ];

  const modules = [
    { icon: Shield, label: t('governance'), desc: 'Documents, statutes & compliance', color: 'bifa-green', href: '/dashboard/governance' },
    { icon: Trophy, label: t('competitions'), desc: 'Leagues, cups & match engine', color: 'bifa-gold', href: '/dashboard/competitions' },
    { icon: Users, label: t('players'), desc: 'Player registry & development', color: 'bifa-blue', href: '/dashboard/players' },
    { icon: Activity, label: t('stats'), desc: 'Live stats & standings', color: 'secondary', href: '/dashboard/stats' },
    { icon: FileText, label: t('disciplinary'), desc: 'Cases, hearings & sanctions', color: 'bifa-red', href: '/dashboard/disciplinary' },
    { icon: Star, label: t('referees'), desc: 'Certified officials database', color: 'bifa-gold', href: '/dashboard/referees' },
    { icon: AlertCircle, label: 'Suspensions', desc: 'Referee suspension reports', color: 'destructive', href: '/dashboard/referee-suspensions' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Live ticker */}
      <div className="bg-primary text-primary-foreground py-1.5 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...newsItems, ...newsItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm font-medium">
              <span>{item.flag}</span>
              <span className="opacity-70 text-xs uppercase tracking-wider">{item.category}</span>
              <span className="text-primary-foreground/80">|</span>
              <span>{item.title}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-display text-lg">B</span>
            </div>
            <div>
              <div className="font-display text-xl text-primary leading-none tracking-wider">BIFA</div>
              <div className="text-muted-foreground text-xs">BRICS Football Alliance</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {[t('news'), t('competitions'), t('teams'), 'Referees', 'About'].map(item => (
              <button key={item} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 gradient-green text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-glow"
            >
              {t('login')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative gradient-hero min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
        {/* Animated pitch lines */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <rect x="50" y="30" width="700" height="440" fill="none" stroke="white" strokeWidth="2"/>
            <circle cx="400" cy="250" r="60" fill="none" stroke="white" strokeWidth="2"/>
            <line x1="400" y1="30" x2="400" y2="470" stroke="white" strokeWidth="2"/>
            <rect x="50" y="170" width="100" height="160" fill="none" stroke="white" strokeWidth="2"/>
            <rect x="650" y="170" width="100" height="160" fill="none" stroke="white" strokeWidth="2"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="animate-slide-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 md:px-4 py-1.5 mb-4 md:mb-6">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">Phase 1 MVP — Live Demo</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none mb-4">
                <span className="text-foreground">{t('federation')}</span>
              </h1>
              <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-lg">
                {t('tagline')} — Digital infrastructure for football governance, competitions, and athlete management across BRICS+ nations.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 gradient-green text-primary-foreground rounded-xl font-semibold flex items-center gap-2 shadow-glow hover:scale-105 transition-transform"
                >
                  <Play className="w-4 h-4" />
                  {t('accessPlatform')}
                </button>
                <button
                  onClick={() => navigate('/architecture')}
                  className="px-6 py-3 bg-muted text-foreground rounded-xl font-semibold flex items-center gap-2 hover:bg-accent transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {t('systemArchitecture')}
                </button>
              </div>
            </div>

            {/* Live clocks */}
            <div className="grid grid-cols-1 gap-2 md:gap-3 animate-fade-in">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                BRICS+ Live Times
              </div>
              {BRICS_TIMEZONES.slice(0, 12).map(tz => (
                <div key={tz.timezone} className="glass rounded-xl px-4 py-3 flex items-center justify-between group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tz.flag}</span>
                    <div>
                      <div className="font-semibold text-sm">{tz.country}</div>
                      <div className="text-xs text-muted-foreground">{tz.timezone}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-primary">
                      {times[tz.timezone] || '--:--:--'}
                    </div>
                    <div className="text-xs text-muted-foreground">{tz.utcOffset} {tz.dstObserved ? '(DST)' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="font-display text-3xl text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl">{t('matchCentre')}</h2>
          <div className="flex gap-2">
            {(['upcoming', 'results'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Live match alert */}
        {liveMatches.length > 0 && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3 animate-pulse-glow">
            <div className="w-2 h-2 rounded-full bg-destructive pulse-green"></div>
            <span className="text-sm font-semibold text-destructive">LIVE NOW</span>
            {liveMatches.map(m => (
              <span key={m.id} className="text-sm text-foreground">
                {m.homeFlag} {m.homeTeam} {m.homeScore} – {m.awayScore} {m.awayTeam} {m.awayFlag}
                <span className="ml-2 text-xs text-muted-foreground">{m.competition}</span>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {(activeTab === 'upcoming' ? upcomingMatches : completedMatches).slice(0, 4).map(match => (
            <div key={match.id} className="stat-card rounded-xl p-4 md:p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{match.competition}</span>
                <span className="text-xs text-muted-foreground">{match.round}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">{match.homeFlag}</div>
                  <div className="font-semibold text-sm">{match.homeTeam}</div>
                </div>
                <div className="px-4 text-center">
                  {match.status === 'completed' ? (
                    <div className="font-display text-3xl text-primary">{match.homeScore} – {match.awayScore}</div>
                  ) : (
                    <div className="text-muted-foreground text-sm font-semibold">VS</div>
                  )}
                </div>
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">{match.awayFlag}</div>
                  <div className="font-semibold text-sm">{match.awayTeam}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground flex justify-between">
                <span>📍 {match.venue}, {match.venueCountry}</span>
                <span>🕐 {new Date(match.kickoffUtc).toUTCString().slice(0, 22)} UTC</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Modules */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl mb-2">{t('platformModules')}</h2>
            <p className="text-muted-foreground">{t('modularScalable')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {modules.map((mod, i) => (
              <button
                key={i}
                onClick={() => navigate('/login')}
                className="stat-card rounded-xl p-5 md:p-6 text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-${mod.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <mod.icon className={`w-6 h-6 text-${mod.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{mod.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{mod.desc}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Access Module <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h2 className="font-display text-4xl mb-6">{t('latestNews')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {newsItems.slice(0, 3).map(item => (
            <div key={item.id} className="stat-card rounded-xl overflow-hidden">
              <div className="h-2 gradient-green"></div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{item.flag}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{item.category}</span>
                </div>
                <h3 className="font-semibold text-sm leading-snug mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 gradient-green rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-display text-sm">B</span>
                </div>
                <span className="font-display text-lg text-primary">BIFA</span>
              </div>
              <p className="text-xs text-muted-foreground">BRICS International Football Alliance — Governing football across BRICS+ nations.</p>
            </div>
            {[
              { title: 'Organisation', items: ['About BIFA', 'Executive Committee', 'Member Federations', 'Governance'] },
              { title: 'Competitions', items: ['Champions Cup', 'U-23 League', 'Nations Cup', 'Rankings'] },
              { title: 'Platform', items: ['Login', 'Architecture', 'API Docs', 'Support'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-1">
                  {col.items.map(item => (
                    <li key={item}>
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">{item}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">© 2026 BRICS International Football Alliance. All rights reserved.</p>
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
              {BRICS_TIMEZONES.slice(0, 12).map(tz => (
                <span key={tz.timezone} className="text-xs text-muted-foreground whitespace-nowrap">{tz.flag} {tz.country}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
