import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { players, teams } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { Activity, Target, TrendingUp } from 'lucide-react';

export default function Stats() {
  const { t } = useLanguage();
  const topScorers = [...players].sort((a, b) => b.goals - a.goals);
  const topAssists = [...players].sort((a, b) => b.assists - a.assists);
  const standings = [...teams].sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="font-display text-3xl">{t('stats')}</h1>
          <p className="text-muted-foreground text-sm mt-1">Player performance, standings & competition analytics</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Top scorers */}
          <div className="stat-card rounded-xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Top Scorers</h2>
            <div className="space-y-2">
              {topScorers.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className={`w-5 text-center font-bold text-sm ${i === 0 ? 'text-secondary' : i < 3 ? 'text-primary' : 'text-muted-foreground'}`}>{i + 1}</span>
                  <span className="text-lg">{p.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.teamName}</div>
                  </div>
                  <span className="font-display text-xl text-primary">{p.goals}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top assists */}
          <div className="stat-card rounded-xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-secondary" />Top Assists</h2>
            <div className="space-y-2">
              {topAssists.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className={`w-5 text-center font-bold text-sm ${i === 0 ? 'text-secondary' : i < 3 ? 'text-primary' : 'text-muted-foreground'}`}>{i + 1}</span>
                  <span className="text-lg">{p.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.teamName}</div>
                  </div>
                  <span className="font-display text-xl text-secondary">{p.assists}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Appearances */}
          <div className="stat-card rounded-xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-muted-foreground" />Most Appearances</h2>
            <div className="space-y-2">
              {[...players].sort((a,b) => b.appearances - a.appearances).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-5 text-center text-muted-foreground text-sm">{i + 1}</span>
                  <span className="text-lg">{p.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.position}</div>
                  </div>
                  <span className="font-mono text-sm">{p.appearances}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Standings */}
        <div className="stat-card rounded-xl p-5">
          <h2 className="font-semibold mb-4">BIFA Champions Cup — Full Standings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                  {['Pos', 'Team', 'Country', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts', 'Form'].map(h => (
                    <th key={h} className={`pb-3 ${h === 'Team' || h === 'Country' ? 'text-left' : 'text-center'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standings.map((team, i) => (
                  <tr key={team.id} className="border-b border-border/50 table-row-hover transition-colors">
                    <td className="py-3 text-center font-bold text-muted-foreground">{i < 2 ? <span className="text-primary">{i + 1}</span> : i + 1}</td>
                    <td className="py-3 font-semibold">{team.name}</td>
                    <td className="py-3 text-muted-foreground text-xs">{team.flag} {team.country}</td>
                    {[team.played, team.won, team.drawn, team.lost, team.goalsFor, team.goalsAgainst].map((v, vi) => <td key={vi} className="py-3 text-center">{v}</td>)}
                    <td className={`py-3 text-center font-medium ${team.goalsFor - team.goalsAgainst >= 0 ? 'text-primary' : 'text-destructive'}`}>{team.goalsFor - team.goalsAgainst >= 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}</td>
                    <td className="py-3 text-center font-display text-xl text-primary">{team.points}</td>
                    <td className="py-3"><div className="flex gap-0.5 justify-center">{team.form.slice(-5).map((f, fi) => <span key={fi} className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center text-white ${f === 'W' ? 'bg-primary' : f === 'D' ? 'bg-muted-foreground' : 'bg-destructive'}`}>{f}</span>)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
