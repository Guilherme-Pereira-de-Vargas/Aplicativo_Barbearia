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

const GOLD = '#C9A84C';
const BG = '#0D0D0D';
const CARD_BG = '#181818';
const BORDER = '#2e2e2e';
const TEXT_PRIMARY = '#EEEEEE';
const TEXT_MUTED = '#888888';

const CONTACT_ITEMS = [
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
    iconColor: GOLD,
    iconBg: '#1e1e14',
    action: () => Linking.openURL('mailto:contato@kingsbarber.com.br'),
  },
  {
    id: 'address',
    label: 'Endereço',
    value: 'Rua das Coroas, 42 — Centro',
    icon: 'map-pin',
    iconLib: 'feather',
    iconColor: '#6C8FE8',
    iconBg: '#1a1e2a',
    action: () =>
      Linking.openURL(
        'https://maps.google.com/?q=Rua+das+Coroas+42'
      ),
  },
];

const HOURS = [
  { day: 'Segunda — Sexta', time: '09:00 – 20:00', closed: false },
  { day: 'Sábado', time: '09:00 – 18:00', closed: false },
  { day: 'Domingo', time: 'Fechado', closed: true },
];

function ContactIcon({ item }) {
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
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="crown" size={28} color={GOLD} />
          <Text style={styles.brandName}>KINGS</Text>
          <Text style={styles.brandSub}>BARBER SHOP</Text>
        </View>

        <Text style={styles.sectionLabel}>Fale conosco</Text>

        <View style={styles.card}>
          {CONTACT_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.contactItem,
                index < CONTACT_ITEMS.length - 1 && styles.contactItemBorder,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: item.iconBg },
                ]}
              >
                <ContactIcon item={item} />
              </View>

              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemValue} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>

              <Feather name="chevron-right" size={16} color="#444" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
          Horário de funcionamento
        </Text>

        <View style={[styles.card, styles.hoursCard]}>
          <View style={styles.hoursHeader}>
            <Feather name="clock" size={15} color={GOLD} />
            <Text style={styles.hoursHeaderText}>Horários</Text>
            <View style={styles.openBadge}>
              <Text style={styles.openBadgeText}>ABERTO</Text>
            </View>
          </View>

          {HOURS.map((row, index) => (
            <View
              key={row.day}
              style={[
                styles.hoursRow,
                index < HOURS.length - 1 && styles.hoursRowBorder,
              ]}
            >
              <Text style={styles.hoursDay}>{row.day}</Text>
              <Text
                style={row.closed ? styles.hoursClosed : styles.hoursTime}
              >
                {row.time}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation?.navigate('Agendar')}
          activeOpacity={0.85}
        >
          <Feather name="calendar" size={20} color={BG} />
          <Text style={styles.ctaText}>Agendar horário</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: 28,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
    marginBottom: 24,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '500',
    color: '#fff',
    letterSpacing: 6,
    marginTop: 6,
  },
  brandSub: {
    fontSize: 11,
    color: GOLD,
    letterSpacing: 5,
    marginTop: 2,
  },

  // Labels de seção
  sectionLabel: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingLeft: 4,
  },

  // Card genérico
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: BORDER,
    overflow: 'hidden',
  },

  // Items de contato
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  contactItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    fontWeight: '500',
  },

  // Horários
  hoursCard: {
    padding: 16,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  hoursHeaderText: {
    fontSize: 13,
    color: TEXT_MUTED,
    letterSpacing: 1,
    flex: 1,
  },
  openBadge: {
    backgroundColor: '#1a2e1a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  openBadgeText: {
    fontSize: 9,
    color: '#25D366',
    fontWeight: '500',
    letterSpacing: 1,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  hoursRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  hoursDay: {
    fontSize: 13,
    color: '#aaa',
  },
  hoursTime: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    fontWeight: '500',
  },
  hoursClosed: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
  },

  // Botão CTA
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: GOLD,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 12,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '500',
    color: BG,
    letterSpacing: 1,
  },
});