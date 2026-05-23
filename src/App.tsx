import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import WebApp from "./apps/web/WebApp";
import PosApp from "./apps/pos/PosApp";
import KitchenApp from "./apps/kitchen/KitchenApp";
import AdminApp from "./apps/admin/AdminApp";
import SuperadminApp from "./apps/superadmin/SuperadminApp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/web/*" element={<WebApp />} />
      <Route path="/pos/*" element={<PosApp />} />
      <Route path="/kitchen/*" element={<KitchenApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/superadmin/*" element={<SuperadminApp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
