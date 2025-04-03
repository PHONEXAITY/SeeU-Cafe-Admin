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

  
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const response = await userService.getUserRoles();
        
        // Handle different response formats
        let roleData = [];
        if (response.data && Array.isArray(response.data)) {
          roleData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          roleData = response.data.data;
        } else {
          console.warn('Unknown role data format:', response.data);
          roleData = [
            { id: 'admin', name: 'ຜູ້ດູແລລະບົບ' },
            { id: 'manager', name: 'ຜູ້ຈັດການ' },
            { id: 'staff', name: 'ພະນັກງານ' },
            { id: 'customer', name: 'ລູກຄ້າ' }
          ];
        }
        
        setRoles(roleData);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        toast.error('ບໍ່ສາມາດໂຫລດຂໍ້ມູນຕຳແໜ່ງໄດ້');
        
        // Set default roles in case of error
        setRoles([
          { id: 'admin', name: 'ຜູ້ດູແລລະບົບ' },
          { id: 'manager', name: 'ຜູ້ຈັດການ' },
          { id: 'staff', name: 'ພະນັກງານ' },
          { id: 'customer', name: 'ລູກຄ້າ' }
        ]);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  
  const validateForm = () => {
    const newErrors = {};
    
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'ກະລຸນາປ້ອນຊື່';
    }
    
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'ກະລຸນາປ້ອນນາມສະກຸນ';
    }
    
    
    if (!formData.email.trim()) {
      newErrors.email = 'ກະລຸນາປ້ອນອີເມວ';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ';
    }
    
    
    if (!formData.password) {
      newErrors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານ';
    } else if (formData.password.length < 6) {
      newErrors.password = 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ';
    }
    
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'ລະຫັດຜ່ານບໍ່ກົງກັນ';
    }
    
    
    if (!formData.role) {
      newErrors.role = 'ກະລຸນາເລືອກຕຳແໜ່ງ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare user data for API call
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        address: formData.address || null
      };
      
      console.log('ກຳລັງສ້າງຜູ້ໃຊ້ໃໝ່ດ້ວຍຂໍ້ມູນ:', userData);
      
      // Create user via API
      const response = await userService.createUser(userData);
      console.log('ສ້າງຜູ້ໃຊ້ໃໝ່ສຳເລັດ, API response:', response);
      
      // Extract user ID from response - handle different response formats
      let userId;
      if (response.data && response.data.id) {
        userId = response.data.id;
      } else if (response.data && response.data.data && response.data.data.id) {
        userId = response.data.data.id;
      } else {
        console.warn('User ID not found in response:', response.data);
        toast.success('ສ້າງຜູ້ໃຊ້ໃໝ່ສຳເລັດແລ້ວ ແຕ່ອາດມີຂໍ້ຜິດພາດໃນການກຳນົດຕຳແໜ່ງ');
        router.push('/users/list');
        return;
      }
      
      // If role is selected, assign it to the user
      if (formData.role) {
        try {
          console.log('ກຳລັງກຳນົດຕຳແໜ່ງຜູ້ໃຊ້:', userId, formData.role);
          
          // Set user role via API
          await userService.changeUserRole(userId, formData.role);
          console.log('ກຳນົດຕຳແໜ່ງສຳເລັດແລ້ວ');
          
          toast.success('ສ້າງຜູ້ໃຊ້ ແລະ ກຳນົດຕຳແໜ່ງສຳເລັດແລ້ວ');
        } catch (roleError) {
          console.error('ບໍ່ສາມາດກຳນົດຕຳແໜ່ງ:', roleError);
          toast.warning('ສ້າງຜູ້ໃຊ້ໃໝ່ສຳເລັດແລ້ວ ແຕ່ບໍ່ສາມາດກຳນົດຕຳແໜ່ງໄດ້');
        }
      } else {
        toast.success('ສ້າງຜູ້ໃຊ້ໃໝ່ສຳເລັດແລ້ວ');
      }
      
      // Navigate back to user list
      router.push('/users/list');
    } catch (error) {
      console.error('ເກີດຂໍ້ຜິດພາດໃນການສ້າງຜູ້ໃຊ້ໃໝ່:', error);
      
      // Handle different error response formats
      if (error.response?.data?.errors) {
        // Error response contains field-specific errors
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
        // NestJS validation error format
        const validationErrors = {};
        error.response.data.message.forEach(err => {
          // Extract field name from error message if possible
          const field = Object.keys(err.constraints)[0];
          validationErrors[field] = Object.values(err.constraints)[0];
        });
        setErrors(validationErrors);
        toast.error('ກະລຸນາແກ້ໄຂຂໍ້ມູນທີ່ບໍ່ຖືກຕ້ອງ');
      } else {
        // General error message
        toast.error(error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງຜູ້ໃຊ້ໃໝ່');
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