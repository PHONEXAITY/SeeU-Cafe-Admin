'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FaSave, FaTimes, FaImage, FaLink } from 'react-icons/fa';

const CreateSlidePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: null,
    link: '',
    status: 'active',
    startDate: '',
    endDate: '',
    buttonText: '',
    buttonLink: '',
    isActive: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ສ້າງ Slide ໃໝ່</h1>
          <p className="text-gray-500">ເພີ່ມ slide ໃໝ່ສຳລັບ slideshow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FaTimes className="w-4 h-4 mr-2" />
            ຍົກເລີກ
          </Button>
          <Button onClick={handleSubmit}>
            <FaSave className="w-4 h-4 mr-2" />
            ບັນທຶກ
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ຂໍ້ມູນພື້ນຖານ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">ຫົວຂໍ້</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ໃສ່ຫົວຂໍ້ສຳລັບ slide..."
              />
            </div>
            <div>
              <Label htmlFor="subtitle">ຫົວຂໍ້ຍ່ອຍ</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="ໃສ່ຫົວຂໍ້ຍ່ອຍ (ຖ້າມີ)..."
              />
            </div>
            <div>
              <Label>ຮູບພາບ</Label>
              <div className="mt-2">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <FaImage className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    ລາກຮູບໃສ່ນີ້ ຫຼື ກົດເພື່ອເລືອກຮູບ
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ແນະນຳຂະໜາດ: 1920x1080px
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ຕັ້ງຄ່າການສະແດງ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">ສະຖານະ</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">ກຳລັງສະແດງ</option>
                <option value="scheduled">ກຳນົດເວລາ</option>
                <option value="inactive">ປິດໃຊ້ງານ</option>
              </Select>
            </div>
            
            {formData.status === 'scheduled' && (
              <>
                <div>
                  <Label htmlFor="startDate">ວັນທີເລີ່ມຕົ້ນ</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">ວັນທີສິ້ນສຸດ</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="buttonText">ຂໍ້ຄວາມປຸ່ມ</Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="ເຊັ່ນ: ເບິ່ງເພີ່ມເຕີມ"
              />
            </div>

            <div>
            <Label htmlFor="link">ລິ້ງເຊື່ອມຕໍ່</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="link"
                    className="pl-10"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="ໃສ່ URL ທີ່ຕ້ອງການເຊື່ອມຕໍ່..."
                  />
                </div>
                <Button variant="outline">
                  ເລືອກໜ້າ
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="target">ການເປີດລິ້ງ</Label>
              <Select
                id="target"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              >
                <option value="_self">ເປີດໃນໜ້າດຽວກັນ</option>
                <option value="_blank">ເປີດໃນແທັບໃໝ່</option>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">ເປີດໃຊ້ງານທັນທີ</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>ຕົວຢ່າງ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[21/9] relative w-full overflow-hidden rounded-lg bg-gray-100">
              {formData.image ? (
                <img 
                  src={URL.createObjectURL(formData.image)}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FaImage className="w-16 h-16 text-gray-300" />
                </div>
              )}
              {(formData.title || formData.subtitle) && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  {formData.title && (
                    <h3 className="text-white text-2xl font-bold">{formData.title}</h3>
                  )}
                  {formData.subtitle && (
                    <p className="text-white/90 mt-2">{formData.subtitle}</p>
                  )}
                  {formData.buttonText && (
                    <Button className="mt-4" variant="secondary">
                      {formData.buttonText}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSlidePage;