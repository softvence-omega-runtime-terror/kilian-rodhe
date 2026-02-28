"use client";

import React from "react";
import { useGetAddressBookQuery, IAddressBookItem, useDeleteAddressMutation } from "@/app/store/slices/services/order/orderApi";
import { Home, Briefcase, MapPin, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Jost, Cormorant_Garamond } from "next/font/google";

const jostFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600"] });
const cormorantItalic = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["italic"],
});

interface AddressBookProps {
    onSelectAddress: (address: IAddressBookItem) => void;
    selectedAddressId?: number | null;
}

const AddressBook: React.FC<AddressBookProps> = ({ onSelectAddress, selectedAddressId }) => {
    const { data, isLoading, error } = useGetAddressBookQuery();
    const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

    const [addressToDelete, setAddressToDelete] = React.useState<IAddressBookItem | null>(null);
    const [isDeletingId, setIsDeletingId] = React.useState<number | null>(null);

    const handleDeleteClick = (e: React.MouseEvent, addr: IAddressBookItem) => {
        e.stopPropagation();
        setAddressToDelete(addr);
    };

    const confirmDelete = async () => {
        if (!addressToDelete) return;
        setIsDeletingId(addressToDelete.id);
        try {
            await deleteAddress(addressToDelete.id).unwrap();
            toast.success("Address deleted successfully");
            setAddressToDelete(null);
        } catch (err) {
            console.error("Failed to delete address", err);
            toast.error("Failed to delete address");
        } finally {
            setIsDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <Loader2 className="animate-spin" size={16} />
                <span>Loading address book...</span>
            </div>
        );
    }

    if (error || !data?.address || data.address.length === 0) {
        return null;
    }

    return (
        <div className={`${jostFont.className} mb-8`}>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-[#a07d48]" />
                Saved Addresses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.address.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    const Icon = addr.address_name.toLowerCase().includes("home") ? Home : Briefcase;
                    const isThisDeleting = isDeletingId === addr.id;

                    return (
                        <button
                            key={addr.id}
                            type="button"
                            onClick={() => !isThisDeleting && onSelectAddress(addr)}
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left relative ${isSelected
                                ? "border-[#a07d48] bg-[#fdfbf9] ring-1 ring-[#a07d48]/20"
                                : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                                } ${isThisDeleting ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            <div className={`p-2 rounded-lg ${isSelected ? "bg-[#a07d48] text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                                <Icon size={18} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-sm text-gray-800 truncate">{addr.address_name}</p>
                                <p className="text-xs text-gray-500 truncate">{addr.address}</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
                                    {addr.firstName} {addr.lastName}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => handleDeleteClick(e, addr)}
                                disabled={isThisDeleting || isDeleting}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 shrink-0"
                                title="Delete Address"
                            >
                                {isThisDeleting ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                            </button>
                        </button>
                    );
                })}
            </div>

            {/* Delete Confirmation Modal */}
            {addressToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-500" size={28} />
                            </div>
                            <h3 className={`${cormorantItalic.className} text-2xl font-bold text-gray-900 mb-2`}>
                                Delete Address?
                            </h3>
                            <p className="text-sm text-gray-500 mb-6 px-2">
                                Are you sure you want to delete <span className="font-semibold text-gray-800">&quot;{addressToDelete.address_name}&quot;</span>?
                                This action cannot be undone.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                                >
                                    {isDeleting && <Loader2 className="animate-spin" size={16} />}
                                    {isDeleting ? "Deleting..." : "Yes, Delete Address"}
                                </button>
                                <button
                                    onClick={() => setAddressToDelete(null)}
                                    disabled={isDeleting}
                                    className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressBook;
