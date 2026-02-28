import React from "react";
import { Mail, Phone, MessageSquare, MapPin, Clock, Loader2, Globe } from "lucide-react";

import {
  useGetContactInfoQuery,
  useGetSocialMediaQuery,
} from "../../app/store/slices/services/adminService/contentAndCmsApi";

// Icon mapping
const ContactIcons = {
  Email: Mail,
  Phone: Phone,
  Whatsapp: MessageSquare,
  Address: MapPin,
  Hours: Clock,
};

// --- ContactItem ---
interface ContactItemProps {
  Icon: React.ElementType;
  title: string;
  value: string;
}
const ContactItem: React.FC<ContactItemProps> = ({ Icon, title, value }) => (
  <div className="flex items-start space-x-3">
    <div className="shrink-0 p-2 border shadow-md border-gray-200 rounded-xl bg-[#FFFFFF] text-gray-700 mt-0.5">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-700">{title}</span>
      <span className="text-base text-gray-900 font-normal break-all">{value || "Not specified"}</span>
    </div>
  </div>
);

// --- LocationOrHoursItem ---
interface LocationOrHoursItemProps {
  Icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}
const LocationOrHoursItem: React.FC<LocationOrHoursItemProps> = ({
  Icon,
  title,
  children,
}) => (
  <div className="flex items-start space-x-3 ">
    <div className="shrink-0 text-gray-700 mt-0.5 p-2 border shadow-md border-gray-200 rounded-xl bg-[#FFFFFF]">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col w-full">
      <span className="text-sm font-medium text-gray-700">{title}</span>
      {children}
    </div>
  </div>
);

export default function ContactCard() {
  const { data: contactRes, isLoading: contactLoading } = useGetContactInfoQuery();
  const { data: socialRes, isLoading: socialLoading } = useGetSocialMediaQuery();

  const contactData = Array.isArray(contactRes?.data) ? contactRes?.data[0] : contactRes?.data;
  const socialLinks = Array.isArray(socialRes?.data) ? socialRes?.data : [];

  return (
    <div className="p-6 bg-white border-2 border-[#e8e3dc] rounded-xl relative overflow-hidden">
      {contactLoading && (
        <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Contact Information Preview
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        How your contact information will appear on the website
      </p>

      <div className="p-6 rounded-lg bg-[linear-gradient(135deg,#faf9f7,rgba(232,227,220,0.3))]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
          <div className="space-y-6">
            <ContactItem
              Icon={ContactIcons.Email}
              title="Email"
              value={contactData?.email || ""}
            />
            <ContactItem
              Icon={ContactIcons.Phone}
              title="Phone"
              value={contactData?.phone_number ? `+${contactData.phone_number}` : ""}
            />
            <ContactItem
              Icon={ContactIcons.Whatsapp}
              title="WhatsApp"
              value={contactData?.whatsappNumber ? `+${contactData.whatsappNumber}` : ""}
            />
          </div>

          <div className="space-y-6">
            <LocationOrHoursItem Icon={ContactIcons.Address} title="Address">
              <span className="text-base text-gray-900 font-normal block max-w-sm mt-1">
                {contactData?.businessAddress || "Not specified"}
              </span>
            </LocationOrHoursItem>

            <LocationOrHoursItem
              Icon={ContactIcons.Hours}
              title="Business Hours"
            >
              <div className="text-base text-gray-900 font-normal mt-1">
                <p>
                  <span className="font-medium">Monday - Friday:</span> 9:00 AM
                  - 6:00 PM
                </p>
                <p>
                  <span className="font-medium">Saturday:</span> 10:00 AM - 4:00
                  PM
                </p>
                <p>
                  <span className="font-medium">Sunday:</span> Closed
                </p>
              </div>
            </LocationOrHoursItem>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-base font-semibold text-gray-700 mb-4">
          Follow Us
        </h3>
        {socialLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        ) : socialLinks.length > 0 ? (
          <div className="flex space-x-3 flex-wrap gap-y-3">
            {socialLinks.map((item: any) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 transition duration-150 flex items-center justify-center bg-white"
                title={item.name || "Social Link"}
              >
                {item.icon ? (
                  <img src={item.icon} alt={item.name || "Icon"} className="w-5 h-5 object-contain" />
                ) : (
                  <Globe className="w-5 h-5" />
                )}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No social media links active.</p>
        )}
      </div>
    </div>
  );
}
