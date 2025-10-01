// PDF Export utility using jsPDF
// This creates downloadable PDF reports for dashboard analytics

export interface ReportData {
  title: string
  period: string
  generatedDate: string
  stats: Array<{
    label: string
    value: string | number
  }>
  chartData?: Array<{
    label: string
    value: number
  }>
  additionalInfo?: string
}

export async function generatePDFReport(data: ReportData): Promise<void> {
  // Dynamic import to reduce bundle size
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Header
  doc.setFontSize(24)
  doc.setTextColor(255, 107, 53) // #FF6B35
  doc.text(data.title, pageWidth / 2, yPosition, { align: "center" })

  yPosition += 15
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Period: ${data.period}`, pageWidth / 2, yPosition, { align: "center" })

  yPosition += 8
  doc.text(`Generated: ${data.generatedDate}`, pageWidth / 2, yPosition, { align: "center" })

  yPosition += 20

  // Stats Section
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text("Key Metrics", 20, yPosition)

  yPosition += 10
  doc.setFontSize(11)

  data.stats.forEach((stat) => {
    doc.setTextColor(100, 100, 100)
    doc.text(stat.label, 20, yPosition)
    doc.setTextColor(0, 0, 0)
    doc.setFont(undefined, "bold")
    doc.text(String(stat.value), pageWidth - 20, yPosition, { align: "right" })
    doc.setFont(undefined, "normal")
    yPosition += 8
  })

  // Chart Data Section (if provided)
  if (data.chartData && data.chartData.length > 0) {
    yPosition += 15
    doc.setFontSize(16)
    doc.text("Activity Breakdown", 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)

    data.chartData.forEach((item) => {
      doc.setTextColor(100, 100, 100)
      doc.text(item.label, 20, yPosition)
      doc.setTextColor(0, 0, 0)
      doc.text(String(item.value), pageWidth - 20, yPosition, { align: "right" })
      yPosition += 8
    })
  }

  // Additional Info
  if (data.additionalInfo) {
    yPosition += 15
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    const splitText = doc.splitTextToSize(data.additionalInfo, pageWidth - 40)
    doc.text(splitText, 20, yPosition)
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(10)
  doc.setTextColor(150, 150, 150)
  doc.text("DOLT - Smart Maintenance Solutions", pageWidth / 2, footerY, { align: "center" })
  doc.text("©2025 DOLT. All rights reserved.", pageWidth / 2, footerY + 5, { align: "center" })

  // Save the PDF
  const filename = `DOLT_Report_${data.period.replace(/\s/g, "_")}_${Date.now()}.pdf`
  doc.save(filename)
}
