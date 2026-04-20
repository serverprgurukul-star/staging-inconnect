import { createClient } from "@/utils/supabase/server";
import { JustDroppedClient } from "./just-dropped-client";
import type { Product } from "@/types/database";

export async function JustDropped() {
    const supabase = await createClient();

    // Fetch the just dropped hero product (only one can have this tag)
    const { data: heroProduct } = await supabase
        .from("products")
        .select("id, slug, name, short_description, price, compare_at_price, images, is_featured, stock_quantity, hero_video_url, is_just_dropped_hero")
        .eq("is_active", true)
        .eq("is_just_dropped_hero", true)
        .single();

    // Fetch other newest products for the side cards (exclude hero if exists)
    const { data: products } = await supabase
        .from("products")
        .select("id, slug, name, short_description, price, compare_at_price, images, is_featured, stock_quantity, hero_video_url, is_just_dropped_hero")
        .eq("is_active", true)
        .neq("is_just_dropped_hero", true)
        .order("created_at", { ascending: false })
        .limit(2);

    return <JustDroppedClient heroProduct={heroProduct as unknown as Product} products={(products || []) as unknown as Product[]} />;
}
