import { router } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { C, Row, Txt } from '@/components/ui/app';
import { Item } from '@/lib/api';
import { won } from '@/lib/store';

const palettes = [['#E9E7CB','#656C27'],['#F5D8D6','#A64C61'],['#DDE9ED','#426981'],['#F4E0AF','#A86C1D']];
export function ProductArt({ item, large = false, compact = false }: { item: Item; large?: boolean; compact?: boolean }) {
  const n = [...item.name].reduce((a,c) => a + c.charCodeAt(0),0) % palettes.length;
  const [bg, fg] = palettes[n];
  const photo = /포테이토칩/.test(item.name) ? require('../../assets/products/chips.png') : /청포도젤리/.test(item.name) ? require('../../assets/products/jelly.png') : /초코우유/.test(item.name) ? require('../../assets/products/milk.png') : null;
  const height = large ? 240 : compact ? 88 : 125;
  if (photo) return <View style={{ height, borderRadius: 10, backgroundColor: bg, overflow: 'hidden' }}><Image source={photo} resizeMode="cover" style={{ width: '100%', height: '100%' }}/></View>;
  return <View style={{ height, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}><View style={{ width: large ? 130 : compact ? 56 : 70, height: large ? 165 : compact ? 70 : 94, borderRadius: 10, backgroundColor: fg, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }], shadowColor: fg, shadowOpacity: .2, shadowRadius: 10 }}><Txt style={{ color: 'white', fontWeight: '800', fontSize: large ? 23 : 11, textAlign: 'center', padding: 6 }}>{item.name}</Txt></View></View>;
}
export function ProductCard({ item }: { item: Item }) { return <Pressable onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }}><View style={{ width: 88 }}><ProductArt item={item} compact/></View><View style={{ flex: 1, gap: 5 }}><Txt style={{ fontWeight: '700', fontSize: 16 }}>{item.name}</Txt>{item.description ? <Txt muted style={{ fontSize: 12 }} numberOfLines={1}>{item.description}</Txt> : null}<Row><Txt style={{ fontWeight: '800' }}>{won(item.unit_price)}</Txt><Txt style={{ color: item.stock_quantity > 0 ? C.muted : C.red, fontSize: 11 }}>{item.stock_quantity > 0 ? `재고 ${item.stock_quantity}` : '품절'}</Txt></Row></View><Txt style={{ color: C.muted }}>›</Txt></Pressable>; }
