import Navbar from "./_components/Navbar";

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="landing-shell-bg font-sans min-h-screen text-[#64748b]">
            <Navbar />
            {children}
        </div>
    );
}
