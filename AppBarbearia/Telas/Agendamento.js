import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CELL = Math.floor((width - 60) / 7);

const servicos = ['Degradê Clássico', 'Skin Fade', 'Undercut', 'Pompadour', 'Buzz Cut', 'Texturizado'];
const horarios = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const buildCalendario = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const total = new Date(ano, mes + 1, 0).getDate();
  const offset = new Date(ano, mes, 1).getDay();
  const celulas = Array(offset).fill(null);
  for (let d = 1; d <= total; d++) celulas.push(d);
  while (celulas.length % 7 !== 0) celulas.push(null);
  const semanas = [];
  for (let i = 0; i < celulas.length; i += 7) semanas.push(celulas.slice(i, i + 7));
  return { semanas, hojeNum: hoje.getDate() };
};

export default function Agendar({ navigation }) {
  const [servico, setServico] = useState(null);
  const [diaSel, setDiaSel] = useState(null);
  const [horario, setHorario] = useState(null);
  const [nome, setNome] = useState('');
  const { semanas, hojeNum } = buildCalendario();
  const mesAtual = MESES[new Date().getMonth()];

  const confirmar = () => {
    if (!servico || !horario || !diaSel || !nome.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos para agendar.');
      return;
    }
    Alert.alert('✅ Agendado!', `${servico}\n${diaSel} de ${mesAtual} às ${horario}\nCliente: ${nome}`, [
      { text: 'OK', onPress: () => navigation?.navigate('Inicial') }
    ]);
  };

  return (
    <View style={s.container}>
      <Text style={s.titulo}>AGENDAR</Text>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        
        <Text style={s.label}>SEU NOME</Text>
        <TextInput
          style={s.input}
          placeholder="Digite seu nome..."
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={nome}
          onChangeText={setNome}
        />

       
        <Text style={s.label}>SERVIÇO</Text>
        <View style={s.grid}>
          {servicos.map(sv => (
            <TouchableOpacity key={sv} style={[s.chip, servico === sv && s.chipAtivo]} onPress={() => setServico(sv)}>
              <Text style={[s.chipTxt, servico === sv && s.chipTxtAtivo]}>{sv}</Text>
            </TouchableOpacity>
          ))}
        </View>

       
        <Text style={s.label}>DATA — {mesAtual.toUpperCase()}</Text>
        <View style={s.calendario}>
     
          <View style={s.calRow}>
            {SEMANA.map(d => (
              <View key={d} style={s.calCell}>
                <Text style={s.calHeader}>{d}</Text>
              </View>
            ))}
          </View>
      
          {semanas.map((semana, si) => (
            <View key={si} style={s.calRow}>
              {semana.map((dia, di) => {
                const passado = dia && dia < hojeNum;
                const ativo = dia === diaSel;
                const hoje = dia === hojeNum;
                return (
                  <TouchableOpacity
                    key={di}
                    style={s.calCell}
                    onPress={() => dia && !passado && setDiaSel(dia)}
                    activeOpacity={dia && !passado ? 0.7 : 1}
                  >
                    {dia ? (
                      <View style={[s.calDia, ativo && s.calDiaAtivo, hoje && !ativo && s.calDiaHoje]}>
                        <Text style={[s.calDiaTxt, passado && s.calDiaPassado, ativo && s.calDiaTxtAtivo, hoje && !ativo && s.calDiaTxtHoje]}>
                          {dia}
                        </Text>
                      </View>
                    ) : <View style={s.calCell} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

      
        <Text style={s.label}>HORÁRIO</Text>
        <View style={s.grid}>
          {horarios.map(h => (
            <TouchableOpacity key={h} style={[s.chip, horario === h && s.chipAtivo]} onPress={() => setHorario(h)}>
              <Text style={[s.chipTxt, horario === h && s.chipTxtAtivo]}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>

  
        {servico && horario && diaSel && nome.trim() ? (
          <View style={s.resumo}>
            <Text style={s.resumoTitulo}>RESUMO</Text>
            <Text style={s.resumoTxt}>✂️  {servico}</Text>
            <Text style={s.resumoTxt}>📅  {diaSel} de {mesAtual} às {horario}</Text>
            <Text style={s.resumoTxt}>👤  {nome}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={s.btnConfirmar} onPress={confirmar} activeOpacity={0.85}>
          <Text style={s.btnTxt}>CONFIRMAR AGENDAMENTO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Text style={s.btnVoltarTxt}>Voltar</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  titulo: { color: '#C9A86A', fontSize: 18, fontWeight: '800', letterSpacing: 4, textAlign: 'center', paddingTop: 56, paddingBottom: 20 },
  label: { color: 'rgba(201,168,106,0.7)', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 10, marginTop: 4 },
  input: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: 'rgba(201,168,106,0.2)', borderRadius: 12, color: '#fff', fontSize: 15, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(201,168,106,0.3)' },
  chipAtivo: { backgroundColor: '#C9A86A', borderColor: '#C9A86A' },
  chipTxt: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  chipTxtAtivo: { color: '#111', fontWeight: '700' },
  // Calendário
  calendario: { backgroundColor: '#1a1a1a', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(201,168,106,0.15)', padding: 10, marginBottom: 24 },
  calRow: { flexDirection: 'row' },
  calCell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center' },
  calHeader: { color: 'rgba(201,168,106,0.6)', fontSize: 10, fontWeight: '700' },
  calDia: { width: CELL - 6, height: CELL - 6, borderRadius: (CELL - 6) / 2, alignItems: 'center', justifyContent: 'center' },
  calDiaAtivo: { backgroundColor: '#C9A86A' },
  calDiaHoje: { borderWidth: 1, borderColor: '#C9A86A' },
  calDiaTxt: { color: '#fff', fontSize: 12, fontWeight: '500' },
  calDiaTxtAtivo: { color: '#111', fontWeight: '800' },
  calDiaTxtHoje: { color: '#C9A86A' },
  calDiaPassado: { color: 'rgba(255,255,255,0.2)' },
 
  resumo: { backgroundColor: '#1a1a1a', borderLeftWidth: 3, borderLeftColor: '#C9A86A', borderRadius: 10, padding: 16, marginBottom: 24 },
  resumoTitulo: { color: '#C9A86A', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 10 },
  resumoTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 6 },
  btnConfirmar: { backgroundColor: '#C9A86A', paddingVertical: 16, borderRadius: 50, alignItems: 'center', marginBottom: 12 },
  btnTxt: { color: '#111', fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
  btnVoltar: { alignItems: 'center', paddingVertical: 10 },
  btnVoltarTxt: { color: 'rgba(255,255,255,0.35)', fontSize: 14 },
});
