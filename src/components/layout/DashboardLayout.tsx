import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-2 lg:px-4">
        <div className="py-2 lg:py-4">
          {children}
        </div>
      </main>
    </div>
  );
};