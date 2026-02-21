import { ProductCreateForm } from '@/components/product-form/ProductCreateForm';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProductCreateForm />
      </div>
      <Toaster position="top-right" richColors />
    </main>
  );
}
