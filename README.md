# Projeto de Apuração de Votos Eleitorais

## Visão Geral

Este projeto tem como objetivo facilitar o processo de apuração dos votos nas eleições municipais, digitalizando as zerésimas geradas pelas urnas eletrônicas e automatizando a transferência desses dados para um formato processável (CSV). Isso reduzirá a necessidade de agrupamento manual dos votos por candidatos, agilizando a apuração dos eleitos para os cargos de prefeito e vereador.

### Problema

Após o encerramento da votação, os fiscais de seção de cada partido recebem as zerésimas, que contêm a relação de todos os votos registrados na urna eletrônica. Atualmente, os votos precisam ser agrupados manualmente por candidato, e cálculos complexos são realizados para determinar os eleitos, o que demanda muito tempo e suscita possibilidades de erro humano.

### Objetivo Inicial

O objetivo inicial do projeto é digitalizar as zerésimas e, através de um sistema de OCR (Reconhecimento Óptico de Caracteres), converter esses dados para uma planilha no formato CSV, permitindo a automação do agrupamento dos votos por candidatos.

## Funcionalidades Principais (MVP)

1. **Digitalização de Zerésimas**: Utilizando OCR, o sistema irá reconhecer os caracteres das zerésimas digitalizadas e extrair os dados dos votos.
2. **Interface de Envio**: Um aplicativo frontend permitirá que os fiscais enviem fotos das zerésimas, parte por parte, para processamento.
3. **Exportação de Dados**: Os dados extraídos serão agrupados e exportados em um arquivo CSV contendo as informações de votos por candidato.
   
## Tecnologias Planejadas

- **Frontend**: Aplicativo web ou mobile para envio das fotos das zerésimas.
- **Backend**: Serviço de OCR para processar as imagens e extrair os dados.
- **OCR**: Ferramentas como Tesseract ou outras soluções baseadas em IA para reconhecimento de caracteres.
- **Exportação de Dados**: Geração de arquivos CSV para facilitar o agrupamento dos votos.

## Futuro Desenvolvimento

1. **Banco de Dados**: Armazenar os dados extraídos em um banco de dados para facilitar a consulta e auditoria.
2. **Automação de Cálculos**: Implementar algoritmos para realizar os cálculos de apuração de votos diretamente via código, reduzindo ainda mais a intervenção manual.
3. **Relatórios e Dashboard**: Criar dashboards para visualização em tempo real dos votos apurados e relatórios automáticos com os resultados.

## Como Contribuir

Este projeto ainda está em fase de planejamento. Caso tenha interesse em contribuir, você pode sugerir melhorias, novas funcionalidades ou ajudar no desenvolvimento das ferramentas descritas. Por favor, abra um issue ou submeta um pull request.
