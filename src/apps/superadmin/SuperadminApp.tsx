import { Routes, Route } from "react-router";
import SuperadminLayout from "./SuperadminLayout";
import DashboardPage from "./DashboardPage";
import TenantPage from "./TenantPage";
import SettingsPage from "./SettingsPage";

export default function SuperadminApp() {
  return (
    <Routes>
      <Route element={<SuperadminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tenants" element={<TenantPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
