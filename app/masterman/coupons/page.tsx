'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Ticket, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import { formatPrice, formatDate, exportToCSV } from '@/lib/utils'
import type { Coupon } from '@/types/database'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; coupon: Coupon | null }>({
    open: false,
    coupon: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCoupons = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    setCoupons(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleDelete = async () => {
    if (!deleteModal.coupon) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', deleteModal.coupon.id)

    if (error) {
      toast.error('Failed to delete coupon')
    } else {
      toast.success('Coupon deleted successfully')
      fetchCoupons()
    }

    setIsDeleting(false)
    setDeleteModal({ open: false, coupon: null })
  }

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-zinc-400" />
          <span className="font-mono font-medium text-zinc-900">
            {coupon.code}
          </span>
        </div>
      ),
    },
    {
      key: 'discount',
      header: 'Discount',
      render: (coupon: Coupon) => (
        <span className="font-medium text-green-600">
          {coupon.discount_type === 'percentage'
            ? `${coupon.discount_value}%`
            : formatPrice(coupon.discount_value)}
        </span>
      ),
    },
    {
      key: 'min_order',
      header: 'Min Order',
      render: (coupon: Coupon) =>
        coupon.min_order_amount ? formatPrice(coupon.min_order_amount) : '-',
    },
    {
      key: 'max_uses',
      header: 'Max Uses',
      render: (coupon: Coupon) =>
        coupon.max_uses ? `${coupon.current_uses || 0}/${coupon.max_uses}` : 'Unlimited',
    },
    {
      key: 'valid_until',
      header: 'Valid Until',
      render: (coupon: Coupon) =>
        coupon.valid_until ? formatDate(coupon.valid_until) : 'No expiry',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (coupon: Coupon) =>
        coupon.is_active ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="default">Inactive</Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-2">
          <Link
            prefetch={false}
            href={`/masterman/coupons/${coupon.id}`}
            className="rounded-[10px] p-2 hover:bg-zinc-100"
          >
            <Pencil className="h-4 w-4 text-zinc-600" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, coupon })}
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
          <h1 className="text-2xl font-bold text-zinc-900">Coupons</h1>
          <p className="mt-1 text-zinc-500">Manage discount codes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              exportToCSV(coupons, 'coupons', [
                { key: 'code', header: 'Code' },
                { key: 'discount_type', header: 'Discount Type' },
                { key: 'discount_value', header: 'Discount Value' },
                { key: 'min_order_amount', header: 'Min Order Amount' },
                { key: 'max_uses', header: 'Max Uses' },
                { key: 'current_uses', header: 'Current Uses' },
                { key: 'valid_until', header: 'Valid Until', formatter: (v) => v ? formatDate(v as string) : 'No expiry' },
                { key: 'is_active', header: 'Active', formatter: (v) => v ? 'Yes' : 'No' },
              ])
              toast.success('Coupons exported to CSV')
            }}
            disabled={coupons.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button asChild>
            <Link href="/masterman/coupons/new" prefetch={false}>
              <Plus className="mr-2 h-4 w-4" />
              Add Coupon
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={coupons}
        columns={columns}
        searchKey="code"
        searchPlaceholder="Search coupons..."
        emptyMessage="No coupons found"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, coupon: null })}
        title="Delete Coupon"
      >
        <p className="text-zinc-600">
          Are you sure you want to delete the coupon &quot;{deleteModal.coupon?.code}&quot;?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, coupon: null })}
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
