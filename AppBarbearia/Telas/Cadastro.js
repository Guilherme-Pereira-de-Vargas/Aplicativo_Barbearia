import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [senhaVis, setSenhaVis] = useState(false);

  const cadastrar = () => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !senha.trim() || !confirma.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirma) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    Alert.alert('✅ Cadastro realizado!', `Bem-vindo, ${nome}!`, [
      { text: 'Entrar', onPress: () => navigation?.navigate('Login') }
    ]);
  };

  const Campo = ({ label, value, onChange, placeholder, keyboard, secure, vis, setVis }) => (
    <View style={{ marginBottom: 18 }}>
      <Text style={s.inputLabel}>{label}</Text>
      <View style={s.inputRow}>
        <TextInput
          style={[s.input, secure && { flex: 1, marginBottom: 0 }]}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.2)"
          value={value}
          onChangeText={onChange}
          keyboardType={keyboard || 'default'}
          autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
          secureTextEntry={secure && !vis}
        />
        {secure && (
          <TouchableOpacity style={s.olho} onPress={() => setVis(!vis)}>
            <Text style={s.olhoTxt}>{vis ? '🤫' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('./Imagens/hm1.jpg')} style={s.fundo} resizeMode="cover">
      <View style={s.overlay} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.inner} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <Text style={s.marca}>✂️</Text>
          <Text style={s.titulo}>KINGS BARBER</Text>
          <Text style={s.sub}>Crie sua conta</Text>

          <View style={s.card}>
            <Campo label="NOME COMPLETO" value={nome} onChange={setNome} placeholder="Seu nome" />
            <Campo label="E-MAIL" value={email} onChange={setEmail} placeholder="seu@email.com" keyboard="email-address" />
            <Campo label="TELEFONE" value={telefone} onChange={setTelefone} placeholder="(48) 99999-9999" keyboard="phone-pad" />
            <Campo label="SENHA" value={senha} onChange={setSenha} placeholder="••••••••" secure vis={senhaVis} setVis={setSenhaVis} />
            <Campo label="CONFIRMAR SENHA" value={confirma} onChange={setConfirma} placeholder="••••••••" secure vis={senhaVis} setVis={setSenhaVis} />

            <TouchableOpacity style={s.btnCadastrar} onPress={cadastrar} activeOpacity={0.85}>
              <Text style={s.btnTxt}>CRIAR CONTA</Text>
            </TouchableOpacity>
          </View>

          <View style={s.rodape}>
            <Text style={s.rodapeTxt}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
              <Text style={s.rodapeLink}>Entrar</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.72)' },
  inner: { alignItems: 'center', justifyContent: 'center', padding: 24, paddingTop: 60, paddingBottom: 40 },
  marca: { fontSize: 40, marginBottom: 8 },
  titulo: { color: '#C9A86A', fontSize: 22, fontWeight: '800', letterSpacing: 5, marginBottom: 6 },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, letterSpacing: 1, marginBottom: 32 },
  card: { width: '100%', backgroundColor: 'rgba(20,20,20,0.85)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(201,168,106,0.15)', padding: 24 },
  inputLabel: { color: 'rgba(201,168,106,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { backgroundColor: '#111', borderWidth: 1, borderColor: 'rgba(201,168,106,0.2)', borderRadius: 10, color: '#fff', fontSize: 15, paddingHorizontal: 14, paddingVertical: 13, width: '100%' },
  olho: { position: 'absolute', right: 14, padding: 4 },
  olhoTxt: { fontSize: 16 },
  btnCadastrar: { backgroundColor: '#C9A86A', paddingVertical: 15, borderRadius: 50, alignItems: 'center', marginTop: 6 },
  btnTxt: { color: '#111', fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  rodape: { flexDirection: 'row', marginTop: 28 },
  rodapeTxt: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
  rodapeLink: { color: '#C9A86A', fontSize: 13, fontWeight: '700' },
});