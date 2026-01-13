import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Products from "./pages//product/Products";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequireRole from "./auth/RequireRole";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyOrders from "./pages/order/MyOrders";
import AdminOrders from "./pages/admin/AdminOrders";
import CheckoutPage from "./pages/order/CheckoutPage";
import AdminUsers from "./pages/admin/AdminUsers";
import MaintenancePage from "./pages/common/Maintenance";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route
                path="/admin"
                element={
                  <RequireRole role="Admin">
                    <AdminDashboard />
                  </RequireRole>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <RequireRole role="Admin">
                    <AdminOrders />
                  </RequireRole>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RequireRole role="Admin">
                    <AdminUsers />
                  </RequireRole>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;
