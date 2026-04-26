'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'

export default function CouponFormPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_order_amount: 0,
    max_uses: 0,
    valid_until: '',
    is_active: true,
  })

  useEffect(() => {
    if (isNew) return

    const fetchCoupon = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !data) {
        toast.error('Coupon not found')
        router.push('/masterman/coupons')
        return
      }

      setFormData({
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        min_order_amount: data.min_order_amount || 0,
        max_uses: data.max_uses || 0,
        valid_until: data.valid_until ? data.valid_until.split('T')[0] : '',
        is_active: data.is_active,
      })
      setIsLoading(false)
    }

    fetchCoupon()
  }, [isNew, params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = createClient()

      const dataToSave = {
        ...formData,
        code: formData.code.toUpperCase(),
        min_order_amount: formData.min_order_amount || null,
        max_uses: formData.max_uses || null,
        valid_until: formData.valid_until || null,
      }

      if (isNew) {
        const { error } = await supabase.from('coupons').insert([dataToSave])
        if (error) throw error
        toast.success('Coupon created successfully')
      } else {
        const { error } = await supabase
          .from('coupons')
          .update(dataToSave)
          .eq('id', params.id)
        if (error) throw error
        toast.success('Coupon updated successfully')
      }

      router.push('/masterman/coupons')
    } catch (error) {
      console.error('Error saving coupon:', error)
      toast.error('Failed to save coupon')
    } finally {
      setIsSaving(false)
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
      <div>
        <Link
          prefetch={false}
          href="/masterman/coupons"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Coupons
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">
          {isNew ? 'Add Coupon' : 'Edit Coupon'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
          <div className="space-y-4">
            <Input
              label="Coupon Code"
              placeholder="e.g., SAVE20"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Discount Type"
                value={formData.discount_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_type: e.target.value as 'percentage' | 'fixed',
                  })
                }
                options={[
                  { value: 'percentage', label: 'Percentage (%)' },
                  { value: 'fixed', label: 'Fixed Amount (₹)' },
                ]}
              />
              <Input
                label={formData.discount_type === 'percentage' ? 'Discount (%)' : 'Discount (₹)'}
                type="number"
                min="0"
                step="1"
                value={formData.discount_value}
                onChange={(e) =>
                  setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Minimum Order Amount (₹)"
                type="number"
                min="0"
                placeholder="0 for no minimum"
                value={formData.min_order_amount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) || 0 })
                }
              />
              <Input
                label="Maximum Uses"
                type="number"
                min="0"
                placeholder="0 for unlimited"
                value={formData.max_uses || ''}
                onChange={(e) =>
                  setFormData({ ...formData, max_uses: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <Input
              label="Valid Until"
              type="date"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-300"
              />
              <span className="text-sm text-zinc-700">Active</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" isLoading={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isNew ? 'Create Coupon' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
