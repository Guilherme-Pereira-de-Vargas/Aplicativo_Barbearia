import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDoc,
  getDocs,
  doc,
  Timestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { database } from '../firebaseConfig';

const SERVICOS = [
  { nome: 'Corte', preco: 35 },
  { nome: 'Barba', preco: 25 },
  { nome: 'Sobrancelha', preco: 15 },
  { nome: 'Lavar cabelo', preco: 20 },
  { nome: 'Texturizado', preco: 60 },
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
    const carregarBarbeiros = async () => {
      try {
        const snapshot = await getDocs(collection(database, 'barbeiros'));
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBarbeiros(lista);
      } catch (e) {
        console.log(e);
      }
    };
    carregarBarbeiros();
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
      const horariosOcupados = snapshot.docs.map(d => {
        const data = d.data().horario.toDate();
        return `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
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
  }, [diaSel]);

  const confirmar = async () => {
    if (servicosSelecionados.length === 0 || !barbeiro || !diaSel || !horario) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de confirmar.');
      return;
    }

    setSalvando(true);
    try {
      const [hh, mm] = horario.split(':');
      const dataHora = new Date(diaSel.date);
      dataHora.setHours(Number(hh), Number(mm), 0, 0);

      await addDoc(collection(database, 'teste'), {
        nomeCliente: usuario?.displayName || usuario?.email,
        servicos: servicosSelecionados,
        valorTotal,
        id: barbeiro.id,
        nome: barbeiro.nome,
        unidade: barbeiro.unidade,
        horario: Timestamp.fromDate(dataHora),
      });

      Alert.alert(
        '✅ Agendado!',
        `${servicosSelecionados.length} serviço(s) - ${diaSel.sublabel} às ${horario}`
      );
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível agendar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.titulo}>AGENDAR</Text>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={s.label}>SERVIÇO</Text>
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

        {/* BARBEIROS */}
        <Text style={s.label}>BARBEIRO</Text>
        <View style={s.grid}>
          {barbeiros.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[s.chip, barbeiro?.id === b.id && s.chipAtivo]}
              onPress={() => setBarbeiro(b)}
            >
              <Text style={[s.chipTxt, barbeiro?.id === b.id && s.chipTxtAtivo]}>{b.nome}</Text>
              <Text style={[s.chipPreco, barbeiro?.id === b.id && s.chipTxtAtivo]}>{b.unidade}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DATA */}
        <Text style={s.label}>DATA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.diasRow}>
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

        {/* HORÁRIOS */}
        {diaSel && (
          <>
            <Text style={[s.label, { marginTop: 24 }]}>HORÁRIO</Text>
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

        {/* RESUMO */}
        {servicosSelecionados.length > 0 && diaSel && horario && barbeiro && (
          <View style={s.resumo}>
            <Text style={s.resumoTitulo}>RESUMO</Text>
            <Text style={s.resumoTxt}>💈 {barbeiro.nome}</Text>
            <Text style={s.resumoTxt}>🏪 {barbeiro.unidade}</Text>
            {servicosSelecionados.map(item => (
              <Text key={item.nome} style={s.resumoTxt}>✂️ {item.nome} - R$ {item.preco}</Text>
            ))}
            <Text style={s.resumoTxt}>📅 {diaSel.sublabel} às {horario}</Text>
            <Text style={s.resumoTxt}>💰 Total: R$ {valorTotal}</Text>
          </View>
        )}

        {/* BOTÕES */}
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
  scroll: { padding: 20, paddingBottom: 40 },
  titulo: {
    color: '#C9A86A', fontSize: 18, fontWeight: '800',
    letterSpacing: 2, textAlign: 'center', paddingTop: 56, paddingBottom: 20,
  },
  label: {
    color: 'rgba(201,168,106,0.7)', fontSize: 12,
    fontWeight: '700', marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 50, borderWidth: 1, borderColor: 'rgba(201,168,106,0.3)',
    alignItems: 'center',
  },
  chipAtivo: { backgroundColor: '#C9A86A', borderColor: '#C9A86A' },
  chipOcupado: { borderColor: 'rgba(255,255,255,0.1)', opacity: 0.4 },
  chipTxt: { color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  chipPreco: { color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 },
  chipTxtAtivo: { color: '#111', fontWeight: '700' },
  chipTxtOcupado: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
  diasRow: { marginBottom: 4 },
  diaCard: {
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(201,168,106,0.2)',
    marginRight: 10, backgroundColor: '#1A1A1A',
  },
  diaCardAtivo: { backgroundColor: '#C9A86A', borderColor: '#C9A86A' },
  diaNome: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700' },
  diaNum: { color: '#FFF', fontSize: 13, fontWeight: '600', marginTop: 2 },
  diaAtivoTxt: { color: '#111' },
  resumo: {
    backgroundColor: '#1A1A1A', borderLeftWidth: 3,
    borderLeftColor: '#C9A86A', borderRadius: 10, padding: 16, marginVertical: 20,
  },
  resumoTitulo: { color: '#C9A86A', fontSize: 12, fontWeight: '700', marginBottom: 10 },
  resumoTxt: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 6 },
  btnConfirmar: {
    backgroundColor: '#C9A86A', paddingVertical: 16,
    borderRadius: 50, alignItems: 'center', marginBottom: 12, marginTop: 4,
  },
  btnTxt: { color: '#111', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  btnVoltar: { alignItems: 'center', paddingVertical: 10 },
  btnVoltarTxt: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
});