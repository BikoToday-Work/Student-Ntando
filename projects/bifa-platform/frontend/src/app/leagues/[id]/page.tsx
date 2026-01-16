'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowLeft, Users, TrendingUp } from "lucide-react";
import Footer from "@/components/layout/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LeagueDetailPage() {
  const params = useParams();
  const leagueId = params.id;
  const [standings, setStandings] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'standings' | 'teams'>('standings');

  useEffect(() => {
    if (leagueId) {
      fetchLeagueData();
    }
  }, [leagueId]);

  const fetchLeagueData = async () => {
    try {
      const [standingsRes, teamsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/football/standings?league=${leagueId}&season=2024`).catch(() => null),
        fetch(`${API_BASE_URL}/api/football/teams?league=${leagueId}&season=2024`).catch(() => null)
      ]);

      if (standingsRes?.ok) {
        const data = await standingsRes.json();
        setStandings(data.response?.[0]);
      }

      if (teamsRes?.ok) {
        const data = await teamsRes.json();
        setTeams(data.response || []);
      }
    } catch (error) {
      console.error('Error fetching league data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BIFA</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/leagues">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leagues
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* League Header */}
            {standings && (
              <div className="mb-8 flex items-center gap-4">
                {standings.league?.logo && (
                  <img src={standings.league.logo} alt={standings.league.name} className="h-16 w-16 object-contain" />
                )}
                <div>
                  <h1 className="text-4xl font-bold">{standings.league?.name}</h1>
                  <p className="text-gray-600">{standings.league?.country} - Season {standings.league?.season}</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab('standings')}
                className={`pb-2 px-4 font-medium ${activeTab === 'standings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Standings
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`pb-2 px-4 font-medium ${activeTab === 'teams' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Teams
              </button>
            </div>

            {/* Standings Tab */}
            {activeTab === 'standings' && standings?.league?.standings?.[0] && (
              <Card>
                <CardHeader>
                  <CardTitle>League Standings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="pb-2 pr-4">Pos</th>
                          <th className="pb-2 pr-4">Team</th>
                          <th className="pb-2 pr-4 text-center">P</th>
                          <th className="pb-2 pr-4 text-center">W</th>
                          <th className="pb-2 pr-4 text-center">D</th>
                          <th className="pb-2 pr-4 text-center">L</th>
                          <th className="pb-2 pr-4 text-center">GF</th>
                          <th className="pb-2 pr-4 text-center">GA</th>
                          <th className="pb-2 pr-4 text-center">GD</th>
                          <th className="pb-2 text-center font-bold">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.league.standings[0].map((team: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 pr-4">{team.rank}</td>
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                {team.team?.logo && (
                                  <img src={team.team.logo} alt={team.team.name} className="h-6 w-6 object-contain" />
                                )}
                                <span>{team.team?.name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-center">{team.all?.played}</td>
                            <td className="py-3 pr-4 text-center">{team.all?.win}</td>
                            <td className="py-3 pr-4 text-center">{team.all?.draw}</td>
                            <td className="py-3 pr-4 text-center">{team.all?.lose}</td>
                            <td className="py-3 pr-4 text-center">{team.all?.goals?.for}</td>
                            <td className="py-3 pr-4 text-center">{team.all?.goals?.against}</td>
                            <td className="py-3 pr-4 text-center">{team.goalsDiff}</td>
                            <td className="py-3 text-center font-bold">{team.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teams Tab */}
            {activeTab === 'teams' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team: any, index: number) => (
                  <Link href={`/teams/${team.team?.id}`} key={index}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          {team.team?.logo && (
                            <img src={team.team.logo} alt={team.team.name} className="h-12 w-12 object-contain" />
                          )}
                          <div>
                            <CardTitle className="text-lg">{team.team?.name}</CardTitle>
                            <p className="text-sm text-gray-500">{team.venue?.name}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Founded: {team.team?.founded}</p>
                        <p className="text-sm text-gray-600">Capacity: {team.venue?.capacity?.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!standings && !teams.length && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No data available for this league.
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
