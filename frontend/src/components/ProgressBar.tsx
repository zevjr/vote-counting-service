interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  variant?: 'primary' | 'success' | 'warning';
}

export function ProgressBar({ label, value, total, variant = 'primary' }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-bar-label">{label}</span>
        <span className="progress-bar-pct">{pct}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${variant !== 'primary' ? variant : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span className="text-sm text-muted">{value.toLocaleString('pt-BR')} processadas</span>
        <span className="text-sm text-muted">de {total.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );
}
