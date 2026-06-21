import { Alert, StyleSheet, View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import Logo from '../Componentes/logo';

export default function Home({ navigation }) {
  const auth = getAuth();

  const sair = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inicial' }],
      });
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  return (
    <View style={estilos.container}>
      <ImageBackground
        source={require('../Imagens/hm1.jpg')}
        style={estilos.fundo}
        imageStyle={estilos.imagem}
        resizeMode="cover"
      >
        <View style={estilos.overlay} />

        <Logo />
        <Text style={estilos.frase}>✂️ Estilo que fala por você 💈</Text>

        <TouchableOpacity
          style={[estilos.botao, estilos.botaoDourado]}
          onPress={() => navigation?.navigate('Agendar')}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoBotaoEscuro}>📅  Agendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botao, estilos.botaoDourado]}
          onPress={() => navigation?.navigate('Catalogo')}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoBotaoEscuro}>📖  Catálogo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botao, estilos.botaoEscuro]}
          onPress={() => navigation?.navigate('Contato')}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoBotaoDourado}>📞  Contato</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botao, estilos.botaoSair]}
          onPress={sair}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  fundo: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  frase: {
    color: '#C9A86A',
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 50,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  botao: {
    width: '80%',
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  botaoDourado: {
    backgroundColor: '#C9A86A',
  },
  botaoEscuro: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#C9A86A',
  },
  botaoSair: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#C9A86A',
  },
  textoBotaoEscuro: {
    color: '#111',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  textoBotaoDourado: {
    color: '#C9A86A',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  textoBotaoSair: {
    color: '#C9A86A',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
