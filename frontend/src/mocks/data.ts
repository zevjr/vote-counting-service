import type {
  BoletimUrna,
  VoteRecord,
  SectionCoverage,
  DashboardStats,
  OfficeResult,
} from '../types';

// ─── Boletins de Urna ────────────────────────────────────────────────────────

export const mockBoletins: BoletimUrna[] = [
  {
    id: 'bu-001',
    municipality: 'Florianópolis',
    zone: 107,
    section: 6,
    uploadDate: '2026-10-05T08:12:00Z',
    status: 'processed',
    fileName: 'PAULO LOPES - SC - 00107 - 00006.pdf',
    fileHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    uploadedBy: 'user-001',
    uploadedByName: 'Carlos Inspetor',
  },
  {
    id: 'bu-002',
    municipality: 'Florianópolis',
    zone: 107,
    section: 12,
    uploadDate: '2026-10-05T08:25:00Z',
    status: 'processed',
    fileName: 'BU_107_012.pdf',
    fileHash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    uploadedBy: 'user-003',
    uploadedByName: 'João Inspetor',
  },
  {
    id: 'bu-003',
    municipality: 'Florianópolis',
    zone: 107,
    section: 18,
    uploadDate: '2026-10-05T08:40:00Z',
    status: 'processed',
    fileName: 'BU_107_018.pdf',
    fileHash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    uploadedBy: 'user-001',
    uploadedByName: 'Carlos Inspetor',
  },
  {
    id: 'bu-004',
    municipality: 'Florianópolis',
    zone: 108,
    section: 1,
    uploadDate: '2026-10-05T09:00:00Z',
    status: 'processed',
    fileName: 'BU_108_001.pdf',
    fileHash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
    uploadedBy: 'user-003',
    uploadedByName: 'João Inspetor',
  },
  {
    id: 'bu-005',
    municipality: 'Florianópolis',
    zone: 108,
    section: 7,
    uploadDate: '2026-10-05T09:15:00Z',
    status: 'processing',
    fileName: 'BU_108_007.pdf',
    uploadedBy: 'user-001',
    uploadedByName: 'Carlos Inspetor',
  },
  {
    id: 'bu-006',
    municipality: 'Florianópolis',
    zone: 108,
    section: 14,
    uploadDate: '2026-10-05T09:30:00Z',
    status: 'pending',
    fileName: 'BU_108_014.pdf',
    uploadedBy: 'user-001',
    uploadedByName: 'Carlos Inspetor',
  },
  {
    id: 'bu-007',
    municipality: 'Florianópolis',
    zone: 109,
    section: 3,
    uploadDate: '2026-10-05T09:45:00Z',
    status: 'failed',
    fileName: 'BU_109_003.pdf',
    errorMessage: 'Falha ao extrair texto do PDF. Formato inválido.',
    uploadedBy: 'user-003',
    uploadedByName: 'João Inspetor',
  },
  {
    id: 'bu-008',
    municipality: 'Florianópolis',
    zone: 109,
    section: 9,
    uploadDate: '2026-10-05T10:00:00Z',
    status: 'processed',
    fileName: 'BU_109_009.pdf',
    fileHash: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    uploadedBy: 'user-001',
    uploadedByName: 'Carlos Inspetor',
  },
  {
    id: 'bu-009',
    municipality: 'Florianópolis',
    zone: 109,
    section: 15,
    uploadDate: '2026-10-05T10:20:00Z',
    status: 'processed',
    fileName: 'BU_109_015.pdf',
    fileHash: 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1',
    uploadedBy: 'user-003',
    uploadedByName: 'João Inspetor',
  },
  {
    id: 'bu-010',
    municipality: 'Florianópolis',
    zone: 110,
    section: 2,
    uploadDate: '2026-10-05T10:35:00Z',
    status: 'pending',
    fileName: 'BU_110_002.pdf',
    uploadedBy: 'user-001',
    uploadedByName: 'Carlos Inspetor',
  },
  {
    id: 'bu-011',
    municipality: 'Florianópolis',
    zone: 110,
    section: 8,
    uploadDate: '2026-10-05T10:50:00Z',
    status: 'processed',
    fileName: 'BU_110_008.pdf',
    fileHash: 'a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3',
    uploadedBy: 'user-003',
    uploadedByName: 'João Inspetor',
  },
  {
    id: 'bu-012',
    municipality: 'Florianópolis',
    zone: 110,
    section: 20,
    uploadDate: '2026-10-05T11:05:00Z',
    status: 'failed',
    fileName: 'BU_110_020.pdf',
    errorMessage: 'Arquivo corrompido. Não foi possível processar.',
    uploadedBy: 'user-001',
    uploadedByName: 'Carlos Inspetor',
  },
];

// ─── Registros de Votos ───────────────────────────────────────────────────────

export const mockVoteRecords: VoteRecord[] = [
  // Presidente
  { boletimUrnaId: 'bu-001', office: 'Presidente', candidateNumber: '13', candidateName: 'Lula', party: 'PT', voteCount: 145 },
  { boletimUrnaId: 'bu-001', office: 'Presidente', candidateNumber: '22', candidateName: 'Bolsonaro', party: 'PL', voteCount: 132 },
  { boletimUrnaId: 'bu-001', office: 'Presidente', candidateNumber: '12', candidateName: 'Ciro Gomes', party: 'PDT', voteCount: 18 },
  { boletimUrnaId: 'bu-002', office: 'Presidente', candidateNumber: '13', candidateName: 'Lula', party: 'PT', voteCount: 138 },
  { boletimUrnaId: 'bu-002', office: 'Presidente', candidateNumber: '22', candidateName: 'Bolsonaro', party: 'PL', voteCount: 141 },
  { boletimUrnaId: 'bu-002', office: 'Presidente', candidateNumber: '12', candidateName: 'Ciro Gomes', party: 'PDT', voteCount: 12 },
  { boletimUrnaId: 'bu-003', office: 'Presidente', candidateNumber: '13', candidateName: 'Lula', party: 'PT', voteCount: 155 },
  { boletimUrnaId: 'bu-003', office: 'Presidente', candidateNumber: '22', candidateName: 'Bolsonaro', party: 'PL', voteCount: 128 },
  { boletimUrnaId: 'bu-003', office: 'Presidente', candidateNumber: '12', candidateName: 'Ciro Gomes', party: 'PDT', voteCount: 22 },
  { boletimUrnaId: 'bu-004', office: 'Presidente', candidateNumber: '13', candidateName: 'Lula', party: 'PT', voteCount: 162 },
  { boletimUrnaId: 'bu-004', office: 'Presidente', candidateNumber: '22', candidateName: 'Bolsonaro', party: 'PL', voteCount: 119 },
  { boletimUrnaId: 'bu-004', office: 'Presidente', candidateNumber: '12', candidateName: 'Ciro Gomes', party: 'PDT', voteCount: 15 },
  { boletimUrnaId: 'bu-008', office: 'Presidente', candidateNumber: '13', candidateName: 'Lula', party: 'PT', voteCount: 148 },
  { boletimUrnaId: 'bu-008', office: 'Presidente', candidateNumber: '22', candidateName: 'Bolsonaro', party: 'PL', voteCount: 135 },
  { boletimUrnaId: 'bu-008', office: 'Presidente', candidateNumber: '12', candidateName: 'Ciro Gomes', party: 'PDT', voteCount: 20 },
  { boletimUrnaId: 'bu-009', office: 'Presidente', candidateNumber: '13', candidateName: 'Lula', party: 'PT', voteCount: 170 },
  { boletimUrnaId: 'bu-009', office: 'Presidente', candidateNumber: '22', candidateName: 'Bolsonaro', party: 'PL', voteCount: 110 },
  { boletimUrnaId: 'bu-009', office: 'Presidente', candidateNumber: '12', candidateName: 'Ciro Gomes', party: 'PDT', voteCount: 25 },
  { boletimUrnaId: 'bu-011', office: 'Presidente', candidateNumber: '13', candidateName: 'Lula', party: 'PT', voteCount: 143 },
  { boletimUrnaId: 'bu-011', office: 'Presidente', candidateNumber: '22', candidateName: 'Bolsonaro', party: 'PL', voteCount: 137 },
  { boletimUrnaId: 'bu-011', office: 'Presidente', candidateNumber: '12', candidateName: 'Ciro Gomes', party: 'PDT', voteCount: 16 },

  // Governador
  { boletimUrnaId: 'bu-001', office: 'Governador', candidateNumber: '45', candidateName: 'Jorginho Mello', party: 'PL', voteCount: 160 },
  { boletimUrnaId: 'bu-001', office: 'Governador', candidateNumber: '40', candidateName: 'Décio Lima', party: 'PT', voteCount: 120 },
  { boletimUrnaId: 'bu-002', office: 'Governador', candidateNumber: '45', candidateName: 'Jorginho Mello', party: 'PL', voteCount: 155 },
  { boletimUrnaId: 'bu-002', office: 'Governador', candidateNumber: '40', candidateName: 'Décio Lima', party: 'PT', voteCount: 130 },
  { boletimUrnaId: 'bu-003', office: 'Governador', candidateNumber: '45', candidateName: 'Jorginho Mello', party: 'PL', voteCount: 148 },
  { boletimUrnaId: 'bu-003', office: 'Governador', candidateNumber: '40', candidateName: 'Décio Lima', party: 'PT', voteCount: 145 },
  { boletimUrnaId: 'bu-004', office: 'Governador', candidateNumber: '45', candidateName: 'Jorginho Mello', party: 'PL', voteCount: 142 },
  { boletimUrnaId: 'bu-004', office: 'Governador', candidateNumber: '40', candidateName: 'Décio Lima', party: 'PT', voteCount: 148 },
  { boletimUrnaId: 'bu-008', office: 'Governador', candidateNumber: '45', candidateName: 'Jorginho Mello', party: 'PL', voteCount: 158 },
  { boletimUrnaId: 'bu-008', office: 'Governador', candidateNumber: '40', candidateName: 'Décio Lima', party: 'PT', voteCount: 125 },
  { boletimUrnaId: 'bu-009', office: 'Governador', candidateNumber: '45', candidateName: 'Jorginho Mello', party: 'PL', voteCount: 140 },
  { boletimUrnaId: 'bu-009', office: 'Governador', candidateNumber: '40', candidateName: 'Décio Lima', party: 'PT', voteCount: 160 },
  { boletimUrnaId: 'bu-011', office: 'Governador', candidateNumber: '45', candidateName: 'Jorginho Mello', party: 'PL', voteCount: 152 },
  { boletimUrnaId: 'bu-011', office: 'Governador', candidateNumber: '40', candidateName: 'Décio Lima', party: 'PT', voteCount: 138 },

  // Senador
  { boletimUrnaId: 'bu-001', office: 'Senador', candidateNumber: '180', candidateName: 'Dário Berger', party: 'MDB', voteCount: 140 },
  { boletimUrnaId: 'bu-001', office: 'Senador', candidateNumber: '456', candidateName: 'Esperidião Amin', party: 'PP', voteCount: 130 },
  { boletimUrnaId: 'bu-002', office: 'Senador', candidateNumber: '180', candidateName: 'Dário Berger', party: 'MDB', voteCount: 135 },
  { boletimUrnaId: 'bu-002', office: 'Senador', candidateNumber: '456', candidateName: 'Esperidião Amin', party: 'PP', voteCount: 145 },
  { boletimUrnaId: 'bu-003', office: 'Senador', candidateNumber: '180', candidateName: 'Dário Berger', party: 'MDB', voteCount: 150 },
  { boletimUrnaId: 'bu-003', office: 'Senador', candidateNumber: '456', candidateName: 'Esperidião Amin', party: 'PP', voteCount: 128 },
  { boletimUrnaId: 'bu-004', office: 'Senador', candidateNumber: '180', candidateName: 'Dário Berger', party: 'MDB', voteCount: 145 },
  { boletimUrnaId: 'bu-004', office: 'Senador', candidateNumber: '456', candidateName: 'Esperidião Amin', party: 'PP', voteCount: 132 },
  { boletimUrnaId: 'bu-008', office: 'Senador', candidateNumber: '180', candidateName: 'Dário Berger', party: 'MDB', voteCount: 138 },
  { boletimUrnaId: 'bu-008', office: 'Senador', candidateNumber: '456', candidateName: 'Esperidião Amin', party: 'PP', voteCount: 142 },
  { boletimUrnaId: 'bu-009', office: 'Senador', candidateNumber: '180', candidateName: 'Dário Berger', party: 'MDB', voteCount: 155 },
  { boletimUrnaId: 'bu-009', office: 'Senador', candidateNumber: '456', candidateName: 'Esperidião Amin', party: 'PP', voteCount: 125 },
  { boletimUrnaId: 'bu-011', office: 'Senador', candidateNumber: '180', candidateName: 'Dário Berger', party: 'MDB', voteCount: 142 },
  { boletimUrnaId: 'bu-011', office: 'Senador', candidateNumber: '456', candidateName: 'Esperidião Amin', party: 'PP', voteCount: 138 },
];

// ─── Cobertura de Seções ──────────────────────────────────────────────────────

export const mockSectionCoverage: SectionCoverage = {
  municipality: 'Florianópolis',
  totalSections: 500,
  processedSections: 8,
  pendingSections: 3,
  failedSections: 2,
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalSectionsExpected: 500,
  totalSectionsProcessed: 8,
  totalSectionsPending: 3,
  totalSectionsFailed: 2,
  totalVotesCounted: 4872,
  lastUpdated: '2026-10-05T11:05:00Z',
};

// ─── Resultados Agregados por Cargo ──────────────────────────────────────────

export function getAggregatedResults(): OfficeResult[] {
  const officeMap = new Map<string, Map<string, { name: string; party: string; votes: number }>>();

  for (const record of mockVoteRecords) {
    if (!officeMap.has(record.office)) {
      officeMap.set(record.office, new Map());
    }
    const candidateMap = officeMap.get(record.office)!;
    if (!candidateMap.has(record.candidateNumber)) {
      candidateMap.set(record.candidateNumber, {
        name: record.candidateName,
        party: record.party,
        votes: 0,
      });
    }
    candidateMap.get(record.candidateNumber)!.votes += record.voteCount;
  }

  const results: OfficeResult[] = [];
  for (const [office, candidateMap] of officeMap.entries()) {
    const candidates = Array.from(candidateMap.entries())
      .map(([number, data]) => ({
        number,
        name: data.name,
        party: data.party,
        votes: data.votes,
      }))
      .sort((a, b) => b.votes - a.votes);
    results.push({ office, candidates });
  }

  return results;
}

// ─── Timeline de uploads ──────────────────────────────────────────────────────

export interface TimelineEntry {
  hour: string;
  count: number;
}

export const mockUploadTimeline: TimelineEntry[] = [
  { hour: '08:00', count: 3 },
  { hour: '09:00', count: 4 },
  { hour: '10:00', count: 3 },
  { hour: '11:00', count: 2 },
  { hour: '12:00', count: 0 },
  { hour: '13:00', count: 0 },
];
