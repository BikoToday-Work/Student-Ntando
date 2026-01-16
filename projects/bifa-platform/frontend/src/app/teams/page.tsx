"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MapPin, Calendar } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/football/teams?league=39&season=2024');
        if (response.ok) {
          const data = await response.json();
          setTeams(data.response || []);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Football Teams</h1>
          <p className="text-gray-600 mt-2">Premier League teams for 2024 season</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((teamData, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {teamData.team?.logo && (
                    <img src={teamData.team.logo} alt="Team Logo" className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{teamData.team?.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {teamData.team?.country}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Founded: {teamData.team?.founded}
                  </p>
                  <p className="text-sm text-gray-600">
                    <Users className="h-3 w-3 inline mr-1" />
                    Venue: {teamData.venue?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Capacity: {teamData.venue?.capacity?.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}