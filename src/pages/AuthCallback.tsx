import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const getValidatedRedirect = (redirect: string | null): string => {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/dashboard";
  }
  return redirect;
};

const cleanOAuthUrl = () => {
  const url = new URL(window.location.href);
  [
    "access_token",
    "refresh_token",
    "expires_in",
    "expires_at",
    "token_type",
    "type",
    "code",
    "state",
    "error",
    "error_code",
    "error_description",
  ].forEach((param) => url.searchParams.delete(param));
  url.hash = "";
  window.history.replaceState(
    {},
    document.title,
    url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
  );
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [status, setStatus] = useState("Completing sign in…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const completeOAuth = async () => {
      try {
        let currentSession = session;

        if (!currentSession) {
          const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
          const queryParams = new URLSearchParams(window.location.search);
          const accessToken =
            hashParams.get("access_token") ?? queryParams.get("access_token");
          const refreshToken =
            hashParams.get("refresh_token") ?? queryParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const result = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (result.error) throw result.error;
            currentSession = result.data.session;
          } else {
            const code = queryParams.get("code");
            if (code) {
              const result = await supabase.auth.exchangeCodeForSession(code);
              if (result.error) throw result.error;
              currentSession = result.data.session;
            }
          }
        }

        if (!currentSession) {
          const latest = await supabase.auth.getSession();
          currentSession = latest.data.session;
        }

        if (!currentSession) {
          throw new Error("Google authentication completed, but no application session was returned.");
        }

        cleanOAuthUrl();
        if (cancelled) return;

        setStatus("Signed in. Opening your workspace…");
        const storedRedirect = sessionStorage.getItem("auth_redirect");
        sessionStorage.removeItem("auth_redirect");
        navigate(getValidatedRedirect(storedRedirect), { replace: true });
      } catch (err) {
        if (cancelled) return;
        console.error("OAuth callback failed:", err);
        setError(err instanceof Error ? err.message : "Unable to complete sign in.");
      }
    };

    if (!authLoading) {
      void completeOAuth();
    }
  }, [authLoading, navigate, session]);

  if (error) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <ShieldAlert className="w-10 h-10 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-serif font-medium mb-3">Sign in could not be completed</h1>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/auth", { replace: true })}
              className="text-sm font-medium text-primary hover:underline"
            >
              Return to sign in
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
      </div>
    </Layout>
  );
}
