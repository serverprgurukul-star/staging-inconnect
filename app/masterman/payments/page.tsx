'use client'

import { useEffect, useState, useMemo } from 'react'
import { CreditCard, CheckCircle, Clock, XCircle, Download, Banknote, Smartphone, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import { formatPrice, formatDate, exportToCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Payment {
  id: string
  amount: number
  status: string
  method: string
  transaction_id: string | null
  created_at: string
  orders: {
    order_number: string
    customers: {
      first_name: string
      last_name: string
      email: string
    } | null
  } | null
}

type TimeFilter = '24h' | '7d' | '30d' | 'custom' | 'all'

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('payments')
        .select('id, amount, status, method, transaction_id, created_at, orders(order_number, customers(first_name, last_name, email))')
        .order('created_at', { ascending: false })

      setPayments(
        (data || []).map((p) => {
          const order = Array.isArray(p.orders) ? p.orders[0] : p.orders
          const customer = order?.customers
          return {
            ...p,
            orders: order ? {
              ...order,
              customers: Array.isArray(customer) ? customer[0] : customer
            } : null,
          }
        }) as Payment[]
      )
      setIsLoading(false)
    }

    fetchPayments()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <CreditCard className="h-4 w-4 text-zinc-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  // Filter payments by time
  const getFilteredPayments = useMemo(() => {
    const now = new Date()
    let startDate: Date | null = null
    let endDate: Date | null = null

    switch (timeFilter) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'custom':
        if (customStartDate) startDate = new Date(customStartDate)
        if (customEndDate) {
          endDate = new Date(customEndDate)
          endDate.setHours(23, 59, 59, 999)
        }
        break
      case 'all':
      default:
        return payments.filter(p => p.status === 'completed')
    }

    return payments.filter((payment) => {
      if (payment.status !== 'completed') return false
      const paymentDate = new Date(payment.created_at)
      if (startDate && paymentDate < startDate) return false
      if (endDate && paymentDate > endDate) return false
      return true
    })
  }, [payments, timeFilter, customStartDate, customEndDate])

  // Calculate stats
  const stats = useMemo(() => {
    const completedPayments = getFilteredPayments
    const totalReceived = completedPayments.reduce((sum, p) => sum + p.amount, 0)
    const codPayments = completedPayments.filter(p => p.method === 'cod')
    const onlinePayments = completedPayments.filter(p => p.method !== 'cod')
    const totalCOD = codPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalOnline = onlinePayments.reduce((sum, p) => sum + p.amount, 0)

    return {
      totalReceived,
      totalCOD,
      totalOnline,
      codCount: codPayments.length,
      onlineCount: onlinePayments.length,
      totalCount: completedPayments.length,
    }
  }, [getFilteredPayments])

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case '24h': return 'Last 24 Hours'
      case '7d': return 'Last 7 Days'
      case '30d': return 'Last 30 Days'
      case 'custom': return 'Custom Range'
      default: return 'All Time'
    }
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
          <h1 className="text-2xl font-bold text-zinc-900">Payments</h1>
          <p className="mt-1 text-zinc-500">View all payment transactions</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            exportToCSV(payments, 'payments', [
              { key: 'orders.order_number', header: 'Order Number' },
              { key: 'orders.customers.first_name', header: 'First Name' },
              { key: 'orders.customers.last_name', header: 'Last Name' },
              { key: 'orders.customers.email', header: 'Email' },
              { key: 'amount', header: 'Amount' },
              { key: 'method', header: 'Method' },
              { key: 'status', header: 'Status' },
              { key: 'transaction_id', header: 'Transaction ID' },
              { key: 'created_at', header: 'Date', formatter: (v) => formatDate(v as string) },
            ])
            toast.success('Payments exported to CSV')
          }}
          disabled={payments.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Time Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-700">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', '24h', '7d', '30d', 'custom'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`rounded-[10px] px-3 py-1.5 text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {filter === 'all' ? 'All Time' : filter === '24h' ? '24 Hours' : filter === '7d' ? '7 Days' : filter === '30d' ? '30 Days' : 'Custom'}
            </button>
          ))}
        </div>
        {timeFilter === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="rounded-[10px] border border-zinc-300 px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
            />
            <span className="text-zinc-400">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="rounded-[10px] border border-zinc-300 px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[10px] border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Total Received</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{formatPrice(stats.totalReceived)}</p>
              <p className="mt-1 text-xs text-zinc-400">{stats.totalCount} payments • {getTimeFilterLabel()}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-green-100">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Cash on Delivery</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">{formatPrice(stats.totalCOD)}</p>
              <p className="mt-1 text-xs text-zinc-400">{stats.codCount} payments</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-amber-100">
              <Banknote className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Online Payments</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{formatPrice(stats.totalOnline)}</p>
              <p className="mt-1 text-xs text-zinc-400">{stats.onlineCount} payments</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-blue-100">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
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
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900">
                        {payment.orders?.order_number || 'N/A'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {payment.orders?.customers ? (
                        <div>
                          <p className="font-medium text-zinc-900">
                            {payment.orders.customers.first_name}{' '}
                            {payment.orders.customers.last_name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {payment.orders.customers.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-zinc-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-[10px] bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 uppercase">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        {getStatusBadge(payment.status)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-500">
                      {formatDate(payment.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
