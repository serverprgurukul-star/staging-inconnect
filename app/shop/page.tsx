'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { ProductCard } from '@/components/products/product-card'

interface Product {
  id: string
  name: string
  slug: string
  short_description: string | null
  price: number
  compare_at_price: number | null
  images: string[]
  is_featured: boolean
  is_popular: boolean
  is_active: boolean
  stock_quantity: number
  category_id: string
  sub_category_id: string | null
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  display_order: number
}

interface SubCategory {
  id: string
  name: string
  slug: string
  category_id: string
  is_active: boolean
  display_order: number
}

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(initialCategory)
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('price-low')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (categoriesData) {
        setCategories(categoriesData)
      }

      const { data: subCategoriesData } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (subCategoriesData) {
        setSubCategories(subCategoriesData)
      }

      const { data: productsData } = await supabase
        .from('products')
        .select('id, slug, name, short_description, price, compare_at_price, images, is_featured, is_popular, stock_quantity, category_id, sub_category_id, created_at')
        .eq('is_active', true)

      if (productsData) {
        setProducts(productsData)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  // Get selected category from slug
  const selectedCategory = categories.find(c => c.slug === selectedCategorySlug)
  const selectedSubCategory = subCategories.find(s => s.slug === selectedSubCategorySlug)

  // Filter sub-categories for the selected category
  const filteredSubCategories = selectedCategory
    ? subCategories.filter(s => s.category_id === selectedCategory.id)
    : []

  const filteredProducts = products
    .filter(product => {
      // Filter by category
      if (selectedCategory && product.category_id !== selectedCategory.id) {
        return false
      }
      // Filter by sub-category if selected
      if (selectedSubCategory && product.sub_category_id !== selectedSubCategory.id) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ]

  const currentSort = sortOptions.find(o => o.value === sortBy)?.label || 'Newest'

  return (
    <div className="overflow-x-hidden min-h-screen" style={{ backgroundColor: '#fff' }}>
      {/* Header + Filters */}
      <section className="pt-28 sm:pt-32 lg:pt-36">
        <div className="mx-auto w-[95%]">
          {/* Title Row with Sort on Mobile */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter leading-[0.9]">
              {selectedCategory ? selectedCategory.name : 'Shop'}{" "}
              <span className="text-zinc-400">collection.</span>
            </h1>

            {/* Sort Dropdown - Mobile */}
            <div className="relative flex-shrink-0 sm:hidden ">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900"
              >
                {currentSort}
                <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute right-0  top-full mt-2 z-20 w-44 rounded-[10px] bg-white shadow-lg border border-zinc-200 py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setShowSortDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortBy === option.value
                            ? 'bg-zinc-100 text-zinc-900 font-medium'
                            : 'text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between gap-4 mt-6 sm:mt-8 pb-4 sm:pb-5 border-b border-zinc-300">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategorySlug(null)
                  setSelectedSubCategorySlug(null)
                }}
                className={`flex-shrink-0 rounded-[10px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  !selectedCategorySlug
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategorySlug(cat.slug)
                    setSelectedSubCategorySlug(null)
                  }}
                  className={`flex-shrink-0 rounded-[10px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort Dropdown - Desktop */}
            <div className="relative flex-shrink-0 cursor-pointer hidden sm:block">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex cursor-pointer items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
              >
                {currentSort}
                <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10 cursor-pointer"
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-20 w-44 rounded-[10px] bg-white shadow-lg border border-zinc-200 py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setShowSortDropdown(false)
                        }}
                        className={`w-full cursor-pointer text-left px-4 py-2 text-sm ${
                          sortBy === option.value
                            ? 'bg-zinc-100 text-zinc-900 font-medium'
                            : 'text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sub-category Tabs - shown when a category is selected and has sub-categories */}
        {filteredSubCategories.length > 0 && (
          <div className="mx-auto w-[95%] mt-4">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-2">
              <button
                type="button"
                onClick={() => setSelectedSubCategorySlug(null)}
                className={`flex-shrink-0 rounded-[10px] px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  !selectedSubCategorySlug
                    ? 'bg-zinc-200 text-zinc-900'
                    : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                All {selectedCategory?.name}
              </button>
              {filteredSubCategories.map((subCat) => (
                <button
                  type="button"
                  key={subCat.id}
                  onClick={() => setSelectedSubCategorySlug(subCat.slug)}
                  className={`flex-shrink-0 rounded-[10px] px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    selectedSubCategorySlug === subCat.slug
                      ? 'bg-zinc-200 text-zinc-900'
                      : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  {subCat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Products Grid */}
      <section className="pt-6 sm:pt-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto w-[95%]">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-[10px] bg-zinc-200" />
                  <div className="mt-3 h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="mt-2 h-4 bg-zinc-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as any}
                  noBg
                  tag={product.is_popular ? "Popular" : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 sm:py-24 text-center">
              <p className="text-zinc-500">No products found</p>
              <button
                onClick={() => {
                  setSelectedCategorySlug(null)
                  setSelectedSubCategorySlug(null)
                  setSortBy('newest')
                }}
                className="mt-3 text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="overflow-x-hidden min-h-screen pt-28 sm:pt-32 lg:pt-36" style={{ backgroundColor: '#fff' }}>
        <div className="mx-auto w-[95%]">
          <div className="h-12 w-32 bg-zinc-200 rounded animate-pulse" />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-[10px] bg-zinc-200" />
                <div className="mt-3 h-4 bg-zinc-200 rounded w-3/4" />
                <div className="mt-2 h-4 bg-zinc-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
