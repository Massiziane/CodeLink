import { Header } from "@/app/components/header";
import { DeveloperSidebar } from "@/app/components/developer/DeveloperSidebar";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="hidden md:block">
          <DeveloperSidebar />
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
}