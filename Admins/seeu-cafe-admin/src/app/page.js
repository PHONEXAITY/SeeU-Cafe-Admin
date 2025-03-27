'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically validate the credentials
    // For now, we'll just redirect to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4 relative font-['Phetsarath_OT']" 
         style={{backgroundImage: "url('/cafe.jpg')"}}>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      

      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl shadow-2xl p-8 transition-all duration-300 ease-in-out hover:shadow-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{backgroundImage: "url('/coffee-beans.jpg')"}}></div>
        
        <div className="relative z-10">
          <div className="text-center">
            <Image src="/logo (2).jpg" alt="SeeU Cafe Logo" width={100} height={100} className="mx-auto rounded-full shadow-lg" />
            <h2 className="mt-6 text-3xl font-extrabold text-brown-900"> SeeU Cafe</h2>
            <p className="mt-2 text-sm text-brown-600">ເຂົ້າສູ່ລະບົບ Admin</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email-address" className="sr-only ">Email address</label>
                <FaEnvelope className="absolute top-3 left-3 text-brown-400" />
                <input 
                  id="email-address" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-brown-300 placeholder-brown-400 text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out bg-white bg-opacity-70" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <FaLock className="absolute top-3 left-3 text-brown-400" />
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-brown-300 placeholder-brown-400 text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out bg-white bg-opacity-70" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" 
                  className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-brown-300 rounded transition-all duration-300 ease-in-out" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-brown-900">
                  ຈົດຈຳຂ້ອຍ
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-coffee-600 hover:border-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee-500 transition-all duration-300 ease-in-out"
              >
                ເຂົ້າສູ່ລະບົບ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;