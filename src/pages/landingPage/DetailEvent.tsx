import { useEffect, useState } from "react";
import {
  Calendar,
  Tag,
  AlertCircle,
  ArrowLeft,
  Image,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axiosInstance from "@/services/axiosInstance";
import { environment } from "@/config";
import Loader from "@/components/ui/loader";

interface EventDetails {
  id: number;
  title: string;
  theme: string;
  description: string;
  date: string;
  imagePath: string;
  isActive: boolean;
}

interface EventImage {
  id: number;
  eventId: number;
  partyPic: string;
  caption?: string;
  createdAt?: string;
  isActive: boolean;
}

const DetailEvent = () => {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [galleryImages, setGalleryImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch event details
        const eventResponse = await axiosInstance.get(
          `${environment.apiUrl}api/Event/${id}`
        );
        if (eventResponse.data.statusCode === 200) {
          setEventDetails(eventResponse.data.data);
        }

        // Fetch gallery images
        const galleryResponse = await axiosInstance.get(
          `${environment.apiUrl}api/EventsPic`
        );
        if (galleryResponse.data.statusCode === 200) {
          const filteredImages = galleryResponse.data.data.filter(
            (img: EventImage) => img.eventId === parseInt(id) && img.isActive
          );
          setGalleryImages(filteredImages);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to load data");
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openImageModal = (image: EventImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex =
      currentImageIndex === 0
        ? galleryImages.length - 1
        : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !eventDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              {error || "Event not found"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans py-20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex max-w-6xl mx-auto px-4 py-4 items-center justify-between">
          <h1 className="text-3xl font-bold">Event Details</h1>
            <Button
            variant="destructive"
            onClick={() => navigate(-1)}
            className="ml-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Event Details Card */}
        <Card>
          <div className="relative h-64 md:h-80">
            <img
              src={eventDetails.imagePath}
              alt={eventDetails.title}
              className="w-full h-full object-cover rounded-t-lg"
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-6">{eventDetails.title}</h2>

            <div className="space-y-6 mb-8">
              {/* Date Section */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Date
                  </p>
                  <p className="font-bold text-lg">
                    {formatDate(eventDetails.date)}
                  </p>
                </div>
              </div>

              {/* Theme Section - Fixed Layout */}
              <div className="flex items-start space-x-3">
                <div className="p-3 bg-secondary rounded-lg flex-shrink-0">
                  <Tag className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Theme
                  </p>
                  <div className="bg-secondary/30 rounded-lg p-3 border border-secondary/40">
                    <p className="text-sm font-semibold text-secondary-foreground capitalize leading-relaxed">
                      {eventDetails.theme}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">About This Event</h3>
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <p className="leading-relaxed">
                    {eventDetails.description ||
                      "No description available for this event."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Event Gallery</CardTitle>
              <Badge variant="outline">{galleryImages.length} Photos</Badge>
            </div>
          </CardHeader>

          <CardContent>
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image, index) => (
                  <Dialog key={image.id}>
                    <DialogTrigger asChild>
                      <div
                        className="group relative bg-muted rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => openImageModal(image, index)}
                      >
                        <div className="aspect-video relative">
                          <img
                            src={image.partyPic}
                            alt={image.caption || `Event image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        </div>
                        {image.caption && (
                          <div className="p-4">
                            <p className="font-medium text-sm">
                              {image.caption}
                            </p>
                            {image.createdAt && (
                              <p className="text-muted-foreground text-xs mt-1">
                                {new Date(image.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </DialogTrigger>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No gallery images available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-white/80 z-10"
            >
              <X className="h-8 w-8" />
            </Button>

            <img
              src={selectedImage.partyPic}
              alt={selectedImage.caption || "Event image"}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-4 rounded-b-lg">
                <p className="text-lg font-medium">{selectedImage.caption}</p>
                {selectedImage.createdAt && (
                  <p className="text-sm text-white/70">
                    {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {galleryImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 bg-black/50"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 bg-black/50"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <div className="absolute top-4 left-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailEvent;