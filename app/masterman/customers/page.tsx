'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { createClient } from '@/utils/supabase/client'
import { formatDate, exportToCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Customer {
  id: string
  email: string
  phone: string | null
  first_name: string
  last_name: string
  created_at: string
  order_count?: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from('customers')
        .select('id, email, phone, first_name, last_name, created_at')
        .order('created_at', { ascending: false })

      setCustomers(data || [])
      setIsLoading(false)
    }

    fetchCustomers()
  }, [])

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer: Customer) => (
        <div>
          <p className="font-medium text-zinc-900">
            {customer.first_name} {customer.last_name}
          </p>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Mail className="h-3 w-3" />
            {customer.email}
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (customer: Customer) =>
        customer.phone ? (
          <div className="flex items-center gap-1 text-sm text-zinc-600">
            <Phone className="h-3 w-3" />
            {customer.phone}
          </div>
        ) : (
          <span className="text-zinc-400">-</span>
        ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (customer: Customer) => (
        <span className="text-sm text-zinc-500">{formatDate(customer.created_at)}</span>
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
          <h1 className="text-2xl font-bold text-zinc-900">Customers</h1>
          <p className="mt-1 text-zinc-500">View all registered customers</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            exportToCSV(customers, 'customers', [
              { key: 'first_name', header: 'First Name' },
              { key: 'last_name', header: 'Last Name' },
              { key: 'email', header: 'Email' },
              { key: 'phone', header: 'Phone' },
              { key: 'created_at', header: 'Joined', formatter: (v) => formatDate(v as string) },
            ])
            toast.success('Customers exported to CSV')
          }}
          disabled={customers.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={customers}
        columns={columns}
        searchKey="email"
        searchPlaceholder="Search by email..."
        emptyMessage="No customers found"
      />
    </div>
  )
}
