import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const escapeCsvValue = (value) => {
  const stringValue = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export function buildCsv({ title, generatedAt, filters, columns, rows }) {
  const lines = [];
  lines.push(escapeCsvValue(title));
  lines.push(`Generated: ${generatedAt}`);
  if (filters && Object.keys(filters).length) {
    lines.push(`Filters: ${Object.entries(filters).map(([key, value]) => `${key}=${value}`).join("; ")}`);
  }
  lines.push("");
  lines.push(columns.map((column) => escapeCsvValue(column.label)).join(","));
  rows.forEach((row) => {
    lines.push(columns.map((column) => escapeCsvValue(row[column.key])).join(","));
  });
  return Buffer.from(lines.join("\n"), "utf-8");
}

export async function buildXlsx({ title, generatedAt, filters, columns, rows }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "AssetFlow Reports";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(title.slice(0, 31) || "Report");
  sheet.addRow([title]);
  sheet.addRow([`Generated: ${generatedAt}`]);
  if (filters && Object.keys(filters).length) {
    sheet.addRow([`Filters: ${Object.entries(filters).map(([key, value]) => `${key}=${value}`).join("; ")}`]);
  }
  sheet.addRow([]);

  const headerRow = sheet.addRow(columns.map((column) => column.label));
  headerRow.font = { bold: true };

  rows.forEach((row) => {
    sheet.addRow(columns.map((column) => row[column.key] ?? ""));
  });

  sheet.columns.forEach((column) => {
    column.width = 20;
  });

  return workbook.xlsx.writeBuffer();
}

export function buildPdf({ title, generatedAt, filters, columns, rows }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(16).text(title, { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(9).fillColor("#555").text(`Generated: ${generatedAt}`);
    if (filters && Object.keys(filters).length) {
      doc.text(`Filters: ${Object.entries(filters).map(([key, value]) => `${key}=${value}`).join("; ")}`);
    }
    doc.moveDown(0.8);
    doc.fillColor("#000");

    const startX = doc.x;
    const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidth = usableWidth / columns.length;
    const rowHeight = 20;

    const drawRow = (values, y, bold) => {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(9);
      values.forEach((value, index) => {
        doc.text(String(value ?? ""), startX + index * columnWidth, y, {
          width: columnWidth - 4,
          ellipsis: true,
        });
      });
    };

    let y = doc.y;
    drawRow(columns.map((column) => column.label), y, true);
    y += rowHeight;
    doc.moveTo(startX, y - 4).lineTo(startX + usableWidth, y - 4).strokeColor("#ccc").stroke();

    rows.forEach((row) => {
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = doc.y;
      }
      drawRow(columns.map((column) => row[column.key]), y, false);
      y += rowHeight;
    });

    doc.end();
  });
}
