import { useState, useEffect, useCallback } from "react";
import { employeeService, documentService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    position: "",
    status: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    leave: 0,
    inactive: 0,
    byPosition: {},
  });
  const [positions, setPositions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const { toast } = useToast();

  const fetchMetadata = useCallback(async () => {
    try {
      const positionsResponse = await employeeService.getEmployeePositions();
      if (positionsResponse.data) {
        setPositions(positionsResponse.data);
      }

      const statusResponse = await employeeService.getEmployeeStatusOptions();
      if (statusResponse.data) {
        setStatusOptions(statusResponse.data);
      }
    } catch (err) {
      console.error("Error fetching metadata:", err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const statsResponse = await employeeService.getEmployeeStats();
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error("Error fetching employee stats:", err);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await employeeService.getAllEmployees(filters);
      setEmployees(response.data);

      const total = response.data.length;
      const active = response.data.filter(
        (emp) => emp.status === "active"
      ).length;
      const leave = response.data.filter(
        (emp) => emp.status === "leave"
      ).length;
      const inactive = response.data.filter(
        (emp) => emp.status === "inactive"
      ).length;

      const byPosition = response.data.reduce((acc, emp) => {
        acc[emp.position] = (acc[emp.position] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total,
        active,
        leave,
        inactive,
        byPosition,
      });

      try {
        await fetchStats();
      } catch (statsErr) {
        console.warn("Using calculated stats instead of API stats");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນພະນັກງານ");

      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: err.message || "ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກງານໄດ້",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast, fetchStats]);

  const fetchEmployeeById = useCallback(async (id) => {
    if (!id || isNaN(id)) {
      setError("Invalid employee ID");
      return null;
    }

    try {
      setLoading(true);
      const response = await employeeService.getEmployeeById(id);
      setSelectedEmployee(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setError(err.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດພະນັກງານ");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeByEmployeeId = useCallback(async (employeeId) => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployeeByEmployeeId(
        employeeId
      );
      setSelectedEmployee(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching employee by Employee_id:", err);
      setError(err.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດພະນັກງານ");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = async (employeeData) => {
    try {
      setLoading(true);

      const response = await employeeService.createEmployee(employeeData);

      toast({
        title: "ສ້າງພະນັກງານສຳເລັດ",
        description: `ພະນັກງານ ${response.data.first_name} ${response.data.last_name} ຖືກສ້າງແລ້ວ`,
      });

      await fetchEmployees();
      return response.data;
    } catch (err) {
      console.error("Error creating employee:", err);

      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດໃນການສ້າງພະນັກງານ",
        description:
          err.response?.data?.message ||
          err.message ||
          "ບໍ່ສາມາດສ້າງພະນັກງານໄດ້",
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      setLoading(true);

      const response = await employeeService.updateEmployee(id, employeeData);

      toast({
        title: "ອັບເດດພະນັກງານສຳເລັດ",
        description: `ຂໍ້ມູນພະນັກງານ ${response.data.first_name} ${response.data.last_name} ຖືກອັບເດດແລ້ວ`,
      });

      await fetchEmployees();

      if (selectedEmployee && selectedEmployee.id === id) {
        setSelectedEmployee(response.data);
      }

      return response.data;
    } catch (err) {
      console.error("Error updating employee:", err);

      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດພະນັກງານ",
        description:
          err.response?.data?.message ||
          err.message ||
          "ບໍ່ສາມາດອັບເດດພະນັກງານໄດ້",
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setLoading(true);

      const employeeToDelete = employees.find((emp) => emp.id === id);
      const employeeName = employeeToDelete
        ? `${employeeToDelete.first_name} ${employeeToDelete.last_name}`
        : "ພະນັກງານ";

      const response = await employeeService.deleteEmployee(id);

      toast({
        title: "ລຶບພະນັກງານສຳເລັດ",
        description: `${employeeName} ຖືກລຶບອອກຈາກລະບົບແລ້ວ`,
      });

      if (selectedEmployee && selectedEmployee.id === id) {
        setSelectedEmployee(null);
      }

      await fetchEmployees();
      return response.data;
    } catch (err) {
      console.error("Error deleting employee:", err);

      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດໃນການລຶບພະນັກງານ",
        description:
          err.response?.data?.message ||
          err.message ||
          "ບໍ່ສາມາດລຶບພະນັກງານໄດ້",
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };
  const uploadProfilePhoto = async (id, file) => {
    try {
      setLoading(true);

      if (!file || !file.get("file")) {
        throw new Error("ບໍ່ພົບໄຟລ໌ຮູບພາບ");
      }

      console.log(
        "Uploading file:",
        file.get("file").name,
        file.get("file").type,
        file.get("file").size
      );

      const response = await employeeService.uploadProfilePhoto(id, file);

      console.log("Upload response:", response.data);

      toast({
        title: "ອັບໂຫລດຮູບພາບສຳເລັດ",
        description: "ຮູບພາບຂອງພະນັກງານຖືກອັບເດດແລ້ວ",
      });

      if (selectedEmployee && selectedEmployee.id === id) {
        setSelectedEmployee({
          ...selectedEmployee,
          profile_photo: response.data.profile_photo,
        });
      }

      await fetchEmployees();
      return response.data;
    } catch (err) {
      console.error("Error uploading profile photo:", err);
      console.error("Response data:", err.response?.data);

      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫລດຮູບພາບ",
        description:
          err.response?.data?.message ||
          err.message ||
          "ບໍ່ສາມາດອັບໂຫລດຮູບພາບໄດ້",
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployeeStatus = async (id, status) => {
    try {
      setLoading(true);

      const response = await employeeService.updateEmployeeStatus(id, status);

      const statusLabels = {
        active: "ເຮັດວຽກຢູ່",
        leave: "ລາພັກ",
        inactive: "ພັກວຽກ",
      };

      toast({
        title: "ອັບເດດສະຖານະສຳເລັດ",
        description: `ສະຖານະພະນັກງານຖືກປ່ຽນເປັນ ${
          statusLabels[status] || status
        }`,
      });

      if (selectedEmployee && selectedEmployee.id === id) {
        setSelectedEmployee({
          ...selectedEmployee,
          status: status,
        });
      }

      await fetchEmployees();
      return response.data;
    } catch (err) {
      console.error("Error updating employee status:", err);

      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະ",
        description: err.message || "ບໍ່ສາມາດອັບເດດສະຖານະພະນັກງານໄດ້",
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addEmployeeDocument = async (employeeId, documentData) => {
    try {
      setLoading(true);

      if (documentData.file) {
        const formData = new FormData();
        formData.append("file", documentData.file);
        formData.append("documentType", documentData.document_type);
        formData.append("employeeId", employeeId);

        const response = await documentService.uploadDocument(formData);

        toast({
          title: "ເພີ່ມເອກະສານສຳເລັດ",
          description: `ເອກະສານ ${documentData.document_type} ຖືກເພີ່ມໃຫ້ພະນັກງານແລ້ວ`,
        });

        if (selectedEmployee && selectedEmployee.id === employeeId) {
          await fetchEmployeeById(employeeId);
        }

        return response.data;
      } else {
        const docData = {
          ...documentData,
          employee_id: employeeId,
        };

        const response = await documentService.createDocument(docData);

        toast({
          title: "ເພີ່ມເອກະສານສຳເລັດ",
          description: `ເອກະສານ ${documentData.document_type} ຖືກເພີ່ມໃຫ້ພະນັກງານແລ້ວ`,
        });

        if (selectedEmployee && selectedEmployee.id === employeeId) {
          await fetchEmployeeById(employeeId);
        }

        return response.data;
      }
    } catch (err) {
      console.error("Error adding document to employee:", err);

      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມເອກະສານ",
        description: err.message || "ບໍ່ສາມາດເພີ່ມເອກະສານໃຫ້ພະນັກງານໄດ້",
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeEmployeeDocument = async (employeeId, documentId) => {
    try {
      setLoading(true);

      await documentService.deleteDocument(documentId);

      toast({
        title: "ລຶບເອກະສານສຳເລັດ",
        description: "ເອກະສານຖືກລຶບອອກຈາກລະບົບແລ້ວ",
      });

      if (selectedEmployee && selectedEmployee.id === employeeId) {
        await fetchEmployeeById(employeeId);
      }
    } catch (err) {
      console.error("Error removing document from employee:", err);

      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດໃນການລຶບເອກະສານ",
        description: err.message || "ບໍ່ສາມາດລຶບເອກະສານໄດ້",
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchMetadata();
  }, [fetchEmployees, fetchMetadata]);

  return {
    employees,
    selectedEmployee,
    loading,
    error,
    filters,
    stats,
    positions,
    statusOptions,

    setFilters,
    setSelectedEmployee,

    fetchEmployees,
    fetchEmployeeById,
    fetchEmployeeByEmployeeId,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    uploadProfilePhoto,
    updateEmployeeStatus,
    addEmployeeDocument,
    removeEmployeeDocument,

    refreshEmployees: fetchEmployees,
  };
};

export default useEmployees;
