import { useMutation } from "@tanstack/react-query";
import type { LoginPayload } from "../types";
import { authApi } from "../api/auth.api";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),

    onSuccess: ({ token, admin }) => {
      setSession(token, admin);
      toast.success(`Bienvenida, ${admin.name}`);
      navigate("/", { replace: true });
    },

    onError: (error: Error) => {
      toast.error(error.message ?? "Credenciales incorrectas");
    },
  });
}
