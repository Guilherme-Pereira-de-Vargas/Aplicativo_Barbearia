import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, getDoc, doc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { database } from '../firebaseConfig';

const SERVICOS = [
  { nome: 'Corte', preco: 35 },
  { nome: 'Barba', preco: 25 },
  { nome: 'Sobrancelha', preco: 15 },
  { nome: 'Lavar cabelo', preco: 20 },
  { nome: 'Texturizado', preco: 60 },
];

const BARBEIROS_FIXOS = [
  { id: 1, nome: 'Lucas Mendes', email: 'lucas@barbeiro.com' },
  { id: 2, nome: 'Rafael Costa', email: 'rafael@barbeiro.com' },
  { id: 3, nome: 'Mateus Silva', email: 'mateus@barbeiro.com' },
  { id: 4, nome: 'Bruno Alves', email: 'bruno@barbeiro.com' },
  { id: 5, nome: 'Pedro Rocha', email: 'pedro@barbeiro.com' },
];

const gerarProximos7Dias = () => {
  const dias = [];
  const semana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  for (let i = 0; i < 7; i++) {
    const data = new Date();
    data.setDate(data.getDate() + i);
    dias.push({
      label: i === 0 ? 'Hoje' : semana[data.getDay()],
      sublabel: `${data.getDate()} ${meses[data.getMonth()]}`,
      date: data,
    });
  }
  return dias;
};

export default function Agendar({ navigation }) {
  const usuario = getAuth().currentUser;
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [barbeiro, setBarbeiro] = useState(null);
  const [diaSel, setDiaSel] = useState(null);
  const [horario, setHorario] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [debugMensagem, setDebugMensagem] = useState('');

  const toggleServico = (sv) => {
    const existe = servicosSelecionados.some(item => item.nome === sv.nome);
    if (existe) {
      setServicosSelecionados(servicosSelecionados.filter(item => item.nome !== sv.nome));
    } else {
      setServicosSelecionados([...servicosSelecionados, sv]);
    }
  };

  const valorTotal = servicosSelecionados.reduce((acc, item) => acc + item.preco, 0);

  useEffect(() => {
    setBarbeiros(BARBEIROS_FIXOS);
    setDebugMensagem('');
  }, []);

  const dias = gerarProximos7Dias();

  useEffect(() => {
    if (!diaSel) return;

    setCarregando(true);
    setHorario(null);

    const inicio = new Date(diaSel.date);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(diaSel.date);
    fim.setHours(23, 59, 59, 999);

    const q = query(
      collection(database, 'teste'),
      where('horario', '>=', Timestamp.fromDate(inicio)),
      where('horario', '<=', Timestamp.fromDate(fim))
    );

    const unsub = onSnapshot(q, async snapshot => {
      const agendamentosAtivos = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item => {
          const status = item.status || 'agendado';
          const mesmoBarbeiro = !barbeiro || item.barbeiroId === barbeiro.id;
          return status !== 'cancelado' && mesmoBarbeiro;
        });

      const horariosOcupados = agendamentosAtivos.map(item => {
        const horarioData = item.horario?.toDate ? item.horario.toDate() : new Date(item.horario);
        return `${String(horarioData.getHours()).padStart(2, '0')}:${String(horarioData.getMinutes()).padStart(2, '0')}`;
      });

      try {
        const docSnap = await getDoc(doc(database, 'configuracoes', 'horarios'));
        const todos = docSnap.exists()
          ? docSnap.data().lista
          : ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

        setHorariosDisponiveis(
          todos.map(h => ({ hora: h, ocupado: horariosOcupados.includes(h) }))
        );
      } catch {
        setHorariosDisponiveis(
          ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
            .map(h => ({ hora: h, ocupado: horariosOcupados.includes(h) }))
        );
      } finally {
        setCarregando(false);
      }
    });

    return () => unsub();
  }, [diaSel, barbeiro]);

  const confirmar = async () => {
    if (servicosSelecionados.length === 0 || !barbeiro || !diaSel || !horario) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de confirmar.');
      return;
    }

    navigation?.navigate('Pagamento', {
      servicosSelecionados,
      barbeiro,
      diaSel,
      horario,
      valorTotal,
      usuarioInfo: { nome: usuario?.displayName, email: usuario?.email },
    });
  };

  return (
    <View style={s.container}>
      <Text style={s.titulo}>AGENDAR</Text>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        style={s.scrollView}
      >
        <Text style={s.label}>SERVIÇO</Text>
        <View style={s.sectionWrapper}>
          <View style={s.grid}>
            {SERVICOS.map(sv => {
              const ativo = servicosSelecionados.some(item => item.nome === sv.nome);
              return (
                <TouchableOpacity
                  key={sv.nome}
                  style={[s.chip, ativo && s.chipAtivo]}
                  onPress={() => toggleServico(sv)}
                >
                  <Text style={[s.chipTxt, ativo && s.chipTxtAtivo]}>{sv.nome}</Text>
                  <Text style={[s.chipPreco, ativo && s.chipTxtAtivo]}>R$ {sv.preco}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={s.label}>BARBEIRO</Text>
        <View style={s.sectionWrapper}>
          {debugMensagem ? (
            <Text style={s.debugText}>{debugMensagem}</Text>
          ) : null}
          {barbeiros.length === 0 ? (
            <Text style={s.emptyText}>Nenhum barbeiro cadastrado ainda.</Text>
          ) : (
            <View style={s.grid}>
              {barbeiros.map((barbeiroAtual) => (
                <TouchableOpacity
                  key={barbeiroAtual.id}
                  style={[s.chip, barbeiro?.id === barbeiroAtual.id && s.chipAtivo]}
                  onPress={() => setBarbeiro(barbeiroAtual)}
                >
                  <Text style={[s.chipTxt, barbeiro?.id === barbeiroAtual.id && s.chipTxtAtivo]}>
                    {barbeiroAtual.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={s.label}>DATA</Text>
        <View style={s.diasWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.diasContainer}
            style={s.diasRow}
            centerContent={true}
          >
            {dias.map((dia, i) => (
              <TouchableOpacity
                key={i}
                style={[s.diaCard, diaSel?.sublabel === dia.sublabel && s.diaCardAtivo]}
                onPress={() => setDiaSel(dia)}
              >
                <Text style={[s.diaNome, diaSel?.sublabel === dia.sublabel && s.diaAtivoTxt]}>
                  {dia.label}
                </Text>
                <Text style={[s.diaNum, diaSel?.sublabel === dia.sublabel && s.diaAtivoTxt]}>
                  {dia.sublabel}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {diaSel && (
          <>
            <Text style={[s.label, { marginTop: 18 }]}>HORÁRIO</Text>
            {carregando ? (
              <ActivityIndicator color="#C9A86A" />
            ) : (
              <View style={s.grid}>
                {horariosDisponiveis.map(({ hora, ocupado }) => (
                  <TouchableOpacity
                    key={hora}
                    style={[s.chip, horario === hora && s.chipAtivo, ocupado && s.chipOcupado]}
                    onPress={() => !ocupado && setHorario(hora)}
                    disabled={ocupado}
                  >
                    <Text style={[s.chipTxt, horario === hora && s.chipTxtAtivo, ocupado && s.chipTxtOcupado]}>
                      {hora}
                    </Text>
                    {ocupado && <Text style={s.chipTxtOcupado}>Ocupado</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {servicosSelecionados.length > 0 && diaSel && horario && barbeiro && (
          <View style={s.resumo}>
            <Text style={s.resumoTitulo}>RESUMO</Text>
            <Text style={s.resumoTxt}>💈 {barbeiro.nome}</Text>
            {servicosSelecionados.map(item => (
              <Text key={item.nome} style={s.resumoTxt}>✂️ {item.nome} - R$ {item.preco}</Text>
            ))}
            <Text style={s.resumoTxt}>📅 {diaSel.sublabel} às {horario}</Text>
            <Text style={s.resumoTxt}>💰 Total: R$ {valorTotal}</Text>
          </View>
        )}

        <TouchableOpacity style={s.btnConfirmar} onPress={confirmar} disabled={salvando}>
          {salvando
            ? <ActivityIndicator color="#111" />
            : <Text style={s.btnTxt}>CONFIRMAR AGENDAMENTO</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation?.goBack()}>
          <Text style={s.btnVoltarTxt}>Voltar</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  scrollView: { flex: 1, width: '100%' },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 36,
    width: '100%',
    minHeight: '100%',
    alignItems: 'stretch',
  },
  titulo: {
    color: '#C9A86A', fontSize: 18, fontWeight: '800',
    letterSpacing: 2, textAlign: 'center', paddingTop: 44, paddingBottom: 16,
  },
  label: {
    color: 'rgba(201,168,106,0.7)',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    gap: 10,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.3)',
    alignItems: 'center',
    minWidth: 90,
  },
  chipAtivo: { backgroundColor: '#C9A86A', borderColor: '#C9A86A' },
  chipOcupado: { borderColor: 'rgba(255,255,255,0.1)', opacity: 0.4 },
  chipTxt: { color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  chipPreco: { color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 },
  chipTxtAtivo: { color: '#111', fontWeight: '700' },
  chipTxtOcupado: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
  diasWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  diasRow: {
    width: '100%',
    marginBottom: 0,
    alignSelf: 'center',
  },
  diasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  diaCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    minHeight: 68,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.2)',
    marginRight: 10,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
  },
  diaCardAtivo: { backgroundColor: '#C9A86A', borderColor: '#C9A86A' },
  diaNome: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700' },
  diaNum: { color: '#FFF', fontSize: 13, fontWeight: '600', marginTop: 2 },
  diaAtivoTxt: { color: '#111' },
  resumo: {
    backgroundColor: '#1A1A1A',
    borderLeftWidth: 3,
    borderLeftColor: '#C9A86A',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
    width: '100%',
  },
  resumoTitulo: { color: '#C9A86A', fontSize: 12, fontWeight: '700', marginBottom: 10 },
  resumoTxt: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 6 },
  btnConfirmar: {
    backgroundColor: '#C9A86A',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
    width: '100%',
  },
  btnTxt: { color: '#111', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  btnVoltar: {
    alignSelf: 'center',
    backgroundColor: 'rgba(17, 17, 17, 0.88)',
    borderWidth: 1,
    borderColor: '#C9A86A',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 6,
  },
  btnVoltarTxt: { color: '#C9A86A', fontSize: 14, fontWeight: '700' },
});