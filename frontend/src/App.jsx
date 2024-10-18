// src/App.jsx
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Entry from "./pages/Entry";
import DashBoard from "./pages/DashBoard";
import Nav from "./component/Nav";


function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const hideNavRoutes = ["/login", "/register", "/"];

  return (
    <>
      {!hideNavRoutes.includes(location.pathname) && <Nav />}
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
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