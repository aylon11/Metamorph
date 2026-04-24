import { ref } from 'vue'

export const optimizedAdPreviews = ref({}) // { campaignId: { headlines: [], descriptions: [] } }
export const optimizedKeywords = ref({}) // { campaignId: [] }
export const isDataLoaded = ref(false)
export const deployedCustomerId = ref(null)
export const deployedUserEmail = ref(null)
export const deployedMccOcid = ref(null)



