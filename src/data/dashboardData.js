export const performanceData = {
  summary: {
    totalSpend: 12500,
    totalRevenue: 45000,
    blendedRoas: 3.6,
    fundsDiverted: 5000,
    roiLift: "45%"
  },
  googleAds: {
    campaigns: [
      { id: "g_perf_1", name: "Urban Jungle - PMax", status: "Active", spend: 5000, impressions: 150000, clicks: 4500, conversions: 120, revenue: 25000, roas: 5.0 },
      { id: "g_perf_2", name: "Brand Search", status: "Active", spend: 1000, impressions: 20000, clicks: 1200, conversions: 50, revenue: 8000, roas: 8.0 }
    ],
    totals: { spend: 6000, impressions: 170000, clicks: 5700, conversions: 170, revenue: 33000, roas: 5.5 }
  },
  metaAds: {
    campaigns: [
      { id: "m_perf_1", name: "Spring Sale - IG", status: "Active", spend: 4000, impressions: 100000, clicks: 2500, conversions: 60, revenue: 8000, roas: 2.0 },
      { id: "m_perf_2", name: "Retargeting", status: "Active", spend: 2500, impressions: 35000, clicks: 800, conversions: 30, revenue: 4000, roas: 1.6 }
    ],
    totals: { spend: 6500, impressions: 135000, clicks: 3300, conversions: 90, revenue: 12000, roas: 1.85 }
  },
  timeSeriesData: [
    { date: "2026-04-01", googleSpend: 100, googleRevenue: 400, metaSpend: 300, metaRevenue: 500 },
    { date: "2026-04-05", googleSpend: 150, googleRevenue: 700, metaSpend: 250, metaRevenue: 450 },
    { date: "2026-04-10", googleSpend: 200, googleRevenue: 1000, metaSpend: 200, metaRevenue: 400 },
    { date: "2026-04-15", googleSpend: 250, googleRevenue: 1500, metaSpend: 150, metaRevenue: 350 }
  ]
}
