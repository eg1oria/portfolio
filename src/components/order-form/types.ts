export interface Contragent {
  id: number;
  name: string;
  phone?: string;
  card_id?: number;
  loyalty_card_id?: number;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface Paybox {
  id: number;
  name: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface PriceType {
  id: number;
  name: string;
}

export interface Nomenclature {
  id: number;
  name: string;
  price?: number;
  unit?: number;
}

export interface OrderGood {
  nomenclature: number;
  name: string;
  price: number;
  quantity: number;
  unit: number;
  discount: number;
  sum_discounted: number;
}

export interface RepeatSettings {
  repeatability_period: string;
  repeatability_value: string;
  repeatability_count: string;
  date_next_created: number;
}

export interface OrderPayload {
  priority: number;
  dated: number;
  operation: string;
  tax_included: boolean;
  tax_active: boolean;
  goods: OrderGood[];
  settings: Partial<RepeatSettings>;
  loyality_card_id?: number;
  warehouse: number;
  contragent: number;
  paybox: number;
  organization: number;
  status: boolean;
  paid_rubles: number | string;
  paid_lt: number;
}
