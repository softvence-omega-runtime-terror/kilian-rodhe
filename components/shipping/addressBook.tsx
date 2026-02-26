"use client";

import React from "react";
import { useGetAddressBookQuery, IAddressBookItem } from "@/app/store/slices/services/order/orderApi";
import { Home, Briefcase, MapPin, Loader2 } from "lucide-react";
import { Jost } from "next/font/google";

const jostFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600"] });

interface AddressBookProps {
    onSelectAddress: (address: IAddressBookItem) => void;
    selectedAddressId?: number | null;
}

const AddressBook: React.FC<AddressBookProps> = ({ onSelectAddress, selectedAddressId }) => {
    const { data, isLoading, error } = useGetAddressBookQuery();

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

                    return (
                        <button
                            key={addr.id}
                            type="button"
                            onClick={() => onSelectAddress(addr)}
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
                                    ? "border-[#a07d48] bg-[#fdfbf9] ring-1 ring-[#a07d48]/20"
                                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                                }`}
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
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AddressBook;
