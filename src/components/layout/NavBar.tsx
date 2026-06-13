import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home", matches: ["/", "/me"] },
  { to: "/about", label: "About", matches: ["/about"] },
  { to: "/projects", label: "Projects", matches: ["/projects"] },
  { to: "/contact", label: "Contact", matches: ["/contact"] },
];

const NavBar = () => {
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-nav bg-paper border-b border-rule">
      <div className="container-prose py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6">
          <Link
            to="/"
            className="link-bare font-serif text-base font-medium tracking-tight py-1 -my-1 self-start sm:self-center"
          >
            Samuel Steinmetz
          </Link>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-5 sm:gap-7">
              {links.map((link) => {
                const isActive = link.matches.includes(pathname);
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      aria-current={isActive ? "page" : undefined}
                      className="link-nav text-small font-medium block py-2 -my-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
