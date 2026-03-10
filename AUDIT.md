# 🔍 Audit de Revisão Completa do SGEP - Relatório de Correções

**Data:** 09/03/2026  
**Revisor:** Engenheiro de Software Sênior  
**Status:** ✅ Todas as correções aplicadas

---

## 📋 Resumo Executivo

Foram identificados **10 problemas críticos** na lógica de datas, validações e tipos TypeScript. Todos foram corrigidos com sucesso, melhorando significativamente a robustez, segurança de dados e manutenibilidade do código.

---

## 🔴 Problemas Identificados e Corrigidos

### 1️⃣ **Validação Incompleta de Acertos (CRÍTICO)**

**Arquivo:** `app/page.tsx` (Linhas 76-82)

**Problema:**

- A Server Action `registrarPerformance` validava apenas `materiaId` e `total`
- `acertos` poderia ser `NaN`, negativo, ou maior que `total`
- Isso causaria erros silenciosos ou dados inconsistentes no banco

**Solução Aplicada:**

```typescript
// ANTES
if (!materiaId || isNaN(total)) return;

// DEPOIS
if (!materiaId || isNaN(total) || isNaN(acertos)) return;
if (total <= 0 || acertos < 0 || acertos > total) return;
```

✅ Agora acertos são validados rigorosamente

---

### 2️⃣ **Divisão por Zero no Histórico (ALTA PRIORIDADE)**

**Arquivo:** `app/page.tsx` (Linhas 277-290)

**Problema:**

- Cálculo `rev.questoesAcerto / rev.questoesTotal` sem verificar se `questoesTotal === 0`
- Resultado: `Infinity` ou `NaN` exibidos na UI

**Solução Aplicada:**

```typescript
// ANTES
{Math.round((rev.questoesAcerto / rev.questoesTotal) * 100)}%

// DEPOIS
const percentual = rev.questoesTotal > 0
  ? Math.round((rev.questoesAcerto / rev.questoesTotal) * 100)
  : 0;
// ...
{percentual}%
```

✅ Tratamento robusto de divisão por zero

---

### 3️⃣ **Lógica de Criação de Datas Quebrada (CRÍTICO)**

**Arquivo:** `app/materias/page.tsx` (Linhas 40-42)

**Problemas:**

- `new Date()` sem cópia causava mutação da data original
- Timestamps inconsistentes em diferentes fusos horários
- Data poderia ser criada para passado se executado dias depois

**Solução Aplicada:**

```typescript
// ANTES
const dataAlvo = new Date();
dataAlvo.setDate(hoje.getDate() + dias);

// DEPOIS
const dataAlvo = addDays(hoje, dias);
// Função auxiliar centraliza a lógica de manipulação de datas
```

✅ Função auxiliar `addDays()` garante cópia correta

---

### 4️⃣ **Intervalos de Revisão Excedem Data de Prova (CRÍTICO)**

**Arquivo:** `app/materias/page.tsx` (Linhas 45-48)

**Problema:**

- Se prova em 5 dias, intervalos de [1,7,14] criavam revisões para além da data
- Revisão "véspera" poderia ser programada para data passada

**Solução Aplicada:**

```typescript
// ANTES
const horarioDisponivel = rotinas.find(
  (r) => r.diaSemana === dataAlvo.getDay(),
);
if (horarioDisponivel) {
  await prisma.revisao.create({...});
}

// DEPOIS
if (dataAlvo >= dataExame) continue; // Validação ANTES de criar
const horarioDisponivel = rotinas.find(r => r.diaSemana === dataAlvo.getDay());
if (horarioDisponivel) {
  await prisma.revisao.create({...});
}
```

✅ Revisão nunca será programada para após a prova

---

### 5️⃣ **Matéria Órfã Sem Revisões (ALTA PRIORIDADE)**

**Arquivo:** `app/materias/page.tsx` (Linhas 35-39)

**Problema:**

- Se nenhuma rotina cadastrada, matéria era criada MAS sem revisões
- Deixava dados inconsistentes

**Solução Aplicada:**

```typescript
// ANTES
const novaMateria = await prisma.materia.create({...}); // Cria ANTES
const rotinas = await prisma.rotina.findMany();
if (rotinas.length === 0) return; // Falha DEPOIS

// DEPOIS
const rotinas = await prisma.rotina.findMany();
if (rotinas.length === 0) return; // Falha ANTES
const novaMateria = await prisma.materia.create({...});
```

✅ Matéria só é criada se houver rotina cadastrada

---

### 6️⃣ **Tailwind Dinâmico Não Funciona em Build (MÉDIA PRIORIDADE)**

**Arquivo:** `app/materias/page.tsx` (Linha 168)

**Problema:**

```typescript
className={`h-1.5 w-full bg-${m.cor}`} // Tailwind não parseia isso!
```

- Tailwind processa classes em tempo de build, não runtime
- Resultado: cores não aplicadas

**Solução Aplicada:**

```typescript
// Criar mapa fixo de cores
const coresMap: Record<string, string> = {
  "pink-600": "#ec4899",
  "blue-600": "#2563eb",
  // ...
};

// Usar inline style
<div
  style={{ backgroundColor: coresMap[m.cor] || coresMap["pink-600"] }}
/>
```

✅ Cores aplicadas corretamente via inline style com fallback

---

### 7️⃣ **Falta Validação de Horas em Metas (MÉDIA PRIORIDADE)**

**Arquivo:** `app/metas/page.tsx` (Linhas 15-19)

**Problema:**

- Aceita 0 horas, valores negativos, ou claramente inválidos (9999 horas)
- Sem limites de range

**Solução Aplicada:**

```typescript
// ANTES
const horas = parseInt(formData.get("horas") as string);
if (isNaN(horas)) return;

// DEPOIS
const horas = parseInt(formData.get("horas") as string);
if (isNaN(horas) || horas <= 0 || horas > 168) return;

// + HTML validation
<Input min="1" max="168" />
```

✅ Metas limitadas a [1-168 horas/semana]

---

### 8️⃣ **Horários Invertidos não Validados (MÉDIA PRIORIDADE)**

**Arquivo:** `app/rotina/page.tsx` (Linhas 35-36)

**Problema:**

- Aceita `horaFim < horaInicio` (ex: 14:00 às 09:00)
- Sem validação de coerência

**Solução Aplicada:**

```typescript
// ANTES
await prisma.rotina.create({...});

// DEPOIS
if (!horaInicio || !horaFim || horaFim <= horaInicio) return;
await prisma.rotina.create({...});
```

✅ Horário final sempre após inicial

---

### 9️⃣ **Falta Constraints de Input HTML (BAIXA PRIORIDADE)**

**Arquivo:** `app/materias/page.tsx`

**Problema:**

- Inputs sem `minLength`, `maxLength`, `min`, `max`
- Aceitava strings vazias ou tamanhos absurdos

**Solução Aplicada:**

```typescript
// Nome: 3-100 caracteres
<Input name="nome" minLength={3} maxLength={100} />

// Horas: 1-168
<Input name="horas" min="1" max="168" />

// Horários com help text
<Label>Fim (deve ser após início)</Label>
```

✅ Validação HTML5 + Server-side dupla camada

---

### 🔟 **Centralização de Lógica de Datas (MANUTENIBILIDADE)**

**Arquivo:** `lib/utils.ts`

**Problema:**

- Lógica de data repetida em vários arquivos
- Difícil de manter consistência

**Solução Aplicada:**

```typescript
// Funções auxiliares criadas:
export function getTodayAtMidnight(): Date {}
export function getTodayAtEndOfDay(): Date {}
export function isFutureDate(date: Date): boolean {}
export function addDays(date: Date, days: number): Date {}
```

✅ Lógica centralizada e reutilizável

---

## 📊 Tabela de Impacto das Correções

| Problema            | Severidade | Arquivo           | Status       | Impacto                 |
| ------------------- | ---------- | ----------------- | ------------ | ----------------------- |
| Validação acertos   | 🔴 CRÍTICO | page.tsx          | ✅ Corrigido | Previne dados inválidos |
| Divisão por zero    | 🟠 ALTA    | page.tsx          | ✅ Corrigido | Previne UI quebrada     |
| Criação de datas    | 🔴 CRÍTICO | materias/page.tsx | ✅ Corrigido | Algoritmo agora correto |
| Intervalo > prova   | 🔴 CRÍTICO | materias/page.tsx | ✅ Corrigido | Revisões são lógicas    |
| Matéria órfã        | 🟠 ALTA    | materias/page.tsx | ✅ Corrigido | Dados consistentes      |
| Tailwind dinâmico   | 🟡 MÉDIA   | materias/page.tsx | ✅ Corrigido | UI renderiza cores      |
| Validação horas     | 🟡 MÉDIA   | metas/page.tsx    | ✅ Corrigido | Metas realistas         |
| Horários invertidos | 🟡 MÉDIA   | rotina/page.tsx   | ✅ Corrigido | Dados coerentes         |
| Constraints HTML    | 🔵 BAIXA   | vários            | ✅ Corrigido | UX + Segurança          |
| Centralização datas | 🟡 MÉDIA   | lib/utils.ts      | ✅ Corrigido | Manutenibilidade        |

---

## 🎯 Melhorias Aplicadas por Arquivo

### ✨ `app/page.tsx` (Dashboard)

- ✅ Validação rigorosa de acertos
- ✅ Tratamento de divisão por zero
- ✅ Uso de função auxiliar `getTodayAtEndOfDay()`
- ✅ Formatação de datas com locale `pt-BR`

### ✨ `app/materias/page.tsx` (Algoritmo de Agendamento)

- ✅ Importação de funções de data auxiliares
- ✅ Validação de data futura **ANTES** de criar matéria
- ✅ Mapa de cores com inline style (Tailwind fix)
- ✅ Lógica de datas usando `addDays()`
- ✅ Validação de intervalos < dataExame
- ✅ Validação de véspera
- ✅ Constraints HTML (minLength, maxLength)

### ✨ `app/metas/page.tsx` (Objetivos)

- ✅ Validação de range [1-168 horas]
- ✅ Constraints HTML (min, max)

### ✨ `app/rotina/page.tsx` (Disponibilidade)

- ✅ Validação de horaFim > horaInicio
- ✅ Validação de dia da semana válido
- ✅ Help text no label
- ✅ Validação server-side

### ✨ `lib/utils.ts` (Utilitários)

- ✅ `getTodayAtMidnight()` - data normalizada
- ✅ `getTodayAtEndOfDay()` - final do dia
- ✅ `isFutureDate()` - validar data futura
- ✅ `addDays()` - manipulação segura de datas

---

## 🚀 Recomendações Futuras

### Próximas Iterações (Fase 2)

1. **Paginação:** Adicionar `skip/take` em `findMany()` para grandes datasets
2. **Feedback de Erros:** Mostrar mensagens de erro ao usuário em falhas de validação
3. **Transações Prisma:** Envolver `criarMateria` em `prisma.$transaction()` para atomicidade
4. **Testes Unitários:** Adicionar testes para funções de data em `lib/utils.ts`
5. **Soft Delete:** Considerar adicionar campo `deletedAt` em lugar de DELETE

### Melhorias de UX

- Toast notifications em caso de erros nas Server Actions
- Indicador visual de "carregando" durante operações
- Confirmation dialogs antes de deletar rotina/matéria
- Histórico de alterações de metas

### Segurança

- Rate limiting em criação de matérias/rotinas
- Validação de propriedade de dados (usuário pode apenas acessar seus próprios)
- Logs de auditoria para mudanças críticas

---

## ✅ Checklist Final de Validação

- [x] Todas as validações de entrada aplicadas
- [x] Lógica de datas corrigida e centralizada
- [x] Tipos TypeScript melhorados
- [x] Divisão por zero tratada
- [x] Tailwind dinâmico corrigido
- [x] HTML constraints adicionados
- [x] Formatação de datas com locale pt-BR
- [x] Funções auxiliares criadas
- [x] Comentários de contexto mantidos
- [x] Sem breaking changes nas APIs

---

## 🔗 Referências de Código

**Antes (Inseguro):**

```typescript
const acertos = parseInt(formData.get("acertos") as string);
if (!materiaId || isNaN(total)) return; // ❌ Acertos não validado!
```

**Depois (Seguro):**

```typescript
const acertos = parseInt(formData.get("acertos") as string);
if (!materiaId || isNaN(total) || isNaN(acertos)) return;
if (total <= 0 || acertos < 0 || acertos > total) return; // ✅ Completo
```

---

## 📌 Notas Importantes

1. **Backward Compatibility:** Todas as correções são non-breaking
2. **Testing:** Recomenda-se testar fluxo completo: Rotina → Matéria → Revisões
3. **Database:** Dados existentes não são afetados; apenas validações futuras
4. **Deployment:** Deploy padrão sem migrations adicionais necessárias

---

**Audit Concluído com Sucesso!** 🎉  
_Próximo passo: Deploy para staging/produção_
