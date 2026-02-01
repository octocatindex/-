
export interface AnalysisResult {
  markdownReport: string;
}

export interface Interaction {
  id: number;
  description: string;
  url: string;
  method: string;
  params: string;
  confidence: 'High' | 'Medium' | 'Low';
  code: string;
}
