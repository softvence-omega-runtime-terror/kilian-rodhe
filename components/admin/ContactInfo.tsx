import React, { useState, useEffect } from "react";
import { Mail, Phone, MessageSquare, MapPin, Clock, Save, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetContactInfoQuery,
  useCreateContactInfoMutation,
  useUpdateContactInfoMutation,
} from "../../app/store/slices/services/adminService/contentAndCmsApi";

const ContactInfoForm = () => {
  const { data: contactRes, isLoading: isFetching } = useGetContactInfoQuery();
  const [createContactInfo, { isLoading: isCreating }] = useCreateContactInfoMutation();
  const [updateContactInfo, { isLoading: isUpdating }] = useUpdateContactInfoMutation();

  const isSaving = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    id: null as number | null,
    email: "",
    phone_number: "",
    whatsappNumber: "",
    businessAddress: "",
  });

  // Hydrate form data when fetched
  useEffect(() => {
    // Handling API formats wrapper if it is mapped as raw Array or Object 
    const contactData = Array.isArray(contactRes?.data) ? contactRes?.data[0] : contactRes?.data;
    if (contactData) {
      setFormData({
        id: contactData.id || null,
        email: contactData.email || "",
        phone_number: contactData.phone_number ? String(contactData.phone_number) : "",
        whatsappNumber: contactData.whatsappNumber ? String(contactData.whatsappNumber) : "",
        businessAddress: contactData.businessAddress || "",
      });
    }
  }, [contactRes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      phone_number: formData.phone_number ? Number(formData.phone_number.replace(/\D/g, "")) : 0,
      whatsappNumber: formData.whatsappNumber ? Number(formData.whatsappNumber.replace(/\D/g, "")) : 0,
      businessAddress: formData.businessAddress,
    };

    try {
      if (formData.id) {
        await updateContactInfo({ id: formData.id, ...payload }).unwrap();
        toast.success("Contact Information Updated Successfully!", { position: "bottom-center" });
      } else {
        const res = await createContactInfo(payload).unwrap();
        if (res?.data?.id) {
          setFormData((prev) => ({ ...prev, id: res.data.id }));
        }
        toast.success("Contact Information Created Successfully!", { position: "bottom-center" });
      }
    } catch (err: any) {
      console.error("Failed to save contact info", err);
      toast.error(err?.data?.message || "Failed to save contact information", { position: "bottom-center" });
    }
  };

  return (
    // Outer container with light shadow and rounded corners
    <div className=" bg-white p-6 md:p-8 rounded-xl border-2 border-[#e8e3dc] ">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6  pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Contact Information
          </h2>
          <p className="text-sm text-gray-500">
            Main contact details displayed on your website
          </p>
        </div>
        {/* Email Icon in light blue box */}
        <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
          <Mail className="h-6 w-6" />
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-amber-800 w-8 h-8" />
        </div>
      ) : (
        <form onSubmit={handleSaveContactInfo}>
          {/* Form Fields Section */}
          <div className="space-y-6">
            {/* 1. Email Address */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="support@thundra.com"
                className="w-full p-3 bg-gray-100 border-2 border-[#e8e3dc] rounded-xl focus:outline-none transition duration-150"
              />
            </div>

            {/* 2. Phone Number */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="phone_number"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="493012345678"
                className="w-full p-3 bg-gray-100 border-2 border-[#e8e3dc] rounded-xl  focus:outline-none transition duration-150"
              />
            </div>

            {/* 3. WhatsApp Number */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="whatsappNumber"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                WhatsApp Number
              </label>
              <input
                id="whatsappNumber"
                name="whatsappNumber"
                type="text"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="491512345678"
                className="w-full p-3 bg-gray-100 rounded-xl border-2 border-[#e8e3dc]   focus:outline-none transition duration-150"
              />
            </div>

            {/* 4. Business Address */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="businessAddress"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Business Address
              </label>
              <input
                id="businessAddress"
                name="businessAddress"
                type="text"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Friedrichstraße 123, 10117 Berlin, Germany"
                className="w-full p-3 bg-gray-100 border-2 border-[#e8e3dc] rounded-xl focus:outline-none transition duration-150"
              />
            </div>

            {/* 5. Business Hours */}
            <div className="pt-2">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                Business Hours
              </div>
              <div className="text-sm text-gray-700 bg-gray-100 rounded-xl p-4 border-2 border-[#e8e3dc]  space-y-1">
                <p>
                  <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
                </p>
                <p>
                  <strong>Saturday:</strong> 10:00 AM - 4:00 PM
                </p>
                <p>
                  <strong>Sunday:</strong> Closed
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-800 hover:bg-amber-900 focus:outline-none transition duration-150 disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, #8b6f47, #7a5f3a)",
                border: "1.2px solid rgba(0, 0, 0, 0)",
              }}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Contact Information"}
            </button>
            <Toaster position="bottom-center" />
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactInfoForm;
