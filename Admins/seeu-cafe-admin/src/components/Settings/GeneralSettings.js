'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FaSave, FaImage, FaLanguage, FaClock } from 'react-icons/fa';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'ຮ້ານກາເຟ',
    description: 'ຮ້ານກາເຟຂອງພວກເຮົາ',
    logo: null,
    favicon: null,
    language: 'lo',
    timezone: 'Asia/Vientiane',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    currency: 'LAK',
    maintenance: false,
    emailNotifications: true,
    analytics: true
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
  };

  const handleImageUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setSettings({ ...settings, [type]: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ການຕັ້ງຄ່າ ທົ່ວໄປ</h1>
          <p className="text-gray-500">ຈັດການການຕັ້ງຄ່າພື້ນຖານຂອງລະບົບ</p>
        </div>
        <Button onClick={handleSave}>
          <FaSave className="w-4 h-4 mr-2" />
          ບັນທຶກການຕັ້ງຄ່າ
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ຂໍ້ມູນເວັບໄຊ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="siteName">ຊື່ເວັບໄຊ</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">ຄຳອະທິບາຍ</Label>
                <Input
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>ໂລໂກ້</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {settings.logo ? (
                      <img 
                        src={settings.logo} 
                        alt="Logo" 
                        className="max-h-32 mx-auto"
                      />
                    ) : (
                      <div className="py-4">
                        <FaImage className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          ຄລິກເພື່ອອັບໂຫລດໂລໂກ້
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('logo', e)}
                      className="hidden"
                      id="logo-upload"
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => document.getElementById('logo-upload').click()}
                    >
                      ເລືອກຮູບ
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Favicon</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {settings.favicon ? (
                      <img 
                        src={settings.favicon} 
                        alt="Favicon" 
                        className="max-h-32 mx-auto"
                      />
                    ) : (
                      <div className="py-4">
                        <FaImage className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          ຄລິກເພື່ອອັບໂຫລດ favicon
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('favicon', e)}
                      className="hidden"
                      id="favicon-upload"
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => document.getElementById('favicon-upload').click()}
                    >
                      ເລືອກຮູບ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ພາສາ ແລະ ເວລາ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="language">ພາສາ</Label>
                <Select
                  id="language"
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                >
                  <option value="lo">ລາວ</option>
                  <option value="en">English</option>
                  <option value="th">ไทย</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">ເຂດເວລາ</Label>
                <Select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                >
                  <option value="Asia/Vientiane">ນະຄອນຫຼວງວຽງຈັນ (UTC+7)</option>
                  <option value="Asia/Bangkok">ກຸງເທບ (UTC+7)</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFormat">ຮູບແບບວັນທີ</Label>
                <Select
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeFormat">ຮູບແບບເວລາ</Label>
                <Select
                  id="timeFormat"
                  value={settings.timeFormat}
                  onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                >
                  <option value="24">24 ຊົ່ວໂມງ</option>
                  <option value="12">12 ຊົ່ວໂມງ</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ການຕັ້ງຄ່າອື່ນໆ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>ໂໝດບຳລຸງຮັກສາ</Label>
                  <p className="text-sm text-gray-500">ປິດການໃຊ້ງານເວັບໄຊຊົ່ວຄາວ</p>
                </div>
                <Switch
                  checked={settings.maintenance}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenance: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>ແຈ້ງເຕືອນທາງອີເມວ</Label>
                  <p className="text-sm text-gray-500">ຮັບການແຈ້ງເຕືອນທາງອີເມວ</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Google Analytics</Label>
                  <p className="text-sm text-gray-500">ເປີດໃຊ້ງານການວິເຄາະຂໍ້ມູນ</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => setSettings({ ...settings, analytics: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralSettings;