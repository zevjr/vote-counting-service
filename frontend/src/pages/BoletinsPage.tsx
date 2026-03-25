import { useEffect, useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { buService } from '../services/buService';
import type { BoletimUrna, ProcessingStatus } from '../types';

const STATUS_OPTIONS: { value: ProcessingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'processed', label: 'Processados' },
  { value: 'processing', label: 'Processando' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'failed', label: 'Com Falha' },
];

export function BoletinsPage() {
  const [boletins, setBoletins] = useState<BoletimUrna[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ProcessingStatus | 'all'>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    buService.getBoletins().then((data) => {
      setBoletins(data);
      setLoading(false);
    });
  }, []);

  const zones = useMemo(() => {
    const zoneSet = new Set(boletins.map((b) => b.zone));
    return Array.from(zoneSet).sort((a, b) => a - b);
  }, [boletins]);

  const filtered = useMemo(() => {
    return boletins.filter((b) => {
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      if (filterZone !== 'all' && String(b.zone) !== filterZone) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.municipality.toLowerCase().includes(q) &&
          !String(b.zone).includes(q) &&
          !String(b.section).includes(q) &&
          !b.fileName.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [boletins, filterStatus, filterZone, search]);

  const formatDate = (iso: string) => new Date(iso).toLocaleString('pt-BR');

  const statusCounts = useMemo(() => {
    return {
      processed: boletins.filter((b) => b.status === 'processed').length,
      processing: boletins.filter((b) => b.status === 'processing').length,
      pending: boletins.filter((b) => b.status === 'pending').length,
      failed: boletins.filter((b) => b.status === 'failed').length,
    };
  }, [boletins]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        Carregando boletins...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Boletins de Urna</h2>
        <p>Lista de todos os Boletins de Urna recebidos e seu status de processamento.</p>
      </div>

      {/* Resumo de status */}
      <div className="stats-grid mb-6">
        <div className="stat-card success">
          <div className="stat-card-label">Processados</div>
          <div className="stat-card-value">{statusCounts.processed}</div>
        </div>
        <div className="stat-card primary">
          <div className="stat-card-label">Processando</div>
          <div className="stat-card-value">{statusCounts.processing}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-card-label">Pendentes</div>
          <div className="stat-card-value">{statusCounts.pending}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-card-label">Com Falha</div>
          <div className="stat-card-value">{statusCounts.failed}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="🔍 Buscar por município, zona, seção ou arquivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '8px 12px',
              border: '1px solid var(--color-gray-300)',
              borderRadius: 'var(--border-radius)',
              fontSize: 14,
              outline: 'none',
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProcessingStatus | 'all')}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--color-gray-300)',
              borderRadius: 'var(--border-radius)',
              fontSize: 14,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--color-gray-300)',
              borderRadius: 'var(--border-radius)',
              fontSize: 14,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todas as Zonas</option>
            {zones.map((z) => (
              <option key={z} value={String(z)}>
                Zona {z}
              </option>
            ))}
          </select>

          {(filterStatus !== 'all' || filterZone !== 'all' || search) && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setFilterStatus('all');
                setFilterZone('all');
                setSearch('');
              }}
              style={{ fontSize: 12 }}
            >
              ✕ Limpar filtros
            </button>
          )}
        </div>

        <div className="text-sm text-muted mt-4">
          Exibindo {filtered.length} de {boletins.length} boletins
        </div>
      </div>

      {/* Tabela */}
      {filtered.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Município</th>
                <th>Zona</th>
                <th>Seção</th>
                <th>Arquivo</th>
                <th>Enviado por</th>
                <th>Data de Upload</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bu, idx) => (
                <tr key={bu.id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{bu.municipality}</td>
                  <td>{bu.zone.toString().padStart(3, '0')}</td>
                  <td>{bu.section.toString().padStart(4, '0')}</td>
                  <td>
                    <span
                      className="text-sm"
                      style={{ color: 'var(--color-gray-600)' }}
                      title={bu.fileName}
                    >
                      📄 {bu.fileName.length > 30 ? bu.fileName.slice(0, 30) + '…' : bu.fileName}
                    </span>
                  </td>
                  <td>
                    {bu.uploadedByName ? (
                      <span
                        style={{
                          fontSize: 12,
                          background: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        👤 {bu.uploadedByName}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-muted">{formatDate(bu.uploadDate)}</td>
                  <td>
                    <div>
                      <StatusBadge status={bu.status} />
                      {bu.errorMessage && (
                        <div
                          className="text-sm"
                          style={{ color: 'var(--color-danger)', marginTop: 4 }}
                          title={bu.errorMessage}
                        >
                          {bu.errorMessage.length > 40
                            ? bu.errorMessage.slice(0, 40) + '…'
                            : bu.errorMessage}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Nenhum boletim encontrado</div>
          <p>Tente ajustar os filtros de busca.</p>
        </div>
      )}
    </div>
  );
}
