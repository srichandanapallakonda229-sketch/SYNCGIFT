const express = require('express');
const router = express.Router();
const db = require('../db');
const { OpenAI } = require('openai');

// Initialize OpenAI client optionally
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Fisher-Yates shuffle for randomization
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

router.post('/recommend', async (req, res) => {
  const { message, occasion, budget, age, gender, relationship, interests } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const products = await db.getProducts();

    if (openai) {
      try {
        const response = await getAIOpenAIRecommendations(message, { occasion, budget, age, gender, relationship, interests }, products);
        return res.status(200).json(response);
      } catch (err) {
        console.error('OpenAI call failed, running rule-based fallback:', err.message);
      }
    }

    // Fallback rule-based recommendation with randomization
    const fallbackResponse = getRuleBasedRecommendations(message, { occasion, budget, age, gender, relationship, interests }, products);
    res.status(200).json(fallbackResponse);
  } catch (error) {
    console.error('AI assistant error:', error.message);
    res.status(500).json({ error: 'AI Assistant failed to generate recommendations' });
  }
});

// OpenAI API handler
async function getAIOpenAIRecommendations(message, context, products) {
  const inventoryStr = products.map(p =>
    `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: ₹${p.price}, Rating: ${p.rating}, Description: ${p.description}`
  ).join('\n');

  const systemPrompt = `You are "SyncGifts AI", the premium conversational gift shopping assistant for SyncGifts store.
Your goal is to parse the user's gift request, check our store's inventory, and recommend 4-6 specific products.
Explain briefly and engagingly why each item is a great fit for their situation.

Current Store Inventory:
${inventoryStr}

Guidelines:
1. ONLY recommend products from the inventory list above. Do NOT invent new products.
2. If the user mentions a budget (e.g. "under 3000", "below 5000"), prioritize products within or very close to that budget.
3. Be enthusiastic, modern, helpful, and polite.
4. Match occasion precisely — birthday gifts for birthdays, anniversary gifts for anniversaries, etc.
5. If context includes gender, relationship, or interests, use them to refine selection.
6. You MUST return your response as a valid JSON object with the following structure:
{
  "reply": "Your main conversational reply text...",
  "recommendedProductIds": ["prod_id1", "prod_id2", "prod_id3", "prod_id4"]
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Request: "${message}"\nContext: ${JSON.stringify(context)}` }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

// Rule-based recommendation engine with smart randomization
function getRuleBasedRecommendations(message, context, products) {
  const msg = message.toLowerCase();

  // 1. Extract budget limit from context or message
  let budgetLimit = parseFloat(context.budget) || Infinity;
  if (budgetLimit === Infinity) {
    const budgetMatch = msg.match(/(?:under|below|less than|budget|₹|rs\.?)\s*(\d+)/i);
    if (budgetMatch) {
      budgetLimit = parseFloat(budgetMatch[1]);
    }
  }

  // 2. Identify target occasion from context or message keywords
  let targetOccasion = (context.occasion || '').toLowerCase();
  if (!targetOccasion) {
    if (msg.includes('birthday') || msg.includes('bday')) targetOccasion = 'birthday gifts';
    else if (msg.includes('wedding') || msg.includes('marriage') || msg.includes('shaadi')) targetOccasion = 'wedding gifts';
    else if (msg.includes('anniversary')) targetOccasion = 'anniversary gifts';
    else if (msg.includes('baby') || msg.includes('shower') || msg.includes('newborn')) targetOccasion = 'baby shower';
    else if (msg.includes('house') || msg.includes('warming') || msg.includes('new home') || msg.includes('griha pravesh')) targetOccasion = 'housewarming';
    else if (msg.includes('diwali') || msg.includes('christmas') || msg.includes('rakhi') || msg.includes('eid') || msg.includes('holi') || msg.includes('festival') || msg.includes('ugadi') || msg.includes('sankranti')) targetOccasion = 'festivals';
    else if (msg.includes('corporate') || msg.includes('office') || msg.includes('boss') || msg.includes('employee') || msg.includes('colleague')) targetOccasion = 'corporate gifts';
    else if (msg.includes('spiritual') || msg.includes('temple') || msg.includes('pooja') || msg.includes('puja') || msg.includes('god') || msg.includes('divine') || msg.includes('religious')) targetOccasion = 'spiritual gifts';
  }

  // Normalize occasion name mapping
  const occasionCategoryMap = {
    'birthday': 'Birthday Gifts',
    'birthday gifts': 'Birthday Gifts',
    'wedding': 'Wedding Gifts',
    'wedding gifts': 'Wedding Gifts',
    'anniversary': 'Anniversary Gifts',
    'anniversary gifts': 'Anniversary Gifts',
    'baby shower': 'Baby Shower',
    'housewarming': 'Housewarming',
    'festivals': 'Festivals',
    'festival': 'Festivals',
    'corporate': 'Corporate Gifts',
    'corporate gifts': 'Corporate Gifts',
    'spiritual': 'Spiritual Gifts',
    'spiritual gifts': 'Spiritual Gifts',
  };
  const targetCategory = occasionCategoryMap[targetOccasion] || null;

  // 3. Filter candidates
  let candidates = [...products];

  if (targetCategory) {
    const categoryFiltered = candidates.filter(p =>
      p.category.toLowerCase() === targetCategory.toLowerCase()
    );
    if (categoryFiltered.length > 0) candidates = categoryFiltered;
  }

  // Filter by budget
  const budgetFiltered = candidates.filter(p => p.price <= budgetLimit);
  if (budgetFiltered.length > 0) candidates = budgetFiltered;

  // 4. Score each candidate for relevance
  const scoredCandidates = candidates.map(p => {
    let score = p.rating || 0; // base score from rating
    const desc = p.description.toLowerCase();
    const name = p.name.toLowerCase();

    // Best seller bonus
    if (p.isBestSeller) score += 2;

    // Gender scoring
    if (context.gender) {
      const g = context.gender.toLowerCase();
      if (g === 'female' || g === 'woman' || g === 'girl' || g === 'her') {
        if (['perfume', 'handbag', 'jewellery', 'spa', 'bracelet', 'flower', 'cushion'].some(kw => desc.includes(kw) || name.includes(kw))) {
          score += 4;
        }
      } else if (g === 'male' || g === 'man' || g === 'boy' || g === 'him') {
        if (['gaming', 'watch', 'wallet', 'laptop', 'power bank', 'mouse', 'tech', 'earbuds'].some(kw => desc.includes(kw) || name.includes(kw))) {
          score += 4;
        }
      }
    }

    // Age scoring
    if (context.age) {
      const age = parseInt(context.age);
      if (age <= 12) {
        if (['toy', 'teddy', 'rattle', 'cradle', 'pillow', 'blanket'].some(kw => name.includes(kw) || desc.includes(kw))) score += 3;
      } else if (age >= 13 && age <= 25) {
        if (['gaming', 'earbuds', 'perfume', 'watch', 'fashion'].some(kw => name.includes(kw) || desc.includes(kw))) score += 3;
      } else if (age >= 60) {
        if (['spiritual', 'pooja', 'diya', 'lamp', 'wooden frame', 'ganesha', 'idol'].some(kw => name.includes(kw) || desc.includes(kw))) score += 3;
      }
    }

    // Relationship scoring
    if (context.relationship) {
      const rel = context.relationship.toLowerCase();
      if ((rel.includes('mother') || rel.includes('mom')) && ['saree', 'jewellery', 'cushion', 'spiritual', 'pooja', 'hamper'].some(kw => name.includes(kw) || desc.includes(kw))) score += 4;
      if ((rel.includes('father') || rel.includes('dad')) && ['pen set', 'diary', 'watch', 'power bank', 'wallet'].some(kw => name.includes(kw) || desc.includes(kw))) score += 4;
      if ((rel.includes('partner') || rel.includes('wife') || rel.includes('husband') || rel.includes('boyfriend') || rel.includes('girlfriend')) &&
        ['couple', 'romantic', 'perfume', 'jewelry', 'bracelet', 'watch'].some(kw => name.includes(kw) || desc.includes(kw))) score += 4;
      if (rel.includes('boss') || rel.includes('colleague')) {
        if (['diary', 'pen', 'organizer', 'laptop bag', 'clock'].some(kw => name.includes(kw) || desc.includes(kw))) score += 4;
      }
    }

    // Interests scoring
    if (context.interests) {
      context.interests.toLowerCase().split(',').forEach(tag => {
        const t = tag.trim();
        if (t && (desc.includes(t) || name.includes(t))) score += 3;
      });
    }

    // Message keyword scoring
    msg.split(' ').forEach(word => {
      if (word.length > 3 && (desc.includes(word) || name.includes(word))) {
        score += 1;
      }
    });

    // Add slight randomization to prevent identical results
    score += Math.random() * 0.5;

    return { product: p, score };
  });

  // Sort by score descending
  scoredCandidates.sort((a, b) => b.score - a.score);

  // Take top 8 scored products then randomly pick 4-6 from them for variety
  const top8 = scoredCandidates.slice(0, 8);
  const shuffledTop = shuffleArray(top8);
  const pickCount = Math.min(4 + Math.floor(Math.random() * 3), shuffledTop.length); // 4, 5, or 6
  let topMatches = shuffledTop.slice(0, pickCount).map(c => c.product);

  // If still empty, return top rated products
  if (topMatches.length === 0) {
    topMatches = shuffleArray(products).slice(0, 4);
  }

  // Build conversational response
  const openings = [
    "🎁 Great news! I found some amazing picks for you from SyncGifts:",
    "✨ I've scanned our entire collection and handpicked these premium options just for you:",
    "🌟 Here are my top personalized picks from SyncGifts based on your request:",
    "💫 After searching our curated collection, these stand out as the best matches for you:",
  ];
  const randomOpening = openings[Math.floor(Math.random() * openings.length)];

  let reply = `${randomOpening}\n\n`;

  topMatches.forEach((p, index) => {
    reply += `${index + 1}. **${p.name}** (₹${p.price.toLocaleString('en-IN')})\n`;
    reply += `   ⭐ Rating: ${p.rating}/5  ${p.isBestSeller ? '🔥 Best Seller' : ''} ${p.isPersonalized ? '✏️ Personalizable' : ''}\n`;
    reply += `   ${p.description}\n\n`;
  });

  reply += `\n💬 Would you like me to filter by different criteria, or shall I add any of these to your cart? Just say "add [product name] to cart"!`;

  return {
    reply,
    recommendedProductIds: topMatches.map(p => p.id),
    isFallback: true
  };
}

module.exports = router;
