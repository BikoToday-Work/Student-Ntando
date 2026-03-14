"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, FileText, CheckCircle, Clock, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function GovernanceAdminPage() {
  const [documents, setDocuments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('document');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [documentsRes, tasksRes] = await Promise.all([
        fetch(`${API_URL}/api/governance/documents`, { headers }),
        fetch(`${API_URL}/api/governance/tasks`, { headers })
      ]);

      if (documentsRes.ok) {
        const documentsData = await documentsRes.json();
        setDocuments(documentsData);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/governance/documents`, {
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
          description: "Document uploaded successfully"
        });
        setIsDialogOpen(false);
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
  };

  const handleCreateTask = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/governance/tasks`, {
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
          description: "Task created successfully"
        });
        setIsDialogOpen(false);
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  const handleApproveDocument = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/governance/documents/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Document approved successfully"
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve document",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/governance/tasks/${id}/status`, {
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
          description: "Task status updated successfully"
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

  const DocumentForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'POLICY',
      fileUrl: '',
      entityType: '',
      entityId: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Document Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Document Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POLICY">Policy</SelectItem>
              <SelectItem value="MINUTES">Minutes</SelectItem>
              <SelectItem value="REPORT">Report</SelectItem>
              <SelectItem value="CERTIFICATE">Certificate</SelectItem>
              <SelectItem value="FORM">Form</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fileUrl">File URL</Label>
          <Input
            id="fileUrl"
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            placeholder="https://example.com/document.pdf"
            required
          />
        </div>
        <div>
          <Label htmlFor="entityType">Entity Type (Optional)</Label>
          <Input
            id="entityType"
            value={formData.entityType}
            onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
            placeholder="e.g., COMPETITION, TEAM"
          />
        </div>
        <div>
          <Label htmlFor="entityId">Entity ID (Optional)</Label>
          <Input
            id="entityId"
            value={formData.entityId}
            onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
            placeholder="Related entity ID"
          />
        </div>
        <Button type="submit" className="w-full">
          Upload Document
        </Button>
      </form>
    );
  };

  const TaskForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      assignedRole: 'SECRETARIAT',
      dueDate: '',
      priority: 'MEDIUM'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="assignedRole">Assigned Role</Label>
          <Select value={formData.assignedRole} onValueChange={(value) => setFormData({ ...formData, assignedRole: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SECRETARIAT">Secretariat</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="FEDERATION_OFFICIAL">Federation Official</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    );
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
          <h1 className="text-3xl font-bold">Governance Portal</h1>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Secretariat Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Document Management</CardTitle>
                  <Dialog open={isDialogOpen && dialogType === 'document'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setDialogType('document')}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Upload New Document</DialogTitle>
                      </DialogHeader>
                      <DocumentForm onSubmit={handleUploadDocument} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{doc.name}</h3>
                          <p className="text-sm text-gray-600">Type: {doc.type}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={doc.status === 'APPROVED' ? 'default' : 'secondary'}>
                              {doc.status}
                            </Badge>
                            {doc.creator && (
                              <Badge variant="outline">
                                By: {doc.creator.firstName} {doc.creator.lastName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        {doc.status !== 'APPROVED' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproveDocument(doc.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Secretariat Tasks</CardTitle>
                  <Dialog open={isDialogOpen && dialogType === 'task'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setDialogType('task')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                      </DialogHeader>
                      <TaskForm onSubmit={handleCreateTask} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Clock className="h-8 w-8 text-orange-600" />
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={task.status === 'APPROVED' ? 'default' : 'secondary'}>
                              {task.status}
                            </Badge>
                            <Badge variant="outline">
                              {task.assignedRole}
                            </Badge>
                            {task.priority && (
                              <Badge variant={task.priority === 'HIGH' ? 'destructive' : 'outline'}>
                                {task.priority}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status === 'PENDING_APPROVAL' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateTaskStatus(task.id, 'APPROVED')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}