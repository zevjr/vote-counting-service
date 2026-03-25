import { useCallback, useRef, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { buService } from '../services/buService';
import { useAuth } from '../contexts/AuthContext';
import type { UploadedFile } from '../types';

export function UploadPage() {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;

    const pdfFiles = Array.from(files).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      alert('Por favor, selecione apenas arquivos PDF.');
      return;
    }

    setIsUploading(true);

    for (const file of pdfFiles) {
      try {
        const result = await buService.uploadFile(file, user);
        setUploadedFiles((prev) => [result, ...prev]);

        // Simula atualização de status após alguns segundos
        setTimeout(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === result.id && f.status === 'pending'
                ? { ...f, status: 'processing' }
                : f
            )
          );
        }, 2000);

        setTimeout(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === result.id && f.status === 'processing'
                ? {
                    ...f,
                    status: 'processed',
                    municipality: 'Florianópolis',
                    zone: 107,
                    section: Math.floor(Math.random() * 100) + 1,
                  }
                : f
            )
          );
        }, 6000);
      } catch {
        const failed: UploadedFile = {
          id: `upload-err-${Date.now()}`,
          fileName: file.name,
          fileSize: file.size,
          status: 'failed',
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.id,
          uploadedByName: user.name,
          errorMessage: 'Erro ao enviar o arquivo.',
        };
        setUploadedFiles((prev) => [failed, ...prev]);
      }
    }

    setIsUploading(false);
  }, [user]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString('pt-BR');

  return (
    <div>
      <div className="page-header">
        <h2>Enviar Boletim de Urna</h2>
        <p>Faça o upload de arquivos PDF do Boletim de Urna para processamento.</p>
      </div>

      <div className="alert info mb-6">
        ℹ️ Protótipo: os uploads são simulados. Nenhum arquivo é enviado para um servidor real.
        {user && (
          <span style={{ marginLeft: 8 }}>
            Enviando como: <strong>{user.name}</strong>
          </span>
        )}
      </div>

      {/* Upload Area */}
      <div className="card mb-6">
        <div
          className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="upload-area-icon">📄</span>
          <div className="upload-area-title">
            {isUploading ? 'Enviando...' : 'Arraste e solte os arquivos aqui'}
          </div>
          <div className="upload-area-sub">
            ou clique para selecionar arquivos PDF
          </div>
          {isUploading && (
            <div style={{ marginTop: 16 }}>
              <div className="spinner" />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            📤 Selecionar Arquivos
          </button>
          <span className="text-sm text-muted" style={{ alignSelf: 'center' }}>
            Apenas arquivos PDF são aceitos
          </span>
        </div>
      </div>

      {/* Instruções */}
      <div className="card mb-6">
        <div className="card-title">📋 Instruções</div>
        <ol style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--color-gray-600)', fontSize: 14 }}>
          <li>Selecione o arquivo PDF do Boletim de Urna gerado pelo aplicativo <strong>Boletim na Mão</strong>.</li>
          <li>O sistema verificará automaticamente se o BU já foi processado (idempotência).</li>
          <li>Cada seção eleitoral pode ser enviada apenas uma vez.</li>
          <li>Acompanhe o status do processamento na lista abaixo.</li>
          <li>Em caso de falha, verifique se o arquivo está correto e tente novamente.</li>
        </ol>
      </div>

      {/* Lista de arquivos enviados */}
      {uploadedFiles.length > 0 && (
        <div>
          <div className="flex-between mb-4">
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-gray-800)' }}>
              Arquivos Enviados ({uploadedFiles.length})
            </h3>
            <button
              className="btn btn-secondary"
              onClick={() => setUploadedFiles([])}
              style={{ fontSize: 12, padding: '4px 12px' }}
            >
              Limpar lista
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Arquivo</th>
                  <th>Tamanho</th>
                  <th>Enviado em</th>
                  <th>Enviado por</th>
                  <th>Município / Zona / Seção</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>📄 {file.fileName}</span>
                    </td>
                    <td className="text-muted">{formatFileSize(file.fileSize)}</td>
                    <td className="text-muted">{formatDate(file.uploadedAt)}</td>
                    <td>
                      <span
                        style={{
                          fontSize: 12,
                          background: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 500,
                        }}
                      >
                        👤 {file.uploadedByName}
                      </span>
                    </td>
                    <td>
                      {file.municipality ? (
                        <span>
                          {file.municipality} / Zona {file.zone} / Seção {file.section}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <div>
                        <StatusBadge status={file.status} />
                        {file.errorMessage && (
                          <div
                            className="text-sm"
                            style={{ color: 'var(--color-danger)', marginTop: 4 }}
                          >
                            {file.errorMessage}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {uploadedFiles.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">Nenhum arquivo enviado ainda</div>
          <p>Selecione um arquivo PDF para começar.</p>
        </div>
      )}
    </div>
  );
}
