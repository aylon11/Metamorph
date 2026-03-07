export const businessProfile = {
  name: "Urban Jungle Plants",
  industry: "Home & Garden",
  website: "https://urbanjungle.example.com"
}

export const metaCampaigns = [
  {
    id: "meta_1",
    name: "Spring Sale - Instagram Boost",
    status: "Active",
    spend: 4500,
    impressions: 125000,
    clicks: 3200,
    conversions: 85,
    roas: 2.1,
    platform: "Instagram"
  },
  {
    id: "meta_2",
    name: "Rare Philodendrons Retargeting",
    status: "Active",
    spend: 2100,
    impressions: 45000,
    clicks: 950,
    conversions: 42,
    roas: 3.4,
    platform: "Facebook"
  },
  {
    id: "meta_3",
    name: "New Arrivals Carousel",
    status: "Paused",
    spend: 1200,
    impressions: 28000,
    clicks: 400,
    conversions: 15,
    roas: 1.8,
    platform: "Instagram"
  }
]

export const extractedAssets = {
  images: [
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=2449&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1463320898484-cdee8141c787?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop"
  ],
  headlines: [
    "Bring Nature Indoors",
    "Rare Philodendrons Restocked",
    "Urban Jungle - Plant Sale",
    "Transform Your Space"
  ],
  audience: [
    "Home Decor Enthusiasts (Top 5%)",
    "Apartment Living",
    "Botany Interests",
    "Sustainable Lifestyle"
  ]
}

export const recommendedGoogleCampaigns = [
  {
    id: "google_1",
    name: "Urban Jungle - Performance Max",
    type: "Performance Max",
    description: "Captures high-intent search and visual inventory across all Google channels.",
    forecast: {
      spend: 5000,
      conversions: 180,
      roas: 4.8,
      revenue: 24000
    },
    assets: [
      "Headlines: 'Rare Indoor Plants', 'Urban Jungle Sale', 'Shop Houseplants'",
      "Images: [Extracted from Instagram Posts]",
      "Audience: 'Home Decor Enthusiasts', 'Plant Parents'"
    ]
  },
  {
    id: "google_2",
    name: "Brand Search - Urban Jungle",
    type: "Search",
    description: "Protects your brand name and captures high-intent navigation queries.",
    forecast: {
      spend: 500,
      conversions: 60,
      roas: 12.5,
      revenue: 6250
    },
    assets: [
      "Keywords: 'Urban Jungle Plants', 'Urban Jungle Store'",
      "Sitelinks: 'New Arrivals', 'Care Guides', 'Gift Cards'"
    ]
  }
]

export const impactForecast = {
  currentMonthlyRevenue: 15800, // Derived from Meta ROAS approx
  projectedMonthlyRevenue: 46050,
  incrementalRevenue: 30250,
  roasLift: "+125%"
}
