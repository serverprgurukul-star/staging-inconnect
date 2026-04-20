'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { Modal } from '@/components/ui/modal'
import { createClient } from '@/utils/supabase/client'
import type { Category } from '@/types/database'
import toast from 'react-hot-toast'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    setCategories(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async () => {
    if (!deleteModal.category) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', deleteModal.category.id)

    if (error) {
      toast.error('Failed to delete category')
    } else {
      toast.success('Category deleted successfully')
      fetchCategories()
    }

    setIsDeleting(false)
    setDeleteModal({ open: false, category: null })
  }

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (category: Category) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-[10px] bg-zinc-100">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
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
      header: 'Name',
      render: (category: Category) => (
        <div>
          <p className="font-medium text-zinc-900">{category.name}</p>
          <p className="text-xs text-zinc-500">{category.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (category: Category) => (
        <p className="max-w-xs truncate text-zinc-600">
          {category.description || '-'}
        </p>
      ),
    },
    {
      key: 'display_order',
      header: 'Order',
      render: (category: Category) => category.display_order || 0,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (category: Category) => (
        <span
          className={`inline-flex rounded-[10px] px-2 py-1 text-xs font-medium ${
            category.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-zinc-100 text-zinc-700'
          }`}
        >
          {category.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (category: Category) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/masterman/categories/${category.id}`}
            className="rounded-[10px] p-2 hover:bg-zinc-100"
          >
            <Pencil className="h-4 w-4 text-zinc-600" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, category })}
            className="rounded-[10px] p-2 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-[10px] border-4 border-zinc-200 border-t-zinc-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Categories</h1>
          <p className="mt-1 text-zinc-500">Manage product categories</p>
        </div>
        <Button asChild>
          <Link href="/masterman/categories/new" prefetch={false}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={categories}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, category: null })}
        title="Delete Category"
      >
        <p className="text-zinc-600">
          Are you sure you want to delete &quot;{deleteModal.category?.name}&quot;? This action
          cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, category: null })}
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
