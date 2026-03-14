import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Building2, Plus, Edit, Power } from 'lucide-react';

interface Federation {
  id: string;
  name: string;
  country: string;
  flag: string;
  status: 'active' | 'suspended';
  member_since: string;
  admin_id?: string;
  admin_name?: string;
}

export default function FederationManagement() {
  const { user } = useAuth();
  const [federations, setFederations] = useState<Federation[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingFed, setEditingFed] = useState<Federation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    flag: '',
  });

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchFederations();
    }
  }, [user]);

  const fetchFederations = async () => {
    try {
      const { data, error } = await supabase
        .from('federations')
        .select('*')
        .order('name');
      if (error) throw error;
      setFederations(data || []);
    } catch (error) {
      // Use mock data
      setFederations([
        { id: 'fed_001', name: 'Brazilian Football Confederation', country: 'Brazil', flag: '🇧🇷', status: 'active', member_since: '2025-01-01' },
        { id: 'fed_002', name: 'All India Football Federation', country: 'India', flag: '🇮🇳', status: 'active', member_since: '2025-01-01' },
        { id: 'fed_003', name: 'Russian Football Union', country: 'Russia', flag: '🇷🇺', status: 'active', member_since: '2025-01-01' },
        { id: 'fed_004', name: 'Chinese Football Association', country: 'China', flag: '🇨🇳', status: 'active', member_since: '2025-01-01' },
        { id: 'fed_005', name: 'South African Football Association', country: 'South Africa', flag: '🇿🇦', status: 'active', member_since: '2025-01-01' },
      ]);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.country) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingFed) {
        const { error } = await supabase
          .from('federations')
          .update(formData)
          .eq('id', editingFed.id);
        if (error) throw error;
        toast.success('Federation updated');
      } else {
        const { error } = await supabase
          .from('federations')
          .insert({
            ...formData,
            status: 'active',
            member_since: new Date().toISOString(),
          });
        if (error) throw error;
        toast.success('Federation added');
      }

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: editingFed ? 'FEDERATION_UPDATED' : 'FEDERATION_ADDED',
        module: 'Federation Management',
        details: `${editingFed ? 'Updated' : 'Added'} federation: ${formData.name}`,
      });

      setShowDialog(false);
      setEditingFed(null);
      setFormData({ name: '', country: '', flag: '' });
      fetchFederations();
    } catch (error) {
      console.error('Error saving federation:', error);
      toast.error('Failed to save federation');
    }
  };

  const handleToggleStatus = async (fed: Federation) => {
    try {
      const newStatus = fed.status === 'active' ? 'suspended' : 'active';
      const { error } = await supabase
        .from('federations')
        .update({ status: newStatus })
        .eq('id', fed.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: newStatus === 'active' ? 'FEDERATION_ACTIVATED' : 'FEDERATION_SUSPENDED',
        module: 'Federation Management',
        details: `${newStatus === 'active' ? 'Activated' : 'Suspended'} federation: ${fed.name}`,
      });

      toast.success(`Federation ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      fetchFederations();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update federation status');
    }
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center">
        <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Only Super Admins can manage federations.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Federation Management</h1>
          <p className="text-muted-foreground">Manage BIFA member federations</p>
        </div>
        <Button onClick={() => {
          setEditingFed(null);
          setFormData({ name: '', country: '', flag: '' });
          setShowDialog(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Federation
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Federation</th>
                <th className="text-left p-4">Country</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Member Since</th>
                <th className="text-left p-4">Admin</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {federations.map((fed) => (
                <tr key={fed.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{fed.name}</td>
                  <td className="p-4">
                    <span className="text-2xl mr-2">{fed.flag}</span>
                    {fed.country}
                  </td>
                  <td className="p-4">
                    <Badge variant={fed.status === 'active' ? 'default' : 'destructive'}>
                      {fed.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(fed.member_since).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm">{fed.admin_name || 'Not assigned'}</td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingFed(fed);
                          setFormData({
                            name: fed.name,
                            country: fed.country,
                            flag: fed.flag,
                          });
                          setShowDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={fed.status === 'active' ? 'destructive' : 'default'}
                        onClick={() => handleToggleStatus(fed)}
                      >
                        <Power className="w-4 h-4 mr-1" />
                        {fed.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFed ? 'Edit' : 'Add'} Federation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Federation Name</label>
              <Input
                placeholder="e.g., Brazilian Football Confederation"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              <Input
                placeholder="e.g., Brazil"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Flag Emoji</label>
              <Input
                placeholder="e.g., 🇧🇷"
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              {editingFed ? 'Update' : 'Add'} Federation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
