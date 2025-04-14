// components/documents/DocumentHeader.js
import { Button } from '@/components/ui/button';
import { File, Plus, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DocumentHeader({ onAddClick, documentCount = 0 }) {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg mb-6 border shadow-sm font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-3 rounded-full">
              <File className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              ຈັດການເອກະສານ
            </h1>
            <Badge variant="outline" className="ml-2">
              {documentCount} ລາຍການ
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">
            ຈັດການເອກະສານທັງໝົດໃນລະບົບ - ອັບໂຫລດ, ເບິ່ງ, ດາວໂຫລດ ແລະ ຈັດການເອກະສານຂອງທ່ານ
          </p>
        </div>
        <Button onClick={onAddClick} size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md  transition-all duration-300 transform hover:shadow-md hover:scale-105">
          <Upload className="h-4 w-4" />
          ອັບໂຫລດເອກະສານໃໝ່
        </Button>
      </div>
    </div>
  );
}