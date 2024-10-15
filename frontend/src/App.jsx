// src/App.jsx
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Entry from "./pages/Entry";
import DashBoard from "./pages/DashBoard";
import Nav from "./component/Nav";

function AppContent() {
  const location = useLocation();

  // List of routes where Nav should be hidden
  const hideNavRoutes = ["/login", "/register", "/"];

  return (
    <>
      {/* Conditionally render Nav based on the route */}
      {!hideNavRoutes.includes(location.pathname) && <Nav />}

      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<DashBoard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;