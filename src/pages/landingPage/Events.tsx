import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import { fetchEvents } from "@/features/events/eventsSlice";
import Loader from "@/components/ui/loader";

const Events = () => {
  const events = useAppSelector(state => state.event.events);
  const loading = useAppSelector(state => state.event.loading);
  const error = useAppSelector(state => state.event.error);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleOpenDetailPage = (eventId: number | string) => {
    navigate(`/events/${eventId}`);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Events at{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Stellar Sigma
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover extraordinary experiences, connect with industry leaders,
            and be part of something remarkable.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading && (
        <Loader/>
        )}
        
        {error && (
          <div className="text-center py-10">
            <p className="text-red-600 text-lg">Failed to load events: {error}</p>
          </div>
        )}
        
        {!loading && !error && (!events || events.length === 0) && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No events found.</p>
          </div>
        )}
        
        {!loading && !error && events && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
            {events.map((event, index) => (
              <Card
                key={event.id || index}
                className="group relative overflow-hidden border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-lg cursor-pointer rounded-2xl"
                onClick={() => handleOpenDetailPage(event.id)}
              >
                {/* Animated Gradient Border */}
                <div className="absolute -top-1 -left-1 w-[calc(100%+2px)] h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-x" />

                {/* Image */}
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  {event.imagePath || event.image ? (
                    <img
                      src={event.imagePath || event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-t-2xl transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-14 h-14 text-blue-400 opacity-60" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-300 line-clamp-2 drop-shadow">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 px-5 pb-5">
                  <CardDescription className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4">
                    {event.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </CardContent>

                {/* Subtle hover overlay */}
                <div className="absolute inset-0 pointer-events-none group-hover:bg-blue-50/30 transition-all duration-300 rounded-2xl" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;