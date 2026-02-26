export interface AnalysisResult {
  acceptanceProbability: number;
  overallVerdict: string;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: {
    section: string;
    suggestion: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  journalFit: {
    journalName: string;
    reasoning: string;
    fitScore: number;
  }[];
  technicalChecklist: {
    item: string;
    passed: boolean;
    comment: string;
  }[];
}

export interface PaperMetadata {
  title: string;
  authors: string[];
  abstract: string;
}
