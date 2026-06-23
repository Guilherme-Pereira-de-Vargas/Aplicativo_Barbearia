import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { database } from '../firebaseConfig';

const SERVICOS = [
  { nome: 'Corte de Cabelo', preco: 45 },
  { nome: 'Barba', preco: 35 },
];

const FORMAS_PAGAMENTO = [
  { id: 'pix', icon: '⚡', label: 'Pix' },
  { id: 'cash', icon: '💵', label: 'Dinheiro' },
];

const VALOR_TOTAL = SERVICOS.reduce((total, servico) => total + servico.preco, 0);

export default function Pagamento({ navigation, route }) {
  const params = route?.params || {};
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  const servicosPassados = params.servicosSelecionados || params.servicos || SERVICOS;
  const barbeiro = params.barbeiro || null;
  const diaSel = params.diaSel || params.dia || null;
  const horario = params.horario || null;
  const valorTotalPassado = params.valorTotal || servicosPassados.reduce((t, s) => t + (s.preco || 0), 0);
  const usuarioInfo = params.usuarioInfo || {};

  const auth = getAuth();

  const salvarAgendamento = async (metodo, status) => {
    try {
      let dataHora = new Date();
      if (diaSel && horario) {
        const [hh, mm] = horario.split(':');
        dataHora = new Date(diaSel.date || diaSel);
        dataHora.setHours(Number(hh), Number(mm), 0, 0);
      }

      const nomeCliente = usuarioInfo.nome || auth.currentUser?.displayName || auth.currentUser?.email || 'Cliente';

      await addDoc(collection(database, 'teste'), {
        nomeCliente,
        servicos: servicosPassados,
        valorTotal: valorTotalPassado,
        barbeiroId: barbeiro?.id || null,
        barbeiroNome: barbeiro?.nome || '',
        barbeiroEmail: barbeiro?.email || '',
        horario: Timestamp.fromDate(dataHora),
        status: status,
        pagamentoMetodo: metodo,
        criadoEm: Timestamp.now(),
      });

      setPagamentoConfirmado(true);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível registrar o agendamento. Tente novamente.');
    }
  };


  const processarPagamentoAPI = async () => {
    if (params.demoMode) {
      Alert.alert('Pagamento simulado', 'Demonstração: pagamento confirmado com sucesso!');
      setTimeout(() => salvarAgendamento('pix', 'confirmado'), 1000);
      return;
    }

    const endpoint = params.apiEndpoint;
    if (!endpoint) {
      Alert.alert('Pagamento não confirmado', 'Não foi possível processar o pagamento. Tente novamente.');
      return;
    }

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: valorTotalPassado,
          currency: 'BRL',
          customer: { name: usuarioInfo.nome, email: usuarioInfo.email },
          description: `Agendamento ${diaSel?.sublabel || ''} ${horario || ''}`,
          services: servicosPassados,
        }),
      });

      const json = await resp.json();
      const ok = (json && (json.success || json.status === 'success'));
      if (ok) {
        salvarAgendamento('pix', 'confirmado');
      } else {
        Alert.alert('Pagamento não confirmado', 'Não foi possível confirmar o pagamento.');
      }
    } catch (e) {
      Alert.alert('Pagamento não confirmado', 'Não foi possível processar o pagamento. Verifique sua conexão e tente novamente.');
    }
  };

    return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>KINGS <Text style={s.gold}>BARBER</Text></Text>
      <View style={s.divider} />

      <View style={s.card}>
        <Text style={s.sectionLabel}>Resumo</Text>
        {servicosPassados.map((servico) => (
          <View key={servico.nome} style={s.row}>
            <Text style={s.serviceName}>{servico.nome}</Text>
            <Text style={s.gold}>R$ {servico.preco},00</Text>
          </View>
        ))}
        <View style={s.hr} />
        <View style={s.row}>
          <Text style={s.bold}>Total</Text>
          <Text style={[s.gold, s.totalValor]}>R$ {valorTotalPassado},00</Text>
        </View>
      </View>

   
      <Text style={[s.sectionLabel, s.sectionLabelMargemTopo]}>Forma de Pagamento</Text>
      <View style={s.methodGrid}>
        {FORMAS_PAGAMENTO.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[s.methodBtn, formaPagamento === item.id && s.methodBtnActive]}
            onPress={() => setFormaPagamento(item.id)}
          >
            <Text style={s.iconeMetodo}>{item.icon}</Text>
            <Text style={[s.methodText, formaPagamento === item.id && s.gold]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

     


    
      {formaPagamento === 'pix' ? (
        <View style={{ width: '100%' }}>
          <View style={[s.card, s.cardCentralizadoGap]}>
            <QRCode
              value={params.pixPayload || `PIX|chave:thecut@barbearia.com.br|valor:${valorTotalPassado}`}
              size={120}
            />
            <Text style={s.pixTexto}>thecut@barbearia.com.br</Text>
            <Text style={s.note}>Escaneie o QR Code no seu app bancário.</Text>
          </View>
        </View>
      ) : (
        <View />
      )}

      {formaPagamento === 'cash' && (
        <View style={[s.card, s.cardCentralizado]}>
          <Text style={s.iconeSucesso}>💵</Text>
          <Text style={s.note}>Pagamento realizado diretamente ao barbeiro.</Text>
        </View>
      )}
      {formaPagamento === 'pix' ? (
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={s.btn} onPress={processarPagamentoAPI}>
            <Text style={s.btnText}>Já Paguei</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, { marginTop: 12, backgroundColor: 'rgba(201,168,106,0.3)', borderWidth: 1, borderColor: '#C9A86A' }]} onPress={() => { Alert.alert('Modo Demonstração', 'Simulando pagamento confirmado...'); setTimeout(() => salvarAgendamento('pix', 'confirmado'), 800); }}>
            <Text style={[s.btnText, { color: '#C9A86A' }]}>Modo Demonstração</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.btn} onPress={() => salvarAgendamento('dinheiro', 'agendado')}>
          <Text style={s.btnText}>Confirmar Agendamento (Dinheiro)</Text>
        </TouchableOpacity>
      )}
      <Text style={s.note}>🔒 Pagamento seguro e criptografado</Text>
      <TouchableOpacity style={s.botaoVoltar} onPress={() => navigation?.goBack()}>
        <Text style={s.textoBotaoVoltar}>Voltar</Text>
      </TouchableOpacity>

      <Modal visible={pagamentoConfirmado} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.successCircle}>
            <Text style={s.iconeSucesso}>✓</Text>
          </View>
          <Text style={[s.title, s.titleModal]}>Pagamento Confirmado!</Text>
          <Text style={s.note}>Obrigado! Seu agendamento está garantido.</Text>
          <TouchableOpacity style={[s.btn, s.btnModalVoltar]} onPress={() => { setPagamentoConfirmado(false); navigation?.navigate('Agendar'); }}>
            <Text style={[s.btnText, s.btnTextModal]}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  botaoVoltar: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(17, 17, 17, 0.88)',
    borderWidth: 1,
    borderColor: '#C9A86A',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  textoBotaoVoltar: {
    color: '#C9A86A',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
  },
  titleModal: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  gold: {
    color: '#C9A86A',
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#C9A86A',
    marginVertical: 10,
    opacity: 0.5,
  },
  card: {
    width: '100%',
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.2)',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
  },
  cardCentralizado: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCentralizadoGap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  sectionLabel: {
    color: '#666',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    color: '#ccc',
    fontSize: 14,
  },
  bold: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  hr: {
    height: 1,
    backgroundColor: 'rgba(201,168,106,0.15)',
    marginVertical: 10,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginTop: 12,
  },
  methodBtn: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.2)',
    backgroundColor: '#111',
    alignItems: 'center',
    gap: 6,
  },
  methodBtnActive: {
    borderColor: '#C9A86A',
    backgroundColor: 'rgba(201,168,106,0.08)',
  },
  methodText: {
    color: '#888',
    fontSize: 12,
  },
  form: {
    width: '100%',
    marginTop: 16,
    gap: 6,
  },
  metadeCampoEsquerda: {
    flex: 1,
    marginRight: 8,
  },
  metadeCampoDireita: {
    flex: 1,
  },
  inputLabel: {
    color: '#555',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 13,
    color: '#fff',
    fontSize: 14,
  },
  qr: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrIcon: {
    fontSize: 52,
  },
  pixTexto: {
    color: '#C9A86A',
    fontSize: 12,
  },
  note: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
  },
  btn: {
    width: '100%',
    backgroundColor: '#C9A86A',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  btnTextModal: {
    color: '#C9A86A',
  },
  btnModalVoltar: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#C9A86A',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.93)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#C9A86A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});