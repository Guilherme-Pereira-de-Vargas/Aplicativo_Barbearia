import { StyleSheet, View, ImageBackground, Button } from 'react-native';
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

        <View style={styles.btn}>
          <Button title="Entrar" color="#C9A86A" />
        </View>

        <View style={styles.btn2}>
          <Button title="Cadastrar" color="#111" />
        </View>

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
    width: '90%',
    marginTop: 240,
  },

  btn2: {
    width: '90%',
    marginTop: 40,
  },
});