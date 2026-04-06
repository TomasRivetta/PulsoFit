import { Navigation } from './navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative min-h-screen">
      <Navigation />
      
      {/* Main Canvas */}
      <main className="lg:ml-64 pt-12 pb-32 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen relative">
        {children}
      </main>
    </div>
  );
}
