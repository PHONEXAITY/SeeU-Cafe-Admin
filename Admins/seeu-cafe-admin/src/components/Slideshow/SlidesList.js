'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  FaSearch, FaEdit, FaTrash, FaEye, FaArrowUp, 
  FaArrowDown, FaImage, FaLink 
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const PreviewDialog = ({ isOpen, onClose, slide }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>ສະແດງຕົວຢ່າງ Slide</DialogTitle>
        </DialogHeader>
        <div className="aspect-video relative w-full overflow-hidden rounded-lg">
          <img 
            src={slide?.image || '/api/placeholder/800/400'} 
            alt={slide?.title}
            className="w-full h-full object-cover"
          />
          {slide?.title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="text-white text-xl font-bold">{slide.title}</h3>
              {slide.subtitle && (
                <p className="text-white/90 mt-1">{slide.subtitle}</p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>ປິດ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SlidesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogState, setDialogState] = useState({ isOpen: false, slide: null });
  const [statusFilter, setStatusFilter] = useState('all');

  const slides = [
    {
      id: 1,
      title: "ສະເໜີກາເຟໃໝ່",
      subtitle: "ລົດຊາດພິເສດສຳລັບລະດູຮ້ອນ",
      image: "/api/placeholder/800/400",
      status: "active",
      link: "/products/summer-coffee",
      order: 1
    },
    {
      id: 2,
      title: "ໂປຣໂມຊັ່ນປະຈຳເດືອນ",
      subtitle: "ລົດລາຄາ 20% ສຳລັບເຄື່ອງດື່ມທຸກຊະນິດ",
      image: "/api/placeholder/800/400",
      status: "scheduled",
      link: "/promotions/monthly",
      order: 2
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800"
    };

    const labels = {
      active: "ກຳລັງສະແດງ",
      scheduled: "ກຳນົດເວລາ",
      inactive: "ປິດໃຊ້ງານ"
    };

    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Slides ທັງໝົດ</h1>
          <p className="text-gray-500">ຈັດການ slides ສຳລັບໜ້າຫຼັກຂອງທ່ານ</p>
        </div>
        <Button href="/slideshow/create">
          ສ້າງ Slide ໃໝ່
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="ຄົ້ນຫາ slides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'scheduled', 'inactive'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'ທັງໝົດ' :
               status === 'active' ? 'ກຳລັງສະແດງ' :
               status === 'scheduled' ? 'ກຳນົດເວລາ' : 'ປິດໃຊ້ງານ'}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {slides.map((slide) => (
              <div key={slide.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-48">
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{slide.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{slide.subtitle}</p>
                        {slide.link && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <FaLink className="w-3 h-3" />
                            {slide.link}
                          </div>
                        )}
                      </div>
                      {getStatusBadge(slide.status)}
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDialogState({ isOpen: true, slide })}
                    >
                      <FaEye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <FaEdit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex md:flex-col gap-1">
                    <Button size="sm" variant="ghost">
                      <FaArrowUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <FaArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <PreviewDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, slide: null })}
        slide={dialogState.slide}
      />
    </div>
  );
};

export default SlidesList;