import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "@/lib/use-theme";

export function NlsLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMenuOpen(false);
    const titles: Record<string, string> = {
      "/": "Học và tra cứu Năng lượng số",
      "/tra-cuu": "Tra cứu và luận giải dãy số",
      "/thu-vien": "Thư viện tài liệu",
      "/lo-trinh": "Lộ trình học",
    };
    document.title = `${titles[pathname] || "Tám từ trường"} · Tinh Hoa Năng Lượng Số`;
  }, [pathname]);
  return (
    <div className="nls-site">
      <a className="skip-link" href="#noi-dung">
        Đến nội dung chính
      </a>
      <header className="site-header">
        <div className="site-container header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="Tinh Hoa Năng lượng số, trang chủ"
          >
            <span className="brand-icon">
              <Compass size={25} strokeWidth={1.4} />
            </span>
            <span>
              <strong>
                Tinh Hoa<span className="brand-dot">.</span>
              </strong>
              <small>NĂNG LƯỢNG SỐ</small>
            </span>
          </Link>
          <nav
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            id="main-navigation"
            aria-label="Điều hướng chính"
          >
            <NavLink to="/" end>
              Khám phá
            </NavLink>
            <NavLink
              to="/tu-truong/sinh-khi"
              className={pathname.startsWith("/tu-truong/") ? "active" : ""}
            >
              8 từ trường
            </NavLink>
            <NavLink to="/lo-trinh">Lộ trình học</NavLink>
            <NavLink to="/thu-vien">Thư viện</NavLink>
            <NavLink to="/tra-cuu" className="mobile-lookup">
              Tra cứu
            </NavLink>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-button"
              onClick={toggle}
              aria-label={
                theme === "dark" ? "Dùng giao diện sáng" : "Dùng giao diện tối"
              }
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link className="nls-button small header-lookup" to="/tra-cuu">
              Tra cứu <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button menu-button"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              aria-controls="main-navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
      <main id="noi-dung">{children}</main>
      <footer className="site-footer">
        <div className="site-container footer-top">
          <div>
            <Link className="footer-brand" to="/">
              Tinh Hoa<span>.</span>
            </Link>
            <p>Một không gian để học, đối chiếu và hiểu sâu hơn.</p>
          </div>
          <div className="footer-links">
            <Link to="/lo-trinh">Lộ trình học</Link>
            <Link to="/thu-vien">Tài liệu gốc</Link>
            <a href="/content/nls/TINH-HOA-NLS-6868.md" download>
              <BookOpen size={15} /> Tải Markdown
            </a>
          </div>
        </div>
        <div className="site-container footer-bottom">
          <span>Biên soạn từ tài liệu “TINH HOA NLS 6868” · Long Quy Team</span>
          <span>Nội dung huyền học để học và tham khảo.</span>
        </div>
      </footer>
    </div>
  );
}
