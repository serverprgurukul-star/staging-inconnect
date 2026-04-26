'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Search, User, Building2, Phone, Mail, Globe, ExternalLink, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { formatDate, exportToCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

interface CardDetail {
  id: string
  order_id: string
  detail_type: string
  detail_data: {
    name: string
    designation: string
    companyName: string
    phone: string
    email: string
    website: string
    socialLinks: string
    additionalNotes: string
  }
  status: string
  created_at: string
  orders: {
    order_number: string
    status: string
    customers: {
      first_name: string
      last_name: string
      email: string
    } | null
  } | null
}

export default function AdminCardDetailsPage() {
  const [cardDetails, setCardDetails] = useState<CardDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewModal, setViewModal] = useState<{ open: boolean; detail: CardDetail | null }>({
    open: false,
    detail: null,
  })

  const fetchCardDetails = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('post_payment_details')
      .select('*, orders(order_number, status, customers(first_name, last_name, email))')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching card details:', error)
      toast.error('Failed to load card details')
      setIsLoading(false)
      return
    }

    setCardDetails(
      (data || []).map((d) => {
        const order = Array.isArray(d.orders) ? d.orders[0] : d.orders
        return {
          ...d,
          orders: order ? {
            ...order,
            customers: Array.isArray(order.customers) ? order.customers[0] : order.customers
          } : null,
        }
      }) as CardDetail[]
    )
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCardDetails()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('post_payment_details')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success('Status updated')
      fetchCardDetails()
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      pending: 'warning',
      reviewed: 'default',
      processing: 'warning',
      completed: 'success',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const filteredDetails = cardDetails.filter((detail) => {
    const matchesSearch =
      search === '' ||
      detail.detail_data.name?.toLowerCase().includes(search.toLowerCase()) ||
      detail.detail_data.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      detail.detail_data.email?.toLowerCase().includes(search.toLowerCase()) ||
      detail.orders?.order_number?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === '' || detail.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleExportCSV = () => {
    exportToCSV(filteredDetails, 'card-details', [
      { key: 'orders.order_number', header: 'Order Number' },
      { key: 'detail_data.name', header: 'Name' },
      { key: 'detail_data.designation', header: 'Designation' },
      { key: 'detail_data.companyName', header: 'Company' },
      { key: 'detail_data.phone', header: 'Phone' },
      { key: 'detail_data.email', header: 'Email' },
      { key: 'detail_data.website', header: 'Website' },
      { key: 'detail_data.socialLinks', header: 'Social Links' },
      { key: 'detail_data.additionalNotes', header: 'Notes' },
      { key: 'status', header: 'Status' },
      { key: 'created_at', header: 'Submitted', formatter: (v) => formatDate(v as string) },
    ])
    toast.success('Card details exported to CSV')
  }

  // Stats
  const stats = {
    total: cardDetails.length,
    pending: cardDetails.filter(d => d.status === 'pending').length,
    processing: cardDetails.filter(d => d.status === 'processing').length,
    completed: cardDetails.filter(d => d.status === 'completed').length,
  }

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
          <h1 className="text-2xl font-bold text-zinc-900">Card Details</h1>
          <p className="mt-1 text-zinc-500">Manage customer card/product personalization details</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={filteredDetails.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-[10px] border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Total Submissions</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{stats.total}</p>
        </div>
        <div className="rounded-[10px] border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Pending Review</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="rounded-[10px] border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Processing</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="rounded-[10px] border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Completed</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, company, order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[10px] border border-zinc-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'reviewed', label: 'Reviewed' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
          ]}
          className="w-40"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[10px] border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Card Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredDetails.length > 0 ? (
                filteredDetails.map((detail) => (
                  <tr key={detail.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <Link
                        prefetch={false}
                        href={`/masterman/orders/${detail.order_id}`}
                        className="font-medium text-zinc-900 hover:text-teal-600"
                      >
                        {detail.orders?.order_number || 'N/A'}
                      </Link>
                      <p className="text-xs text-zinc-500">
                        Order: {detail.orders?.status || 'N/A'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-zinc-400" />
                        <div>
                          <p className="font-medium text-zinc-900">
                            {detail.detail_data.name || 'Not provided'}
                          </p>
                          {detail.detail_data.designation && (
                            <p className="text-xs text-zinc-500">{detail.detail_data.designation}</p>
                          )}
                        </div>
                      </div>
                      {detail.detail_data.companyName && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                          <Building2 className="h-3 w-3" />
                          {detail.detail_data.companyName}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-xs text-zinc-500">
                        {detail.detail_data.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {detail.detail_data.phone}
                          </div>
                        )}
                        {detail.detail_data.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {detail.detail_data.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={detail.status || 'pending'}
                        onChange={(e) => updateStatus(detail.id, e.target.value)}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'reviewed', label: 'Reviewed' },
                          { value: 'processing', label: 'Processing' },
                          { value: 'completed', label: 'Completed' },
                        ]}
                        className="w-32"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-500">
                      {formatDate(detail.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewModal({ open: true, detail })}
                        className="inline-flex items-center gap-1 rounded-[10px] px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                    No card details found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, detail: null })}
        title="Card Details"
      >
        {viewModal.detail && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="flex items-center justify-between rounded-[10px] bg-zinc-50 p-4">
              <div>
                <p className="text-sm text-zinc-500">Order Number</p>
                <p className="font-mono font-bold text-zinc-900">
                  {viewModal.detail.orders?.order_number}
                </p>
              </div>
              <Link
                prefetch={false}
                href={`/masterman/orders/${viewModal.detail.order_id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                View Order
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            {/* Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-500">Full Name</p>
                <p className="font-medium text-zinc-900">
                  {viewModal.detail.detail_data.name || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Designation</p>
                <p className="font-medium text-zinc-900">
                  {viewModal.detail.detail_data.designation || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Company</p>
                <p className="font-medium text-zinc-900">
                  {viewModal.detail.detail_data.companyName || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Phone</p>
                <p className="font-medium text-zinc-900">
                  {viewModal.detail.detail_data.phone || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="font-medium text-zinc-900">
                  {viewModal.detail.detail_data.email || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Website</p>
                {viewModal.detail.detail_data.website ? (
                  <a
                    href={viewModal.detail.detail_data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-600 hover:text-teal-700"
                  >
                    {viewModal.detail.detail_data.website}
                  </a>
                ) : (
                  <p className="text-zinc-400">-</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            {viewModal.detail.detail_data.socialLinks && (
              <div>
                <p className="text-sm text-zinc-500">Social Links</p>
                <p className="mt-1 whitespace-pre-line rounded-[10px] bg-zinc-50 p-3 text-sm text-zinc-700">
                  {viewModal.detail.detail_data.socialLinks}
                </p>
              </div>
            )}

            {/* Additional Notes */}
            {viewModal.detail.detail_data.additionalNotes && (
              <div>
                <p className="text-sm text-zinc-500">Additional Notes</p>
                <p className="mt-1 whitespace-pre-line rounded-[10px] bg-zinc-50 p-3 text-sm text-zinc-700">
                  {viewModal.detail.detail_data.additionalNotes}
                </p>
              </div>
            )}

            {/* Status Update */}
            <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
              <div>
                <p className="text-sm text-zinc-500">Current Status</p>
                {getStatusBadge(viewModal.detail.status || 'pending')}
              </div>
              <Select
                value={viewModal.detail.status || 'pending'}
                onChange={(e) => {
                  updateStatus(viewModal.detail!.id, e.target.value)
                  setViewModal({
                    open: true,
                    detail: { ...viewModal.detail!, status: e.target.value }
                  })
                }}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'reviewed', label: 'Reviewed' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'completed', label: 'Completed' },
                ]}
                className="w-40"
              />
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setViewModal({ open: false, detail: null })}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
