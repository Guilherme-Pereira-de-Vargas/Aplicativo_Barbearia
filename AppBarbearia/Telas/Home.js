import { StyleSheet, View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import Logo from '../Componentes/logo';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../Imagens/hm1.jpg')}
        style={styles.fundo}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <Logo />

        <Text style={styles.slogan}>✂️ Estilo que fala por você 💈</Text>

        <TouchableOpacity
          style={[styles.btn, styles.btnDourado]}
          onPress={() => navigation?.navigate('Agendar')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnTextoEscuro}>📅  Agendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnDourado]}
          onPress={() => navigation?.navigate('Catalogo')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnTextoEscuro}>📖  Catálogo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnEscuro]}
          onPress={() => navigation?.navigate('Contato')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnTextoDourado}>📞  Contato</Text>
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
    justifyContent: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },

  slogan: {
    color: '#C9A86A',
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 50,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  btn: {
    width: '80%',
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },

  btnDourado: {
    backgroundColor: '#C9A86A',
  },

  btnEscuro: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#C9A86A',
  },

  btnTextoEscuro: {
    color: '#111',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  btnTextoDourado: {
    color: '#C9A86A',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
