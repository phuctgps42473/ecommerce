import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/admin/Sidebar";

export default function AdminLayout() {
  return <div className="flex">
    <Sidebar />
    <Outlet />
  </div>

}
