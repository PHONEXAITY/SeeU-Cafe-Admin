'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FaSearch, FaEdit, FaTrash, FaFolder, 
  FaFolderOpen, FaImage, FaPlus 
} from 'react-icons/fa';

const AlbumDialog = ({ isOpen, onClose, album = null }) => {
  const [formData, setFormData] = useState({
    name: album?.name || '',
    description: album?.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{album ? 'ແກ້ໄຂ Album' : 'ສ້າງ Album ໃໝ່'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">ຊື່ Album</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ໃສ່ຊື່ album..."
              />
            </div>
            <div>
              <Label htmlFor="description">ຄຳອະທິບາຍ</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="ອະທິບາຍກ່ຽວກັບ album..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              ຍົກເລີກ
            </Button>
            <Button type="submit">
              {album ? 'ບັນທຶກ' : 'ສ້າງ Album'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ຢືນຢັນການລຶບ</DialogTitle>
        </DialogHeader>
        <p className="py-4">ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ album ນີ້? ການກະທຳນີ້ບໍ່ສາມາດກັບຄືນໄດ້.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            ຍົກເລີກ
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            ລຶບ Album
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GalleryAlbums = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogState, setDialogState] = useState({ isOpen: false, album: null });
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, albumId: null });

  const albums = [
    {
      id: 1,
      name: "ສິນຄ້າ",
      description: "ຮູບພາບສິນຄ້າທັງໝົດ",
      imageCount: 156,
      thumbnail: "/api/placeholder/400/400",
      updatedAt: "2024-03-15"
    },
    {
      id: 2,
      name: "ແບນເນີ",
      description: "ແບນເນີໂຄສະນາ",
      imageCount: 24,
      thumbnail: "/api/placeholder/400/400",
      updatedAt: "2024-03-14"
    },
    {
      id: 3,
      name: "ບົດຄວາມ",
      description: "ຮູບພາບປະກອບບົດຄວາມ",
      imageCount: 89,
      thumbnail: "/api/placeholder/400/400",
      updatedAt: "2024-03-13"
    }
  ];

  const handleDelete = (albumId) => {
    console.log('Deleting album:', albumId);
    setDeleteDialogState({ isOpen: false, albumId: null });
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Albums</h1>
          <p className="text-gray-500">ຈັດການ albums ຮູບພາບຂອງທ່ານ</p>
        </div>
        <Button onClick={() => setDialogState({ isOpen: true, album: null })}>
          <FaPlus className="w-4 h-4 mr-2" />
          ສ້າງ Album ໃໝ່
        </Button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="ຄົ້ນຫາ albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <Card key={album.id} className="group">
            <CardContent className="p-0">
              <div className="aspect-video relative rounded-t-lg overflow-hidden">
                <img 
                  src={album.thumbnail} 
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" asChild>
                    <a href={`/gallery/albums/${album.id}`}>
                      <FaFolderOpen className="w-4 h-4 mr-2" />
                      ເປີດ
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => setDialogState({ isOpen: true, album })}
                  >
                    <FaEdit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="text-red-600"
                    onClick={() => setDeleteDialogState({ isOpen: true, albumId: album.id })}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{album.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{album.description}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaImage className="w-4 h-4" />
                      {album.imageCount}
                    </div>
                    <p className="mt-1">{album.updatedAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlbumDialog 
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, album: null })}
        album={dialogState.album}
      />

      <DeleteDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, albumId: null })}
        onConfirm={() => handleDelete(deleteDialogState.albumId)}
      />
    </div>
  );
};

export default GalleryAlbums;