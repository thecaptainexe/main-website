import { SITE_CONFIG } from "../config/site";

export default function MainLayout({ children }) {
  return (
    <>
      {children}
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} {SITE_CONFIG.name}</span>
        <span>Designed & built with intention</span>
      </footer>
    </>
  );
}
