import { site } from "@/data/site";
import type { Restaurant } from "@/data/restaurants";
import { restaurantList } from "@/data/restaurants";

const address = {
  "@type": "PostalAddress",
  streetAddress: `${site.address.street}, ${site.address.floor} (${site.address.venue})`,
  addressLocality: site.address.city,
  addressRegion: site.address.state,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
};

const hours = site.hours.map((h) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: h.schema.days,
  opens: h.schema.opens,
  closes: h.schema.closes,
}));

const ID = `${site.url}/#vila-medi`;

/** Restaurant + LocalBusiness — entidade principal (home). */
export function vilaMediSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": ID,
    name: site.name,
    description: site.description,
    url: site.url,
    image: [`${site.url}/opengraph-image.jpg`],
    logo: `${site.url}/brand/emblema.svg`,
    telephone: site.phone,
    email: site.email,
    address,
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.directionsUrl,
    openingHoursSpecification: hours,
    servesCuisine: ["Mediterrânea", "Italiana", "Grega", "Frutos do mar"],
    priceRange: "$$$$",
    acceptsReservations: `${site.url}/reservas`,
    hasMenu: `${site.url}/gastronomia#cardapio`,
    sameAs: [site.instagram.url],
    containedInPlace: { "@type": "ShoppingCenter", name: site.address.venue, address },
    department: restaurantList.map((r) => ({ "@type": "Restaurant", name: r.name, url: `${site.url}${r.path}` })),
    award: `${site.press.award.outlet} ${site.press.award.title}: ${site.press.award.detail}`,
  };
}

export function restaurantSchema(r: Restaurant) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `${r.name} | Vila Medí`,
    description: r.seo.description,
    url: `${site.url}${r.path}`,
    servesCuisine: r.seo.cuisine,
    address,
    telephone: site.phone,
    priceRange: "$$$$",
    acceptsReservations: `${site.url}/reservas`,
    openingHoursSpecification: hours,
    containedInPlace: { "@id": ID },
  };
}
