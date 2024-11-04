import './globals.css'

export const metadata = {
  title: 'BI A.L Electronics',
  description: 'Business Intelligence Analytics Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
