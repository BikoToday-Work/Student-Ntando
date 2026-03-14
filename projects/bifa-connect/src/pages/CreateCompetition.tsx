import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Trophy, Calendar, Users, FileText, ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CreateCompetition() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    season: new Date().getFullYear().toString(),
    competition_type: 'league',
    description: '',
    start_date: '',
    end_date: '',
    participating_nations: 0,
    total_teams: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('competitions')
        .insert([{
          ...formData,
          status: 'upcoming',
          created_by: user?.id,
          federation_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      alert('Competition created successfully!');
      navigate('/dashboard/competitions');
    } catch (error: any) {
      alert('Error creating competition: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/competitions')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-3xl flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              Create Competition
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Set up a new competition for your federation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="stat-card rounded-xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Competition Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., BIFA Champions Cup"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Season *</label>
              <input
                type="text"
                required
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Competition Type *</label>
              <select
                required
                value={formData.competition_type}
                onChange={(e) => setFormData({ ...formData, competition_type: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="league">League</option>
                <option value="cup">Cup</option>
                <option value="tournament">Tournament</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Participating Nations</label>
              <input
                type="number"
                min="0"
                value={formData.participating_nations}
                onChange={(e) => setFormData({ ...formData, participating_nations: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date *</label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Describe the competition format, rules, and objectives..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 gradient-green text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Competition'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/competitions')}
              className="px-6 py-2 bg-muted text-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
