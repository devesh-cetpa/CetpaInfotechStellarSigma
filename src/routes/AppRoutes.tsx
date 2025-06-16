import { Routes, Route } from 'react-router';
import PrivateRoute from './PrivateRoute';
import NotFound from '@/pages/notFound/NotFound';
import Login from '@/pages/auth/Login';
import UserMonthlyReport from '@/pages/monthly/admin/UserMonthlyReport';
import Home from '@/pages/landingPage/Home';
import LayoutLanding from '@/components/layout/layout-landing';
import Amenities from '@/pages/landingPage/Amenties';
import Location from '@/pages/landingPage/Location';
import About from '@/pages/landingPage/About';
import Events from '@/pages/landingPage/Events';
import DetailEvent from '@/pages/landingPage/DetailEvent';
import CreateEvents from '@/pages/admin/CreateEvents';
import ResetPassword from '@/pages/admin/ResetPassword';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<LayoutLanding />}>
        <Route path="/" element={<Home />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/location" element={<Location />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<DetailEvent />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/monthly-report" element={<UserMonthlyReport />} />
             <Route path="/event-manage" element={<CreateEvents />} />
             <Route path="/reset" element={<ResetPassword />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
