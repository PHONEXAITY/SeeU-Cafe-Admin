'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FaSave, FaTimes, FaImage } from 'react-icons/fa';

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    position: '',
    salary: '',
    startDate: '',
    schedule: '',
    bankName: '',
    bankAccount: '',
    photo: null,
    documents: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ເພີ່ມພະນັກງານໃໝ່</h1>
          <p className="text-gray-500">ປ້ອນຂໍ້ມູນພະນັກງານໃໝ່</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" href="/employees/list">
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
            <CardTitle>ຂໍ້ມູນສ່ວນຕົວ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">ຊື່</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="ປ້ອນຊື່..."
                />
              </div>
              <div>
                <Label htmlFor="lastName">ນາມສະກຸນ</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="ປ້ອນນາມສະກຸນ..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">ເພດ</Label>
                <Select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">ເລືອກເພດ...</option>
                  <option value="male">ຊາຍ</option>
                  <option value="female">ຍິງ</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="birthDate">ວັນເດືອນປີເກີດ</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">ເບີໂທລະສັບ</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="020 XXXXXXXX"
              />
            </div>

            <div>
              <Label htmlFor="email">ອີເມວ</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <Label htmlFor="address">ທີ່ຢູ່</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="ປ້ອນທີ່ຢູ່..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ຂໍ້ມູນການເຮັດວຽກ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="position">ຕຳແໜ່ງ</Label>
              <Select
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              >
                <option value="">ເລືອກຕຳແໜ່ງ...</option>
                <option value="barista">ບາລິສຕ້າ</option>
                <option value="waiter">ພະນັກງານເສີບ</option>
                <option value="kitchen">ພະນັກງານຄົວ</option>
                <option value="cashier">ພະນັກງານຄິດເງິນ</option>
              </Select>
            </div>

{/*             <div>
              <Label htmlFor="department">ພະແນກ</Label>
              <Select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">ເລືອກພະແນກ...</option>
                <option value="service">ບໍລິການ</option>
                <option value="production">ຜະລິດ</option>
                <option value="kitchen">ຄົວ</option>
              </Select>
            </div> */}

            <div>
              <Label htmlFor="schedule">ກະເຮັດວຽກ</Label>
              <Select
                id="schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              >
                <option value="">ເລືອກກະເຮັດວຽກ...</option>
                <option value="morning">ກະເຊົ້າ (06:00-14:00)</option>
                <option value="afternoon">ກະບ່າຍ (14:00-22:00)</option>
                <option value="night">ກະກາງຄືນ (22:00-06:00)</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">ວັນທີເລີ່ມວຽກ</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="salary">ເງິນເດືອນ</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">ທະນາຄານ</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="ຊື່ທະນາຄານ..."
                />
              </div>
              <div>
                <Label htmlFor="bankAccount">ເລກບັນຊີ</Label>
                <Input
                  id="bankAccount"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="ເລກບັນຊີທະນາຄານ..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>ຮູບຖ່າຍ ແລະ ເອກະສານ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ຮູບຖ່າຍ</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {formData.photo ? (
                      <img 
                        src={formData.photo}
                        alt="Employee photo"
                        className="max-h-48 mx-auto"
                      />
                    ) : (
                      <div className="py-4">
                        <FaImage className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          ຄລິກເພື່ອອັບໂຫລດຮູບຖ່າຍ
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => document.getElementById('photo-upload').click()}
                    >
                      ເລືອກຮູບ
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <Label>ເອກະສານ</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <FaImage className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      ຄລິກເພື່ອອັບໂຫລດເອກະສານ
                    </p>
                    <p className="text-xs text-gray-500">
                      ສຳເນົາບັດປະຊາຊົນ, ໃບຢັ້ງຢືນ, ອື່ນໆ
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                    >
                      ອັບໂຫລດເອກະສານ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEmployee;