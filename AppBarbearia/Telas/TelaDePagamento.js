import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';

const SERVICES = [{ name: 'Corte de Cabelo', price: 45 }, { name: 'Barba', price: 35 }];
const METHODS = [{ id: 'card', icon: '💳', label: 'Cartão' }, { id: 'pix', icon: '⚡', label: 'Pix' }, { id: 'cash', icon: '💵', label: 'Dinheiro' }, { id: 'debit', icon: '🏧', label: 'Débito' }];
const TOTAL = SERVICES.reduce((s, i) => s + i.price, 0);

export default function Pagamento() {
  const [method, setMethod] = useState('card');
  const [success, setSuccess] = useState(false);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>KINGS <Text style={s.gold}>BARBER</Text></Text>
      <View style={s.divider} />

   
      <View style={s.card}>
        <Text style={s.sectionLabel}>Resumo</Text>
        {SERVICES.map(sv => (
          <View key={sv.name} style={s.row}>
            <Text style={s.serviceName}>{sv.name}</Text>
            <Text style={s.gold}>R$ {sv.price},00</Text>
          </View>
        ))}
        <View style={s.hr} />
        <View style={s.row}>
          <Text style={s.bold}>Total</Text>
          <Text style={[s.gold, { fontSize: 20 }]}>R$ {TOTAL},00</Text>
        </View>
      </View>

   
      <Text style={[s.sectionLabel, { marginTop: 20 }]}>Forma de Pagamento</Text>
      <View style={s.methodGrid}>
        {METHODS.map(m => (
          <TouchableOpacity key={m.id} style={[s.methodBtn, method === m.id && s.methodBtnActive]} onPress={() => setMethod(m.id)}>
            <Text style={{ fontSize: 22 }}>{m.icon}</Text>
            <Text style={[s.methodText, method === m.id && s.gold]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

     
      {(method === 'card' || method === 'debit') && (
        <View style={s.form}>
          <Text style={s.inputLabel}>Número do Cartão</Text>
          <TextInput style={s.input} placeholder="0000 0000 0000 0000" placeholderTextColor="#444" keyboardType="numeric" maxLength={19} />
          <Text style={s.inputLabel}>Nome no Cartão</Text>
          <TextInput style={s.input} placeholder="SEU NOME" placeholderTextColor="#444" />
          <View style={s.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={s.inputLabel}>Validade</Text>
              <TextInput style={s.input} placeholder="MM/AA" placeholderTextColor="#444" maxLength={5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.inputLabel}>CVV</Text>
              <TextInput style={s.input} placeholder="•••" placeholderTextColor="#444" secureTextEntry maxLength={4} />
            </View>
          </View>
        </View>
      )}

    
      {method === 'pix' && (
        <View style={[s.card, { alignItems: 'center', gap: 12 }]}>
          <View style={s.qr}><Text style={{ fontSize: 52 }}>⬛</Text></View>
          <Text style={[s.gold, { fontSize: 12 }]}>thecut@barbearia.com.br</Text>
          <Text style={s.note}>Escaneie o QR Code ou copie a chave Pix acima.</Text>
        </View>
      )}

     
      {method === 'cash' && (
        <View style={[s.card, { alignItems: 'center' }]}>
          <Text style={{ fontSize: 44 }}>💵</Text>
          <Text style={s.note}>Pagamento realizado diretamente ao barbeiro.</Text>
        </View>
      )}

      <TouchableOpacity style={s.btn} onPress={() => setSuccess(true)}>
        <Text style={s.btnText}>Confirmar Pagamento</Text>
      </TouchableOpacity>
      <Text style={s.note}>🔒 Pagamento seguro e criptografado</Text>

      
      <Modal visible={success} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.successCircle}><Text style={{ fontSize: 32, color: '#fff' }}>✓</Text></View>
          <Text style={[s.title, { marginTop: 16 }]}>Pagamento Confirmado!</Text>
          <Text style={s.note}>Obrigado! Seu agendamento está garantido.</Text>
          <TouchableOpacity style={[s.btn, { marginTop: 20, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#C9A86A' }]} onPress={() => setSuccess(false)}>
            <Text style={[s.btnText, { color: '#C9A86A' }]}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { alignItems: 'center', padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 20 },
  gold: { color: '#C9A86A' },
  divider: { width: 60, height: 1, backgroundColor: '#C9A86A', marginVertical: 10, opacity: 0.5 },
  card: { width: '100%', backgroundColor: '#161616', borderWidth: 1, borderColor: 'rgba(201,168,106,0.2)', borderRadius: 16, padding: 18, marginTop: 16 },
  sectionLabel: { color: '#666', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, alignSelf: 'flex-start' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  serviceName: { color: '#ccc', fontSize: 14 },
  bold: { color: '#fff', fontWeight: '700', fontSize: 13 },
  hr: { height: 1, backgroundColor: 'rgba(201,168,106,0.15)', marginVertical: 10 },
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%', marginTop: 12 },
  methodBtn: { flex: 1, minWidth: '45%', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(201,168,106,0.2)', backgroundColor: '#111', alignItems: 'center', gap: 6 },
  methodBtnActive: { borderColor: '#C9A86A', backgroundColor: 'rgba(201,168,106,0.08)' },
  methodText: { color: '#888', fontSize: 12 },
  form: { width: '100%', marginTop: 16, gap: 6 },
  inputLabel: { color: '#555', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#161616', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 13, color: '#fff', fontSize: 14 },
  qr: { width: 100, height: 100, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  note: { color: '#555', fontSize: 12, textAlign: 'center', lineHeight: 20, marginTop: 6 },
  btn: { width: '100%', backgroundColor: '#C9A86A', borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 28 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.93)', alignItems: 'center', justifyContent: 'center', padding: 30 },
  successCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#C9A86A', alignItems: 'center', justifyContent: 'center' },
});