import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Team {
  team: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/football/teams')
      .then(res => res.json())
      .then(data => {
        setTeams(data.response || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Teams</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((item) => (
              <Card key={item.team.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img src={item.team.logo} alt={item.team.name} className="h-12 w-12" />
                    <CardTitle className="text-lg">{item.team.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.team.country}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
