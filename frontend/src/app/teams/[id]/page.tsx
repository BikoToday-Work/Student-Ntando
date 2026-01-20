'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowLeft, Users } from "lucide-react";
import Footer from "@/components/layout/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params?.id;
  const [teamStats, setTeamStats] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      const statsRes = await fetch(`${API_BASE_URL}/api/football/team-statistics?team=${teamId}&league=39&season=2024`);
      
      if (statsRes.ok) {
        const data = await statsRes.json();
        setTeamStats(data.response);
        
        // Extract players from fixtures if available
        const fixturesRes = await fetch(`${API_BASE_URL}/api/football/fixtures?league=39&season=2024`);
        if (fixturesRes.ok) {
          const fixturesData = await fixturesRes.json();
          // Get first fixture for this team to fetch players
          const teamFixture = fixturesData.response?.find((f: any) => 
            f.teams?.home?.id == teamId || f.teams?.away?.id == teamId
          );
          
          if (teamFixture) {
            const playersRes = await fetch(`${API_BASE_URL}/api/football/fixture-players?fixture=${teamFixture.fixture?.id}`);
            if (playersRes.ok) {
              const playersData = await playersRes.json();
              const teamPlayers = playersData.response?.find((t: any) => t.team?.id == teamId);
              setPlayers(teamPlayers?.players || []);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching team data');
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
        ) : teamStats ? (
          <>
            {/* Team Header */}
            <div className="mb-8 flex items-center gap-4">
              {teamStats.team?.logo && (
                <img src={teamStats.team.logo} alt={teamStats.team.name} className="h-20 w-20 object-contain" />
              )}
              <div>
                <h1 className="text-4xl font-bold">{teamStats.team?.name}</h1>
                <p className="text-gray-600">{teamStats.league?.name} - {teamStats.league?.season}</p>
              </div>
            </div>

            {/* Team Statistics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{teamStats.form}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Matches Played</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{teamStats.fixtures?.played?.total || 0}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    W: {teamStats.fixtures?.wins?.total || 0} | 
                    D: {teamStats.fixtures?.draws?.total || 0} | 
                    L: {teamStats.fixtures?.loses?.total || 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {teamStats.goals?.for?.total?.total || 0} - {teamStats.goals?.against?.total?.total || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">For - Against</p>
                </CardContent>
              </Card>
            </div>

            {/* Player Stats */}
            {players.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Player Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="pb-2 pr-4">Player</th>
                          <th className="pb-2 pr-4">Position</th>
                          <th className="pb-2 pr-4 text-center">Rating</th>
                          <th className="pb-2 pr-4 text-center">Minutes</th>
                          <th className="pb-2 pr-4 text-center">Goals</th>
                          <th className="pb-2 pr-4 text-center">Assists</th>
                          <th className="pb-2 pr-4 text-center">Passes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {players.map((player: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                {player.player?.photo && (
                                  <img src={player.player.photo} alt={player.player.name} className="h-8 w-8 rounded-full object-cover" />
                                )}
                                <span className="font-medium">{player.player?.name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4">{player.statistics?.[0]?.games?.position || '-'}</td>
                            <td className="py-3 pr-4 text-center">{player.statistics?.[0]?.games?.rating || '-'}</td>
                            <td className="py-3 pr-4 text-center">{player.statistics?.[0]?.games?.minutes || 0}</td>
                            <td className="py-3 pr-4 text-center">{player.statistics?.[0]?.goals?.total || 0}</td>
                            <td className="py-3 pr-4 text-center">{player.statistics?.[0]?.goals?.assists || 0}</td>
                            <td className="py-3 pr-4 text-center">{player.statistics?.[0]?.passes?.total || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No data available for this team.
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
