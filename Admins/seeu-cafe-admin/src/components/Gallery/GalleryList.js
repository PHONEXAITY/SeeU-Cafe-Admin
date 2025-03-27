'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { 
  FaSearch, FaEdit, FaTrash, FaDownload, FaCopy, 
  FaFolder, FaImage, FaLink 
} from 'react-icons/fa';

const ImageDetailsDialog = ({ isOpen, onClose, image }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>ລາຍລະອຽດຮູບພາບ</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img 
              src={image?.url || '/api/placeholder/400/400'} 
              alt={image?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <Label>ຊື່ໄຟລ໌</Label>
              <p className="text-sm text-gray-600">{image?.name}</p>
            </div>
            <div>
              <Label>ຂະໜາດ</Label>
              <p className="text-sm text-gray-600">{image?.size}</p>
            </div>
            <div>
              <Label>ວັນທີອັບໂຫລດ</Label>
              <p className="text-sm text-gray-600">{image?.uploadDate}</p>
            </div>
            <div>
              <Label>Album</Label>
              <p className="text-sm text-gray-600">{image?.album || 'ບໍ່ມີ'}</p>
            </div>
            <div>
              <Label>URL</Label>
              <div className="flex gap-2 mt-1">
                <Input value={image?.url} readOnly />
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(image?.url)}>
                  <FaCopy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            <FaDownload className="w-4 h-4 mr-2" />
            ດາວໂຫລດ
          </Button>
          <Button variant="outline">
            <FaEdit className="w-4 h-4 mr-2" />
            ແກ້ໄຂ
          </Button>
          <Button variant="destructive">
            <FaTrash className="w-4 h-4 mr-2" />
            ລຶບ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GalleryList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [albumFilter, setAlbumFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      name: "product-coffee-01.jpg",
      url: "/api/placeholder/400/400",
      size: "2.4 MB",
      dimension: "1920x1080",
      uploadDate: "2024-03-15",
      album: "ສິນຄ້າ"
    },
    {
      id: 2,
      name: "banner-promotion.jpg",
      url: "/api/placeholder/400/400",
      size: "1.8 MB",
      dimension: "1200x628",
      uploadDate: "2024-03-14",
      album: "ແບນເນີ"
    }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ຮູບພາບທັງໝົດ</h1>
          <p className="text-gray-500">ຈັດການຮູບພາບທັງໝົດຂອງທ່ານ</p>
        </div>
        <div className="flex gap-2">
            <a href="/gallery/upload" >
          <Button >
            ອັບໂຫລດຮູບພາບ
          </Button>
          </a>
          <a href="/gallery/albums" >
          <Button variant="outline">
            ສ້າງ Album ໃໝ່
          </Button>
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="ຄົ້ນຫາຮູບພາບ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={albumFilter}
          onChange={(e) => setAlbumFilter(e.target.value)}
          className="w-full md:w-48"
        >
          <option value="all">ທຸກ Album</option>
          <option value="products">ສິນຄ້າ</option>
          <option value="banners">ແບນເນີ</option>
          <option value="blog">ບົດຄວາມ</option>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">ພົບ {images.length} ຮູບພາບ</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="group aspect-square relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                    <p className="text-sm truncate">{image.name}</p>
                    <p className="text-xs text-gray-300">{image.dimension}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedImage && (
        <ImageDetailsDialog
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          image={selectedImage}
        />
      )}
    </div>
  );
};

export default GalleryList;