"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useDropzone } from 'react-dropzone';
import useGalleryApi from '@/hooks/useGalleryApi';
import { 
  FaImage, FaUpload, FaTrash, FaTimes, FaArrowLeft, 
  FaFolder, FaSyncAlt, FaCheck 
} from 'react-icons/fa';

const FileUploadCard = ({ file, onRemove, progress, error }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
        {file.preview ? (
          <img 
            src={file.preview} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <FaImage className="text-gray-400 w-6 h-6" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        {progress !== undefined && (
          <div className="w-full mt-1">
            <Progress value={progress} className="h-1.5" />
            {progress === 100 && !error && (
              <span className="text-xs text-green-500 flex items-center mt-0.5">
                <FaCheck className="w-3 h-3 mr-1" /> ສຳເລັດ
              </span>
            )}
            {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
          </div>
        )}
      </div>
      {progress === undefined || error ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(file)}
          className="text-gray-500 hover:text-red-600"
        >
          <FaTimes className="w-4 h-4" />
        </Button>
      ) : progress < 100 ? (
        <div className="w-4 h-4 text-blue-500">
          <FaSyncAlt className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <div className="w-4 h-4 text-green-500">
          <FaCheck className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

const GalleryUpload = () => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { uploadImage, fetchCategories, loading, error } = useGalleryApi();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load categories:", err);
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: "ບໍ່ສາມາດໂຫລດໝວດໝູ່ໄດ້",
          variant: "destructive",
        });
        setCategories([
          { category: "ສິນຄ້າ", count: 0 },
          { category: "ແບນເນີ", count: 0 },
          { category: "ບົດຄວາມ", count: 0 },
        ]);
      }
    };
    loadCategories();
  }, [fetchCategories]);

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => file.size <= 10 * 1024 * 1024);
    const oversizedFiles = acceptedFiles.filter(file => file.size > 10 * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: `${oversizedFiles.length} ໄຟລ໌ມີຂະໜາດໃຫຍ່ເກີນ 10MB`,
        variant: "destructive",
      });
    }
    
    setFiles(prev => [
      ...prev,
      ...validFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name];
      return newProgress;
    });
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fileToRemove.name];
      return newErrors;
    });
    
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "ແຈ້ງເຕືອນ",
        description: "ກະລຸນາເລືອກຮູບພາບຢ່າງໜ້ອຍ 1 ຮູບ",
        variant: "warning",
      });
      return;
    }

    setIsUploading(true);
    let uploadedCount = 0;
    let errorCount = 0;

    for (const file of files) {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      setUploadErrors(prev => ({ ...prev, [file.name]: null }));

      const formData = new FormData();
      formData.append('file', file); // Ensure 'file', not 'image'
      if (title) formData.append('title', title);
      if (category && category !== 'all') formData.append('category', category);

      let progressInterval = null;
      try {
        let progress = 0;
        progressInterval = setInterval(() => {
          progress += 10;
          if (progress <= 90) {
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          }
        }, 300);

        await uploadImage(formData);
        uploadedCount++;

        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        errorCount++;
        if (progressInterval) clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        setUploadErrors(prev => ({
          ...prev,
          [file.name]: error.response?.data?.message?.join(', ') || "ການອັບໂຫລດຮູບພາບລົ້ມເຫລວ",
        }));
      }
    }

    setIsUploading(false);
    
    if (errorCount === 0 && uploadedCount > 0) {
      toast({
        title: "ສຳເລັດ",
        description: `ອັບໂຫລດຮູບພາບສຳເລັດ ${uploadedCount} ໄຟລ໌`,
        variant: "success",
      });
      
      setTimeout(() => {
        files.forEach(file => {
          if (file.preview) URL.revokeObjectURL(file.preview);
        });
        setFiles([]);
        setTitle("");
        setCategory("");
        router.push('/gallery/all');
      }, 2000);
    } else if (errorCount > 0) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: `ບໍ່ສາມາດອັບໂຫລດໄດ້ ${errorCount} ໄຟລ໌. ກະລຸນາກວດສອບຂໍ້ຜິດພາດແລະລອງໃໝ່`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ອັບໂຫລດຮູບພາບ</h1>
          <p className="text-gray-500">ອັບໂຫລດຮູບພາບໃໝ່ເຂົ້າຄັງຮູບພາບ</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => router.push('/gallery/all')}
          className="border-2"
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          ກັບໄປຫາຄັງຮູບພາບ
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b">
            <CardTitle className="flex items-center gap-2">
              <FaImage className="text-blue-500" /> ເລືອກຮູບພາບ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${isDragActive ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <FaImage className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-lg font-medium">
                ລາກຮູບໃສ່ນີ້ ຫຼື ກົດເພື່ອເລືອກຮູບ
              </p>
              <p className="mt-1 text-sm text-gray-500">
                ຮອງຮັບ JPG, PNG, GIF, WebP (ສູງສຸດ 10MB ຕໍ່ໄຟລ໌)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category">ໝວດໝູ່</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1.5 rounded-md border-2">
                    <SelectValue placeholder="ເລືອກໝວດໝູ່" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ບໍ່ມີໝວດໝູ່</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category} value={cat.category}>
                        {cat.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="title">ຊື່ຮູບພາບ (ທາງເລືອກ)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ກະລຸນາໃສ່ຊື່ຮູບພາບ"
                  className="mt-1.5 border-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-7">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FaFolder className="text-blue-500" /> ຮູບພາບທີ່ເລືອກ ({files.length})
            </CardTitle>
            {files.length > 0 && !isUploading && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  files.forEach(file => URL.revokeObjectURL(file.preview));
                  setFiles([]);
                  setUploadProgress({});
                  setUploadErrors({});
                }}
              >
                <FaTrash className="w-3 h-3 mr-1" /> ລຶບທັງໝົດ
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-4">
            {files.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto p-2">
                {files.map((file) => (
                  <FileUploadCard
                    key={file.name}
                    file={file}
                    onRemove={removeFile}
                    progress={uploadProgress[file.name]}
                    error={uploadErrors[file.name]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <FaImage className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">ຍັງບໍ່ໄດ້ເລືອກຮູບພາບ</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                  ເລືອກຮູບພາບທີ່ທ່ານຕ້ອງການອັບໂຫລດໂດຍໃຊ້ເຄື່ອງມືທາງດ້ານຊ້າຍ
                </p>
              </div>
            )}
          </CardContent>
          {files.length > 0 && (
            <CardFooter className="flex justify-end border-t p-4">
              <Button 
                onClick={handleUpload} 
                disabled={isUploading} 
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-md"
              >
                {isUploading ? (
                  <>
                    <FaSyncAlt className="w-4 h-4 mr-2 animate-spin" />
                    ກຳລັງອັບໂຫລດ...
                  </>
                ) : (
                  <>
                    <FaUpload className="w-4 h-4 mr-2" />
                    ເລີ່ມອັບໂຫລດ
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GalleryUpload;