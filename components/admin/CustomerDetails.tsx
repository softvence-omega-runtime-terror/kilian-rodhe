import React from "react";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useGetCustomerByIdQuery } from "@/app/store/slices/services/adminService/customerAdminApi";

// Assuming these paths are correct
import starIcon from "@/public/image/admin/products/star.svg";
import shopIcon from "@/public/image/admin/products/shop.svg";
import baseIcon from "@/public/image/admin/products/bach.svg";
import incrementIcon from "@/public/image/admin/Settings/incrementWhiteBtn.svg";

// ---------------- Types ----------------

type ViewType = "list" | "add" | "view";
type ViewChangeHandler = (view: ViewType, id?: number) => void;

interface OrderItem {
  id: string;
  date: string;
  productName: string;
  amount: string;
  status: string;
}

const FolderIcon = () => (
  <Image src={shopIcon} alt="shop" height={20} width={20} />
);

const Title = ({ text, paragraph }: { text: string; paragraph?: string }) => (
  <div className="flex flex-col space-y-1">
    <h2 className="text-xl font-semibold text-gray-800">{text}</h2>
    {paragraph && <p className="text-sm text-gray-500">{paragraph}</p>}
  </div>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white p-6 md:p-8 rounded-2xl border border-[#e8e3dc] ${className}`}
  >
    {children}
  </div>
);

const CustomerDetailScreen = ({
  onViewChange,
  productId: customerId, // Kept productId as name for compatibility with Customers.tsx for now, but internal usage is customerId
}: {
  onViewChange: ViewChangeHandler;
  productId: number;
}) => {
  const { data: customer, isLoading, isError } = useGetCustomerByIdQuery(customerId);

  // Still using dummy data for orders as the customer endpoint doesn't return full order history yet
  const orderData: OrderItem[] = [
    {
      id: "ORD-2847",
      date: "Oct 10, 2025",
      productName: "Custom T-Shirt",
      amount: "34.99",
      status: "Completed",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B6F47]" />
        <p className="mt-4 text-gray-500">Loading customer details...</p>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="p-4 sm:p-8 w-full min-h-screen bg-gray-50 font-sans">
        <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-[#e8e3dc]">
          <button
            onClick={() => onViewChange("list")}
            className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>

          <Title
            text="Customer Not Found"
            paragraph={`Could not load customer ID: ${customerId}`}
          />
        </div>

        <Card>
          <p className="text-red-500">
            Error: The requested customer could not be loaded.
          </p>
        </Card>
      </div>
    );
  }

  const fullName = (customer.first_name || customer.last_name)
    ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    : customer.email.split('@')[0];

  return (
    <>
      <div className="p-4 sm:p-8 w-full min-h-screen bg-gray-50 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e8e3dc]">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange("list")}
              className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition text-gray-600"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>

            <Title text="Customer Details" paragraph="View customer profile and activity" />
          </div>


        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-4 space-y-5">
              <div className="flex flex-col items-center space-y-3 pt-4 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 flex items-center justify-center bg-[#8B6F47] rounded-full text-white text-3xl font-bold uppercase">
                  {fullName.substring(0, 2)}
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                  {fullName}
                </h2>

                <div className="py-1 px-3 rounded-full text-sm font-medium text-[#8B6F47] bg-[#8B6F47]/10 border border-[#8B6F47]">
                  {customer.segment}
                </div>

                <div className="flex space-x-0.5 text-yellow-500">
                  <Image src={starIcon} alt="star" height={20} width={20} />
                  <Image src={starIcon} alt="star" height={20} width={20} />
                  <Image src={starIcon} alt="star" height={20} width={20} />
                </div>
              </div>

              <div className="space-y-4 py-4">
                <div className="flex items-start p-3 bg-gray-50 rounded-xl space-x-4">
                  <svg
                    className="w-6 h-6 text-[#8B6F47] mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <div className="overflow-hidden">
                    <span className="text-sm text-gray-500 font-medium block">
                      Email Address
                    </span>
                    <span className="text-base font-semibold text-gray-700 truncate block">
                      {customer.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-gray-50 rounded-xl space-x-4">
                  <svg
                    className="w-6 h-6 text-[#8B6F47] mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.14a11.042 11.042 0 005.516 5.516l1.14-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  <div>
                    <span className="text-sm text-gray-500 font-medium block">
                      Phone Number
                    </span>
                    <span className="text-base font-semibold text-gray-700">
                      N/A
                    </span>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-gray-50 rounded-xl space-x-4">
                  <svg
                    className="w-6 h-6 text-[#8B6F47] mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <div>
                    <span className="text-sm text-gray-500 font-medium block">
                      Address
                    </span>
                    <span className="text-base font-semibold text-gray-700">
                      N/A
                    </span>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-gray-50 rounded-xl space-x-4">
                  <svg
                    className="w-6 h-6 text-[#8B6F47] mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <div>
                    <span className="text-sm text-gray-500 font-medium block">
                      Customer Since
                    </span>
                    <span className="text-base font-semibold text-gray-700">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card>
              <div className="max-w-md mx-auto p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Customer Stats
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-200/50 border border-blue-300">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#2B7FFF] text-blue-600 mr-4">
                      <Image src={shopIcon} alt="shop" height={20} width={20} />
                    </div>

                    <div>
                      <div className="text-[16px] text-[#1A1410] leading-none">
                        {customer.total_orders}
                      </div>
                      <div className="text-[12px] text-[#6b6560]">
                        Total Orders
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 rounded-xl bg-[linear-gradient(135deg,_#f0fdf4,_rgba(220,252,231,0.5))] border border-[#b9f8cf]">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#00C950] text-white mr-4">
                      <Image
                        src={incrementIcon}
                        alt="shop"
                        height={20}
                        width={20}
                      />
                    </div>

                    <div>
                      <div className="text-[16px] text-[#1A1410] leading-none">
                        €{Number(customer.total_spent).toFixed(2)}
                      </div>
                      <div className="text-[12px] text-[#6b6560]">
                        Total Spent
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-200/50 border border-blue-300">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#AD46FF] text-purple-600 mr-4">
                      <Image src={baseIcon} alt="shop" height={20} width={20} />
                    </div>

                    <div>
                      <div className="text-[16px] text-[#1A1410] leading-none">
                        {customer.preferred_design}
                      </div>
                      <div className="text-[12px] text-[#6b6560]">
                        Preferred Design
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-6 border-b border-gray-200"></div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="text-base text-[#6b6560] ">
                      Average Order Value
                    </span>
                    <span className="text-base font-semibold">
                      €{customer.total_orders > 0 ? (Number(customer.total_spent) / customer.total_orders).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="text-base text-[#6b6560]">Last Order</span>
                    <span className="text-base font-semibold">
                      {customer.last_order ? new Date(customer.last_order).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-gray-800">
                    Order History
                  </h2>
                  {/* Total Orders Badge */}
                  <div className="py-1 px-3 bg-gray-100 text-sm font-medium text-gray-700 rounded-full border border-gray-200">
                    {customer.total_orders} Orders
                  </div>
                </div>

                {/* Order List Container */}
                <div className="space-y-4">
                  {orderData.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-white rounded-xl bg-[linear-gradient(90deg,_rgba(139,111,71,0.05),_rgba(0,0,0,0))] border-2 border-[#e8e3dc]"
                    >
                      {/* Top Row: Icon, Order ID, Date, Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          {/* Icon Circle (Brown/Khaki) */}
                          <div className="w-10 h-10 flex items-center justify-center bg-[#8B6F47] rounded-lg text-white mr-3 mt-1">
                            <FolderIcon />
                          </div>

                          <div>
                            <div className="text-base font-semibold text-gray-800">
                              #{order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.date}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className="text-xs font-semibold py-1 px-3 rounded-full bg-green-100 text-green-700">
                          {order.status}
                        </span>
                      </div>

                      {/* Separator line */}
                      <div className="my-3 border-t border-[#E8E3DC]"></div>

                      {/* Bottom Row: Product Name and Amount */}
                      <div className="grid grid-cols-2 text-sm text-gray-500">
                        {/* Product Details */}
                        <div>
                          <span className="block text-xs font-medium uppercase tracking-wider">
                            Product
                          </span>
                          <span className="text-base font-semibold text-gray-700">
                            {order.productName}
                          </span>
                        </div>

                        {/* Amount Details */}
                        <div className="text-right">
                          <span className="block text-xs font-medium tracking-wider">
                            Amount
                          </span>
                          <span className="text-base font-semibold text-gray-700">
                            €{order.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {customer.total_orders === 0 && (
                    <div className="text-center py-6 text-gray-500 border-2 border-dashed border-[#e8e3dc] rounded-xl">
                      No order history available for this customer.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailScreen;
