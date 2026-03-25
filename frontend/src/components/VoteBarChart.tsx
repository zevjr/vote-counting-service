import type { Candidate } from '../types';

interface VoteBarChartProps {
  candidates: Candidate[];
  maxBars?: number;
}

const COLORS = [
  '#1a56db',
  '#e02424',
  '#057a55',
  '#c27803',
  '#7e3af2',
  '#0694a2',
];

export function VoteBarChart({ candidates, maxBars = 10 }: VoteBarChartProps) {
  const displayed = candidates.slice(0, maxBars);
  const totalVotes = displayed.reduce((sum, c) => sum + c.votes, 0);
  const maxVotes = displayed[0]?.votes ?? 1;

  return (
    <div>
      {displayed.map((candidate, idx) => {
        const pct = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0.0';
        const barWidth = maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0;
        const color = COLORS[idx % COLORS.length];

        return (
          <div key={candidate.number} className="vote-bar-row">
            <div className="vote-bar-name" title={`${candidate.number} - ${candidate.name}`}>
              <span style={{ fontWeight: 700, color }}>{candidate.number}</span>
              {' '}
              {candidate.name}
              <span className="text-muted" style={{ fontSize: 11, marginLeft: 4 }}>
                ({candidate.party})
              </span>
            </div>
            <div className="vote-bar-track">
              <div
                className="vote-bar-fill"
                style={{ width: `${barWidth}%`, background: color }}
              />
            </div>
            <div className="vote-bar-count">{candidate.votes.toLocaleString('pt-BR')}</div>
            <div className="vote-bar-pct">{pct}%</div>
          </div>
        );
      })}
    </div>
  );
}
