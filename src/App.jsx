import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Accommodation from "./pages/Accommodation";
import RestaurantsAndBarsPage from "./pages/RestaurantsAndBarsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import Dashboard from "./dashboard/Dashboard";
import DashboardLogin from "./dashboard/DashboardLogin";
import DashboardOverview from "./dashboard/DashboardOverview";
import DashboardUsers from "./dashboard/DashboardUsers";
import DashboardRooms from "./dashboard/DashboardRooms";
import DashboardBookings from "./dashboard/DashboardBookings";
import AddUser from "./dashboard/AddUser";
import AddRoom from "./dashboard/AddRoom";
import EditUser from "./dashboard/EditUser";
import EditRoom from "./dashboard/EditRoom";
import EditBooking from "./dashboard/EditBooking";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/restaurantsandbars" element={<RestaurantsAndBarsPage />} />
        <Route path="/dashboard-login" element={<DashboardLogin />} />
      
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        >
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="rooms" element={<DashboardRooms />} />
          <Route path="rooms/add" element={<AddRoom />} />
          <Route path="rooms/edit/:id" element={<EditRoom />} />
          <Route path="bookings" element={<DashboardBookings />} />
          <Route path="bookings/edit/:id" element={<EditBooking />} />
        </Route>
        
        <Route 
          path="/booking" 
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;