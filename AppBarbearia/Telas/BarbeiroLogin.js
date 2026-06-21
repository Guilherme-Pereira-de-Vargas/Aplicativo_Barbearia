import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const BARBEIROS_TESTE = [
  { email: 'lucas@teste.com', senha: '123456' },
  { email: 'rafael@teste.com', senha: '123456' },
  { email: 'mateus@teste.com', senha: '123456' },
  { email: 'bruno@teste.com', senha: '123456' },
  { email: 'pedro@teste.com', senha: '123456' },
];

export default function BarbeiroLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const auth = getAuth();

  const entrar = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    const emailNormalizado = email.trim().toLowerCase();
    const barbeiroTeste = BARBEIROS_TESTE.find(
      (item) => item.email === emailNormalizado && item.senha === senha
    );

    if (barbeiroTeste) {
      navigation.navigate('BarbeiroDashboard', {
        barbeiroEmail: barbeiroTeste.email,
      });
      return;
    }

    setCarregando(true);
    try {
      const credenciais = await signInWithEmailAndPassword(auth, emailNormalizado, senha);
      const usuario = credenciais.user;

      if (!usuario?.email) {
        throw new Error('Usuário inválido');
      }

      navigation.navigate('BarbeiroDashboard', {
        barbeiroEmail: usuario.email,
      });
    } catch (erro) {
      const mensagem =
        erro?.code === 'auth/invalid-email'
          ? 'O e-mail informado parece inválido.'
          : erro?.code === 'auth/user-not-found'
            ? 'Nenhuma conta encontrada com esse e-mail.'
            : erro?.code === 'auth/wrong-password'
              ? 'Senha incorreta.'
              : 'Não foi possível entrar como barbeiro agora.';

      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ImageBackground
      source={require('../Imagens/hm1.jpg')}
      style={estilos.fundo}
      imageStyle={estilos.imagem}
      resizeMode="cover"
    >
      <View style={estilos.sombra} />

      <View style={estilos.area}>
        <Text style={estilos.titulo}>ÁREA DO BARBEIRO</Text>
        <Text style={estilos.subtitulo}>Acesse sua agenda</Text>

        <View style={estilos.caixa}>
          <Text style={estilos.rotulo}>E-MAIL</Text>
          <TextInput
            style={estilos.campo}
            placeholder="barbeiro@exemplo.com"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={estilos.rotulo}>SENHA</Text>
          <View style={estilos.linhaSenha}>
            <TextInput
              style={estilos.campoSenha}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />
            <TouchableOpacity
              style={estilos.botaoOlho}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Text style={estilos.textoOlho}>{mostrarSenha ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={estilos.botaoEntrar} onPress={entrar} disabled={carregando}>
            <Text style={estilos.textoBotao}>{carregando ? 'ENTRANDO...' : 'ENTRAR'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation?.goBack()}>
          <Text style={estilos.textoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  sombra: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.76)',
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    color: '#C9A86A',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 24,
  },
  caixa: {
    width: '100%',
    backgroundColor: 'rgba(18,18,18,0.88)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.15)',
    padding: 24,
  },
  rotulo: {
    color: 'rgba(201,168,106,0.75)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  campo: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.18)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 18,
  },
  linhaSenha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  campoSenha: {
    flex: 1,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.18)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
    paddingRight: 45,
  },
  botaoOlho: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoOlho: {
    fontSize: 16,
  },
  botaoEntrar: {
    backgroundColor: '#C9A86A',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#111',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  botaoVoltar: {
    marginTop: 18,
  },
  textoVoltar: {
    color: '#C9A86A',
    fontSize: 14,
    fontWeight: '700',
  },
});
