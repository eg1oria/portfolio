import type {
  Contragent,
  Warehouse,
  Paybox,
  Organization,
  PriceType,
  Nomenclature,
  OrderPayload,
} from './types';

function apiUrl(token: string, path: string) {
  return `https://app.tablecrm.com/api/v1${path}?token=${token}`;
}

async function apiFetch<T>(token: string, path: string): Promise<T> {
  const res = await fetch(apiUrl(token, path));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchContragentByPhone(token: string, phone: string): Promise<Contragent[]> {
  const clean = phone.replace(/\D/g, '');
  const res = await fetch(
    `https://app.tablecrm.com/api/v1/contragents/?token=${token}&phone=${clean}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function fetchWarehouses(token: string): Promise<Warehouse[]> {
  const data = await apiFetch<any>(token, '/warehouses/');
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function fetchPayboxes(token: string): Promise<Paybox[]> {
  const data = await apiFetch<any>(token, '/payboxes/');
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function fetchOrganizations(token: string): Promise<Organization[]> {
  const data = await apiFetch<any>(token, '/organizations/');
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function fetchPriceTypes(token: string): Promise<PriceType[]> {
  const data = await apiFetch<any>(token, '/price_types/');
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function fetchNomenclature(token: string, search = ''): Promise<Nomenclature[]> {
  const url = `https://app.tablecrm.com/api/v1/nomenclature/?token=${token}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function createSale(
  token: string,
  payload: OrderPayload,
  conduct = false,
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const body = [{ ...payload, status: conduct }];
    const res = await fetch(`https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ошибка API: ${res.status} ${text}`);
    }
    const data = await res.json();
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
