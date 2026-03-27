export interface AnalysisResponse {
  ai_detection: {
    result: 'Real' | 'Fake';
    confidence: number;
  };
  matches: {
    image: string;
    difference: number;
    status: string;
  }[];
  final_status: 'Verified' | 'Modified' | 'Fake' | 'Unverified';
}

interface BackendMatch {
  image?: string;
  difference?: number;
  status?: string;
}

interface BackendAnalysisResponse {
  ai_detection?: {
    result?: string;
    confidence?: number;
  };
  matches?: BackendMatch[];
  final_status?: string;
}

const DEFAULT_BACKEND_URL = 'http://127.0.0.1:8000';

function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BACKEND_URL).replace(/\/$/, '');
}

function normalizeStatus(status?: string): AnalysisResponse['final_status'] {
  if (!status) return 'Unverified';

  const normalized = status.toLowerCase();

  if (normalized.includes('verified')) return 'Verified';
  if (normalized.includes('modified')) return 'Modified';
  if (normalized.includes('fake') || normalized.includes('manip')) return 'Fake';

  return 'Unverified';
}

function normalizeResult(result?: string): AnalysisResponse['ai_detection']['result'] {
  return result === 'Fake' ? 'Fake' : 'Real';
}

function normalizeMatches(matches?: BackendMatch[]): AnalysisResponse['matches'] {
  if (!matches?.length) return [];

  return matches.map((match, index) => ({
    image: match.image || `match-${index + 1}`,
    difference: typeof match.difference === 'number' ? match.difference : 0,
    status: match.status || 'Unknown',
  }));
}

function normalizeAnalysisResponse(payload: BackendAnalysisResponse): AnalysisResponse {
  return {
    ai_detection: {
      result: normalizeResult(payload.ai_detection?.result),
      confidence: typeof payload.ai_detection?.confidence === 'number' ? payload.ai_detection.confidence : 0,
    },
    matches: normalizeMatches(payload.matches),
    final_status: normalizeStatus(payload.final_status),
  };
}

export async function analyzeImage(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const backendBaseUrl = getBackendBaseUrl();

  try {
    const response = await fetch(`${backendBaseUrl}/upload/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as BackendAnalysisResponse;
    return normalizeAnalysisResponse(payload);
  } catch (error) {
    console.warn('Backend API connection failed. Using mock data for demo purposes.', error);

    return new Promise((resolve) => {
      setTimeout(() => {
        const isFake = Math.random() > 0.5;
        resolve({
          ai_detection: {
            result: isFake ? 'Fake' : 'Real',
            confidence: 0.85 + Math.random() * 0.14,
          },
          matches: [
            {
              image: 'demo-reference.jpg',
              difference: isFake ? 7 : 2,
              status: isFake ? '🟡 Slightly Modified' : '🟢 Very Similar',
            },
          ],
          final_status: isFake ? 'Fake' : 'Verified',
        });
      }, 2000);
    });
  }
}
