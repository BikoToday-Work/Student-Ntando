'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowLeft, Search } from "lucide-react";
import Footer from "@/components/layout/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompetitions();
  }, []);

  useEffect(() => {
    const filtered = competitions.filter((competition: any) => 
      competition.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.season?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompetitions(filtered);
  }, [searchTerm, competitions]);

  const fetchCompetitions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/competitions`);
      if (response.ok) {
        const data = await response.json();
        setCompetitions(data);
        setFilteredCompetitions(data);
      }
    } catch (error) {
      console.error('Error fetching competitions');
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
        <h1 className="text-4xl font-bold mb-8">All Competitions</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by competition or season..."
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
        ) : filteredCompetitions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCompetitions.map((competition: any) => (
              <Card key={competition.id}>
                <CardHeader>
                  <Trophy className="h-10 w-10 text-blue-600 mb-3" />
                  <CardTitle>{competition.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{competition.season}</p>
                  <p className="text-sm text-gray-500">{competition.teams?.length || 0} Teams</p>
                  {competition.startDate && (
                    <p className="text-sm text-gray-500 mt-2">
                      Start: {new Date(competition.startDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              {searchTerm ? 'No competitions found matching your search.' : 'No competitions available at the moment.'}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
