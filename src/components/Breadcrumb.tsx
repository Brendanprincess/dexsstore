import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span>/</span>
          {item.to ? (
            <Link to={item.to} className="hover:text-foreground transition-colors">{item.label}</Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
