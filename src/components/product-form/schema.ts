import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Название должно быть не короче 3 символов'),
  type: z.string().default('product'),
  description_short: z.string().max(255, 'Слишком длинное краткое описание').optional(),
  description_long: z.string().optional(),
  code: z.string().min(1, 'Артикул обязателен'),
  unit: z.number().min(1, 'Выберите единицу измерения'),
  category: z.number().min(1, 'Выберите категорию'),
  cashback_type: z.string().default('lcard_cashback'),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.array(z.string()).default([]),
  global_category_id: z.number().min(1, 'Выберите глобальную категорию'),
  marketplace_price: z.number().min(0, 'Цена не может быть отрицательной'),
  chatting_percent: z.number().min(0).max(100),
  address: z.string().min(5, 'Введите полный адрес'),
  latitude: z.number(),
  longitude: z.number(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
