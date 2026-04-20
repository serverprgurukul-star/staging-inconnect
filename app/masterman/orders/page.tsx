'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Eye, Search, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { formatPrice, formatDate, formatDateTime, exportToCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  customers: {
    first_name: string
    last_name: string
    email: string
    phone: string
  } | null
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 10

  const fetchOrders = async (silent = false) => {
    if (!silent) setIsLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, status, total, created_at, customers(first_name, last_name, email, phone)')
      .order('created_at', { ascending: false })

    setOrders(
      (data || []).map((o) => ({
        ...o,
        customers: Array.isArray(o.customers) ? o.customers[0] : o.customers,
      })) as Order[]
    )
    setIsLoading(false)
  }

  useEffect(() => {
    // Restore page before fetching so table renders on correct page
    const savedPage = sessionStorage.getItem('orders-page')
    if (savedPage) {
      setCurrentPage(parseInt(savedPage))
      sessionStorage.removeItem('orders-page')
    }
    fetchOrders()
    // Restore scroll position when navigating back
    const saved = sessionStorage.getItem('orders-scroll')
    if (saved) {
      setTimeout(() => window.scrollTo(0, parseInt(saved)), 50)
      sessionStorage.removeItem('orders-scroll')
    }
  }, [])

  const updateOrderStatus = async (orderId: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      toast.error('Failed to update order status')
    } else {
      toast.success('Order status updated')
      fetchOrders(true)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      confirmed: 'default',
      processing: 'warning',
      shipped: 'success',
      delivered: 'success',
      cancelled: 'danger',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      search === '' ||
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.customers?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customers?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customers?.email?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === '' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleExportCSV = () => {
    exportToCSV(filteredOrders, 'orders', [
      { key: 'order_number', header: 'Order Number' },
      { key: 'customers.first_name', header: 'First Name' },
      { key: 'customers.last_name', header: 'Last Name' },
      { key: 'customers.email', header: 'Email' },
      { key: 'customers.phone', header: 'Phone' },
      { key: 'status', header: 'Status' },
      { key: 'total', header: 'Total', formatter: (v) => String(v || 0) },
      { key: 'created_at', header: 'Date', formatter: (v) => formatDate(v as string) },
    ])
    toast.success('Orders exported to CSV')
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
          <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
          <p className="mt-1 text-zinc-500">View and manage customer orders</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV} disabled={filteredOrders.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="w-full rounded-[10px] border border-zinc-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
          options={[
            { value: '', label: 'All Status' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
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
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-sm text-zinc-500 w-10">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900">
                        {order.order_number}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {order.customers ? (
                        <div>
                          <p className="font-medium text-zinc-900">
                            {order.customers.first_name} {order.customers.last_name}
                          </p>
                          <p className="text-xs text-zinc-500">{order.customers.email}</p>
                        </div>
                      ) : (
                        <span className="text-zinc-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        options={[
                          { value: 'confirmed', label: 'Confirmed' },
                          { value: 'processing', label: 'Processing' },
                          { value: 'shipped', label: 'Shipped' },
                          { value: 'delivered', label: 'Delivered' },
                          { value: 'cancelled', label: 'Cancelled' },
                        ]}
                        className="w-32"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-sm text-zinc-500">
                      {formatDateTime(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/masterman/orders/${order.id}`}
                        prefetch={false}
                        onClick={() => {
                          sessionStorage.setItem('orders-scroll', String(window.scrollY))
                          sessionStorage.setItem('orders-page', String(currentPage))
                        }}
                        className="inline-flex items-center gap-1 rounded-[10px] px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} orders
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded-[10px] px-3 py-1.5 font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-[10px] px-3 py-1.5 font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Smart page window: first, ...., current-1, current, current+1, ..., last */}
            {(() => {
              const pages: (number | '...')[] = []
              const delta = 1
              const left = currentPage - delta
              const right = currentPage + delta

              for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                  pages.push(i)
                } else if (pages[pages.length - 1] !== '...') {
                  pages.push('...')
                }
              }

              return pages.map((page, i) =>
                page === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-zinc-400">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`rounded-[10px] px-3 py-1.5 font-medium ${
                      page === currentPage ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              )
            })()}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-[10px] px-3 py-1.5 font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-[10px] px-3 py-1.5 font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
