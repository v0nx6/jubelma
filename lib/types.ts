export type FormState = {
  error?: string;
  success?: string;
  values?: Record<string, string>;
};

export type ItemWithSeller = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  price: number;
  condition: string;
  usageMonths: number;
  warrantyDays: number;
  codPoint: string;
  image: string;
  status: string;
  createdAt: Date;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    major: string;
    whatsapp: string;
  };
  sellerRating?: { average: number; count: number };
};
