import React, { useState, useMemo } from "react";
import { Search, Filter, Download, Copy, Eye, Trash2, Loader2, Trash } from "lucide-react";
import { useGetAllDiscountCodesQuery, DiscountCodeItem, useBulkDeleteDiscountMutation } from "@/app/store/slices/services/adminService/adminPromos/adminPromoApi";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;



const CouponCodeManager = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<DiscountCodeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Deletion mutation
  const [bulkDeleteDiscount, { isLoading: isDeletingMutation }] = useBulkDeleteDiscountMutation();

  // Fetch dynamic data
  const { data: allCodesApi, isLoading, isError } = useGetAllDiscountCodesQuery(currentPage);
  const allCodes = allCodesApi?.results || [];
  const totalCount = allCodesApi?.count || 0;

  // Data Normalization helper
  const getNormalizedStatus = (status: string) => {
    if (!status) return "N/A";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Date Formatting helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Fallback if invalid
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (_e) {
      return dateString;
    }
  };

  // Filtered Codes
  const filteredCodes = allCodes.filter((code: DiscountCodeItem) => {
    const normalizedStatus = getNormalizedStatus(code.status);
    const statusFilter = activeTab === "All" || normalizedStatus === activeTab;

    const searchFilter =
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.series_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (code.redeemed_by && code.redeemed_by.toLowerCase().includes(searchTerm.toLowerCase()));

    return statusFilter && searchFilter;
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // Since we are doing server-side pagination, currentCodes is just filteredCodes
  const currentCodes = filteredCodes;

  const tabClasses = (tab: string) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${activeTab === tab ? "bg-purple-600 text-white" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
    }`;

  const headerButtonClasses = "flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors";

  const statusClasses: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Redeemed: "bg-blue-100 text-blue-700",
    Expired: "bg-gray-200 text-gray-700",
  };

  const paginationButtonClasses = (isEnabled: boolean) =>
    `px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${isEnabled ? "text-gray-700 border-gray-300 hover:bg-gray-50" : "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
    }`;

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const viewingRangeStart = totalCount > 0 ? startIndex + 1 : 0;
  const viewingRangeEnd = Math.min(startIndex + ITEMS_PER_PAGE, totalCount);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Copied code: ${text}`);
    }).catch(err => {
      console.error('Failed to copy text', err);
      toast.error("Failed to copy to clipboard");
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCurrentIds = currentCodes.map((code: DiscountCodeItem) => code.id);
      setSelectedIds(prev => {
        const uniqueIds = new Set([...prev, ...allCurrentIds]);
        return Array.from(uniqueIds);
      });
    } else {
      const allCurrentIds = currentCodes.map((code: DiscountCodeItem) => code.id);
      setSelectedIds(prev => prev.filter(id => !allCurrentIds.includes(id)));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = useMemo(() =>
    currentCodes.length > 0 && currentCodes.every((code: DiscountCodeItem) => selectedIds.includes(code.id)),
    [currentCodes, selectedIds]
  );

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedSearchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-semibold rounded px-0.5">{part}</span>
      ) : (part)
    );
  };

  const handleExport = () => {
    const csvRows = [];
    const headers = ["Code", "Series", "Status", "Discount", "Redeemed By", "Expiry"];
    csvRows.push(headers.join(","));

    filteredCodes.forEach((item: DiscountCodeItem) => {
      const cleanString = (str: string) => `"${(str || "").replace(/"/g, '""').replace(/,/g, ';')}"`;
      const row = [
        cleanString(item.code),
        cleanString(item.series_name),
        cleanString(item.status),
        cleanString(item.discount),
        cleanString(item.redeemed_by || "N/A"),
        cleanString(item.expiry),
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "coupon_codes.csv");
    link.click();
    toast.info("Exporting filtered codes to coupon_codes.csv");
  };

  const openModal = (code: DiscountCodeItem) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCode(null);
    setIsDeleting(false);
    setIsBulkDeleting(false);
  };

  const confirmDelete = async () => {
    try {
      const idsToDelete = isBulkDeleting ? selectedIds : (selectedCode ? [selectedCode.id] : []);
      if (idsToDelete.length === 0) return;

      const response = await bulkDeleteDiscount({
        target: "discount_code",
        ids: idsToDelete
      }).unwrap();

      if (response.success) {
        toast.success(response.message || (isBulkDeleting ? "Codes deleted successfully" : "Code deleted successfully"));
        setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
        closeModal();
      } else {
        toast.error(response.message || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred while deleting");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-gray-200">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading discount codes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-red-200">
        <p className="text-red-500 font-bold text-xl">Error fetching codes</p>
        <p className="text-gray-500 mt-2">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans ">
      <div className="">
        {/* 1. HEADER/TABS SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 ">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Coupon Code Manager</h1>
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="relative grow min-w-[250px] max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code, series, or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-sm shadow-inner"
              />
            </div>
            <div className="flex space-x-3">
              {selectedIds.length > 0 && (
                <button
                  className={`${headerButtonClasses} bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700`}
                  onClick={() => {
                    setIsBulkDeleting(true);
                    setIsDeleting(true);
                  }}
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete Selected ({selectedIds.length})</span>
                </button>
              )}
              <button className={headerButtonClasses} onClick={() => toast.info("Filter functionality is automatic via tabs.")}>
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <button className={headerButtonClasses} onClick={handleExport}>
                <Download className="h-4 w-4" />
                <span>Export Visible ({filteredCodes.length})</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            {["All", "Active", "Redeemed", "Expired"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={tabClasses(tab)}
              >
                {tab}
                <span className="ml-2 font-normal text-xs opacity-75">
                  ({tab === "All" ? totalCount : allCodes.filter((c: DiscountCodeItem) => getNormalizedStatus(c.status) === tab).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. TABLE/PAGINATION SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden ">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {["CODE", "SERIES", "STATUS", "DISCOUNT", "REDEEMED BY", "EXPIRY", "ACTIONS"].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentCodes.map((item: DiscountCodeItem) => {
                  const normalizedStatus = getNormalizedStatus(item.status);
                  return (
                    <tr key={item.id} className={`${selectedIds.includes(item.id) ? "bg-purple-50" : "hover:bg-purple-50"} transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="bg-purple-50 px-3 py-1.5 rounded-lg inline-flex items-center border border-purple-200 shadow-sm font-mono">
                          {highlightText(item.code)}
                          <button className="ml-3 text-purple-400 hover:text-purple-600 transition-colors" onClick={() => copyToClipboard(item.code)} title="Copy Code">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{highlightText(item.series_name)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[normalizedStatus] || "bg-gray-100 text-gray-600"}`}>
                          {normalizedStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{item.discount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.redeemed_by ? (
                          <p className="text-gray-800 font-medium">{highlightText(item.redeemed_by)}</p>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.expiry)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                        <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors" onClick={() => openModal(item)} title="View Details">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors" onClick={() => { setSelectedCode(item); setIsDeleting(true); }} title="Delete Code">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredCodes.length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-white">
                <p className="font-medium text-lg">No coupon codes found.</p>
                <p className="text-sm mt-1">Try adjusting your search or filtering options.</p>
              </div>
            )}
          </div>

          <div className="p-4 flex flex-wrap justify-between items-center border-t border-gray-100 bg-white">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold">{viewingRangeStart}-{viewingRangeEnd}</span> of <span className="font-semibold">{filteredCodes.length}</span> total codes
            </p>
            <div className="flex space-x-2">
              <button className={paginationButtonClasses(currentPage > 1)} onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
              <button className={paginationButtonClasses(currentPage < totalPages)} onClick={handleNext} disabled={currentPage >= totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Code Details */}
      {isModalOpen && selectedCode && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-3xl max-w-md w-full animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-700 border-b pb-2">Coupon Code Details</h2>
            <div className="space-y-3 text-sm">
              <p className="flex justify-between items-center"><strong className="text-gray-600">Code:</strong> <span className="font-mono bg-purple-100 px-3 py-1 rounded-lg text-purple-800 font-bold">{selectedCode.code}</span></p>
              <p className="flex justify-between items-center border-b border-gray-100 pb-2"><strong className="text-gray-600">Series:</strong> <span className="text-gray-800">{selectedCode.series_name}</span></p>
              <p className="flex justify-between items-center border-b border-gray-100 pb-2">
                <strong className="text-gray-600">Status:</strong>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[getNormalizedStatus(selectedCode.status)] || "bg-gray-100 text-gray-600"}`}>
                  {selectedCode.status}
                </span>
              </p>
              <p className="flex justify-between items-center border-b border-gray-100 pb-2"><strong className="text-gray-600">Discount:</strong> <span className="text-gray-800 font-semibold">{selectedCode.discount}</span></p>
              <p className="flex justify-between items-center border-b border-gray-100 pb-2">
                <strong className="text-gray-600">Redeemed By:</strong> {selectedCode.redeemed_by ? <a href={`mailto:${selectedCode.redeemed_by}`} className="text-blue-600 hover:underline">{selectedCode.redeemed_by}</a> : <span className="text-gray-400">N/A</span>}
              </p>
              <p className="flex justify-between items-center pt-2"><strong className="text-gray-600">Expiry:</strong> <span className="text-gray-800">{formatDate(selectedCode.expiry)}</span></p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => { setIsBulkDeleting(false); setIsDeleting(true); }} className="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium flex items-center shadow-md"><Trash2 className="h-4 w-4 mr-2" /> Delete</button>
              <button onClick={closeModal} className="py-2 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm font-medium shadow-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-3xl max-w-sm w-full border-t-4 border-red-500 animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center"><Trash2 className="h-5 w-5 mr-2" /> {isBulkDeleting ? "Confirm Bulk Deletion" : "Confirm Deletion"}</h3>
            <p className="mb-6 text-gray-700">
              {isBulkDeleting
                ? `Are you sure you want to permanently delete the ${selectedIds.length} selected coupon codes? This action cannot be undone.`
                : <>Are you sure you want to permanently delete coupon code <span className="font-mono font-semibold bg-gray-50 px-1 py-0.5 rounded text-gray-900">{selectedCode?.code || 'this code'}</span>? This action cannot be undone.</>
              }
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => { setIsDeleting(false); setIsBulkDeleting(false); }} className="py-2 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium shadow-sm" disabled={isDeletingMutation}>Cancel</button>
              <button onClick={confirmDelete} className="py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium shadow-md flex items-center" disabled={isDeletingMutation}>
                {isDeletingMutation && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isDeletingMutation ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ToastComponent removed as we use sonner */}
    </div>
  );
};

export default CouponCodeManager;