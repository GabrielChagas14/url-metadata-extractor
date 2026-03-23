# 🌐 URL Metadata Extractor API

Uma API serverless que extrai metadados Open Graph a partir de qualquer URL fornecida, retornando título, descrição e imagem de preview em formato JSON.

---

## 🚀 Visão Geral

Este projeto é uma API backend desenvolvida com **Node.js**, estruturada em camadas e executada em uma arquitetura **serverless com AWS Lambda + API Gateway**.

A API aceita uma URL como entrada, realiza uma requisição HTTP à página-alvo, faz o parse do HTML com **Cheerio** e retorna os metadados Open Graph encontrados.

Esse tipo de funcionalidade é amplamente utilizado em redes sociais, aplicativos de chat e sistemas de compartilhamento de links para gerar pré-visualizações ricas (link previews).

---

## 🏗️ Arquitetura
![Diagrama de Arquitetura](./assets/architecture.png)

### Fluxo detalhado

1. O cliente envia um `POST` com uma URL no corpo da requisição
2. O API Gateway roteia para o Lambda
3. O `handler.js` valida a entrada e chama `metadataService.js`
4. O service faz uma requisição HTTP (via **Axios**) para a URL com timeout de **5 segundos**
5. O HTML retornado é parseado pelo `parser.js` com **Cheerio**
6. Os metadados Open Graph são extraídos e retornados como JSON

---

## 📁 Estrutura do Projeto

```
url-metadata-extractor/
├── src/
│   ├── handler.js               # Entry point do Lambda (validação e resposta)
│   ├── services/
│   │   └── metadataService.js   # Requisição HTTP à URL alvo
│   └── utils/
│       └── parser.js            # Extração dos metadados via Cheerio
├── package.json
└── function.zip                 # Bundle para deploy no AWS Lambda
```

---

## 📡 Endpoint da API

### `POST /preview`

#### Corpo da requisição

```json
{
  "url": "https://example.com"
}
```

#### Resposta de sucesso — `200 OK`

```json
{
  "title": "Example Domain",
  "description": "This domain is for use in illustrative examples in documents.",
  "image": "https://example.com/image.jpg"
}
```

> **Nota:** Os campos `description` e `image` podem ser retornados como string vazia `""` caso o site não forneça essas meta tags.

#### Resposta de erro — `400 Bad Request`

```json
{
  "error": "URL is required"
}
```

#### Resposta de erro — `500 Internal Server Error`

```json
{
  "error": "Internal server error",
  "details": "mensagem do erro"
}
```

---

## 🧠 Lógica de Extração

O `parser.js` prioriza as **meta tags Open Graph** e usa fallbacks quando necessário:

| Campo         | Fonte primária                    | Fallback       |
|---------------|-----------------------------------|----------------|
| `title`       | `<meta property="og:title">`      | `<title>`      |
| `description` | `<meta property="og:description">`| `""` (vazio)   |
| `image`       | `<meta property="og:image">`      | `""` (vazio)   |

---

## ⚙️ Tecnologias

| Tecnologia   | Função                                      |
|--------------|---------------------------------------------|
| Node.js      | Runtime da aplicação                        |
| AWS Lambda   | Execução serverless do handler              |
| API Gateway  | Exposição do endpoint HTTP                  |
| Axios        | Requisições HTTP com timeout configurável   |
| Cheerio      | Parse e seleção de elementos HTML           |

---



## 🧪 Executando Localmente

> O projeto não possui um servidor HTTP local nativo. Para testar o handler localmente, você pode invocar a função diretamente via script.

### Instalação

```bash
npm install
```

### Teste manual do handler

Crie um arquivo `test.js` na raiz:

```js
const { handler } = require('./src/handler');

handler({
  body: JSON.stringify({ url: 'https://github.com' })
}).then(console.log);
```

Execute com:

```bash
node test.js
```

---

## ⚠️ Limitações

- **SPAs e sites dinâmicos** (YouTube, Instagram, etc.) utilizam renderização client-side. Como a API faz apenas requisições HTTP simples, não executa JavaScript, o que pode resultar em dados incompletos ou vazios.
- **Timeout fixo de 5 segundos** — sites lentos podem retornar erro 500.
- **Sem cache** — cada requisição consulta a URL alvo diretamente.


