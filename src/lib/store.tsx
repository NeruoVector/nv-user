import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, Item } from './api';

type CartLine = { item: Item; quantity: number };
type Profile = { name: string; phone: string; school: string; place: string; agreed: boolean; review: string; notifications: boolean[] };
const initial: Profile = { name: '', phone: '', school: '', place: '1층 현관', agreed: false, review: '', notifications: [true, true, false] };
type Store = { ready: boolean; profile: Profile; setProfile: (p: Partial<Profile>) => void; cart: CartLine[]; add: (item: Item, quantity?: number) => void; change: (id: string, delta: number) => void; clear: () => void; items: Item[]; loading: boolean; error: string; refresh: () => Promise<void> };
const Context = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, update] = useState(initial);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = async () => { try { setError(''); setItems(await api.items()); } catch (e) { setError(e instanceof Error ? e.message : '상품을 불러오지 못했어요.'); } finally { setLoading(false); } };
  useEffect(() => { AsyncStorage.getItem('nv-profile').then(v => { if (v) update({ ...initial, ...JSON.parse(v) }); }).catch(() => {}).finally(() => setReady(true)); Promise.resolve().then(refresh); }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem('nv-profile', JSON.stringify(profile)).catch(() => {}); }, [profile, ready]);
  const setProfile = (p: Partial<Profile>) => update(prev => ({ ...prev, ...p }));
  const add = (item: Item, quantity = 1) => setCart(prev => { const existing = prev.find(x => x.item.id === item.id); return existing ? prev.map(x => x.item.id === item.id ? { ...x, quantity: x.quantity + quantity } : x) : [...prev, { item, quantity }]; });
  const change = (id: string, delta: number) => setCart(prev => prev.map(x => x.item.id === id ? { ...x, quantity: x.quantity + delta } : x).filter(x => x.quantity > 0));
  const value = useMemo(() => ({ ready, profile, setProfile, cart, add, change, clear: () => setCart([]), items, loading, error, refresh }), [ready, profile, cart, items, loading, error]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useStore() { const value = useContext(Context); if (!value) throw new Error('StoreProvider missing'); return value; }
export const won = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;
