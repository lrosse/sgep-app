# 📚 Tutorial Completo - SGEP (Sistema de Gestão de Estudos Personalizado)

**Versão:** 1.0  
**Data:** 09/03/2026  
**Objetivo:** Guia prático passo-a-passo para dominar o sistema

---

## 🎯 Visão Geral do Sistema

O SGEP é um **organizador inteligente de estudos** que:

- 📅 Agenda automaticamente revisões baseado na **Curva de Esquecimento de Ebbinghaus**
- 📊 Acompanha seu desempenho em questões
- ⏰ Se adapta à sua disponibilidade semanal
- 🎓 Prioriza disciplinas por dificuldade

### O que torna único?

Ao contrário de apps genéricos, o SGEP:

- **Não deixa você escolher datas:** O sistema calcula automaticamente quando você deve revisar
- **Respeita sua rotina:** Só agenda nos horários que você marcou como disponível
- **Aprende com seus acertos:** Quanto melhor você vai, mais relevante é o feedback

---

## 🔄 Fluxo de Uso Recomendado

```
1️⃣ Minha Rotina      → Defina horários livres
       ↓
2️⃣ Metas             → Defina objetivo semanal
       ↓
3️⃣ Materias          → Cadastre disciplinas e datas de prova
       ↓
4️⃣ Dashboard         → Estude, registre desempenho, acompanhe progresso
```

---

# 📖 Tutorial Passo-a-Passo

## PASSO 1️⃣: Configurar Minha Rotina

**Localização:** Sidebar → "Minha Rotina"

### Por que isso é importante?

O algoritmo de agendamento precisa saber **quando você está livre** para estudar. Sem rotina = sem revisões agendadas.

### Como fazer:

#### 1. Clique em "Novo Bloco de Tempo"

```
┌─────────────────────────────────┐
│ NOVO BLOCO DE TEMPO             │
├─────────────────────────────────┤
│ Dia da Semana: [Segunda-feira ▼] │
│ Início:        [14:00          ] │
│ Fim:           [16:30          ] │
│ [Salvar Horário]                │
└─────────────────────────────────┘
```

#### 2. Preencha os campos

| Campo             | Exemplo       | Notas                                 |
| ----------------- | ------------- | ------------------------------------- |
| **Dia da Semana** | Segunda-feira | Escolha um dia                        |
| **Início**        | 14:00         | Quando você começa a estar livre      |
| **Fim**           | 16:30         | **Deve ser após o início** (validado) |

#### 3. Salve clicando no botão

**O sistema valida automaticamente:**

- ✅ Fim > Início
- ✅ Dia válido (0-6)
- ✅ Formato de hora válido

### Exemplo Prático

Você trabalha 9-13h e tem tarde livre:

```
Segunda:  14:00 - 18:00 (4 horas)
Quarta:   14:00 - 18:00 (4 horas)
Sexta:    15:00 - 19:00 (4 horas)
Sábado:   10:00 - 14:00 (4 horas)
```

**Total: 16 horas de estudo/semana**

### ⚠️ O que NÃO fazer

- ❌ Marcar horários que você não vai realmente usar
- ❌ Horários muito curtos (<1 hora é pouco para revisar)
- ❌ Horários noturnos se você não é gato

---

## PASSO 2️⃣: Definir Metas

**Localização:** Sidebar → "Metas"

### Por que isso importa?

Sua meta é o **objetivo semanal**. O dashboard mostra se você está no caminho.

### Como fazer:

#### 1. Vá para Metas

```
┌────────────────────────┐
│ META ATUAL             │
├────────────────────────┤
│ 20h                    │ ← Meta atual
│ por semana             │
├────────────────────────┤
│ Ajustar Objetivo       │
├────────────────────────┤
│ Horas Semanais: [20 ▲] │
│ [Salvar]               │
└────────────────────────┘
```

#### 2. Digite quantidade de horas

- **Validação:** 1 a 168 horas/semana
- **Padrão:** 15-20 horas/semana é realista
- **Máximo:** 168 (24h × 7 dias - possível, mas não recomendado)
- **Mínimo:** 1 hora/semana

#### 3. Clique em "Salvar"

A meta anterior é desativada automaticamente.

### Exemplo Prático

```
Se sua rotina = 16 horas/semana
E você pode dedicar 100% disso = Meta = 16 horas

Recomendação realista: 12-14 horas/semana
(deixa margem para vida pessoal)
```

### ⚠️ Dica Inteligente

- 📊 **Muito baixo (1-5h):** Pouco progresso
- ✅ **Ideal (10-20h):** Consistência sustentável
- 🔥 **Agressivo (20+h):** Risco de burnout

---

## PASSO 3️⃣: Cadastrar Disciplinas

**Localização:** Sidebar → "Matérias"

### Por que isso importa?

Aqui o **algoritmo de agendamento trabalha sua mágica**. Ao cadastrar uma matéria, o sistema cria automaticamente 4 revisões baseadas na Curva de Esquecimento.

### Como fazer:

#### 1. Preencha o Formulário "Nova Matéria"

```
┌─────────────────────────────────┐
│ NOVA MATÉRIA                    │
├─────────────────────────────────┤
│ Nome: [Direito Civil          ] │
│ Data da Prova: [15/04/2026    ] │
│ Prioridade: [3 - Alta        ▼] │
│ [Cadastrar e Calcular Ciclo]    │
└─────────────────────────────────┘
```

#### 2. Nome da Matéria

- **Obrigatório:** Sim
- **Min caracteres:** 3
- **Max caracteres:** 100
- **Exemplos:** "Direito Civil", "Cálculo III", "Python Avançado"

#### 3. Data do Exame

- **Obrigatório:** Sim
- **Restrição:** Deve ser **futuro** (validado automaticamente)
- **Formato:** DD/MM/AAAA
- **Exemplo:** 15/04/2026

#### 4. Prioridade

| Nível         | Quando usar                 | Cor         |
| ------------- | --------------------------- | ----------- |
| **1 - Baixa** | Tenho experiência anterior  | 🔵 Azul     |
| **2 - Média** | Padrão, conhecimento normal | 🔵 Azul     |
| **3 - Alta**  | Difícil, peso importante    | 🔴 Vermelho |

### 🧠 O Algoritmo de Agendamento (O Coração do SGEP)

Quando você cadastra uma matéria, o sistema cria **4 revisões automáticas**:

```
Dia 0 (hoje):        [Matéria cadastrada]
    ↓
Dia 1:               📍 Revisão 1 (1 dia depois)
    ↓
Dia 7:               📍 Revisão 2 (1 semana depois)
    ↓
Dia 14:              📍 Revisão 3 (2 semanas depois)
    ↓
Dia 1-antes-prova:   📍 Revisão 4 (VÉSPERA)
    ↓
Prova!
```

### Exemplo Real

```
Você cria: "Direito Civil"
Data da prova: 15/04/2026 (hoje = 09/03/2026)

O sistema cria automaticamente:

✓ Revisão 1: 10/03 (segunda-feira) às 14:00
✓ Revisão 2: 16/03 (domingo) - SEM AGENDAMENTO
              (você marcou rotina seg/qua/sex/sab, não domingo)
✓ Revisão 3: 23/03 (segunda-feira) às 14:00
✓ Revisão 4: 14/04 (véspera) - AGENDADA AUTOMATICAMENTE
```

### 🎯 Como as Datas são Calculadas

1. O sistema pega **hoje às 00:00**
2. Soma os intervalos: +1, +7, +14 dias
3. **Procura por um dia da semana que você tem rotina**
4. Se encontra, cria revisão naquele horário
5. Se não encontra, **pula para próxima tentativa**
6. Garante que nenhuma revisão seja **após a prova**

### ⚠️ Validações Automáticas

```typescript
✅ Nome não vazio
✅ Data no futuro (não passado)
✅ Prioridade entre 1-3
✅ Rotina cadastrada (sem rotina = sem agendamento)
✅ Revisão nunca é DEPOIS da prova
```

### 📍 Onde Ver as Revisões Agendadas?

Vá para **Dashboard** e veja a seção "O que estudar hoje?"

```
┌──────────────────────────────────────┐
│ O QUE ESTUDAR HOJE?                  │
├──────────────────────────────────────┤
│ Direito Civil                        │
│ Agendado para: 09/03/2026            │
│ Prioridade: P3                       │
└──────────────────────────────────────┘
```

---

## PASSO 4️⃣: Usar o Dashboard

**Localização:** Sidebar → "Dashboard"

Este é o coração da operação. Aqui você:

- 📊 Vê seu progresso
- ✏️ Registra desempenho
- 📈 Acompanha evolução
- 🎯 Verifica o que estudar hoje

### Seção 1: Métricas de Performance (Topo)

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ DESEMPENHO GERAL     │ MATÉRIAS ATIVAS      │ STATUS DA META       │
├──────────────────────┼──────────────────────┼──────────────────────┤
│ 75%                  │ 3                    │ 20h                  │
│ Taxa de acertos      │ Disciplinas em ciclo │ Objetivo semanal     │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

**O que significa:**

- **Desempenho Geral:** Média de acertos em todas as revisões completadas
- **Matérias Ativas:** Quantas disciplinas você está estudando
- **Status da Meta:** Seu objetivo semanal definido

### Seção 2: O Que Estudar Hoje

```
┌────────────────────────────────────────────────┐
│ O QUE ESTUDAR HOJE?                            │
├────────────────────────────────────────────────┤
│ Direito Civil                        P3        │
│ Agendado para: 09/03/2026                      │
│                                                │
│ Cálculo III                          P2        │
│ Agendado para: 09/03/2026                      │
└────────────────────────────────────────────────┘
```

- Mostra TODAS as revisões que deveriam ser feitas hoje ou estão atrasadas
- Ordenadas pela data agendada
- Criadas automaticamente pelo algoritmo

### Seção 3: Registrar Desempenho

Este é o lugar onde você **alimenta o sistema** com dados reais.

```
┌─────────────────────────────────┐
│ REGISTRAR DESEMPENHO            │
├─────────────────────────────────┤
│ Matéria Estudada:               │
│ [Selecione uma matéria ▼]       │
│                                 │
│ Total de Questões: [50      ]   │
│ Acertos:          [38      ]   │
│                                 │
│ [Salvar e Analisar Ciclo]       │
└─────────────────────────────────┘
```

#### Como preencher:

1. **Selecione a Matéria** que você acabou de estudar
2. **Total de Questões:** Quantas questões você fez
3. **Acertos:** Quantas você acertou

#### Validações:

```
✅ Matéria selecionada
✅ Total > 0
✅ Acertos >= 0
✅ Acertos <= Total (sempre!)
❌ Se invalido: não salva, falha silenciosamente
```

#### Exemplo:

```
Você estudou 50 questões de Direito Civil
Acertou 38

Resultado registrado:
38/50 = 76% de acerto
```

### Seção 4: Evolução Recente

```
┌────────────────────────────────────────────────┐
│ EVOLUÇÃO RECENTE (últimas 5 revisões)          │
├────────────────────────────────────────────────┤
│ Direito Civil         38/50 acertos    76%     │
│ Cálculo III          28/40 acertos    70%     │
│ Python               45/50 acertos    90%     │
└────────────────────────────────────────────────┘
```

**Interpretação:**

- Verde (≥70%): Bom desempenho
- Vermelho (<70%): Precisa revisar mais

---

## 🎓 Guia Prático Completo (Exemplo Real)

### Cenário: Você está estudando para 3 provas

**Dados Iniciais:**

- Hoje: 09/03/2026
- Disponibilidade: 16h/semana
- Meta: 15h/semana

### Passo 1: Configurar Rotina (Segunda-feira)

| Dia     | Início | Fim   | Horas |
| ------- | ------ | ----- | ----- |
| Segunda | 14:00  | 18:00 | 4h    |
| Quarta  | 15:00  | 19:00 | 4h    |
| Sexta   | 14:00  | 18:00 | 4h    |
| Sábado  | 09:00  | 13:00 | 4h    |

**Total de Disponibilidade:** 16h/semana

### Passo 2: Definir Meta

```
Objetivo: 15 horas/semana
(deixando 1h para margem)
```

### Passo 3: Cadastrar Matérias

#### Matéria 1: Direito Civil

```
Nome: Direito Civil
Prova: 15/04/2026 (37 dias)
Prioridade: 3 (Alta)

Revisões Criadas:
• 10/03 (seg) 14:00 → Já passou? Não! (hoje = 09/03)
• 10/03 (seg) 14:00 → ✓ Revisão 1
• 16/03 (dom) → Não há rotina, PULA
• 17/03 (seg) 14:00 → ✓ Revisão 2 (14 dias após)
• 24/03 (seg) 14:00 → ✓ Revisão 3 (21 dias após)
• 14/04 (dom) → Véspera (não agendada, sem rotina)
• Agendamento manual: 14/04 em algum horário
```

#### Matéria 2: Cálculo III

```
Nome: Cálculo III
Prova: 20/04/2026
Prioridade: 2 (Média)

Revisões:
• 10/03 (seg) → ✓
• 17/03 (seg) → ✓
• 24/03 (seg) → ✓
• 19/04 (dom) → Véspera (sem rotina)
```

#### Matéria 3: Python Avançado

```
Nome: Python Avançado
Prova: 25/04/2026
Prioridade: 1 (Baixa)

Revisões:
• 10/03 (seg) → ✓ Conflito! (3 revisões em 1h?)
```

**Problema:** Muitas revisões no mesmo horário!

### Passo 4: Estudar (Dashboard)

**09/03 (hoje - segunda):**

```
O que estudar hoje:
┌─────────────────┐
│ Direito Civil    │
│ Cálculo III     │
│ Python Avançado │
└─────────────────┘

Tempo: 4 horas de 14:00-18:00
```

Você faz questões:

- Direito Civil: 40 questões, 32 acertos (80%)
- Cálculo: 30 questões, 25 acertos (83%)
- Python: 35 questões, 28 acertos (80%)

**Registra no Dashboard:**

```
Matéria: Direito Civil
Total: 40
Acertos: 32
✓ Salvar
```

**Dashboard atualiza:**

```
Desempenho Geral: 82%
Evolução Recente:
• Direito Civil 32/40 → 80%
• Cálculo III 25/30 → 83%
• Python 28/35 → 80%
```

---

## ⚠️ Erros Comuns e Como Evitar

### ❌ Erro 1: Sem Rotina Cadastrada

```
Você: "Vou cadastrar uma matéria"
Sistema: "Nenhuma rotina encontrada"
Você: "Por quê??"
```

**Solução:** Sempre configure rotina PRIMEIRO.

### ❌ Erro 2: Data de Prova no Passado

```
Você tenta: Data do Exame = 08/03/2026 (ontem)
Sistema: Recusa silenciosamente
```

**Solução:** Coloque sempre data FUTURA.

### ❌ Erro 3: Horário Invertido na Rotina

```
Você: Início = 18:00, Fim = 14:00
Sistema: Rejeita (horaFim <= horaInicio)
```

**Solução:** Sempre fim > início.

### ❌ Erro 4: Meta Irrealista

```
Você: "Vou estudar 168 horas/semana"
Realidade: Você dorme 56 horas/semana
```

**Solução:** Seja honesto com sua disponibilidade.

### ❌ Erro 5: Registrar Desempenho Inválido

```
Total de questões: 50
Acertos: 60 (???)

Sistema: Rejeita (acertos > total)
```

**Solução:** Sempre acertos <= total.

---

## 🎯 Dicas Pro (Advanced)

### 1️⃣ Estratégia Pomodoro + SGEP

```
Você tem rotina: 14:00-18:00 (4 horas)

Blocos de 1h cada:
• 14:00-15:00: Matéria A (1 revisão)
• 15:00-16:00: Matéria B (1 revisão)
• 16:00-17:00: Matéria C (1 revisão)
• 17:00-18:00: Exercícios extras

Registra cada um no dashboard
```

### 2️⃣ Diversidade de Dificuldade

```
Mantenha proporção de prioridades:
• 60% = Prioridade 3 (altas/difíceis)
• 30% = Prioridade 2 (médias)
• 10% = Prioridade 1 (fáceis/revisão)

Mantém motivação + efetividade
```

### 3️⃣ Leitura de Desempenho

```
Se taxa de acertos:
• > 90% = Você dominou, pode focar em dúvidas
• 70-90% = Zona perfeita! Continuar
• 50-70% = Aumentar frequência de revisão
• < 50% = Mudar estratégia (resumos, aulas, etc)
```

### 4️⃣ Quando Adicionar Matérias

```
❌ Não recomendado:
- Colocar muitas matérias com prova no mesmo dia

✅ Recomendado:
- Distribuir provas ao longo do mês
- Deixar mínimo 3-4 dias entre provas
- Balancear dificuldade

Exemplo bom:
• 10/04: Matéria A
• 15/04: Matéria B
• 20/04: Matéria C
```

### 5️⃣ Uso do Intervalo "Véspera"

```
A véspera é importante!
Não é para aprender, é para:
• Revisar tópicos críticos
• Resolver última lista
• Ganhar confiança
• Dormir bem depois

Mas o sistema pode não agendar no site se
você não tem rotina naquele dia!

Solução: Marque manualmente a véspera
ou estude quando tiver tempo
```

---

## 🔍 Interpretando o Dashboard

### Métrica: Desempenho Geral

```
Fórmula: (Total de Acertos / Total de Questões) × 100

Exemplo:
Revisão 1: 32/40 questões = 32 acertos
Revisão 2: 25/30 questões = 25 acertos
Revisão 3: 28/35 questões = 28 acertos

Total: 85 acertos / 105 questões = 81%
```

**Color Coding:**

- 🟢 ≥70%: Mantém verde
- 🟡 50-69%: Muda para âmbar
- 🔴 <50%: Fica vermelho

### Métrica: Matérias Ativas

```
Conta quantas matérias você está estudando
Atualiza quando você cria ou deleta uma
```

### Métrica: Status da Meta

```
Mostra seu objetivo semanal
Ajude a você a ter uma meta visual

Se vazio = defina uma meta!
```

---

## 🚀 Workflow Diário Recomendado

### Manhã (Planejamento)

```
1. Abra o Dashboard
2. Veja "O que estudar hoje?"
3. Bloqueie tempo na sua agenda
```

### Durante o Dia (Estudo)

```
1. Abrah o SGEP no seu computador
2. Resolve questões da matéria agendada
3. Anota: quantas questões, quantos acertos
```

### Noite (Registro)

```
1. Vá para Dashboard
2. Clique em "Registrar Desempenho"
3. Selecione matéria
4. Digite total e acertos
5. Clique "Salvar"
6. Veja novo desempenho geral atualizado
```

---

## ❓ FAQ (Perguntas Frequentes)

### P: O sistema lembrará de estudar?

**R:** Não (ainda). Você precisa checar o Dashboard. Futura feature: notificações.

### P: Posso deletar uma matéria?

**R:** Não está implementado. Feature futura.

### P: Posso editar data de prova?

**R:** Não está implementado. Feature futura.

### P: E se eu errar a prioridade?

**R:** Não afeta o agendamento diretamente. Afeta apenas a identificação visual.

### P: Posso ter rotina no fim de semana?

**R:** Sim! Sábado e domingo funcionam normalmente.

### P: Quantas matérias posso cadastrar?

**R:** Teoricamente ilimitado, mas recomenda-se máximo 5-7 simultâneas.

### P: O sistema funciona offline?

**R:** Não. Precisa de conexão com banco de dados SQLite (rodando localmente).

### P: Posso compartilhar minha rotina com colega?

**R:** Cada usuário tem seu próprio banco. Feature futura: multi-usuário.

---

## 🎓 Resumo das Curvas de Aprendizado

### O que o SGEP Implementa: Ebbinghaus Spaced Repetition

```
Esquecimento sem revisão:
Day 0: 100%
Day 1: 50%
Day 3: 30%
Day 7: 10%

Com SGEP (Revisões em 1, 7, 14, véspera):
Day 0: 100% ↓ Cadastra
Day 1: 90% → ✓ Revisão 1 → Back to 95%
Day 7: 80% → ✓ Revisão 2 → Back to 92%
Day 14: 85% → ✓ Revisão 3 → Back to 94%
Véspera: 92% → ✓ Revisão 4 → Back to 98%
Prova: 98% ✓ APROVADO!
```

---

## 📈 Métricas de Sucesso

### Como saber se você está usando certo?

✅ **Bom sinal:**

- Desempenho geral > 70%
- Está estudando todas as revisões agendadas
- Aumenta ao longo do tempo
- Matérias balanceadas

❌ **Sinal de alerta:**

- Desempenho < 50% por semanas
- Revisões acumulando não feitas
- Só estuda a noite antes da prova

---

## 🛠️ Troubleshooting

### Problema: "Não aparecem revisões no Dashboard"

**Possíveis causas:**

1. Sem rotina cadastrada
2. Data de prova é passado
3. Você criou matéria mas horários não coincidem

**Solução:**

- Verifique Sidebar → Minha Rotina
- Adicione pelo menos 1 bloco
- Recrie a matéria

### Problema: "Desempenho não atualiza"

**Possíveis causas:**

1. Valor inválido (acertos > total)
2. Navegador com cache
3. Erro silencioso (sem mensagem)

**Solução:**

- Verifique: total > 0 E acertos <= total
- Ctrl+Shift+R (reload hard)
- Veja console do navegador

### Problema: "Horário aparece errado"

**Possíveis causas:**

1. Timezone do navegador diferente
2. Fuso horário do servidor

**Solução:**

- Todas as datas são locais
- Sem conversão automática
- Se erro: reporte

---

## 🎉 Próximos Passos

Agora que você entende o SGEP:

1. ✅ Cadastre sua rotina
2. ✅ Defina uma meta realista
3. ✅ Adicione suas matérias
4. ✅ Estude as revisões agendadas
5. ✅ Registre seu desempenho
6. ✅ Acompanhe a evolução

**Boa sorte em seus estudos!** 🚀

---

## 📞 Suporte e Feedback

Encontrou um bug? Tem sugestão de feature?

- Abra uma issue
- Descreva o problema
- Inclua prints se possível

**Sistema criado com ❤️ para aprendizado eficiente**
