import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const cleanOAuthUrl = () => {
  const url = new URL(window.location.href);
  const authParams = [
    "access_token", "refresh_token", "expires_in", "expires_at", "token_type",
    "type", "code", "state", "error", "error_code", "error_description",
  ];
  authParams.forEach((param) => url.searchParams.delete(param));
  url.hash = "";
  window.history.replaceState(
    {},
    document.title,
    url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
  );
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authInitialized = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);

        if (event === "SIGNED_IN" && nextSession?.user) {
          const storedRedirect = sessionStorage.getItem("auth_redirect");
          if (storedRedirect?.startsWith("/") && !storedRedirect.startsWith("//")) {
            sessionStorage.removeItem("auth_redirect");
            window.location.replace(storedRedirect);
            return;
          }
        }

        if (authInitialized) setLoading(false);
      }
    );

    const initializeAuth = async () => {
      try {
        // Supabase automatically restores persisted sessions and standard
        // OAuth callbacks. Do that first so we never consume a callback twice.
        let { data: { session: recoveredSession } } = await supabase.auth.getSession();

        // Compatibility fallback for the Lovable OAuth broker if it returns
        // tokens in the URL but Supabase did not consume them automatically.
        if (!recoveredSession) {
          const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
          const queryParams = new URLSearchParams(window.location.search);
          const accessToken = hashParams.get("access_token") ?? queryParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token") ?? queryParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (!error) {
              cleanOAuthUrl();
              ({ data: { session: recoveredSession } } = await supabase.auth.getSession());
            }
          } else {
            const code = queryParams.get("code");
            if (code) {
              const { error } = await supabase.auth.exchangeCodeForSession(code);
              if (!error) {
                cleanOAuthUrl();
                ({ data: { session: recoveredSession } } = await supabase.auth.getSession());
              }
            }
          }
        }

        setSession(recoveredSession);
        setUser(recoveredSession?.user ?? null);
      } catch (error) {
        console.error("OAuth/session initialization failed:", error);
      } finally {
        authInitialized = true;
        setLoading(false);
      }
    };

    void initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
