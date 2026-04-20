import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { AIReviewAnimatedContent } from '@/components/ai-review/animated-content'
import type { Product } from '@/types/database'

export const metadata: Metadata = {
  title: 'AI Review Card',
  description:
    'Boost your Google reviews with our AI-powered NFC Review Cards. Make it easy for customers to leave positive reviews.',
}

export default async function AIReviewCardPage() {
  const supabase = await createClient()

  // Fetch all featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('id, slug, name, short_description, price, compare_at_price, images, is_featured, stock_quantity')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const products: Product[] = featuredProducts || []

  return <AIReviewAnimatedContent products={products} />
}
