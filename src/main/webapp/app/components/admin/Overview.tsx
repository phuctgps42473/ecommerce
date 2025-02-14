type OverviewData = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  newCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
};

export default function Overview({ data }: { data: OverviewData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {/* Total Orders Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Total Orders</h2>
        <p className="text-3xl font-bold text-gray-900">{data.totalOrders}</p>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          Total Revenue
        </h2>
        <p className="text-3xl font-bold text-gray-900">
          ${data.totalRevenue.toFixed(2)}
        </p>
      </div>

      {/* Pending Orders Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          Pending Orders
        </h2>
        <p className="text-3xl font-bold text-gray-900">{data.pendingOrders}</p>
      </div>

      {/* New Customers Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          New Customers
        </h2>
        <p className="text-3xl font-bold text-gray-900">{data.newCustomers}</p>
      </div>

      {/* Conversion Rate Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          Conversion Rate
        </h2>
        <p className="text-3xl font-bold text-gray-900">
          {data.conversionRate}%
        </p>
      </div>

      {/* Average Order Value Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          Average Order Value
        </h2>
        <p className="text-3xl font-bold text-gray-900">
          ${data.averageOrderValue.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
