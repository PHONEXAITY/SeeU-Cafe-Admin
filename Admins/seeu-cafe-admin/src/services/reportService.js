
export const generateReportData = async (reportType, dateRange, startDate, endDate) => {
    // Simulate API call
    const response = {
      sales: {
        summary: {
          totalSales: 25000000,
          totalOrders: 150,
          averageOrderValue: 166666.67,
        },
        data: [
          { date: '2024-03-15', sales: 2500000, orders: 15 },
          { date: '2024-03-16', sales: 3000000, orders: 18 },
        ]
      },
      products: {
        summary: {
          totalProducts: 45,
          lowStock: 5,
          topSelling: 'Espresso'
        },
        data: [
          { name: 'Espresso', sold: 250, revenue: 5000000 },
          { name: 'Latte', sold: 200, revenue: 4800000 },
        ]
      },
      employees: {
        summary: {
          totalEmployees: 12,
          activeShifts: 8,
          onLeave: 1
        },
        data: [
          { name: 'ສົມສະໜຸກ', department: 'ບໍລິການ', hoursWorked: 160 },
          { name: 'ສົມໃຈ', department: 'ຜະລິດ', hoursWorked: 152 },
        ]
      },
      customers: {
        summary: {
          totalCustomers: 500,
          newCustomers: 45,
          repeatRate: '68%'
        },
        data: [
          { name: 'Customer A', orders: 12, totalSpent: 2400000 },
          { name: 'Customer B', orders: 8, totalSpent: 1600000 },
        ]
      }
    };
  
    return response[reportType];
  };
  
  // ฟังก์ชันแปลงข้อมูลเป็น CSV
  export const convertToCSV = (data) => {
    if (!data || !data.data || !Array.isArray(data.data)) {
      return '';
    }
  
    const headers = Object.keys(data.data[0]);
    const rows = [
      headers.join(','),
      ...data.data.map(row => headers.map(header => row[header]).join(','))
    ];
  
    return rows.join('\n');
  };
  
  // ฟังก์ชันแปลงข้อมูลเป็น Excel
  export const convertToExcel = (data) => {
    // สร้าง Excel workbook (ใช้ library เช่น xlsx)
    return data;
  };
  
  // ฟังก์ชันแปลงข้อมูลเป็น PDF
  export const convertToPDF = (data) => {
    // สร้าง PDF document (ใช้ library เช่น pdfmake)
    return data;
  };
  
  // ฟังก์ชันดาวน์โหลดไฟล์
  export const downloadFile = (data, filename, format) => {
    let content;
    let mimeType;
  
    switch (format) {
      case 'csv':
        content = convertToCSV(data);
        mimeType = 'text/csv';
        break;
      case 'excel':
        content = convertToExcel(data);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'pdf':
        content = convertToPDF(data);
        mimeType = 'application/pdf';
        break;
      default:
        throw new Error('Unsupported format');
    }
  
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };