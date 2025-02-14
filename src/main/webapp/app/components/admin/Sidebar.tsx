import { NavLink } from "@remix-run/react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-600"}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-600"}`
              }
            >
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-600"}`
              }
            >
              Products
            </NavLink>
          </li>
          {/* Add more sidebar links (Customers, Marketing, Reports, Settings) */}
        </ul>
      </nav>
    </aside>
  );
}
