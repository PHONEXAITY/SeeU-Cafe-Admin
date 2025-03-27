'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FaSave } from 'react-icons/fa';

const SlideshowSettings = () => {
  const [settings, setSettings] = React.useState({
    autoplay: true,
    interval: 5000,
    transition: 'fade',
    transitionDuration: 500,
    showArrows: true,
    showDots: true,
    pauseOnHover: true,
    height: 600,
    responsive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ການຕັ້ງຄ່າ Slideshow</h1>
          <p className="text-gray-500">ປັບແຕ່ງການສະແດງຜົນ slideshow</p>
        </div>
        <Button onClick={handleSubmit}>
          <FaSave className="w-4 h-4 mr-2" />
          ບັນທຶກການຕັ້ງຄ່າ
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ການສະແດງຜົນ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="height">ຄວາມສູງ</Label>
              <Input
                id="height"
                type="number"
                value={settings.height}
                onChange={(e) => setSettings({ ...settings, height: parseInt(e.target.value) })}
              />
              <p className="text-sm text-gray-500 mt-1">ຄວາມສູງໃນຫົວໜ່ວຍ pixel</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>ແບບ Responsive</Label>
                <p className="text-sm text-gray-500">ປັບຂະໜາດຕາມໜ້າຈໍອັດຕະໂນມັດ</p>
              </div>
              <Switch
                checked={settings.responsive}
                onCheckedChange={(checked) => setSettings({ ...settings, responsive: checked })}
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="transition">ລູກຫຼິ້ນການປ່ຽນ Slide</Label>
              <Select
                id="transition"
                value={settings.transition}
                onChange={(e) => setSettings({ ...settings, transition: e.target.value })}
              >
                <option value="fade">ຈາງ (Fade)</option>
                <option value="slide">ເລື່ອນ (Slide)</option>
                <option value="zoom">ຂະຫຍາຍ (Zoom)</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="transitionDuration">ໄລຍະເວລາການປ່ຽນ (ms)</Label>
              <Input
                id="transitionDuration"
                type="number"
                value={settings.transitionDuration}
                onChange={(e) => setSettings({ ...settings, transitionDuration: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ການຄວບຄຸມ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>ສະຫຼັບອັດຕະໂນມັດ</Label>
                <p className="text-sm text-gray-500">ປ່ຽນ slides ອັດຕະໂນມັດ</p>
              </div>
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(checked) => setSettings({ ...settings, autoplay: checked })}
              />
            </div>

            {settings.autoplay && (
              <div>
                <Label htmlFor="interval">ໄລຍະເວລາສະຫຼັບ (ms)</Label>
                <Input
                  id="interval"
                  type="number"
                  value={settings.interval}
                  onChange={(e) => setSettings({ ...settings, interval: parseInt(e.target.value) })}
                />
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>ສະແດງລູກສອນ</Label>
                <p className="text-sm text-gray-500">ປຸ່ມນຳທາງຊ້າຍ-ຂວາ</p>
              </div>
              <Switch
                checked={settings.showArrows}
                onCheckedChange={(checked) => setSettings({ ...settings, showArrows: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>ສະແດງຈຸດນຳທາງ</Label>
                <p className="text-sm text-gray-500">ຈຸດນຳທາງດ້ານລຸ່ມ</p>
              </div>
              <Switch
                checked={settings.showDots}
                onCheckedChange={(checked) => setSettings({ ...settings, showDots: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>ຢຸດເມື່ອເລື່ອນເມົ້າໃສ່</Label>
                <p className="text-sm text-gray-500">ຢຸດການສະຫຼັບອັດຕະໂນມັດເມື່ອເລື່ອນເມົ້າໃສ່</p>
              </div>
              <Switch
                checked={settings.pauseOnHover}
                onCheckedChange={(checked) => setSettings({ ...settings, pauseOnHover: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SlideshowSettings;