export default function AppShell({ children, className = "" }) {
  return <div className={`app-shell ${className}`.trim()}>{children}</div>;
}
