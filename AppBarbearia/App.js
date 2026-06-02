import { StyleSheet, View, ImageBackground, TouchableOpacity, Text } from 'react-native';
import Logo from './Componentes/logo';

export default function Inicial() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./Imagens/cadastro.png')}
        style={styles.fundo}
        resizeMode="cover"
      >
        <Logo />

        <TouchableOpacity style={[styles.btn, styles.btnEntrar]}>
          <Text style={styles.btnTextoEntrar}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnCadastrar]}>
          <Text style={styles.btnTextoCadastrar}>Cadastrar</Text>
        </TouchableOpacity>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fundo: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  btn: {
    width: '60%',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnEntrar: {
    backgroundColor: '#C9A86A',
    marginTop: 240,
  },

  btnCadastrar: {
    backgroundColor: '#111',
    marginTop: 20,
  },

  btnTextoEntrar: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  btnTextoCadastrar: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});