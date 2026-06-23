export default function smallContainerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto md:max-w-[600px] lg:max-w-[600px] max-w-[80%] max-[500px]:max-w-full w-full">
            {children}
        </div>
    );
}
