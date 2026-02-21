'use client';

import { useState, useTransition } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  {
    value: 'pricing',
    label: 'Финансы',
    icon: BadgeDollarSign,
    tooltip: 'Цена и расчёт комиссии',
  },
  {
    value: 'logistics',
    label: 'Локация',
    icon: MapPin,
    tooltip: 'Адрес и координаты склада',
  },
];

function FieldHint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help transition-colors inline-block ml-1.5 align-middle" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px] text-xs">
        {text}
      </TooltipContent>
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
      } else {
        toast.error(`Ошибка: ${result.error}`);
      }
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
      <div className="min-h-screen bg-slate-50 flex items-start justify-center py-10 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-3xl">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  Маркетплейс
                </p>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Новая карточка товара
                </h1>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAIGeneration}
                    disabled={isGenerating}
                    className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-400 transition-colors gap-2">
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isGenerating ? 'Генерация...' : 'Заполнить с AI'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Автоматически заполнит описание, SEO-теги и сгенерирует артикул на основе названия
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-slate-100 px-4 pt-4">
                  <TabsList className="bg-transparent p-0 gap-0 h-auto w-full justify-start">
                    {TABS.map(({ value, label, icon: Icon, tooltip }) => (
                      <Tooltip key={value}>
                        <TooltipTrigger asChild>
                          <TabsTrigger
                            value={value}
                            className="relative px-4 py-2.5 rounded-none text-sm font-medium text-slate-500 data-[state=active]:text-slate-900 data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-slate-900 hover:text-slate-700 transition-colors gap-1.5">
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">
                          {tooltip}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value="basic" className="p-6 space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Название товара <span className="text-red-400">*</span>
                          <FieldHint text="Полное коммерческое название. Должно быть понятным и содержать ключевые характеристики." />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Например: Беспроводные наушники Sony WH-1000XM5"
                            className="h-10 border-slate-200 focus-visible:ring-slate-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Артикул <span className="text-red-400">*</span>
                            <FieldHint text="Уникальный идентификатор товара (SKU). Используется для складского учёта и поиска." />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="SKU-12345"
                              className="h-10 border-slate-200 focus-visible:ring-slate-300 font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Категория <span className="text-red-400">*</span>
                            <FieldHint text="Определяет, в каком разделе каталога будет отображаться товар." />
                          </FormLabel>
                          <Select
                            onValueChange={(v) => field.onChange(Number(v))}
                            defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger className="h-10 border-slate-200">
                                <SelectValue placeholder="Выберите категорию" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2477">Электроника</SelectItem>
                              <SelectItem value="2478">Одежда</SelectItem>
                              <SelectItem value="2479">Дом и сад</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="content" className="p-6 space-y-5">
                  <FormField
                    control={form.control}
                    name="description_short"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Краткое описание
                          <FieldHint text="Отображается в карточке товара и списках. До 255 символов. Чётко и ёмко." />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Главные преимущества товара в 1–2 предложениях..."
                            className="resize-none border-slate-200 focus-visible:ring-slate-300"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description_long"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Полное описание
                          <FieldHint text="Развёрнутое описание на странице товара. Укажите материалы, характеристики и особенности." />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Подробное описание: материалы, характеристики, применение..."
                            className="resize-none border-slate-200 focus-visible:ring-slate-300"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          SEO-заголовок
                          <FieldHint text="Заголовок страницы в браузере и поисковой выдаче. Влияет на позицию в Google и Яндексе." />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Купить [товар] с доставкой | Лучшая цена"
                            className="h-10 border-slate-200 focus-visible:ring-slate-300"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-400">
                          Рекомендуется до 60 символов
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seo_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Ключевые слова
                          <FieldHint text="Слова, по которым покупатели ищут товар. Добавьте синонимы, бренд и характеристики." />
                        </FormLabel>
                        <FormControl>
                          <TagInput value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-400">
                          Вводите слова через запятую или Enter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="pricing" className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marketplace_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Цена <span className="text-red-400">*</span>
                            <FieldHint text="Итоговая цена для покупателя на маркетплейсе. Без скидок и акций." />
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                                ₽
                              </span>
                              <Input
                                type="number"
                                className="h-10 pl-7 border-slate-200 focus-visible:ring-slate-300"
                                {...field}
                                onChange={(e) => field.onChange(+e.target.value)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chatting_percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Процент чаттинга
                            <FieldHint text="Комиссия маркетплейса за продажу через чат. Вычитается из итоговой выплаты." />
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                className="h-10 pr-7 border-slate-200 focus-visible:ring-slate-300"
                                {...field}
                                onChange={(e) => field.onChange(+e.target.value)}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                                %
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {price > 0 && (
                    <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Расчёт
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Цена товара</span>
                        <span className="font-semibold text-slate-900">
                          {price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-600">Чаттинг ({percent}%)</span>
                        <span className="text-slate-500">
                          {commission.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">Итого к получению</span>
                        <span className="font-bold text-slate-900">
                          {payout.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="logistics" className="p-6 space-y-5">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Адрес склада
                          <FieldHint text="Полный почтовый адрес места хранения и отгрузки товара." />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none border-slate-200 focus-visible:ring-slate-300"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-400">
                          Координаты определяются автоматически
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium text-xs">
                            Широта
                            <FieldHint text="Географическая широта склада (Y-координата). Диапазон: -90 до 90." />
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              className="h-9 border-slate-200 font-mono text-xs"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium text-xs">
                            Долгота
                            <FieldHint text="Географическая долгота склада (X-координата). Диапазон: -180 до 180." />
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              className="h-9 border-slate-200 font-mono text-xs"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex gap-1">
                    {TABS.map((t) => (
                      <Tooltip key={t.value}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => setActiveTab(t.value)}
                            className={`h-2 rounded-full transition-all duration-200 ${
                              t.value === activeTab
                                ? 'bg-slate-900 w-4'
                                : 'bg-slate-300 hover:bg-slate-400 w-2'
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {t.label}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTabIndex < TABS.length - 1 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={goNext}
                            className="text-slate-600 gap-1">
                            Далее
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          Перейти к разделу «{TABS[activeTabIndex + 1]?.label}»
                        </TooltipContent>
                      </Tooltip>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isPending}
                          className="bg-slate-900 hover:bg-slate-800 text-white gap-2 px-5">
                          {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {isPending ? 'Сохранение...' : 'Опубликовать'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Сохранить и опубликовать карточку товара
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Tabs>
            </div>
          </form>
        </Form>
      </div>
    </TooltipProvider>
  );
}
