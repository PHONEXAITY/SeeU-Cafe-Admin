"use client";

import { useState, useEffect, useCallback } from "react";
import { documentService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const DOCUMENT_TYPES = [
  { value: "id_card", label: "ບັດປະຈຳຕົວ" },
  { value: "passport", label: "ໜັງສືຜ່ານແດນ" },
  { value: "driver_license", label: "ໃບຂັບຂີ່" },
  { value: "education", label: "ໃບຢັ້ງຢືນການສຶກສາ" },
  { value: "contract", label: "ສັນຍາການຈ້າງງານ" },
  { value: "medical", label: "ໃບຢັ້ງຢືນແພດ" },
  { value: "other", label: "ອື່ນໆ" },
];

const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    userId: "",
    employeeId: "",
    dateFrom: null,
    dateTo: null,
  });

  const [previewDocument, setPreviewDocument] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState({
    loading: false,
    error: null,
  });

  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (filters.type) params.documentType = filters.type;
      if (filters.search) params.searchTerm = filters.search;
      if (filters.dateFrom) params.fromDate = filters.dateFrom.toISOString();
      if (filters.dateTo) params.toDate = filters.dateTo.toISOString();

      let response;
      if (filters.userId) {
        response = await documentService.getDocumentsByUserId(filters.userId);
      } else if (filters.employeeId) {
        response = await documentService.getDocumentsByEmployeeId(
          filters.employeeId
        );
      } else {
        response = await documentService.getAllDocuments(params);
      }

      setDocuments(response.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(
        err.response?.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນເອກະສານ"
      );
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດດຶງຂໍ້ມູນເອກະສານໄດ້",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const uploadDocument = async (formData) => {
    setLoading(true);
    try {
      const response = await documentService.uploadDocument(formData);
      toast({
        title: "ອັບໂຫລດສຳເລັດ",
        description: "ເອກະສານຖືກອັບໂຫລດສຳເລັດແລ້ວ",
      });

      fetchDocuments();

      return response.data;
    } catch (err) {
      console.error("Error uploading document:", err);
      toast({
        variant: "destructive",
        title: "ອັບໂຫລດບໍ່ສຳເລັດ",
        description: err.response?.data?.message || "ບໍ່ສາມາດອັບໂຫລດເອກະສານໄດ້",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    try {
      await documentService.deleteDocument(id);

      setDocuments(documents.filter((doc) => doc.id !== id));

      toast({
        title: "ລຶບສຳເລັດ",
        description: "ເອກະສານຖືກລຶບສຳເລັດແລ້ວ",
      });

      setDeleteConfirm(false);
      setSelectedDocument(null);
    } catch (err) {
      console.error("Error deleting document:", err);
      toast({
        variant: "destructive",
        title: "ລຶບບໍ່ສຳເລັດ",
        description: err.response?.data?.message || "ບໍ່ສາມາດລຶບເອກະສານໄດ້",
      });
    }
  };

  const downloadDocument = async (id) => {
    setDownloadStatus({ loading: true, error: null });
    try {
      const response = await documentService.downloadDocument(id);

      const docToDownload = documents.find((doc) => doc.id === id);
      if (!docToDownload) {
        throw new Error("Document not found");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement("a");
      link.href = url;

      let filename = docToDownload.file_path.split("/").pop();
      if (!filename) {
        const docType =
          DOCUMENT_TYPES.find(
            (type) => type.value === docToDownload.document_type
          )?.label || docToDownload.document_type;
        filename = `${docType}_${docToDownload.id}.pdf`;
      }

      link.setAttribute("download", filename);
      window.document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: "ດາວໂຫລດສຳເລັດ",
        description: "ເອກະສານຖືກດາວໂຫລດສຳເລັດແລ້ວ",
      });

      setDownloadStatus({ loading: false, error: null });
    } catch (err) {
      console.error("Error downloading document:", err);
      setDownloadStatus({
        loading: false,
        error: err.response?.data?.message || "ບໍ່ສາມາດດາວໂຫລດເອກະສານໄດ້",
      });

      toast({
        variant: "destructive",
        title: "ດາວໂຫລດບໍ່ສຳເລັດ",
        description: "ບໍ່ສາມາດດາວໂຫລດເອກະສານໄດ້",
      });
    }
  };

  const getDocumentById = async (id) => {
    try {
      const response = await documentService.getDocumentById(id);
      return response.data;
    } catch (err) {
      console.error("Error fetching document details:", err);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດດຶງຂໍ້ມູນເອກະສານໄດ້",
      });
      throw err;
    }
  };

  const handlePreviewDocument = async (document) => {
    if (document.id && (!document.user || !document.employee)) {
      try {
        const detailedDocument = await getDocumentById(document.id);
        setPreviewDocument(detailedDocument);
      } catch (error) {
        setPreviewDocument(document);
      }
    } else {
      setPreviewDocument(document);
    }
  };

  useEffect(() => {
    const handlePreviewEvent = (e) => {
      handlePreviewDocument(e.detail);
    };

    const handleDeleteEvent = (e) => {
      setSelectedDocument(e.detail);
      setDeleteConfirm(true);
    };

    window.addEventListener("previewDocument", handlePreviewEvent);
    window.addEventListener("deleteDocument", handleDeleteEvent);

    return () => {
      window.removeEventListener("previewDocument", handlePreviewEvent);
      window.removeEventListener("deleteDocument", handleDeleteEvent);
    };
  }, [documents]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    filters,
    setFilters,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    downloadStatus,
    getDocumentById,

    previewDocument,
    setPreviewDocument: handlePreviewDocument,
    selectedDocument,
    setSelectedDocument,
    deleteConfirm,
    setDeleteConfirm,

    documentTypes: DOCUMENT_TYPES,
  };
};

export default useDocuments;
