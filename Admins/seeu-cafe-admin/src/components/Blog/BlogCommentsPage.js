'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FaSearch, FaCheck, FaBan, FaReply, FaTrash } from 'react-icons/fa';

const CommentDialog = ({ isOpen, onClose, comment }) => {
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Response submitted:', response);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] font-['Phetsarath_OT']">
        <DialogHeader>
          <DialogTitle>ຕອບກັບຄວາມຄິດເຫັນ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={comment?.userAvatar || '/api/placeholder/32/32'}
                  alt={comment?.userName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">{comment?.userName}</p>
                  <p className="text-sm text-gray-500">{comment?.date}</p>
                </div>
              </div>
              <p className="text-gray-700">{comment?.content}</p>
            </div>
            <div>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="ຂຽນຄຳຕອບຂອງທ່ານ..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">ສົ່ງຄຳຕອບ</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              ຍົກເລີກ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const BlogCommentsPage = () => {
  const [dialogState, setDialogState] = useState({ isOpen: false, comment: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const comments = [
    {
      id: 1,
      userName: "ສົມສະໜຸກ",
      userAvatar: "/api/placeholder/32/32",
      content: "ບົດຄວາມດີຫຼາຍ! ຂໍຂອບໃຈສຳລັບຂໍ້ມູນທີ່ເປັນປະໂຫຍດ.",
      date: "2024-03-15",
      postTitle: "ວິທີການເຮັດກາເຟທີ່ດີທີ່ສຸດ",
      status: "approved"
    },
    {
      id: 2,
      userName: "ນາງ ສົມໃຈ",
      userAvatar: "/api/placeholder/32/32",
      content: "ຂ້ອຍມີຄຳຖາມກ່ຽວກັບຂັ້ນຕອນທີ 3...",
      date: "2024-03-14",
      postTitle: "ເຄັດລັບການຊົງຊາ",
      status: "pending"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      spam: "bg-red-100 text-red-800"
    };
    
    const labels = {
      approved: "ອະນຸມັດແລ້ວ",
      pending: "ລໍຖ້າ",
      spam: "ສະແປມ"
    };

    return (
      <Badge className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ຄວາມຄິດເຫັນ</h1>
          <p className="text-gray-500">ຈັດການຄວາມຄິດເຫັນຈາກຜູ້ອ່ານ</p>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="ຄົ້ນຫາຄວາມຄິດເຫັນ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'approved', 'pending', 'spam'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                  size="sm"
                >
                  {status === 'all' ? 'ທັງໝົດ' : 
                   status === 'approved' ? 'ອະນຸມັດແລ້ວ' :
                   status === 'pending' ? 'ລໍຖ້າ' : 'ສະແປມ'}
                </Button>
              ))}
            </div>
        </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <div key={comment.id} className="py-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="font-medium">{comment.userName}</span>
                          {getStatusBadge(comment.status)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          ບົດຄວາມ: {comment.postTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          {comment.date}
                        </p>
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDialogState({ isOpen: true, comment })}
                    >
                      <FaReply className="w-4 h-4 mr-2" />
                      ຕອບກັບ
                    </Button>
                    {comment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600"
                        >
                          <FaCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          <FaBan className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {comment.adminReply && (
                  <div className="mt-3 ml-11 pl-4 border-l-2 border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">ການຕອບກັບ:</span> {comment.adminReply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CommentDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, comment: null })}
        comment={dialogState.comment}
      />
    </div>
  );
};

export default BlogCommentsPage;