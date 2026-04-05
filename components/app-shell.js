export default function AppShell({ children }) {
  return (
    <div className="shell-grid min-h-screen bg-[radial-gradient(circle_at_top,_rgba(102,211,255,0.12),_transparent_28%),radial-gradient(circle_at_left,_rgba(241,200,77,0.12),_transparent_22%)]">
      {children}
    </div>
  );
}
