import { restaurants } from "@/data/restaurants";
import { pageMetadata } from "@/lib/seo";
import { RestaurantPage } from "@/sections/restaurant/RestaurantPage";

const r = restaurants.miimar;

export const metadata = pageMetadata({ title: r.seo.title, description: r.seo.description, path: r.path, absoluteTitle: true });

export default function Page() {
  return <RestaurantPage r={r} />;
}
