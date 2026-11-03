import chips from '../../assets/products/chips.png';
import jelly from '../../assets/products/jelly.png';
import milk from '../../assets/products/milk.png';
import { useAppRouter } from '@/lib/navigation';
import { C, Row, Txt } from '@/components/ui/app';
import { Item } from '@/lib/api';
import { won } from '@/lib/store';

const palettes = [['#E9E7CB','#656C27'],['#F5D8D6','#A64C61'],['#DDE9ED','#426981'],['#F4E0AF','#A86C1D']];
export function ProductArt({ item, large = false }: { item: Item; large?: boolean }) {
  const n = [...item.name].reduce((a,c) => a + c.charCodeAt(0),0) % palettes.length;
  const [bg, fg] = palettes[n];
  const photo = /포테이토칩/.test(item.name) ? chips : /청포도젤리/.test(item.name) ? jelly : /초코우유/.test(item.name) ? milk : null;
  if (photo) return <div className="layout" style={{ height: large ? 240 : 125, borderRadius: 10, backgroundColor: bg, overflow: 'hidden' }}><img src={photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/></div>;
  return <div className="layout" style={{ height: large ? 240 : 125, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}><div className="layout" style={{ width: large ? 130 : 70, height: large ? 165 : 94, borderRadius: 10, backgroundColor: fg, alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)', boxShadow: '0 4px 10px #0002' }}><Txt style={{ color: 'white', fontWeight: '800', fontSize: large ? 23 : 13, textAlign: 'center', padding: 8 }}>{item.name}</Txt></div></div>;
}
export function ProductCard({ item }: { item: Item }) { const router = useAppRouter(); return <button type="button" className="pressable" onClick={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })} style={{ width: '48%', gap: 7 }}><ProductArt item={item}/><Txt style={{ fontWeight: '700' }}>{item.name}</Txt><Row><Txt style={{ fontWeight: '800' }}>{won(item.unit_price)}</Txt><Txt style={{ color: item.stock_quantity > 0 ? C.muted : C.red, fontSize: 11 }}>{item.stock_quantity > 0 ? `재고 ${item.stock_quantity}` : '품절'}</Txt></Row></button>; }
