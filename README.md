# Projeto de Apuração Paralela de Votos

## Visão Geral

Este projeto tem como objetivo permitir a apuração paralela de votos a partir dos Boletins de Urna (BU), antes da divulgação oficial pelos órgãos eleitorais.

A solução utiliza os PDFs gerados pelo aplicativo oficial de leitura de QR Code dos boletins (Boletim na Mão), garantindo que os dados processados sejam autênticos e estruturados.

O sistema recebe esses arquivos, extrai automaticamente os dados de votação e consolida os resultados em tempo quase real.

---

## Problema

Durante o processo eleitoral, fiscais de partidos coletam os Boletins de Urna ao final da votação.

Atualmente, esse processo envolve:

- Coleta manual dos dados
- Digitação em planilhas
- Consolidação manual
- Alto risco de erro humano
- Baixa velocidade de apuração

Além disso, os dados oficiais consolidados pelo TSE só são disponibilizados após o processamento centralizado.

---

## Objetivo

Permitir que equipes realizem sua própria apuração paralela de forma:

- Automatizada
- Rápida
- Escalável
- Auditável

---

## Como Funciona

1. O fiscal utiliza o app de leitura de QR Code para gerar o PDF do BU
2. O PDF é enviado via interface web
3. O arquivo é armazenado na nuvem
4. Um pipeline assíncrono processa o documento
5. Os dados são extraídos e armazenados
6. Os votos são agregados automaticamente
7. Um dashboard exibe os resultados em tempo real

---

## Arquitetura

O sistema utiliza uma arquitetura orientada a eventos na AWS.

Fluxo principal:

Frontend → Upload → S3 → EventBridge → SQS → Lambda → Banco de Dados → API → Dashboard

---

## Componentes

### Frontend

- Upload de arquivos BU
- Visualização dos resultados
- Monitoramento do progresso

---

### Backend

Responsável por:

- Geração de URLs de upload
- Exposição de APIs de consulta
- Consolidação de dados

---

### Pipeline Assíncrono

Responsável por:

- Processamento dos PDFs
- Extração de dados
- Persistência das informações

---

### Infraestrutura

Provisionada com Terraform, incluindo:

- Armazenamento de arquivos
- Filas de processamento
- Funções serverless
- Banco de dados relacional

---

## Tecnologias

- Backend: Python (FastAPI)
- Frontend: React / Next.js
- Processamento de PDF: pdfplumber
- Banco de Dados: PostgreSQL
- Infraestrutura: AWS + Terraform

---

## Diferenciais

- Não utiliza OCR (maior precisão)
- Baseado em documentos oficiais (BU)
- Processamento assíncrono e escalável
- Arquitetura orientada a eventos
- Parser isolado para fácil adaptação a novos layouts

---

## Roadmap Futuro

- Suporte a múltiplos municípios
- Validação automática de inconsistências
- Comparação com dados oficiais
- Dashboard em tempo real
- Extração direta via QR Code (se viável)

---

## Aviso Importante

Este sistema não substitui a apuração oficial realizada pelo TSE.

Seu uso é destinado exclusivamente para apoio à fiscalização e monitoramento independente.