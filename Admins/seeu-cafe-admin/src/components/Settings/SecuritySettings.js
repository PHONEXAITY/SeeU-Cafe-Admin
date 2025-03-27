'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  FaSave, FaShieldAlt, FaKey, FaLock, 
  FaUserShield, FaHistory 
} from 'react-icons/fa';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    twoFactor: false,
    passwordExpiry: '90',
    minPasswordLength: '8',
    requireSpecialChars: true,
    loginAttempts: '5',
    sessionTimeout: '30',
    ipWhitelist: '',
    adminIpRestriction: false
  });

  const [loginHistory] = useState([
    {
      id: 1,
      user: "Admin",
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      status: "success",
      date: "2024-03-15 14:30"
    },
    {
      id: 2,
      user: "Staff",
      ip: "192.168.1.2",
      device: "Safari on MacOS",
      status: "failed",
      date: "2024-03-15 13:45"
    }
  ]);

  const handleSave = () => {
    console.log('Saving security settings:', settings);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ຄວາມປອດໄພຂອງລະບົບ</h1>
          <p className="text-gray-500">ຈັດການການຕັ້ງຄ່າຄວາມປອດໄພ</p>
        </div>
        <Button onClick={handleSave}>
          <FaSave className="w-4 h-4 mr-2" />
          ບັນທຶກການຕັ້ງຄ່າ
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FaKey className="w-5 h-5" />
                ການຢືນຢັນຕົວຕົນ
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>ການຢືນຢັນ 2 ຊັ້ນ (2FA)</Label>
                <p className="text-sm text-gray-500">
                  ເພີ່ມຄວາມປອດໄພດ້ວຍລະຫັດ OTP
                </p>
              </div>
              <Switch
                checked={settings.twoFactor}
                onCheckedChange={(checked) => setSettings({ ...settings, twoFactor: checked })}
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="passwordExpiry">ອາຍຸລະຫັດຜ່ານ</Label>
                <Select
                  id="passwordExpiry"
                  value={settings.passwordExpiry}
                  onChange={(e) => setSettings({ ...settings, passwordExpiry: e.target.value })}
                >
                  <option value="30">30 ວັນ</option>
                  <option value="60">60 ວັນ</option>
                  <option value="90">90 ວັນ</option>
                  <option value="180">180 ວັນ</option>
                  <option value="never">ບໍ່ໝົດອາຍຸ</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="loginAttempts">ຈຳນວນຄັ້ງເຂົ້າລະບົບສູງສຸດ</Label>
                <Select
                  id="loginAttempts"
                  value={settings.loginAttempts}
                  onChange={(e) => setSettings({ ...settings, loginAttempts: e.target.value })}
                >
                  <option value="3">3 ຄັ້ງ</option>
                  <option value="5">5 ຄັ້ງ</option>
                  <option value="10">10 ຄັ້ງ</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FaLock className="w-5 h-5" />
                ຄວາມປອດໄພລະຫັດຜ່ານ
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="minPasswordLength">ຄວາມຍາວລະຫັດຜ່ານຂັ້ນຕໍ່າ</Label>
                <Select
                  id="minPasswordLength"
                  value={settings.minPasswordLength}
                  onChange={(e) => setSettings({ ...settings, minPasswordLength: e.target.value })}
                >
                  <option value="6">6 ຕົວອັກສອນ</option>
                  <option value="8">8 ຕົວອັກສອນ</option>
                  <option value="10">10 ຕົວອັກສອນ</option>
                  <option value="12">12 ຕົວອັກສອນ</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="sessionTimeout">ໝົດເວລາເຊສຊັນ</Label>
                <Select
                  id="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                >
                  <option value="15">15 ນາທີ</option>
                  <option value="30">30 ນາທີ</option>
                  <option value="60">1 ຊົ່ວໂມງ</option>
                  <option value="120">2 ຊົ່ວໂມງ</option>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>ຕ້ອງການຕົວອັກສອນພິເສດ</Label>
                <p className="text-sm text-gray-500">
                  ຕ້ອງມີຕົວອັກສອນພິເສດຢ່າງໜ້ອຍ 1 ຕົວ
                </p>
              </div>
              <Switch
                checked={settings.requireSpecialChars}
                onCheckedChange={(checked) => setSettings({ ...settings, requireSpecialChars: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FaUserShield className="w-5 h-5" />
                ການຈຳກັດການເຂົ້າເຖິງ
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="ipWhitelist">IP Whitelist</Label>
              <Input
                id="ipWhitelist"
                value={settings.ipWhitelist}
                onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                placeholder="192.168.1.1, 192.168.1.2"
              />
              <p className="text-sm text-gray-500 mt-1">
                ໃສ່ IP ທີ່ອະນຸຍາດ, ຄັ່ນດ້ວຍເຄື່ອງໝາຍຈຸດ
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>ຈຳກັດ IP ສຳລັບຜູ້ດູແລລະບົບ</Label>
                <p className="text-sm text-gray-500">
                  ຈຳກັດການເຂົ້າເຖິງໜ້າຜູ້ດູແລລະບົບຈາກ IP ທີ່ກຳນົດເທົ່ານັ້ນ
                </p>
              </div>
              <Switch
                checked={settings.adminIpRestriction}
                onCheckedChange={(checked) => setSettings({ ...settings, adminIpRestriction: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FaHistory className="w-5 h-5" />
                ປະຫວັດການເຂົ້າສູ່ລະບົບ
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">ຜູ້ໃຊ້</th>
                      <th className="px-4 py-3 text-left">IP</th>
                      <th className="px-4 py-3 text-left">ອຸປະກອນ</th>
                      <th className="px-4 py-3 text-left">ສະຖານະ</th>
                      <th className="px-4 py-3 text-left">ວັນທີ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loginHistory.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 py-3">{log.user}</td>
                        <td className="px-4 py-3">{log.ip}</td>
                        <td className="px-4 py-3">{log.device}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            log.status === 'success' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status === 'success' ? 'ສຳເລັດ' : 'ລົ້ມເຫລວ'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{log.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;