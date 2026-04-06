import "./globals.css";

export const metadata = {
  title: "هدريشن | منصة الخدمات الجامعية الذكية",
  description:
    "واجهة جامعية عربية مستوحاة من جامعة الملك فيصل لإدارة الخدمات والطلبات الذكية داخل الحرم.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
