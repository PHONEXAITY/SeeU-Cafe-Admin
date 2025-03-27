'use client'
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useDropzone } from 'react-dropzone';
import { FaImage, FaUpload, FaTimes } from 'react-icons/fa';

const FileUploadCard = ({ file, onRemove, progress }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
        {file.preview ? (
          <img 
            src={file.preview} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <FaImage className="text-gray-400 w-6 h-6" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(file)}
        className="text-gray-500 hover:text-red-600"
      >
        <FaTimes className="w-4 h-4" />
      </Button>
    </div>
  );
};

const GalleryUpload = () => {
  const [files, setFiles] = useState([]);
  const [albumSelection, setAlbumSelection] = useState('none');
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prev => [
      ...prev,
      ...acceptedFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  const removeFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const handleUpload = () => {
    // Simulate upload progress
    files.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 500);
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ອັບໂຫລດຮູບພາບ</h1>
          <p className="text-gray-500">ອັບໂຫລດຮູບພາບໃໝ່ເຂົ້າຄັງຮູບພາບ</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ເລືອກຮູບພາບ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
            >
              <input {...getInputProps()} />
              <FaImage className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                ລາກຮູບໃສ່ນີ້ ຫຼື ກົດເພື່ອເລືອກຮູບ
              </p>
              <p className="mt-1 text-xs text-gray-500">
                ຮອງຮັບ JPG, PNG, GIF (ສູງສຸດ 10MB ຕໍ່ໄຟລ໌)
              </p>
            </div>

            <Select
              value={albumSelection}
              onChange={(e) => setAlbumSelection(e.target.value)}
            >
              <option value="none">ບໍ່ມີ Album</option>
              <option value="products">ສິນຄ້າ</option>
              <option value="banners">ແບນເນີ</option>
              <option value="blog">ບົດຄວາມ</option>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ຮູບພາບທີ່ເລືອກ ({files.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.length > 0 ? (
              <>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {files.map((file) => (
                    <FileUploadCard
                      key={file.name}
                      file={file}
                      onRemove={removeFile}
                      progress={uploadProgress[file.name]}
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      files.forEach(file => URL.revokeObjectURL(file.preview));
                      setFiles([]);
                      setUploadProgress({});
                    }}
                  >
                    ລຶບທັງໝົດ
                  </Button>
                  <Button onClick={handleUpload}>
                    <FaUpload className="w-4 h-4 mr-2" />
                    ເລີ່ມອັບໂຫລດ
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>ຍັງບໍ່ໄດ້ເລືອກຮູບພາບ</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GalleryUpload;