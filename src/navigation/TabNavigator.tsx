import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Home,
  Headphones,
  User,
  ShoppingCart,
  Package,
  Truck,
  ShoppingBag,
  Search,
} from 'lucide-react-native';
import { TabParamList, RootStackParamList } from './Types';
import { useCartStore } from '../store/useCartStore';

import { Typography } from '../components/Typography';
import { Colors, Spacing, Shadows } from '../constants/Theme';

import HomeScreen from '../screens/Main/HomeScreen';
import HelpSupportScreen from '../screens/Support/HelpSupportScreen';
import ProfileScreen from '../screens/Account/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

// ─────────────────────────────────────────────────────────────
// Level 1: Shopping / Grocery / Kabadi / Cart strip
// ─────────────────────────────────────────────────────────────
const TopTabs = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartCount = useCartStore((s) =>
    s.items.reduce((total, item) => total + item.quantity, 0),
  );

  const tabs = [
    { id: 'shop',    label: 'Shopping', icon: ShoppingBag,  route: 'ShopCategory' },
    { id: 'grocery', label: 'Grocery',  icon: Package,       route: 'GroceryCategory' },
    { id: 'kabadi',  label: 'Kabadi',   icon: Truck,         route: 'KabadiCategory' },
    { id: 'cart',    label: 'Cart',     icon: ShoppingCart,  route: 'Cart', count: cartCount },
  ];

  return (
    <View style={styles.topTabsContainer}>
      <View style={styles.topTabsContent}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={styles.topTabItem}
            onPress={() => navigation.navigate(tab.route as any)}
          >
            <View style={styles.topTabIconWrapper}>
              <tab.icon size={24} color={Colors.light.primary} strokeWidth={2.5} />
              {tab.count !== undefined && tab.count > 0 && (
                <View style={styles.badge}>
                  <Typography variant="tiny" color="#fff" weight="700" style={{ fontSize: 9 }}>
                    {tab.count}
                  </Typography>
                </View>
              )}
            </View>
            <Typography
              variant="tiny"
              weight="700"
              color={Colors.light.text}
              style={styles.topTabLabel}
            >
              {tab.label}
            </Typography>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Level 2: Logo + Search bar row
// ─────────────────────────────────────────────────────────────
const BrandHeader = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.headerMainRow}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/app_logo.jpeg')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Typography variant="h4" weight="700" color={Colors.light.text} style={styles.logoText}>
          Urban Power
        </Typography>
      </View>

      <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search' as any)}>
        <Search size={16} color={Colors.light.textMuted} />
        <Typography variant="body2" color={Colors.light.textMuted} style={styles.searchText}>
          Search services...
        </Typography>
      </Pressable>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Tab Navigator
// ─────────────────────────────────────────────────────────────
export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>('Home');

  const isHome = activeTab === 'Home';

  return (
    <View style={styles.safeArea}>
      {/* ── Conditional Header (Home tab only) ── */}
      {isHome && (
        <View style={[styles.headerWrapper, { paddingTop: Math.max(insets.top, 10) }]}>
          <TopTabs />
          <BrandHeader />
        </View>
      )}

      {/* ── Bottom Tab Navigator ── */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.light.primary,
          tabBarInactiveTintColor: '#777777',
          tabBarStyle: [
            styles.bottomTabBar,
            { height: 70 + insets.bottom, paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
          ],
          tabBarLabelStyle: styles.bottomTabLabel,
          tabBarIcon: ({ color, focused }) => {
            const size = 24;
            if (route.name === 'Home')
              return <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
            if (route.name === 'Help & Support')
              return <Headphones size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
            if (route.name === 'Account')
              return <User size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
            return null;
          },
        })}
        screenListeners={{
          // Track which tab is active so we can show/hide the header
          state: (e) => {
            const state = e.data.state;
            const routeName = state.routes[state.index]?.name ?? 'Home';
            setActiveTab(routeName);
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Help & Support" component={HelpSupportScreen} />
        <Tab.Screen name="Account" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.white },

  /* Conditional header wrapper */
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  /* Level 1: Category Strip */
  topTabsContainer: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topTabsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Spacing.md,
  },
  topTabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  topTabIconWrapper: {
    width: 55,
    height: 55,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.light.sm,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  topTabLabel: {
    textAlign: 'center',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.light.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  /* Level 2: Logo + Search Row */
  headerMainRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  logoText: {
    letterSpacing: -0.5,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchText: {
    marginLeft: 8,
    fontSize: 13,
  },

  /* Bottom Tab Bar */
  bottomTabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    ...Shadows.light.md,
    elevation: 8,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  bottomTabLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
});
