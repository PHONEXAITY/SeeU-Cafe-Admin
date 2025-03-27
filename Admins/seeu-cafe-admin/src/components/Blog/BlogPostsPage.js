'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const BlogPostsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const posts = [
    {
      id: 1,
      title: "ວິທີການເຮັດກາເຟທີ່ດີທີ່ສຸດ",
      category: "ກາເຟ",
      status: "published",
      date: "2024-03-15",
      author: "ທ. ສົມສະໜຸກ",
      views: 1234
    },
    {
      id: 2,
      title: "ເຄັດລັບການຊົງຊາ",
      category: "ຊາ",
      status: "draft",
      date: "2024-03-14",
      author: "ນາງ ສົມໃຈ",
      views: 890
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800"
    };
    return styles[status] || styles.draft;
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Posts ທັງໝົດ</h1>
          <p className="text-gray-500">ຈັດການບົດຄວາມທັງໝົດຂອງທ່ານ</p>
        </div>
        <a href="/blog/create" className="">
        <Button >ສ້າງ Post ໃໝ່</Button>
        </a>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="ຄົ້ນຫາ posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">ໝວດໝູ່</Button>
              <Button variant="outline">ຕົວກອງ</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{post.title}</h3>
                    <Badge className={getStatusBadge(post.status)}>
                      {post.status === 'published' ? 'ເຜີຍແຜ່ແລ້ວ' : 'ຮ່າງ'}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <span>ໝວດໝູ່: {post.category}</span>
                    <span className="mx-2">•</span>
                    <span>ຜູ້ຂຽນ: {post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FaEye className="w-4 h-4 mr-2" />
                    {post.views}
                  </Button>
                  <Button size="sm" variant="outline">
                    <FaEdit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPostsPage;