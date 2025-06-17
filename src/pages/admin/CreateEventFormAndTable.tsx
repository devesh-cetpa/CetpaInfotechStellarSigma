import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, ImageIcon, Eye, RefreshCw } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { environment } from "@/config";
import Loader from "@/components/ui/loader";

interface EventData {
  id: number;
  title: string;
  theme: string;
  image: string;
  imagePath?: string;
  images?: string[];
  description: string;
  date: string;
  isActive?: boolean;
}

interface EventImage {
  id: number;
  eventId: number;
  imageUrl: string;
  partyPic: string;
}

interface CreateEventFormAndTableProps {
  eventsData: EventData[];
  formData: Partial<EventData>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  setFormData: (data: Partial<EventData>) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateEvent: () => void;
  handleUpdateEvent: (id: number) => void;
  handleDeleteEvent: (id: number) => void;
  formatDate: (dateString: string) => string;
  handleEditClick: (event: EventData) => void;
  imagePreview: string;
  isSubmitting?: boolean;
  resetForm?: () => void;
  refreshData?: () => void; // Added refreshData prop
}

// Optimized Image Component with loading states
const OptimizedImage = React.memo(
  ({
    src,
    alt,
    className = "",
    onError,
    ...props
  }: {
    src: string;
    alt: string;
    className?: string;
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    [key: string]: any;
  }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    useEffect(() => {
      setCurrentSrc(src);
      setLoading(true);
      setError(false);
    }, [src]);

    const handleLoad = useCallback(() => {
      setLoading(false);
    }, []);

    const handleError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setLoading(false);
        setError(true);
        if (!currentSrc.includes("placeholder.jpg")) {
          setCurrentSrc("/placeholder.jpg");
        }
        onError?.(e);
      },
      [currentSrc, onError]
    );

    return (
      <div className={`relative ${className}`}>
        {loading && !error && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} ${
            loading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-200`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      </div>
    );
  }
);

const CreateEventFormAndTable: React.FC<CreateEventFormAndTableProps> = ({
  eventsData,
  formData,
  isModalOpen,
  setIsModalOpen,
  setFormData,
  handleInputChange,
  handleImageUpload,
  handleCreateEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  formatDate,
  handleEditClick,
  imagePreview,
  isSubmitting = false,
  resetForm,
  refreshData, // Added refreshData prop
}) => {
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [addImagesModalOpen, setAddImagesModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [eventImages, setEventImages] = useState<{
    [eventId: number]: EventImage[];
  }>({});
  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
  const [attachmentsImages, setAttachmentsImages] = useState<EventImage[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [eventId: number]: boolean;
  }>({});
 

  // Memoized values for performance
  const isEditMode = useMemo(() => editingEventId !== null, [editingEventId]);
  const currentEvent = useMemo(
    () => eventsData.find((event) => event.id === editingEventId),
    [eventsData, editingEventId]
  );

  // Preload images for better performance
  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = src;
    });
  }, []);

  // Open modal for update and set form data
  const openUpdateModal = useCallback(
    (event: EventData) => {
      setFormData(event); // set form data for editing
      setIsModalOpen(true);
      setEditingEventId(event.id);
      if (event.image) {
        setImagePreview(event.image); // <-- set preview to existing image
      } else {
        setImagePreview(""); // clear if no image
      }
    },
    [setFormData, setIsModalOpen, setEditingEventId]
  );

  // Open modal for create
  const openCreateModal = useCallback(() => {
    if (resetForm) {
      resetForm();
    } else {
      setFormData({
        title: "",
        theme: "",
        description: "",
        date: "",
      });
    }
    setEditingEventId(null);
    setIsModalOpen(true);
  }, [setFormData, setIsModalOpen, resetForm]);

  // Open modal for adding images
  const handleAddMoreImages = useCallback((eventId: number) => {
    setSelectedEventId(eventId);
    setAddImagesModalOpen(true);
  }, []);

  // Optimized fetch event images with caching
  const fetchEventImages = useCallback(
    async (eventId: number) => {
      // Skip if already loading or has images
      if (imageLoadingStates[eventId] || eventImages[eventId]?.length > 0) {
        return;
      }

      try {
        setImageLoadingStates((prev) => ({ ...prev, [eventId]: true }));

        const res = await axiosInstance.get(
          `${environment.apiUrl}api/EventsPic/ByEvent/${eventId}`,
          { timeout: 10000 } // 10 second timeout
        );

        if (res.data?.data && Array.isArray(res.data.data)) {
          setEventImages((prev) => ({
            ...prev,
            [eventId]: res.data.data,
          }));

          // Preload first image for better UX
          if (res.data.data.length > 0) {
            const firstImage = res.data.data[0];
            const imgSrc = firstImage.partyPic || firstImage.imageUrl;
            if (imgSrc) {
              preloadImage(imgSrc).catch(() => {
                // Ignore preload errors
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch images for event ${eventId}:`, err);
      } finally {
        setImageLoadingStates((prev) => ({ ...prev, [eventId]: false }));
      }
    },
    [eventImages, imageLoadingStates, preloadImage]
  );

  // Handle submit (create or update)
  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;

    if (editingEventId) {
      handleUpdateEvent(editingEventId);
    } else {
      handleCreateEvent();
    }
    setEditingEventId(null);
  }, [editingEventId, handleUpdateEvent, handleCreateEvent, isSubmitting]);

  // Show attachments modal
  const showAttachments = useCallback(async (eventId: number) => {
    setLoadingAttachments(true);
    setAttachmentsModalOpen(true);

    try {
      const response = await axiosInstance.get(
        `${environment.apiUrl}api/EventsPic/ByEvent/${eventId}`,
        { timeout: 15000 }
      );
      setAttachmentsImages(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch attachments:", error);
      setAttachmentsImages([]);
    } finally {
      setLoadingAttachments(false);
    }
  }, []);

  // Handle delete with confirmation
  const handleDeleteWithConfirmation = useCallback(
    (eventId: number, eventTitle: string) => {
      if (isSubmitting) return;

      const confirmed = window.confirm(
        `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`
      );

      if (confirmed) {
        handleDeleteEvent(eventId);
      }
    },
    [handleDeleteEvent, isSubmitting]
  );

  // Optimized image source getter with fallback
  const getImageSource = useCallback(
    (event: EventData) => {
      // Priority: fetched images > imagePath > image > placeholder
      const images = eventImages[event.id];
      if (images && images.length > 0) {
        const firstImage = images[0];
        return firstImage.partyPic || firstImage.imageUrl || "/placeholder.jpg";
      }

      // Use imagePath if available (for newly created/updated events)
      if (event.imagePath) {
        return event.imagePath;
      }

      // Fallback to image field
      if (event.image && event.image !== "/placeholder.jpg") {
        return event.image;
      }

      return "/placeholder.jpg";
    },
    [eventImages]
  );

  // Close modal handler
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingEventId(null);
  }, [setIsModalOpen]);

  // Fetch images for visible events only (lazy loading)
  useEffect(() => {
    if (eventsData?.length > 0) {
      // Use intersection observer for better performance
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const eventId = parseInt(
                entry.target.getAttribute("data-event-id") || "0"
              );
              if (
                eventId &&
                !eventImages[eventId] &&
                !imageLoadingStates[eventId]
              ) {
                fetchEventImages(eventId);
              }
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "50px", // Load images 50px before they come into view
        }
      );

      // Observe all table rows
      const tableRows = document.querySelectorAll("[data-event-id]");
      tableRows.forEach((row) => observer.observe(row));

      return () => observer.disconnect();
    }
  }, [eventsData, fetchEventImages, eventImages, imageLoadingStates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any object URLs if needed
      Object.values(eventImages)
        .flat()
        .forEach((img) => {
          if (img.imageUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(img.imageUrl);
          }
        });
    };
  }, [eventImages]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button
          className="bg-blue-600  hover:bg-blue-700 shadow-md rounded flex items-center gap-2 transition-colors"
          title="Create Event"
          onClick={openCreateModal}
          disabled={isSubmitting}
        >
          <Plus size={16} />
          Create Event
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white">
        <Table>
          <TableCaption className="text-lg font-semibold text-blue-700 py-4 text-center">
            Community Events and Celebrations
          </TableCaption>
          <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-32 text-gray-700 uppercase tracking-wider text-center">
                Image
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider text-center">
                Event Title
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider text-center">
                Theme
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider text-center">
                Event Details
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider text-center">
                Date
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventsData?.length > 0 ? (
              eventsData.map((event) => (
                <TableRow
                  key={event.id}
                  data-event-id={event.id}
                  className="transition-colors duration-200 hover:bg-blue-50"
                >
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <OptimizedImage
                        src={getImageSource(event)}
                        alt={event.title}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-800 text-center">
                    <div className="max-w-xs truncate" title={event.title}>
                      {event.title.substring(0, 30)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {event.theme.substring(0, 30)}...
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs text-center">
                    <div className="truncate" title={event.description}>
                      <p className="text-sm text-gray-600">
                        {event.description?.length > 50
                          ? `${event.description.substring(0, 30)}...`
                          : event.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-center">
                    <span className="font-medium text-gray-700">
                      {formatDate(event.date)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      <Button
                        onClick={() => openUpdateModal(event)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 transition-colors"
                        title="Update Event"
                        disabled={isSubmitting}
                        size="sm"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        onClick={() =>
                          handleDeleteWithConfirmation(event.id, event.title)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white p-2 transition-colors"
                        title="Delete Event"
                        disabled={isSubmitting}
                        size="sm"
                      >
                        <Trash2 size={14} />
                      </Button>
                      <Button
                        onClick={() => handleAddMoreImages(event.id)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 transition-colors"
                        title="Add More Images"
                        disabled={isSubmitting}
                        size="sm"
                      >
                        <ImageIcon size={14} />
                      </Button>
                      <Button
                        onClick={() => showAttachments(event.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 transition-colors"
                        title="View Attachments"
                        disabled={isSubmitting}
                        size="sm"
                      >
                        <Eye size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <ImageIcon size={48} className="text-gray-300" />
                    <p className="text-lg">No events found</p>
                    <p className="text-sm">
                      Create your first event to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal for Create/Update */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Update Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to{" "}
              {isEditMode ? "update the existing" : "create a new"} event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium">
                Event Title *
              </Label>
              <div className="col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme" className="text-right font-medium">
                Theme *
              </Label>
              <div className="col-span-3">
                <Input
                  id="theme"
                  name="theme"
                  value={formData.theme || ""}
                  onChange={handleInputChange}
                  placeholder="Enter event theme"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right font-medium">
                Image Upload {!isEditMode && "*"}
              </Label>
              <div className="col-span-3">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            {imagePreview && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Preview</Label>
                <div className="col-span-3">
                  <OptimizedImage
                    src={imagePreview}
                    alt="Event Preview"
                    className="w-24 h-24 object-cover rounded-md border border-gray-200 shadow-sm"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right font-medium">
                Description *
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right font-medium">
                Date *
              </Label>
              <div className="col-span-3">
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center gap-2 transition-colors ${
                isEditMode
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEditMode ? (
                <Pencil size={16} />
              ) : (
                <Plus size={16} />
              )}
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for adding more images */}
      <AddImagesModal
        isOpen={addImagesModalOpen}
        onClose={() => setAddImagesModalOpen(false)}
        onSave={async (files) => {
          if (files.length === 0 || !selectedEventId) return;

          setUploading(true);
          const form = new FormData();
          files.forEach((file) => form.append("PartyPics", file));
          form.append("eventId", selectedEventId.toString());

          try {
            await axiosInstance.post(
              `${environment.apiUrl}api/EventsPic`,
              form,
              {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 30000,
              }
            );
            setAddImagesModalOpen(false);
            // Clear cache and refetch
            setEventImages((prev) => {
              const updated = { ...prev };
              delete updated[selectedEventId];
              return updated;
            });
            await fetchEventImages(selectedEventId);
          } catch (err: any) {
            const apiMsg =
              err?.response?.data?.title ||
              err?.response?.data?.message ||
              err?.message ||
              "Failed to upload images.";
            alert(apiMsg);
          } finally {
            setUploading(false);
          }
        }}
        uploading={uploading}
      />

      {/* Modal for showing attachments */}
      <Dialog
        open={attachmentsModalOpen}
        onOpenChange={setAttachmentsModalOpen}
      >
        <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Attachments</DialogTitle>
            <DialogDescription>
              All images attached to this event.
            </DialogDescription>
          </DialogHeader>
          {loadingAttachments ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : attachmentsImages.length === 0 ? (
            <div className="text-gray-500 text-center py-12">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No attachments found for this event.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {attachmentsImages.map((img) => (
                <div key={img.id} className="relative group">
                  <OptimizedImage
                    src={img.partyPic || img.imageUrl}
                    alt={`Attachment ${img.id}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEventFormAndTable;

// Separate component for adding images
export function AddImagesModal({
  isOpen,
  onClose,
  onSave,
  uploading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (files: File[]) => void;
  uploading?: boolean;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);

      // Filter only image files
      const imageFiles = selectedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length !== selectedFiles.length) {
        alert("Only image files are allowed");
      }

      setFiles((prev) => [...prev, ...imageFiles]);

      const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSave = useCallback(() => {
    onSave(files);
    // Clear the state after saving
    previews.forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setFiles([]);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [files, previews, onSave]);

  const handleClose = useCallback(() => {
    // Cleanup previews
    previews.forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setFiles([]);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  }, [previews, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add More Images</DialogTitle>
          <DialogDescription>
            Select multiple images to upload for this event.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full space-y-4">
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                     file:text-sm file:font-semibold file:bg-primary 
                     file:text-primary-foreground hover:file:bg-primary/90"
          />

          {files.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg border p-2 space-y-2"
                >
                  <div className="aspect-square rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                    {previews[index] ? (
                      <OptimizedImage
                        src={previews[index]}
                        alt={file.name}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <p
                    className="text-sm text-muted-foreground truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={files.length === 0 || uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add {files.length} Image{files.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}