import {
  UserPlus,
  Clock,
  Send,
  Pause,
  Trash2,
  Zap,
  AlertTriangle,
  Play,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  useGetAutomationsQuery,
  useCreateAutomationMutation,
  useDeleteAutomationMutation,
  useToggleAutomationStatusMutation,
  AutomationData
} from "@/app/store/slices/services/adminService/adminAutomation/adminAutomationApi";
import { useGetAllDiscountSeriesQuery, DiscountSeriesItem } from "@/app/store/slices/services/adminService/adminPromos/adminPromoApi";
import { useGetAllTemplatesQuery } from "@/app/store/slices/services/adminService/smtp/createTemplateApi";
import { toast } from "react-hot-toast";

// --- Sub-Component: Modal Structure (for Reusability) ---
type ModalWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};
const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, children }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimatingOpen, setIsAnimatingOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimatingOpen(true), 10);
    } else if (shouldRender) {
      setIsAnimatingOpen(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    // FIX: Added 'shouldRender' to the dependency array to resolve the ESLint warning.
    // This ensures the unmount logic runs when shouldRender changes from true to false.
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  const handleClose = () => {
    setIsAnimatingOpen(false);
    setTimeout(onClose, 300);
  };

  const modalClasses = `
    bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 
    transition-all duration-300 ease-in-out transform 
    ${isAnimatingOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
  `;
  const backdropClasses = `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 
    transition-opacity duration-300 
    ${isAnimatingOpen ? "opacity-100" : "opacity-0"}
  `;

  return (
    <div className={backdropClasses} onClick={handleClose}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// --- Sub-Component: CreateAutomationModal ---
type CreateAutomationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({ isOpen, onClose }) => {
  const [automationName, setAutomationName] = useState("");
  const [triggerType, setTriggerType] = useState("");
  const [delayValue, setDelayValue] = useState<number>(1);
  const [delayUnit, setDelayUnit] = useState<"seconds" | "minutes" | "hours" | "days">("seconds");
  const [codeSeriesId, setCodeSeriesId] = useState<number | "">("");
  const [emailTemplateId, setEmailTemplateId] = useState<number | "">("");
  const [startImmediately, setStartImmediately] = useState(true);

  const { data: discountSeries, isLoading: isLoadingSeries } = useGetAllDiscountSeriesQuery();
  const { data: emailTemplatesResponse, isLoading: isLoadingTemplates } = useGetAllTemplatesQuery();
  const emailTemplates = emailTemplatesResponse?.data?.email_templates || [];

  const [createAutomation, { isLoading: isCreating }] = useCreateAutomationMutation();

  const resetForm = () => {
    setAutomationName("");
    setTriggerType("");
    setDelayValue(1);
    setDelayUnit("seconds");
    setCodeSeriesId("");
    setEmailTemplateId("");
    setStartImmediately(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const calculateTotalSeconds = () => {
    switch (delayUnit) {
      case "minutes": return delayValue * 60;
      case "hours": return delayValue * 3600;
      case "days": return delayValue * 86400;
      default: return delayValue;
    }
  };

  const handleCreateAutomation = async () => {
    if (!automationName || !triggerType || delayValue < 0 || !codeSeriesId || !emailTemplateId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createAutomation({
        name: automationName,
        event_type: triggerType,
        delay_seconds: calculateTotalSeconds(),
        discount_series: Number(codeSeriesId),
        email_template: Number(emailTemplateId),
        is_active: startImmediately,
      }).unwrap();
      toast.success("Automation created successfully");
      handleClose();
    } catch (error) {
      console.error("Failed to create automation:", error);
      toast.error("Failed to create automation");
    }
  };

  const handleToggle = () => {
    setStartImmediately((prevState) => !prevState);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose}>
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center">
          <Zap className="w-6 h-6 mr-2 text-[#9810FA]" />
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Automation
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="text-[#0a0a0a] hover:text-gray-700 transition duration-150 text-sm"
        >
          Cancel
        </button>
      </div>

      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Automation Name
          </label>
          <input
            type="text"
            placeholder="e.g., New Customer Welcome"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9810FA] focus:border-[#9810FA]"
            value={automationName}
            onChange={(e) => setAutomationName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trigger Type
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9810FA] focus:border-[#9810FA]"
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
          >
            <option value="">Select trigger...</option>
            <option value="user_sign_up">User Signup</option>
            <option value="item_purchased">Item Purchased</option>
            <option value="abandoned_cart">Abandoned Cart</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delay / Schedule
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="e.g., 24"
              className="grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9810FA] focus:border-[#9810FA]"
              value={delayValue}
              onChange={(e) => setDelayValue(Number(e.target.value))}
              min="0"
            />
            <select
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9810FA] focus:border-[#9810FA]"
              value={delayUnit}
              onChange={(e) => setDelayUnit(e.target.value as any)}
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            How long to wait after the trigger before sending
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Series
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9810FA] focus:border-[#9810FA]"
            value={codeSeriesId}
            onChange={(e) => setCodeSeriesId(Number(e.target.value))}
            disabled={isLoadingSeries}
          >
            <option value="">{isLoadingSeries ? "Loading series..." : "Select discount series..."}</option>
            {discountSeries?.results?.map((series) => (
              <option key={series.id} value={series.id}>
                {series.series_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Template
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9810FA] focus:border-[#9810FA]"
            value={emailTemplateId}
            onChange={(e) => setEmailTemplateId(Number(e.target.value))}
            disabled={isLoadingTemplates}
          >
            <option value="">{isLoadingTemplates ? "Loading templates..." : "Select template.."}</option>
            {emailTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Start Automation Immediately
            </p>
            <p className="text-xs text-gray-500">
              Begin sending codes based on this trigger
            </p>
          </div>
          <label
            htmlFor="start-toggle"
            className="flex items-center cursor-pointer"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="start-toggle"
                className="sr-only peer"
                checked={startImmediately}
                onChange={handleToggle}
              />
              <div className="block bg-gray-200 w-10 h-6 rounded-full peer-checked:bg-[#9810FA]"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform peer-checked:translate-x-4"></div>
            </div>
          </label>
        </div>
      </div>

      <div className="p-6 pt-0">
        <button
          className="w-full py-3 bg-[#9810FA] text-white font-semibold rounded-xl hover:bg-[#860ee0] transition duration-150 flex items-center justify-center disabled:opacity-50"
          onClick={handleCreateAutomation}
          disabled={isCreating || !automationName || !triggerType || !codeSeriesId || !emailTemplateId}
        >
          {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Automation"}
        </button>
      </div>
    </ModalWrapper>
  );
};

// --- Sub-Component: DeleteConfirmationModal ---
type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  automationTitle?: string;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  automationTitle,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Confirm Deletion
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete the automation &ldquo;{automationTitle}&rdquo;? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Delete Automation
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// --- Main Component: AutomationCard ---
const AutomationCard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [automationToDeleteId, setAutomationToDeleteId] = useState<number | null>(null);

  const { data: rawAutomations, isLoading, isError } = useGetAutomationsQuery();
  const automations: AutomationData[] = Array.isArray(rawAutomations) ? rawAutomations : [];
  const [deleteAutomation] = useDeleteAutomationMutation();
  const [toggleStatus] = useToggleAutomationStatusMutation();

  const { data: discountSeries } = useGetAllDiscountSeriesQuery();
  const { data: emailTemplatesResponse } = useGetAllTemplatesQuery();
  const emailTemplates = emailTemplatesResponse?.data?.email_templates || [];

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handlePauseAutomation = async (id: number, currentStatus: boolean) => {
    try {
      await toggleStatus({ id, is_active: !currentStatus }).unwrap();
      toast.success(`Automation ${!currentStatus ? "activated" : "paused"} successfully`);
    } catch (error) {
      console.error("Failed to toggle automation status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    setAutomationToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAutomationToDeleteId(null);
  };

  const confirmDelete = async () => {
    if (automationToDeleteId !== null) {
      try {
        await deleteAutomation(automationToDeleteId).unwrap();
        toast.success("Automation deleted successfully");
        handleCloseDeleteModal();
      } catch (error) {
        console.error("Failed to delete automation:", error);
        toast.error("Failed to delete automation");
      }
    }
  };

  const automationToDelete = automations.find((a: AutomationData) => a.id === automationToDeleteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#9810FA]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
        <p className="text-gray-700 font-semibold">Failed to load automations</p>
        <p className="text-sm text-gray-400 mt-1">Check your connection or ensure you are logged in as admin.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Active Automations
        </h2>
        <button
          className="flex items-center px-4 py-2 bg-[#9810FA] text-white font-medium rounded-lg hover:bg-[#860ee0] transition"
          onClick={handleOpenCreateModal}
        >
          <UserPlus className="w-5 h-5 mr-1" />
          New Automation
        </button>
      </div>

      {automations?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No automations found. Create one to get started!</p>
        </div>
      )}

      {automations.map((automation: AutomationData) => (
        <div
          key={automation.id}
          className="bg-white border border-gray-200 rounded-xl mb-3 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="flex items-start flex-grow">
              <div className="w-10 h-10 mr-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#9810FA]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                  {automation.name}
                </h3>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 flex-wrap gap-x-4 gap-y-1">
                  <span className="flex items-center">
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>Trigger: {automation.event_type.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>Delay: {automation.delay_seconds}s</span>
                  </span>
                  <span className="flex items-center">
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>Created: {new Date(automation.created_at).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </div>
            <span
              className={`mt-3 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full ${automation.is_active
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {automation.is_active ? "Active" : "Paused"}
            </span>
          </div>
          <hr className="my-5 border-gray-100" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
            <div>
              <div className="text-gray-500 font-medium mb-1">Code Series</div>
              <div className="text-gray-900 font-semibold">
                {discountSeries?.results?.find((s: DiscountSeriesItem) => s.id === automation.discount_series)?.series_name || `Series ID: ${automation.discount_series}`}
              </div>
            </div>
            <div>
              <div className="text-gray-500 font-medium mb-1">Email Template</div>
              <div className="text-gray-900 font-semibold">
                {emailTemplates.find(t => t.id === automation.email_template)?.name || `Template ID: ${automation.email_template}`}
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-gray-500 font-medium mb-1">Status</div>
              <div className="text-gray-900 font-semibold">
                {automation.is_active ? "Active" : "Paused"}
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-100" />
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handlePauseAutomation(automation.id, automation.is_active)}
              className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              {automation.is_active ? (
                <>
                  <Pause className="w-4 h-4 mr-1" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" /> Resume
                </>
              )}
            </button>
            <button
              onClick={() => handleOpenDeleteModal(automation.id)}
              className="flex items-center px-4 py-2 text-sm border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}

      <CreateAutomationModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        automationTitle={automationToDelete?.name}
      />
    </div>
  );
};

export default AutomationCard;