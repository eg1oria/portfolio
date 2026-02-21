'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ShoppingCart,
  Search,
  Phone,
  User,
  Building2,
  Warehouse,
  CreditCard,
  Tag,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  Check,
  Loader2,
  LogIn,
  X,
  PackageSearch,
  Receipt,
  BadgeCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type {
  Contragent,
  Warehouse as WarehouseType,
  Paybox,
  Organization,
  PriceType,
  Nomenclature,
  OrderGood,
} from './types';
import {
  fetchContragentByPhone,
  fetchWarehouses,
  fetchPayboxes,
  fetchOrganizations,
  fetchPriceTypes,
  fetchNomenclature,
  createSale,
} from './orderApi';

// ─── Step indicators ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 'auth', label: 'Токен', icon: LogIn },
  { id: 'client', label: 'Клиент', icon: User },
  { id: 'details', label: 'Детали', icon: Receipt },
  { id: 'goods', label: 'Товары', icon: ShoppingCart },
  { id: 'confirm', label: 'Итог', icon: BadgeCheck },
];

type Step = (typeof STEPS)[number]['id'];

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-10">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active ? 'text-slate-900' : done ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 h-px mx-1 mb-3 ${i < idx ? 'bg-emerald-300' : 'bg-slate-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Section card ──────────────────────────────────────────────────────────────
function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
      {title && (
        <div className="px-4 pt-4 pb-2 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Select list ───────────────────────────────────────────────────────────────
function SelectList<T extends { id: number; name: string }>({
  items,
  value,
  onChange,
  loading,
  placeholder,
}: {
  items: T[];
  value: number | null;
  onChange: (id: number) => void;
  loading?: boolean;
  placeholder?: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Загрузка...</span>
      </div>
    );
  }
  if (!items.length) {
    return <p className="text-sm text-slate-400 text-center py-4">{placeholder ?? 'Нет данных'}</p>;
  }
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
            value === item.id
              ? 'bg-slate-900 text-white font-medium'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}>
          <span>{item.name}</span>
          {value === item.id && <Check className="w-4 h-4" />}
        </button>
      ))}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────
export function OrderForm() {
  const [step, setStep] = useState<Step>('auth');

  // Auth
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Client
  const [phone, setPhone] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [contragent, setContragent] = useState<Contragent | null>(null);
  const [contragentId, setContragentId] = useState<number | null>(null);

  // Details
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [payboxes, setPayboxes] = useState<Paybox[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [payboxId, setPayboxId] = useState<number | null>(null);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [priceTypeId, setPriceTypeId] = useState<number | null>(null);

  // Goods
  const [nomenclature, setNomenclature] = useState<Nomenclature[]>([]);
  const [nomenclatureLoading, setNomenclatureLoading] = useState(false);
  const [goodsSearch, setGoodsSearch] = useState('');
  const [cart, setCart] = useState<OrderGood[]>([]);

  // Submit
  const [submitting, setSubmitting] = useState(false);

  // ── Auth ──────────────────────────────────────────────────────────────────────
  const handleAuth = async () => {
    const t = tokenInput.trim();
    if (!t) {
      toast.error('Введите токен');
      return;
    }
    setAuthLoading(true);
    try {
      await fetchWarehouses(t); // validate token
      setToken(t);
      localStorage.setItem('crm_token', t);
      toast.success('Авторизация успешна');
      setStep('client');
    } catch {
      toast.error('Неверный токен или нет соединения');
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('crm_token');
    if (saved) {
      setTokenInput(saved);
      setToken(saved);
      setStep('client');
    }
  }, []);

  // ── Client ────────────────────────────────────────────────────────────────────
  const handlePhoneSearch = async () => {
    if (phone.replace(/\D/g, '').length < 7) {
      toast.error('Введите номер телефона');
      return;
    }
    setPhoneLoading(true);
    try {
      const results = await fetchContragentByPhone(token, phone);
      if (results.length > 0) {
        setContragent(results[0]);
        setContragentId(results[0].id);
        toast.success(`Клиент найден: ${results[0].name}`);
      } else {
        setContragent(null);
        setContragentId(null);
        toast.error('Клиент не найден');
      }
    } catch {
      toast.error('Ошибка поиска');
    } finally {
      setPhoneLoading(false);
    }
  };

  // ── Details ───────────────────────────────────────────────────────────────────
  const loadDetails = useCallback(async () => {
    if (!token) return;
    setDetailsLoading(true);
    try {
      const [wh, pb, org, pt] = await Promise.all([
        fetchWarehouses(token),
        fetchPayboxes(token),
        fetchOrganizations(token),
        fetchPriceTypes(token),
      ]);
      setWarehouses(wh);
      setPayboxes(pb);
      setOrganizations(org);
      setPriceTypes(pt);
      if (wh[0]) setWarehouseId(wh[0].id);
      if (pb[0]) setPayboxId(pb[0].id);
      if (org[0]) setOrganizationId(org[0].id);
      if (pt[0]) setPriceTypeId(pt[0].id);
    } catch {
      toast.error('Ошибка загрузки справочников');
    } finally {
      setDetailsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (step === 'details') loadDetails();
  }, [step, loadDetails]);

  // ── Goods ─────────────────────────────────────────────────────────────────────
  const loadNomenclature = useCallback(
    async (search = '') => {
      if (!token) return;
      setNomenclatureLoading(true);
      try {
        const items = await fetchNomenclature(token, search);
        setNomenclature(items);
      } catch {
        toast.error('Ошибка загрузки товаров');
      } finally {
        setNomenclatureLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (step === 'goods') loadNomenclature();
  }, [step, loadNomenclature]);

  useEffect(() => {
    if (step !== 'goods') return;
    const timer = setTimeout(() => loadNomenclature(goodsSearch), 400);
    return () => clearTimeout(timer);
  }, [goodsSearch, step, loadNomenclature]);

  const addToCart = (item: Nomenclature) => {
    setCart((prev) => {
      const existing = prev.find((g) => g.nomenclature === item.id);
      if (existing) {
        return prev.map((g) =>
          g.nomenclature === item.id ? { ...g, quantity: g.quantity + 1 } : g,
        );
      }
      return [
        ...prev,
        {
          nomenclature: item.id,
          name: item.name,
          price: item.price ?? 0,
          quantity: 1,
          unit: item.unit ?? 116,
          discount: 0,
          sum_discounted: 0,
        },
      ];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((g) => (g.nomenclature === id ? { ...g, quantity: g.quantity + delta } : g))
        .filter((g) => g.quantity > 0),
    );
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((g) => g.nomenclature !== id));

  const totalAmount = cart.reduce((sum, g) => sum + g.price * g.quantity, 0);

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (conduct: boolean) => {
    if (!contragentId || !warehouseId || !payboxId || !organizationId) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    if (cart.length === 0) {
      toast.error('Добавьте хотя бы один товар');
      return;
    }
    setSubmitting(true);
    const payload = {
      priority: 0,
      dated: Math.floor(Date.now() / 1000),
      operation: 'Заказ',
      tax_included: true,
      tax_active: true,
      goods: cart,
      settings: {},
      ...(contragent?.loyalty_card_id ? { loyality_card_id: contragent.loyalty_card_id } : {}),
      warehouse: warehouseId,
      contragent: contragentId,
      paybox: payboxId,
      organization: organizationId,
      status: conduct,
      paid_rubles: totalAmount,
      paid_lt: 0,
    };
    const result = await createSale(token, payload, conduct);
    setSubmitting(false);
    if (result.success) {
      toast.success(conduct ? 'Заказ создан и проведён!' : 'Заказ создан!');
      setCart([]);
      setStep('client');
    } else {
      toast.error(result.error ?? 'Ошибка создания заказа');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-none">TableCRM</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">Новый заказ</p>
            </div>
          </div>
          {token && (
            <button
              onClick={() => {
                setToken('');
                setStep('auth');
                localStorage.removeItem('crm_token');
              }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors">
              Выйти
            </button>
          )}
        </div>

        <StepBar current={step} />

        <div className="px-4 pt-4 max-w-lg mx-auto">
          {/* ── STEP: AUTH ─────────────────────────────────────────────────── */}
          {step === 'auth' && (
            <Section title="Авторизация">
              <p className="text-sm text-slate-500 mb-4">
                Введите токен вашей кассы для подключения к TableCRM
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                    placeholder="Вставьте токен..."
                    className="pl-9 font-mono text-sm border-slate-200"
                  />
                </div>
                <Button
                  onClick={handleAuth}
                  disabled={authLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 gap-2">
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Подключиться
                </Button>
              </div>
            </Section>
          )}

          {/* ── STEP: CLIENT ───────────────────────────────────────────────── */}
          {step === 'client' && (
            <>
              <Section title="Поиск клиента">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePhoneSearch()}
                      placeholder="+7 (999) 000-00-00"
                      className="pl-9 border-slate-200"
                    />
                  </div>
                  <Button
                    onClick={handlePhoneSearch}
                    disabled={phoneLoading}
                    variant="outline"
                    className="border-slate-200 gap-1.5 shrink-0">
                    {phoneLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Найти
                  </Button>
                </div>

                {contragent && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{contragent.name}</p>
                        <p className="text-xs text-slate-500">{phone}</p>
                        {contragent.loyalty_card_id && (
                          <Badge variant="secondary" className="mt-0.5 text-[10px] py-0">
                            Карта лояльности
                          </Badge>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setContragent(null);
                        setContragentId(null);
                        setPhone('');
                      }}>
                      <X className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                )}
              </Section>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setStep('details')}
                  className="w-full bg-slate-900 hover:bg-slate-800 gap-2"
                  disabled={!contragentId}>
                  Продолжить
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setContragentId(-1);
                    setStep('details');
                  }}
                  className="w-full text-slate-500 text-sm">
                  Продолжить без клиента
                </Button>
              </div>
            </>
          )}

          {/* ── STEP: DETAILS ──────────────────────────────────────────────── */}
          {step === 'details' && (
            <>
              <Section title="Счёт">
                <SelectList
                  items={payboxes}
                  value={payboxId}
                  onChange={setPayboxId}
                  loading={detailsLoading}
                />
              </Section>

              <Section title="Организация">
                <SelectList
                  items={organizations}
                  value={organizationId}
                  onChange={setOrganizationId}
                  loading={detailsLoading}
                />
              </Section>

              <Section title="Склад">
                <SelectList
                  items={warehouses}
                  value={warehouseId}
                  onChange={setWarehouseId}
                  loading={detailsLoading}
                />
              </Section>

              <Section title="Тип цены">
                <SelectList
                  items={priceTypes}
                  value={priceTypeId}
                  onChange={setPriceTypeId}
                  loading={detailsLoading}
                />
              </Section>

              <Button
                onClick={() => setStep('goods')}
                disabled={!warehouseId || !payboxId || !organizationId}
                className="w-full bg-slate-900 hover:bg-slate-800 gap-2 mb-4">
                К выбору товаров
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* ── STEP: GOODS ────────────────────────────────────────────────── */}
          {step === 'goods' && (
            <>
              {/* Cart summary */}
              {cart.length > 0 && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Корзина</p>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {cart.length} поз.
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {cart.map((g) => (
                      <div key={g.nomenclature} className="flex items-center gap-2">
                        <span className="text-sm flex-1 truncate text-slate-300">{g.name}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQty(g.nomenclature, -1)}
                            className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-mono w-5 text-center">{g.quantity}</span>
                          <button
                            onClick={() => updateQty(g.nomenclature, 1)}
                            className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeFromCart(g.nomenclature)} className="ml-1">
                            <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-300" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold w-20 text-right">
                          {(g.price * g.quantity).toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/20 mt-3 pt-3 flex justify-between">
                    <span className="text-sm text-slate-400">Итого</span>
                    <span className="font-bold">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={goodsSearch}
                  onChange={(e) => setGoodsSearch(e.target.value)}
                  placeholder="Поиск товара..."
                  className="pl-9 border-slate-200 bg-white"
                />
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                {nomenclatureLoading ? (
                  <div className="flex items-center justify-center py-10 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span className="text-sm">Загрузка товаров...</span>
                  </div>
                ) : nomenclature.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                    <PackageSearch className="w-8 h-8" />
                    <span className="text-sm">Товары не найдены</span>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {nomenclature.map((item) => {
                      const inCart = cart.find((g) => g.nomenclature === item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.price
                                ? `${item.price.toLocaleString('ru-RU')} ₽`
                                : 'Цена не указана'}
                            </p>
                          </div>
                          {inCart ? (
                            <div className="flex items-center gap-1.5 ml-3">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                                <Minus className="w-3.5 h-3.5 text-slate-700" />
                              </button>
                              <span className="text-sm font-semibold w-5 text-center">
                                {inCart.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-700 flex items-center justify-center transition-colors">
                                <Plus className="w-3.5 h-3.5 text-white" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="ml-3 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all group">
                              <Plus className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setStep('confirm')}
                disabled={cart.length === 0}
                className="w-full bg-slate-900 hover:bg-slate-800 gap-2 mb-4">
                К оформлению
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* ── STEP: CONFIRM ──────────────────────────────────────────────── */}
          {step === 'confirm' && (
            <>
              {/* Client */}
              <Section title="Клиент">
                {contragent ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{contragent.name}</p>
                      <p className="text-xs text-slate-400">{phone}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Без клиента</p>
                )}
              </Section>

              {/* Settings */}
              <Section title="Параметры заказа">
                <div className="space-y-2 text-sm">
                  {[
                    {
                      label: 'Счёт',
                      icon: CreditCard,
                      value: payboxes.find((p) => p.id === payboxId)?.name,
                    },
                    {
                      label: 'Организация',
                      icon: Building2,
                      value: organizations.find((o) => o.id === organizationId)?.name,
                    },
                    {
                      label: 'Склад',
                      icon: Warehouse,
                      value: warehouses.find((w) => w.id === warehouseId)?.name,
                    },
                    {
                      label: 'Тип цены',
                      icon: Tag,
                      value: priceTypes.find((p) => p.id === priceTypeId)?.name,
                    },
                  ].map(({ label, icon: Icon, value }) => (
                    <div key={label} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </div>
                      <span className="font-medium text-slate-900">{value ?? '—'}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Goods */}
              <Section title="Товары">
                <div className="space-y-2">
                  {cart.map((g) => (
                    <div key={g.nomenclature} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 flex-1 truncate">{g.name}</span>
                      <span className="text-slate-500 mx-2">×{g.quantity}</span>
                      <span className="font-semibold text-slate-900">
                        {(g.price * g.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold">
                    <span className="text-slate-700">Итого</span>
                    <span className="text-slate-900">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </Section>

              {/* Buttons */}
              <div className="space-y-2 mb-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleSubmit(false)}
                      disabled={submitting}
                      variant="outline"
                      className="w-full border-slate-900 text-slate-900 hover:bg-slate-50 gap-2">
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Receipt className="w-4 h-4" />
                      )}
                      Создать заказ
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Создать заказ без проведения</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleSubmit(true)}
                      disabled={submitting}
                      className="w-full bg-slate-900 hover:bg-slate-800 gap-2">
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <BadgeCheck className="w-4 h-4" />
                      )}
                      Создать и провести
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Создать заказ и сразу провести его</TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
