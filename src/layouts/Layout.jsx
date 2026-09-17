import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import ShieldMark from "../components/ShieldMark.jsx";

const loggedOutLinks = [];

function linksFor(isAuthenticated, role) {
  if (!isAuthenticated) return loggedOutLinks;
  const links = [
    { to: "/home", label: "Home" },
    { to: "/incidents", label: "Incidents" },
    { to: "/report", label: "Report Incident" },
    { to: "/alerts", label: "Alerts" },
  ];
  if (role === "patrol_officer" || role === "admin") {
    links.push({ to: "/patrols", label: "Patrols" });
  }
  links.push({ to: "/profile", label: "Profile" });
  return links;
}

export default function Layout() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate("/");
  }

  const navLinks = linksFor(isAuthenticated, user?.role);

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-espresso-900 focus:shadow-lg"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-espresso-800/60 bg-espresso-950 text-cream-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <ShieldMark className="h-6 w-6 text-accent-500" />
            <span className="text-base">Aegis</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-espresso-800 text-white"
                      : "text-cream-200/80 hover:bg-espresso-900 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {loading ? null : isAuthenticated ? (
              <>
                <span className="text-sm text-cream-200/80">
                  {user?.name}
                  {user?.role && (
                    <span className="ml-1.5 rounded-full bg-espresso-800 px-2 py-0.5 text-xs capitalize text-cream-100">
                      {user.role.replace("_", " ")}
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-cream-200/30 px-3 py-1.5 text-sm font-medium text-cream-100 transition hover:bg-espresso-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-cream-200/90 hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-accent-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-accent-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-cream-100 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-espresso-800 bg-espresso-950 md:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium ${
                      isActive ? "bg-espresso-800 text-white" : "text-cream-200/80"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 border-t border-espresso-800 pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-cream-100"
                  >
                    Logout ({user?.name})
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 rounded-md border border-cream-200/30 px-3 py-2 text-center text-sm font-medium text-cream-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 rounded-md bg-accent-600 px-3 py-2 text-center text-sm font-semibold text-white"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-espresso-800 bg-espresso-950 text-cream-200/70">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 text-cream-100">
                <ShieldMark className="h-5 w-5 text-accent-500" />
                <span className="font-semibold">Aegis</span>
              </div>
              <p className="mt-2 text-sm">
                A calmer, more organized way for neighbors and patrols to report, track, and resolve
                safety concerns together.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
              <div>
                <h3 className="mb-2 font-semibold text-cream-100">Platform</h3>
                <ul className="flex flex-col gap-1.5">
                  <li><Link to="/incidents" className="hover:text-white">Incidents</Link></li>
                  <li><Link to="/alerts" className="hover:text-white">Alerts</Link></li>
                  <li><Link to="/report" className="hover:text-white">Report</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-cream-100">Account</h3>
                <ul className="flex flex-col gap-1.5">
                  <li><Link to="/login" className="hover:text-white">Login</Link></li>
                  <li><Link to="/register" className="hover:text-white">Register</Link></li>
                  <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-espresso-800 pt-6 text-xs">
            © {new Date().getFullYear()} Aegis. Built as Part of my Frontend Development Program project at RAD5 TECH HUB.
          </div>
        </div>
      </footer>
    </div>
  );
}
