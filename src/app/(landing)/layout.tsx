import Navbar from "./_components/Navbar";

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="landing-shell-bg font-sans min-h-screen text-muted-foreground">
            <Navbar />
            {children}
        </div>
    );
}
