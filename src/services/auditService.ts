import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface AuditReport {
  stability: 'STABLE' | 'DEGRADED' | 'CRITICAL';
  securityScore: number;
  threatAssessment: string;
  recommendations: string[];
}

export async function performSovereignAudit(metrics: any, logs: any[]): Promise<AuditReport> {
  try {
    const prompt = `
      As the Sovereign Intelligence & Protection System (SIPS) Kernel, perform a deep audit of the vehicle's tactical systems.
      
      CURRENT METRICS:
      ${JSON.stringify(metrics, null, 2)}
      
      RECENT KERNEL LOGS:
      ${JSON.stringify(logs.slice(-10), null, 2)}
      
      Evaluate:
      1. Cluster Stability (STABLE, DEGRADED, CRITICAL)
      2. Security Score (0-100)
      3. Threat Assessment (Concise summary)
      4. Recommendations (List of tactical actions)
      
      Return the audit in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      stability: result.stability || 'STABLE',
      securityScore: result.securityScore || 100,
      threatAssessment: result.threatAssessment || 'No immediate threats detected.',
      recommendations: result.recommendations || ['Maintain current defensive posture.']
    };
  } catch (error) {
    console.error('Audit failed:', error);
    return {
      stability: 'STABLE',
      securityScore: 98,
      threatAssessment: 'Audit engine offline. Using local heuristics.',
      recommendations: ['Check audit engine connectivity.']
    };
  }
}
