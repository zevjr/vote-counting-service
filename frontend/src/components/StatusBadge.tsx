import type { ProcessingStatus } from '../types';

interface StatusBadgeProps {
  status: ProcessingStatus;
}

const statusLabels: Record<ProcessingStatus, string> = {
  pending: 'Pendente',
  processing: 'Processando',
  processed: 'Processado',
  failed: 'Falhou',
};

const statusIcons: Record<ProcessingStatus, string> = {
  pending: '⏳',
  processing: '🔄',
  processed: '✅',
  failed: '❌',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${status}`}>
      {statusIcons[status]} {statusLabels[status]}
    </span>
  );
}
