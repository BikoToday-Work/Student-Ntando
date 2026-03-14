import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Shield, Database, Layers, Clock, Users, ChevronRight } from 'lucide-react';

export default function Architecture() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate('/')} className="text-xs text-muted-foreground hover:text-primary mb-2 flex items-center gap-1">← Back to Home</button>
            <h1 className="font-display text-4xl">System Architecture</h1>
            <p className="text-muted-foreground mt-1">BIFA Platform — Technical Overview & Design Decisions</p>
          </div>
        </div>

        {/* Architecture diagram */}
        <div className="stat-card rounded-xl p-6">
          <h2 className="font-semibold mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-primary" />System Layers</h2>
          <div className="space-y-3">
            {[
              { layer: 'Presentation Layer', tech: 'React 18 + TypeScript + Tailwind CSS', desc: 'Responsive SPA — dark/light modes, multilingual (5 languages), RBAC-gated UI', color: 'primary' },
              { layer: 'State & Context Layer', tech: 'React Context API + TanStack Query', desc: 'AuthContext (RBAC), TimezoneContext (IANA), LanguageContext (i18n)', color: 'bifa-blue' },
              { layer: 'Business Logic Layer', tech: 'TypeScript Services + Validation', desc: 'UTC-first timestamp handling, permission matrices, audit log generation', color: 'secondary' },
              { layer: 'API / Backend Layer', tech: 'Supabase + Edge Functions (planned)', desc: 'PostgreSQL, RLS policies, real-time subscriptions, storage', color: 'muted-foreground' },
              { layer: 'Security Layer', tech: 'TLS 1.3 + MFA + RLS + Audit', desc: 'End-to-end encryption, MFA simulation, immutable records, IP logging', color: 'destructive' },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-4 border border-border rounded-xl p-4">
                <div className={`w-2 h-12 rounded bg-${l.color} flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{l.layer}</div>
                  <div className="text-xs text-primary font-mono">{l.tech}</div>
                  <div className="text-xs text-muted-foreground">{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC matrix */}
        <div className="stat-card rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary" />RBAC Permission Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 pr-4">Module</th>
                  {['Super Admin', 'Fed Admin', 'Secretariat', 'Referee', 'Team Mgr', 'Public'].map(r => <th key={r} className="text-center px-2 py-2 whitespace-nowrap">{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  { module: 'Governance (View)', perms: [true, true, true, false, false, false] },
                  { module: 'Governance (Edit)', perms: [true, true, false, false, false, false] },
                  { module: 'Governance (Approve)', perms: [true, true, false, false, false, false] },
                  { module: 'Competitions', perms: [true, true, true, true, true, true] },
                  { module: 'Disciplinary (View)', perms: [true, true, true, false, false, false] },
                  { module: 'Disciplinary (Manage)', perms: [true, true, false, false, false, false] },
                  { module: 'Referee Registry', perms: [true, true, true, true, false, false] },
                  { module: 'Player Management', perms: [true, true, false, false, true, false] },
                  { module: 'Audit Logs', perms: [true, true, false, false, false, false] },
                  { module: 'System Admin', perms: [true, false, false, false, false, false] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 table-row-hover">
                    <td className="py-2 pr-4 font-medium">{row.module}</td>
                    {row.perms.map((p, pi) => (
                      <td key={pi} className="text-center px-2 py-2">
                        {p ? <span className="text-primary font-bold">✓</span> : <span className="text-muted-foreground/30">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timezone handling */}
        <div className="stat-card rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Timezone Handling Architecture</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-primary">Rules</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['All timestamps stored as UTC ISO 8601 in database', 'Each user carries an IANA timezone identifier', 'Intl.DateTimeFormat API handles all conversions (no manual offsets)', 'DST is handled automatically by the browser/runtime', 'Audit logs always show UTC + user local time', 'Match schedules display: Local | UTC | Venue time'].map((r, i) => (
                  <li key={i} className="flex items-start gap-2"><ChevronRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />{r}</li>
                ))}
              </ul>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Demo Scenario</h3>
              <div className="space-y-2 text-xs font-mono">
                <div><span className="text-muted-foreground">Stored (UTC):</span></div>
                <div className="text-primary bg-primary/5 px-2 py-1 rounded">2026-07-21T18:30:00Z</div>
                <div className="mt-3"><span className="text-muted-foreground">🇧🇷 São Paulo:</span> <span className="text-foreground">21 Jul 15:30 (UTC-3)</span></div>
                <div><span className="text-muted-foreground">🇮🇳 Mumbai:</span> <span className="text-foreground">22 Jul 00:00 (UTC+5:30)</span></div>
                <div><span className="text-muted-foreground">🇷🇺 Moscow:</span> <span className="text-foreground">21 Jul 21:30 (UTC+3)</span></div>
                <div><span className="text-muted-foreground">🇨🇳 Shanghai:</span> <span className="text-foreground">22 Jul 02:30 (UTC+8)</span></div>
                <div><span className="text-muted-foreground">🇿🇦 Joburg:</span> <span className="text-foreground">21 Jul 20:30 (UTC+2)</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Data model */}
        <div className="stat-card rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-primary" />Simplified Data Model</h2>
          <div className="grid md:grid-cols-3 gap-4 text-xs font-mono">
            {[
              { entity: 'users', fields: ['id: uuid', 'name: text', 'email: text', 'role: enum', 'timezone: text', 'mfa_enabled: bool', 'created_at: timestamptz'] },
              { entity: 'matches', fields: ['id: uuid', 'home_team_id: uuid', 'away_team_id: uuid', 'competition_id: uuid', 'kickoff_utc: timestamptz', 'venue_timezone: text', 'referee_id: uuid', 'status: enum'] },
              { entity: 'disciplinary_cases', fields: ['id: uuid', 'player_id: uuid', 'type: enum', 'severity: enum', 'reported_at_utc: timestamptz', 'status: enum', 'immutable: bool'] },
              { entity: 'governance_docs', fields: ['id: uuid', 'title: text', 'category: enum', 'version: text', 'status: enum', 'uploaded_at_utc: timestamptz', 'approved_by: uuid'] },
              { entity: 'audit_logs', fields: ['id: uuid', 'user_id: uuid', 'action: text', 'module: text', 'timestamp_utc: timestamptz', 'user_timezone: text', 'ip_address: text'] },
              { entity: 'players', fields: ['id: uuid', 'name: text', 'team_id: uuid', 'goals: int', 'assists: int', 'yellow_cards: int', 'red_cards: int', 'status: enum'] },
            ].map((e, i) => (
              <div key={i} className="bg-muted rounded-xl p-3">
                <div className="text-primary font-bold mb-2 text-xs uppercase">{e.entity}</div>
                {e.fields.map((f, fi) => <div key={fi} className="text-muted-foreground text-xs">{f}</div>)}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-4">
          <button onClick={() => navigate('/login')} className="gradient-green text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 shadow-glow">
            Access Live Demo Platform
          </button>
        </div>
      </div>
    </div>
  );
}
