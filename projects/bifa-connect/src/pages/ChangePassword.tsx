import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (passwordData.new.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    if (user?.role === 'referee') {
      const { data: refereeData } = await supabase.from('referees').select('id').eq('email', user.email).single();
      if (refereeData) {
        const { error } = await supabase.from('referees').update({ password: passwordData.new }).eq('id', refereeData.id);
        if (error) {
          toast({ title: 'Error', description: 'Failed to update password', variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Password updated successfully' });
          setPasswordData({ new: '', confirm: '' });
        }
      }
    } else {
      toast({ title: 'Info', description: 'Password change is currently only available for referees' });
    }
    
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-3xl flex items-center gap-3">
            <Lock className="w-8 h-8 text-primary" />
            Change Password
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Update your account password</p>
        </div>

        <div className="stat-card rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={passwordData.new}
                  onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={passwordData.confirm}
                  onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="gradient-green text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 border border-border rounded-xl p-4 text-sm">
          <p className="font-semibold mb-2">Password Requirements:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Minimum 6 characters</li>
            <li>Both passwords must match</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
