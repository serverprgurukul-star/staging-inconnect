'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import { formatPrice, exportToCSV } from '@/lib/utils'
import type { Product, Category } from '@/types/database'
import toast from 'react-hot-toast'

interface ProductWithCategory extends Product {
  categories: Category | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: ProductWithCategory | null }>({
    open: false,
    product: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchProducts = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })

    setProducts(
      (data || []).map((p) => ({
        ...p,
        categories: p.categories as Category | null,
      }))
    )
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async () => {
    if (!deleteModal.product) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteModal.product.id)

    if (error) {
      toast.error('Failed to delete product')
    } else {
      toast.success('Product deleted successfully')
      fetchProducts()
    }

    setIsDeleting(false)
    setDeleteModal({ open: false, product: null })
  }

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (product: ProductWithCategory) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-[10px] bg-zinc-100">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
              No img
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Product',
      render: (product: ProductWithCategory) => (
        <div>
          <p className="font-medium text-zinc-900">{product.name}</p>
          <p className="text-xs text-zinc-500">{product.categories?.name || 'No category'}</p>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (product: ProductWithCategory) => (
        <div>
          <p className="font-medium">{formatPrice(product.price)}</p>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <p className="text-xs text-zinc-500 line-through">
              {formatPrice(product.compare_at_price)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (product: ProductWithCategory) => (
        <span
          className={`font-medium ${
            (product.stock_quantity || 0) < 10 ? 'text-red-600' : 'text-zinc-900'
          }`}
        >
          {product.stock_quantity || 0}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (product: ProductWithCategory) => (
        <div className="flex flex-col gap-1">
          <Badge variant={product.is_active ? 'success' : 'default'}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Badge>
          {product.is_featured && <Badge variant="warning">Featured</Badge>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: ProductWithCategory) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/masterman/products/${product.id}`}
            prefetch={false}
            className="rounded-[10px] p-2 text-zinc-600 hover:bg-zinc-100"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, product })}
            className="rounded-[10px] p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-[10px] border-4 border-zinc-300 border-t-zinc-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Products</h1>
          <p className="mt-1 text-zinc-500">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              exportToCSV(products, 'products', [
                { key: 'name', header: 'Name' },
                { key: 'slug', header: 'Slug' },
                { key: 'categories.name', header: 'Category' },
                { key: 'price', header: 'Price' },
                { key: 'compare_at_price', header: 'Compare At Price' },
                { key: 'stock_quantity', header: 'Stock' },
                { key: 'is_active', header: 'Active', formatter: (v) => v ? 'Yes' : 'No' },
                { key: 'is_featured', header: 'Featured', formatter: (v) => v ? 'Yes' : 'No' },
              ])
              toast.success('Products exported to CSV')
            }}
            disabled={products.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button asChild>
            <Link href="/masterman/products/new" prefetch={false}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={products}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search products..."
        emptyMessage="No products found"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
      >
        <p className="text-zinc-600">
          Are you sure you want to delete &quot;{deleteModal.product?.name}&quot;? This action
          cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, product: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
