// src/App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Entry from "./pages/Entry";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
