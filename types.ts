
export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string; 
  date: string;
  read: boolean;
  tags: string[];
}

/**
 * Result structure for the email analysis performed by Gemini AI
 */
export interface GeminiSummary {
  summary: string;
  actionItems: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Urgent';
}

export enum DataSource {
  SIMULATION = 'SIMULATION',
  GMAIL_API = 'GMAIL_API'
}

export interface UserSettings {
  dataSource: DataSource;
  googleClientId: string;
  gmailAccessToken: string;
  customDomains: string[];
  activeDomain: string;
  refreshInterval: number;
}
