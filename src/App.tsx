import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppDispatch, useAppSelector } from './app/hooks';

const App = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, departments, units } = useAppSelector((state) => state.employee);

  // useEffect(() => {
  //   if (!employees.length) {
  //     dispatch(fetchEmployees());
  //   }
  // }, [dispatch, employees]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, position: 'top-right' }} />
      {/* {loading && <Loader />} */}
      <AppRoutes />
    </div>
  );
};

export default App;
