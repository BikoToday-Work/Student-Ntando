"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Search, User, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RefereeAdminPage() {
  const [referees, setReferees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReferee, setEditingReferee] = useState(null);
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

      const [refereesRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/referees`, { headers }),
        fetch(`${API_URL}/api/users?role=REFEREE`, { headers }).catch(() => ({ ok: false }))
      ]);

      if (refereesRes.ok) {
        const refereesData = await refereesRes.json();
        setReferees(refereesData);
      }

      // Mock users data for referee role selection
      setUsers([
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.referee@bifa.com', role: 'REFEREE' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.referee@bifa.com', role: 'REFEREE' }
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch referees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReferee = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/referees`, {
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
          description: "Referee created successfully"
        });
        setIsDialogOpen(false);
        setEditingReferee(null);
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create referee');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateReferee = async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/referees/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Referee updated successfully"
        });
        setIsDialogOpen(false);
        setEditingReferee(null);
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update referee",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReferee = async (id) => {
    if (!confirm('Are you sure you want to delete this referee?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/referees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Referee deleted successfully"
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete referee",
        variant: "destructive"
      });
    }
  };

  const RefereeForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
      userId: initialData?.userId || '',
      licenseNumber: initialData?.licenseNumber || '',
      certification: initialData?.certification || '',
      experience: initialData?.experience || 0,
      availability: initialData?.availability || {}
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (initialData) {
        onSubmit(initialData.id, formData);
      } else {
        onSubmit(formData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {!initialData && (
          <div>
            <Label htmlFor="userId">Select User</Label>
            <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user with REFEREE role" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="certification">Certification</Label>
          <Select value={formData.certification} onValueChange={(value) => setFormData({ ...formData, certification: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIFA Level 1">FIFA Level 1</SelectItem>
              <SelectItem value="FIFA Level 2">FIFA Level 2</SelectItem>
              <SelectItem value="FIFA Level 3">FIFA Level 3</SelectItem>
              <SelectItem value="National Level">National Level</SelectItem>
              <SelectItem value="Regional Level">Regional Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>
        <Button type="submit" className="w-full">
          {initialData ? 'Update Referee' : 'Create Referee'}
        </Button>
      </form>
    );
  };

  const filteredReferees = referees.filter(referee => {
    const fullName = `${referee.user?.firstName} ${referee.user?.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           referee.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           referee.certification.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          <h1 className="text-3xl font-bold">Referee Registry</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingReferee(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Referee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingReferee ? 'Edit Referee' : 'Add New Referee'}</DialogTitle>
              </DialogHeader>
              <RefereeForm 
                onSubmit={editingReferee ? handleUpdateReferee : handleCreateReferee} 
                initialData={editingReferee} 
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, license number, or certification..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referees ({filteredReferees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReferees.map((referee) => (
                <div key={referee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {referee.user?.firstName} {referee.user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{referee.user?.email}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">
                          License: {referee.licenseNumber}
                        </Badge>
                        <Badge variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          {referee.certification}
                        </Badge>
                        <Badge variant="outline">
                          {referee.experience} years
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingReferee(referee);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReferee(referee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredReferees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No referees found matching your search criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}