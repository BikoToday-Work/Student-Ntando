"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, MapPin, Calendar } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/football/leagues');
        if (response.ok) {
          const data = await response.json();
          setCompetitions(data.response || []);
        }
      } catch (error) {
        console.error('Error fetching competitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
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
          <h1 className="text-3xl font-bold text-gray-900">Football Competitions</h1>
          <p className="text-gray-600 mt-2">Explore leagues and tournaments from around the world</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((comp, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => window.location.href = `/league/${comp.league?.id}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {comp.league?.logo && (
                    <img src={comp.league.logo} alt="League Logo" className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{comp.league?.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {comp.country?.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <Trophy className="h-3 w-3 inline mr-1" />
                    Type: {comp.league?.type}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">Click to view details →</p>
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