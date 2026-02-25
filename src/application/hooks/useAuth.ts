import { useAuthStore } from "../../state/auth.store";
import { AuthUser } from "../../infra/api/auth.api";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuthenticatedUser = useAuthStore(
    (state) => state.setAuthenticatedUser,
  );
  const clearSession = useAuthStore((state) => state.clearSession);

  const signInWithUser = (nextUser: AuthUser): void => {
    setAuthenticatedUser(nextUser);
  };

  return {
    user,
    isAuthenticated,
    signInWithUser,
    clearSession,
  };
};
