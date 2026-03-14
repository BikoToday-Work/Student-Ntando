import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTimezone } from '@/context/TimezoneContext';
import { useLanguage } from '@/context/LanguageContext';
import { matches, teams, disciplinaryCases, secretariatTasks, auditLogs, competitions } from '@/data/mockData';
import AppLayout from '@/components/layout/AppLayout';
import {
  Trophy, Users, Shield, Star, Activity, FileText, Briefcase,
  AlertCircle, Clock, TrendingUp, Globe, Building2, CheckCircle2, Circle
} from 'lucide-react';

const priorityColors = {
  low: 'text-muted-foreground',
  medium: 'text-secondary',
  high: 'text-primary',
  urgent: 'text-destructive',
};

const statusColors = {
  todo: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/20 text-primary',
  review: 'bg-secondary/20 text-secondary-foreground',
  completed: 'bg-primary/10 text-primary',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { formatMatchTime } = useTimezone();
  const { t } = useLanguage();

  // Redirect team managers to their team dashboard
  React.useEffect(() => {
    if (user?.role === 'team_manager') {
      navigate('/dashboard/team-manager');
    }
  }, [user, navigate]);

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled').slice(0, 3);
  const openCases = disciplinaryCases.filter(d => d.status !== 'resolved');
  const activeTasks = secretariatTasks.filter(t => t.status !== 'completed');

  // Referee-specific: Show only matches assigned to them
  const isReferee = user?.role === 'referee';
  const myMatches = isReferee ? matches.filter(m => m.refereeName === user?.name).slice(0, 3) : upcomingMatches;

  const statsCards = [
    { label: t('activeCompetitionsLabel'), value: competitions.filter(c => c.status === 'active').length, icon: Trophy, color: 'primary', change: `+2 ${t('thisMonth')}`, href: '/dashboard/competitions' },
    { label: t('registeredPlayersLabel'), value: '12,840', icon: Users, color: 'bifa-blue', change: `+156 ${t('thisSeason')}`, href: '/dashboard/players' },
    { label: t('licensedRefereesLabel'), value: '2,156', icon: Star, color: 'secondary', change: `87 ${t('fifaGrade')}`, href: '/dashboard/referees' },
    { label: t('openDisciplinary'), value: openCases.length, icon: AlertCircle, color: 'destructive', change: `${disciplinaryCases.filter(d => d.severity === 'critical').length} ${t('critical')}`, href: '/dashboard/disciplinary' },
    { label: t('memberNationsLabel'), value: '47', icon: Globe, color: 'primary', change: `3 ${t('applicationsPending')}`, href: '#' },
    { label: t('pendingTasks'), value: activeTasks.length, icon: Briefcase, color: 'secondary', change: `2 ${t('urgent')}`, href: '/dashboard/secretariat' },
  ];

  const quickActions = [
    { label: t('governance'), icon: Shield, href: '/dashboard/governance', desc: t('documentsCompliance'), visible: hasPermission('view_governance') },
    { label: t('competitions'), icon: Trophy, href: '/dashboard/competitions', desc: t('leaguesMatches'), visible: hasPermission('view_competitions') },
    { label: t('athletes'), icon: Users, href: '/dashboard/players', desc: t('playerRegistry'), visible: hasPermission('view_players') },
    { label: t('stats'), icon: Activity, href: '/dashboard/stats', desc: t('standingsStats'), visible: hasPermission('view_stats') },
    { label: t('secretariat'), icon: Briefcase, href: '/dashboard/secretariat', desc: t('tasksWorkflows'), visible: hasPermission('view_secretariat') },
    { label: t('referees'), icon: Star, href: '/dashboard/referees', desc: t('officialRegistry'), visible: hasPermission('view_referees') },
    { label: 'Suspensions', icon: AlertCircle, href: '/dashboard/referee-suspensions', desc: t('suspensionReports'), visible: hasPermission('view_referees') || user?.role === 'referee' },
    { label: t('disciplinary'), icon: FileText, href: '/dashboard/disciplinary', desc: t('casesSanctions'), visible: hasPermission('view_disciplinary') },
  ].filter(a => a.visible);

  const roleDisplay = user?.role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">{t('welcomeBack')}, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {roleDisplay} • {user?.country} • {user?.timezone}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs text-primary font-medium">{t('systemOnline')}</span>
            </div>
            {liveMatches.length > 0 && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"></div>
                <span className="text-xs text-destructive font-medium">{liveMatches.length} {liveMatches.length > 1 ? t('liveMatches') : t('liveMatch')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statsCards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.href)}
              className="stat-card rounded-xl p-4 cursor-pointer"
            >
              <div className={`w-8 h-8 bg-${card.color}/10 rounded-lg flex items-center justify-center mb-3`}>
                <card.icon className={`w-4 h-4 text-${card.color}`} />
              </div>
              <div className="font-display text-2xl text-foreground">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
              <div className={`text-xs mt-1 text-${card.color}/80`}>{card.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Upcoming Matches with timezone display */}
          <div className="lg:col-span-2 stat-card rounded-xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                {isReferee ? t('myAssignedMatches') : t('matchSchedule')}
              </h2>
              <button onClick={() => navigate('/dashboard/competitions')} className="text-xs text-primary hover:underline">{t('viewAll')}</button>
            </div>

            {isReferee && myMatches.length === 0 && (
              <div className="bg-muted rounded-xl p-4 text-center mb-4">
                <p className="text-sm text-muted-foreground">{t('noMatchesAssigned')}</p>
              </div>
            )}

            {liveMatches.length > 0 && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"></div>
                  <span className="text-xs font-bold text-destructive uppercase tracking-wider">{t('liveNow')}</span>
                </div>
                {liveMatches.map(m => {
                  const time = formatMatchTime(m.kickoffUtc);
                  return (
                    <div key={m.id} className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{m.homeFlag} {m.homeTeam} {m.homeScore}–{m.awayScore} {m.awayTeam} {m.awayFlag}</span>
                      <span className="text-xs text-muted-foreground">{m.competition}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-3">
              {myMatches.map(match => {
                const time = formatMatchTime(match.kickoffUtc);
                return (
                  <div key={match.id} className="border border-border rounded-xl p-3 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{match.competition}</span>
                      <span className="text-xs text-muted-foreground">{match.round}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{match.homeFlag}</span>
                        <span className="font-semibold text-sm">{match.homeTeam}</span>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground px-3">VS</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{match.awayTeam}</span>
                        <span className="text-xl">{match.awayFlag}</span>
                      </div>
                    </div>
                    {/* Timezone display — the key demo feature */}
                    <div className="mt-2 pt-2 border-t border-border space-y-1">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">{t('yourTime')}: </span>
                          <span className="font-mono text-primary font-semibold">{time.time}</span>
                          <span className="text-muted-foreground ml-1">{time.timezone.split('(')[0].trim()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">UTC: </span>
                          <span className="font-mono text-foreground">{time.utc}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">{time.iso8601}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick access + recent activity */}
          <div className="space-y-4 md:space-y-5">
            {/* Quick access */}
            <div className="stat-card rounded-xl p-4 md:p-5">
              <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t('quickAccess')}</h2>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 6).map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.href)}
                    className="flex flex-col items-center gap-1.5 p-3 bg-muted rounded-xl hover:bg-accent hover:text-primary transition-all group text-center"
                  >
                    <action.icon className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent audit */}
            <div className="stat-card rounded-xl p-4 md:p-5">
              <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t('auditLog')}</h2>
              <div className="space-y-2">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="text-xs border-l-2 border-primary/30 pl-2">
                    <div className="font-medium text-foreground truncate">{log.action.replace(/_/g, ' ')}</div>
                    <div className="text-muted-foreground">{log.userName} • {log.module}</div>
                    <div className="font-mono text-primary/70">{new Date(log.timestampUtc).toISOString().slice(0, 16)}Z</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Standings mini-table */}
        <div className="stat-card rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              {t('bifaChampionsCup')} — {t('standings')}
            </h2>
            <button onClick={() => navigate('/dashboard/stats')} className="text-xs text-primary hover:underline">{t('fullTable')}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="text-left pb-2 w-6">#</th>
                  <th className="text-left pb-2">Team</th>
                  <th className="text-center pb-2">P</th>
                  <th className="text-center pb-2">W</th>
                  <th className="text-center pb-2">D</th>
                  <th className="text-center pb-2">L</th>
                  <th className="text-center pb-2">GD</th>
                  <th className="text-center pb-2 font-bold text-foreground">Pts</th>
                  <th className="text-center pb-2">Form</th>
                </tr>
              </thead>
              <tbody>
                {teams.slice(0, 5).map((team, i) => (
                  <tr key={team.id} className="border-b border-border/50 table-row-hover transition-colors">
                    <td className="py-2 text-muted-foreground text-xs">{i + 1}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <span>{team.flag}</span>
                        <span className="font-medium">{team.name}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{team.country}</span>
                      </div>
                    </td>
                    <td className="py-2 text-center text-muted-foreground">{team.played}</td>
                    <td className="py-2 text-center">{team.won}</td>
                    <td className="py-2 text-center">{team.drawn}</td>
                    <td className="py-2 text-center">{team.lost}</td>
                    <td className={`py-2 text-center text-xs ${team.goalsFor - team.goalsAgainst >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {team.goalsFor - team.goalsAgainst >= 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}
                    </td>
                    <td className="py-2 text-center font-bold text-primary">{team.points}</td>
                    <td className="py-2">
                      <div className="flex gap-0.5 justify-center">
                        {team.form.slice(-5).map((f, fi) => (
                          <span key={fi} className={`w-4 h-4 rounded-sm text-xs font-bold flex items-center justify-center text-primary-foreground ${f === 'W' ? 'bg-primary' : f === 'D' ? 'bg-muted-foreground' : 'bg-destructive'}`}>{f}</span>
                        ))}
                      </div>
                    </td>
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
