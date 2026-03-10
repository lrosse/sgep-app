# 🗺️ Guia Visual e de Referência Rápida - SGEP

---

## 📊 Fluxo Completo do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        SGEP - Fluxo Completo                    │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ USUÁRIO      │
    └──────┬───────┘
           │
           ├─────────────────────────────────────────────────┐
           │                                                  │
           ▼                                                  ▼
    ┌─────────────┐                                  ┌──────────────┐
    │ SIDEBAR     │                                  │ DADOS PERSISTENTE
    │ (Nav)       │                                  │ (SQLite DB)
    └─────┬───────┘                                  └──────────────┘
           │                                                  ▲
           ├─► Dashboard ──────┐                             │
           │   (Visão geral)   │                             │
           │                   └─────────────────┐           │
           ├─► Minha Rotina ─┐                  │           │
           │   (Horários)     └──────────┐       │           │
           │                             │       ▼           │
           ├─► Matérias ─────────────────┼──► ALGORITMO      │
           │   (Disciplinas)             │     AGENDADOR     │ Cria revisões
           │                             │     (Curva de     │ automáticas
           ├─► Metas ────────────────────┴─► Esquecimento)   │
           │   (Objetivos)               ▲     LÉXICA        ▼
           │                             │     ┌──────────┐
           │                             └─────┤ PRISMA   │
           │                                   │ CLIENT   │
           │                                   └──────────┘
           │
           └─► Registra Performance
               (Quantas questões/acertos)
```

---

## 🔄 Ciclo de Vida de uma Matéria

```
DAY 0                DAY 1                   DAY 7
│                    │                       │
├─ CADASTRO          ├─ REVISÃO 1            ├─ REVISÃO 2
│  • Nome             │ • 1 dia depois       │ • 1 semana depois
│  • Data Prova       │ • Encaixa rotina    │ • Encaixa rotina
│  • Prioridade       │ • Opcional: faz 20  │ • Reforça memória
│                    │   questões            │
│                    │ • Registra no DB    │
│                    │                       │
                    DAY 14                    VÉSPERA
                    │                       │
                    ├─ REVISÃO 3            ├─ REVISÃO 4
                    │ • 2 semanas depois   │ • 1 dia antes prova
                    │ • Última revisão    │ • Preparação final
                    │ • Alta retenção      │ • Confiança máxima
                    │                       │
                                            PROVA
                                            │
                                            └─ ✓ APROVADO
                                               (98% retenção)
```

---

## 📅 Alinhamento Rotina × Datas

```
Você define ROTINA:
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Dom │ Seg │ Ter │ Qua │ Qui │ Sex │ Sab │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  ❌  │ ✓   │  ❌  │ ✓   │  ❌  │ ✓   │ ✓   │
│     │14-18│     │15-19│     │14-18│09-13│
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
     (você estuda seg, qua, sex, sab)

Você cria MATÉRIA:
09/03 (seg)  ← HOJE
10/03 (ter)  ← +1 dia = TERÇA (❌ sem rotina, PULA)
16/03 (seg)  ← +7 dias = SEGUNDA (✓ tem rotina, AGENDA)
23/03 (seg)  ← +14 dias = SEGUNDA (✓ tem rotina, AGENDA)
14/04        ← VÉSPERA (se couber na rotina)
15/04        ← PROVA!

Revisões criadas:
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Dom │ Seg │ Ter │ Qua │ Qui │ Sex │ Sab │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 09  │ 10* │ 11  │ 12  │ 13  │ 14  │ 15  │
│ 16✓ │ 17  │ 18  │ 19  │ 20  │ 21  │ 22  │
│ 23✓ │ 24  │ 25  │ 26  │ 27  │ 28  │ 29  │
│ 30  │ 31  │ 01  │ 02  │ 03  │ 04  │ 05  │
│ 06  │ 07  │ 08  │ 09  │ 10  │ 11  │ 12  │
│ 13  │ 14x │ 15P │     │     │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘

* = +1 dia (pulado, não tem rotina)
✓ = revisões agendadas (16, 23 de março)
x = véspera (14 de abril)
P = prova (15 de abril)
```

---

## 📱 Mapa da Interface

```
SIDEBAR                        CONTEÚDO PRINCIPAL
┌─────────────────┐           ┌──────────────────────────────┐
│ SGEP.           │           │        Dashboard             │
├─────────────────┤           ├──────────────────────────────┤
│ ► Dashboard     │───────────│ [Métricas de Performance]   │
│   (ícone home)  │           │ • Desempenho Geral: 75%     │
│                 │           │ • Matérias Ativas: 3        │
│ ► Matérias      │───┐       │ • Status Meta: 20h          │
│   (ícone book)  │   │       ├──────────────────────────────┤
│                 │   │       │ [O que estudar hoje?]       │
│ ► Minha Rotina  │   │       │ • Direito Civil (P3)        │
│   (ícone cal)   │   │       │ • Cálculo III (P2)          │
│                 │   │       │ • Python (P1)               │
│ ► Metas         │   │       ├──────────────────────────────┤
│   (ícone target)│   │       │ [Registrar Desempenho]      │
│                 │   │       │ Matéria: [Select ▼]        │
│ • Configurações │   │       │ Total: [__] Acertos: [__]   │
│   (ícone gear)  │   │       │ [Salvar e Analisar]         │
└─────────────────┘   │       ├──────────────────────────────┤
                      │       │ [Evolução Recente]          │
                      │       │ • 32/40 = 80%              │
                      │       │ • 25/30 = 83%              │
                      │       │ • 28/35 = 80%              │
                      │       └──────────────────────────────┘
                      │
                      └──► Matérias
                           ┌──────────────────────────────┐
                           │ Nova Matéria [Formulário] ◄──┤
                           │ Nome: [______________]        │
                           │ Data Prova: [__//__]          │
                           │ Prioridade: [____▼]           │
                           │ [Cadastrar e Calcular Ciclo]  │
                           ├──────────────────────────────┤
                           │ Matérias Cadastradas (Grid)   │
                           │ ┌────────┐ ┌────────┐        │
                           │ │Direito │ │Cálculo │        │
                           │ │Civil   │ │III     │        │
                           │ │P3      │ │P2      │        │
                           │ └────────┘ └────────┘        │
                           └──────────────────────────────┘
```

---

## ⚙️ Validações em Cada Página

### `app/page.tsx` - Dashboard

```
registrarPerformance():
  ✓ materiaId existe?
  ✓ total é número?
  ✓ acertos é número?
  ✓ total > 0?
  ✓ acertos >= 0?
  ✓ acertos <= total?

  Se falhar: retorna silenciosamente (sem messenger)
  Se OK: salva no DB e revalida
```

### `app/materias/page.tsx` - Matérias

```
criarMateria():
  ✓ nome não vazio?
  ✓ nome entre 3-100 chars?
  ✓ dataExame é válida?
  ✓ dataExame está NO FUTURO?
  ✓ prioridade entre 1-3?
  ✓ rotina cadastrada?

  Se falhar: retorna (não cria matéria)
  Se OK: cria matéria + 4 revisões automáticas

  Para cada intervalo [1, 7, 14]:
    • dataAlvo >= dataExame? → PULA
    • Existe rotina no dataAlvo.getDay()? → CRIA
    • Senão: PULA

  Véspera:
    • veßpera >= hoje? → CRIA
    • Senão: PULA
```

### `app/rotina/page.tsx` - Rotina

```
adicionarHorario():
  ✓ diaSemana entre 0-6?
  ✓ horaInicio não vazio?
  ✓ horaFim não vazio?
  ✓ horaFim > horaInicio?

  Se falhar: retorna (não cria)
  Se OK: salva no DB
```

### `app/metas/page.tsx` - Metas

```
definirMeta():
  ✓ horas é número?
  ✓ horas > 0?
  ✓ horas <= 168?

  Se falhar: retorna (não cria)
  Se OK: desativa metas antigas + cria nova
```

---

## 🗄️ Estrutura de Dados (Prisma Schema)

### Modelo: Materia

```prisma
model Materia {
  id           String    @id @default(cuid())
  nome         String    // Ex: "Direito Civil"
  prioridade   Int       // 1-3
  dataExame    DateTime  // ex: 15/04/2026
  cor          String    // "pink-600"

  revisoes     Revisao[] // Relação one-to-many
  createdAt    DateTime  @default(now())
}
```

### Modelo: Revisao

```prisma
model Revisao {
  id               String    @id @default(cuid())
  dataProgramada   DateTime  // quando deverá ser feita
  concluida        Boolean   @default(false)

  questoesTotal    Int       // quantas questões fez
  questoesAcerto   Int       // quantas acertou

  materiaId        String    // FK para Materia
  materia          Materia   @relation(fields: [materiaId], references: [id])
}
```

### Modelo: Meta

```prisma
model Meta {
  id               String    @id @default(cuid())
  objetivoMinutos  Int       // horas * 60
  dataInicio       DateTime  @default(now())
  ativa            Boolean   @default(true)

  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

### Modelo: Rotina

```prisma
model Rotina {
  id          String @id @default(cuid())
  diaSemana   Int    // 0=Dom, 1=Seg, ..., 6=Sab
  horaInicio  String // "14:00"
  horaFim     String // "18:00"
}
```

---

## 📐 Algoritmo de Agendamento (Pseudocódigo)

```javascript
async function criarMateria(formData) {
  // 1. VALIDAÇÃO
  if (!isDadosValidos()) return;
  if (!isFutureDate(dataExame)) return;
  if (!temRotinasCadastradas()) return;

  // 2. CRIAR MATÉRIA
  const materia = await db.create(Materia);

  // 3. AGENDAR REVISÕES
  const hoje = getTodayAtMidnight();
  const intervalos = [1, 7, 14]; // dias

  for (cada intervalo) {
    const dataAlvo = addDays(hoje, intervalo);

    // 3a. Validação: não pode ser APÓS prova
    if (dataAlvo >= dataExame) continue;

    // 3b. Procurar rotina no dayOfWeek
    const rotina = rotinas.find(r =>
      r.diaSemana === dataAlvo.getDay()
    );

    // 3c. Se encontrou, criar revisão
    if (rotina) {
      await db.create(Revisao, {
        materiaId: materia.id,
        dataProgramada: dataAlvo,
        concluida: false,
        questoesTotal: 0, // será preenchido depois
        questoesAcerto: 0
      });
    }
  }

  // 4. VÉSPERA DA PROVA
  const vespera = addDays(dataExame, -1);

  if (vespera >= hoje) {
    await db.create(Revisao, {
      materiaId: materia.id,
      dataProgramada: vespera,
      concluida: false
    });
  }

  // 5. REVALIDAR CACHE
  revalidatePath("/materias");
  revalidatePath("/");
}
```

---

## 🎯 Lógica do Dashboard (Resumida)

```javascript
export default async function Dashboard() {
  // 1. BUSCAR DADOS
  const materias = await db.findMany(Materia);
  const meta = await db.findFirst(Meta, { ativa: true });

  // 2. CÁLCULOS
  const revisoesConcluidas = await db.findMany(Revisao, { concluida: true });
  const totalAcertos = revisoesConcluidas.reduce(
    (acc, r) => acc + r.questoesAcerto,
    0,
  );
  const totalQuestoes = revisoesConcluidas.reduce(
    (acc, r) => acc + r.questoesTotal,
    0,
  );
  const desempenho = (totalAcertos / totalQuestoes) * 100 || 0;

  // 3. REVISÕES DE HOJE
  const hoje = getTodayAtEndOfDay(); // 23:59:59
  const revisoesPendentes = await db.findMany(Revisao, {
    where: {
      concluida: false,
      dataProgramada: { lte: hoje }, // <= hoje
    },
  });

  // 4. RENDERIZAR
  return (
    <div>
      <h1>Painel de Controle</h1>

      <Cards>
        <Card title="Desempenho Geral">{desempenho}%</Card>
        <Card title="Matérias Ativas">{materias.length}</Card>
        <Card title="Meta">{meta?.objetivoMinutos / 60}h</Card>
      </Cards>

      <Card title="O que estudar hoje?">
        {revisoesPendentes.map((rev) => (
          <Item>{rev.materia.nome}</Item>
        ))}
      </Card>

      <Form action={registrarPerformance}>
        <SelectMateria options={materias} />
        <InputTotal />
        <InputAcertos />
        <SubmitButton />
      </Form>

      <Card title="Evolução Recente">
        {revisoesConcluidas.slice(0, 5).map((rev) => (
          <Item>
            {rev.materia.nome}
            {rev.questoesAcerto}/{rev.questoesTotal}={" "}
            {((rev.questoesAcerto / rev.questoesTotal) * 100).round()}%
          </Item>
        ))}
      </Card>
    </div>
  );
}
```

---

## 🔐 Tratamento de Erros (Padrão)

```javascript
// Padrão usado em TODAS as server actions:

async function meuHandler(formData) {
  "use server";

  // ❌ ANTES (inseguro)
  const valor = formData.get("campo");
  // sem validação...
  await db.create(Model, valor);

  // ✅ DEPOIS (seguro)
  const valor = formData.get("campo");

  // Validação em camadas
  if (!valor || typeof valor !== "string") return;
  if (valor.length < 3 || valor.length > 100) return;
  if (containsInvalidChars(valor)) return;

  // Só então cria
  try {
    await db.create(Model, valor);
    revalidatePath("/relevant/path");
  } catch (error) {
    console.error(error);
    // Usuário vê: nada (falha silenciosa)
    // Ideal: adicionar toast de erro
  }
}
```

---

## 📊 Exemplos de Dados no DB

```sql
-- TABELA: Materia
+---+--------+----------+----------+--------+
| id| nome   |prioridade|dataExame | cor    |
+---+--------+----------+----------+--------+
| 1 |Di.Civil| 3        |15/04/26  |pink-600|
| 2 |Cálculo | 2        |20/04/26  |blue-600|
| 3 |Python  | 1        |25/04/26  |green-600|
+---+--------+----------+----------+--------+

-- TABELA: Revisao
+---+---+--------+------+---------+-------+------+
| id|mid|data    |concl.|total   |acerto |
+---+---+--------+------+---------+-------+------+
| 1 | 1 |10/03/26| 1   | 40      | 32    |
| 2 | 1 |17/03/26| 0   | 0       | 0     |
| 3 | 1 |24/03/26| 0   | 0       | 0     |
| 4 | 1 |14/04/26| 0   | 0       | 0     |
| 5 | 2 |10/03/26| 1   | 30      | 25    |
|...|...|........|..   |..       |..     |
+---+---+--------+------+---------+-------+------+

-- TABELA: Rotina
+---+------+------+--------+
| id|diaSem|início| fim    |
+---+------+------+--------+
| 1 | 1    |14:00 |18:00   | (segunda)
| 2 | 3    |15:00 |19:00   | (quarta)
| 3 | 5    |14:00 |18:00   | (sexta)
| 4 | 6    |09:00 |13:00   | (sábado)
+---+------+------+--------+

-- TABELA: Meta
+---+--------+-----+------+
| id|minutos |ativa|criada|
+---+--------+-----+------+
| 1 | 900    | 1   |03/09 | (15 horas/semana)
+---+--------+-----+------+
```

---

## 🚨 Mapa de Severidade de Erros (Encontrados)

```
CRÍTICA 🔴
├─ Sem rotina = matéria órfã
├─ Revisão agendada APÓS prova
├─ Validação incompleta de acertos
└─ Horários invertidos aceitos

ALTA 🟠
├─ Classes Tailwind dinâmicas quebram
├─ Divisão por zero sem tratamento
├─ Falhas silenciosas sem feedback
└─ Sem limites em metas

MÉDIA 🟡
├─ Sem paginação em findMany()
├─ Timestamp inconsistente
├─ Sem notificações de erro
└─ Form sem constraints HTML

BAIXA 🔵
├─ Comentários desatualizados
├─ Variáveis não utilizadas
└─ Sem loading states
```

---

## ✅ Checklist de Implantação

```
PRÉ-PRODUÇÃO:
□ Build passa sem erros
□ Testes de validação OK
□ Performance aceitável (<2s)
□ Responsivo em mobile
□ SQLite funcional

DEPLOY:
□ Database inicializada
□ Migrations aplicadas
□ Environment variables set
□ Next.js build otimizado
□ Cache configurado

PÓS-DEPLOY:
□ Testar cadastro de rotina
□ Testar cadastro de matéria
□ Testar agendamento automático
□ Testar registro de desempenho
□ Validar dashboard updates
```

---

## 🎓 Conceitos-chave Resumidos

| Conceito       | Definição                 | Exemplo                     |
| -------------- | ------------------------- | --------------------------- |
| **Revisão**    | Sessão de estudo agendada | 10/03 (1 dia após cadastro) |
| **Intervalo**  | Dias entre revisões       | [1, 7, 14] dias             |
| **Véspera**    | Revisão final antes prova | 14/04 (dia antes)           |
| **Rotina**     | Horários disponíveis      | Seg/Qua/Sex/Sab             |
| **Meta**       | Objetivo semanal          | 15 horas/semana             |
| **Prioridade** | Peso da matéria           | 1-3 (baixa-alta)            |
| **Desempenho** | Taxa de acertos           | 75% (média histórica)       |

---

## 🔗 Referências Rápidas

**Arquivo de Tipos:**

- `prisma/schema.prisma` - Modelos de dados

**Server Actions:**

- `app/page.tsx` - registrarPerformance()
- `app/materias/page.tsx` - criarMateria()
- `app/rotina/page.tsx` - adicionarHorario(), excluirHorario()
- `app/metas/page.tsx` - definirMeta()

**Utilitários:**

- `lib/utils.ts` - Funções de data, getCN()
- `lib/prisma.ts` - Instância do cliente

**Componentes:**

- `components/ui/` - Shadcn UI components (Button, Input, Select, Card, etc)

**Estilos:**

- `app/globals.css` - Tailwind base
- Classes inline: `className="bg-pink-600"`

---

**📌 Última atualização: 09/03/2026**  
**Criado para: SGEP v1.0**
