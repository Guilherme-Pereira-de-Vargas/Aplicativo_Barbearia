import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const cortes = [
  { id: 'd1', nome: 'Degradê Clássico', duracao: '40 min', categoria: 'Degradê', imagem: require('../Imagens/degrade_classico.jpeg') },
  { id: 'd2', nome: 'Degradê Moderno', duracao: '45 min', categoria: 'Degradê', imagem: require('../Imagens/degrade_moderno.jpeg') },
  { id: 'd3', nome: 'Degradê Baixo', duracao: '35 min', categoria: 'Degradê', imagem: require('../Imagens/degrade_baixo.jpeg') },
  { id: 'd4', nome: 'Degradê Alto', duracao: '50 min', categoria: 'Degradê', imagem: require('../Imagens/degrade_alto.jpeg') },

  { id: 'c1', nome: 'Clássico Simples', duracao: '40 min', categoria: 'Clássico', imagem: require('../Imagens/classico_simples.jpeg') },
  { id: 'c2', nome: 'Pompadour Clássico', duracao: '50 min', categoria: 'Clássico', imagem: require('../Imagens/pompadour_classico.jpeg') },
  { id: 'c3', nome: 'Undercut Clássico', duracao: '45 min', categoria: 'Clássico', imagem: require('../Imagens/undercut_classico.jpeg') },
  { id: 'c4', nome: 'Laterais Curtas', duracao: '30 min', categoria: 'Clássico', imagem: require('../Imagens/laterais_curtas.jpeg') },

  { id: 'curto1', nome: 'Buzz Cut', duracao: '25 min', categoria: 'Curto', imagem: require('../Imagens/buzz_cut.jpeg') },
  { id: 'curto2', nome: 'Corte Rápido', duracao: '20 min', categoria: 'Curto', imagem: require('../Imagens/corte_rapido.jpeg') },
  { id: 'curto3', nome: 'Texturizado Curto', duracao: '30 min', categoria: 'Curto', imagem: require('../Imagens/texturizado_curto.jpeg') },
  { id: 'curto4', nome: 'Cabelo Curto Masculino', duracao: '35 min', categoria: 'Curto', imagem: require('../Imagens/cabelo_curto.jpeg') },
];

const categorias = ['Todos', 'Degradê', 'Clássico', 'Curto', 'Moderno'];
const LARGURA_CARTAO = (width - 48) / 2;

export default function Catalogo({ navigation }) {
  const [categoria, setCategoria] = useState('Todos');
  const [selecionado, setSelecionado] = useState(null);

  const lista = categoria === 'Todos' ? cortes : cortes.filter((corte) => corte.categoria === categoria);

  return (
    <View style={s.container}>
      <Text style={s.titulo}>CATÁLOGO</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.scrollFiltro}
        contentContainerStyle={s.filtros}
      >
        {categorias.map((categoriaAtual) => (
          <TouchableOpacity
            key={categoriaAtual}
            style={[s.pill, categoria === categoriaAtual && s.pillAtivo]}
            onPress={() => setCategoria(categoriaAtual)}
          >
            <Text style={[s.pillTxt, categoria === categoriaAtual && s.pillTxtAtivo]}>
              {categoriaAtual}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={s.colunaWrapper}
        contentContainerStyle={s.listaConteudo}
        ListFooterComponent={
          <TouchableOpacity style={s.btnVoltar} onPress={() => navigation?.goBack()}>
            <Text style={s.txtBtnVoltar}>Voltar</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => setSelecionado(item)} activeOpacity={0.85}>
            <Image source={item.imagem} style={s.cardImg} resizeMode="cover" />
            <View style={s.cardOverlay} />
            <View style={s.cardInfo}>
              <Text style={s.cardNome}>{item.nome}</Text>
              <Text style={s.cardDuracao}>⏱ {item.duracao}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selecionado} transparent animationType="slide" onRequestClose={() => setSelecionado(null)}>
        <View style={s.modalFundo}>
          <View style={s.modalBox}>
            {selecionado && (
              <>
                <Image source={selecionado.imagem} style={s.modalImg} />
                <TouchableOpacity style={s.fechar} onPress={() => setSelecionado(null)}>
                  <Text style={s.fecharIcone}>✕</Text>
                </TouchableOpacity>
                <View style={s.modalConteudo}>
                <Text style={s.modalNome}>{selecionado.nome}</Text>
                <Text style={s.modalCat}>{selecionado.categoria}</Text>
                <View style={s.row}>
                  <Text style={s.modalInfo}>⏱ {selecionado.duracao}</Text>
                </View>
                <TouchableOpacity style={s.btnAgendar} onPress={() => { setSelecionado(null); navigation?.navigate('Agendar'); }}>
                  <Text style={s.btnTxt}>📅  AGENDAR</Text>
                </TouchableOpacity>
              </View>
            </>) }
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  btnVoltar: {
    alignSelf: 'center',
    backgroundColor: 'rgba(17, 17, 17, 0.88)',
    borderWidth: 1,
    borderColor: '#C9A86A',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 24,
  },
  txtBtnVoltar: {
    color: '#C9A86A',
    fontSize: 14,
    fontWeight: '700',
  },
  titulo: {
    color: '#C9A86A',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    paddingTop: 56,
    paddingBottom: 12,
  },
  filtros: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  listaConteudo: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  colunaWrapper: {
    justifyContent: 'space-between',
    marginTop: 12,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.4)',
    marginRight: 8,
  },
  pillAtivo: {
    backgroundColor: '#C9A86A',
  },
  pillTxt: {
    color: 'rgba(201,168,106,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  pillTxtAtivo: {
    color: '#111',
  },
  card: {
    width: LARGURA_CARTAO,
    height: LARGURA_CARTAO * 1.3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    marginBottom: 12,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignSelf: 'center',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
  },
  cardNome: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDuracao: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  cardPreco: {
    color: '#C9A86A',
    fontSize: 13,
    fontWeight: '800',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalImg: {
    width: '100%',
    height: 220,
  },
  fechar: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fecharIcone: {
    color: '#fff',
    fontSize: 18,
  },
  modalConteudo: {
    padding: 20,
  },
  modalNome: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalCat: {
    color: '#C9A86A',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalInfo: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  modalPreco: {
    color: '#C9A86A',
    fontSize: 20,
    fontWeight: '800',
  },
  btnAgendar: {
    backgroundColor: '#C9A86A',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
  },
  btnTxt: {
    color: '#111',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});