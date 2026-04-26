'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Plus, X, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import { slugify } from '@/lib/utils'
import type { Category, SubCategory } from '@/types/database'
import toast from 'react-hot-toast'

export default function ProductFormPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    sub_category_id: '',
    description: '',
    short_description: '',
    price: 0,
    compare_at_price: 0,
    stock_quantity: 100,
    images: [] as string[],
    features: [] as string[],
    best_for: '',
    is_active: true,
    is_featured: false,
    is_popular: false,
    is_just_dropped_hero: false,
    hero_video_url: '',
  })
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      setCategories(categoriesData || [])

      // Fetch sub-categories
      const { data: subCategoriesData } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      setSubCategories(subCategoriesData || [])

      // Fetch product if editing
      if (!isNew) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error || !data) {
          toast.error('Product not found')
          router.push('/masterman/products')
          return
        }

        setFormData({
          name: data.name,
          slug: data.slug,
          category_id: data.category_id || '',
          sub_category_id: data.sub_category_id || '',
          description: data.description || '',
          short_description: data.short_description || '',
          price: data.price,
          compare_at_price: data.compare_at_price || 0,
          stock_quantity: data.stock_quantity || 0,
          images: data.images || [],
          features: data.features || [],
          best_for: data.best_for || '',
          is_active: data.is_active,
          is_featured: data.is_featured,
          is_popular: data.is_popular || false,
          is_just_dropped_hero: data.is_just_dropped_hero || false,
          hero_video_url: data.hero_video_url || '',
        })
      }

      setIsLoading(false)
    }

    fetchData()
  }, [isNew, params.id, router])

  // Filter sub-categories when category changes
  useEffect(() => {
    if (formData.category_id) {
      const filtered = subCategories.filter(
        (sub) => sub.category_id === formData.category_id
      )
      setFilteredSubCategories(filtered)
    } else {
      setFilteredSubCategories([])
    }
  }, [formData.category_id, subCategories])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: isNew ? slugify(name) : formData.slug,
    })
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      })
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const supabase = createClient()
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          toast.error(`Failed to upload ${file.name}`)
          continue
        }

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl)
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData({
          ...formData,
          images: [...formData.images, ...uploadedUrls],
        })
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingVideo(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `hero-videos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        toast.error('Failed to upload video')
        return
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      if (urlData?.publicUrl) {
        setFormData({ ...formData, hero_video_url: urlData.publicUrl })
        toast.success('Video uploaded successfully')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload video')
    } finally {
      setIsUploadingVideo(false)
      if (videoInputRef.current) {
        videoInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = createClient()
      const dataToSave = {
        ...formData,
        category_id: formData.category_id || null,
        sub_category_id: formData.sub_category_id || null,
        compare_at_price: formData.compare_at_price || null,
      }

      if (isNew) {
        const { error } = await supabase.from('products').insert([dataToSave])
        if (error) throw error
        toast.success('Product created successfully')
      } else {
        const { error } = await supabase
          .from('products')
          .update(dataToSave)
          .eq('id', params.id)
        if (error) throw error
        toast.success('Product updated successfully')
      }

      router.push('/masterman/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product')
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
          href="/masterman/products"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">
          {isNew ? 'Add Product' : 'Edit Product'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900">Basic Information</h2>
            <div className="mt-4 space-y-4">
              <Input
                label="Product Name"
                placeholder="e.g., Premium NFC Business Card"
                value={formData.name}
                onChange={handleNameChange}
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Slug"
                  placeholder="premium-nfc-business-card"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                <Select
                  label="Category"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value, sub_category_id: '' })}
                  options={[
                    { value: '', label: 'Select category' },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                />
              </div>

              {filteredSubCategories.length > 0 && (
                <Select
                  label="Sub-Category (Optional)"
                  value={formData.sub_category_id}
                  onChange={(e) => setFormData({ ...formData, sub_category_id: e.target.value })}
                  options={[
                    { value: '', label: 'Select sub-category' },
                    ...filteredSubCategories.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                />
              )}

              <Textarea
                label="Short Description"
                placeholder="Brief product description (shown on product cards)"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="min-h-[80px]"
              />

              <Textarea
                label="Full Description"
                placeholder="Detailed product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[120px]"
              />

              <Input
                label="Best For"
                placeholder="e.g., Professionals, Businesses, Freelancers"
                value={formData.best_for}
                onChange={(e) => setFormData({ ...formData, best_for: e.target.value })}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900">Pricing & Stock</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Input
                label="Price (₹)"
                type="number"
                min="0"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
              <Input
                label="Compare At Price (₹)"
                type="number"
                min="0"
                step="1"
                placeholder="Original price"
                value={formData.compare_at_price || ''}
                onChange={(e) =>
                  setFormData({ ...formData, compare_at_price: parseFloat(e.target.value) || 0 })
                }
              />
              <Input
                label="Stock Quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) =>
                  setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* Features */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900">Features</h2>
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.features.length > 0 && (
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-[10px] bg-zinc-50 px-3 py-2"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900">Status</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span className="text-sm text-zinc-700">Active</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span className="text-sm text-zinc-700">Featured</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span className="text-sm text-zinc-700">Popular</span>
              </label>
              <div className="pt-3 mt-3 border-t border-zinc-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_just_dropped_hero}
                    onChange={(e) => setFormData({ ...formData, is_just_dropped_hero: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                  <span className="text-sm text-zinc-700 font-medium">Just Dropped Hero</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500 ml-7">Only one product can have this tag. Displays as hero in Just Dropped section with video background.</p>
              </div>
            </div>
          </div>

          {/* Hero Video - Only shown when Just Dropped Hero is checked */}
          {formData.is_just_dropped_hero && (
            <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
              <h2 className="font-semibold text-zinc-900">Hero Video</h2>
              <p className="mt-1 text-xs text-zinc-500">Upload a video for the Just Dropped hero background</p>
              <div className="mt-4 space-y-4">
                {/* Video Upload */}
                <div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-100 ${isUploadingVideo ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    {isUploadingVideo ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                        <span className="mt-2 text-sm text-zinc-500">Uploading video...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-zinc-500" />
                        <span className="mt-2 text-sm text-zinc-500">Click to upload video</span>
                        <span className="text-xs text-zinc-400">MP4, WEBM</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Video URL Input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-zinc-400">or add by URL</span>
                  </div>
                </div>
                <Input
                  placeholder="Video URL (e.g., https://example.com/video.mp4)"
                  value={formData.hero_video_url}
                  onChange={(e) => setFormData({ ...formData, hero_video_url: e.target.value })}
                />

                {/* Video Preview */}
                {formData.hero_video_url && (
                  <div className="relative aspect-video rounded-[10px] overflow-hidden bg-black">
                    <video
                      src={formData.hero_video_url}
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hero_video_url: '' })}
                      className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Images */}
          <div className="rounded-[10px] border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900">Images</h2>
            <div className="mt-4 space-y-4">
              {/* File Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-100 ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                      <span className="mt-2 text-sm text-zinc-500">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-zinc-500" />
                      <span className="mt-2 text-sm text-zinc-500">Click to upload images</span>
                      <span className="text-xs text-zinc-400">PNG, JPG, WEBP (multiple)</span>
                    </>
                  )}
                </label>
              </div>

              {/* URL Input */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-zinc-400">or add by URL</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <Button type="button" onClick={addImage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="group relative aspect-square">
                      <Image
                        src={image}
                        alt={`Product ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 45vw, 200px"
                        className="rounded-[10px] object-cover"
                      />
                      <div className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                        {index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-[10px] bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.images.length > 0 && (
                <p className="text-xs text-zinc-500">First image will be used as the main product image</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button type="submit" isLoading={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isNew ? 'Create Product' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
