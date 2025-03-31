'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const CreateUser = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // Load roles from API
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Check first name
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'ກະລຸນາປ້ອນຊື່';
    }
    
    // Check last name
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'ກະລຸນາປ້ອນນາມສະກຸນ';
    }
    
    // Check email
    if (!formData.email.trim()) {
      newErrors.email = 'ກະລຸນາປ້ອນອີເມວ';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ';
    }
    
    // Check password
    if (!formData.password) {
      newErrors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານ';
    } else if (formData.password.length < 6) {
      newErrors.password = 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ';
    }
    
    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'ລະຫັດຜ່ານບໍ່ກົງກັນ';
    }
    
    // Check role if needed
    if (!formData.role) {
      newErrors.role = 'ກະລຸນາເລືອກຕຳແໜ່ງ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create user data object based on backend DTO requirements
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        address: formData.address || null
      };
      
      // Log request for debugging
      console.log('Submitting user data:', userData);
      
      // Call API to create user
      const response = await userService.createUser(userData);
      console.log('User creation response:', response);
      
      // Show success message
      toast.success('ສ້າງຜູ້ໃຊ້ໃໝ່ສຳເລັດແລ້ວ');
      
      // Navigate to users list
      router.push('/users/list');
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
      
      // Handle API errors
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
              ຊື່
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.first_name ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ນາມສະກຸນ
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.last_name ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
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
              ເບີໂທລະສັບ
            </label>
            <input
              type="tel"
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ທີ່ຢູ່
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows="2"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
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
                    <option value="staff">ພະນັກງານທົ່ວໄປ</option>
                    <option value="customer">ລູກຄ້າ</option>
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