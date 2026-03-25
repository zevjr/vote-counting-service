import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('E-mail ou senha inválidos. Verifique suas credenciais.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a56db 0%, #1e429f 100%)',
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '40px 36px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🗳️</div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-gray-900)',
              marginBottom: 4,
            }}
          >
            BU Monitor
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-gray-500)' }}>
            Sistema de Apuração Paralela — Eleições 2026
          </p>
        </div>

        {/* Alerta de protótipo */}
        <div
          style={{
            background: '#fdf6b2',
            border: '1px solid #fcd34d',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 24,
            fontSize: 12,
            color: '#92400e',
          }}
        >
          <strong>Protótipo:</strong> Use as credenciais abaixo para acessar:
          <br />
          <code>inspetor@bumonitor.br</code> / <code>123456</code>
          <br />
          <code>analista@bumonitor.br</code> / <code>123456</code>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-gray-700)',
                marginBottom: 6,
              }}
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--color-gray-300)',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1a56db')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-gray-300)')}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-gray-700)',
                marginBottom: 6,
              }}
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--color-gray-300)',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1a56db')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-gray-300)')}
            />
          </div>

          {error && (
            <div
              style={{
                background: 'var(--color-danger-bg)',
                border: '1px solid #f98080',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 16,
                fontSize: 13,
                color: 'var(--color-danger)',
              }}
            >
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? 'var(--color-gray-400)' : '#1a56db',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ borderTopColor: '#fff' }} />
                Entrando...
              </>
            ) : (
              '🔐 Entrar'
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: 12,
            color: 'var(--color-gray-400)',
          }}
        >
          Sistema restrito a usuários autorizados.
          <br />
          Apenas para uso interno da equipe de apuração.
        </p>
      </div>
    </div>
  );
}
