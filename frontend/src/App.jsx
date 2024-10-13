// src/App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Entry from "./pages/Entry";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
