'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import type { Testimonial } from '@/types/database'
import toast from 'react-hot-toast'

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; testimonial: Testimonial | null }>({
    open: false,
    testimonial: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchTestimonials = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    setTestimonials(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleDelete = async () => {
    if (!deleteModal.testimonial) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', deleteModal.testimonial.id)

    if (error) {
      toast.error('Failed to delete testimonial')
    } else {
      toast.success('Testimonial deleted successfully')
      fetchTestimonials()
    }

    setIsDeleting(false)
    setDeleteModal({ open: false, testimonial: null })
  }

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (testimonial: Testimonial) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-[10px] bg-zinc-100">
          {testimonial.image_url ? (
            <Image
              src={testimonial.image_url}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-400">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (testimonial: Testimonial) => (
        <div>
          <p className="font-medium text-zinc-900">{testimonial.name}</p>
          <p className="text-xs text-zinc-500">{testimonial.role || 'Customer'}</p>
        </div>
      ),
    },
    {
      key: 'content',
      header: 'Content',
      render: (testimonial: Testimonial) => (
        <p className="max-w-sm truncate text-sm text-zinc-600">
          {testimonial.content}
        </p>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (testimonial: Testimonial) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < (testimonial.rating || 5)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-zinc-300'
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'is_featured',
      header: 'Featured',
      render: (testimonial: Testimonial) =>
        testimonial.is_featured ? (
          <Badge variant="success">Featured</Badge>
        ) : (
          <Badge variant="default">No</Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (testimonial: Testimonial) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/masterman/testimonials/${testimonial.id}`}
            className="rounded-[10px] p-2 hover:bg-zinc-100"
          >
            <Pencil className="h-4 w-4 text-zinc-600" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, testimonial })}
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
          <h1 className="text-2xl font-bold text-zinc-900">Testimonials</h1>
          <p className="mt-1 text-zinc-500">Manage customer testimonials</p>
        </div>
        <Button asChild>
          <Link href="/masterman/testimonials/new" prefetch={false}>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={testimonials}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search testimonials..."
        emptyMessage="No testimonials found"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, testimonial: null })}
        title="Delete Testimonial"
      >
        <p className="text-zinc-600">
          Are you sure you want to delete the testimonial from &quot;{deleteModal.testimonial?.name}&quot;?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, testimonial: null })}
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
