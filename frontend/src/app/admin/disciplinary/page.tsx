"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function DisciplinaryAdminPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const url = statusFilter 
        ? `${API_URL}/api/disciplinary-reports?status=${statusFilter}`
        : `${API_URL}/api/disciplinary-reports`;

      const response = await fetch(url, { headers });

      if (response.ok) {
        const reportsData = await response.json();
        setReports(reportsData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch disciplinary reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/disciplinary-reports`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Disciplinary report created successfully"
        });
        setIsDialogOpen(false);
        fetchReports();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create report');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateReportStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/disciplinary-reports/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Report status updated to ${status}`
        });
        fetchReports();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive"
      });
    }
  };

  const ReportForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      matchId: '',
      refereeId: '',
      playerId: '',
      incident: '',
      action: 'YELLOW_CARD',
      minute: '',
      description: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="matchId">Match ID</Label>
          <Input
            id="matchId"
            value={formData.matchId}
            onChange={(e) => setFormData({ ...formData, matchId: e.target.value })}
            placeholder="Enter match ID"
            required
          />
        </div>
        <div>
          <Label htmlFor="refereeId">Referee ID</Label>
          <Input
            id="refereeId"
            value={formData.refereeId}
            onChange={(e) => setFormData({ ...formData, refereeId: e.target.value })}
            placeholder="Enter referee ID"
            required
          />
        </div>
        <div>
          <Label htmlFor="playerId">Player ID (Optional)</Label>
          <Input
            id="playerId"
            value={formData.playerId}
            onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
            placeholder="Enter player ID if applicable"
          />
        </div>
        <div>
          <Label htmlFor="incident">Incident Type</Label>
          <Input
            id="incident"
            value={formData.incident}
            onChange={(e) => setFormData({ ...formData, incident: e.target.value })}
            placeholder="e.g., Unsporting behavior, Violent conduct"
            required
          />
        </div>
        <div>
          <Label htmlFor="action">Disciplinary Action</Label>
          <Select value={formData.action} onValueChange={(value) => setFormData({ ...formData, action: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YELLOW_CARD">Yellow Card</SelectItem>
              <SelectItem value="RED_CARD">Red Card</SelectItem>
              <SelectItem value="SUSPENSION">Suspension</SelectItem>
              <SelectItem value="FINE">Fine</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="minute">Minute (Optional)</Label>
          <Input
            id="minute"
            type="number"
            value={formData.minute}
            onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
            placeholder="Match minute"
            min="1"
            max="120"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of the incident"
            rows={4}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Submit Report
        </Button>
      </form>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'UNDER_REVIEW':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'YELLOW_CARD':
        return 'bg-yellow-100 text-yellow-800';
      case 'RED_CARD':
        return 'bg-red-100 text-red-800';
      case 'SUSPENSION':
        return 'bg-purple-100 text-purple-800';
      case 'FINE':
        return 'bg-orange-100 text-orange-800';
      case 'WARNING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Disciplinary Reports</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Disciplinary Report</DialogTitle>
              </DialogHeader>
              <ReportForm onSubmit={handleCreateReport} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Reports</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports ({reports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(report.status)}
                      <div>
                        <h3 className="font-semibold">{report.incident}</h3>
                        <p className="text-sm text-gray-600">
                          {report.match?.homeTeam?.name} vs {report.match?.awayTeam?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Referee: {report.referee?.user?.firstName} {report.referee?.user?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getActionColor(report.action)}>
                        {report.action.replace('_', ' ')}
                      </Badge>
                      <Badge variant={report.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {report.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Description:</p>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                    <div>
                      {report.player && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Player:</p>
                          <p className="text-sm text-gray-600">
                            {report.player.firstName} {report.player.lastName}
                            {report.player.team && ` (${report.player.team.name})`}
                          </p>
                        </div>
                      )}
                      {report.minute && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Minute:</p>
                          <p className="text-sm text-gray-600">{report.minute}'</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {report.status === 'SUBMITTED' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateReportStatus(report.id, 'UNDER_REVIEW')}
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateReportStatus(report.id, 'APPROVED')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateReportStatus(report.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {report.status === 'UNDER_REVIEW' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateReportStatus(report.id, 'APPROVED')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateReportStatus(report.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No disciplinary reports found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}