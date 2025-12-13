import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        } />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
