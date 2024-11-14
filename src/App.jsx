import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
// import OrderForm from "./components/registerForm/OrderForm";

function App() {
  const isAuthenticated = sessionStorage.getItem("access_token") !== null;
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/buy"
          element={isAuthenticated ? <Navigate to="/" /> : <Home />}
        />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/address" element={<OrderForm />} /> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
