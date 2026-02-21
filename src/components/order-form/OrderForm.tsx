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

import '../components.css';

// ─── Step bar ─────────────────────────────────────────────────────────────────

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
    <div className="stepbar">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        const Icon = step.icon;
        return (
          <div key={step.id} style={{ display: 'contents' }}>
            <div className="stepbar__item">
              <div className={`stepbar__icon${done ? ' done' : active ? ' active' : ''}`}>
                {done ? (
                  <Check style={{ width: 15, height: 15 }} />
                ) : (
                  <Icon style={{ width: 15, height: 15 }} />
                )}
              </div>
              <span className={`stepbar__label${active ? ' active' : ''}`}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`stepbar__line${done ? ' done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="section">
      {title && <p className="section__title">{title}</p>}
      <div className="section__body">{children}</div>
    </div>
  );
}

// ─── Select list ──────────────────────────────────────────────────────────────

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
      <div className="loading-state">
        <span className="spin" />
        Загрузка...
      </div>
    );
  }
  if (!items.length) return <div className="empty-state">{placeholder ?? 'Нет данных'}</div>;
  return (
    <div className="select-list">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`select-item${value === item.id ? ' selected' : ''}`}>
          {item.name}
          {value === item.id && <Check style={{ width: 14, height: 14 }} />}
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

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

  // ── Auth ──────────────────────────────────────────────────────────────────

  const handleAuth = async () => {
    const t = tokenInput.trim();
    if (!t) {
      toast.error('Введите токен');
      return;
    }
    setAuthLoading(true);
    try {
      await fetchWarehouses(t);
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

  // ── Client ────────────────────────────────────────────────────────────────

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

  // ── Details ───────────────────────────────────────────────────────────────

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

  // ── Goods ─────────────────────────────────────────────────────────────────

  const loadNomenclature = useCallback(
    async (search = '') => {
      if (!token) return;
      setNomenclatureLoading(true);
      try {
        setNomenclature(await fetchNomenclature(token, search));
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
      if (existing)
        return prev.map((g) =>
          g.nomenclature === item.id ? { ...g, quantity: g.quantity + 1 } : g,
        );
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

  // ── Submit ────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <TooltipProvider delayDuration={300}>
      <div className="order-page">
        <div className="order-wrap">
          {/* Header */}
          <div className="order-header">
            <div className="order-header__brand">
              <div className="order-header__logo">
                <ShoppingCart style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <div className="order-header__name">TableCRM</div>
                <div className="order-header__sub">Новый заказ</div>
              </div>
            </div>
            {token && (
              <button
                type="button"
                className="order-header__exit"
                onClick={() => {
                  setToken('');
                  setStep('auth');
                  localStorage.removeItem('crm_token');
                }}>
                Выйти
              </button>
            )}
          </div>

          {/* Step bar */}
          <StepBar current={step} />

          {/* ── STEP: AUTH ─────────────────────────────────────────────── */}
          {step === 'auth' && (
            <Section>
              <p className="auth-desc">Введите токен вашей кассы для подключения к TableCRM</p>
              <div style={{ position: 'relative' }}>
                <LogIn
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--c-ink-400)',
                    width: 16,
                    height: 16,
                  }}
                />
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                  placeholder="Вставьте токен..."
                  className="inp mono"
                  style={{ paddingLeft: 36, marginBottom: 10 }}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={handleAuth}
                disabled={authLoading}>
                {authLoading ? (
                  <span className="spin" />
                ) : (
                  <ChevronRight style={{ width: 15, height: 15 }} />
                )}
                Подключиться
              </button>
            </Section>
          )}

          {/* ── STEP: CLIENT ───────────────────────────────────────────── */}
          {step === 'client' && (
            <>
              <Section title="Поиск клиента">
                <div className="search-row">
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Phone
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--c-ink-400)',
                        width: 15,
                        height: 15,
                      }}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePhoneSearch()}
                      placeholder="+7 (999) 000-00-00"
                      className="inp"
                      style={{ paddingLeft: 36 }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePhoneSearch}
                    disabled={phoneLoading}>
                    {phoneLoading ? (
                      <span className="spin" />
                    ) : (
                      <Search style={{ width: 15, height: 15 }} />
                    )}
                    Найти
                  </button>
                </div>

                {contragent && (
                  <div className="client-card">
                    <div className="client-card__info">
                      <div className="client-card__name">{contragent.name}</div>
                      <div className="client-card__phone">{phone}</div>
                      {contragent.loyalty_card_id && (
                        <span className="client-card__badge">Карта лояльности</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="client-card__clear"
                      onClick={() => {
                        setContragent(null);
                        setContragentId(null);
                        setPhone('');
                      }}>
                      <X style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                )}
              </Section>

              <div className="action-stack">
                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  onClick={() => setStep('details')}
                  disabled={!contragentId}>
                  Продолжить <ChevronRight style={{ width: 15, height: 15 }} />
                </button>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => {
                    setContragentId(-1);
                    setStep('details');
                  }}>
                  Продолжить без клиента
                </button>
              </div>
            </>
          )}

          {/* ── STEP: DETAILS ──────────────────────────────────────────── */}
          {step === 'details' && (
            <>
              <Section title="Счёт">
                <SelectList
                  items={payboxes}
                  value={payboxId}
                  onChange={setPayboxId}
                  loading={detailsLoading}
                  placeholder="Нет счетов"
                />
              </Section>
              <Section title="Организация">
                <SelectList
                  items={organizations}
                  value={organizationId}
                  onChange={setOrganizationId}
                  loading={detailsLoading}
                  placeholder="Нет организаций"
                />
              </Section>
              <Section title="Склад">
                <SelectList
                  items={warehouses}
                  value={warehouseId}
                  onChange={setWarehouseId}
                  loading={detailsLoading}
                  placeholder="Нет складов"
                />
              </Section>
              <Section title="Тип цены">
                <SelectList
                  items={priceTypes}
                  value={priceTypeId}
                  onChange={setPriceTypeId}
                  loading={detailsLoading}
                  placeholder="Нет типов цены"
                />
              </Section>
              <button
                type="button"
                className="btn btn-primary btn-full"
                style={{ marginTop: 4 }}
                onClick={() => setStep('goods')}
                disabled={!warehouseId || !payboxId || !organizationId}>
                К выбору товаров <ChevronRight style={{ width: 15, height: 15 }} />
              </button>
            </>
          )}

          {/* ── STEP: GOODS ────────────────────────────────────────────── */}
          {step === 'goods' && (
            <>
              {cart.length > 0 && (
                <div className="cart-box">
                  <div className="cart-header">
                    <span className="cart-title">Корзина</span>
                    <span className="cart-badge">{cart.length} поз.</span>
                  </div>
                  {cart.map((g) => (
                    <div key={g.nomenclature} className="cart-item">
                      <span className="cart-item__name">{g.name}</span>
                      <div className="cart-item__controls">
                        <button
                          type="button"
                          className="cart-btn"
                          onClick={() => updateQty(g.nomenclature, -1)}>
                          <Minus style={{ width: 12, height: 12 }} />
                        </button>
                        <span className="cart-item__qty">{g.quantity}</span>
                        <button
                          type="button"
                          className="cart-btn"
                          onClick={() => updateQty(g.nomenclature, 1)}>
                          <Plus style={{ width: 12, height: 12 }} />
                        </button>
                        <button
                          type="button"
                          className="cart-btn cart-item__del"
                          onClick={() => removeFromCart(g.nomenclature)}>
                          <Trash2 style={{ width: 12, height: 12 }} />
                        </button>
                      </div>
                      <span className="cart-item__price">
                        {(g.price * g.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                  <div className="cart-total">
                    <span className="cart-total__label">Итого</span>
                    <span>{totalAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              )}

              <div className="goods-search">
                <Search className="goods-search__icon" style={{ width: 15, height: 15 }} />
                <input
                  type="text"
                  value={goodsSearch}
                  onChange={(e) => setGoodsSearch(e.target.value)}
                  placeholder="Поиск товара..."
                  className="inp"
                  style={{ paddingLeft: 36 }}
                />
              </div>

              <div className="goods-list">
                {nomenclatureLoading ? (
                  <div className="loading-state">
                    <span className="spin" /> Загрузка товаров...
                  </div>
                ) : nomenclature.length === 0 ? (
                  <div className="empty-state">
                    <PackageSearch style={{ width: 20, height: 20 }} /> Товары не найдены
                  </div>
                ) : (
                  nomenclature.map((item) => {
                    const inCart = cart.find((g) => g.nomenclature === item.id);
                    return (
                      <div key={item.id} className="goods-item">
                        <div className="goods-item__info">
                          <div className="goods-item__name">{item.name}</div>
                          <div className="goods-item__price">
                            {item.price
                              ? `${item.price.toLocaleString('ru-RU')} ₽`
                              : 'Цена не указана'}
                          </div>
                        </div>
                        <div className="goods-item__controls">
                          {inCart ? (
                            <>
                              <button
                                type="button"
                                className="goods-btn goods-btn-minus"
                                onClick={() => updateQty(item.id, -1)}>
                                <Minus style={{ width: 13, height: 13 }} />
                              </button>
                              <span className="goods-item__qty">{inCart.quantity}</span>
                              <button
                                type="button"
                                className="goods-btn goods-btn-plus"
                                onClick={() => updateQty(item.id, 1)}>
                                <Plus style={{ width: 13, height: 13 }} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="goods-btn goods-btn-add"
                              onClick={() => addToCart(item)}>
                              <Plus style={{ width: 13, height: 13 }} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full"
                style={{ marginTop: 14 }}
                onClick={() => setStep('confirm')}
                disabled={cart.length === 0}>
                К оформлению <ChevronRight style={{ width: 15, height: 15 }} />
              </button>
            </>
          )}

          {/* ── STEP: CONFIRM ──────────────────────────────────────────── */}
          {step === 'confirm' && (
            <>
              <Section title="Клиент">
                {contragent ? (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--c-ink-900)' }}>
                      {contragent.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--c-ink-400)', marginTop: 2 }}>
                      {phone}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--c-ink-400)' }}>Без клиента</div>
                )}
              </Section>

              <Section title="Параметры">
                <div className="confirm-settings">
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
                    <div key={label} className="confirm-setting-row">
                      <Icon
                        className="confirm-setting-row__icon"
                        style={{ width: 15, height: 15 }}
                      />
                      <span className="confirm-setting-row__label">{label}</span>
                      <span className="confirm-setting-row__value">{value ?? '—'}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Товары">
                <div className="confirm-goods">
                  {cart.map((g) => (
                    <div key={g.nomenclature} className="confirm-good-row">
                      <span>
                        {g.name} ×{g.quantity}
                      </span>
                      <span>{(g.price * g.quantity).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                  <div className="confirm-total">
                    <span>Итого</span>
                    <span>{totalAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </Section>

              <div className="confirm-btns">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="btn btn-outline btn-full"
                      onClick={() => handleSubmit(false)}
                      disabled={submitting}>
                      {submitting ? (
                        <span className="spin" />
                      ) : (
                        <Receipt style={{ width: 15, height: 15 }} />
                      )}
                      Создать заказ
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Создать заказ без проведения</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="btn btn-primary btn-full"
                      onClick={() => handleSubmit(true)}
                      disabled={submitting}>
                      {submitting ? (
                        <span className="spin" />
                      ) : (
                        <BadgeCheck style={{ width: 15, height: 15 }} />
                      )}
                      Создать и провести
                    </button>
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
