'use client';

import React, { useState } from 'react';
import DocumentHeader from '@/components/documents/DocumentHeader';
import DocumentFilters from '@/components/documents/DocumentFilters';
import DocumentListGrid from '@/components/documents/DocumentListGrid';
import UploadDialog from '@/components/documents/UploadDialog';
import DeleteDialog from '@/components/documents/DeleteDialog';
import PreviewDialog from '@/components/documents/PreviewDialog';
import DocumentSkeleton from '@/components/documents/DocumentSkeleton';
import { Toaster } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import useDocuments from '@/hooks/useDocuments';
import Layout from '@/components/layout/Layout';

export default function DocumentsPage() {
  const {
    documents,
    loading,
    error,
    filters,
    setFilters,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    previewDocument,
    setPreviewDocument,
    selectedDocument,
    setSelectedDocument,
    deleteConfirm,
    setDeleteConfirm,
  } = useDocuments();

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();

  const handleAddClick = () => {
    setShowUploadDialog(true);
  };

  if (loading && documents.length === 0) {
    return <DocumentSkeleton />;
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>ເກີດຂໍ້ຜິດພາດ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchDocuments} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          ລອງໃໝ່ອີກຄັ້ງ
        </Button>
        <Toaster />
      </Layout>
    );
  }

  return (
    <Layout>
      <DocumentHeader 
        onAddClick={handleAddClick} 
        documentCount={documents.length} 
      />
      
      <DocumentFilters 
        filters={filters} 
        setFilters={setFilters} 
      />
      
      <DocumentListGrid 
        documents={documents}
        setPreviewDocument={setPreviewDocument}
        setDeleteConfirm={setDeleteConfirm}
        setSelectedDocument={setSelectedDocument}
        deleteDocument={deleteDocument}
        downloadDocument={downloadDocument}
      />
      
      <UploadDialog 
        uploadDocument={uploadDocument}
        showUploadDialog={showUploadDialog}
        setShowUploadDialog={setShowUploadDialog}
      />
      
      <DeleteDialog 
        deleteDocument={deleteDocument}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        selectedDocument={selectedDocument}
      />
      
      <PreviewDialog 
        previewDocument={previewDocument}
        setPreviewDocument={setPreviewDocument}
        downloadDocument={downloadDocument}
      />
      
      <Toaster />
    </Layout>
  );
}