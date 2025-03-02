import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/admin/Sidebar";

export default function AdminLayout() {
  return <div className="flex">
    <Sidebar />
    <div className="h-screen overflow-y-scroll">
      <Outlet />
    </div>
  </div>

}
