import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMatches, useReferees, useAssignReferee } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, Calendar, MapPin, Loader2 } from 'lucide-react';

export default function AssignReferees() {
  const { toast } = useToast();
  const { data: matches = [], isLoading: loadingMatches } = useMatches();
  const { data: referees = [], isLoading: loadingReferees } = useReferees();
  const assignMutation = useAssignReferee();
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedReferee, setSelectedReferee] = useState('');

  const handleAssign = () => {
    if (!selectedMatch || !selectedReferee) {
      toast({ 
        title: 'Error', 
        description: 'Please select both a match and a referee', 
        variant: 'destructive' 
      });
      return;
    }
    
    console.log('Assigning referee:', { matchId: selectedMatch, refereeId: selectedReferee });
    
    assignMutation.mutate(
      { matchId: selectedMatch, refereeId: selectedReferee },
      {
        onSuccess: () => {
          setSelectedMatch('');
          setSelectedReferee('');
        }
      }
    );
  };

  const scheduledMatches = matches.filter(m => m.status === 'scheduled');

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-display text-3xl">Assign Referees</h1>
          <p className="text-muted-foreground text-sm mt-1">Assign referees to upcoming matches</p>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">New Assignment</h3>
          
          {assignMutation.isError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4 text-sm text-destructive">
              Failed to assign referee. Check console for details.
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Select Match
              </label>
              <select
                value={selectedMatch}
                onChange={e => setSelectedMatch(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                disabled={loadingMatches}
              >
                <option value="">Choose a match...</option>
                {scheduledMatches.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.home_team} vs {m.away_team} - {new Date(m.kickoff_utc).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Select Referee
              </label>
              <select
                value={selectedReferee}
                onChange={e => setSelectedReferee(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                disabled={loadingReferees}
              >
                <option value="">Choose a referee...</option>
                {referees.filter(r => r.status === 'active').map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.country}) - {r.grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleAssign}
            disabled={!selectedMatch || !selectedReferee || assignMutation.isPending}
            className="mt-4 flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {assignMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
            Assign Referee
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
