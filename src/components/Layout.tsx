import type { PropsWithChildren } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import { useAuthStore } from "../store/authStore";

export function Layout({ children }: PropsWithChildren) {
  const { t, language, toggleLanguage } = useI18n();
  const navigate = useNavigate();
  const users = useAuthStore((state) => state.users);
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const user = users.find((item) => item.id === currentUserId) ?? null;
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div className="space-y-1">
            <Link to="/" className="block text-xl font-bold text-white">{t.brand}</Link>
            <p className="text-xs text-slate-300">{t.tagline}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/profile" className="rounded-full border border-white/20 px-3 py-1 text-sm hover:border-[#7C6FE9]">
              Profile
            </Link>
            {user ? (
              <button
                className="rounded-full border border-white/20 px-3 py-1 text-sm hover:border-[#7C6FE9]"
                onClick={() => {
                  logout();
                  navigate("/auth");
                }}
                type="button"
              >
                Logout
              </button>
            ) : (
              <Link to="/auth" className="rounded-full border border-white/20 px-3 py-1 text-sm hover:border-[#7C6FE9]">
                Login
              </Link>
            )}
            <button className="rounded-full border border-white/20 px-3 py-1 text-sm hover:border-[#7C6FE9]" onClick={toggleLanguage} type="button">
              {language.toUpperCase()} / {language === "en" ? "BN" : "EN"}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
