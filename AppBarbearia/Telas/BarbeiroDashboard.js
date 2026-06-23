import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { database } from '../firebaseConfig';

const formatarData = (data) => {
  if (!data) return '';
  const d = data instanceof Timestamp ? data.toDate() : new Date(data);
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
};

const formatarHora = (data) => {
  if (!data) return '';
  const d = data instanceof Timestamp ? data.toDate() : new Date(data);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function BarbeiroDashboard({ route, navigation }) {
  const auth = getAuth();
  const usuarioAtual = auth.currentUser;
  const { barbeiroEmail } = route.params || {};
  const emailBarbeiro = barbeiroEmail || usuarioAtual?.email || '';
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [barbeiroNome, setBarbeiroNome] = useState('');

  useEffect(() => {
    if (!emailBarbeiro) {
      navigation?.reset({
        index: 0,
        routes: [{ name: 'BarbeiroLogin' }],
      });
      return;
    }

    setCarregando(true);

    const nome = emailBarbeiro
      .split('@')[0]
      .replace(/[0-9]/g, '')
      .replace(/[._-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    setBarbeiroNome(nome || 'Barbeiro');

    const unsubscribe = onSnapshot(
      collection(database, 'teste'),
      (snapshot) => {
        const lista = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .filter((item) => {
            const status = item.status || 'agendado';
            return item.barbeiroEmail === emailBarbeiro && status !== 'cancelado';
          });
        setAgendamentos(lista);
        setCarregando(false);
      },
      () => {
        setCarregando(false);
      }
    );

    return () => unsubscribe();
  }, [emailBarbeiro, navigation]);

  const cancelarAgendamento = async (agendamento) => {
    try {
      await updateDoc(doc(database, 'teste', agendamento.id), {
        status: 'cancelado',
      });
      Alert.alert('Sucesso', 'Horário cancelado.');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível cancelar o horário.');
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>OLÁ, {barbeiroNome.toUpperCase()}</Text>
      <Text style={estilos.subtitulo}>Seus horários agendados</Text>

      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation?.goBack()}>
        <Text style={estilos.textoVoltar}>Voltar</Text>
      </TouchableOpacity>

      {carregando ? (
        <View style={estilos.areaCarregando}>
          <ActivityIndicator color="#C9A86A" size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={estilos.lista}>
          {agendamentos.length === 0 ? (
            <View style={estilos.vazio}>
              <Text style={estilos.vazioTexto}>Nenhum horário marcado.</Text>
            </View>
          ) : (
            agendamentos.map((item) => (
              <View key={item.id} style={estilos.card}>
                <Text style={estilos.nomeCliente}>{item.nomeCliente || 'Cliente'}</Text>
                <Text style={estilos.info}>
                  {formatarData(item.horario)} • {formatarHora(item.horario)}
                </Text>
                <Text style={estilos.info}>
                  {item.servicos?.map((servico) => servico.nome).join(', ') || 'Serviço'}
                </Text>
                <Text style={estilos.info}>Total: R$ {item.valorTotal || 0}</Text>

                {item.status !== 'cancelado' && (
                  <TouchableOpacity
                    style={estilos.botaoCancelar}
                    onPress={() => cancelarAgendamento(item)}
                  >
                    <Text style={estilos.textoCancelar}>Cancelar horário</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 16,
    paddingTop: 54,
  },
  titulo: {
    color: '#C9A86A',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  botaoVoltar: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  textoVoltar: {
    color: '#C9A86A',
    fontSize: 14,
    fontWeight: '700',
  },
  areaCarregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    paddingBottom: 32,
  },
  vazio: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  vazioTexto: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.12)',
  },
  nomeCliente: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  info: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: 4,
  },
  botaoCancelar: {
    marginTop: 10,
    backgroundColor: '#3B1A1A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoCancelar: {
    color: '#F5A3A3',
    fontSize: 13,
    fontWeight: '700',
  },
});
