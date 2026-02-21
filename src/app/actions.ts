import { ProductFormValues } from '../components/product-form/schema';

const API_TOKEN = 'af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77';
const API_URL = `https://app.tablecrm.com/api/v1/nomenclature/?token=${API_TOKEN}`;

export async function createProduct(
  data: ProductFormValues,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([data]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка API: ${response.status} ${errorText}`);
    }

    await response.json();
    return { success: true };
  } catch (error: any) {
    console.error('Create product error:', error);
    return { success: false, error: error.message || 'Неизвестная ошибка' };
  }
}
