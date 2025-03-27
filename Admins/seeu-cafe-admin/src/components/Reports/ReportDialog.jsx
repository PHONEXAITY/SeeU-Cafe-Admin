// components/Reports/ReportDialog.jsx
'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FaFileAlt, FaCalendarAlt, FaChartBar, FaSpinner } from 'react-icons/fa';
import { generateReportData, downloadFile } from '@/services/reportService';
import { toast } from '@/components/ui/toast';

const ReportDialog = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    reportType: 'sales',
    dateRange: 'today',
    startDate: '',
    endDate: '',
    format: 'pdf'
  });
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { 
      value: 'sales', 
      label: 'ລາຍງານການຂາຍ',
      description: 'ສະຫຼຸບຍອດຂາຍ, ຈຳນວນອໍເດີ, ແລະ ການວິເຄາະ'
    },
    { 
      value: 'products', 
      label: 'ລາຍງານສິນຄ້າ',
      description: 'ສະຫຼຸບສິນຄ້າຂາຍດີ, ສິນຄ້າໃກ້ໝົດ, ແລະ ການເຄື່ອນໄຫວ'
    },
    { 
      value: 'employees', 
      label: 'ລາຍງານພະນັກງານ',
      description: 'ຂໍ້ມູນການເຮັດວຽກ, ການລາພັກ, ແລະ ການມາສາຍ'
    },
    { 
      value: 'customers', 
      label: 'ລາຍງານລູກຄ້າ',
      description: 'ການວິເຄາະລູກຄ້າ, ການຊື້ຊ້ຳ, ແລະ ພຶດຕິກຳ'
    }
  ];

  const dateRanges = [
    { value: 'today', label: 'ມື້ນີ້' },
    { value: 'yesterday', label: 'ມື້ວານນີ້' },
    { value: 'week', label: 'ອາທິດນີ້' },
    { value: 'month', label: 'ເດືອນນີ້' },
    { value: 'custom', label: 'ກຳນົດເອງ' }
  ];

  const formats = [
    { 
      value: 'pdf', 
      label: 'PDF',
      description: 'ເໝາະສຳລັບການສະແດງຜົນແລະການພິມ'
    },
    { 
      value: 'excel', 
      label: 'Excel',
      description: 'ເໝາະສຳລັບການວິເຄາະຂໍ້ມູນເພີ່ມເຕີມ'
    },
    { 
      value: 'csv', 
      label: 'CSV',
      description: 'ເໝາະສຳລັບການນຳເຂົ້າຂໍ້ມູນໃນລະບົບອື່ນ'
    }
  ];

  const handleGenerateReport = async () => {
    try {
      setLoading(true);

      // Validate dates if custom range
      if (formData.dateRange === 'custom') {
        if (!formData.startDate || !formData.endDate) {
          toast.error('ກະລຸນາເລືອກວັນທີໃຫ້ຄົບຖ້ວນ');
          return;
        }
      }

      // Generate report data
      const data = await generateReportData(
        formData.reportType,
        formData.dateRange,
        formData.startDate,
        formData.endDate
      );

      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `report_${formData.reportType}_${date}`;

      // Download file
      downloadFile(data, filename, formData.format);

      toast.success('ສ້າງລາຍງານສຳເລັດ');
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການສ້າງລາຍງານ');
    } finally {
      setLoading(false);
    }
  };

  const getReportTypeDescription = () => {
    return reportTypes.find(type => type.value === formData.reportType)?.description;
  };

  const getFormatDescription = () => {
    return formats.find(format => format.value === formData.format)?.description;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaFileAlt className="w-5 h-5" />
            ສ້າງການລາຍງານ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label>ປະເພດລາຍງານ</Label>
            <Select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            {getReportTypeDescription() && (
              <p className="text-sm text-gray-500">{getReportTypeDescription()}</p>
            )}
          </div>

          {/* Date Range Selection */}
          <div className="space-y-2">
            <Label>ຊ່ວງເວລາ</Label>
            <Select
              value={formData.dateRange}
              onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Custom Date Range */}
          {formData.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ວັນທີເລີ່ມຕົ້ນ</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>ວັນທີສິ້ນສຸດ</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-2">
            <Label>ຮູບແບບໄຟລ໌</Label>
            <Select
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            >
              {formats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </Select>
            {getFormatDescription() && (
              <p className="text-sm text-gray-500">{getFormatDescription()}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleGenerateReport} 
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                ກຳລັງສ້າງລາຍງານ...
              </>
            ) : (
              <>
                <FaChartBar className="w-4 h-4" />
                ສ້າງລາຍງານ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;