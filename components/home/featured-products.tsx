import { createClient } from "@/utils/supabase/server";
import { FeaturedProductsClient } from "./featured-products-client";

export async function FeaturedProducts() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, short_description, price, compare_at_price, images, is_featured, stock_quantity")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8); // Increased limit for slider

  return <FeaturedProductsClient products={products || []} />;
}
