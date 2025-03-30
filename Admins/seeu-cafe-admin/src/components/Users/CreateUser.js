'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/api'; // หรือ '@/services/usersApi' หากมีการแยกไฟล์
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const CreateUser = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // โหลดข้อมูลตำแหน่งจาก API
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const response = await userService.getUserRoles();
        setRoles(response.data || []);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        toast.error('ไม่สามารถโหลดข้อมูลตำแหน่งได้');
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // การตรวจสอบข้อมูล
  const validateForm = () => {
    const newErrors = {};
    
    // ตรวจสอบชื่อผู้ใช้
    if (!formData.name.trim()) {
      newErrors.name = 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້';
    }
    
    // ตรวจสอบอีเมล
    if (!formData.email.trim()) {
      newErrors.email = 'ກະລຸນາປ້ອນອີເມວ';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ';
    }
    
    // ตรวจสอบรหัสผ่าน
    if (!formData.password) {
      newErrors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານ';
    } else if (formData.password.length < 6) {
      newErrors.password = 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ';
    }
    
    // ตรวจสอบการยืนยันรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'ລະຫັດຜ່ານບໍ່ກົງກັນ';
    }
    
    // ตรวจสอบตำแหน่ง
    if (!formData.role) {
      newErrors.role = 'ກະລຸນາເລືອກຕຳແໜ່ງ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // การส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // สร้างข้อมูลผู้ใช้ใหม่สำหรับส่งไปยัง API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      // เรียกใช้ API เพื่อสร้างผู้ใช้ใหม่
      await userService.createUser(userData);
      
      // แสดงข้อความสำเร็จ
      toast.success('ສ້າງຜູ້ໃຊ້ໃໝ່ສຳເລັດແລ້ວ');
      
      // นำทางไปยังหน้ารายการผู้ใช้
      router.push('/users/list');
    } catch (error) {
      console.error('Error creating user:', error);
      
      // จัดการข้อผิดพลาดจาก API
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('ເກີດຂໍ້ຜິດພາດໃນການສ້າງຜູ້ໃຊ້ໃໝ່');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 font-['Phetsarath_OT']">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">ສ້າງຜູ້ໃຊ້ໃໝ່</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ຊື່ຜູ້ໃຊ້
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ອີເມວ
            </label>
            <input
              type="email"
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ລະຫັດຜ່ານ
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
             ຍືນຍັນລະຫັດຜ່ານ
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ຕຳແໜ່ງ
            </label>
            <select
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              disabled={isLoadingRoles}
            >
              <option value="">ກະລຸນາເລືອກຕຳແໜ່ງ</option>
              {isLoadingRoles ? (
                <option disabled>กำลังโหลดตำแหน่ง...</option>
              ) : (
                roles.length > 0 ? (
                  roles.map(role => (
                    <option key={role.id || role.value} value={role.id || role.value}>
                      {role.name || role.label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="admin">ຜູ້ດູແລລະບົບ (Admin)</option>
                    <option value="user">ພະນັກງານທົ່ວໄປ</option>
                    <option value="editor">ຜູ້ບໍລິຫານ</option>
                  </>
                )
              )}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push('/users/list')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            ຍົກເລີກ
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 flex items-center"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                ກຳລັງສ້າງຜູ້ໃຊ້...
              </>
            ) : (
              'ສ້າງຜູ້ໃຊ້ໃໝ່'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;