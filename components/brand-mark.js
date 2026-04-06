export default function BrandMark({ compact = false, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#1f907a,#0d4f43)] shadow-[0_12px_28px_rgba(13,79,67,.22)] ring-4 ring-[#f6edd8]">
        <svg viewBox="0 0 80 80" className="h-11 w-11" aria-hidden="true">
          <defs>
            <linearGradient id="brandFlash" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7f1df" />
              <stop offset="100%" stopColor="#c89f3d" />
            </linearGradient>
          </defs>
          <path
            d="M26 13h13l-5 19h15L27 67l6-24H18z"
            fill="url(#brandFlash)"
          />
        </svg>
      </div>
      {!compact ? (
        <div>
          <p className="text-3xl font-black tracking-tight text-[var(--kfu-green-900)]">هَدْرَيْشِن</p>
          <p className="text-sm font-bold text-[var(--kfu-green-700)]">منصة الخدمات والطاقة الذكية</p>
        </div>
      ) : null}
    </div>
  );
}
