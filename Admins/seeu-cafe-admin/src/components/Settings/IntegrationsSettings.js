'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from '../ui/select';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  FaSave, FaDatabase, FaCloud, FaRobot, 
  FaDownload, FaUpload 
} from 'react-icons/fa';

const IntegrationsSettings = () => {
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '00:00',
    keepBackups: '30',
    notifyOnFailure: true
  });

  const [systemStatus, setSystemStatus] = useState({
    lastBackup: '2024-03-15 02:00',
    databaseSize: '245.8 MB',
    uploadSize: '1.2 GB',
    systemHealth: 'good'
  });

  const handleSave = () => {
    console.log('Saving backup settings:', backupSettings);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ການຮັກສາລະບົບ</h1>
          <p className="text-gray-500">ຈັດການການສຳຮອງຂໍ້ມູນ ແລະ ການບຳລຸງຮັກສາລະບົບ</p>
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
                <FaDatabase className="w-5 h-5" />
                ສະຖານະລະບົບ
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">ການສຳຮອງຂໍ້ມູນລ່າສຸດ</p>
                <p className="mt-1 font-medium">{systemStatus.lastBackup}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">ຂະໜາດຖານຂໍ້ມູນ</p>
                <p className="mt-1 font-medium">{systemStatus.databaseSize}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">ຂະໜາດອັບໂຫລດ</p>
                <p className="mt-1 font-medium">{systemStatus.uploadSize}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">ສຸຂະພາບລະບົບ</p>
                <p className="mt-1 font-medium capitalize">{systemStatus.systemHealth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FaCloud className="w-5 h-5" />
                ການສຳຮອງຂໍ້ມູນອັດຕະໂນມັດ
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>ການສຳຮອງຂໍ້ມູນອັດຕະໂນມັດ</Label>
                <p className="text-sm text-gray-500">
                  ສຳຮອງຂໍ້ມູນຕາມເວລາທີ່ກຳນົດ
                </p>
              </div>
              <Switch
                checked={backupSettings.autoBackup}
                onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, autoBackup: checked })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="backupFrequency">ຄວາມຖີ່ການສຳຮອງຂໍ້ມູນ</Label>
                <Select
                  id="backupFrequency"
                  value={backupSettings.backupFrequency}
                  onChange={(e) => setBackupSettings({ ...backupSettings, backupFrequency: e.target.value })}
                >
                  <option value="daily">ທຸກວັນ</option>
                  <option value="weekly">ທຸກອາທິດ</option>
                  <option value="monthly">ທຸກເດືອນ</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="keepBackups">ຈຳນວນສຳຮອງທີ່ເກັບໄວ້</Label>
                <Select
                  id="keepBackups"
                  value={backupSettings.keepBackups}
                  onChange={(e) => setBackupSettings({ ...backupSettings, keepBackups: e.target.value })}
                >
                  <option value="7">7 ວັນ</option>
                  <option value="30">30 ວັນ</option>
                  <option value="90">90 ວັນ</option>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
              <Label>ແຈ້ງເຕືອນເມື່ອລົ້ມເຫລວ</Label>
                <p className="text-sm text-gray-500">
                  ສົ່ງການແຈ້ງເຕືອນເມື່ອການສຳຮອງຂໍ້ມູນລົ້ມເຫລວ
                </p>
              </div>
              <Switch
                checked={backupSettings.notifyOnFailure}
                onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, notifyOnFailure: checked })}
              />
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline">
                <FaDownload className="w-4 h-4 mr-2" />
                ດາວໂຫລດການສຳຮອງ
              </Button>
              <Button variant="outline">
                <FaUpload className="w-4 h-4 mr-2" />
                ນຳເຂົ້າການສຳຮອງ
              </Button>
              <Button variant="outline">
                <FaRobot className="w-4 h-4 mr-2" />
                ສຳຮອງຕອນນີ້
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FaRobot className="w-5 h-5" />
                ການບຳລຸງຮັກສາລະບົບ
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Button variant="outline" className="w-full justify-start" onClick={() => console.log('Clear cache')}>
                  <div className="text-left">
                    <p className="font-medium">ລ້າງແຄຊ</p>
                    <p className="text-sm text-gray-500">ລ້າງແຄຊລະບົບເພື່ອປັບປຸງປະສິດທິພາບ</p>
                  </div>
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full justify-start" onClick={() => console.log('Clear logs')}>
                  <div className="text-left">
                    <p className="font-medium">ລ້າງບັນທຶກລະບົບ</p>
                    <p className="text-sm text-gray-500">ລຶບບັນທຶກລະບົບເກົ່າ</p>
                  </div>
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full justify-start" onClick={() => console.log('Optimize database')}>
                  <div className="text-left">
                    <p className="font-medium">ປັບປຸງຖານຂໍ້ມູນ</p>
                    <p className="text-sm text-gray-500">ປັບປຸງປະສິດທິພາບຖານຂໍ້ມູນ</p>
                  </div>
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full justify-start" onClick={() => console.log('Clean uploads')}>
                  <div className="text-left">
                    <p className="font-medium">ລ້າງໄຟລ໌ທີ່ບໍ່ໄດ້ໃຊ້</p>
                    <p className="text-sm text-gray-500">ລຶບໄຟລ໌ອັບໂຫລດທີ່ບໍ່ໄດ້ໃຊ້ງານ</p>
                  </div>
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">ບັນທຶກການບຳລຸງຮັກສາລ່າສຸດ</h3>
              <div className="rounded-lg border divide-y">
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">ລ້າງແຄຊລະບົບ</p>
                      <p className="text-sm text-gray-500">ລ້າງແຄຊສຳເລັດ, ພື້ນທີ່ວ່າງ 24.5 MB</p>
                    </div>
                    <p className="text-sm text-gray-500">15/03/2024 14:30</p>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">ປັບປຸງຖານຂໍ້ມູນ</p>
                      <p className="text-sm text-gray-500">ປັບປຸງຖານຂໍ້ມູນສຳເລັດ</p>
                    </div>
                    <p className="text-sm text-gray-500">15/03/2024 02:00</p>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">ສຳຮອງຂໍ້ມູນອັດຕະໂນມັດ</p>
                      <p className="text-sm text-gray-500">ສຳຮອງຂໍ້ມູນປະຈຳວັນສຳເລັດ</p>
                    </div>
                    <p className="text-sm text-gray-500">15/03/2024 00:00</p>
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

export default IntegrationsSettings;