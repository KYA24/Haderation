export default function BrandMark({ compact = false, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div className="h-16 w-16 overflow-hidden rounded-[18px] bg-[#0b2421] shadow-[0_14px_30px_rgba(6,18,16,.35)]">
        <img
          src="/brand.png"
          alt="شعار هدريشن"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      {!compact ? (
        <div>
          <p className="text-3xl font-black tracking-tight text-[var(--kfu-green-900)]">هدريشن</p>
        </div>
      ) : null}
    </div>
  );
}
