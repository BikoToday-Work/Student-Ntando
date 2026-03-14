"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Calendar, MapPin, Trophy, Target } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function LeagueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [leagueId, setLeagueId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('standings');
  const [leagueData, setLeagueData] = useState<{
    league: any;
    teams: any[];
    fixtures: any[];
    standings: any[];
    topScorers: any[];
    loading: boolean;
  }>({
    league: null,
    teams: [],
    fixtures: [],
    standings: [],
    topScorers: [],
    loading: true
  });

  useEffect(() => {
    params.then(p => setLeagueId(p.id));
  }, [params]);

  useEffect(() => {
    if (!leagueId) return;
    
    const fetchLeagueDetails = async () => {
      try {
        const [teamsRes, fixturesRes, standingsRes, topScorersRes] = await Promise.all([
          fetch(`http://localhost:5000/api/football/teams?league=${leagueId}&season=2024`),
          fetch(`http://localhost:5000/api/football/fixtures?league=${leagueId}&season=2024`),
          fetch(`http://localhost:5000/api/football/standings?league=${leagueId}&season=2024`),
          fetch(`http://localhost:5000/api/football/topscorers?league=${leagueId}&season=2024`)
        ]);

        const [teamsData, fixturesData, standingsData, topScorersData] = await Promise.all([
          teamsRes.json(),
          fixturesRes.json(),
          standingsRes.json(),
          topScorersRes.json()
        ]);

        setLeagueData({
          league: teamsData.response?.[0]?.league || null,
          teams: teamsData.response || [],
          fixtures: fixturesData.response?.slice(0, 10) || [],
          standings: standingsData.response?.[0]?.league?.standings?.[0] || [],
          topScorers: topScorersData.response?.slice(0, 20) || [],
          loading: false
        });
      } catch (error) {
        console.error('Error:', error);
        setLeagueData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchLeagueDetails();
  }, [leagueId]);

  if (leagueData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button onClick={() => router.back()} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            {leagueData.league && leagueData.league.logo && (
              <img src={leagueData.league.logo} alt="League" className="w-16 h-16" />
            )}
            <div>
              <h1 className="text-3xl font-bold">{leagueData.league?.name || `League ${leagueId}`}</h1>
              <p className="text-gray-600">{leagueData.league?.country} • Season 2024/25</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leagueData.teams.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leagueData.fixtures.length}+</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{leagueData.league?.country || 'N/A'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Top Scorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{leagueData.topScorers[0]?.player?.name || 'N/A'}</div>
              <p className="text-xs text-gray-600">{leagueData.topScorers[0]?.statistics?.[0]?.goals?.total || 0} goals</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('standings')}
              className={`pb-2 px-4 ${activeTab === 'standings' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
            >
              Standings
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`pb-2 px-4 ${activeTab === 'teams' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
            >
              Teams
            </button>
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`pb-2 px-4 ${activeTab === 'fixtures' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
            >
              Fixtures
            </button>
            <button
              onClick={() => setActiveTab('topscorers')}
              className={`pb-2 px-4 ${activeTab === 'topscorers' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
            >
              Top Scorers
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'standings' && (
          <Card>
            <CardHeader>
              <CardTitle>League Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Team</th>
                      <th className="text-center p-2">P</th>
                      <th className="text-center p-2">W</th>
                      <th className="text-center p-2">D</th>
                      <th className="text-center p-2">L</th>
                      <th className="text-center p-2">GD</th>
                      <th className="text-center p-2">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leagueData.standings.map((team, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-2">{team.rank}</td>
                        <td className="p-2 flex items-center gap-2">
                          <img src={team.team?.logo} alt="" className="w-6 h-6" />
                          {team.team?.name}
                        </td>
                        <td className="text-center p-2">{team.all?.played}</td>
                        <td className="text-center p-2">{team.all?.win}</td>
                        <td className="text-center p-2">{team.all?.draw}</td>
                        <td className="text-center p-2">{team.all?.lose}</td>
                        <td className="text-center p-2">{team.goalsDiff}</td>
                        <td className="text-center p-2 font-bold">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'teams' && (
          <Card>
            <CardHeader>
              <CardTitle>Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {leagueData.teams.map((teamData, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50">
                    {teamData.team?.logo && (
                      <img src={teamData.team.logo} alt="Team" className="w-12 h-12" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{teamData.team?.name}</p>
                      <p className="text-sm text-gray-600">Founded: {teamData.team?.founded}</p>
                      <p className="text-xs text-gray-500">{teamData.venue?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'fixtures' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Fixtures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leagueData.fixtures.map((fixture, i) => (
                  <div key={i} className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={fixture.teams?.home?.logo} alt="" className="w-8 h-8" />
                        <span className="font-medium">{fixture.teams?.home?.name}</span>
                      </div>
                      <div className="text-center px-4">
                        <p className="font-bold text-lg">
                          {fixture.goals?.home !== null ? `${fixture.goals.home} - ${fixture.goals.away}` : 'vs'}
                        </p>
                        <p className="text-xs text-gray-500">{fixture.fixture?.status?.short}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{fixture.teams?.away?.name}</span>
                        <img src={fixture.teams?.away?.logo} alt="" className="w-8 h-8" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {new Date(fixture.fixture?.date).toLocaleDateString()} • {fixture.fixture?.venue?.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'topscorers' && (
          <Card>
            <CardHeader>
              <CardTitle>Top Scorers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leagueData.topScorers.map((scorer, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border rounded hover:bg-gray-50">
                    <div className="font-bold text-lg w-8">{i + 1}</div>
                    <img src={scorer.player?.photo} alt="" className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium">{scorer.player?.name}</p>
                      <p className="text-sm text-gray-600">{scorer.statistics?.[0]?.team?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{scorer.statistics?.[0]?.goals?.total}</p>
                      <p className="text-xs text-gray-600">goals</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{scorer.statistics?.[0]?.games?.appearences}</p>
                      <p className="text-xs text-gray-600">apps</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}