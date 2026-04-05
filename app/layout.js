import "./globals.css";

export const metadata = {
  title: "هدريشن - منصة إدارة طاقة القاعات الذكية",
  description: "نموذج أولي لإدارة طاقة القاعات الدراسية الذكية في الجامعات السعودية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
