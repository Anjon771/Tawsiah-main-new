import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import { PlacesProvider } from './contexts/PlacesContext';
import { FeaturedPlacesProvider } from './contexts/FeaturedPlacesContext';
import { UserProvider } from './contexts/UserContext';
import { OrderProvider } from './contexts/OrderContext';


//fonts
import "./assets/fonts/Poppins/Poppins-Regular.ttf";

function App() {
  useEffect(() => {
    localStorage.removeItem('hasSeenInterests')
  }, [])

  return (
    <OrderProvider>
      <UserProvider>
        <PlacesProvider>
          <FeaturedPlacesProvider>
            <>
              <Header />
              <AppRoutes />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
              />
            </>
          </FeaturedPlacesProvider>
        </PlacesProvider>
      </UserProvider>
    </OrderProvider>
  )
}

export default App;
