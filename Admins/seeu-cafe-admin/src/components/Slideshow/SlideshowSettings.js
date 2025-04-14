"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Save,
  RotateCcw,
  Settings2,
  Monitor,
  Sliders,
  ArrowLeftRight,
  Timer,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  Loader2,
} from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { slideshowService } from "@/services/api";
import { useSlideshowSettings } from "@/hooks/useSlideshowSettings";

const SlideshowSettings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("display");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const [settings, setSettings] = useState({
    autoplay: true,
    interval: 5000,
    transition: "fade",
    transitionDuration: 500,
    showArrows: true,
    showDots: true,
    pauseOnHover: true,
    height: 600,
    responsive: true,
    maxSlides: 5,
    enableOverlay: true,
    overlayColor: "rgba(0, 0, 0, 0.3)",
    animateText: true,
    textPosition: "bottom",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await slideshowService.getSettings();

        if (response && response.data) {
          setSettings(response.data);
        }

        setInitialLoad(false);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          variant: "destructive",
          title: "ຜິດພາດ",
          description: "ບໍ່ສາມາດໂຫຼດການຕັ້ງຄ່າ Slideshow ໄດ້",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  useEffect(() => {
    if (!initialLoad) {
      setFormChanged(true);
    }
  }, [settings, initialLoad]);

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (field, value) => {
    const numValue = value === "" ? "" : parseInt(value, 10);
    setSettings((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (settings.interval < 500) {
        toast({
          variant: "destructive",
          title: "ຂໍ້ຜິດພາດ",
          description: "ໄລຍະເວລາສະຫຼັບຕ້ອງຫຼາຍກວ່າ 500 ms",
        });
        return;
      }

      const response = await slideshowService.updateSettings(settings);

      if (response && response.data) {
        toast({
          title: "ສຳເລັດ",
          description: "ບັນທຶກການຕັ້ງຄ່າສຳເລັດແລ້ວ",
        });
        setFormChanged(false);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description:
          error.response?.data?.message || "ບໍ່ສາມາດບັນທຶກການຕັ້ງຄ່າໄດ້",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const response = await slideshowService.resetSettings();

      if (response && response.data) {
        setSettings(response.data);
        toast({
          title: "ສຳເລັດ",
          description: "ຣີເຊັດການຕັ້ງຄ່າກັບສູ່ຄ່າເລີ່ມຕົ້ນແລ້ວ",
        });
        setFormChanged(false);
      }
    } catch (error) {
      console.error("Error resetting settings:", error);
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description:
          error.response?.data?.message || "ບໍ່ສາມາດຣີເຊັດການຕັ້ງຄ່າໄດ້",
      });
    } finally {
      setLoading(false);
      setResetDialogOpen(false);
    }
  };

  const previewTransition = (type) => {
    switch (type) {
      case "fade":
        return (
          <div className="relative w-full h-10 rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-blue-500 animate-pulse"></div>
          </div>
        );
      case "slide":
        return (
          <div className="relative w-full h-10 rounded-md overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="bg-blue-600 w-1/2 h-full animate-[slideInRight_2s_ease-in-out_infinite]"></div>
              <div className="bg-indigo-600 w-1/2 h-full animate-[slideInRight_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        );
      case "zoom":
        return (
          <div className="relative w-full h-10 rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500 animate-[zoomIn_2s_ease-in-out_infinite]"></div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-10 rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-blue-500"></div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 font-['Phetsarath_OT']">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ການຕັ້ງຄ່າ Slideshow
          </h1>
          <p className="text-gray-500 mt-1">
            ປັບແຕ່ງການສະແດງຜົນ slideshow ສຳລັບໜ້າຫຼັກຂອງທ່ານ
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setResetDialogOpen(true)}
            disabled={loading || !formChanged}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            ຣີເຊັດ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formChanged}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ກຳລັງບັນທຶກ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                ບັນທຶກການຕັ້ງຄ່າ
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="display" className="text-base">
            <Monitor className="w-4 h-4 mr-2" />
            ການສະແດງຜົນ
          </TabsTrigger>
          <TabsTrigger value="animations" className="text-base">
            <Sliders className="w-4 h-4 mr-2" />
            ແອນິເມຊັນ
          </TabsTrigger>
          <TabsTrigger value="controls" className="text-base">
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            ການຄວບຄຸມ
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-base">
            <Settings2 className="w-4 h-4 mr-2" />
            ຂັ້ນສູງ
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ການສະແດງຜົນ</CardTitle>
                <CardDescription>
                  ປັບແຕ່ງລັກສະນະທົ່ວໄປຂອງ Slideshow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height" className="text-base">
                      ຄວາມສູງ
                    </Label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1">
                        <Slider
                          id="height"
                          min={300}
                          max={1200}
                          step={10}
                          value={[settings.height]}
                          onValueChange={(value) =>
                            handleInputChange("height", value[0])
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          value={settings.height}
                          onChange={(e) =>
                            handleNumberInputChange("height", e.target.value)
                          }
                          className="text-center"
                          min={300}
                          max={1200}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ຄວາມສູງໃນຫົວໜ່ວຍ pixel (300-1200px)
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">ແບບ Responsive</Label>
                      <p className="text-sm text-gray-500">
                        ປັບຂະໜາດຕາມໜ້າຈໍອັດຕະໂນມັດ
                      </p>
                    </div>
                    <Switch
                      checked={settings.responsive}
                      onCheckedChange={(checked) =>
                        handleInputChange("responsive", checked)
                      }
                      disabled={loading}
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="textPosition" className="text-base">
                      ຕຳແໜ່ງຂໍ້ຄວາມ
                    </Label>
                    <Select
                      value={settings.textPosition}
                      onValueChange={(value) =>
                        handleInputChange("textPosition", value)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="ເລືອກຕຳແໜ່ງຂໍ້ຄວາມ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">ດ້ານເທິງ</SelectItem>
                        <SelectItem value="bottom">ດ້ານລຸ່ມ</SelectItem>
                        <SelectItem value="center">ຕົງກາງ</SelectItem>
                        <SelectItem value="none">ບໍ່ສະແດງຂໍ້ຄວາມ</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      ກຳນົດຕຳແໜ່ງທີ່ຈະສະແດງຫົວຂໍ້ແລະຂໍ້ຄວາມ
                    </p>
                  </div>

                  <div>
                    <Label className="text-base">ພື້ນຫຼັງຂໍ້ຄວາມ</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="cursor-pointer text-sm">
                            ເປີດໃຊ້ສີພື້ນຫຼັງ
                          </Label>
                        </div>
                        <Switch
                          checked={settings.enableOverlay}
                          onCheckedChange={(checked) =>
                            handleInputChange("enableOverlay", checked)
                          }
                          disabled={loading}
                        />
                      </div>

                      {settings.enableOverlay && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="overlayColor" className="text-sm">
                              ສີພື້ນຫຼັງ
                            </Label>
                            <div className="flex gap-2 mt-1">
                              <div className="flex-1">
                                <Input
                                  id="overlayColor"
                                  value={settings.overlayColor}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "overlayColor",
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                />
                              </div>
                              <div
                                className="w-10 h-10 rounded border"
                                style={{
                                  backgroundColor: settings.overlayColor,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm mb-1 block">ຮູບແບບ</Label>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <input
                                  type="radio"
                                  id="gradient"
                                  name="overlayType"
                                  checked={settings.overlayColor.includes(
                                    "gradient"
                                  )}
                                  onChange={() =>
                                    handleInputChange(
                                      "overlayColor",
                                      "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))"
                                    )
                                  }
                                />
                                <Label
                                  htmlFor="gradient"
                                  className="text-sm cursor-pointer"
                                >
                                  ໄລ່ສີ
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <input
                                  type="radio"
                                  id="solid"
                                  name="overlayType"
                                  checked={
                                    !settings.overlayColor.includes("gradient")
                                  }
                                  onChange={() =>
                                    handleInputChange(
                                      "overlayColor",
                                      "rgba(0,0,0,0.3)"
                                    )
                                  }
                                />
                                <Label
                                  htmlFor="solid"
                                  className="text-sm cursor-pointer"
                                >
                                  ສີທຶບ
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ຕົວຢ່າງ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                  <img
                    src="/api/placeholder/800/400"
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: settings.enableOverlay
                        ? settings.overlayColor
                        : "transparent",
                    }}
                  ></div>

                  {settings.textPosition !== "none" && (
                    <div
                      className={`absolute ${
                        settings.textPosition === "top"
                          ? "top-0 left-0 right-0 p-6"
                          : settings.textPosition === "bottom"
                          ? "bottom-0 left-0 right-0 p-6"
                          : "inset-0 flex flex-col items-center justify-center p-6"
                      }`}
                    >
                      <h3 className="text-white text-2xl font-bold">
                        ຕົວຢ່າງຫົວຂໍ້ Slide
                      </h3>
                      <p className="text-white/90 mt-2">
                        ຄຳບັນຍາຍສັ້ນໆສຳລັບ slide ນີ້
                      </p>
                    </div>
                  )}

                  {settings.showArrows && (
                    <>
                      <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 hover:bg-white/40 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 hover:bg-white/40 transition-colors">
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}

                  {settings.showDots && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      <button className="w-3 h-3 rounded-full bg-white opacity-100"></button>
                      <button className="w-3 h-3 rounded-full bg-white opacity-50"></button>
                      <button className="w-3 h-3 rounded-full bg-white opacity-50"></button>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    ຕົວຢ່າງນີ້ສະແດງຮູບແບບຂອງ slideshow ຕາມການຕັ້ງຄ່າປັດຈຸບັນ.
                    ປັບປ່ຽນການຕັ້ງຄ່າເພື່ອເບິ່ງຜົນລັບທີ່ແຕກຕ່າງ.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ແອນິເມຊັນ ແລະ ການປ່ຽນ</CardTitle>
                <CardDescription>
                  ປັບແຕ່ງລູກຫຼິ້ນແລະການເຄື່ອນໄຫວ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="transition" className="text-base">
                    ລູກຫຼິ້ນການປ່ຽນ Slide
                  </Label>
                  <RadioGroup
                    value={settings.transition}
                    onValueChange={(value) =>
                      handleInputChange("transition", value)
                    }
                    className="mt-2 space-y-4"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="fade" id="fade" className="mt-1" />
                      <div className="grid gap-1.5 w-full">
                        <Label
                          htmlFor="fade"
                          className="font-medium cursor-pointer"
                        >
                          ຈາງ (Fade)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Slide ຈະຄ່ອຍໆປະກົດ ແລະ ຫາຍໄປແບບຈາງ
                        </p>
                        {settings.transition === "fade" &&
                          previewTransition("fade")}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem
                        value="slide"
                        id="slide"
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 w-full">
                        <Label
                          htmlFor="slide"
                          className="font-medium cursor-pointer"
                        >
                          ເລື່ອນ (Slide)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Slide ຈະເລື່ອນຈາກດ້ານຫນຶ່ງໄປອີກດ້ານຫນຶ່ງ
                        </p>
                        {settings.transition === "slide" &&
                          previewTransition("slide")}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="zoom" id="zoom" className="mt-1" />
                      <div className="grid gap-1.5 w-full">
                        <Label
                          htmlFor="zoom"
                          className="font-medium cursor-pointer"
                        >
                          ຂະຫຍາຍ (Zoom)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Slide ຈະຂະຫຍາຍເຂົ້າ ຫຼື ອອກ ເມື່ອປ່ຽນ
                        </p>
                        {settings.transition === "zoom" &&
                          previewTransition("zoom")}
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="transitionDuration" className="text-base">
                    ໄລຍະເວລາການປ່ຽນ
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1">
                      <Slider
                        id="transitionDuration"
                        min={200}
                        max={2000}
                        step={50}
                        value={[settings.transitionDuration]}
                        onValueChange={(value) =>
                          handleInputChange("transitionDuration", value[0])
                        }
                        disabled={loading}
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        value={settings.transitionDuration}
                        onChange={(e) =>
                          handleNumberInputChange(
                            "transitionDuration",
                            e.target.value
                          )
                        }
                        className="text-center"
                        min={200}
                        max={2000}
                        step={50}
                        disabled={loading}
                      />
                    </div>
                    <span className="text-sm text-gray-500">ms</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    ໄລຍະເວລາໃນການປ່ຽນລະຫວ່າງ slides (200-2000ms)
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">ເອນິເມຊັນຂໍ້ຄວາມ</Label>
                    <p className="text-sm text-gray-500">
                      ແອນິເມຊັນສຳລັບຂໍ້ຄວາມໃນ slides
                    </p>
                  </div>
                  <Switch
                    checked={settings.animateText}
                    onCheckedChange={(checked) =>
                      handleInputChange("animateText", checked)
                    }
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ການຄວບຄຸມການສະແດງຜົນ</CardTitle>
                <CardDescription>
                  ປັບແຕ່ງວິທີການຄວບຄຸມ slideshow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">ສະຫຼັບອັດຕະໂນມັດ</Label>
                      <p className="text-sm text-gray-500">
                        ປ່ຽນ slides ອັດຕະໂນມັດ
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoplay}
                      onCheckedChange={(checked) =>
                        handleInputChange("autoplay", checked)
                      }
                      disabled={loading}
                    />
                  </div>

                  {settings.autoplay && (
                    <div>
                      <Label htmlFor="interval" className="text-base">
                        ໄລຍະເວລາສະຫຼັບ
                      </Label>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1">
                          <Slider
                            id="interval"
                            min={1000}
                            max={10000}
                            step={500}
                            value={[settings.interval]}
                            onValueChange={(value) =>
                              handleInputChange("interval", value[0])
                            }
                            disabled={loading}
                          />
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            value={settings.interval}
                            onChange={(e) =>
                              handleNumberInputChange(
                                "interval",
                                e.target.value
                              )
                            }
                            className="text-center"
                            min={1000}
                            max={10000}
                            step={500}
                            disabled={loading}
                          />
                        </div>
                        <span className="text-sm text-gray-500">ms</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        ໄລຍະເວລາໃນການສະແດງແຕ່ລະ slide ກ່ອນປ່ຽນໄປອັນຕໍ່ໄປ (1-10
                        ວິນາທີ)
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <Label className="text-base cursor-pointer">
                            ຢຸດເມື່ອເລື່ອນເມົ້າໃສ່
                          </Label>
                          <p className="text-sm text-gray-500">
                            ຢຸດການສະຫຼັບອັດຕະໂນມັດເມື່ອເລື່ອນເມົ້າໃສ່ Slideshow
                          </p>
                        </div>
                        <Switch
                          checked={settings.pauseOnHover}
                          onCheckedChange={(checked) =>
                            handleInputChange("pauseOnHover", checked)
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">ສະແດງລູກສອນ</Label>
                      <p className="text-sm text-gray-500">ປຸ່ມນຳທາງຊ້າຍ-ຂວາ</p>
                    </div>
                    <Switch
                      checked={settings.showArrows}
                      onCheckedChange={(checked) =>
                        handleInputChange("showArrows", checked)
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">ສະແດງຈຸດນຳທາງ</Label>
                      <p className="text-sm text-gray-500">ຈຸດນຳທາງດ້ານລຸ່ມ</p>
                    </div>
                    <Switch
                      checked={settings.showDots}
                      onCheckedChange={(checked) =>
                        handleInputChange("showDots", checked)
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ການຕັ້ງຄ່າຂັ້ນສູງ</CardTitle>
                <CardDescription>ຕັ້ງຄ່າສຳລັບຜູ້ໃຊ້ຂັ້ນສູງ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="maxSlides" className="text-base">
                    ຈຳນວນສູງສຸດຂອງ Slides ທີ່ສະແດງ
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1">
                      <Slider
                        id="maxSlides"
                        min={1}
                        max={10}
                        step={1}
                        value={[settings.maxSlides]}
                        onValueChange={(value) =>
                          handleInputChange("maxSlides", value[0])
                        }
                        disabled={loading}
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        value={settings.maxSlides}
                        onChange={(e) =>
                          handleNumberInputChange("maxSlides", e.target.value)
                        }
                        className="text-center"
                        min={1}
                        max={10}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    ຈຳກັດຈຳນວນ slides ທີ່ສະແດງໃນໜ້າຫຼັກ
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">ຕົວເລືອກການຕັ້ງຄ່າພິເສດ</h3>
                  <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                    <div className="flex items-start">
                      <Eye className="h-4 w-4 mt-0.5 mr-2" />
                      <div>
                        <AlertTitle className="text-blue-800">
                          ຄຳແນະນຳ
                        </AlertTitle>
                        <AlertDescription className="text-blue-700">
                          ການຕັ້ງຄ່າຂັ້ນສູງນີ້ແມ່ນສຳລັບຜູ້ທີ່ມີຄວາມຮູ້ດ້ານການອອກແບບເວັບໄຊ.
                          ຖ້າບໍ່ແນ່ໃຈ, ໃຫ້ໃຊ້ການຕັ້ງຄ່າເລີ່ມຕົ້ນ.
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                </div>

                <div className="grid gap-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customCSS" className="text-base">
                        CSS ເພີ່ມເຕີມ
                      </Label>
                      <textarea
                        id="customCSS"
                        className="w-full min-h-[100px] mt-2 p-2 border border-gray-200 rounded-md"
                        placeholder=".slideshow { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }"
                        disabled={loading}
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">
                        ເພີ່ມ CSS ພິເສດສຳລັບ Slideshow
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="customJS" className="text-base">
                        JavaScript ເພີ່ມເຕີມ
                      </Label>
                      <textarea
                        id="customJS"
                        className="w-full min-h-[100px] mt-2 p-2 border border-gray-200 rounded-md"
                        placeholder="// ຄຳສັ່ງ JavaScript ເພີ່ມເຕີມ"
                        disabled={loading}
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">
                        ເພີ່ມ JavaScript ພິເສດ
                      </p>
                    </div>
                  </div>
                  <p className="text-yellow-600 text-sm">
                    <strong>ໝາຍເຫດ:</strong> ການປ່ຽນແປງ CSS ຫຼື JavaScript
                    ອາດຈະສົ່ງຜົນກະທົບຕໍ່ການເຮັດວຽກຂອງ Slideshow.
                    ໃຊ້ດ້ວຍຄວາມລະມັດລະວັງ.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t p-6 flex flex-col gap-4 items-start">
                <div className="space-y-2">
                  <h3 className="font-medium text-base">ຕັວເລືອກການຣີເຊັດ</h3>
                  <p className="text-sm text-gray-600">
                    ຣີເຊັດການຕັ້ງຄ່າ Slideshow ທັງໝົດກັບສູ່ຄ່າເລີ່ມຕົ້ນ
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setResetDialogOpen(true)}
                  className="mt-2"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  ຣີເຊັດການຕັ້ງຄ່າທັງໝົດ
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ຢືນຢັນການຣີເຊັດການຕັ້ງຄ່າ</AlertDialogTitle>
            <AlertDialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຣີເຊັດການຕັ້ງຄ່າທັງໝົດກັບສູ່ຄ່າເລີ່ມຕົ້ນ?
              ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>ຍົກເລີກ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ກຳລັງຣີເຊັດ...
                </>
              ) : (
                "ຣີເຊັດການຕັ້ງຄ່າ"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SlideshowSettings;
