import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, MapPin, Calendar, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import amenities from "../JsonData/amenities.json";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import { fetchEvents } from "@/features/events/eventsSlice";
import { useNavigate } from "react-router";
import Loader from "@/components/ui/loader";

const Home = () => {
  const { events, loading, error } = useAppSelector(state => ({
    events: state.event.events,
    loading: state.event.loading,
    error: state.event.error
  }));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);
  
  const handleOpenEventDetail = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };
  return (
    <div className="bg-slate-50 min-h-screen font-sans">

      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <img
          src="https://dyimg2.realestateindia.com/proj_images/project9467/proj_header_image-9467-770x400.jpg"
          alt="Stellar Sigma Apartments"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-6xl font-bold text-white">
              Stellar Sigma
              <span className="block text-3xl text-gray-300">Premium Apartments</span>
            </h1>
            <p className="text-xl text-gray-200 mt-4">
              Experience exceptional living with world-class amenities, prime location, and a professional community environment.
            </p>
            <Button 
              className="mt-6 bg-white text-slate-800 hover:bg-gray-100"
              onClick={() => navigate('/amenities')}
            >
              Explore Amenities <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-8 py-2 shadow-lg">
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-600" />
                Prime Location
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                200+ Residents
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                4.8 Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Premium Amenities</h2>
          <p className="text-xl text-slate-600 mb-12">
            Our carefully curated facilities enhance your lifestyle and provide convenience.
          </p>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {amenities.slice(0, 3).map((amenity, index) => (
              <Card 
                key={index} 
                className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/amenities')}
              >
                <img 
                  src={amenity.image} 
                  alt={amenity.name} 
                  className="h-48 w-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x200?text=Amenity+Image";
                  }}
                />
                <CardHeader>
                  <CardTitle>{amenity.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Available 24/7</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="mt-10"
            onClick={() => navigate('/amenities')}
          >
            View All Amenities <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Community Events</h2>
          <p className="text-xl text-slate-600 mb-12">
            Stay connected with your neighbors through regular events.
          </p>
          
          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader />
            </div>
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
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 3).map((event, index) => (
                <Card 
                  key={event.id || index} 
                  className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleOpenEventDetail(event.id)}
                >
                  {event.imagePath && (
                    <img 
                      src={event.imagePath} 
                      alt={event.title} 
                      className="h-48 w-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x200?text=Event+Image";
                      }}
                    />
                  )}
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm">{event.theme}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && events && events.length > 0 && (
            <div className="mt-10">
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/events')}
              >
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
