"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/football/fixtures?league=39&season=2024');
        if (response.ok) {
          const data = await response.json();
          setMatches(data.response?.slice(0, 20) || []);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
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
          <h1 className="text-3xl font-bold text-gray-900">Football Matches</h1>
          <p className="text-gray-600 mt-2">Premier League fixtures and results</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="space-y-4">
          {matches.map((match, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {match.teams?.home?.logo && (
                        <img src={match.teams.home.logo} alt="Home Team" className="w-8 h-8 object-contain" />
                      )}
                      <span className="font-medium">{match.teams?.home?.name}</span>
                    </div>
                    
                    <div className="text-center px-4">
                      {match.goals?.home !== null ? (
                        <div className="text-xl font-bold">
                          {match.goals.home} - {match.goals.away}
                        </div>
                      ) : (
                        <div className="text-lg text-gray-500">vs</div>
                      )}
                      <div className="text-xs text-gray-500">{match.fixture?.status?.short}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{match.teams?.away?.name}</span>
                      {match.teams?.away?.logo && (
                        <img src={match.teams.away.logo} alt="Away Team" className="w-8 h-8 object-contain" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-600 ml-4">
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(match.fixture?.date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(match.fixture?.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    {match.fixture?.venue?.name && (
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {match.fixture.venue.name}
                      </p>
                    )}
                  </div>
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