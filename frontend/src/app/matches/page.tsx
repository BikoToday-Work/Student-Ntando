'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowLeft, Calendar, Clock, MapPin, Search } from "lucide-react";
import Footer from "@/components/layout/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    const filtered = matches.filter((match: any) => 
      match.homeTeam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMatches(filtered);
  }, [searchTerm, matches]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/competitions/matches`);
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
        setFilteredMatches(data);
      }
    } catch (error) {
      console.error('Error fetching matches');
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
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">All Matches</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by team or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match: any) => (
              <Card key={match.id}>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(match.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{match.time}</span>
                  </div>
                  <CardTitle className="text-lg">
                    {match.homeTeam} vs {match.awayTeam}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{match.venue}</span>
                  </div>
                  {match.status && (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      {match.status}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              {searchTerm ? 'No matches found matching your search.' : 'No matches available at the moment.'}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
