// src/modules/auth/pages/LoginPage.tsx
import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { cn } from "../../../lib/cn";
import { Button } from "@/components/ui/Button";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { mutate: login, isPending, error } = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <div className="min-h-screen bg-background-3 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-heading text-3xl font-bold text-text-heading">
            ◆ AdminPanel
          </span>
          <p className="text-sm text-text-muted mt-2">Ingresá a tu cuenta</p>
        </div>

        {/* Card */}
        <div
          className="bg-surface border border-border-card rounded-lg p-12"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className={cn(
                  "bg-background-5 border border-border-card rounded-md px-3.5 py-2.5",
                  "text-sm text-text placeholder:text-text-muted font-body",
                  "outline-none transition-all",
                  "focus:border-primary focus:ring-2 focus:ring-primary/15",
                )}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-widest">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={cn(
                    "w-full bg-background-5 border border-border-card rounded-md px-3.5 py-2.5 pr-10",
                    "text-sm text-text placeholder:text-text-muted font-body",
                    "outline-none transition-all",
                    "focus:border-primary focus:ring-2 focus:ring-primary/15",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error inline */}
            {error && (
              <p className="text-xs text-secondary bg-secondary/8 border border-secondary/20 rounded-md px-3 py-2">
                {error.message}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full justify-center mt-1"
            >
              <LogIn size={15} />
              {isPending ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
