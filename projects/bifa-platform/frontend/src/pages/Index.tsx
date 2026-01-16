import { useTranslation } from 'react-i18next';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowRight, Play } from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();

  const upcomingMatches = [
    { id: 1, home: 'FC Barcelona', away: 'Real Madrid', date: '2026-01-15', time: '15:00' },
    { id: 2, home: 'Orlando Pirate', away: 'Sundowns', date: '2026-01-16', time: '16:00' },
    { id: 3, home: 'Siwelele', away: 'Kaizer Chiefs', date: '2026-01-17', time: '14:00' },
  ];

  const newsItems = [
    { id: 1, title: 'League Season 2026 Kicks Off', date: 'Jan 10, 2026', excerpt: 'The new season promises exciting matches...' },
    { id: 2, title: 'National Team Training Camp', date: 'Jan 8, 2026', excerpt: 'Preparations for the upcoming qualifiers...' },
    { id: 3, title: 'Youth Development Program Launch', date: 'Jan 5, 2026', excerpt: 'New initiative to nurture young talent...' },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden federation-gradient py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyem0wLTR2Mkg0VjZoMzJ2MjBoLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-6">
              <Trophy className="h-4 w-4" />
              <span>Season 2026 Now Live</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
              {t('public.heroTitle')}
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              {t('public.heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/matches">
                  <Calendar className="mr-2 h-5 w-5" />
                  {t('public.upcomingMatches')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/teams">
                  <Users className="mr-2 h-5 w-5" />
                  {t('nav.teams')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-card py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-heading font-bold text-federation-gold">16</p>
              <p className="text-sm text-muted-foreground">League Teams</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-federation-gold">240</p>
              <p className="text-sm text-muted-foreground">Registered Players</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-federation-gold">56</p>
              <p className="text-sm text-muted-foreground">Licensed Referees</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-federation-gold">120</p>
              <p className="text-sm text-muted-foreground">Matches This Season</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upcoming Matches */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold">{t('public.upcomingMatches')}</h2>
                <Link to="/matches" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <Card key={match.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-center min-w-[80px]">
                            <p className="text-xs text-muted-foreground">{match.date}</p>
                            <p className="font-semibold">{match.time}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className="font-medium">{match.home}</span>
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-xs font-bold">{match.home[0]}</span>
                              </div>
                            </div>
                            <span className="text-muted-foreground font-semibold">vs</span>
                            <div className="flex items-center gap-2 flex-1">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-xs font-bold">{match.away[0]}</span>
                              </div>
                              <span className="font-medium">{match.away}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-4">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold">{t('public.latestNews')}</h2>
                <Link to="/news" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {newsItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                      <CardTitle className="text-base font-semibold leading-tight">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Join the BIFA Community</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a team manager, referee, or football enthusiast, 
            create your account to access exclusive features and stay updated.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
