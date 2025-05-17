import React, { useState, useEffect } from 'react';
import {
  Building2,
  Wallet,
  FileText,
  DollarSign,
  ClipboardCheck,
  Settings,
  Globe,
  FilePieChart,
  Users,
  LayoutGrid,
  Calendar,
  LandPlot,
  BarChart3,
  Search,
  Star,
  Clock,
  Briefcase,
  Laptop,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import ApplicationCard from '../../components/applications/ApplicationCard';
import CategoryButton from '../../components/applications/CategoryButton';
import SectionHeader from '../../components/applications/SectionHeader';
import SearchBox from '../../components/applications/SearchBox';
import ManageApplication from '../../components/applications/ManageApplication';
// Application data
const applications = [
  {
    id: 'residual-value',
    name: 'Residual Value Payment',
    icon: <Wallet size={20} />,
    category: 'finance',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    route: '/residual-value',
    description: 'Manage and track residual value payments',
  },
  {
    id: 'salary',
    name: 'Salary',
    icon: <DollarSign size={20} />,
    category: 'finance',
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    route: '/salary',
    description: 'View salary details and payment history',
  },
  {
    id: 'claims-approvals',
    name: 'Claims & Approvals',
    icon: <ClipboardCheck size={20} />,
    category: 'operations',
    color: 'bg-gradient-to-br from-teal-500 to-teal-600',
    route: '/claims-approvals',
    description: 'Submit and manage approval requests',
  },
  {
    id: 'efficiency',
    name: 'Efficiency',
    icon: <Settings size={20} />,
    category: 'operations',
    color: 'bg-gradient-to-br from-sky-500 to-sky-600',
    route: '/efficiency',
    description: 'Monitor and improve operational efficiency',
  },
  {
    id: 'e-services',
    name: 'e-Services',
    icon: <Globe size={20} />,
    category: 'services',
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    route: '/e-services',
    description: 'Access digital services and tools',
  },
  {
    id: 'tax-declaration',
    name: 'Tax Declaration',
    icon: <FileText size={20} />,
    category: 'finance',
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    route: '/tax-declaration',
    description: 'Manage tax declarations and submissions',
  },
  {
    id: 'hr-recruitment',
    name: 'HR Recruitment',
    icon: <Users size={20} />,
    category: 'hr',
    color: 'bg-gradient-to-br from-violet-500 to-violet-600',
    route: '/hr-recruitment',
    description: 'Manage job postings and applications',
  },
  {
    id: 'sap-login',
    name: 'SAP Login',
    icon: <Building2 size={20} />,
    category: 'systems',
    color: 'bg-gradient-to-br from-blue-600 to-blue-700',
    route: '/sap-login',
    description: 'Access SAP system and resources',
  },
  {
    id: 'leave',
    name: 'Leave',
    icon: <Calendar size={20} />,
    category: 'hr',
    color: 'bg-gradient-to-br from-rose-500 to-rose-600',
    route: '/leave',
    description: 'Apply for and manage leave requests',
  },
  {
    id: 'no-dues',
    name: 'No Dues',
    icon: <ClipboardCheck size={20} />,
    category: 'finance',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    route: '/no-dues',
    description: 'Process and view no-dues certificates',
  },
  {
    id: 'land-payment',
    name: 'Land Payment',
    icon: <LandPlot size={20} />,
    category: 'finance',
    color: 'bg-gradient-to-br from-amber-500 to-amber-600',
    route: '/land-payment',
    description: 'Manage land acquisition payments',
  },
  {
    id: 'pcdo',
    name: 'PCDO',
    icon: <FilePieChart size={20} />,
    category: 'systems',
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    route: '/pcdo',
    description: 'Access project control documentation',
  },
  {
    id: 'cms',
    name: 'CMS',
    icon: <LayoutGrid size={20} />,
    category: 'systems',
    color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    route: '/cms',
    description: 'Manage content and digital assets',
  },
];

// Category definitions
const categories = [
  { id: 'all', name: 'All Applications', icon: <LayoutGrid size={20} />, color: 'bg-gray-700' },
  { id: 'finance', name: 'Finance', icon: <Wallet size={20} />, color: 'bg-blue-600' },
  { id: 'hr', name: 'Human Resources', icon: <Users size={20} />, color: 'bg-violet-600' },
  { id: 'operations', name: 'Operations', icon: <Settings size={20} />, color: 'bg-teal-600' },
  { id: 'systems', name: 'Systems', icon: <Laptop size={20} />, color: 'bg-cyan-600' },
  { id: 'services', name: 'Services', icon: <Briefcase size={20} />, color: 'bg-indigo-600' },
];

const Application = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [showGreeting, setShowGreeting] = useState(true);

  // Get current time for greeting
  const currentHour = new Date().getHours();
  let greeting = 'Good evening';
  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  }

  // Simulate recently used apps and favorites
  useEffect(() => {
    setRecentApps(['salary', 'leave', 'e-services', 'cms']);
    setFavorites(['salary', 'leave', 'tax-declaration']);

    const timer = setTimeout(() => setShowGreeting(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Filter applications based on search and category
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get recent applications
  const recentApplications = applications.filter((app) => recentApps.includes(app.id));

  // Get favorite applications
  const favoriteApplications = applications.filter((app) => favorites.includes(app.id));

  // Toggle an app as favorite
  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]));
  };

  // Simulate opening an app and recording it as recently used
  const handleOpenApp = (id) => {
    if (!recentApps.includes(id)) {
      setRecentApps((prev) => [id, ...prev].slice(0, 5));
    } else {
      setRecentApps((prev) => [id, ...prev.filter((appId) => appId !== id)].slice(0, 5));
    }
    console.log(`Navigating to ${id}`);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 p-4">
          <div className="flex items-center justify-between w-full">
            <SearchBox value={searchTerm} onChange={setSearchTerm} size="md" variant="withCard" />
            <ManageApplication />
          </div>
          <div className="flex overflow-x-auto py-3 space-x-3 category-slider">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 py-8">
        <div className="space-y-10">
          {favoriteApplications.length > 0 && searchTerm === '' && (
            <div className="animate-fade-in">
              <SectionHeader
                icon={<Star className="h-6 w-6" />}
                title="Your Favorites"
                iconBgColor="bg-amber-100"
                iconColor="text-amber-500"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {favoriteApplications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    isFavorite={favorites.includes(app.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenApp={handleOpenApp}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All applications or search results */}
          <div className="animate-fade-in">
            <SectionHeader
              icon={
                searchTerm ? (
                  <Search className="h-6 w-6" />
                ) : (
                  categories.find((c) => c.id === activeCategory)?.icon || <LayoutGrid className="h-6 w-6" />
                )
              }
              title={
                searchTerm
                  ? `Search Results (${filteredApps.length})`
                  : categories.find((c) => c.id === activeCategory)?.name || 'All Applications'
              }
              iconBgColor={
                searchTerm
                  ? 'bg-gray-100'
                  : activeCategory === 'all'
                  ? 'bg-gray-100'
                  : categories.find((c) => c.id === activeCategory)?.color.replace('bg-', '') + '-100'
              }
              iconColor={
                searchTerm
                  ? 'text-gray-500'
                  : activeCategory === 'all'
                  ? 'text-gray-500'
                  : categories.find((c) => c.id === activeCategory)?.color.replace('bg-', '') + '-500'
              }
              count={filteredApps.length}
            />

            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredApps.map((app, index) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    isFavorite={favorites.includes(app.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenApp={handleOpenApp}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 text-center border border-gray-200 shadow-sm">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">No applications found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We couldn't find any applications matching your search. Try adjusting your search terms or selecting a
                  different category.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  View all applications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
