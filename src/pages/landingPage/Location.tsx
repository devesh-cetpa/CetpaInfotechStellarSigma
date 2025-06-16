import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Location = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const address = {
    name: "Stellar Sigma Apartments",
    street: "Plot No 74, Sector, Stellar Sigma,",
    area: "Sigma IV, Greater Noida,",
    state: "Uttar Pradesh 201310",
    coordinates: { lat: 28.4595, lng: 77.5120 } // Approximate coordinates for Greater Noida
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: Clock, label: "Open Hours", value: "Mon-Sun: 9:00 AM - 6:00 PM" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 md:py-16 px-4 md:px-8">
      <div className="w-full max-w-6xl mx-auto">
        <Card className="rounded-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-extrabold text-blue-800 drop-shadow-sm">
                Our Location
              </CardTitle>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Visit us at our prime address and experience the heart of Greater Noida. 
                We're conveniently located in the modern Stellar Sigma complex.
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              
              {/* Address and Contact Info */}
              <div className="space-y-6">
                {/* Address Card */}
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-800">Our Address</h2>
                  </div>
                  <div className="text-gray-700 text-lg font-medium leading-relaxed space-y-2">
                    <div className="font-semibold text-blue-900">{address.name}</div>
                    <div>{address.street}</div>
                    <div>{address.area}</div>
                    <div>{address.state}</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl shadow-lg p-6 md:p-8">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-700">
                        <info.icon className="w-5 h-5 text-green-600" />
                        <span className="font-medium">{info.label}:</span>
                        <span>{info.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </Button>
                
                </div>
              </div>

              {/* Map Section */}
              <div className="space-y-4">
                <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-blue-800 font-medium">Loading Interactive Map...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    title="Stellar Sigma Apartments Location"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.123456789!2d77.5120!3d28.4595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzM0LjIiTiA3N8KwMzAnNDMuMiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`}
                    
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setMapLoaded(true)}
                    className="rounded-2xl"
                  />
                </div>
                
                {/* Map Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${address.coordinates.lat},${address.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl flex-1"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Open in Google Maps
                  </a>
                
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-200">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-purple-800 mb-2">Prime Location</h4>
                  <p className="text-gray-600 text-sm">Located in the heart of Greater Noida with excellent connectivity</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-200">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-orange-800 mb-2">Easy Access</h4>
                  <p className="text-gray-600 text-sm">Well-connected by metro, bus routes, and major highways</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-200">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-teal-800 mb-2">Always Open</h4>
                  <p className="text-gray-600 text-sm">Our location is accessible 24/7 for your convenience</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Location;