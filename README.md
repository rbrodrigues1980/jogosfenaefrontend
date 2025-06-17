# Jogosfenaefrontend

Este repositório contém a aplicação frontend do projeto **Jogos FENAE**
construída em [Angular](https://angular.dev) na versão estável mais recente.

## Instalação e execução local

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento. A configuração `proxy.conf.json`
   redireciona as chamadas para `/api` ao backend em `http://localhost:8888`,
   evitando problemas de CORS:
   ```bash
   npm start
   # ou use npx ng serve
   ```
   Após iniciar, acesse `http://localhost:4200/` no navegador. O recarregamento
   automático ocorrerá a cada modificação nos arquivos fonte.
3. O arquivo `src/environments/environment.ts` define `apiBaseUrl` como
   `/api`. Isso garante que as requisições passem pelo proxy do Angular,
   evitando problemas de CORS durante o desenvolvimento.

## Configuração de domínios por ambiente

Os domínios utilizados para as chamadas de API ficam em `src/environments/`.
Existem arquivos separados para **desenvolvimento**, **homologação** e
**produção** (`environment.ts`, `environment.hml.ts` e `environment.prod.ts`).
Durante o build, o Angular substitui o arquivo correto conforme a configuração
escolhida.

## Geração de código

O Angular CLI possui ferramentas poderosas de scaffolding. Para gerar um novo
component, execute:

```bash
npx ng generate component nome-do-componente
```

Para ver todos os esquemas disponíveis, utilize:

```bash
npx ng generate --help
```

## Build para produção

Para compilar o projeto em modo de produção, execute:

```bash
npm run build
```

Os artefatos serão salvos no diretório `dist/` com otimizações ativadas.

## Testes unitários

Para rodar os testes unitários com
[Karma](https://karma-runner.github.io), utilize:

```bash
npm test
```

## Testes end-to-end

Caso deseje realizar testes e2e:

```bash
npx ng e2e
```

O Angular CLI não possui um framework de e2e configurado por padrão, então
fique à vontade para escolher o que melhor se adequa ao projeto.

## Recursos adicionais

Consulte a [documentação do Angular CLI](https://angular.dev/tools/cli) para
mais informações sobre os comandos disponíveis.


### Nota sobre arquivos binários

Ao criar um pull request, o GitHub pode exibir a mensagem "Arquivo binário não mostrado" para arquivos como `public/favicon.ico`.
Isso é esperado e não interfere no funcionamento do projeto.
