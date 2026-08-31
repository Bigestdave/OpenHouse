export interface SpatialValidationResult {
  passed: boolean
  totalSpacesDetected: number
  expectedSpaces: number
  missingConnections: {
    fromRoom: string
    toRoom: string
    reason: string
    recommendedCaptureTimeSeconds: number
  }[]
  lowConfidenceFields: string[]
  confidenceScore: number
  model: 'gemini-3.7-flash' | 'deterministic-demo'
  demoMode: boolean
}

interface GeminiAssistantResult {
  answer: string
  badge: string
}

interface GeminiApiResponse<T> {
  ok: boolean
  data?: T
}

async function callGeminiApi<T>(body: Record<string, unknown>): Promise<T | null> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) return null
    const payload = (await response.json()) as GeminiApiResponse<T>
    return payload.ok && payload.data ? payload.data : null
  } catch {
    return null
  }
}

function deterministicSpatialFallback(propertyTitle: string, spacesList: string[]): SpatialValidationResult {
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

export async function validatePropertySpatialContinuity(
  propertyTitle: string,
  spacesList: string[]
): Promise<SpatialValidationResult> {
  const remote = await callGeminiApi<SpatialValidationResult>({
    action: 'spatial_validation',
    propertyTitle,
    spacesList,
  })

  if (remote && typeof remote.passed === 'boolean' && Array.isArray(remote.missingConnections)) {
    return {
      ...remote,
      model: remote.model === 'gemini-3.7-flash' ? 'gemini-3.7-flash' : 'deterministic-demo',
      demoMode: Boolean(remote.demoMode),
    }
  }

  return deterministicSpatialFallback(propertyTitle, spacesList)
}

export async function askOpenHouseAssistant(
  question: string,
  propertyContext: { title: string; location: string; rooms: string[] }
): Promise<GeminiAssistantResult> {
  const remote = await callGeminiApi<GeminiAssistantResult>({
    action: 'assistant_qa',
    question,
    propertyContext,
  })

  if (remote?.answer) {
    return remote
  }

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
