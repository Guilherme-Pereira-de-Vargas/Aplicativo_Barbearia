import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert, KeyboardAvoidingView, Platform } from 'react-native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVis, setSenhaVis] = useState(false);

  const entrar = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    navigation?.navigate('Inicial');
  };

  return (
    <ImageBackground source={require('./Imagens/hm1.jpg')} style={s.fundo} resizeMode="cover">
      <View style={s.overlay} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.inner}>

        {/* Logo / Título */}
        <Text style={s.marca}>✂️</Text>
        <Text style={s.titulo}>KINGS BARBER</Text>
        <Text style={s.sub}>Entre na sua conta</Text>

        {/* Card */}
        <View style={s.card}>
          <Text style={s.inputLabel}>E-MAIL</Text>
          <TextInput
            style={s.input}
            placeholder="seu@email.com"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={s.inputLabel}>SENHA</Text>
          <View style={s.inputRow}>
            <TextInput
              style={[s.input, { flex: 1, marginBottom: 0 }]}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!senhaVis}
            />
            <TouchableOpacity style={s.olho} onPress={() => setSenhaVis(!senhaVis)}>
              <Text style={s.olhoTxt}>{senhaVis ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.esqueciBtn}>
            <Text style={s.esqueciTxt}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.btnEntrar} onPress={entrar} activeOpacity={0.85}>
            <Text style={s.btnTxt}>ENTRAR</Text>
          </TouchableOpacity>
        </View>

        {/* Cadastro */}
        <View style={s.rodape}>
          <Text style={s.rodapeTxt}>Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Cadastro')}>
            <Text style={s.rodapeLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.72)' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  marca: { fontSize: 40, marginBottom: 8 },
  titulo: { color: '#C9A86A', fontSize: 22, fontWeight: '800', letterSpacing: 5, marginBottom: 6 },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, letterSpacing: 1, marginBottom: 32 },
  card: { width: '100%', backgroundColor: 'rgba(20,20,20,0.85)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(201,168,106,0.15)', padding: 24 },
  inputLabel: { color: 'rgba(201,168,106,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  input: { backgroundColor: '#111', borderWidth: 1, borderColor: 'rgba(201,168,106,0.2)', borderRadius: 10, color: '#fff', fontSize: 15, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  olho: { position: 'absolute', right: 14, padding: 4 },
  olhoTxt: { fontSize: 16 },
  esqueciBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  esqueciTxt: { color: 'rgba(201,168,106,0.5)', fontSize: 12 },
  btnEntrar: { backgroundColor: '#C9A86A', paddingVertical: 15, borderRadius: 50, alignItems: 'center' },
  btnTxt: { color: '#111', fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  rodape: { flexDirection: 'row', marginTop: 28 },
  rodapeTxt: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
  rodapeLink: { color: '#C9A86A', fontSize: 13, fontWeight: '700' },
});