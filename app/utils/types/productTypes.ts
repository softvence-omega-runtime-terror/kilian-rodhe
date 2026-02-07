export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  is_active: boolean;
  category?: { title: string };
  age_range?: { start: number; end: number };
  color_code?: string;
  cloth_size?: string[];
  kids_size?: string[];
  mug_size?: string[];
  stock_quantity?: number | null;
  total_sold?: number | null;
  price?: string | number | null;
  discounted_price?: string | number | null;
  created_at?: string;
  images?: ProductImage[];
}


// --- Types ---

export interface EmailTemplate {
  id: string;
  title: string;
  status: 'Active' | 'Draft';
  subject: string;
  preview: string;
  lastEdited: string;
}

export interface Placeholder {
  slug_name: string;
  description: string;
  source: string;
}

// --- Mock Data ---

export const templates: EmailTemplate[] = [
  {
    id: '1',
    title: 'Seasonal Sale',
    status: 'Active',
    subject: 'Summer Sale is here! ☀️',
    preview: 'Hi {name},\n\nThank you for being a valued customer! Here\'s your exclusive discount code:',
    lastEdited: 'Today'
  },
  {
    id: '2',
    title: 'Welcome User',
    status: 'Active',
    subject: 'Welcome {name}! Here is your discount',
    preview: 'Hi {name},\n\nWelcome to Tundra! We are thrilled to have you.',
    lastEdited: 'Yesterday'
  },
  {
    id: '3',
    title: 'Cart Abandonment',
    status: 'Active',
    subject: 'You left something behind...',
    preview: 'Hi {name},\n\nWe noticed you left some items in your cart.',
    lastEdited: 'Last week'
  },
  {
    id: '4',
    title: 'Birthday Special',
    status: 'Draft',
    subject: 'Happy Birthday! 🎂',
    preview: 'Hi {name},\n\nHappy Birthday! We hope you have a fantastic day.',
    lastEdited: '2 weeks ago'
  },
  {
    id: '5',
    title: 'Winback Campaign',
    status: 'Draft',
    subject: 'We miss you {name}',
    preview: 'Hi {name},\n\nIt\'s been a while since we saw you.',
    lastEdited: '1 month ago'
  },
];