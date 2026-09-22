export interface DiagnosticKey {
  page: number;
  symptom_category: string | null;
  text_preview: string;
  images: string[];
}

export interface DatabaseSchema {
  metadata: {
    source: string;
    total_pages: number;
  };
  diagnostic_keys: DiagnosticKey[];
}

export interface AIDiagnosisResult {
  matchedCategory: string | null;
  confidence: "High" | "Medium" | "Low";
  analysis: string;
  pageRecommendations: number[];
  organicManagement: string[];
  bioticOrAbiotic?: {
    conclusion: "Biotic" | "Abiotic";
    rationale: string;
  };
  signsDetected?: string[];
  symptomsDetected?: string[];
  big5Assessment?: {
    economic: string;
    effective: string;
    safe: string;
    practical: string;
    locallyAvailable: string;
  };
  errorInfo?: string;
}

export interface QuizQuestion {
  imageUrl: string;
  correctCategory: string;
  options: string[];
  page: number;
  text_preview: string;
}

export interface HistoryScan {
  id: string;
  timestamp: string;
  symptomDescription: string;
  image: string | null;
  result: AIDiagnosisResult;
}
