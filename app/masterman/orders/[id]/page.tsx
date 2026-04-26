'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface OrderDetails {
  id: string
  order_number: string
  status: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  coupon_code: string | null
  notes: string | null
  created_at: string
  shipping_address: {
    address: string
    city: string
    state: string
    pincode: string
  } | null
  billing_address: {
    address: string
    city: string
    state: string
    pincode: string
  } | null
  customers: {
    first_name: string
    last_name: string
    email: string
    phone: string
  } | null
  order_items: Array<{
    id: string
    product_name: string
    product_image: string | null
    quantity: number
    unit_price: number
    total_price: number
  }>
  payments: Array<{
    id: string
    amount: number
    status: string
    method: string
    transaction_id: string | null
    created_at: string
  }>
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers(first_name, last_name, email, phone),
          order_items(id, product_name, product_image, quantity, unit_price, total_price),
          payments(id, amount, status, method, transaction_id, created_at)
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Order fetch error:', error)
        toast.error('Order not found')
        router.push('/masterman/orders')
        return
      }

      if (!data) {
        toast.error('Order not found')
        router.push('/masterman/orders')
        return
      }

      setOrder({
        ...data,
        shipping_address: data.shipping_address as OrderDetails['shipping_address'],
        billing_address: data.billing_address as OrderDetails['billing_address'],
        customers: Array.isArray(data.customers) ? data.customers[0] : data.customers,
        order_items: (data.order_items || []) as OrderDetails['order_items'],
        payments: (data.payments || []) as OrderDetails['payments'],
      } as OrderDetails)
      setIsLoading(false)
    }

    fetchOrder()
  }, [params.id, router])

  const updateStatus = async (status: string) => {
    if (!order) return

    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success('Status updated')
      setOrder({ ...order, status })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      confirmed: 'default',
      processing: 'warning',
      shipped: 'success',
      delivered: 'success',
      cancelled: 'danger',
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  if (isLoading || !order) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-[10px] border-4 border-zinc-200 border-t-zinc-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/masterman/orders"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-zinc-900">
            Order {order.order_number}
          </h1>
          <p className="mt-1 text-zinc-500">Placed on {formatDate(order.created_at)}</p>
        </div>
        <Select
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          options={[
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          className="w-40"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-zinc-500" />
              <h2 className="font-semibold text-zinc-900">Order Items</h2>
            </div>
            <div className="divide-y divide-zinc-200">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[10px] bg-zinc-100">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">{item.product_name}</p>
                    <p className="text-sm text-zinc-500">
                      {formatPrice(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.total_price)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping</span>
                <span>{order.shipping > 0 ? formatPrice(order.shipping) : 'Free'}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
              <h2 className="font-semibold text-zinc-900 mb-2">Order Notes</h2>
              <p className="text-zinc-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-zinc-500" />
              <h2 className="font-semibold text-zinc-900">Customer</h2>
            </div>
            {order.customers ? (
              <div className="space-y-2">
                <p className="font-medium">
                  {order.customers.first_name} {order.customers.last_name}
                </p>
                <p className="text-sm text-zinc-500">{order.customers.email}</p>
                <p className="text-sm text-zinc-500">{order.customers.phone}</p>
              </div>
            ) : (
              <p className="text-zinc-400">Customer info not available</p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-zinc-500" />
              <h2 className="font-semibold text-zinc-900">Shipping Address</h2>
            </div>
            {order.shipping_address ? (
              <p className="text-sm text-zinc-600">
                {order.shipping_address.address}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state}{' '}
                {order.shipping_address.pincode}
              </p>
            ) : (
              <p className="text-sm text-zinc-400">No shipping address</p>
            )}
          </div>

          {/* Billing Address */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-zinc-500" />
              <h2 className="font-semibold text-zinc-900">Billing Address</h2>
            </div>
            {order.billing_address ? (
              <p className="text-sm text-zinc-600">
                {order.billing_address.address}
                <br />
                {order.billing_address.city}, {order.billing_address.state}{' '}
                {order.billing_address.pincode}
              </p>
            ) : (
              <p className="text-sm text-zinc-400">Same as shipping</p>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-zinc-500" />
              <h2 className="font-semibold text-zinc-900">Payment</h2>
            </div>
            {order.payments.length > 0 ? (
              order.payments.map((payment) => (
                <div key={payment.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">Method</span>
                    <span className="text-sm font-medium uppercase">{payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">Status</span>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">Amount</span>
                    <span className="text-sm font-medium">{formatPrice(payment.amount)}</span>
                  </div>
                  {payment.transaction_id && (
                    <div className="flex justify-between">
                      <span className="text-sm text-zinc-500">Transaction ID</span>
                      <span className="text-sm font-mono">{payment.transaction_id}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-zinc-400 text-sm">No payment records</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
