export type House = 'atreides' | 'harkonnen' | 'fremen';

export interface OracleRequest {
  dilemma: string;
  house: House;
  gomJabbar: boolean;
}

export interface OracleResponse {
  prophecy: string;
  successScore: number;
  riskScore: number;
  spiceScore: number;
  verdict: string;
  consultationId: string;
}

export interface Consultation {
  id: string;
  user_id: string;
  house: House;
  dilemma: string;
  prophecy: string;
  success_score: number;
  risk_score: number;
  spice_score: number;
  verdict: string;
  gom_jabbar: boolean;
  created_at: string;
}
