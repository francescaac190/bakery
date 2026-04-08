import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
// import { Topbar }  from './Topbar'

export function DashboardLayout() {
  return (
    <div
      className="grid min-h-screen"
      style={{ gridTemplateColumns: "240px 1fr", gridTemplateRows: "64px 1fr" }}
    >
      <Sidebar />
      {/* <Topbar /> */}
      <main className="bg-background-3 overflow-auto p-6 lg:p-8 row-span-2">
        <Outlet />
      </main>
    </div>
  );
}
