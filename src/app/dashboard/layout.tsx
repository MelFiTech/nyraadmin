import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | NyraWallet Admin',
  description: 'NyraWallet admin dashboard overview',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}