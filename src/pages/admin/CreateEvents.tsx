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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, ImageIcon, Eye } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { environment } from "../../config";
import { useAppSelector } from "@/app/hooks";

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


function AddImagesModal({
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
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSave = useCallback(() => {
    onSave(files);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    fileInputRef.current && (fileInputRef.current.value = "");
  }, [files, previews, onSave]);

  const handleClose = useCallback(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    fileInputRef.current && (fileInputRef.current.value = "");
    onClose();
  }, [previews, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Upload Images</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Choose multiple images for this event. You can preview and remove them before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-images">Images</Label>
            <Input
              id="event-images"
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="cursor-pointer border-dashed border-2 border-gray-300 hover:border-blue-500 transition duration-200"
            />
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {previews[index] ? (
                      <OptimizedImage
                        src={previews[index]}
                        alt={file.name}
                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p
                    className="text-xs text-center p-1 truncate text-muted-foreground"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
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
                <Plus className="w-4 h-4" />
                Add {files.length} Image{files.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




const CreateEvents: React.FC = () => {
  const [formData, setFormData] = useState<Partial<EventData>>({
    title: "",
    theme: "",
    description: "",
    date: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  const events = useAppSelector(state => state.event.events);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFormData((prev) => ({ ...prev, image: file }));
      }
    },
    []
  );

  const formatDate = useCallback((dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const handleCreateEvent = useCallback(async () => {
    if (!formData.title || !formData.theme || !formData.description || !formData.date) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Title", formData.title || "");
      formDataToSend.append("Theme", formData.theme || "");
      formDataToSend.append("Description", formData.description || "");
      formDataToSend.append("Date", formData.date || "");

      if (formData.image instanceof File) {
        formDataToSend.append("Image", formData.image);
      }

      const response = await axiosInstance.post(
        `${environment.apiUrl}api/Events`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setIsModalOpen(false);
        setFormData({
          title: "",
          theme: "",
          description: "",
          date: "",
        });
        setImagePreview("");
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

const handleUpdateEvent = useCallback(
  async (eventId: number) => {
    if (!formData.title || !formData.theme || !formData.description || !formData.date) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("Theme", formData.theme);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Date", formData.date);

      // Only append image if a new one was selected
      if (formData.image instanceof File) {
        formDataToSend.append("Image", formData.image);
      }

       await axiosInstance.put(
        `${environment.apiUrl}api/Events/${eventId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form and close modal
      setIsModalOpen(false);
      resetForm();
      
      // Show success message
      alert("Event updated successfully!");
    } catch (error: any) {
      console.error("Error updating event:", error);
      alert(`Failed to update event: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  },
  [formData]
);


 const handleDeleteEvent = useCallback(
  async (eventId: number) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.delete(`${environment.apiUrl}api/Events/${eventId}`);
      alert("Event deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting event:", error);
      alert(`Failed to delete event: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  },
  []
);

  const handleEditClick = useCallback((event: EventData) => {
    setFormData({
      title: event.title,
      theme: event.theme,
      description: event.description,
      date: event.date,
      imagePath: event.imagePath || event.image,
    });
    if (event.imagePath || event.image) {
      setImagePreview(event.imagePath || event.image);
    }
    setIsModalOpen(true);
    setEditingEventId(event.id);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      theme: "",
      description: "",
      date: "",
    });
    setImagePreview("");
  }, []);

  const isEditMode = useMemo(() => editingEventId !== null, [editingEventId]);

  const openUpdateModal = useCallback(
    (event: EventData) => {
      handleEditClick(event);
      setEditingEventId(event.id);
    },
    [handleEditClick]
  );

  const openCreateModal = useCallback(() => {
    resetForm();
    setEditingEventId(null);
    setIsModalOpen(true);
  }, [resetForm]);

  const handleAddMoreImages = useCallback((eventId: number) => {
    setSelectedEventId(eventId);
    setAddImagesModalOpen(true);
  }, []);

  const fetchEventImages = useCallback(
    async (eventId: number) => {
      if (imageLoadingStates[eventId] || eventImages[eventId]?.length > 0) {
        return;
      }

      try {
        setImageLoadingStates((prev) => ({ ...prev, [eventId]: true }));

        const res = await axiosInstance.get(
          `${environment.apiUrl}api/EventsPic/ByEvent/${eventId}`,
          { timeout: 10000 } 
        );

        if (res.data?.data && Array.isArray(res.data.data)) {
          setEventImages((prev) => ({
            ...prev,
            [eventId]: res.data.data,
          }));
        }
      } catch (err) {
        console.warn(`Failed to fetch images for event ${eventId}:`, err);
      } finally {
        setImageLoadingStates((prev) => ({ ...prev, [eventId]: false }));
      }
    },
    [eventImages, imageLoadingStates]
  );

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;

    if (editingEventId) {
      handleUpdateEvent(editingEventId);
    } else {
      handleCreateEvent();
    }
    setEditingEventId(null);
  }, [editingEventId, handleUpdateEvent, handleCreateEvent, isSubmitting]);

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

  const getImageSource = useCallback(
    (event: EventData) => {
      const images = eventImages[event.id];
      if (images && images.length > 0) {
        const firstImage = images[0];
        return firstImage.partyPic || firstImage.imageUrl || "/placeholder.jpg";
      }

      if (event.imagePath) {
        return event.imagePath;
      }

      if (event.image && event.image !== "/placeholder.jpg") {
        return event.image;
      }

      return "/placeholder.jpg";
    },
    [eventImages]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingEventId(null);
  }, []);

  useEffect(() => {
    if (events?.length > 0) {
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
          rootMargin: "50px",
        }
      );

      const tableRows = document.querySelectorAll("[data-event-id]");
      tableRows.forEach((row) => observer.observe(row));

      return () => observer.disconnect();
    }
  }, [events, fetchEventImages, eventImages, imageLoadingStates]);

  useEffect(() => {
    return () => {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 shadow-md rounded-lg flex items-center gap-2 transition-colors"
          onClick={openCreateModal}
          disabled={isSubmitting}
        >
          <Plus size={16} />
          Create Event
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white">
        <Table>
          <TableCaption className="text-lg font-semibold text-blue-700 py-4">
            List of Community Events and Celebrations
          </TableCaption>
          <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <TableRow>
              <TableHead className="w-32 text-gray-700 uppercase tracking-wider">
                Image
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider">
                Event Title
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider">
                Theme
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider">
                Description
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="text-gray-700 uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.length > 0 ? (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  data-event-id={event.id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <TableCell>
                    <div className="flex justify-center">
                      <OptimizedImage
                        src={getImageSource(event)}
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-xs truncate" title={event.title}>
                      {event.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-3 py-1 text-xs font-medium  text-blue-800 ">
                      {event.theme.substring(0,30)}...
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={event.description}>
                      {event.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">
                      {formatDate(event.date)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => openUpdateModal(event)}
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        onClick={() =>
                          handleDeleteWithConfirmation(event.id, event.title)
                        }
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        onClick={() => handleAddMoreImages(event.id)}
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-300 hover:bg-green-50"
                        title="Add Images"
                      >
                        <ImageIcon size={16} />
                      </Button>
                      <Button
                        onClick={() => showAttachments(event.id)}
                        variant="outline"
                        size="sm"
                        className="text-purple-600 border-purple-300 hover:bg-purple-50"
                        title="View Images"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <ImageIcon size={48} className="text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">
                      No events found
                    </p>
                    <Button
                      onClick={openCreateModal}
                      className="mt-2"
                      variant="outline"
                    >
                      Create Your First Event
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Update Event Modal */}
    {/* Create/Update Event Modal */}
<Dialog open={isModalOpen} onOpenChange={closeModal}>
  <DialogContent className="sm:max-w-[600px] p-4"> {/* Reduced padding here */}
    <DialogHeader className="px-2"> {/* Reduced padding here */}
      <DialogTitle>
        {isEditMode ? "Update Event" : "Create New Event"}
      </DialogTitle>
      <DialogDescription>
        {isEditMode
          ? "Update the details of this event"
          : "Fill in the details to create a new event"}
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-3 px-2"> {/* Reduced spacing and padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Two-column layout on larger screens */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            placeholder="Event title"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Theme *</Label>
          <Input
            id="theme"
            name="theme"
            value={formData.theme || ""}
            onChange={handleInputChange}
            placeholder="Event theme"
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Two-column layout */}
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date || ""}
            onChange={handleInputChange}
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image {!isEditMode && "*"}</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Event description"
          className="w-full"
          rows={4}
          required
        />
      </div>

      {imagePreview && (
        <div className="space-y-2">
          <Label>Preview:</Label>
          <div className="mt-1">
            <OptimizedImage
              src={imagePreview}
              alt="Event preview"
              className="w-32 h-32 object-cover rounded-md border border-gray-200"
            />
          </div>
        </div>
      )}
    </div>
    <DialogFooter className="px-2"> {/* Reduced padding here */}
      <Button variant="outline" onClick={closeModal}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="min-w-[120px]"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {isEditMode ? "Updating..." : "Creating..."}
          </div>
        ) : isEditMode ? (
          "Update Event"
        ) : (
          "Create Event"
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Add Images Modal */}
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

      {/* Attachments Modal */}
      <Dialog
        open={attachmentsModalOpen}
        onOpenChange={setAttachmentsModalOpen}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Attachments</DialogTitle>
            <DialogDescription>
              View all images attached to this event
            </DialogDescription>
          </DialogHeader>
          {loadingAttachments ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : attachmentsImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No attachments found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {attachmentsImages.map((img) => (
                <div key={img.id} className="relative group">
                  <OptimizedImage
                    src={img.partyPic || img.imageUrl}
                    alt={`Event attachment ${img.id}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white bg-black bg-opacity-50 hover:bg-opacity-70"
                      onClick={() =>
                        window.open(img.partyPic || img.imageUrl, "_blank")
                      }
                    >
                      <Eye size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEvents;