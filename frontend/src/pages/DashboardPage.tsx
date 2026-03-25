import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar';
import { VoteBarChart } from '../components/VoteBarChart';
import { buService } from '../services/buService';
import type { DashboardStats, OfficeResult } from '../types';
import type { TimelineEntry } from '../mocks/data';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [results, setResults] = useState<OfficeResult[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      buService.getDashboardStats(),
      buService.getAggregatedResults(),
      buService.getUploadTimeline(),
    ]).then(([s, r, t]) => {
      setStats(s);
      setResults(r);
      setTimeline(t);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        Carregando dashboard...
      </div>
    );
  }

  if (!stats) return null;

  const coveragePct = stats.totalSectionsExpected > 0
    ? ((stats.totalSectionsProcessed / stats.totalSectionsExpected) * 100).toFixed(1)
    : '0.0';

  const maxTimeline = Math.max(...timeline.map((t) => t.count), 1);

  return (
    <div>
      <div className="page-header">
        <h2>Visão Geral da Apuração</h2>
        <p>
          Município de Florianópolis — Eleições 2026 —{' '}
          <span className="text-muted">
            Atualizado em{' '}
            {new Date(stats.lastUpdated).toLocaleString('pt-BR')}
          </span>
        </p>
      </div>

      {/* Alerta de protótipo */}
      <div className="alert info mb-6">
        ℹ️ Este é um protótipo com dados simulados. Nenhum dado real está sendo processado.
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-card-label">Seções Processadas</div>
          <div className="stat-card-value">{stats.totalSectionsProcessed}</div>
          <div className="stat-card-sub">de {stats.totalSectionsExpected.toLocaleString('pt-BR')} esperadas</div>
        </div>
        <div className="stat-card success">
          <div className="stat-card-label">Cobertura</div>
          <div className="stat-card-value">{coveragePct}%</div>
          <div className="stat-card-sub">das seções apuradas</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-card-label">Pendentes</div>
          <div className="stat-card-value">{stats.totalSectionsPending}</div>
          <div className="stat-card-sub">aguardando processamento</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-card-label">Com Falha</div>
          <div className="stat-card-value">{stats.totalSectionsFailed}</div>
          <div className="stat-card-sub">requerem atenção</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card mb-6">
        <ProgressBar
          label="Progresso da Apuração"
          value={stats.totalSectionsProcessed}
          total={stats.totalSectionsExpected}
        />
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          <span className="text-sm">
            <span style={{ color: '#057a55', fontWeight: 600 }}>●</span>{' '}
            Processadas: {stats.totalSectionsProcessed}
          </span>
          <span className="text-sm">
            <span style={{ color: '#c27803', fontWeight: 600 }}>●</span>{' '}
            Pendentes: {stats.totalSectionsPending}
          </span>
          <span className="text-sm">
            <span style={{ color: '#c81e1e', fontWeight: 600 }}>●</span>{' '}
            Falhas: {stats.totalSectionsFailed}
          </span>
        </div>
      </div>

      {/* Grid: Resultados + Timeline */}
      <div className="grid-2 mb-6">
        {/* Resultado Presidente */}
        {results.length > 0 && (
          <div className="card">
            <div className="flex-between mb-4">
              <span className="card-title" style={{ marginBottom: 0 }}>
                🗳️ {results[0].office}
              </span>
              <Link to="/resultados" className="text-sm" style={{ color: 'var(--color-primary)' }}>
                Ver todos →
              </Link>
            </div>
            <VoteBarChart candidates={results[0].candidates} maxBars={5} />
          </div>
        )}

        {/* Timeline */}
        <div className="card">
          <div className="card-title">📈 Uploads por Hora</div>
          <div className="timeline-chart">
            {timeline.map((entry) => (
              <div key={entry.hour} className="timeline-bar-col">
                <div
                  className="timeline-bar"
                  style={{
                    height: `${(entry.count / maxTimeline) * 60}px`,
                  }}
                  title={`${entry.count} uploads`}
                />
                <span className="timeline-bar-label">{entry.hour}</span>
              </div>
            ))}
          </div>
          <div className="text-sm text-muted mt-4">
            Total de uploads: {timeline.reduce((s, t) => s + t.count, 0)} BUs
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="card">
        <div className="card-title">Ações Rápidas</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/upload" className="btn btn-primary">
            📤 Enviar Boletim de Urna
          </Link>
          <Link to="/boletins" className="btn btn-secondary">
            📋 Ver todos os Boletins
          </Link>
          <Link to="/resultados" className="btn btn-secondary">
            🗳️ Ver Resultados Completos
          </Link>
        </div>
      </div>
    </div>
  );
}
