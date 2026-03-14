import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { players, teams } from '@/data/mockData';
import { useTimezone } from '@/context/TimezoneContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePlayers, useCreatePlayer } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Target, Zap, AlertCircle, Plus, X, Loader2 } from 'lucide-react';

const statusColors = { active: 'bg-primary/20 text-primary', suspended: 'bg-destructive/20 text-destructive', injured: 'bg-secondary/20 text-secondary-foreground' };

export default function Players() {
  const { formatInTimezone } = useTimezone();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: apiPlayers = [], isLoading, error } = usePlayers();
  const createPlayerMutation = useCreatePlayer();
  
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    team: '',
    country: '',
    flag: '',
    position: 'Forward',
    age: 18,
    goals: 0,
    assists: 0
  });

  const allPlayers = [...players, ...apiPlayers];
  const filtered = allPlayers.filter(p => {
    const name = p.name?.toLowerCase() || '';
    const country = (p.country || p.nationality)?.toLowerCase() || '';
    const searchLower = search.toLowerCase();
    return name.includes(searchLower) || country.includes(searchLower);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPlayerMutation.mutate({
      ...newPlayer,
      rating: 0,
    });
    setShowModal(false);
    setNewPlayer({ name: '', team: '', country: '', flag: '', position: 'Forward', age: 18, goals: 0, assists: 0 });
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">{t('players')}</h1>
            <p className="text-muted-foreground text-sm mt-1">Player registry, development tracking & performance data</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 shadow-glow"
          >
            <Plus className="w-4 h-4" /> Register Player
          </button>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
            Failed to load players from database. Showing mock data only.
          </div>
        )}
        <div className="grid grid-cols-4 gap-3">
          {[{ label: 'Total Players', value: allPlayers.length, color: 'foreground' }, { label: 'Active', value: players.filter(p => p.status === 'active').length, color: 'primary' }, { label: 'Suspended', value: players.filter(p => p.status === 'suspended').length, color: 'destructive' }, { label: 'Injured', value: players.filter(p => p.status === 'injured').length, color: 'secondary' }].map((s, i) => (
            <div key={i} className="stat-card rounded-xl p-4 text-center">
              <div className={`font-display text-3xl text-${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players..." className="w-full bg-muted border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="stat-card rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">Loading players...</p>
            </div>
          ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
                {['Player', 'Team', 'Pos', 'Apps', 'Goals', 'Assists', 'YC', 'RC', 'Status', 'Registered'].map(h => (
                  <th key={h} className="text-left p-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const teamName = p.teamName || p.team || 'N/A';
                const nationality = p.nationality || p.country || 'N/A';
                const registeredAt = p.registeredAt || p.created_at;
                return (
                <tr key={p.id} className="border-b border-border/50 table-row-hover transition-colors cursor-pointer">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.flag}</span>
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{nationality} • Age {p.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm">{teamName}</td>
                  <td className="p-3 text-xs text-muted-foreground">{p.position}</td>
                  <td className="p-3 text-center font-mono">{p.appearances || 0}</td>
                  <td className="p-3 text-center font-bold text-primary">{p.goals}</td>
                  <td className="p-3 text-center font-mono text-secondary-foreground">{p.assists}</td>
                  <td className="p-3 text-center"><span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">{p.yellowCards || 0}</span></td>
                  <td className="p-3 text-center"><span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">{p.redCards || 0}</span></td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[p.status] || 'bg-muted text-muted-foreground'}`}>{p.status || 'active'}</span></td>
                  <td className="p-3 text-xs text-muted-foreground font-mono">{registeredAt ? formatInTimezone(registeredAt).slice(0, 12) : 'N/A'}</td>
                </tr>
              )})}
            </tbody>
          </table>
          )}
        </div>

        {/* Register Player Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-semibold text-lg">Register New Player</h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Player Name</label>
                  <input
                    type="text"
                    value={newPlayer.name}
                    onChange={e => setNewPlayer({...newPlayer, name: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Team</label>
                    <select
                      value={newPlayer.team}
                      onChange={e => setNewPlayer({...newPlayer, team: e.target.value})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select Team</option>
                      {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Position</label>
                    <select
                      value={newPlayer.position}
                      onChange={e => setNewPlayer({...newPlayer, position: e.target.value})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    >
                      <option>Forward</option>
                      <option>Midfielder</option>
                      <option>Defender</option>
                      <option>Goalkeeper</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Country</label>
                    <input
                      type="text"
                      value={newPlayer.country}
                      onChange={e => setNewPlayer({...newPlayer, country: e.target.value})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Flag Emoji</label>
                    <input
                      type="text"
                      value={newPlayer.flag}
                      onChange={e => setNewPlayer({...newPlayer, flag: e.target.value})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                      placeholder="🇧🇷"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Age</label>
                  <input
                    type="number"
                    min="16"
                    max="45"
                    value={newPlayer.age}
                    onChange={e => setNewPlayer({...newPlayer, age: parseInt(e.target.value)})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-muted text-foreground py-2.5 rounded-lg font-semibold hover:bg-accent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createPlayerMutation.isPending}
                    className="flex-1 gradient-green text-primary-foreground py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createPlayerMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Register Player
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
