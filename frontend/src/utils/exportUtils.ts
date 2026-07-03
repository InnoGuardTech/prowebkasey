import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ───────────────────────────────────────────────────────
//  EXCEL EXPORT
// ───────────────────────────────────────────────────────
export const exportToExcel = (
  data: any[],
  fileName: string,
  sheetName: string = 'البيانات'
) => {
  if (!data || data.length === 0) {
    alert('لا توجد بيانات للتصدير');
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-width columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...data.map((row) => String(row[key] ?? '').length)) + 4,
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${fileName}_${today}.xlsx`);
};

// ───────────────────────────────────────────────────────
//  MULTI-SHEET EXCEL BACKUP (للنسخ الاحتياطي الشامل)
// ───────────────────────────────────────────────────────
export const exportFullBackupToExcel = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = { Authorization: `Bearer ${token}` };
  const base = '/api/v1';

  const workbook = XLSX.utils.book_new();
  const today = new Date().toISOString().split('T')[0];

  const sheets: { url: string; sheetName: string; label: string }[] = [
    { url: `${base}/trucks`, sheetName: 'القواطر', label: 'القواطر' },
    { url: `${base}/drivers`, sheetName: 'السواقين', label: 'السواقين' },
    { url: `${base}/contractors`, sheetName: 'المقاولين', label: 'المقاولين' },
    { url: `${base}/invoices`, sheetName: 'الإيرادات', label: 'الإيرادات' },
    { url: `${base}/expenses`, sheetName: 'المصروفات', label: 'المصروفات' },
    { url: `${base}/trips`, sheetName: 'الرحلات', label: 'الرحلات' },
  ];

  for (const sheet of sheets) {
    try {
      const res = await fetch(sheet.url, { headers });
      if (!res.ok) continue;
      const rawData = await res.json();
      const data = Array.isArray(rawData) ? rawData : (rawData.data || []);
      if (data.length === 0) continue;

      // Flatten nested objects one level deep
      const flatData = data.map((row: any) => {
        const flat: any = {};
        for (const [key, val] of Object.entries(row)) {
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            for (const [subKey, subVal] of Object.entries(val as object)) {
              flat[`${key}_${subKey}`] = subVal;
            }
          } else {
            flat[key] = val;
          }
        }
        return flat;
      });

      const ws = XLSX.utils.json_to_sheet(flatData);
      XLSX.utils.book_append_sheet(workbook, ws, sheet.sheetName);
    } catch {
      // skip failed sheets
    }
  }

  if (workbook.SheetNames.length === 0) {
    alert('لا توجد بيانات للتصدير');
    return;
  }

  XLSX.writeFile(workbook, `نسخة_احتياطية_شاملة_${today}.xlsx`);
};

import html2canvas from 'html2canvas';

// ───────────────────────────────────────────────────────
//  PDF EXPORT  (True PDF via Canvas for Arabic Support)
// ───────────────────────────────────────────────────────
export const exportToPDF = async (
  columns: { header: string; dataKey: string }[],
  data: any[],
  fileName: string,
  title: string,
  summary?: { label: string; value: string }[]
) => {
  if (!data || data.length === 0) {
    alert('لا توجد بيانات للتصدير');
    return;
  }

  // Create a container for the print view
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '1000px';
  container.style.backgroundColor = 'white';
  container.style.padding = '40px';
  container.style.color = 'black';
  container.style.direction = 'rtl';
  container.style.fontFamily = 'Arial, sans-serif'; // safe fallback
  
  // Build HTML
  let html = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 28px; margin: 0; color: #1e1e1e;">${title}</h1>
      <p style="color: #666; margin-top: 5px;">تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</p>
    </div>
  `;

  if (summary && summary.length > 0) {
    html += `<div style="display: flex; justify-content: space-around; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px;">`;
    summary.forEach(s => {
      html += `<div style="text-align: center;">
        <p style="font-size: 14px; color: #666; margin: 0;">${s.label}</p>
        <p style="font-size: 20px; font-weight: bold; margin: 5px 0 0 0;">${s.value}</p>
      </div>`;
    });
    html += `</div>`;
  }

  html += `<table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 14px;">
    <thead>
      <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">`;
  columns.forEach(col => {
    html += `<th style="padding: 12px; font-weight: bold;">${col.header}</th>`;
  });
  html += `</tr></thead><tbody>`;
  
  data.forEach((row, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    html += `<tr style="background-color: ${bg}; border-bottom: 1px solid #e2e8f0;">`;
    columns.forEach(col => {
      html += `<td style="padding: 12px;">${row[col.dataKey] || '-'}</td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table>`;

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions (A4 size)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('حدث خطأ أثناء تصدير ملف PDF');
  } finally {
    document.body.removeChild(container);
  }
};

// ───────────────────────────────────────────────────────
//  PRINT  (with proper print styles)
// ───────────────────────────────────────────────────────
export const printTable = (title?: string) => {
  if (title) {
    const originalTitle = document.title;
    document.title = title;
    window.print();
    document.title = originalTitle;
  } else {
    window.print();
  }
};
