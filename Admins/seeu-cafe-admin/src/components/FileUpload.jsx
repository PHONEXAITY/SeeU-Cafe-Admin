'use client'

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaSpinner, FaTrash, FaImage, FaFileAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { productService } from '@/services/api';
import { toast } from 'react-hot-toast';

const FileUpload = ({ 
  onFileSelect, 
  initialPreview = null, 
  allowedTypes = "image/*", 
  maxSize = 5, // in MB
  acceptMultiple = false,
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(initialPreview);
  const [uploadError, setUploadError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    // Check file type
    if (!selectedFile.type.match(allowedTypes.replace('*', ''))) {
      setUploadError(`Invalid file type. Please upload ${allowedTypes.replace('*', '')} files.`);
      return;
    }
    
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setUploadError(`File size should not exceed ${maxSize}MB.`);
      return;
    }
    
    // Clear previous errors and success state
    setUploadError(null);
    setSuccess(false);
    
    // Show preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For non-image files, clear the preview
      setPreviewUrl(null);
    }
    
    // Start upload
    setIsUploading(true);
    setUploadProgress(0);
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      // Simulate upload progress (in a real app, you would use axios's onUploadProgress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const nextProgress = prev + 10;
          if (nextProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return nextProgress;
        });
      }, 200);
      
      // Upload the file
      const { data } = await productService.uploadImage(formData);
      
      // Clear interval and set upload complete
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      setSuccess(true);
      
      // Call callback with file data
      onFileSelect(data.url, selectedFile);
      
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error.response?.data?.message || 'Failed to upload file');
      setIsUploading(false);
      setUploadProgress(0);
      
      toast.error('Failed to upload file');
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Remove file
  const handleRemoveFile = () => {
    setPreviewUrl(null);
    setSuccess(false);
    setUploadError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Call callback with null to indicate file removal
    onFileSelect(null, null);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Upload area */}
      <div 
        className={`w-full border-2 border-dashed rounded-lg p-4 text-center ${
          isUploading ? 'border-brown-300 bg-brown-50' : 
          uploadError ? 'border-red-300 bg-red-50' : 
          success ? 'border-green-300 bg-green-50' : 
          'border-gray-300 hover:border-brown-500 hover:bg-brown-50'
        } transition-colors cursor-pointer`}
        onClick={!isUploading ? handleUploadClick : undefined}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={allowedTypes}
          onChange={handleFileSelect}
          multiple={acceptMultiple}
          disabled={isUploading}
        />
        
        {/* Preview for images */}
        {previewUrl && previewUrl.startsWith('data:image') ? (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={previewUrl}
              alt="File preview"
              fill
              className="object-contain"
            />
            {!isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : previewUrl ? (
          // Preview for URLs (e.g. from server)
          <div className="relative w-full h-48 mb-4">
            <Image
              src={previewUrl}
              alt="File preview"
              fill
              className="object-contain"
            />
            {!isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          // Default upload icon
          <div className="py-6">
            {isUploading ? (
              <FaSpinner className="w-12 h-12 mx-auto text-brown-500 animate-spin" />
            ) : uploadError ? (
              <FaExclamationCircle className="w-12 h-12 mx-auto text-red-500" />
            ) : success ? (
              <FaCheckCircle className="w-12 h-12 mx-auto text-green-500" />
            ) : allowedTypes.includes('image') ? (
              <FaImage className="w-12 h-12 mx-auto text-gray-400" />
            ) : (
              <FaFileAlt className="w-12 h-12 mx-auto text-gray-400" />
            )}
          </div>
        )}
        
        {/* Upload status message */}
        <div className="mt-2">
          {isUploading ? (
            <div>
              <p className="text-sm text-brown-600 font-medium">Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-brown-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : uploadError ? (
            <p className="text-sm text-red-600">{uploadError}</p>
          ) : success ? (
            <p className="text-sm text-green-600">File uploaded successfully!</p>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-700">
                {previewUrl ? 'Click to replace file' : 'Click to upload file'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {allowedTypes.replace('*', '')} files up to {maxSize}MB
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or drag and drop files here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;