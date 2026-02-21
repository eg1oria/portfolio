'use server';

import { ProductFormValues } from '../components/product-form/schema';

export async function createProductAction(data: ProductFormValues) {
  const API_TOKEN = 'af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77';
  const URL = `https://app.tablecrm.com/api/v1/nomenclature/?token=${API_TOKEN}`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([data]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка API: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Create product error:', error);
    return { success: false, error: error.message || 'Неизвестная ошибка' };
  }
}
