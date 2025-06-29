# Jogosfenaefrontend

Este repositório contém a aplicação frontend do projeto **Jogos FENAE**
construída em [Angular](https://angular.dev) na versão estável mais recente.

## 🚀 Instalação e Execução Local

### **1. Instalar Dependências**
```bash
npm install
```

### **2. Iniciar o Servidor de Desenvolvimento**

#### **Comando Principal (Recomendado):**
```bash
npm start
```

#### **Comando Alternativo:**
```bash
ng serve
```

#### **Comando com Configurações Específicas:**
```bash
npm run start
```

### **3. Acessar o Projeto**
Após executar o comando, o projeto estará disponível em:
- **URL Local**: `http://localhost:4200`
- **URL da Rede**: `http://localhost:4200` (acessível de outros dispositivos na rede)

O recarregamento automático ocorrerá a cada modificação nos arquivos fonte.

## ⚠️ **Importante - Configuração do Backend**

O projeto está configurado com um **proxy** para o backend (conforme `proxy.conf.json`), então as requisições para `/api` serão redirecionadas para `http://localhost:8080`. 

**Certifique-se de que o backend esteja rodando nessa porta antes de iniciar o frontend.**

## 🔧 **Outros Comandos Úteis**

```bash
# Build para produção
npm run build

# Build em modo watch (desenvolvimento)
npm run watch

# Executar testes
npm test

# Usar Angular CLI diretamente
npx ng serve

# Gerar novo componente
npx ng generate component nome-do-componente

# Ver todos os esquemas disponíveis
npx ng generate --help

# Testes end-to-end (se configurado)
npx ng e2e
```

## 📁 **Configuração de Ambientes**

Os domínios utilizados para as chamadas de API ficam em `src/environments/`.
Existem arquivos separados para **desenvolvimento**, **homologação** e
**produção** (`environment.ts`, `environment.hml.ts` e `environment.prod.ts`).

Durante o build, o Angular substitui o arquivo correto conforme a configuração
escolhida.

### **Configuração de Proxy**
O arquivo `src/environments/environment.ts` define `apiBaseUrl` como `/api`. 
Isso garante que as requisições passem pelo proxy do Angular, evitando 
problemas de CORS durante o desenvolvimento.

## 🏗️ **Build para Produção**

Para compilar o projeto em modo de produção, execute:

```bash
npm run build
```

Os artefatos serão salvos no diretório `dist/` com otimizações ativadas.

## 🧪 **Testes**

### **Testes Unitários**
Para rodar os testes unitários com [Karma](https://karma-runner.github.io):

```bash
npm test
```

### **Testes End-to-End**
Caso deseje realizar testes e2e:

```bash
npx ng e2e
```

O Angular CLI não possui um framework de e2e configurado por padrão, então
fique à vontade para escolher o que melhor se adequa ao projeto.

## 📚 **Recursos Adicionais**

Consulte a [documentação do Angular CLI](https://angular.dev/tools/cli) para
mais informações sobre os comandos disponíveis.

## 📋 **Comando Mais Simples e Direto**

```bash
npm start
```

## 🔄 **Refatoração Recente**

Este projeto passou por uma refatoração completa para melhorar a estrutura, 
performance e manutenibilidade. Consulte o arquivo `REFATORACAO.md` para 
detalhes sobre as melhorias implementadas.

### **Principais Melhorias:**
- ✅ Redução de ~70% de código duplicado nas APIs
- ✅ Tratamento de erros centralizado
- ✅ Componentes reutilizáveis
- ✅ Validações customizadas
- ✅ Performance otimizada

---

### **Nota sobre arquivos binários**

Ao criar um pull request, o GitHub pode exibir a mensagem "Arquivo binário não mostrado" para arquivos como `public/favicon.ico`.
Isso é esperado e não interfere no funcionamento do projeto.
