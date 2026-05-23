import { Routes, Route, Navigate } from "react-router";
import PosLayout from "./PosLayout";
import PosTerminal from "./PosTerminal";
import PosOrders from "./PosOrders";
import PosReports from "./PosReports";

export default function PosApp() {
  return (
    <Routes>
      <Route element={<PosLayout />}>
        <Route path="/" element={<PosTerminal />} />
        <Route path="/orders" element={<PosOrders />} />
        <Route path="/reports" element={<PosReports />} />
        <Route path="*" element={<Navigate to="/pos" />} />
      </Route>
    </Routes>
  );
}
