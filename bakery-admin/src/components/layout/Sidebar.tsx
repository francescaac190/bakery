import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  ClipboardList,
  LogOut,
  CakeSlice,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: CakeSlice, label: "Menú", path: "/menu" },
  { icon: ClipboardList, label: "Pedidos", path: "/orders" },
  { icon: BarChart2, label: "Reportes", path: "/reports" },
  { icon: Users, label: "Usuarios", path: "/users" },
  { icon: Settings, label: "Ajustes", path: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="bg-white row-span-2 flex flex-col px-4 py-6 m-4 border-2 border-border-subtle rounded-lg">
      {/* Brand */}
      <div className="mb-8 px-2">
        {/* <span className="text-xl font-bold text-text-heading">AdminPanel</span> */}
        <p className="text-xs text-text-muted mt-0.5">
          Panel de administración
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary hover:bg-background-4 hover:text-text",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={isActive ? "text-primary" : "text-text-muted"}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-subtle pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            FA
          </div>
          <div>
            <p className="text-xs font-medium text-text-heading">
              Francesca A.
            </p>
            <p className="text-xs text-text-muted">Admin</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 w-full rounded-md text-xs text-text-muted hover:bg-background-4 hover:text-secondary transition-all">
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
