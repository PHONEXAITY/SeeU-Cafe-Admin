'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FaSave, FaTimes } from 'react-icons/fa';

const CreatePromotionPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxUses: '',
    startDate: '',
    endDate: '',
    isActive: true,
    productCategories: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ສ້າງ Promotion ໃໝ່</h1>
          <p className="text-gray-500">ສ້າງແລະຕັ້ງຄ່າ promotion ໃໝ່</p>
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
              <Label htmlFor="name">ຊື່ Promotion</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ໃສ່ຊື່ promotion..."
              />
            </div>
            <div>
              <Label htmlFor="code">ລະຫັດ Promotion</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="ເຊັ່ນ: SUMMER2024"
              />
            </div>
            <div>
              <Label htmlFor="description">ຄຳອະທິບາຍ</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="ອະທິບາຍກ່ຽວກັບ promotion..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ລາຍລະອຽດສ່ວນຫຼຸດ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="discountType">ປະເພດສ່ວນຫຼຸດ</Label>
              <Select
                id="discountType"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">ເປີເຊັນ (%)</option>
                <option value="fixed">ຈຳນວນເງິນ</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="discountValue">ມູນຄ່າສ່ວນຫຼຸດ</Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? "ເຊັ່ນ: 15" : "ເຊັ່ນ: 50000"}
              />
            </div>
            <div>
              <Label htmlFor="minPurchase">ຍອດຊື້ຂັ້ນຕ່ຳ</Label>
              <Input
                id="minPurchase"
                type="number"
                value={formData.minPurchase}
                onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                placeholder="ໃສ່ 0 ຖ້າບໍ່ມີຂັ້ນຕ່ຳ"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ຂໍ້ຈຳກັດການໃຊ້</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxUses">ຈຳນວນການໃຊ້ສູງສຸດ</Label>
              <Input
                id="maxUses"
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                placeholder="ໃສ່ 0 ສຳລັບບໍ່ຈຳກັດ"
              />
            </div>
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

        <Card>
          <CardHeader>
            <CardTitle>ເງື່ອນໄຂການນຳໃຊ້</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>ໝວດໝູ່ສິນຄ້າທີ່ໃຊ້ໄດ້</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  className={formData.productCategories.includes('coffee') ? 'bg-primary/10' : ''}
                  onClick={() => {
                    const newCategories = formData.productCategories.includes('coffee')
                      ? formData.productCategories.filter(c => c !== 'coffee')
                      : [...formData.productCategories, 'coffee'];
                    setFormData({ ...formData, productCategories: newCategories });
                  }}
                >
                  ກາເຟ
                </Button>
                <Button
                  variant="outline"
                  className={formData.productCategories.includes('tea') ? 'bg-primary/10' : ''}
                  onClick={() => {
                    const newCategories = formData.productCategories.includes('tea')
                      ? formData.productCategories.filter(c => c !== 'tea')
                      : [...formData.productCategories, 'tea'];
                    setFormData({ ...formData, productCategories: newCategories });
                  }}
                >
                  ຊາ
                </Button>
                <Button
                  variant="outline"
                  className={formData.productCategories.includes('bakery') ? 'bg-primary/10' : ''}
                  onClick={() => {
                    const newCategories = formData.productCategories.includes('bakery')
                      ? formData.productCategories.filter(c => c !== 'bakery')
                      : [...formData.productCategories, 'bakery'];
                    setFormData({ ...formData, productCategories: newCategories });
                  }}
                >
                  ເຂົ້າໜົມ
                </Button>
                <Button
                  variant="outline"
                  className={formData.productCategories.includes('equipment') ? 'bg-primary/10' : ''}
                  onClick={() => {
                    const newCategories = formData.productCategories.includes('equipment')
                      ? formData.productCategories.filter(c => c !== 'equipment')
                      : [...formData.productCategories, 'equipment'];
                    setFormData({ ...formData, productCategories: newCategories });
                  }}
                >
                  ອຸປະກອນ
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>ຂໍ້ຈຳກັດອື່ນໆ</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="newCustomers" className="rounded" />
                  <Label htmlFor="newCustomers">ສະເພາະລູກຄ້າໃໝ່</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="memberOnly" className="rounded" />
                  <Label htmlFor="memberOnly">ສະເພາະສະມາຊິກ</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="oneTimeUse" className="rounded" />
                  <Label htmlFor="oneTimeUse">ໃຊ້ໄດ້ພຽງຄັ້ງດຽວຕໍ່ລູກຄ້າ</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <FaTimes className="w-4 h-4 mr-2" />
          ຍົກເລີກ
        </Button>
        <Button onClick={handleSubmit}>
          <FaSave className="w-4 h-4 mr-2" />
          ບັນທຶກ Promotion
        </Button>
      </div>
    </div>
  );
};

export default CreatePromotionPage;