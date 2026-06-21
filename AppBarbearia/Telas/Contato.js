import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  StatusBar,
} from 'react-native';

import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const COR_DOURADA = '#C9A84C';
const COR_FUNDO = '#0D0D0D';
const COR_CARTAO = '#181818';
const COR_BORDA = '#2e2e2e';
const COR_TEXTO_PRINCIPAL = '#EEEEEE';
const COR_TEXTO_MUDO = '#888888';

const itensContato = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '(48) 9 9999-9999',
    icon: 'whatsapp',
    iconLib: 'mci',
    iconColor: '#25D366',
    iconBg: '#1a2e1a',
    action: () => Linking.openURL('https://wa.me/5548999999999'),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@kingsbarber',
    icon: 'instagram',
    iconLib: 'mci',
    iconColor: '#E1306C',
    iconBg: '#2a1a22',
    action: () => Linking.openURL('https://instagram.com/kingsbarber'),
  },
  {
    id: 'phone',
    label: 'Telefone',
    value: '(48) 3333-4444',
    icon: 'phone',
    iconLib: 'feather',
    iconColor: '#4A9EE8',
    iconBg: '#1a2028',
    action: () => Linking.openURL('tel:+554833334444'),
  },
  {
    id: 'email',
    label: 'E-mail',
    value: 'contato@kingsbarber.com.br',
    icon: 'mail',
    iconLib: 'feather',
    iconColor: COR_DOURADA,
    iconBg: '#1e1e14',
    action: () => Linking.openURL('mailto:contato@kingsbarber.com.br'),
  },
  {
    id: 'address',
    label: 'Endereço',
    value: 'Kings Barber - Criciúma, SC',
    icon: 'map-pin',
    iconLib: 'feather',
    iconColor: '#6C8FE8',
    iconBg: '#1a1e2a',
    action: () =>
      Linking.openURL(
        'https://www.google.com/maps/search/?api=1&query=SATC+Criciúma'
      ),
  },
];

const horarios = [
  { dia: 'Segunda a sexta', horario: '09:00 – 17:00', fechado: false },
  { dia: 'Sábado', horario: '09:00 – 17:00', fechado: false },
  { dia: 'Domingo', horario: '09:00 – 17:00', fechado: false },
];

function IconeContato({ item }) {
  if (item.iconLib === 'mci') {
    return (
      <MaterialCommunityIcons
        name={item.icon}
        size={20}
        color={item.iconColor}
      />
    );
  }
  return <Feather name={item.icon} size={18} color={item.iconColor} />;
}

export default function Contato({navigation}) {
  return (
    <View style={estilos.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COR_FUNDO} />
      <ScrollView
        style={estilos.scroll}
        contentContainerStyle={estilos.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cabecalho}>
          <MaterialCommunityIcons name="crown" size={28} color={COR_DOURADA} />
          <Text style={estilos.nomeMarca}>KINGS</Text>
          <Text style={estilos.subMarca}>BARBER SHOP</Text>
        </View>

        <Text style={estilos.rotuloSecao}>Fale conosco</Text>

        <View style={estilos.cartao}>
          {itensContato.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                estilos.itemContato,
                index < itensContato.length - 1 && estilos.bordaItemContato,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View
                style={[
                  estilos.iconeContainer,
                  { backgroundColor: item.iconBg },
                ]}
              >
                <IconeContato item={item} />
              </View>

              <View style={estilos.textoItem}>
                <Text style={estilos.rotuloItem}>{item.label}</Text>
                <Text style={estilos.valorItem} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>

              <Feather name="chevron-right" size={16} color="#444" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[estilos.rotuloSecao, { marginTop: 20 }]}>Horário de funcionamento</Text>

        <View style={[estilos.cartao, estilos.cartaoHorario]}>
          <View style={estilos.cabecalhoHorario}>
            <Feather name="clock" size={15} color={COR_DOURADA} />
            <Text style={estilos.textoCabecalhoHorario}>Horários</Text>
            <View style={estilos.bolhaAberto}>
              <Text style={estilos.textoBolhaAberto}>ABERTO</Text>
            </View>
          </View>

          {horarios.map((linha, index) => (
            <View
              key={linha.dia}
              style={[
                estilos.linhaHorario,
                index < horarios.length - 1 && estilos.bordaLinhaHorario,
              ]}
            >
              <Text style={estilos.diaHorario}>{linha.dia}</Text>
              <Text style={linha.fechado ? estilos.horarioFechado : estilos.horarioAberto}>
                {linha.horario}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={estilos.botaoChamada}
          onPress={() => navigation?.navigate('Agendar')}
          activeOpacity={0.85}
        >
          <Feather name="calendar" size={20} color={COR_FUNDO} />
          <Text style={estilos.textoBotaoChamada}>Agendar horário</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation?.goBack()}>
          <Text style={estilos.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────
const estilos = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COR_FUNDO,
  },
  botaoVoltar: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(17, 17, 17, 0.88)',
    borderWidth: 1,
    borderColor: '#C9A86A',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  textoBotaoVoltar: {
    color: '#C9A86A',
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  cabecalho: {
    alignItems: 'center',
    paddingVertical: 28,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
    marginBottom: 24,
  },
  nomeMarca: {
    fontSize: 26,
    fontWeight: '500',
    color: '#fff',
    letterSpacing: 6,
    marginTop: 6,
  },
  subMarca: {
    fontSize: 11,
    color: COR_DOURADA,
    letterSpacing: 5,
    marginTop: 2,
  },

  rotuloSecao: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingLeft: 4,
  },

  cartao: {
    backgroundColor: COR_CARTAO,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: COR_BORDA,
    overflow: 'hidden',
  },

  itemContato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bordaItemContato: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  iconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoItem: {
    flex: 1,
  },
  rotuloItem: {
    fontSize: 12,
    color: COR_TEXTO_MUDO,
    marginBottom: 2,
  },
  valorItem: {
    fontSize: 15,
    color: COR_TEXTO_PRINCIPAL,
    fontWeight: '500',
  },

  cartaoHorario: {
    padding: 16,
  },
  cabecalhoHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  textoCabecalhoHorario: {
    fontSize: 13,
    color: COR_TEXTO_MUDO,
    letterSpacing: 1,
    flex: 1,
  },
  bolhaAberto: {
    backgroundColor: '#1a2e1a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoBolhaAberto: {
    fontSize: 9,
    color: '#25D366',
    fontWeight: '500',
    letterSpacing: 1,
  },
  linhaHorario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  bordaLinhaHorario: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  diaHorario: {
    fontSize: 13,
    color: '#aaa',
  },
  horarioAberto: {
    fontSize: 13,
    color: COR_TEXTO_PRINCIPAL,
    fontWeight: '500',
  },
  horarioFechado: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
  },

  botaoChamada: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COR_DOURADA,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 12,
  },
  textoBotaoChamada: {
    fontSize: 15,
    fontWeight: '500',
    color: COR_FUNDO,
    letterSpacing: 1,
  },
});