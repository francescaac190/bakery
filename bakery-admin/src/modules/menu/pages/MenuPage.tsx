import { useState } from 'react'
import { cn } from '@/lib/cn'
import { CategoriesTab } from '../components/CategoriesTab'
import { ProductsTab } from '../components/ProductsTab'

type Tab = 'products' | 'categories'

const tabs: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Productos' },
  { id: 'categories', label: 'Categorías' },
]

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>('products')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-text-heading">Menú</h1>

      <div className="border-b-2 border-border-subtle flex gap-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-0.5',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'products' ? <ProductsTab /> : <CategoriesTab />}
    </div>
  )
}
