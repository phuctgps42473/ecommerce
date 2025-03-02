import { NavLink } from "@remix-run/react";
import { useState } from "react";

function Icon({ name }: { name: string }) {
  // Basic placeholder icons. Replace with your actual icons (e.g., from Heroicons, FontAwesome).
  switch (name) {
    case "dashboard":
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
    case "orders":
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-baggage-claim"><path d="M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2" /><path d="M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10" /><rect width="13" height="8" x="8" y="6" rx="1" /><circle cx="18" cy="20" r="2" /><circle cx="9" cy="20" r="2" /></svg>;
    case "categories":
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column-stacked"><path d="M11 13H7" /><path d="M19 9h-4" /><path d="M3 3v16a2 2 0 0 0 2 2h16" /><rect x="15" y="5" width="4" height="12" rx="1" /><rect x="7" y="8" width="4" height="9" rx="1" /></svg>;
    case "properties":
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table-properties"><path d="M15 3v18" /><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M21 9H3" /><path d="M21 15H3" /></svg>;
    case "products":
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-basket"><path d="m15 11-1 9" /><path d="m19 11-4-7" /><path d="M2 11h20" /><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" /><path d="M4.5 15.5h15" /><path d="m5 11 4-7" /><path d="m9 11 1 9" /></svg>;
    case "users":
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "logout":
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>;
    default:
      return null;
  }
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu Icon (for mobile) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-gray-700 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
      </button>

      <aside
        className={`w-64 h-screen bg-gray-800 text-white transition-transform duration-300 ease-in-out ${isOpen
          ? "fixed z-40 inset-y-0 transform translate-x-0"
          : "transform -translate-x-full"
          } lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-lg font-bold">Admin Panel</span>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="mb-1">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center py-2 px-6 rounded-lg transition duration-200 ${isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <Icon name="dashboard" />
                <span className="ml-3">Dashboard</span>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center py-2 px-6 rounded-lg transition duration-200 ${isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <Icon name="orders" />
                <span className="ml-3">Orders</span>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `flex items-center py-2 px-6 rounded-lg transition duration-200 ${isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <Icon name="categories" />
                <span className="ml-3">Categories</span>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `flex items-center py-2 px-6 rounded-lg transition duration-200 ${isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <Icon name="products" />
                <span className="ml-3">Products</span>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink
                to="/admin/properties"
                className={({ isActive }) =>
                  `flex items-center py-2 px-6 rounded-lg transition duration-200 ${isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <Icon name="properties" />
                <span className="ml-3">Product Properties</span>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center py-2 px-6 rounded-lg transition duration-200 ${isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <Icon name="users" />
                <span className="ml-3">Users</span>
              </NavLink>
            </li>
            <li className="mb-1 absolute bottom-5 w-full">
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  `flex items-center py-2 px-6 rounded-lg transition duration-200 ${isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <Icon name="logout" />
                <span className="ml-3">Logout</span>
              </NavLink>
            </li>
            {/* Add more sidebar links here */}
          </ul>
        </nav>
      </aside>
    </>
  );
}
