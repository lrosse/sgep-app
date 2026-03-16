-- CreateIndex
CREATE INDEX "Materia_userId_idx" ON "Materia"("userId");

-- CreateIndex
CREATE INDEX "Materia_dataExame_idx" ON "Materia"("dataExame");

-- CreateIndex
CREATE INDEX "Meta_userId_idx" ON "Meta"("userId");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "Revisao_materiaId_idx" ON "Revisao"("materiaId");

-- CreateIndex
CREATE INDEX "Revisao_dataProgramada_idx" ON "Revisao"("dataProgramada");

-- CreateIndex
CREATE INDEX "Revisao_concluida_idx" ON "Revisao"("concluida");

-- CreateIndex
CREATE INDEX "Rotina_userId_idx" ON "Rotina"("userId");
