import { GoogleGenAI } from '@google/genai'

type Req = {
  method?: string
  body?: any
}

type Res = {
  status: (code: number) => Res
  json: (payload: any) => void
}

function parseModelJson(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()
  return JSON.parse(cleaned)
}

function deterministicSpatialFallback(propertyTitle: string, spacesList: string[]) {
  const hasOutdoor = spacesList.some((space) => /balcony|pool|outdoor|terrace/i.test(space))
  const hasLiving = spacesList.some((space) => /living/i.test(space))
  const isLikelyMissingConnection = hasOutdoor && hasLiving && /homestead|admiralty|laurel|orchid/i.test(propertyTitle)

  return {
    passed: !isLikelyMissingConnection,
    totalSpacesDetected: spacesList.length || 6,
    expectedSpaces: Math.max(spacesList.length, 6),
    missingConnections: isLikelyMissingConnection
      ? [{
          fromRoom: 'Living Room',
          toRoom: 'Balcony Terrace',
          reason: 'Outdoor transition continuity is unclear in submitted media.',
          recommendedCaptureTimeSeconds: 15,
        }]
      : [],
    lowConfidenceFields: isLikelyMissingConnection ? ['balcony_transition'] : [],
    confidenceScore: isLikelyMissingConnection ? 0.69 : 0.96,
    model: 'deterministic-demo',
    demoMode: true,
  }
}

function deterministicAssistantFallback(question: string) {
  const lower = question.toLowerCase()
  if (lower.includes('light') || lower.includes('sun')) {
    return {
      answer: 'The living room and balcony receive the strongest natural light based on the captured daytime media.',
      badge: 'Deterministic demo fallback',
    }
  }
  if (lower.includes('parking') || lower.includes('car') || lower.includes('garage')) {
    return {
      answer: 'Listing metadata indicates two reserved parking spots and additional visitor parking.',
      badge: 'Deterministic demo fallback',
    }
  }
  if (lower.includes('balcony') || lower.includes('view') || lower.includes('outdoor')) {
    return {
      answer: 'The living room transitions directly to the balcony through sliding doors, with open skyline views.',
      badge: 'Deterministic demo fallback',
    }
  }
  return {
    answer: 'OpenHouse cross-checked captured media and listing context; ask about a room, connection, or feature for specifics.',
    badge: 'Deterministic demo fallback',
  }
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const action = typeof req.body?.action === 'string' ? req.body.action : ''
  const key = process.env.GEMINI_API_KEY

  if (!key) {
    if (action === 'spatial_validation') {
      const propertyTitle = String(req.body?.propertyTitle || '')
      const spacesList = Array.isArray(req.body?.spacesList) ? req.body.spacesList.map((v: unknown) => String(v)) : []
      res.status(200).json({ ok: true, data: deterministicSpatialFallback(propertyTitle, spacesList) })
      return
    }
    if (action === 'assistant_qa') {
      res.status(200).json({ ok: true, data: deterministicAssistantFallback(String(req.body?.question || '')) })
      return
    }
    res.status(400).json({ ok: false, error: 'Invalid action' })
    return
  }

  const ai = new GoogleGenAI({ apiKey: key })

  try {
    if (action === 'spatial_validation') {
      const propertyTitle = String(req.body?.propertyTitle || '').slice(0, 200)
      const spacesList = Array.isArray(req.body?.spacesList)
        ? req.body.spacesList.map((v: unknown) => String(v).slice(0, 80)).slice(0, 40)
        : []

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `You are OpenHouse spatial analysis.\nReturn ONLY valid JSON with keys:\npassed(boolean), totalSpacesDetected(number), expectedSpaces(number), missingConnections(array of {fromRoom,toRoom,reason,recommendedCaptureTimeSeconds}), lowConfidenceFields(array of strings), confidenceScore(number 0-1), model(string), demoMode(boolean).\nProperty: ${propertyTitle}\nSpaces: ${spacesList.join(', ')}`,
      })

      const text = String(response.text || '')
      const parsed = parseModelJson(text)
      parsed.model = 'gemini-3.7-flash'
      parsed.demoMode = false
      res.status(200).json({ ok: true, data: parsed })
      return
    }

    if (action === 'assistant_qa') {
      const question = String(req.body?.question || '').slice(0, 400)
      const propertyContext = req.body?.propertyContext || {}
      const title = String(propertyContext.title || '').slice(0, 120)
      const location = String(propertyContext.location || '').slice(0, 120)
      const rooms = Array.isArray(propertyContext.rooms)
        ? propertyContext.rooms.map((v: unknown) => String(v).slice(0, 60)).slice(0, 40)
        : []

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `You are OpenHouse assistant. Answer only from provided context.\nReturn ONLY valid JSON with keys: answer(string), badge(string).\nProperty: ${title}\nLocation: ${location}\nRooms: ${rooms.join(', ')}\nQuestion: ${question}`,
      })

      const text = String(response.text || '')
      const parsed = parseModelJson(text)
      res.status(200).json({ ok: true, data: parsed })
      return
    }

    res.status(400).json({ ok: false, error: 'Invalid action' })
  } catch {
    if (action === 'spatial_validation') {
      const propertyTitle = String(req.body?.propertyTitle || '')
      const spacesList = Array.isArray(req.body?.spacesList) ? req.body.spacesList.map((v: unknown) => String(v)) : []
      res.status(200).json({ ok: true, data: deterministicSpatialFallback(propertyTitle, spacesList) })
      return
    }
    if (action === 'assistant_qa') {
      res.status(200).json({ ok: true, data: deterministicAssistantFallback(String(req.body?.question || '')) })
      return
    }
    res.status(500).json({ ok: false, error: 'Gemini request failed' })
  }
}
