'use client';

import { useState, useTransition } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import '../components.css';
import {
  Sparkles,
  Save,
  Package,
  FileText,
  BadgeDollarSign,
  MapPin,
  ChevronRight,
  Loader2,
  Info,
} from 'lucide-react';
import { productSchema, type ProductFormValues } from './schema';
import { createProduct } from '@/app/actions';
import { TagInput } from './TagInput';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TABS = [
  {
    value: 'basic',
    label: 'Основное',
    icon: Package,
    tooltip: 'Название, артикул и категория товара',
  },
  {
    value: 'content',
    label: 'Контент и SEO',
    icon: FileText,
    tooltip: 'Описания и ключевые слова для поиска',
  },
  { value: 'pricing', label: 'Финансы', icon: BadgeDollarSign, tooltip: 'Цена и расчёт комиссии' },
  { value: 'logistics', label: 'Локация', icon: MapPin, tooltip: 'Адрес и координаты склада' },
];

function FieldHint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="field-hint">
          <Info style={{ width: 14, height: 14 }} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{text}</TooltipContent>
    </Tooltip>
  );
}

export function ProductCreateForm() {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues, any>,
    defaultValues: {
      type: 'product',
      name: '',
      code: '',
      description_short: '',
      description_long: '',
      seo_title: '',
      seo_description: '',
      cashback_type: 'lcard_cashback',
      seo_keywords: [],
      chatting_percent: 4,
      marketplace_price: 0,
      address: 'улица Зайцева 8, Ново-Татарская слобода, Казань, TT, Россия, 420108',
      latitude: 55.7711953,
      longitude: 49.10211794999999,
      unit: 116,
      category: 2477,
      global_category_id: 127,
    },
  });

  const handleAIGeneration = async () => {
    const productName = form.getValues('name');
    if (!productName || productName.length < 3) {
      toast.error('Введите название товара (от 3 символов)');
      return;
    }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    form.setValue(
      'description_short',
      `Отличный выбор: ${productName}. Высокое качество, стильный дизайн и надёжность.`,
    );
    form.setValue(
      'description_long',
      `Подробное описание товара «${productName}». Идеально подходит для повседневного использования. Изготовлено из экологичных материалов.`,
    );
    form.setValue('seo_title', `Купить ${productName} с доставкой | Лучшая цена`);
    form.setValue('seo_keywords', [
      productName.toLowerCase(),
      'купить',
      'доставка',
      'скидка',
      'оригинал',
    ]);
    form.setValue('code', `ART-${Math.floor(Math.random() * 100000)}`);
    setIsGenerating(false);
    toast.success('AI заполнил описание, SEO-теги и артикул');
  };

  const onSubmit = (data: ProductFormValues) => {
    startTransition(async () => {
      const result = await createProduct(data);
      if (result.success) {
        toast.success('Товар успешно опубликован!');
        form.reset();
      } else toast.error(`Ошибка: ${result.error}`);
    });
  };

  const activeTabIndex = TABS.findIndex((t) => t.value === activeTab);
  const goNext = () => {
    if (activeTabIndex < TABS.length - 1) setActiveTab(TABS[activeTabIndex + 1].value);
  };

  const price = form.watch('marketplace_price');
  const percent = form.watch('chatting_percent');
  const commission = (price * percent) / 100;
  const payout = price - commission;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="product-page">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="product-form">
            {/* Header */}
            <div className="product-header">
              <div>
                <p className="product-header__eyebrow">Маркетплейс</p>
                <h1 className="product-header__title">Новая карточка товара</h1>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="btn-ai"
                    onClick={handleAIGeneration}
                    disabled={isGenerating}>
                    {isGenerating ? (
                      <span className="spin" />
                    ) : (
                      <Sparkles style={{ width: 16, height: 16 }} />
                    )}
                    {isGenerating ? 'Генерация...' : 'Заполнить с AI'}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Автоматически заполнит описание, SEO-теги и сгенерирует артикул на основе названия
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Card */}
            <div className="product-card">
              {/* Tabs nav */}
              <div className="tabs-nav" role="tablist">
                {TABS.map(({ value, label, icon: Icon, tooltip }) => (
                  <Tooltip key={value}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === value}
                        className="tab-trigger"
                        onClick={() => setActiveTab(value)}>
                        <Icon style={{ width: 14, height: 14 }} />
                        {label}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{tooltip}</TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {/* ── Tab: Basic ── */}
              {activeTab === 'basic' && (
                <div className="tab-panel">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="field">
                          <label className="field-label">
                            Название товара <span className="required">*</span>
                            <FieldHint text="Полное коммерческое название. Должно быть понятным и содержать ключевые характеристики." />
                          </label>
                          <FormControl>
                            <input
                              className="inp"
                              placeholder="Например: Беспроводные наушники Sony WH-1000XM5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="field-grid">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <div className="field">
                            <label className="field-label">
                              Артикул <span className="required">*</span>
                              <FieldHint text="Уникальный идентификатор товара (SKU). Используется для складского учёта и поиска." />
                            </label>
                            <FormControl>
                              <input className="inp mono" placeholder="SKU-12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <div className="field">
                            <label className="field-label">
                              Категория <span className="required">*</span>
                              <FieldHint text="Определяет, в каком разделе каталога будет отображаться товар." />
                            </label>
                            <FormControl>
                              <select
                                className="inp"
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}>
                                <option value="2477">Электроника</option>
                                <option value="2478">Одежда</option>
                                <option value="2479">Дом и сад</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* ── Tab: Content ── */}
              {activeTab === 'content' && (
                <div className="tab-panel">
                  <FormField
                    control={form.control}
                    name="description_short"
                    render={({ field }) => (
                      <FormItem>
                        <div className="field">
                          <label className="field-label">
                            Краткое описание
                            <FieldHint text="Отображается в карточке товара и списках. До 255 символов. Чётко и ёмко." />
                          </label>
                          <FormControl>
                            <textarea
                              className="inp-area"
                              rows={3}
                              placeholder="Главные преимущества товара в 1–2 предложениях..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description_long"
                    render={({ field }) => (
                      <FormItem>
                        <div className="field">
                          <label className="field-label">
                            Полное описание
                            <FieldHint text="Развёрнутое описание на странице товара. Укажите материалы, характеристики и особенности." />
                          </label>
                          <FormControl>
                            <textarea
                              className="inp-area"
                              rows={5}
                              placeholder="Подробное описание: материалы, характеристики, применение..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <div className="field">
                          <label className="field-label">
                            SEO-заголовок
                            <FieldHint text="Заголовок страницы в браузере и поисковой выдаче. Влияет на позицию в Google и Яндексе." />
                          </label>
                          <FormControl>
                            <input
                              className="inp"
                              placeholder="Купить [товар] с доставкой | Лучшая цена"
                              {...field}
                            />
                          </FormControl>
                          <p className="field-description">Рекомендуется до 60 символов</p>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seo_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <div className="field">
                          <label className="field-label">
                            Ключевые слова
                            <FieldHint text="Слова, по которым покупатели ищут товар. Добавьте синонимы, бренд и характеристики." />
                          </label>
                          <FormControl>
                            <TagInput value={field.value} onChange={field.onChange} />
                          </FormControl>
                          <p className="field-description">Вводите слова через запятую или Enter</p>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* ── Tab: Pricing ── */}
              {activeTab === 'pricing' && (
                <div className="tab-panel">
                  <div className="field-grid">
                    <FormField
                      control={form.control}
                      name="marketplace_price"
                      render={({ field }) => (
                        <FormItem>
                          <div className="field">
                            <label className="field-label">
                              Цена <span className="required">*</span>
                              <FieldHint text="Итоговая цена для покупателя на маркетплейсе. Без скидок и акций." />
                            </label>
                            <FormControl>
                              <div className="inp-wrap">
                                <span className="inp-prefix">₽</span>
                                <input
                                  type="number"
                                  className="inp"
                                  {...field}
                                  onChange={(e) => field.onChange(+e.target.value)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chatting_percent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="field">
                            <label className="field-label">
                              Процент чаттинга
                              <FieldHint text="Комиссия маркетплейса за продажу через чат. Вычитается из итоговой выплаты." />
                            </label>
                            <FormControl>
                              <div className="inp-wrap">
                                <input
                                  type="number"
                                  className="inp has-suffix"
                                  {...field}
                                  onChange={(e) => field.onChange(+e.target.value)}
                                />
                                <span className="inp-suffix">%</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {price > 0 && (
                    <div className="pricing-box">
                      <p className="pricing-box__title">Расчёт</p>
                      <div className="pricing-row">
                        <span>Цена товара</span>
                        <strong>{price.toLocaleString('ru-RU')} ₽</strong>
                      </div>
                      <div className="pricing-row">
                        <span>Чаттинг ({percent}%)</span>
                        <span>{commission.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="pricing-total">
                        <span>Итого к получению</span>
                        <span>{payout.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab: Logistics ── */}
              {activeTab === 'logistics' && (
                <div className="tab-panel">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <div className="field">
                          <label className="field-label">
                            Адрес склада
                            <FieldHint text="Полный почтовый адрес места хранения и отгрузки товара." />
                          </label>
                          <FormControl>
                            <textarea className="inp-area" rows={2} {...field} />
                          </FormControl>
                          <p className="field-description">Координаты определяются автоматически</p>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="field-grid">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <div className="field">
                            <label className="field-label" style={{ fontSize: 12 }}>
                              Широта
                              <FieldHint text="Географическая широта склада (Y-координата). Диапазон: -90 до 90." />
                            </label>
                            <FormControl>
                              <input
                                type="number"
                                step="any"
                                className="inp mono"
                                {...field}
                                onChange={(e) => field.onChange(+e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <div className="field">
                            <label className="field-label" style={{ fontSize: 12 }}>
                              Долгота
                              <FieldHint text="Географическая долгота склада (X-координата). Диапазон: -180 до 180." />
                            </label>
                            <FormControl>
                              <input
                                type="number"
                                step="any"
                                className="inp mono"
                                {...field}
                                onChange={(e) => field.onChange(+e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="card-footer">
                <div className="step-dots">
                  {TABS.map((t) => (
                    <Tooltip key={t.value}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setActiveTab(t.value)}
                          className={`step-dot${t.value === activeTab ? ' active' : ''}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top">{t.label}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                <div className="footer-actions">
                  {activeTabIndex < TABS.length - 1 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="btn btn-ghost" onClick={goNext}>
                          Далее <ChevronRight style={{ width: 15, height: 15 }} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Перейти к разделу «{TABS[activeTabIndex + 1]?.label}»
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="submit" className="btn btn-primary" disabled={isPending}>
                        {isPending ? (
                          <span className="spin" />
                        ) : (
                          <Save style={{ width: 15, height: 15 }} />
                        )}
                        {isPending ? 'Сохранение...' : 'Опубликовать'}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Сохранить и опубликовать карточку товара
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </TooltipProvider>
  );
}
