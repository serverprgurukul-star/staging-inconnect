'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { Modal } from '@/components/ui/modal'
import { createClient } from '@/utils/supabase/client'
import type { SubCategoryWithCategory } from '@/types/database'
import toast from 'react-hot-toast'

export default function AdminSubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategoryWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; subCategory: SubCategoryWithCategory | null }>({
    open: false,
    subCategory: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchSubCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('sub_categories')
      .select('*, categories(*)')
      .order('display_order', { ascending: true })

    setSubCategories((data as SubCategoryWithCategory[]) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSubCategories()
  }, [])

  const handleDelete = async () => {
    if (!deleteModal.subCategory) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('sub_categories')
      .delete()
      .eq('id', deleteModal.subCategory.id)

    if (error) {
      toast.error('Failed to delete sub-category')
    } else {
      toast.success('Sub-category deleted successfully')
      fetchSubCategories()
    }

    setIsDeleting(false)
    setDeleteModal({ open: false, subCategory: null })
  }

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (subCategory: SubCategoryWithCategory) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-[10px] bg-zinc-100">
          {subCategory.image_url ? (
            <Image
              src={subCategory.image_url}
              alt={subCategory.name}
              fill
              sizes="48px"
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
      render: (subCategory: SubCategoryWithCategory) => (
        <div>
          <p className="font-medium text-zinc-900">{subCategory.name}</p>
          <p className="text-xs text-zinc-500">{subCategory.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Parent Category',
      render: (subCategory: SubCategoryWithCategory) => (
        <span className="inline-flex rounded-[10px] bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
          {subCategory.categories?.name || 'No category'}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (subCategory: SubCategoryWithCategory) => (
        <p className="max-w-xs truncate text-zinc-600">
          {subCategory.description || '-'}
        </p>
      ),
    },
    {
      key: 'display_order',
      header: 'Order',
      render: (subCategory: SubCategoryWithCategory) => subCategory.display_order || 0,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (subCategory: SubCategoryWithCategory) => (
        <span
          className={`inline-flex rounded-[10px] px-2 py-1 text-xs font-medium ${
            subCategory.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-zinc-100 text-zinc-700'
          }`}
        >
          {subCategory.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (subCategory: SubCategoryWithCategory) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/masterman/sub-categories/${subCategory.id}`}
            className="rounded-[10px] p-2 hover:bg-zinc-100"
          >
            <Pencil className="h-4 w-4 text-zinc-600" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, subCategory })}
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
          <h1 className="text-2xl font-bold text-zinc-900">Sub-Categories</h1>
          <p className="mt-1 text-zinc-500">Manage product sub-categories</p>
        </div>
        <Button asChild>
          <Link href="/masterman/sub-categories/new" prefetch={false}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sub-Category
          </Link>
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={subCategories}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search sub-categories..."
        emptyMessage="No sub-categories found"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, subCategory: null })}
        title="Delete Sub-Category"
      >
        <p className="text-zinc-600">
          Are you sure you want to delete &quot;{deleteModal.subCategory?.name}&quot;? This action
          cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, subCategory: null })}
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
