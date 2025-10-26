"use client";

import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReceiptButton({ transaction }: { transaction: any }) {
  const handleDownload = () => {
    const doc = new jsPDF();

    // console.log(transaction)

    // --- Header with Logo ---
    // You can replace with a real base64 logo image
    // Example: const logo = "/logo.png"; (convert to base64 or fetch before use)
    doc.setFontSize(18);
    doc.text("RadonPay", 20, 20);
    doc.setFontSize(12);
    doc.text("Transaction Receipt", 20, 30);

    // --- Transaction Summary ---
    autoTable(doc, {
      startY: 40,
      styles: { halign: "left" },
      head: [["Transaction Summary"]],
      body: [
        ["Transaction ID", transaction.reference],
        ["Date", new Date(transaction.createdAt).toLocaleString()],
        ["Status", transaction.status],
      ],
      theme: "striped",
      headStyles: { fillColor: [22, 155, 98] }, // Green brand color
    });

    // --- Parties Info ---
    autoTable(doc, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startY: (doc as any).lastAutoTable.finalY + 10,
      styles: { halign: "left" },
      head: [["Parties"]],
      body: [
        ["Receiver", transaction.receiverName],
        ["Country", transaction.destinationCountry],
        ["Currency", transaction.destinationCurrency],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 155, 98] },
    });

    // --- Financial Details ---
    autoTable(doc, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startY: (doc as any).lastAutoTable.finalY + 10,
      styles: { halign: "left" },
      head: [["Financials"]],
      body: [
        ["Amount Received", `${transaction.amountReceived} ${transaction.destinationCurrency}`],
        ["Exchange Rate", transaction.exchangeRate],
        ["Fee", transaction.fee ? `${transaction.fee} ${transaction.destinationCurrency}` : "N/A"],
        ["Total Paid", `${transaction.amountReceived + (transaction.fee || 0)} ${transaction.destinationCurrency}`],
      ],
      theme: "striped",
      headStyles: { fillColor: [22, 155, 98] },
    });

    // --- Footer ---
    doc.setFontSize(10);
    doc.text(
      "Thank you for using RadonPay. For support, visit radonpay.com",
      20,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).lastAutoTable.finalY + 20
    );

    // Save PDF
    doc.save(`receipt-${transaction.reference}.pdf`);
  };

  return <Button onClick={handleDownload}>Download Receipt (PDF)</Button>;
}