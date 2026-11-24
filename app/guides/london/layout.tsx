import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function LondonGuideLayout({ children }: { children: React.ReactNode }) {
  return <><Navbar /><main className="site-header-clearance pb-16 text-white">{children}</main><Footer /></>
}
