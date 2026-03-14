import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, UserX, Search, Edit } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  country: string;
  created_at: string;
  is_active: boolean;
}

export default function UserManagement() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'ROLE_CHANGED',
        module: 'User Management',
        entity_id: selectedUser.id,
        details: `Changed role from ${selectedUser.role} to ${newRole}`,
      });

      toast.success('User role updated successfully');
      setShowRoleDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeactivate = async () => {
    if (!selectedUser || !deactivateReason) {
      toast.error('Please provide a reason for deactivation');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'USER_DEACTIVATED',
        module: 'User Management',
        entity_id: selectedUser.id,
        details: `Deactivated user: ${deactivateReason}`,
      });

      toast.success('User account deactivated');
      setShowDeactivateDialog(false);
      setDeactivateReason('');
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user');
    }
  };

  const handleReactivate = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', userId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'USER_REACTIVATED',
        module: 'User Management',
        entity_id: userId,
        details: 'User account reactivated',
      });

      toast.success('User account reactivated');
      fetchUsers();
    } catch (error) {
      console.error('Error reactivating user:', error);
      toast.error('Failed to reactivate user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-red-500',
      federation_admin: 'bg-blue-500',
      secretariat_officer: 'bg-green-500',
      referee: 'bg-purple-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Only Super Admins can access user management.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage user roles and account status</p>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading users...</div>
      ) : (
        <div className="bg-card rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Country</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{u.full_name || 'N/A'}</td>
                    <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="p-4">
                      <Badge className={getRoleBadge(u.role)}>
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{u.country || 'N/A'}</td>
                    <td className="p-4">
                      <Badge variant={u.is_active ? 'default' : 'destructive'}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(u);
                            setNewRole(u.role);
                            setShowRoleDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Role
                        </Button>
                        {u.is_active ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedUser(u);
                              setShowDeactivateDialog(true);
                            }}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleReactivate(u.id)}
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">User</label>
              <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Current Role</label>
              <p className="text-sm text-muted-foreground">{selectedUser?.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">New Role</label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="federation_admin">Federation Admin</SelectItem>
                  <SelectItem value="secretariat_officer">Secretariat Officer</SelectItem>
                  <SelectItem value="referee">Referee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">User</label>
              <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Reason for Deactivation</label>
              <Input
                placeholder="Enter reason..."
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              />
            </div>
            <p className="text-sm text-destructive">
              This will immediately revoke all access for this user.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeactivate}>
              Deactivate Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
