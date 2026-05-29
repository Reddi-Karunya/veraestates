import type { CostBreakdownComputed } from "@/lib/cost/types";

export type PropertyType = "apartment" | "land" | "villa";

export type PropertySpecs = {
  bhk?: number;
  bathrooms?: number;
  builtUpAreaSqft?: number;
  carpetAreaSqft?: number;
  plotAreaSqyd?: number;
  plotAreaAcres?: number;
  floor?: number;
  totalFloors?: number;
  facing?: string;
  furnishing?: string;
  parking?: number;
  ageYears?: number;
  reraId?: string;
  societyName?: string;
  amenities?: string[];
};

export type PropertyLocation = {
  locality: string;
  landmark?: string;
  pincode?: string;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  locality: string;
  city: string;
  state: string;
  location: PropertyLocation;
  priceInr: number;
  propertyType: PropertyType;
  specsLabel: string;
  specs: PropertySpecs;
  image: string;
  images: string[];
  badges: string[];
  isFeatured: boolean;
  publishedAt: string;
  listingStatus?: string;
  verificationStatus?: string;
  approvalType?: string | null;
  ownershipStatus?: string | null;
  amenities?: string[];
  googleMapsUrl?: string | null;
  isPublished?: boolean;
  trustScore?: number;
  isVerified?: boolean;
  verificationChecks?: PropertyVerificationCheckDisplay[];
  costBreakdown?: CostBreakdownComputed;
};

export const properties: Property[] = [
  {
    id: "1",
    slug: "skyline-residence-gachibowli",
    title: "Skyline Residence",
    shortDescription: "Premium 3 BHK with ORR connectivity and clubhouse access.",
    description:
      "Skyline Residence offers a refined urban lifestyle in the heart of Gachibowli. This east-facing 3 BHK features floor-to-ceiling windows, modular kitchen, and two covered parking slots. The society includes a rooftop infinity pool, co-working lounge, and 24/7 security. Ideal for IT professionals and families seeking verified, RERA-compliant living near Financial District.",
    locality: "Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    location: { locality: "Gachibowli", landmark: "Near ORR", pincode: "500032" },
    priceInr: 1_85_00_000,
    propertyType: "apartment",
    specsLabel: "3 BHK · 1,450 sq ft",
    specs: {
      bhk: 3,
      bathrooms: 2,
      builtUpAreaSqft: 1450,
      carpetAreaSqft: 1200,
      floor: 12,
      totalFloors: 18,
      facing: "East",
      furnishing: "Semi-furnished",
      parking: 2,
      ageYears: 2,
      reraId: "P02400001234",
      societyName: "Skyline Residency",
      amenities: ["Lift", "Power backup", "Clubhouse", "Swimming pool"],
    },
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    badges: ["Title Verified", "RERA Registered", "Site Visited"],
    isFeatured: true,
    publishedAt: "2026-03-15",
  },
  {
    id: "2",
    slug: "emerald-heights-bandra",
    title: "Emerald Heights",
    shortDescription: "Sea-view 4 BHK in Bandra West with premium finishes.",
    description:
      "Emerald Heights is an exclusive address on Bandra's leafy periphery. This expansive 4 BHK spans two levels of luxury — Italian marble flooring, smart home automation, and a private terrace with partial sea views. Verified encumbrance-free title and documented society NOC. A rare opportunity for discerning Mumbai buyers.",
    locality: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    location: { locality: "Bandra West", landmark: "Near Carter Road", pincode: "400050" },
    priceInr: 4_20_00_000,
    propertyType: "apartment",
    specsLabel: "4 BHK · 2,100 sq ft",
    specs: {
      bhk: 4,
      bathrooms: 4,
      builtUpAreaSqft: 2100,
      carpetAreaSqft: 1750,
      floor: 14,
      totalFloors: 22,
      facing: "West",
      furnishing: "Fully furnished",
      parking: 3,
      ageYears: 5,
      reraId: "P51800004567",
      societyName: "Emerald Heights CHS",
      amenities: ["Lift", "Gym", "Concierge", "Sea view terrace"],
    },
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    badges: ["Site Visited", "Encumbrance Clear", "Title Verified"],
    isFeatured: true,
    publishedAt: "2026-02-28",
  },
  {
    id: "3",
    slug: "lakeview-estate-devanahalli",
    title: "Lakeview Estate Plot",
    shortDescription: "East-facing plot near airport corridor with clear title.",
    description:
      "A premium land parcel in Devanahalli's fast-growing corridor, minutes from Kempegowda International Airport. The plot is levelled, boundary-marked, and approved for residential villa construction. Ideal for end-users or long-term investors seeking verified agricultural-to-residential converted land with BBMP-ready documentation.",
    locality: "Devanahalli",
    city: "Bengaluru",
    state: "Karnataka",
    location: { locality: "Devanahalli", landmark: "Airport Road", pincode: "562110" },
    priceInr: 95_00_000,
    propertyType: "land",
    specsLabel: "2,400 sq yd · East facing",
    specs: {
      plotAreaSqyd: 2400,
      facing: "East",
    },
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=1200&q=80",
    ],
    badges: ["Title Verified", "Site Visited"],
    isFeatured: true,
    publishedAt: "2026-04-01",
  },
  {
    id: "4",
    slug: "palm-grove-villa-alibag",
    title: "Palm Grove Villa",
    shortDescription: "Coastal 5 BHK villa with private pool and garden.",
    description:
      "Escape to Palm Grove — a contemporary villa nestled in Alibag's green belt. Five en-suite bedrooms, infinity pool, and landscaped gardens across 4,800 sq ft of built-up area. Perfect weekend retreat or luxury primary residence with verified title and coastal regulation clearance.",
    locality: "Alibag",
    city: "Raigad",
    state: "Maharashtra",
    location: { locality: "Alibag", landmark: "Nagaon Beach Road", pincode: "402201" },
    priceInr: 2_75_00_000,
    propertyType: "villa",
    specsLabel: "5 BHK · 4,800 sq ft · Private pool",
    specs: {
      bhk: 5,
      bathrooms: 5,
      builtUpAreaSqft: 4800,
      plotAreaSqyd: 5500,
      facing: "North-East",
      furnishing: "Fully furnished",
      parking: 4,
      ageYears: 3,
      amenities: ["Private pool", "Garden", "Generator", "Smart home"],
    },
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80",
    ],
    badges: ["RERA Registered", "Title Verified", "Encumbrance Clear"],
    isFeatured: true,
    publishedAt: "2026-01-20",
  },
  {
    id: "5",
    slug: "central-park-apartments-noida",
    title: "Central Park Residences",
    shortDescription: "Spacious 2 BHK in Sector 150 with metro access.",
    description:
      "Well-maintained 2 BHK in Noida's Sector 150 — a planned township with green buffers and excellent connectivity to Noida Expressway. Verified RERA registration, society maintenance records reviewed, and site visit completed. Strong rental yield potential.",
    locality: "Sector 150",
    city: "Noida",
    state: "Uttar Pradesh",
    location: { locality: "Sector 150", pincode: "201310" },
    priceInr: 1_15_00_000,
    propertyType: "apartment",
    specsLabel: "2 BHK · 1,050 sq ft",
    specs: {
      bhk: 2,
      bathrooms: 2,
      builtUpAreaSqft: 1050,
      carpetAreaSqft: 820,
      floor: 8,
      totalFloors: 25,
      facing: "North",
      furnishing: "Unfurnished",
      parking: 1,
      ageYears: 4,
      reraId: "UPRERAPRJ123456",
      societyName: "Central Park",
      amenities: ["Lift", "Park", "Kids play area"],
    },
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    ],
    badges: ["RERA Registered", "Site Visited"],
    isFeatured: false,
    publishedAt: "2026-04-10",
  },
  {
    id: "6",
    slug: "greenfield-plots-shamshabad",
    title: "Greenfield Plots Shamshabad",
    shortDescription: "DTCP-approved plots starting from 200 sq yd.",
    description:
      "Gated layout of DTCP-approved residential plots near Shamshabad, ideal for villa construction with proximity to Hyderabad's southern growth corridor. Each plot has individual survey numbers, clear title, and on-ground boundary verification completed by our team.",
    locality: "Shamshabad",
    city: "Hyderabad",
    state: "Telangana",
    location: { locality: "Shamshabad", landmark: "RGIA Road", pincode: "501218" },
    priceInr: 45_00_000,
    propertyType: "land",
    specsLabel: "200 sq yd · North facing",
    specs: {
      plotAreaSqyd: 200,
      facing: "North",
    },
    image:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&q=80",
    ],
    badges: ["Title Verified", "Encumbrance Clear"],
    isFeatured: false,
    publishedAt: "2026-03-22",
  },
  {
    id: "7",
    slug: "prestige-towers-indiranagar",
    title: "Prestige Towers",
    shortDescription: "3 BHK corner unit in Indiranagar with park view.",
    description:
      "Corner 3 BHK in one of Bengaluru's most sought-after neighbourhoods. Tree-lined views, cross-ventilation, and walking distance to metro. Full verification package including Khata, EC, and society NOC reviewed.",
    locality: "Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    location: { locality: "Indiranagar", pincode: "560038" },
    priceInr: 2_45_00_000,
    propertyType: "apartment",
    specsLabel: "3 BHK · 1,680 sq ft",
    specs: {
      bhk: 3,
      bathrooms: 3,
      builtUpAreaSqft: 1680,
      carpetAreaSqft: 1380,
      floor: 6,
      totalFloors: 10,
      facing: "South-East",
      furnishing: "Semi-furnished",
      parking: 2,
      ageYears: 8,
      societyName: "Prestige Towers",
      amenities: ["Lift", "Power backup", "Visitor parking"],
    },
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    ],
    badges: ["Title Verified", "Site Visited", "Encumbrance Clear"],
    isFeatured: false,
    publishedAt: "2026-02-10",
  },
  {
    id: "8",
    slug: "sunset-villa-goa",
    title: "Sunset Villa Goa",
    shortDescription: "4 BHK hillside villa with panoramic valley views.",
    description:
      "Architect-designed villa in Assagao with infinity-edge pool and outdoor entertaining deck. Portuguese-inspired aesthetics meet modern amenities. Verified sale deed and conversion sanad on file.",
    locality: "Assagao",
    city: "North Goa",
    state: "Goa",
    location: { locality: "Assagao", pincode: "403507" },
    priceInr: 3_50_00_000,
    propertyType: "villa",
    specsLabel: "4 BHK · 3,200 sq ft",
    specs: {
      bhk: 4,
      bathrooms: 4,
      builtUpAreaSqft: 3200,
      plotAreaSqyd: 4000,
      facing: "West",
      furnishing: "Fully furnished",
      parking: 2,
      ageYears: 6,
      amenities: ["Pool", "Valley view", "Staff quarters"],
    },
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    badges: ["Title Verified", "Site Visited"],
    isFeatured: false,
    publishedAt: "2026-04-05",
  },
];

/** @deprecated Use `properties` and filter by isFeatured */
export const featuredProperties = properties.filter((p) => p.isFeatured);

export type PropertyVerificationCheckDisplay = {
  checkType: string;
  label: string;
  status: string;
  verifiedAt: string | null;
};

export type PropertyListItem = Pick<
  Property,
  | "id"
  | "slug"
  | "title"
  | "locality"
  | "city"
  | "state"
  | "priceInr"
  | "propertyType"
  | "specsLabel"
  | "image"
  | "badges"
  | "trustScore"
  | "isVerified"
  | "costBreakdown"
>;

