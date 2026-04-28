"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DownloadReportButtonProps {
  data: any;
  companyName?: string;
}

export default function DownloadReportButton({
  data,
  companyName,
}: DownloadReportButtonProps) {
  const generatePDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const company = companyName || "Authorized Partner";

    // ─── Header ───
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("AI BIAS AUDIT REPORT", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 160);
    doc.text(`Generated for: ${company}`, 20, 32);
    doc.text(`Audit Date: ${timestamp}`, 140, 32);

    // ─── Executive Summary ───
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 20, 55);

    autoTable(doc, {
      startY: 60,
      head: [["Metric", "Value", "Status"]],
      body: [
        ["Fairness Percentage", `${data.fairness_percentage}%`, data.fairness_percentage > 80 ? "Healthy" : "Attention Required"],
        ["Bias Intensity Score", `${data.bias_score}%`, data.bias_level],
        ["Total Decisions Audited", data.total_decisions.toLocaleString(), "Verified"],
      ],
      theme: "striped",
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    // ─── Demographic Parity ───
    let currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Demographic Parity Analysis", 20, currentY);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Demographic", "Selection Rate", "Parity Gap"]],
      body: [
        ["Male Group", `${data.male_selection_rate}%`, "-"],
        ["Female Group", `${data.female_selection_rate}%`, `${Math.abs(data.male_selection_rate - data.female_selection_rate).toFixed(1)}%`],
      ],
      theme: "grid",
      headStyles: { fillColor: [6, 182, 212] },
    });

    // ─── Critical Alerts ───
    currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Risk Indicators & Alerts", 20, currentY);
    
    if (data.alerts && data.alerts.length > 0) {
      autoTable(doc, {
        startY: currentY + 5,
        body: data.alerts.map((alert: string) => [alert]),
        theme: "plain",
        styles: { textColor: [239, 68, 68], fontStyle: "italic" },
      });
    } else {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("No critical bias alerts detected in the current dataset.", 25, currentY + 12);
    }

    // ─── Recommendations ───
    currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Strategic Recommendations", 20, currentY);

    if (data.recommendations && data.recommendations.length > 0) {
      autoTable(doc, {
        startY: currentY + 5,
        body: data.recommendations.map((rec: string) => [`• ${rec}`]),
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 3 },
      });
    }

    // ─── Footer ───
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Antigravity AI Bias Hub | Confidential Internal Audit | Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
    }

    doc.save(`bias-audit-${company.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={generatePDF}
      disabled={!data}
      className="btn-premium flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm shadow-xl shadow-purple-500/20 disabled:opacity-40"
    >
      <FileText className="w-4 h-4" />
      Generate PDF Audit
    </motion.button>
  );
}
