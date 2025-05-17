import React, { useState, useEffect } from 'react';
import { DialogContent, DialogClose } from '@/components/ui/dialog';
import { X, Award, Briefcase, Star, MapPin, Calendar, Medal, ExternalLink } from 'lucide-react';

interface Leader {
  id: number;
  name: string;
  designation: string;
  image: string;
  bio: string;
}

interface BiographyDialogProps {
  leader: Leader;
}

const BiographyDialog: React.FC<BiographyDialogProps> = ({ leader }) => {
  const [animateContent, setAnimateContent] = useState(false);

  useEffect(() => {
    if (leader) {
      const timer = setTimeout(() => {
        setAnimateContent(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    return () => setAnimateContent(false);
  }, [leader]);

  if (!leader) return null;

  return (
    <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden rounded-xl border-none [&>button]:hidden">
      <div className="relative bg-white overflow-hidden">
        {/* Header with gradient background */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative">
          {/* Decorative pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* DFCCIL text */}
          <div className="absolute top-8 w-full text-center">
            <div className="text-white/90 text-sm font-medium tracking-wider uppercase mb-1">Leadership Profile</div>
            <div className="text-white text-xl font-semibold px-6">
              Dedicated Freight Corridor Corporation of India Limited
            </div>
          </div>

          {/* Close button */}
          <div className="absolute top-4 right-4 z-10">
            <DialogClose className="rounded-full p-2.5 bg-white/10 backdrop-blur-sm text-white hover:bg-white/30 transition-colors border border-white/20">
              <X size={18} />
            </DialogClose>
          </div>
        </div>

        {/* Profile section with photo */}
        <div className="relative px-8 pt-4 pb-6 bg-gradient-to-b from-blue-50 to-white border-b">
          <div className="flex flex-col sm:flex-row">
            {/* Profile image */}
            <div
              className={`transition-all duration-700 ${
                animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white mx-auto sm:mx-0 -mt-20">
                <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Name and title */}
            <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
              <div
                className={`transition-all duration-700 delay-100 ${
                  animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{leader.name}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-1.5 mb-3">
                  <Briefcase size={16} className="text-blue-600 mr-2" />
                  <p className="text-blue-700 font-medium">{leader.designation}</p>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto sm:mx-0"></div>
              </div>

              {/* Additional profile stats and info */}
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                <div
                  className={`bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center transition-all duration-700 delay-150 ${
                    animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <MapPin size={14} className="text-blue-600 mr-2" />
                  <span className="text-gray-700 text-sm">DFCCIL, India</span>
                </div>
                <div
                  className={`bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center transition-all duration-700 delay-200 ${
                    animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <Medal size={14} className="text-blue-600 mr-2" />
                  <span className="text-gray-700 text-sm">Executive Leadership</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biography content */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 gap-6">
            <div
              className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-700 delay-300 ${
                animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Award size={18} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 ml-3">Biography</h3>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{leader.bio}</p>

                {/* Key Highlights */}
                <div className="mt-6 pt-6 border-t border-gray-100 hidden">
                  <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <Star size={16} className="text-blue-600 mr-2" />
                    Key Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                        <span className="text-xs font-medium">1</span>
                      </div>
                      <span className="text-gray-700 text-sm">Distinguished career in Indian Railways</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                        <span className="text-xs font-medium">2</span>
                      </div>
                      <span className="text-gray-700 text-sm">Extensive experience in railway infrastructure</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <span className="text-gray-700 text-sm">Technical expertise in freight corridors</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                        <span className="text-xs font-medium">4</span>
                      </div>
                      <span className="text-gray-700 text-sm">Leadership roles in multiple divisions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`mt-4 text-center text-gray-500 text-xs transition-all duration-700 delay-400 ${
              animateContent ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p>Dedicated Freight Corridor Corporation of India Limited © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default BiographyDialog;
