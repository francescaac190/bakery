// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@/modules/auth";
import { GuestGuard } from "@/modules/auth";
import { LoginPage } from "@/modules/auth";
import { DashboardPage } from "./pages/DashboardPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import MenuPage from "./modules/menu/pages/MenuPage";
import OrdersPage from "./modules/orders/pages/OrdersPage";
// import { DashboardPage } from "@/pages/DashboardPage";
// import { UsersPage }        from '@/pages/UsersPage'
// import { ReportsPage }      from '@/pages/ReportsPage'
// import { SettingsPage }     from '@/pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas — redirige si ya está logueado */}
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rutas privadas — redirige a /login si no está logueado */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="orders" element={<OrdersPage />} />
            {/* <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
