import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTimezone } from '@/context/TimezoneContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Download, Search, Filter } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  module: string;
  entity_id?: string;
  timestamp_utc: string;
  user_timezone: string;
  ip_address: string;
  details: string;
}

export default function AuditLogs() {
  const { user } = useAuth();
  const { formatInTimezone } = useTimezone();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp_utc', { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp (UTC)', 'User', 'Role', 'Action', 'Module', 'Entity ID', 'IP Address', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp_utc,
        log.user_name,
        log.user_role,
        log.action,
        log.module,
        log.entity_id || '',
        log.ip_address,
        `"${log.details}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
    toast.success('Audit logs exported');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesAction = filterAction === 'all' || log.action === filterAction;

    return matchesSearch && matchesModule && matchesAction;
  });

  const modules = [...new Set(logs.map(l => l.module))];
  const actions = [...new Set(logs.map(l => l.action))];

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE') || action.includes('REGISTER')) return 'bg-green-500';
    if (action.includes('UPDATE') || action.includes('CHANGE')) return 'bg-blue-500';
    if (action.includes('DELETE') || action.includes('DEACTIVATE')) return 'bg-red-500';
    if (action.includes('APPROVE')) return 'bg-purple-500';
    return 'bg-gray-500';
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Only Super Admins can access audit logs.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">System-wide activity tracking</p>
        </div>
        <Button onClick={exportLogs}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterModule} onValueChange={setFilterModule}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {actions.map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border mb-4">
        <div className="p-4 border-b flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">
            Showing {filteredLogs.length} of {logs.length} logs
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading audit logs...</div>
      ) : (
        <div className="bg-card rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Timestamp</th>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Action</th>
                  <th className="text-left p-4">Module</th>
                  <th className="text-left p-4">Entity ID</th>
                  <th className="text-left p-4">IP Address</th>
                  <th className="text-left p-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 text-sm">
                      <div>{new Date(log.timestamp_utc).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">UTC</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{log.user_name}</div>
                      <div className="text-xs text-muted-foreground">{log.user_role}</div>
                    </td>
                    <td className="p-4">
                      <Badge className={getActionBadge(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{log.module}</td>
                    <td className="p-4 text-sm font-mono text-muted-foreground">
                      {log.entity_id || '-'}
                    </td>
                    <td className="p-4 text-sm font-mono">{log.ip_address}</td>
                    <td className="p-4 text-sm max-w-md truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
