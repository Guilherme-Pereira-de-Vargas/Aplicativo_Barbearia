import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const cortes = [
  { id: '1', nome: 'Degradê Clássico', preco: 'R$ 45', duracao: '40 min', categoria: 'Degradê', imagem: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80' },
  { id: '2', nome: 'Skin Fade', preco: 'R$ 55', duracao: '50 min', categoria: 'Degradê', imagem: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80' },
  { id: '3', nome: 'Undercut', preco: 'R$ 50', duracao: '45 min', categoria: 'Clássico', imagem: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
  { id: '4', nome: 'Pompadour', preco: 'R$ 60', duracao: '55 min', categoria: 'Clássico', imagem: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80' },
  { id: '5', nome: 'Buzz Cut', preco: 'R$ 35', duracao: '25 min', categoria: 'Curto', imagem: 'https://images.unsplash.com/photo-1520580007807-bc350d1d0f36?w=400&q=80' },
  { id: '6', nome: 'Texturizado', preco: 'R$ 50', duracao: '45 min', categoria: 'Moderno', imagem: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80' },
];

const categorias = ['Todos', 'Degradê', 'Clássico', 'Curto', 'Moderno'];
const CARD = (width - 48) / 2;

export default function Catalogo({ navigation }) {
  const [categoria, setCategoria] = useState('Todos');
  const [selecionado, setSelecionado] = useState(null);

  const lista = categoria === 'Todos' ? cortes : cortes.filter(c => c.categoria === categoria);

  return (
    <View style={s.container}>
      <Text style={s.titulo}>CATÁLOGO</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50 }} contentContainerStyle={s.filtros}>
        {categorias.map(cat => (
          <TouchableOpacity key={cat} style={[s.pill, categoria === cat && s.pillAtivo]} onPress={() => setCategoria(cat)}>
            <Text style={[s.pillTxt, categoria === cat && s.pillTxtAtivo]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={lista}
        keyExtractor={i => i.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => setSelecionado(item)} activeOpacity={0.85}>
            <Image source={{ uri: item.imagem }} style={s.cardImg} />
            <View style={s.cardOverlay} />
            <View style={s.cardInfo}>
              <Text style={s.cardNome}>{item.nome}</Text>
              <Text style={s.cardPreco}>{item.preco}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selecionado} transparent animationType="slide" onRequestClose={() => setSelecionado(null)}>
        <View style={s.modalFundo}>
          <View style={s.modalBox}>
            {selecionado && <>
              <Image source={{ uri: selecionado.imagem }} style={s.modalImg} />
              <TouchableOpacity style={s.fechar} onPress={() => setSelecionado(null)}>
                <Text style={{ color: '#fff', fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
              <View style={{ padding: 20 }}>
                <Text style={s.modalNome}>{selecionado.nome}</Text>
                <Text style={s.modalCat}>{selecionado.categoria}</Text>
                <View style={s.row}>
                  <Text style={s.modalInfo}>⏱ {selecionado.duracao}</Text>
                  <Text style={s.modalPreco}>{selecionado.preco}</Text>
                </View>
                <TouchableOpacity style={s.btnAgendar} onPress={() => { setSelecionado(null); navigation?.navigate('Agendar'); }}>
                  <Text style={s.btnTxt}>📅  AGENDAR</Text>
                </TouchableOpacity>
              </View>
            </>}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  titulo: { color: '#C9A86A', fontSize: 18, fontWeight: '800', letterSpacing: 4, textAlign: 'center', paddingTop: 56, paddingBottom: 12 },
  filtros: { paddingHorizontal: 16, alignItems: 'center', gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(201,168,106,0.4)', marginRight: 8 },
  pillAtivo: { backgroundColor: '#C9A86A' },
  pillTxt: { color: 'rgba(201,168,106,0.7)', fontSize: 13, fontWeight: '600' },
  pillTxtAtivo: { color: '#111' },
  card: { width: CARD, height: CARD * 1.3, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1a1a1a' },
  cardImg: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  cardInfo: { position: 'absolute', bottom: 0, padding: 10 },
  cardNome: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  cardPreco: { color: '#C9A86A', fontSize: 13, fontWeight: '800' },
  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#141414', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  modalImg: { width: '100%', height: 220 },
  fechar: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  modalNome: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  modalCat: { color: '#C9A86A', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalInfo: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  modalPreco: { color: '#C9A86A', fontSize: 20, fontWeight: '800' },
  btnAgendar: { backgroundColor: '#C9A86A', paddingVertical: 14, borderRadius: 50, alignItems: 'center' },
  btnTxt: { color: '#111', fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
});