import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useTimezone } from '@/context/TimezoneContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useReferees, useCreateReferee } from '@/hooks/useApi';
import { supabase } from '@/lib/supabase';
import { Star, Shield, AlertCircle, Lock, CheckCircle2, Plus, Search, Loader2, Copy, Eye, EyeOff } from 'lucide-react';

const levelColors = {
  FIFA: 'bg-primary/20 text-primary',
  Continental: 'bg-secondary/20 text-secondary-foreground',
  National: 'bg-muted text-muted-foreground',
};

const statusColors = {
  active: 'bg-primary/20 text-primary',
  suspended: 'bg-destructive/20 text-destructive',
  retired: 'bg-muted text-muted-foreground',
};

export default function RefereeRegistry() {
  const { hasPermission } = useAuth();
  const { formatInTimezone } = useTimezone();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: referees = [], isLoading, error } = useReferees();
  const createRefereeMutation = useCreateReferee();
  const canManage = hasPermission('manage_referees');
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    flag: '',
    grade: 'National',
    status: 'active'
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegisterReferee = async () => {
    if (!formData.name || !formData.country || !formData.flag || !formData.email) {
      toast({
        title: t('error'),
        description: 'Please fill in all required fields including email',
        variant: 'destructive'
      });
      return;
    }

    const password = 'Ref' + Math.random().toString(36).slice(-8) + '!';
    setGeneratedPassword(password);

    try {
      // Create referee profile directly (skip auth for development)
      createRefereeMutation.mutate({
        name: formData.name,
        email: formData.email,
        country: formData.country,
        flag: formData.flag,
        grade: formData.grade,
        matches_officiated: 0,
        rating: 0,
        status: formData.status
      }, {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: `Referee registered. Login: ${formData.email} / Password: ${password}`,
            duration: 10000
          });
        },
        onError: (error: any) => {
          toast({
            title: t('error'),
            description: error.message || 'Failed to register referee',
            variant: 'destructive'
          });
        }
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || 'Failed to register referee',
        variant: 'destructive'
      });
    }
  };

  const filtered = referees.filter(r =>
    (filterLevel === 'all' || r.grade === filterLevel) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.country.toLowerCase().includes(search.toLowerCase()))
  );

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load referees. Check your Supabase connection.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">{t('referees')}</h1>
            <p className="text-muted-foreground text-sm mt-1">Certified officials database — secure, role-protected</p>
          </div>
          {canManage && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 shadow-glow"
            >
              <Plus className="w-4 h-4" />
              {t('registerReferee')}
            </button>
          )}
        </div>

        {/* Registration Form */}
        {showForm && canManage && (
          <div className="stat-card rounded-xl p-5">
            <h3 className="font-semibold mb-4">Register New Referee</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">{t('name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="referee@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">{t('country')}</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brazil"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Flag Emoji</label>
                <input
                  type="text"
                  value={formData.flag}
                  onChange={e => setFormData({...formData, flag: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="🇧🇷"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Grade</label>
                <select
                  value={formData.grade}
                  onChange={e => setFormData({...formData, grade: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="National">National</option>
                  <option value="Continental">Continental</option>
                  <option value="FIFA">FIFA</option>
                </select>
              </div>
            </div>
            {generatedPassword && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Login Credentials Created</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Email:</label>
                    <div className="font-mono text-sm">{formData.email}</div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Password:</label>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm flex-1">
                        {showPassword ? generatedPassword : '••••••••••'}
                      </div>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPassword);
                          toast({ title: 'Copied', description: 'Password copied to clipboard' });
                        }}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Save these credentials securely. The referee will use them to login.
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleRegisterReferee}
                disabled={createRefereeMutation.isPending}
                className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {createRefereeMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('loading')}</>
                ) : (
                  <>{t('save')}</>
                )}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', email: '', country: '', flag: '', grade: 'National', status: 'active' });
                  setGeneratedPassword('');
                  setShowPassword(false);
                }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-accent"
              >
                {generatedPassword ? 'Close' : t('cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-4 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="stat-card rounded-xl p-4 text-center animate-pulse">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Registered', value: referees.length, color: 'foreground' },
              { label: 'FIFA Grade', value: referees.filter(r => r.grade === 'FIFA').length, color: 'primary' },
              { label: 'Active', value: referees.filter(r => r.status === 'active').length, color: 'primary' },
              { label: 'Suspended', value: referees.filter(r => r.status === 'suspended').length, color: 'destructive' },
            ].map((s, i) => (
              <div key={i} className="stat-card rounded-xl p-4 text-center">
                <div className={`font-display text-3xl text-${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Access notice */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <Lock className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">Secure Registry:</span> Personal data (NID, passport numbers, medical records) requires Referee-level access or above.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search referees..."
              className="w-full bg-muted border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {['all', 'FIFA', 'Continental', 'National'].map(l => (
            <button
              key={l}
              onClick={() => setFilterLevel(l)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filterLevel === l ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Referee cards */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="stat-card rounded-xl p-5 animate-pulse">
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-16 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="stat-card rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No referees found. {canManage && 'Click "Register Referee" to add one.'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(ref => (
              <div key={ref.id} className="stat-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-green rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {ref.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold">{ref.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-lg">{ref.flag}</span>
                        <span className="text-sm text-muted-foreground">{ref.country}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[ref.grade] || levelColors.National}`}>{ref.grade}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ref.status]}`}>{ref.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Matches', value: ref.matches_officiated || 0 },
                    { label: 'Rating', value: ref.rating?.toFixed(1) || '0.0' },
                    { label: 'Grade', value: ref.grade },
                  ].map((stat, i) => (
                    <div key={i} className="bg-muted rounded-lg px-3 py-2 text-center">
                      <div className="font-bold text-lg">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground border-t border-border pt-3">
                  <span>Registered: {new Date(ref.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
