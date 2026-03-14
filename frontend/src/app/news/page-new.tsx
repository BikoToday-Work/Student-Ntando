"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, TrendingUp, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CMS news
        const newsRes = await fetch(`${API_URL}/api/cms/news?language=${selectedLanguage}&status=PUBLISHED&limit=10`);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(newsData.data || newsData);
        }

        // Fetch fixtures (legacy)
        const fixturesRes = await fetch(`${API_URL}/api/competitions/matches`).catch(() => null);
        if (fixturesRes?.ok) {
          const fixturesData = await fixturesRes.json();
          setFixtures(fixturesData.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLanguage]);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Latest News & Updates</h1>
              <p className="text-gray-600 mt-2">Official BIFA news and announcements</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
              <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* News Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Latest News
            </h2>
            {news.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {article.category && (
                        <Badge variant="outline">{article.category}</Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {article.featuredImage && (
                    <img 
                      src={article.featuredImage} 
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {article.tags?.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      By {article.author?.firstName} {article.author?.lastName}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {news.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No news articles available in {selectedLanguage === 'en' ? 'English' : 'French'}.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Fixtures */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Upcoming Fixtures
              </h2>
              <div className="space-y-3">
                {fixtures.map((fixture, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{fixture.homeTeam}</span>
                          <span className="text-xs text-gray-500">VS</span>
                          <span className="font-semibold text-sm">{fixture.awayTeam}</span>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {fixture.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {fixture.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{fixture.venue}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {fixtures.length === 0 && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-500">No upcoming fixtures</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Card>
                  <CardContent className="p-3">
                    <a href="/admin/cms" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      CMS Administration
                    </a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <a href="/admin/governance" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Governance Portal
                    </a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <a href="/admin/referee" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Referee Registry
                    </a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <a href="/admin/disciplinary" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Disciplinary Reports
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}