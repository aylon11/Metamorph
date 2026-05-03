import express from 'express';
import cors from 'cors';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import fs from 'fs';
import path from 'path';


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()], // Assumes GOOGLE_GENAI_API_KEY is in env
  model: googleAI.model('gemini-3.1-flash-lite-preview'),
});

// Define the re-optimization flow
const reoptimizeFlow = ai.defineFlow(
  { name: 'reoptimizeFlow' },
  async (input) => {
    const { campaigns } = input;

    const prompt = `
      You are a Senior Google Ads Growth Specialist with deep expertise in Quality Score optimization, search intent alignment, and Responsive Search Ads (RSA) best practices.
      
      I am providing you with a list of Meta Ads campaigns, each with its name and associated creative assets (headlines). Meta assets tend to be more emotional, visually descriptive, and social-proof driven.
      
      Your task is to perform a "Campaign Metamorphosis": for EACH campaign, translate and re-optimize its assets into high-intent, performance-driven text assets for a Google Ads Search campaign.
      
      Meta Campaigns Data:
      ${campaigns.map(c => `
      - Campaign ID: ${c.id}
        Name: ${c.name}
        Source Headlines: ${c.assets.headlines.join(' | ')}
      `).join('\n')}
      
      Guidelines for Google Ads Assets (Produce these FOR EACH campaign):
      1. **Headlines**: Generate exactly 15 headlines. Max 30 characters each. Include a mix of high-intent keywords, value props, and CTAs.
      2. **Descriptions**: Generate exactly 4 descriptions. Max 90 characters each.
      3. **Keywords**: Generate a list of 10 highly relevant keywords.
         
      Strict Output Format:
      You MUST respond with a valid JSON object ONLY. Do not include any markdown formatting, backticks, or extra text. The JSON must have this exact structure, mapping campaign IDs to their generated assets:
      {
        "meta_1": {
          "headlines": ["Headline 1", "Headline 2", ...],
          "descriptions": ["Description 1", "Description 2", ...],
          "keywords": ["keyword 1", "keyword 2", ...]
        },
        "meta_2": {
          ...
        }
      }
      
      Ensure all string lengths are strictly within the limits (30 for headlines, 90 for descriptions).
    `;

    const response = await ai.generate(prompt, { config: { temperature: 0.8 } });

    try {
      // Attempt to parse JSON response
      return JSON.parse(response.text);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', response.text);
      // Fallback or error handling
      return {
        error: "Failed to parse AI response",
        raw: response.text
      };
    }
  }
);

app.post('/api/reoptimize', async (req, res) => {
  try {
    const result = await reoptimizeFlow(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error running Genkit flow:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Google Ads API Helpers ---

function loadGoogleAdsConfig() {
  const configPath = path.resolve(process.cwd(), 'google-ads.yaml');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found at ${configPath}`);
  }
  const content = fs.readFileSync(configPath, 'utf8');
  const config = {};
  content.split('\n').forEach(line => {
    const commentIdx = line.indexOf('#');
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx);
    }
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      if (key && value) {
        config[key] = value;
      }
    }
  });
  
  const required = ['client_id', 'client_secret', 'refresh_token', 'developer_token', 'login_customer_id'];
  for (const field of required) {
    if (!config[field]) {
      throw new Error(`Missing required field in google-ads.yaml: ${field}`);
    }
  }
  config.login_customer_id = config.login_customer_id.replace(/-/g, '');
  return config;
}

async function getAccessToken(config) {
  const url = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams();
  params.append('client_id', config.client_id);
  params.append('client_secret', config.client_secret);
  params.append('refresh_token', config.refresh_token);
  params.append('grant_type', 'refresh_token');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh access token: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function getUserEmail(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.email;
    }
  } catch (e) {
    console.error('Failed to fetch user email:', e);
  }
  return null;
}

async function callGoogleAdsApi(endpoint, method, headers, body = null) {
  const API_VERSION = 'v24'; // Updated from v17

  const url = `https://googleads.googleapis.com/${API_VERSION}/${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = typeof data === 'object' ? JSON.stringify(data) : data;
    throw new Error(`Google Ads API Error: ${response.status} ${response.statusText} - ${errorMsg}`);
  }

  return data;
}


async function createAccount(config, accessToken, accountName) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': config.developer_token,
    'login-customer-id': config.login_customer_id,
  };
  const body = {
    customerClient: {
      descriptiveName: accountName,
      currencyCode: 'USD',
      timeZone: 'America/New_York',
    },
  };
  
  const result = await callGoogleAdsApi(`customers/${config.login_customer_id}:createCustomerClient`, 'POST', headers, body);
  const parts = result.resourceName.split('/');
  return parts[parts.length - 1];
}

async function createSharedBudget(config, accessToken, customerId, monthlyBudget) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': config.developer_token,
    'login-customer-id': config.login_customer_id,
  };
  
  // Google Ads API requires budget to be a multiple of the minimum currency unit (cents for USD, which is 10,000 micros).
  // (monthlyBudget / 30.4) gives daily budget. We round to nearest cent, then convert to micros.
  const dailyBudgetMicros = Math.round((monthlyBudget / 30.4) * 100) * 10000;

  const body = {
    operations: [
      {
        create: {
          name: `Shared Budget - ${Date.now()}`,
          amountMicros: dailyBudgetMicros,
          explicitlyShared: true,
        },
      },
    ],
  };
  
  const result = await callGoogleAdsApi(`customers/${customerId}/campaignBudgets:mutate`, 'POST', headers, body);
  return result.results[0].resourceName;
}

async function createCampaign(config, accessToken, customerId, campaignName, budgetResourceName) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': config.developer_token,
    'login-customer-id': config.login_customer_id,
  };
  
  const body = {
    operations: [
      {
        create: {
          name: campaignName,
          advertisingChannelType: 'SEARCH',
          status: 'ENABLED', // Per user approval
          campaignBudget: budgetResourceName,
          manualCpc: {},
          containsEuPoliticalAdvertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING', // Required in v24+ for non-political campaigns

          networkSettings: {

            targetGoogleSearch: true,
            targetSearchNetwork: true,
            targetContentNetwork: false,
            targetPartnerSearchNetwork: false,
          },
        },
      },
    ],
  };
  
  const result = await callGoogleAdsApi(`customers/${customerId}/campaigns:mutate`, 'POST', headers, body);
  return result.results[0].resourceName;
}

async function createAdGroup(config, accessToken, customerId, campaignResourceName, adGroupName) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': config.developer_token,
    'login-customer-id': config.login_customer_id,
  };
  
  const body = {
    operations: [
      {
        create: {
          name: adGroupName,
          campaign: campaignResourceName,
          status: 'ENABLED',
          type: 'SEARCH_STANDARD',
          cpcBidMicros: 1000000, // Default $1.00 bid
        },
      },
    ],
  };
  
  const result = await callGoogleAdsApi(`customers/${customerId}/adGroups:mutate`, 'POST', headers, body);
  return result.results[0].resourceName;
}

async function createResponsiveSearchAd(config, accessToken, customerId, adGroupResourceName, assets, websiteUrl) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': config.developer_token,
    'login-customer-id': config.login_customer_id,
  };
  
  const headlines = (assets.headlines && assets.headlines.length >= 3) 
    ? assets.headlines 
    : ['Shop Now', 'Best Quality', 'Great Prices'];
  const descriptions = (assets.descriptions && assets.descriptions.length >= 2) 
    ? assets.descriptions 
    : ['Best products in town.', 'Order online today.'];
    
  const apiHeadlines = headlines.slice(0, 15).map(h => ({ text: h }));
  const apiDescriptions = descriptions.slice(0, 4).map(d => ({ text: d }));
  
  const body = {
    operations: [
      {
        create: {
          adGroup: adGroupResourceName,
          status: 'ENABLED',
          ad: {
            responsiveSearchAd: {
              headlines: apiHeadlines,
              descriptions: apiDescriptions,
              path1: 'shop',
              path2: 'now',
            },
            finalUrls: [websiteUrl],
          },
        },
      },
    ],
  };
  
  const result = await callGoogleAdsApi(`customers/${customerId}/adGroupAds:mutate`, 'POST', headers, body);
  return result.results[0].resourceName;
}

async function createKeywords(config, accessToken, customerId, adGroupResourceName, keywords) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': config.developer_token,
    'login-customer-id': config.login_customer_id,
  };
  
  const operations = keywords.map(kw => ({
    create: {
      adGroup: adGroupResourceName,
      status: 'ENABLED',
      keyword: {
        text: kw,
        matchType: 'PHRASE',
      },
    },
  }));
  
  const body = {
    operations,
  };
  
  const result = await callGoogleAdsApi(`customers/${customerId}/adGroupCriteria:mutate`, 'POST', headers, body);
  return result.results;
}

// --- API Routes ---

app.post('/api/deploy', async (req, res) => {
  console.log('Received deployment request:', JSON.stringify(req.body, null, 2));
  try {
    const { accountName, websiteUrl, budgetAmount, structure, assets, keywords, activeKeywords } = req.body;
    
    console.log('1. Loading Google Ads Config...');
    const config = loadGoogleAdsConfig();
    
    console.log('2. Refreshing Access Token...');
    const accessToken = await getAccessToken(config);
    
    console.log('2b. Fetching User Email...');
    const userEmail = await getUserEmail(accessToken) || config.user_email;
    console.log(`>>> User Email: ${userEmail || 'Not Found'}`);
    
    console.log(`3. Creating Customer Account: "${accountName}" under MCC ${config.login_customer_id}...`);
    const customerId = await createAccount(config, accessToken, accountName);
    console.log(`>>> Created Account ID: ${customerId}`);
    

    
    console.log(`4. Creating Shared Budget: $${budgetAmount}/mo ($${(budgetAmount/30.4).toFixed(2)}/day)...`);
    const budgetResourceName = await createSharedBudget(config, accessToken, customerId, budgetAmount);
    console.log(`>>> Created Shared Budget: ${budgetResourceName}`);
    
    console.log('5. Deploying Structure...');
    for (const camp of structure) {
      console.log(`  Deploying Campaign: "${camp.name}"...`);
      const campaignResourceName = await createCampaign(config, accessToken, customerId, camp.name, budgetResourceName);
      console.log(`  >>> Created Campaign: ${campaignResourceName}`);
      

      
      // Get assets for this campaign, fallback if needed
      let campAssets = assets[camp.id];
      if (!campAssets) {
        campAssets = {
          headlines: [
            `Shop ${camp.name}`.substring(0, 30),
            `${camp.name} Sale`.substring(0, 30),
            `${camp.name} Deals`.substring(0, 30),
            `Celebrate ${camp.name}`.substring(0, 30),
            'Best Quality Plants',
            'Exotic Indoor Plants',
            'Healthy Plants Delivered',
            'Bring Nature Indoors'
          ].slice(0, 15),
          descriptions: [
            `Find the perfect plants for ${camp.name}. Limited time offers inside.`.substring(0, 90),
            `Celebrate ${camp.name} with our exclusive indoor plant collection.`.substring(0, 90),
            'Transform your space with beautiful indoor plants.',
            'Healthy, vibrant plants guaranteed. 30-day health guarantee.'
          ].slice(0, 4)
        };
      }

      
      // Get keywords for this campaign, filter by what's active if available
      let campKeywords = keywords[camp.id] || [];
      if (activeKeywords && activeKeywords.length > 0) {
        // Filter campaign keywords to only include those that are still active
        campKeywords = campKeywords.filter(kw => activeKeywords.includes(kw));
        
        // If this is a custom campaign, it might not have specific keywords in the 'keywords' map.
        // In that case, we could add some general keywords from activeKeywords, but let's stick to structure for now.
        if (camp.id.startsWith('custom_') && campKeywords.length === 0) {
          // Fallback: use a few relevant keywords from the global active pool as a guess
          campKeywords = activeKeywords.slice(0, 5);
        }
      }
      
      for (const ag of camp.adGroups) {
        console.log(`    Deploying Ad Group: "${ag.name}"...`);
        const adGroupResourceName = await createAdGroup(config, accessToken, customerId, campaignResourceName, ag.name);
        console.log(`    >>> Created Ad Group: ${adGroupResourceName}`);
        
        console.log('    Deploying Responsive Search Ad...');
        await createResponsiveSearchAd(config, accessToken, customerId, adGroupResourceName, campAssets, websiteUrl);
        
        if (campKeywords.length > 0) {
          console.log(`    Deploying ${campKeywords.length} Keywords...`);
          await createKeywords(config, accessToken, customerId, adGroupResourceName, campKeywords);
        }
      }
    }
    
    console.log('Deployment completed successfully!');
    res.json({ success: true, customerId, userEmail, mccOcid: config.mcc_ocid || null });


  } catch (error) {
    console.error('Deployment failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

