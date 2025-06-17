import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { environment } from "@/config";
import axiosInstance from "@/services/axiosInstance";
import Loader from "@/components/ui/loader";
// import { PdfJs } from "@react-pdf-viewer/core";
import PdfViewer from "@/components/common/PdfViewer";

interface MonthlyReportData {
  id: number;
  year: number;
  month: string;
  comment: string;
  docType: string;
  docPath: string;
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const getMonthLabel = (value: string) => {
  const found = months.find((m) => m.value === value);
  return found ? found.label : "";
};

const currentYear = new Date().getFullYear();
const years = [];
for (let i=currentYear; i>=currentYear-10; i--) {
  years.push(i);
}

const MonthlyReport: React.FC = () => {
  const [allReports, setAllReports] = useState<MonthlyReportData[]>([]);
  const [filteredReports, setFilteredReports] = useState<MonthlyReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<MonthlyReportData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showPdf, setShowPdf] = useState<boolean>(false);

  const fetchAllReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${environment.apiUrl}api/SocietyMonthly`;
      const response = await axiosInstance.get(url);
      const reportsData = response.data.data;

      if (Array.isArray(reportsData)) {
        setAllReports(reportsData);
        setFilteredReports(reportsData);
      } else if (reportsData) {
        setAllReports([reportsData]);
        setFilteredReports([reportsData]);
      } else {
        setAllReports([]);
        setFilteredReports([]);
      }
    } catch (err: any) {
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = allReports;

    if (selectedYear) {
      filtered = filtered.filter((report) => report.year === parseInt(selectedYear));
    }

    if (selectedMonth) {
      filtered = filtered.filter((report) => report.month === selectedMonth);
    }

    setFilteredReports(filtered);
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [selectedYear, selectedMonth, allReports]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleViewPdf = (report: MonthlyReportData) => {
    setSelectedReport(report);
    // Reset any previous errors
    setError(null);
    // Check if the docPath is a full URL or a relative path
    const pdfUrl = report.docPath.startsWith('http') 
      ? report.docPath 
      : `${environment.apiUrl}${report.docPath.startsWith('/') ? report.docPath.substring(1) : report.docPath}`;
    console.log("Loading PDF from URL:", pdfUrl);
    setViewPdfUrl(pdfUrl);
    setShowPdf(true);
  };

  const closePdfViewer = () => {
    setViewPdfUrl(null);
    setSelectedReport(null);
    setShowPdf(false);
    setError(null);
  };

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Monthly Reports</h1>

      <div className="flex items-center gap-4 my-4 flex-wrap">
        <Label htmlFor="year">Filter by Year:</Label>
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[190px]" id="year">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label htmlFor="month">Filter by Month:</Label>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[190px]" id="month">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(selectedYear || selectedMonth) && (
          <Button variant="outline" onClick={clearFilters} className="ml-2">
            Clear Filters
          </Button>
        )}
      </div>

      {(selectedYear || selectedMonth) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            Showing reports for: {selectedYear && `Year ${selectedYear}`}
            {selectedYear && selectedMonth && " - "}
            {selectedMonth && getMonthLabel(selectedMonth)}
            <span className="ml-2 font-medium">
              ({filteredReports.length} reports found)
            </span>
          </p>
        </div>
      )}

      {loading && <Loader />}
      {error && <div className="text-red-500">{error}</div>}

      <Table className="shadow-lg rounded-xl overflow-hidden border border-gray-200 bg-white">
        <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports && filteredReports.length > 0 ? (
            filteredReports.map((report: MonthlyReportData) => (
              <TableRow key={report.id}>
                <TableCell>{getMonthLabel(report.month)}</TableCell>
                <TableCell>{report.year}</TableCell>
                <TableCell>{report.comment}</TableCell>
                <TableCell>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleViewPdf(report)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                {selectedYear || selectedMonth
                  ? "No reports found for the selected filters."
                  : "No monthly reports found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={showPdf} onOpenChange={closePdfViewer}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedReport
                ? `${getMonthLabel(selectedReport.month)} ${selectedReport.year} Report`
                : "View Report"}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full h-[75vh] overflow-auto">
            {selectedReport && viewPdfUrl && (
              <div className="flex flex-col items-center">
                {!error ? (
                  <>
                    <iframe
                      src={viewPdfUrl}
                      width="100%"
                      height="100%"
                      title="PDF Viewer"
                      style={{ border: "none" }}
                    ></iframe>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-red-500">
                    <span>{error}</span>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">PDF URL: {viewPdfUrl}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthlyReport;
