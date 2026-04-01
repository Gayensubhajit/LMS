import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#050510] text-gray-400">
        <AdminSidebar />
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto no-scrollbar max-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
