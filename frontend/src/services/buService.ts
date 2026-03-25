import type { BoletimUrna, DashboardStats, OfficeResult, SectionCoverage, UploadedFile, User } from '../types';
import {
  getAggregatedResults,
  mockBoletins,
  mockDashboardStats,
  mockSectionCoverage,
  mockUploadTimeline,
} from '../mocks/data';
import type { TimelineEntry } from '../mocks/data';

// Simula delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const buService = {
  async getBoletins(): Promise<BoletimUrna[]> {
    await delay(300);
    return [...mockBoletins];
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await delay(200);
    return { ...mockDashboardStats };
  },

  async getSectionCoverage(): Promise<SectionCoverage> {
    await delay(200);
    return { ...mockSectionCoverage };
  },

  async getAggregatedResults(): Promise<OfficeResult[]> {
    await delay(400);
    return getAggregatedResults();
  },

  async getUploadTimeline(): Promise<TimelineEntry[]> {
    await delay(200);
    return [...mockUploadTimeline];
  },

  async uploadFile(file: File, user: User): Promise<UploadedFile> {
    await delay(1500);

    // Simula falha ocasional (10% de chance)
    if (Math.random() < 0.1) {
      const uploaded: UploadedFile = {
        id: `upload-${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        status: 'failed',
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.id,
        uploadedByName: user.name,
        errorMessage: 'Falha simulada ao processar o arquivo.',
      };
      return uploaded;
    }

    const uploaded: UploadedFile = {
      id: `upload-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.id,
      uploadedByName: user.name,
    };

    return uploaded;
  },
};
