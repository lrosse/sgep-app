# ⚡ Quick Start - SGEP em 5 minutos

> Para quem quer começar agora, sem ler tudo

---

## 🚀 Setup Inicial (Pré-requisitos)

```bash
# 1. Certifique-se que o projeto está rodando
cd c:\Users\lrdes\Documents\sgep-app
npm run dev

# 2. Abra no navegador
http://localhost:3000
```

---

## 📋 Checklist dos 4 Passos

### ✅ Passo 1: Configure Sua Rotina (2 minutos)

1. Clique em **"Minha Rotina"** (sidebar esquerda)
2. Clique em **"Novo Bloco de Tempo"**
3. Preencha:
   - **Dia:** Selecione um dia da semana
   - **Início:** Quando você começa a estudar (ex: 14:00)
   - **Fim:** Quando termina (ex: 18:00) **[FIM DEVE SER MAIOR QUE INÍCIO]**
4. Clique **"Salvar Horário"**
5. **Repita para todos os dias** que você tem tempo

**Exemplo:**

- Segunda 14:00-18:00
- Quarta 15:00-19:00
- Sexta 14:00-18:00
- Sábado 09:00-13:00

---

### ✅ Passo 2: Defina Sua Meta (1 minuto)

1. Clique em **"Metas"**
2. Digite quantas **horas/semana** você quer estudar
3. Clique **"Salvar"**

**Exemplo:** Se você configurou 16 horas de rotina, coloque meta = 14h (deixa margem)

---

### ✅ Passo 3: Cadastre as Matérias (2 minutos)

1. Clique em **"Matérias"**
2. Preencha:
   - **Nome:** Ex: "Direito Civil"
   - **Data do Exame:** Ex: 15/04/2026 **[DEVE SER FUTURO]**
   - **Prioridade:**
     - 1 = Fácil
     - 2 = Médio
     - 3 = Difícil/Importante
3. Clique **"Cadastrar e Calcular Ciclo"**
4. **Sistema cria automaticamente 4 revisões!**

---

### ✅ Passo 4: Estude e Registre (Diário)

1. Clique em **"Dashboard"**
2. Veja a seção **"O que estudar hoje?"**
3. Escolha uma matéria e estude questões
4. Preencha o formulário **"Registrar Desempenho"**:
   - **Matéria:** Selecione qual estudou
   - **Total de Questões:** Quantas questões fez
   - **Acertos:** Quantas acertou **[ACERTOS ≤ TOTAL]**
5. Clique **"Salvar e Analisar Ciclo"**
6. **Veja seu desempenho atualizar em tempo real!**

---

## 🎯 Exemplo Completo (10 minutos)

### Estado Inicial: 09/03/2026 (hoje)

```
Sem nada cadastrado
```

### Passo 1: Rotina

```
Seg 14:00-18:00 ✓
Qua 15:00-19:00 ✓
Sex 14:00-18:00 ✓
Sab 09:00-13:00 ✓
```

### Passo 2: Meta

```
15 horas/semana ✓
```

### Passo 3: Matérias

```
Matéria 1:
├─ Nome: Direito Civil
├─ Prova: 15/04/2026
├─ Prioridade: 3
└─ Revisões criadas:
   • 10/03 (seg) ← 1 dia depois
   • 17/03 (seg) ← 7 dias depois
   • 24/03 (seg) ← 14 dias depois
   • 14/04 (dom) ← Véspera

Matéria 2:
├─ Nome: Cálculo III
├─ Prova: 20/04/2026
├─ Prioridade: 2
└─ Revisões criadas:
   • 10/03 (seg)
   • 17/03 (seg)
   • 24/03 (seg)
   • 19/04 (dom)

** SISTEMA CRIA REVISÕES AUTOMATICAMENTE **
```

### Passo 4: Dashboard Hoje (09/03)

```
MÉTRICAS:
├─ Desempenho Geral: -- (nenhuma revisão completa)
├─ Matérias Ativas: 2
└─ Status da Meta: 15h

O QUE ESTUDAR HOJE:
├─ Direito Civil (P3)
└─ Cálculo III (P2)

REGISTRAR DESEMPENHO:
├─ Matéria: [Direito Civil ▼]
├─ Total: [50]
├─ Acertos: [38]
└─ [Salvar]

RESULTADO:
├─ Desempenho Geral: 76%
└─ Evolução: 38/50 = 76% ✓
```

---

## ⚠️ Erros Comuns (NÃO FAÇA!)

| ❌ Erro                          | ✅ Solução             |
| -------------------------------- | ---------------------- |
| "Não vejo revisões no dashboard" | Você cadastrou rotina? |
| "Data de prova no passado"       | Coloque data futura    |
| "Horário fim menor que início"   | Coloque fim > início   |
| "Acertos maior que total"        | Acertos ≤ total        |
| "Meta = 0 horas"                 | Coloque pelo menos 1h  |

---

## 🎓 O Que Acontece Automaticamente

Quando você cadastra uma matéria com prova em 15/04:

```
[VOCÊ CLICA: Cadastrar]
         ↓
[SISTEMA VALIDA]
├─ Data é futura? ✓
├─ Rotina cadastrada? ✓
└─ Prioridade válida? ✓
         ↓
[SISTEMA CRIA MATÉRIA NO DB]
         ↓
[SISTEMA CRIA 4 REVISÕES]
├─ Rev 1: +1 dia (próxima segunda)
├─ Rev 2: +7 dias (próxima segunda)
├─ Rev 3: +14 dias (próxima segunda)
├─ Rev 4: Véspera
└─ ⚡ TUDO AUTOMÁTICO!
         ↓
[DASHBOARD ATUALIZA]
└─ "O que estudar hoje?" mostra as revisões
```

---

## 📱 Interface Básica

```
┌─────────────────────────────────────────┐
│  SGEP Dashboard                     |__| │
├────────────┬──────────────────────────────┤
│ ► Dashboard│ [Métricas] [Estudar] [Form]  │
│ ► Matérias │ [Histórico]                  │
│ ► Rotina   │                              │
│ ► Metas    │                              │
└────────────┴──────────────────────────────┘
```

---

## 🔍 Entendendo as Revisões

```
Você cria MATÉRIA em 09/03 com prova em 15/04

Sistema cria 4 revisões:

✅ Revisão 1 (09/03 + 1 dia = 10/03 - SEGUNDA)
   └─ Está em sua rotina? SIM → Agenda

❌ Revisão 2 (09/03 + 7 dias = 16/03 - DOMINGO)
   └─ Está em sua rotina? NÃO → PULA

✅ Revisão 3 (09/03 + 14 dias = 23/03 - SEGUNDA)
   └─ Está em sua rotina? SIM → Agenda

✅ Revisão 4 (VÉSPERA = 14/04 - DOMINGO)
   └─ Agendada mesmo sem rotina
```

---

## 💾 Salvando Dados

```
Seu navegador NÃO salva nada
Tudo vai para um banco de dados SQLite local

Quando você:
├─ Clica "Salvar" em um formulário
├─ Sistema envia para o servidor
├─ Servidor valida
├─ Servidor salva no DB
└─ Página recarrega com novos dados

Se houver erro:
├─ Formulário NÃO submete
├─ Nenhuma mensagem de erro
├─ Você vê que "nada aconteceu"
└─ Verifique os dados (pode estar inválido)
```

---

## 🎯 Workflow Diário Tipo

### Segunda-feira 14:00

```
1. Abrir Dashboard
2. Ver: "Direito Civil - Agendado para 09/03"
3. Resolver 40 questões de sobre Direito Civil
4. Acertou 32
5. Registrar no Dashboard:
   - Matéria: Direito Civil
   - Total: 40
   - Acertos: 32
   - Salvar
6. Ver novo desempenho: 80%
```

### Quarta-feira 15:00

```
1. Abrir Dashboard
2. Ver: "Cálculo III - Agendado para 12/03"
3. Resolver 30 questões de Cálculo
4. Acertou 25
5. Registrar
6. Continuar...
```

---

## 🚀 Pronto!

Agora você tem:

- ✅ Rotina configurada
- ✅ Meta definida
- ✅ Matérias cadastradas
- ✅ Revisões agendadas AUTOMATICAMENTE
- ✅ Dashboard monitorando seu progresso

**Comece a estudar agora!**

---

## 📞 Dúvidas Rápidas?

| P?                                   | R!                                |
| ------------------------------------ | --------------------------------- |
| **Onde fico sabendo o que estudar?** | Dashboard → "O que estudar hoje?" |
| **Por que não vejo revisões?**       | Você cadastrou rotina?            |
| **Posso mudar data de prova?**       | Não (ainda). Create a new materia |
| **Posso deletar uma matéria?**       | Não (ainda). Feature futura       |
| **Funciona offline?**                | Não, precisa da internet          |
| **Quantas matérias posso ter?**      | Ilimitado, mas 5-7 é recomendado  |

---

**Boa sorte! 📚🚀**

---

_Leia `TUTORIAL.md` para guia completo_  
_Leia `REFERENCE.md` para diagramas e referência técnica_  
_Leia `AUDIT.md` para detalhes das correções aplicadas_
