'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FaSave, FaImage } from 'react-icons/fa';

const CreateBlogPost = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ສ້າງ Post ໃໝ່</h1>
          <p className="text-gray-500">ສ້າງບົດຄວາມໃໝ່ສຳລັບບລັອກຂອງທ່ານ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            ຍົກເລີກ
          </Button>
          <Button>
            <FaSave className="w-4 h-4 mr-2" />
            ເຜີຍແຜ່
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">ຫົວຂໍ້</Label>
                  <Input id="title" placeholder="ໃສ່ຫົວຂໍ້ບົດຄວາມ..." />
                </div>
                <div>
                  <Label htmlFor="content">ເນື້ອໃນ</Label>
                  <Textarea
                    id="content"
                    placeholder="ເລີ່ມຂຽນບົດຄວາມຂອງທ່ານ..."
                    rows={12}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ຮູບພາບຫຼັກ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FaImage className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">ລາກຮູບໃສ່ນີ້ ຫຼື ກົດເພື່ອເລືອກຮູບ</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ການຕັ້ງຄ່າ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">ໝວດໝູ່</Label>
                  <Select>
                    <option>ເລືອກໝວດໝູ່...</option>
                    <option>ກາເຟ</option>
                    <option>ຊາ</option>
                    <option>ອາຫານ</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">ສະຖານະ</Label>
                  <Select>
                    <option>ຮ່າງ</option>
                    <option>ເຜີຍແຜ່</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input id="meta-title" />
                </div>
                <div>
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea id="meta-description" rows={3} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPost;