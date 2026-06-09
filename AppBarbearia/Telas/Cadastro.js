import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert, ScrollView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');

  const auth = getAuth();

  const cadastrar = () => {

    if (!nome.trim() || !email.trim() || !telefone.trim() || !senha.trim() || !confirma.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirma) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        // Signed up 
        console.log('Conta criada! ')
        const user = userCredential.user;
        console.log(user)
        // ...
      })
      .catch((error) => {
        console.log(error)
        Alert.alert(error.message)
        // ..
      });

    Alert.alert(
      'Cadastro realizado!',
      '',
      [
        {
          text: 'Entrar',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  }

  return (
    <ImageBackground
      source={require('../Imagens/hm1.jpg')}
      style={styles.fundo}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <ScrollView
        contentContainerStyle={styles.container}
      >
        <Text style={styles.marca}>✂️</Text>

        <Text style={styles.titulo}>KINGS BARBER</Text>

        <Text style={styles.subtitulo}>
          Crie sua conta
        </Text>

        <View style={styles.card}>
          <View style={styles.campo}>
            <Text style={styles.label}>NOME COMPLETO</Text>

            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#777"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>E-MAIL</Text>

            <TextInput
              style={styles.input}
              placeholder="Seu email"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>TELEFONE</Text>

            <TextInput
              style={styles.input}
              placeholder="Seu telefone"
              placeholderTextColor="#777"
              value={telefone}
              onChangeText={setTelefone}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>SENHA</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#777"
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>CONFIRMAR SENHA</Text>

            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              placeholderTextColor="#777"
              value={confirma}
              onChangeText={setConfirma}
            />
          </View>

          <TouchableOpacity
            style={styles.botao}
            onPress={() => cadastrar()}>
            <Text style={styles.botaoTexto}>
              CRIAR CONTA
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>
            Já tem conta?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.rodapeLink}>
              Entrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  marca: {
    fontSize: 40,
    marginBottom: 10,
  },
  titulo: {
    color: '#C9A86A',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitulo: {
    color: '#ccc',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
  },
  campo: {
    marginBottom: 15,
  },
  label: {
    color: '#C9A86A',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  botao: {
    backgroundColor: '#C9A86A',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rodape: {
    flexDirection: 'row',
    marginTop: 25,
  },
  rodapeTexto: {
    color: '#ccc',
    marginRight: 5,
  },
  rodapeLink: {
    color: '#C9A86A',
    fontWeight: 'bold',
  },
});