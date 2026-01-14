
"use client";

import Link from 'next/link';
import { Calendar, Trophy, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const upcomingMatches = [
    { id: 1, home: 'Vital\'O FC', away: 'Le Messager', date: '2026-01-15', time: '15:00' },
    { id: 2, home: 'Aigle Noir', away: 'Athletico', date: '2026-01-16', time: '16:00' },
    { id: 3, home: 'Flambeau', away: 'Musongati', date: '2026-01-17', time: '14:00' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyem0wLTR2Mkg0VjZoMzJ2MjBoLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-6">
              <Trophy className="h-4 w-4" />
              <span>Season 2026 Now Live</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Burundi Football Federation
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              Official platform for managing leagues, teams, and competitions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition">
                <Calendar className="mr-2 h-5 w-5" />
                View Matches
              </Link>
              <Link href="/public" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-transparent border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition">
                <Users className="mr-2 h-5 w-5" />
                Browse Teams
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-amber-500">16</p>
              <p className="text-sm text-gray-600">League Teams</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-500">240</p>
              <p className="text-sm text-gray-600">Registered Players</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-500">56</p>
              <p className="text-sm text-gray-600">Licensed Referees</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-500">120</p>
              <p className="text-sm text-gray-600">Matches This Season</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Upcoming Matches</h2>
            <Link href="/admin" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6">
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-500">{match.date}</p>
                  <p className="font-semibold text-lg">{match.time}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-right">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center ml-auto mb-2">
                      <span className="font-bold text-gray-600">{match.home[0]}</span>
                    </div>
                    <span className="font-medium text-sm">{match.home}</span>
                  </div>
                  <span className="text-gray-400 font-semibold">vs</span>
                  <div className="flex-1 text-left">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-auto mb-2">
                      <span className="font-bold text-gray-600">{match.away[0]}</span>
                    </div>
                    <span className="font-medium text-sm">{match.away}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the BIFA Community</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're a team manager, referee, or football enthusiast, 
            access the platform to manage and track football activities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/admin" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              Access Dashboard
            </Link>
            <Link href="/public" className="px-6 py-3 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}