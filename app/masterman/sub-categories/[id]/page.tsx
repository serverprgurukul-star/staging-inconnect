'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types/database'
import toast from 'react-hot-toast'

export default function SubCategoryFormPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    category_id: '',
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch categories for the dropdown
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      setCategories(categoriesData || [])

      if (isNew) {
        setIsLoading(false)
        return
      }

      // Fetch sub-category data if editing
      const { data, error } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !data) {
        toast.error('Sub-category not found')
        router.push('/masterman/sub-categories')
        return
      }

      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        image_url: data.image_url || '',
        category_id: data.category_id || '',
        display_order: data.display_order || 0,
        is_active: data.is_active,
      })
      setIsLoading(false)
    }

    fetchData()
  }, [isNew, params.id, router])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: isNew ? slugify(name) : formData.slug,
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `sub-categories/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        toast.error('Failed to upload image')
        return
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      if (urlData?.publicUrl) {
        setFormData({ ...formData, image_url: urlData.publicUrl })
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category_id) {
      toast.error('Please select a parent category')
      return
    }

    setIsSaving(true)

    try {
      const supabase = createClient()

      const dataToSave = {
        ...formData,
        category_id: formData.category_id || null,
      }

      if (isNew) {
        const { error } = await supabase.from('sub_categories').insert([dataToSave])
        if (error) throw error
        toast.success('Sub-category created successfully')
      } else {
        const { error } = await supabase
          .from('sub_categories')
          .update(dataToSave)
          .eq('id', params.id)
        if (error) throw error
        toast.success('Sub-category updated successfully')
      }

      router.push('/masterman/sub-categories')
    } catch (error) {
      console.error('Error saving sub-category:', error)
      toast.error('Failed to save sub-category')
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
          href="/masterman/sub-categories"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sub-Categories
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">
          {isNew ? 'Add Sub-Category' : 'Edit Sub-Category'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
          <div className="space-y-4">
            <Select
              label="Parent Category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              options={[
                { value: '', label: 'Select a category' },
                ...categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />

            <Input
              label="Sub-Category Name"
              placeholder="e.g., Business Cards"
              value={formData.name}
              onChange={handleNameChange}
              required
            />

            <Input
              label="Slug"
              placeholder="business-cards"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />

            <Textarea
              label="Description"
              placeholder="Enter sub-category description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
            />

            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Sub-Category Image
              </label>
              {formData.image_url ? (
                <div className="relative inline-block">
                  <Image
                    src={formData.image_url}
                    alt="Sub-Category"
                    width={200}
                    height={200}
                    className="rounded-[10px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-zinc-400" />
                      <span className="mt-2 text-sm text-zinc-500">Upload Image</span>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <Input
              label="Display Order"
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
              }
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
            {isNew ? 'Create Sub-Category' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
