import { useEffect, useMemo, useState } from 'react';
import { VoteBarChart } from '../components/VoteBarChart';
import { ProgressBar } from '../components/ProgressBar';
import { buService } from '../services/buService';
import type { OfficeResult, SectionCoverage } from '../types';

export function ResultadosPage() {
  const [results, setResults] = useState<OfficeResult[]>([]);
  const [coverage, setCoverage] = useState<SectionCoverage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<string>('');

  useEffect(() => {
    Promise.all([
      buService.getAggregatedResults(),
      buService.getSectionCoverage(),
    ]).then(([r, c]) => {
      setResults(r);
      setCoverage(c);
      if (r.length > 0) setSelectedOffice(r[0].office);
      setLoading(false);
    });
  }, []);

  const currentResult = useMemo(
    () => results.find((r) => r.office === selectedOffice),
    [results, selectedOffice]
  );

  const totalVotesForOffice = useMemo(
    () => currentResult?.candidates.reduce((sum, c) => sum + c.votes, 0) ?? 0,
    [currentResult]
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        Carregando resultados...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Resultados da Eleição</h2>
        <p>
          Apuração parcial — Município de Florianópolis — Eleições 2026
        </p>
      </div>

      <div className="alert warning mb-6">
        ⚠️ Estes resultados são parciais e baseados em dados simulados. Não representam resultados oficiais.
      </div>

      {/* Cobertura */}
      {coverage && (
        <div className="card mb-6">
          <div className="card-title">📍 Cobertura de Seções — {coverage.municipality}</div>
          <ProgressBar
            label="Seções apuradas"
            value={coverage.processedSections}
            total={coverage.totalSections}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
              marginTop: 16,
            }}
          >
            <div style={{ textAlign: 'center', padding: '12px', background: 'var(--color-success-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-success)' }}>
                {coverage.processedSections}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-success)' }}>Processadas</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: 'var(--color-warning-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-warning)' }}>
                {coverage.pendingSections}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-warning)' }}>Pendentes</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: 'var(--color-danger-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-danger)' }}>
                {coverage.failedSections}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-danger)' }}>Com Falha</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: 'var(--color-gray-100)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-gray-700)' }}>
                {coverage.totalSections}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>Total Esperado</div>
            </div>
          </div>
        </div>
      )}

      {/* Seletor de cargo */}
      <div className="card mb-6">
        <div className="card-title">🗳️ Resultados por Cargo</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {results.map((r) => (
            <button
              key={r.office}
              className={`btn ${selectedOffice === r.office ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedOffice(r.office)}
            >
              {r.office}
            </button>
          ))}
        </div>

        {currentResult && (
          <div>
            <div className="flex-between mb-4">
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-gray-800)' }}>
                {currentResult.office}
              </span>
              <span className="text-sm text-muted">
                Total de votos apurados: {totalVotesForOffice.toLocaleString('pt-BR')}
              </span>
            </div>
            <VoteBarChart candidates={currentResult.candidates} maxBars={10} />
          </div>
        )}
      </div>

      {/* Tabela detalhada */}
      {currentResult && (
        <div className="card">
          <div className="card-title">📊 Tabela Detalhada — {currentResult.office}</div>
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Número</th>
                  <th>Candidato</th>
                  <th>Partido</th>
                  <th>Votos</th>
                  <th>% dos Votos</th>
                </tr>
              </thead>
              <tbody>
                {currentResult.candidates.map((candidate, idx) => {
                  const pct = totalVotesForOffice > 0
                    ? ((candidate.votes / totalVotesForOffice) * 100).toFixed(2)
                    : '0.00';
                  const isLeading = idx === 0;

                  return (
                    <tr key={candidate.number}>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: isLeading ? 'var(--color-primary)' : 'var(--color-gray-200)',
                            color: isLeading ? '#fff' : 'var(--color-gray-600)',
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {candidate.number}
                      </td>
                      <td style={{ fontWeight: isLeading ? 700 : 400 }}>
                        {candidate.name}
                        {isLeading && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 11,
                              background: 'var(--color-primary)',
                              color: '#fff',
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            Liderando
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            background: 'var(--color-gray-100)',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {candidate.party}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {candidate.votes.toLocaleString('pt-BR')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div
                            style={{
                              width: 60,
                              height: 8,
                              background: 'var(--color-gray-200)',
                              borderRadius: 4,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                background: isLeading ? 'var(--color-primary)' : 'var(--color-gray-400)',
                                borderRadius: 4,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Placeholder mapa */}
      <div className="card mt-4">
        <div className="card-title">🗺️ Mapa de Cobertura por Seção</div>
        <div
          style={{
            height: 200,
            background: 'var(--color-gray-100)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 8,
            color: 'var(--color-gray-500)',
          }}
        >
          <span style={{ fontSize: 48 }}>🗺️</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Mapa de cobertura — disponível em versão futura
          </span>
          <span className="text-sm">
            Visualização geográfica das seções apuradas será implementada no backend
          </span>
        </div>
      </div>
    </div>
  );
}
