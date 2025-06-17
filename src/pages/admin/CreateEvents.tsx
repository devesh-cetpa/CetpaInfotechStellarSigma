import React, { useState, useEffect, useCallback } from "react";
import CreateEventFormAndTable from "./CreateEventFormAndTable";
import { environment } from "../../config";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

import { Button } from "../../components/ui/button";
import Loader from "@/components/ui/loader";

export interface EventData {
  id: number;
  title: string;
  theme: string;
  description: string;
  date: string;
  imagePath?: string;
  image?: string;
  isActive?: boolean;
}

const CreateEvents = () => {
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<EventData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null); // Changed to single file
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch events with error handling
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axiosInstance.get(
        `${environment.apiUrl}api/Event`
      );
      setEventsData(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset form state
  const resetForm = useCallback(() => {
    setFormData({});
    setImageFile(null);
    setIsModalOpen(false);
    setError(null);
  }, []);

  // Get image preview with cleanup
  const getImagePreview = useCallback(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    if (formData.imagePath) {
      return formData.imagePath;
    }
    return "";
  }, [imageFile, formData.imagePath]);

  // Handle form input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Handle image upload - single file only
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setImageFile(file);
    },
    []
  );

  // Validate form data
const validateForm = useCallback(
  (isUpdate = false) => {
    const { title, theme, description, date } = formData;

    if (!title?.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!theme?.trim()) {
      toast.error("Theme is required");
      return false;
    }
    if (!description?.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!date) {
      toast.error("Date is required");
      return false;
    }

    // For create operation, image is required
    if (!isUpdate && !imageFile) {
      toast.error("Image is required");
      return false;
    }

    // For update operation, image is optional if imagePath exists
    // (user can keep the existing image)
    return true;
  },
  [formData, imageFile]
);

  // Create FormData object
  const createFormData = useCallback(() => {
    const form = new FormData();
    form.append("Title", formData.title?.trim() || "");
    form.append("Theme", formData.theme?.trim() || "");
    form.append("Description", formData.description?.trim() || "");
    form.append("Date", formData.date || "");

    // Use "Image" (singular) to match API expectation
    if (imageFile) {
      form.append("Image", imageFile);
    }

    return form;
  }, [formData, imageFile]);

  // Create event with smart update
  const handleCreateEvent = useCallback(async () => {
    if (!validateForm(false) || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const form = createFormData();
      const { data } = await axiosInstance.post(
        `${environment.apiUrl}api/Event`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000, // 30 second timeout
        }
      );

      if (data?.data) {
        // Add timestamp to image path for cache busting
        const newEvent = {
          ...data.data,
          imagePath: data.data.imagePath
            ? `${data.data.imagePath}?t=${Date.now()}`
            : data.data.imagePath,
        };

        setEventsData((prev) => [newEvent, ...prev]); // Add to beginning for better UX
        resetForm();
        toast.success("Event created successfully!");
        
        // Reload the page after successful creation
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Small delay to show the success toast
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Create event error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.Image?.[0] ||
        "Error creating event";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, isSubmitting, createFormData, resetForm]);

  // Edit event
  const handleEditClick = useCallback((event: EventData) => {
    setFormData({ ...event });
    setImageFile(null);
    setError(null);
    setIsModalOpen(true);
  }, []);

  // Update event with smart update
  const handleUpdateEvent = useCallback(
    async (id: number) => {
      if (!validateForm(true) || isSubmitting) return;

      try {
        setIsSubmitting(true);
        setError(null);

        const form = createFormData();
        const { data } = await axiosInstance.put(
          `${environment.apiUrl}api/Event/${id}`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 30000,
          }
        );
if (imageFile) {
  form.append("Image", imageFile);
}
        if (data?.data) {
          // Add timestamp to image path for cache busting
          const updatedEvent = {
            ...data.data,
            imagePath: data.data.imagePath
              ? `${data.data.imagePath}?t=${Date.now()}`
              : data.data.imagePath,
          };

          setEventsData((prev) =>
            prev.map((event) => (event.id === id ? updatedEvent : event))
          );
          resetForm();
          toast.success("Event updated successfully!");
          
          // Reload the page after successful update
          setTimeout(() => {
            window.location.reload();
          }, 1500); // Small delay to show the success toast
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err: any) {
        console.error("Update event error:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.errors?.Image?.[0] ||
          "Error updating event";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, isSubmitting, createFormData, resetForm]
  );

  // Delete event with confirmation
  const handleDeleteEvent = useCallback(
    async (id: number) => {
      if (isSubmitting) return;

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (!confirmDelete) return;

      try {
        setIsSubmitting(true);
        setError(null);

        await axiosInstance.delete(`${environment.apiUrl}api/Event/${id}`, {
          timeout: 15000,
        });

        setEventsData((prev) => prev.filter((event) => event.id !== id));
        resetForm();
        toast.success("Event deleted successfully!");
      } catch (err: any) {
        console.error("Delete event error:", err);
        const errorMessage =
          err.response?.data?.message || "Error deleting event";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, resetForm]
  );

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid

      return `${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    setError(null);
    fetchEvents();
  }, [fetchEvents]);

  if (isLoading) {
    return <Loader />;
  }

  if (error && eventsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600">
        <p className="text-lg mb-4">{error}</p>
        <Button onClick={handleRetry} className="btn">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Events</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <CreateEventFormAndTable
        eventsData={eventsData}
        formData={formData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        handleCreateEvent={handleCreateEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        formatDate={formatDate}
        handleEditClick={handleEditClick}
        imagePreview={getImagePreview()}
        isSubmitting={isSubmitting}
        resetForm={resetForm}
      />
    </div>
  );
};

export default CreateEvents;