import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

type MateriaResumo = {
  nome: string;
  cor: string;
  percentual: number;
  totalQuestoes: number;
  totalAcertos: number;
};

type RevisaoPrevia = {
  materiaNome: string;
  dataProgramada: Date;
};

type Props = {
  nomeUsuario: string;
  streakAtual: number;
  streakMaximo: number;
  desempenhoGeral: number;
  materias: MateriaResumo[];
  melhorMateria?: MateriaResumo;
  piorMateria?: MateriaResumo;
  revisoesSemana: RevisaoPrevia[];
  materiasVespera: { nome: string; diasRestantes: number }[];
};

export function WeeklySummary({
  nomeUsuario = "Aluno",
  streakAtual = 0,
  streakMaximo = 0,
  desempenhoGeral = 0,
  materias = [],
  melhorMateria,
  piorMateria,
  revisoesSemana = [],
  materiasVespera = [],
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        Seu resumo semanal SGEP — {String(desempenhoGeral)}% de acertos esta
        semana
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* HEADER */}
          <Section style={styles.header}>
            <Heading style={styles.logo}>
              SGEP<span style={{ color: "#ec4899" }}>.</span>
            </Heading>
            <Text style={styles.subtitle}>Resumo Semanal de Estudos</Text>
          </Section>

          {/* SAUDAÇÃO */}
          <Section style={styles.section}>
            <Text style={styles.greeting}>Olá, {nomeUsuario}! 👋</Text>
            <Text style={styles.text}>
              Aqui está o resumo da sua semana de estudos. Continue assim!
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* STREAK */}
          <Section style={styles.section}>
            <Heading as="h2" style={styles.sectionTitle}>
              🔥 Sequência de Estudos
            </Heading>
            <Row>
              <Column style={styles.statBox}>
                <Text style={styles.statNumber}>{streakAtual}</Text>
                <Text style={styles.statLabel}>Dias seguidos</Text>
              </Column>
              <Column style={styles.statBox}>
                <Text style={styles.statNumber}>{streakMaximo}</Text>
                <Text style={styles.statLabel}>Recorde pessoal</Text>
              </Column>
              <Column style={styles.statBox}>
                <Text
                  style={{
                    ...styles.statNumber,
                    color: desempenhoGeral >= 70 ? "#10b981" : "#f59e0b",
                  }}
                >
                  {desempenhoGeral}%
                </Text>
                <Text style={styles.statLabel}>Desempenho geral</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={styles.hr} />

          {/* DESTAQUES */}
          {(melhorMateria || piorMateria) && (
            <Section style={styles.section}>
              <Heading as="h2" style={styles.sectionTitle}>
                📊 Destaques da Semana
              </Heading>
              {melhorMateria && (
                <Section
                  style={{
                    ...styles.highlightBox,
                    borderLeft: "4px solid #10b981",
                  }}
                >
                  <Text style={styles.highlightLabel}>
                    ✅ Melhor desempenho
                  </Text>
                  <Text style={styles.highlightValue}>
                    {melhorMateria.nome} — {melhorMateria.percentual}% de
                    acertos
                  </Text>
                </Section>
              )}
              {piorMateria && (
                <Section
                  style={{
                    ...styles.highlightBox,
                    borderLeft: "4px solid #f59e0b",
                    marginTop: "8px",
                  }}
                >
                  <Text style={styles.highlightLabel}>
                    ⚠️ Precisa de atenção
                  </Text>
                  <Text style={styles.highlightValue}>
                    {piorMateria.nome} — {piorMateria.percentual}% de acertos
                  </Text>
                </Section>
              )}
            </Section>
          )}

          {/* DESEMPENHO POR MATÉRIA */}
          {materias.length > 0 && (
            <>
              <Hr style={styles.hr} />
              <Section style={styles.section}>
                <Heading as="h2" style={styles.sectionTitle}>
                  📚 Desempenho por Matéria
                </Heading>
                {materias.map((m, i) => (
                  <Row key={i} style={styles.materiaRow}>
                    <Column style={{ width: "60%" }}>
                      <Text style={styles.materiaNome}>{m.nome}</Text>
                      <Text style={styles.materiaDetalhe}>
                        {m.totalAcertos}/{m.totalQuestoes} questões
                      </Text>
                    </Column>
                    <Column style={{ width: "40%", textAlign: "right" }}>
                      <Text
                        style={{
                          ...styles.materiaPercentual,
                          color:
                            m.percentual >= 70
                              ? "#10b981"
                              : m.percentual >= 50
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      >
                        {m.percentual}%
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            </>
          )}

          {/* ALERTAS DE VÉSPERA */}
          {materiasVespera.length > 0 && (
            <>
              <Hr style={styles.hr} />
              <Section style={styles.section}>
                <Heading
                  as="h2"
                  style={{ ...styles.sectionTitle, color: "#ef4444" }}
                >
                  🚨 Provas Chegando!
                </Heading>
                {materiasVespera.map((m, i) => (
                  <Text key={i} style={styles.vesperaItem}>
                    • {m.nome} —{" "}
                    {m.diasRestantes === 0
                      ? "hoje!"
                      : m.diasRestantes === 1
                        ? "amanhã!"
                        : `em ${m.diasRestantes} dias`}
                  </Text>
                ))}
              </Section>
            </>
          )}

          {/* PRÉVIA DA PRÓXIMA SEMANA */}
          {revisoesSemana.length > 0 && (
            <>
              <Hr style={styles.hr} />
              <Section style={styles.section}>
                <Heading as="h2" style={styles.sectionTitle}>
                  📅 Próxima Semana
                </Heading>
                <Text style={styles.text}>
                  Você tem {revisoesSemana.length} revisão(ões) agendada(s):
                </Text>
                {revisoesSemana.slice(0, 5).map((r, i) => (
                  <Text key={i} style={styles.revisaoItem}>
                    • {r.materiaNome} —{" "}
                    {new Date(r.dataProgramada).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </Text>
                ))}
              </Section>
            </>
          )}

          <Hr style={styles.hr} />

          {/* FOOTER */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              SGEP — Sistema de Gestão de Estudos Personalizado
            </Text>
            <Text style={styles.footerText}>
              Este e-mail foi enviado automaticamente todo domingo.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#09090b",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#18181b",
    borderRadius: "12px",
    overflow: "hidden" as const,
    border: "1px solid #27272a",
  },
  header: {
    backgroundColor: "#09090b",
    padding: "32px 40px 24px",
    textAlign: "center" as const,
  },
  logo: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "800",
    margin: "0",
    letterSpacing: "-1px",
  },
  subtitle: {
    color: "#71717a",
    fontSize: "14px",
    margin: "4px 0 0",
  },
  section: {
    padding: "24px 40px",
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 16px",
  },
  greeting: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  text: {
    color: "#a1a1aa",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0",
  },
  hr: {
    borderColor: "#27272a",
    margin: "0",
  },
  statBox: {
    textAlign: "center" as const,
    padding: "16px",
    backgroundColor: "#09090b",
    borderRadius: "8px",
    margin: "0 4px",
  },
  statNumber: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "800",
    margin: "0",
    lineHeight: "1",
  },
  statLabel: {
    color: "#71717a",
    fontSize: "12px",
    margin: "4px 0 0",
  },
  highlightBox: {
    backgroundColor: "#09090b",
    borderRadius: "8px",
    padding: "12px 16px",
  },
  highlightLabel: {
    color: "#a1a1aa",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "0 0 4px",
  },
  highlightValue: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0",
  },
  materiaRow: {
    borderBottom: "1px solid #27272a",
    paddingBottom: "12px",
    marginBottom: "12px",
  },
  materiaNome: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0",
  },
  materiaDetalhe: {
    color: "#71717a",
    fontSize: "12px",
    margin: "2px 0 0",
  },
  materiaPercentual: {
    fontSize: "18px",
    fontWeight: "800",
    margin: "0",
  },
  vesperaItem: {
    color: "#fca5a5",
    fontSize: "14px",
    margin: "4px 0",
  },
  revisaoItem: {
    color: "#a1a1aa",
    fontSize: "14px",
    margin: "4px 0",
  },
  footer: {
    padding: "24px 40px",
    textAlign: "center" as const,
  },
  footerText: {
    color: "#52525b",
    fontSize: "12px",
    margin: "2px 0",
  },
};

export default WeeklySummary;
