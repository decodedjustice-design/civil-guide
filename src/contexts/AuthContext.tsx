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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Lovable Cloud Auth returns to the app origin after OAuth. If a
        // protected route requested authentication, complete that navigation
        // only after Supabase reports a real signed-in session.
        if (event === "SIGNED_IN" && session?.user) {
          const storedRedirect = sessionStorage.getItem("auth_redirect");
          if (storedRedirect?.startsWith("/") && !storedRedirect.startsWith("//")) {
            sessionStorage.removeItem("auth_redirect");
            window.location.replace(storedRedirect);
            return;
          }
        }

        setLoading(false);
      }
    );

    // THEN recover an OAuth callback before checking the existing session.
    // Lovable's OAuth broker can return Supabase-compatible tokens in the URL
    // fragment after the browser returns to the app. Without consuming those
    // tokens here, the app lands back on /auth with no Supabase session and
    // appears to loop forever.
    const recoverOAuthCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + window.location.search
            );
          }
        } else {
          const code = new URLSearchParams(window.location.search).get("code");
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (!error) {
              const params = new URLSearchParams(window.location.search);
              params.delete("code");
              params.delete("state");
              const query = params.toString();
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname + (query ? `?${query}` : "")
              );
            }
          }
        }
      } catch (error) {
        console.error("OAuth callback recovery failed:", error);
      }

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    void recoverOAuthCallback();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
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
