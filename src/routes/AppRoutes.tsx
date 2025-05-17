import { Routes, Route } from 'react-router';
import PrivateRoute from './PrivateRoute';
import NotFound from '@/pages/notFound/NotFound';
import Dashboard from '@/pages/employee/Dashboard';
import Login from '@/pages/auth/Login';
import Home from '@/pages/home/Home';
import Application from '@/pages/applications/Applications';
import OrganizationStructure from '@/pages/organizationStructure/OrganizationStructure';
import OurLeadership from '@/pages/ourLeadership/OurLeadership';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/our-leadership" element={<OurLeadership />} />
        <Route path="/organization-structure" element={<OrganizationStructure />} />
        <Route path="/applications" element={<Application />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
