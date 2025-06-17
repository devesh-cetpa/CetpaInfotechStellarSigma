import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchMontlyReport } from '@/features/monthly/monthlySlice';
import { environment } from '@/config';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';


const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const getMonthLabel = (value: string) => months.find((m) => m.value === value)?.label || value;

const UserMonthlyReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const staticReports = useAppSelector((state) => state.monthly.events);
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);
  const [reportForms, setReportForms] = useState([{ year: '', month: '', comment: '', file: null as File | null }]);
  const [deletingReportId, setDeletingReportId] = useState<number | null>(null);
   const [numPages, setNumPages] = useState<number | null>(null);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    dispatch(fetchMontlyReport());
  }, [dispatch]);

  useEffect(() => {
    setReports(staticReports);
  }, [staticReports]);

  const addReportForm = () => {
    setReportForms([...reportForms, { year: '', month: '', comment: '', file: null }]);
  };

  const removeReportForm = (index: number) => {
    setReportForms(reportForms.filter((_, i) => i !== index));
  };

  const updateReportForm = (index: number, field: string, value: string | File | null) => {
    const updated = [...reportForms];
    (updated[index] as any)[field] = value;
    setReportForms(updated);
  };

  const createMonthlyReport = async (formData: FormData) => {
    const { data } = await axiosInstance.post(`${environment.apiUrl}api/SocietyMonthly`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  };

  const handleUploadReports = async () => {
    try {
      for (const form of reportForms) {
        if (form.year && form.month && form.file) {
          const formData = new FormData();
          formData.append('DocFile', form.file);
          formData.append('Year', form.year);
          formData.append('Month', form.month);
          formData.append('Comment', form.comment);
          formData.append('DocType', 'MonthlyReport');
          formData.append('DocPath', 'N/A');

          await createMonthlyReport(formData);
          toast.success('Report uploaded successfully!');
          dispatch(fetchMontlyReport());
        }
      }

      setIsModalOpen(false);
      setReportForms([{ year: '', month: '', comment: '', file: null }]);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleViewPdf = (url: string) => {
    setViewPdfUrl(url);
  };

  const closePdfViewer = () => {
    setViewPdfUrl(null);
    setNumPages(0); // Reset pages on close
  };

  const handleDeleteReport = async (id: number) => {
    if (deletingReportId === id) return;

    setDeletingReportId(id);
    try {
      const response = await axiosInstance.delete(`${environment.apiUrl}api/SocietyMonthly/${id}`);

      if (response.status === 200 || response.status === 204) {
        toast.success('Report deleted successfully!');
        dispatch(fetchMontlyReport());
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error deleting report:', error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Unknown server error';

        if (status === 404) {
          toast.error('Report not found. It may have already been deleted.');
          dispatch(fetchMontlyReport());
        } else if (status === 403) {
          toast.error("You don't have permission to delete this report.");
        } else if (status === 500) {
          toast.error('Server error occurred while deleting the report.');
        } else {
          toast.error(`Failed to delete report: ${message}`);
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('An unexpected error occurred while deleting the report.');
      }
    } finally {
      setDeletingReportId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Monthly Reports</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
          Upload Monthly Reports
        </Button>
      </div>

      <Table className="shadow-lg border rounded-xl bg-white">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{getMonthLabel(report.month)}</TableCell>
              <TableCell>{report.year}</TableCell>
              <TableCell>{report.comment}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  onClick={() => handleViewPdf(report.docPath)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
                >
                  View
                </Button>
                <Button
                  onClick={() => handleDeleteReport(report.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                  disabled={deletingReportId === report.id}
                >
                  {deletingReportId === report.id ? 'Deleting...' : 'Delete'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PDF Viewer Modal */}
      <Dialog open={!!viewPdfUrl} onOpenChange={closePdfViewer}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Monthly Report</DialogTitle>
          </DialogHeader>

    <iframe src={viewPdfUrl} width="100%" height="600px" />

        </DialogContent>
      </Dialog>

      {/* Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex justify-between items-center mb-2">
              <DialogTitle>Upload Monthly Reports</DialogTitle>
              <Button variant="outline" className="text-lg px-3 py-0" onClick={addReportForm}>
                +
              </Button>
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-2 max-h-[70vh] overflow-y-auto">
            {reportForms.map((form, index) => (
              <div key={index} className="border p-3 rounded mb-2 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">Report {index + 1}</span>
                  {reportForms.length > 1 && (
                    <button className="text-red-500 text-sm" onClick={() => removeReportForm(index)}>
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <Label htmlFor={`year-${index}`} className="text-right">
                    Year
                  </Label>
                  <select
                    id={`year-${index}`}
                    value={form.year}
                    onChange={(e) => updateReportForm(index, 'year', e.target.value)}
                    className="col-span-3 border rounded px-2 py-1"
                  >
                    <option value="">Select year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <Label htmlFor={`month-${index}`} className="text-right">
                    Month
                  </Label>
                  <select
                    id={`month-${index}`}
                    value={form.month}
                    onChange={(e) => updateReportForm(index, 'month', e.target.value)}
                    className="col-span-3 border rounded px-2 py-1"
                  >
                    <option value="">Select month</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <Label htmlFor={`comment-${index}`} className="text-right">
                    Comment
                  </Label>
                  <textarea
                    id={`comment-${index}`}
                    value={form.comment}
                    onChange={(e) => updateReportForm(index, 'comment', e.target.value)}
                    className="col-span-3 border rounded px-2 py-1"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`file-${index}`} className="text-right">
                    PDF
                  </Label>
                  <Input
                    id={`file-${index}`}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => updateReportForm(index, 'file', e.target.files?.[0] || null)}
                    className="col-span-3"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadReports}
              className="bg-green-600 hover:bg-green-700"
              disabled={reportForms.some((f) => !f.year || !f.month || !f.file)}
            >
              Upload All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default UserMonthlyReport;

