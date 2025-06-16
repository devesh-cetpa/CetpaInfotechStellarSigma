import React from "react"
import notice from "../JsonData/Notice.json"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { CalendarDays, PhoneCall, Paperclip } from "lucide-react"
import { jsPDF } from "jspdf";

const Notice = () => {
  // Handler to generate and open PDF
  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Set light blue background for the whole page
    doc.setFillColor(219, 234, 254); // Tailwind blue-100
    doc.rect(0, 0, 210, 297, "F"); // A4 size in mm

    // Header Bar
    doc.setFillColor(30, 58, 138); // blue-900
    doc.rect(0, 0, 210, 20, "F");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(notice.title, 12, 13);

    // Type Badge
    doc.setFillColor(239, 68, 68); // red-500
    doc.roundedRect(160, 6, 38, 10, 3, 3, "F");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(notice.type, 179, 13, { align: "center" });

    // Date (top right)
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text(`Date: ${new Date(notice.issued_on).toLocaleDateString()}`, 198, 25, { align: "right" });

    // Subject
    let y = 35;
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 138);
    doc.setFont("helvetica", "bold");
    doc.text("Subject:", 12, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(34, 34, 59);
    doc.text(notice.title, 35, y);

    // Salutation
    y += 12;
    doc.setFontSize(12);
    doc.setTextColor(34, 34, 59);
    doc.text("Dear Residents,", 12, y);

    // Body
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 59);
    const bodyLines = doc.splitTextToSize(notice.description, 180);
    doc.text(bodyLines, 12, y);
    y += bodyLines.length * 7 + 2;

    // Details Section
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text("Details:", 12, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.setTextColor(34, 34, 59);
    doc.text(`Date: ${notice.details.date}`, 18, y);
    doc.text(`Time: ${notice.details.time}`, 70, y);
    doc.text(`Affected Blocks: ${notice.details.affected_blocks.join(", ")}`, 120, y);

    // Additional Info
    if (notice.additional_info) {
      y += 12;
      doc.setFont("helvetica", "italic");
      doc.setTextColor(37, 99, 235);
      const infoLines = doc.splitTextToSize(notice.additional_info, 180);
      doc.text(infoLines, 12, y);
      y += infoLines.length * 7;
      doc.setFont("helvetica", "normal");
    }

    // Contact
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 59);
    doc.text("For any queries, please contact:", 12, y);
    y += 7;
    doc.setTextColor(30, 64, 175);
    doc.text(`${notice.contact.name} – ${notice.contact.phone}`, 12, y);

    // Signature
    y += 25;
    doc.setDrawColor(200, 200, 200);
    doc.line(140, y, 198, y); // signature line
    y += 5;
    doc.setFontSize(12);
    doc.setTextColor(34, 34, 59);
    doc.text(notice.authorized_by.role, 198, y, { align: "right" });
    y += 7;
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 138);
    doc.text(notice.authorized_by.name, 198, y, { align: "right" });

    // Open PDF in new tab
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex items-center justify-center py-25">
      <div className="relative w-full max-w-3xl">
        <Card className="rounded-3xl border-0 shadow-2xl bg-white/80 backdrop-blur-lg">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-blue-100/80 to-blue-50/80 rounded-t-3xl p-8 border-b border-blue-100">
            <CardTitle className="text-3xl font-extrabold flex items-center gap-4 text-blue-900 drop-shadow">
              <span className="text-4xl animate-bounce">{notice.icon}</span>
              {notice.title}
            </CardTitle>
            <Badge variant="destructive" className="mt-6 sm:mt-0 text-lg px-6 py-2 rounded-full shadow bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold tracking-wide">
              {notice.type}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-8 text-base text-gray-800 p-8">
            {/* Letter Header */}
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2 text-blue-700 font-semibold text-lg">
                <CalendarDays className="w-5 h-5" />
                <span>
                  {new Date(notice.issued_on).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <span className="block font-bold text-lg text-blue-900 mb-2">Subject:</span>
              <span className="block text-xl font-semibold text-gray-700 mb-4">{notice.title}</span>
            </div>

            {/* Salutation */}
            <div className="mb-2">
              <span className="block">Dear Residents,</span>
            </div>

            {/* Body */}
            <div className="mb-2">
              <p className="text-base text-gray-800 mb-4">{notice.description}</p>
              <ul className="list-none pl-0 space-y-2 mb-4">
                <li>
                  <span className="font-semibold text-blue-700">📅 Date:</span>{" "}
                  <span className="bg-blue-100 px-3 py-1 rounded-lg">{notice.details.date}</span>
                </li>
                <li>
                  <span className="font-semibold text-blue-700">⏰ Time:</span>{" "}
                  <span className="bg-blue-100 px-3 py-1 rounded-lg">{notice.details.time}</span>
                </li>
                <li>
                  <span className="font-semibold text-blue-700">🏢 Affected Blocks:</span>{" "}
                  <span className="bg-blue-100 px-3 py-1 rounded-lg">{notice.details.affected_blocks.join(", ")}</span>
                </li>
              </ul>
              {notice.additional_info && (
                <p className="italic text-blue-900/80 bg-blue-50/60 rounded-lg p-3">{notice.additional_info}</p>
              )}
            </div>

            {/* Closing */}
            <div className="mb-2">
              <span>For any queries, please contact:</span>
              <div className="flex items-center space-x-2 mt-1 text-blue-800">
                <PhoneCall className="w-5 h-5" />
                <span className="font-semibold">{notice.contact.name}</span>
                <span>– {notice.contact.phone}</span>
              </div>
            </div>

            {/* Signature */}
            <div className="flex flex-col items-end mt-8">
              <span className="font-semibold">{notice.authorized_by.role}</span>
              <span className="text-blue-900 font-bold">{notice.authorized_by.name}</span>
            </div>

            <Separator className="bg-blue-200" />

            {/* Download/View PDF at the bottom */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleDownloadPdf}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold shadow-xl transition flex items-center gap-2 text-lg border-2 border-blue-300"
              >
                <Paperclip className="w-6 h-6" />
                Download / View Notice PDF
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Notice
