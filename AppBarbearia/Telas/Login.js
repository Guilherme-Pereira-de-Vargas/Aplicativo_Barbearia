import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';

export default function Login({ navigation }) {
  const [mail, setMail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);

  const entrar = () => {
    if (!mail.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
  };

  return (
    <ImageBackground
      source={require('../Imagens/hm1.jpg')}
      style={s.fundo}
      resizeMode="cover"
    >
      <View style={s.sombra} />

      <View style={s.area}>
        <Text style={s.logo}>✂️</Text>

        <Text style={s.titulo}>
          KINGS BARBER
        </Text>

        <Text style={s.subTit}>
          Entre na sua conta
        </Text>

        <View style={s.box}>
          <Text style={s.lbl}>
            E-MAIL
          </Text>

          <TextInput
            style={s.campo}
            placeholder="seu@email.com"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={mail}
            onChangeText={setMail}
          />

          <Text style={s.lbl}>
            SENHA
          </Text>

          <View style={s.linha}>
            <TextInput
              style={s.campo}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!verSenha}
            />

            <TouchableOpacity
              style={s.btnOlho}
              onPress={() =>
                setVerSenha(!verSenha)
              }
            >
              <Text style={s.txtOlho}>
                {verSenha ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={s.btnEntrar}
            onPress={() => navigation?.navigate('goHome')}
          >
            <Text style={s.txtBtn}>ENTRAR</Text>
          </TouchableOpacity>
        </View>

        <View style={s.rodape}>
          <Text style={s.txtRodape}>
            Não tem conta?
          </Text>

          <TouchableOpacity
            onPress={() => navigation?.navigate('Cadastro')}>
            <Text style={s.linkRodape}>
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  fundo: {
    flex: 1,
  },

  sombra: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(0,0,0,0.72)',
  },

  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    fontSize: 40,
    marginBottom: 8,
  },

  titulo: {
    color: '#C9A86A',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 5,
    marginBottom: 6,
  },

  subTit: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 32,
  },

  box: {
    width: '100%',
    backgroundColor:
      'rgba(20,20,20,0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      'rgba(201,168,106,0.15)',
    padding: 24,
  },

  lbl: {
    color: 'rgba(201,168,106,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },

  campo: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.2)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 20,
    flex: 1,
    marginBottom: 0
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  btnOlho: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },

  txtOlho: {
    fontSize: 16,
  },

  btnEntrar: {
    backgroundColor: '#C9A86A',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },

  txtBtn: {
    color: '#111',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },

  rodape: {
    flexDirection: 'row',
    marginTop: 28,
  },

  txtRodape: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
  },

  linkRodape: {
    color: '#C9A86A',
    fontSize: 13,
    fontWeight: '700',
  },
});