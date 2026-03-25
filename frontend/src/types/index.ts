export type ProcessingStatus = 'pending' | 'processing' | 'processed' | 'failed';

export type UserRole = 'inspector' | 'analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  municipality: string;
}

export interface Candidate {
  number: string;
  name: string;
  party: string;
  votes: number;
}

export interface OfficeResult {
  office: string;
  candidates: Candidate[];
}

export interface BoletimUrna {
  id: string;
  municipality: string;
  zone: number;
  section: number;
  uploadDate: string;
  status: ProcessingStatus;
  fileName: string;
  fileHash?: string;
  errorMessage?: string;
  uploadedBy?: string;
  uploadedByName?: string;
}

export interface VoteRecord {
  boletimUrnaId: string;
  office: string;
  candidateNumber: string;
  candidateName: string;
  party: string;
  voteCount: number;
}

export interface SectionCoverage {
  municipality: string;
  totalSections: number;
  processedSections: number;
  pendingSections: number;
  failedSections: number;
}

export interface DashboardStats {
  totalSectionsExpected: number;
  totalSectionsProcessed: number;
  totalSectionsPending: number;
  totalSectionsFailed: number;
  totalVotesCounted: number;
  lastUpdated: string;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  status: ProcessingStatus;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
  municipality?: string;
  zone?: number;
  section?: number;
  errorMessage?: string;
}
