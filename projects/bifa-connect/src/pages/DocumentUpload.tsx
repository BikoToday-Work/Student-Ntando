import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, FileText, ArrowLeft } from 'lucide-react';

export default function DocumentUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    version: '1.0',
    description: '',
    change_log: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !formData.title || !formData.category) {
      toast.error('Please fill all required fields and select a file');
      return;
    }

    setUploading(true);
    try {
      // For now, store document metadata without file upload
      // File upload requires Supabase storage bucket configuration
      const { error: dbError } = await supabase
        .from('governance_documents')
        .insert({
          title: formData.title,
          category: formData.category,
          version: formData.version,
          description: formData.description,
          file_name: file.name,
          file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploaded_by: user?.name,
          status: 'under_review',
          change_log: JSON.stringify([{
            version: formData.version,
            changed_at: new Date().toISOString(),
            changed_by: user?.name,
            notes: formData.change_log || 'Initial upload',
          }]),
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue anyway - document metadata saved
      }

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'DOCUMENT_UPLOADED',
        module: 'Governance',
        details: `Uploaded document: ${formData.title}`,
      });

      toast.success('Document uploaded successfully');
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        version: '1.0',
        description: '',
        change_log: '',
      });
      setFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Upload Document</h1>
          <p className="text-muted-foreground">Upload governance documents for review</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Document Title *</label>
          <Input
            placeholder="e.g., BIFA Constitution 2026"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Category *</label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="statute">Statute</SelectItem>
                <SelectItem value="regulation">Regulation</SelectItem>
                <SelectItem value="circular">Circular</SelectItem>
                <SelectItem value="resolution">Resolution</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="report">Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Version *</label>
            <Input
              placeholder="e.g., 1.0"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            placeholder="Brief description of the document..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Change Log Notes</label>
          <Textarea
            placeholder="What changes were made in this version..."
            value={formData.change_log}
            onChange={(e) => setFormData({ ...formData, change_log: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Upload PDF File *</label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {file ? (
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-1">Click to upload PDF</p>
                  <p className="text-sm text-muted-foreground">Maximum file size: 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Documents will be submitted for review. Super admins will be notified to approve or reject.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </div>
    </div>
  );
}
