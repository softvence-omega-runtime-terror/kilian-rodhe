import React, { useState, useRef } from 'react';
import {
    Search,
    // Calendar,
    Edit3,
    Copy,
    Trash2,
    Plus,
    ArrowLeft,
    Tag,
    Database,
    Info,
    Check
} from 'lucide-react';
import { useCreateEmailTemplateMutation, useGetAllTemplatesQuery, useUpdateEmailTemplateMutation, useDeleteEmailTemplateMutation, EmailTemplate } from '@/app/store/slices/services/adminService/smtp/createTemplateApi';
import { useGetAllPlaceholdersQuery, useCreatePlaceholderMutation, useDeletePlaceholderMutation, CreatePlaceholderRequest } from '@/app/store/slices/services/adminService/smtp/emailPlaceHolderApi';
import { toast } from 'sonner';



const initialPlaceholders: CreatePlaceholderRequest[] = [
    { slug_name: 'customer_name', description: 'Customer full name', source: 'customer.profile.full_name' },
];


function EmailTemplateTab() {
    // View State
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [purpose, setPurpose] = useState('discount');
    const [bodyType, setBodyType] = useState<'text' | 'html'>('text');
    const [isDefault, setIsDefault] = useState(false);
    const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);

    // Ref for textarea to track cursor position
    const bodyTextAreaRef = useRef<HTMLTextAreaElement>(null);
    // State to track cursor position for restoration after insert
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    // Effect to restore cursor position after body state update
    React.useEffect(() => {
        if (cursorPosition !== null && bodyTextAreaRef.current) {
            bodyTextAreaRef.current.focus();
            bodyTextAreaRef.current.setSelectionRange(cursorPosition, cursorPosition);
            setCursorPosition(null); // Reset after restoration
        }
    }, [body, cursorPosition]);

    const { data: templateData, isLoading: isLoadingList } = useGetAllTemplatesQuery();
    const [createTemplate, { isLoading: isCreatingTemplate }] = useCreateEmailTemplateMutation();
    const [updateTemplate, { isLoading: isUpdatingTemplate }] = useUpdateEmailTemplateMutation();
    const [deleteTemplate] = useDeleteEmailTemplateMutation();

    const isLoading = isCreatingTemplate || isUpdatingTemplate;

    const handleSaveTemplate = async () => {
        if (!name || !subject || !body || !purpose) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            if (editingTemplateId) {
                await updateTemplate({
                    id: editingTemplateId,
                    data: {
                        name,
                        subject,
                        body,
                        purpose,
                        body_type: bodyType,
                        is_default: isDefault
                    }
                }).unwrap();
                toast.success("Email template updated successfully!");
            } else {
                await createTemplate({
                    name,
                    subject,
                    body,
                    purpose,
                    body_type: bodyType,
                    is_default: isDefault
                }).unwrap();
                toast.success("Email template created successfully!");
            }

            setIsCreating(false);
            setEditingTemplateId(null);
            // Reset form
            setName('');
            setSubject('');
            setBody('');
            setPurpose('discount');
            setBodyType('text');
            setIsDefault(false);
            setEditingTemplateId(null);
        } catch (error) {
            console.error("Failed to save template:", error);
            toast.error("Failed to save email template.");
        }
    };

    const handleEdit = (template: EmailTemplate) => {
        setName(template.name);
        setSubject(template.subject);
        setBody(template.body);
        setPurpose(template.purpose);
        setBodyType(template.body_type);
        setIsDefault(template.is_default);
        setEditingTemplateId(template.id);
        setIsCreating(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this template?")) {
            try {
                await deleteTemplate(id).unwrap();
                toast.success("Template deleted successfully");
            } catch (error) {
                console.error("Failed to delete template:", error);
                toast.error("Failed to delete template");
            }
        }
    };

    // Placeholder State
    const { data: placeholderData } = useGetAllPlaceholdersQuery();
    const [createPlaceholder] = useCreatePlaceholderMutation();
    const [deletePlaceholder] = useDeletePlaceholderMutation();

    const [newPlaceholder, setNewPlaceholder] = useState<CreatePlaceholderRequest>({ slug_name: '', description: '', source: '' });
    const [isAddingPlaceholder, setIsAddingPlaceholder] = useState(false);

    // Helper to add placeholder
    const handleAddPlaceholder = async () => {
        if (newPlaceholder.slug_name && newPlaceholder.source) {
            try {
                await createPlaceholder(newPlaceholder).unwrap();
                toast.success("Placeholder created!");
                setNewPlaceholder({ slug_name: '', description: '', source: '' });
                setIsAddingPlaceholder(false);
            } catch (error) {
                console.error("Failed to create placeholder:", error);
                toast.error("Failed to create placeholder");
            }
        } else {
            toast.error("Slug name and source are required");
        }
    };

    const handleDeletePlaceholder = async (id: number) => {
        if (confirm("Delete this placeholder?")) {
            try {
                await deletePlaceholder(id).unwrap();
                toast.success("Placeholder deleted");
            } catch (error: any) {
                console.error("Failed to delete placeholder:", error);
                const errorMessage = error?.data?.message || "Failed to delete placeholder";
                toast.error(errorMessage);
            }
        }
    };

    // Insert placeholder at cursor position
    const insertPlaceholder = (slugName: string) => {
        console.log('insertPlaceholder called with:', slugName);
        const textArea = bodyTextAreaRef.current;
        console.log('textArea ref:', textArea);

        if (!textArea) {
            // Fallback: append to end
            console.log('No textarea ref, appending to end');
            setBody((prev) => prev + `{{ ${slugName} }}`);
            return;
        }

        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        console.log('Cursor position:', start, end);

        const before = body.substring(0, start);
        const after = body.substring(end);
        const placeholder = `{{ ${slugName} }}`;
        const newText = before + placeholder + after;
        const newCursorPos = start + placeholder.length;

        console.log('New text:', newText);
        console.log('New cursor position:', newCursorPos);

        // Update body and set cursor position for restoration
        setBody(newText);
        setCursorPosition(newCursorPos);
    };

    // --- RENDER: CREATE NEW TEMPLATE FORM ---
    if (isCreating) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header with Actions */}
                <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center">
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setEditingTemplateId(null);
                                // Reset form on cancel if needed, or keep for next open? 
                                // Better to reset to avoid stale data if they click "Create" next time without saving.
                                setName('');
                                setSubject('');
                                setBody('');
                                setPurpose('discount');
                                setBodyType('text');
                                setIsDefault(false);
                            }}
                            className="mt-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{editingTemplateId ? "Edit Template" : "Create New Template"}</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {editingTemplateId ? "Update existing template details." : "Configure template details and map dynamic data sources."}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setEditingTemplateId(null);
                                setName('');
                                setSubject('');
                                setBody('');
                                setPurpose('discount');
                                setBodyType('text');
                                setIsDefault(false);
                            }}
                            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveTemplate}
                            disabled={isLoading}
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? 'Saving...' : (editingTemplateId ? 'Update Template' : 'Save Template')}
                        </button>
                    </div>
                </div>

                {/* --- SPLIT LAYOUT: EDITOR & PLACEHOLDERS --- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Left Column: The Editor (2/3 width) */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Template Details</h2>
                            <div className="space-y-4">
                                {/* Template Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-gray-500">Template Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Summer Sale 2024"
                                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>

                                {/* Purpose & Default */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase text-gray-500">Purpose</label>
                                        <select
                                            value={purpose}
                                            onChange={(e) => setPurpose(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
                                        >
                                            <option value="" disabled>Select a purpose</option>
                                            {templateData?.data?.filters?.purposes.map((p) => (
                                                <option key={p.value} value={p.value}>
                                                    {p.display}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-3 pt-6">
                                        <input
                                            type="checkbox"
                                            id="isDefault"
                                            checked={isDefault}
                                            onChange={(e) => setIsDefault(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">Set as Default Template</label>
                                    </div>
                                </div>

                                {/* Email Subject */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-gray-500">Email Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g., Check out these deals!"
                                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>

                                {/* Email Message */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-semibold uppercase text-gray-500">Email Message</label>
                                        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                                            <button
                                                onClick={() => setBodyType('text')}
                                                className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-md transition-all ${bodyType === 'text' ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                Text
                                            </button>
                                            <button
                                                onClick={() => setBodyType('html')}
                                                className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-md transition-all ${bodyType === 'html' ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                HTML
                                            </button>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
                                        <textarea
                                            ref={bodyTextAreaRef}
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            placeholder="Hi {{ customer_name }}, here is your discount..."
                                            className="min-h-[400px] w-full resize-none bg-transparent font-mono text-sm text-gray-700 outline-none placeholder:text-gray-400"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Tip: Use the placeholders on the right to insert dynamic data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Placeholder Manager (1/3 width) */}
                    <div className="flex flex-col gap-6 lg:col-span-1">

                        {/* 1. Placeholder List */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 p-4">
                                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                                    <Tag className="h-4 w-4 text-purple-600" />
                                    Dynamic Placeholders
                                </h3>
                                <p className="text-xs text-gray-500">Variables available for this template.</p>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto p-2">
                                {(() => {
                                    // Merge API placeholders with initial static ones
                                    const apiPlaceholders = placeholderData?.data?.placeholders || [];
                                    const combinedPlaceholders = [
                                        ...initialPlaceholders.filter(ip => !apiPlaceholders.some(ap => ap.slug_name === ip.slug_name)),
                                        ...apiPlaceholders
                                    ];

                                    return combinedPlaceholders.map((ph, idx) => (
                                        <div key={idx} className="group mb-2 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-3 hover:border-purple-200 hover:bg-purple-50">
                                            <div className="flex items-center justify-between">
                                                <code className="rounded bg-white px-1.5 py-0.5 text-xs font-bold text-purple-700 border border-gray-200">
                                                    {`{{ ${ph.slug_name} }}`}
                                                </code>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            console.log('Plus button clicked for:', ph.slug_name);
                                                            insertPlaceholder(ph.slug_name);
                                                        }}
                                                        className="text-gray-400 hover:text-purple-600 cursor-pointer"
                                                        title="Insert into template"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(`{{ ${ph.slug_name} }}`)}
                                                        className="text-gray-400 hover:text-purple-600 cursor-pointer"
                                                        title="Copy"
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </button>
                                                    {'id' in ph && (
                                                        <button
                                                            onClick={() => handleDeletePlaceholder((ph as any).id)}
                                                            className="text-gray-400 hover:text-red-600 cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500">
                                                <Database className="h-3 w-3" />
                                                <span className="truncate">{ph.source}</span>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>

                            {/* Add New Toggle */}
                            {!isAddingPlaceholder && (
                                <div className="p-3">
                                    <button
                                        onClick={() => setIsAddingPlaceholder(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create Placeholder
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 2. Create Placeholder Form (Conditional) */}
                        {isAddingPlaceholder && (
                            <div className="rounded-xl border border-purple-200 bg-white p-4 shadow-md ring-4 ring-purple-50/50">
                                <h3 className="mb-4 text-sm font-bold text-gray-900">Map New Data Source</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Slug Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={newPlaceholder.slug_name}
                                            onChange={(e) => setNewPlaceholder({ ...newPlaceholder, slug_name: e.target.value })}
                                            placeholder="e.g. discount_prefix"
                                            className="w-full rounded border border-gray-200 px-3 py-2 text-xs outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Data Source Path <span className="text-red-500">*</span></label>
                                        <div className="flex items-center rounded border border-gray-200 px-3 py-2 focus-within:border-purple-500">
                                            <Database className="mr-2 h-3 w-3 text-gray-400" />
                                            <select
                                                value={newPlaceholder.source}
                                                onChange={(e) => setNewPlaceholder({ ...newPlaceholder, source: e.target.value })}
                                                className="w-full bg-transparent text-xs outline-none"
                                            >
                                                <option value="" disabled>Select a source</option>
                                                {placeholderData?.data?.allowed_sources.map((source) => (
                                                    <option key={source.value} value={source.value}>
                                                        {source.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
                                        <input
                                            type="text"
                                            value={newPlaceholder.description}
                                            onChange={(e) => setNewPlaceholder({ ...newPlaceholder, description: e.target.value })}
                                            placeholder="Optional description"
                                            className="w-full rounded border border-gray-200 px-3 py-2 text-xs outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={handleAddPlaceholder}
                                            className="flex flex-1 items-center justify-center gap-1 rounded bg-purple-600 py-2 text-xs font-medium text-white hover:bg-purple-700 cursor-pointer"
                                        >
                                            <Check className="h-3 w-3" /> Save
                                        </button>
                                        <button
                                            onClick={() => setIsAddingPlaceholder(false)}
                                            className="rounded border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Help / Info Box */}
                        <div className="rounded-lg bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="mt-0.5 h-4 w-4 text-blue-600" />
                                <div className="text-xs text-blue-800">
                                    <p className="font-semibold">How it works</p>
                                    <p className="mt-1 opacity-80">
                                        Map data sources to slugs. When the email sends,
                                        <code className="mx-1 rounded bg-blue-100 px-1 font-bold">{`{{ slug }}`}</code>
                                        is replaced by the actual value.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: LIST VIEW ---
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header Section */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage and organize your email templates for campaigns.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                {/* 1. "Create New" Card (Always First) */}
                <button
                    onClick={() => {
                        setEditingTemplateId(null);
                        setName('');
                        setSubject('');
                        setBody('');
                        setPurpose('discount');
                        setBodyType('text');
                        setIsDefault(false);
                        setIsCreating(true);
                    }}
                    className="group flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-200 hover:shadow-md cursor-pointer"
                >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 transition-transform group-hover:scale-110">
                        <Plus className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">Create New Template</h3>
                    <p className="text-sm text-gray-500">Start from scratch or import</p>
                </button>

                {/* 2. Render Existing Templates */}
                {isLoadingList ? (
                    <div className="col-span-full flex h-40 items-center justify-center text-gray-400">
                        Loading templates...
                    </div>
                ) : templateData?.data?.email_templates && templateData.data.email_templates.length > 0 ? (
                    templateData.data.email_templates.map((template) => (
                        <div
                            key={template.id}
                            className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                            {/* Card Header */}
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                    <div className="flex gap-2">
                                        {template.is_default && (
                                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                                                Default
                                            </span>
                                        )}
                                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                            {template.body_type.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="mb-3">
                                    <span className="text-xs text-gray-400">Subject</span>
                                    <p className="text-sm font-medium text-gray-800">{template.subject}</p>
                                </div>

                                {/* Purpose */}
                                <div className="mb-3">
                                    <span className="text-xs text-gray-400">Purpose</span>
                                    <p className="text-sm font-medium text-gray-800 capitalize">{template.purpose}</p>
                                </div>

                                {/* Code/Preview Block */}
                                <div className="mb-4 rounded-md bg-gray-50 p-3">
                                    <span className="mb-1 block text-[10px] uppercase text-gray-400">Preview</span>
                                    {template.body_type === 'html' ? (
                                        <div
                                            className="max-h-[150px] w-full overflow-hidden text-xs text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: template.body }}
                                        />
                                    ) : (
                                        <p className="whitespace-pre-wrap font-mono text-xs text-gray-600 line-clamp-3">
                                            {template.body}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer / Actions */}
                            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => handleEdit(template)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    Edit
                                </button>
                                <div className="flex items-center gap-2">
                                    <button className="rounded p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 cursor-pointer">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex h-40 flex-col items-center justify-center text-gray-500">
                        <p>No templates found.</p>
                        <button onClick={() => setIsCreating(true)} className="mt-2 text-sm text-purple-600 hover:underline cursor-pointer">
                            Create your first template
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default EmailTemplateTab