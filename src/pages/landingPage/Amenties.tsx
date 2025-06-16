import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import amenities from "../JsonData/amenities.json";

const Amenities = () => {


  return (
    <div className="bg-slate-50 min-h-screen font-sans py-16">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Premium Amenities
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience luxury living at Steetlar Sigma Society with our
          world-class facilities
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Amenities Cards */}
      <div className="max-w-7xl mx-auto px-4 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity) => (
          <Card
            key={amenity.name}
            className="relative overflow-hidden bg-white/90 border-0 shadow-lg flex flex-col"
            style={{ minHeight: 320 }}
          >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={amenity.image}
                alt={amenity.name}
                className="w-full h-full object-cover"
              />
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                {amenity.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col justify-between">
              {/* <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {amenity.description}
              </p> */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < 4 ? "bg-yellow-400" : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA Section */}
      {/* <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Experience Luxury Living?
          </h3>
          <p className="text-gray-600 mb-6">
            Contact us today to schedule a tour and see these amazing amenities in
            person
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            Schedule a Tour
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Amenities;
