import rawData from './meta_api_mock.json'

export const metaCampaigns = rawData.campaigns.data.map(campaign => {
  const insights = rawData.insights.data.find(i => i.campaign_id === campaign.id) || {}
  const purchases = insights.actions?.find(a => a.action_type === 'purchase')?.value || 0
  const revenue = insights.action_values?.find(a => a.action_type === 'purchase')?.value || 0
  
  const roas = insights.spend ? parseFloat((revenue / insights.spend).toFixed(1)) : 0
  
  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status === 'ACTIVE' ? 'Active' : 'Paused',
    spend: insights.spend || 0,
    impressions: insights.impressions || 0,
    clicks: insights.clicks || 0,
    conversions: purchases,
    roas: roas,
    platform: campaign.name.toLowerCase().includes('instagram') ? 'Instagram' : 'Facebook',
    dailyBudget: campaign.daily_budget ? parseFloat(campaign.daily_budget) : 0
  }
})

export const extractedAssets = {
  images: rawData.adcreatives.data.map(c => c.image_url),
  headlines: rawData.adcreatives.data.map(c => c.title),
  audience: rawData.customaudiences.data.map(a => a.name)
}

export const adAccount = rawData.adaccount || {}
