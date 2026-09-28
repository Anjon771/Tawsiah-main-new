import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Interests from "../components/Interests";

import Explore from "../Pages/Explore";
import Favorite from "../Pages/Favorite";
import Map from "../Pages/Map";
import Recommendations from "../Pages/Recommendations";
import PlacePage from "../components/PlacePage.jsx";
import Admin from "../Pages/Admin";
import Profile from "../Pages/Profile.jsx";
import MyReviews from '../Pages/MyReviews.jsx'
import Settings from "../Pages/Settings.jsx"
import OrderPage from "../Pages/OrderPage.jsx"
import MasarWizard from "../Pages/MasarWizard.jsx"
import MasarItinerary from "../Pages/MasarItinerary.jsx"
import ProtectedAdminRoute from "../components/ProtectedAdminRoute.jsx";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/interests" element={<Interests />} />

        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/masar" element={<MasarWizard />} />
        <Route path="/masar/itinerary" element={<MasarItinerary />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/place/:id" element={<PlacePage />} />
        <Route path="/place/recomanation/:id" element={<PlacePage />} />
        <Route path="/event/:id" element={<PlacePage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews" element={<MyReviews />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </>
  );
}
export default AppRoutes;