import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useTimezone } from '@/context/TimezoneContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronRight, Eye, Download, History, Loader2 } from 'lucide-react';

const categoryColors: Record<string, string> = {
  statute: 'bg-primary/20 text-primary',
  regulation: 'bg-bifa-blue/20 text-bifa-blue',
  circular: 'bg-secondary/20 text-secondary-foreground',
  resolution: 'bg-primary/10 text-primary',
  policy: 'bg-muted text-muted-foreground',
  report: 'bg-secondary/10 text-secondary-foreground',
};

const statusIcons = {
  draft: <Clock className="w-3 h-3" />,
  under_review: <AlertCircle className="w-3 h-3" />,
  approved: <CheckCircle2 className="w-3 h-3" />,
  archived: <FileText className="w-3 h-3" />,
};

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  under_review: 'bg-secondary/20 text-secondary-foreground',
  approved: 'bg-primary/20 text-primary',
  archived: 'bg-muted text-muted-foreground',
};

export default function Governance() {
  const { user, hasPermission } = useAuth();
  const { formatInTimezone } = useTimezone();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'statute'
  });

  // Fetch documents from database
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['governance-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('governance_documents')
        .select('*')
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error('No file selected');
      
      // Read file as base64
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
      
      const { data, error } = await supabase
        .from('governance_documents')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          status: 'draft',
          version: '1.0',
          file_name: selectedFile.name,
          file_size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
          file_url: fileContent,
          uploaded_by: user?.name || user?.email || 'Unknown'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-documents'] });
      toast({ title: 'Success', description: 'Document uploaded successfully' });
      setShowUpload(false);
      setSelectedFile(null);
      setFormData({ title: '', description: '', category: 'statute' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (docId: string) => {
      const { data, error } = await supabase
        .from('governance_documents')
        .update({
          status: 'approved',
          approved_by: user?.name || user?.email,
          approved_at: new Date().toISOString()
        })
        .eq('id', docId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-documents'] });
      toast({ title: 'Success', description: 'Document approved' });
    }
  });

  // Mark as under review mutation
  const reviewMutation = useMutation({
    mutationFn: async (docId: string) => {
      const { data, error } = await supabase
        .from('governance_documents')
        .update({ status: 'under_review' })
        .eq('id', docId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-documents'] });
      toast({ title: 'Success', description: 'Document marked as under review' });
    }
  });

  const canEdit = hasPermission('edit_governance');
  const canApprove = hasPermission('approve_documents');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: 'Error', description: 'File size must be less than 50MB', variant: 'destructive' });
        return;
      }
      setSelectedFile(file);
      toast({ title: 'File selected', description: file.name });
    }
  };

  const handleSaveDraft = () => {
    if (!selectedFile) {
      toast({ title: 'Error', description: 'Please select a file to upload', variant: 'destructive' });
      return;
    }
    if (!formData.title) {
      toast({ title: 'Error', description: 'Please enter a document title', variant: 'destructive' });
      return;
    }
    uploadMutation.mutate();
  };

  const handleDownload = (doc: any) => {
    if (doc.file_url) {
      const a = document.createElement('a');
      a.href = doc.file_url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({ title: 'Downloaded', description: doc.title });
    } else {
      toast({ title: 'Error', description: 'File not found', variant: 'destructive' });
    }
  };

  const handleView = (doc: any) => {
    if (doc.file_url) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>${doc.title}</title></head>
            <body style="margin:0;">
              <iframe src="${doc.file_url}" style="width:100%;height:100vh;border:none;"></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
      toast({ title: 'Opening', description: doc.title });
    } else {
      toast({ title: 'Error', description: 'File not found', variant: 'destructive' });
    }
  };

  const filtered = filter === 'all' ? documents : documents.filter((d: any) => d.status === filter || d.category === filter);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">{t('governance')}</h1>
            <p className="text-muted-foreground text-sm mt-1">Document management, versioning & approval workflows</p>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 shadow-glow"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Documents', value: documents.length, color: 'primary' },
            { label: 'Approved', value: documents.filter((d: any) => d.status === 'approved').length, color: 'primary' },
            { label: 'Under Review', value: documents.filter((d: any) => d.status === 'under_review').length, color: 'secondary' },
            { label: 'Draft', value: documents.filter((d: any) => d.status === 'draft').length, color: 'muted-foreground' },
          ].map((s, i) => (
            <div key={i} className="stat-card rounded-xl p-4 text-center">
              <div className={`font-display text-3xl text-${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Upload form */}
        {showUpload && (
          <div className="stat-card rounded-xl p-5 border border-primary/20 animate-fade-in">
            <h3 className="font-semibold mb-4">Upload New Document</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Document Title</label>
                <input
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. BIFA Transfer Regulations 2026"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {['statute','regulation','circular','resolution','policy','report'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                  placeholder="Document description and purpose..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Upload File</label>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileSelect}
                  accept=".pdf,.docx,.xlsx,.doc,.xls"
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="block border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : 'Drop file here or click to browse'}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, XLSX (max 50MB)'}
                  </p>
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveDraft}
                disabled={uploadMutation.isPending}
                className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {uploadMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save as Draft
              </button>
              <button
                onClick={() => { setShowUpload(false); setSelectedFile(null); }}
                className="bg-muted text-foreground px-4 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {['all', 'approved', 'under_review', 'draft', 'statute', 'regulation', 'policy'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Documents */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="stat-card rounded-xl p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No documents found</p>
          </div>
        ) : (
          <div className="space-y-3">
          {filtered.map((doc: any) => (
            <div key={doc.id} className="stat-card rounded-xl overflow-hidden">
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-sm">{doc.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[doc.category]}`}>{doc.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${statusColors[doc.status]}`}>
                          {statusIcons[doc.status]}
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{doc.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>v{doc.version}</span>
                        <span>{doc.file_size}</span>
                        <span>By {doc.uploaded_by}</span>
                        <span className="font-mono">{formatInTimezone(doc.uploaded_at).slice(0, 17)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleView(doc); }}
                      className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      title="View document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                      className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {expandedDoc === doc.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </div>

              {/* Expanded — Change log */}
              {expandedDoc === doc.id && (
                <div className="border-t border-border p-5 bg-muted/30 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold">Version History</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">No version history available</div>
                  </div>
                  {canApprove && doc.status === 'draft' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <button
                        onClick={() => approveMutation.mutate(doc.id)}
                        disabled={approveMutation.isPending}
                        className="flex items-center gap-1.5 gradient-green text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {t('approve')}
                      </button>
                      <button
                        onClick={() => reviewMutation.mutate(doc.id)}
                        disabled={reviewMutation.isPending}
                        className="flex items-center gap-1.5 bg-secondary/20 text-secondary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-secondary/30 disabled:opacity-50"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Mark Under Review
                      </button>
                    </div>
                  )}
                  {doc.approved_by && (
                    <div className="mt-3 text-xs text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Approved by {doc.approved_by} at {formatInTimezone(doc.approved_at || '').slice(0, 17)} UTC
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        )}
      </div>
    </AppLayout>
  );
}
