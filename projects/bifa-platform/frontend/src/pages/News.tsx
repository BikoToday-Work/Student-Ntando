import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Fixture {
  fixture: {
    id: number;
    date: string;
    status: {
      long: string;
    };
  };
  league: {
    name: string;
    country: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
}

export default function NewsPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/football/fixtures')
      .then(res => res.json())
      .then(data => {
        setFixtures(data.response || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Latest News & Fixtures</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {fixtures.map((fixture) => (
              <Card key={fixture.fixture.id}>
                <CardHeader>
                  <CardTitle className="text-base">{fixture.league.name} - {fixture.league.country}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(fixture.fixture.date).toLocaleDateString()} - {fixture.fixture.status.long}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="h-8 w-8" />
                      <span className="font-medium">{fixture.teams.home.name}</span>
                    </div>
                    <span className="text-muted-foreground font-semibold">vs</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{fixture.teams.away.name}</span>
                      <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
