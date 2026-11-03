import { useAppRouter } from '@/lib/navigation';
import { useState } from 'react';
import { Button, C, Card, Notice, Row, Screen, Spinner, Txt } from '@/components/ui/app';
import { ProductCard } from '@/components/product';
import { useStore, won } from '@/lib/store';

export default function Shop() { const router = useAppRouter();
  const { profile, items, cart, loading, error, refresh } = useStore();
  const [filter, setFilter] = useState('전체');
  const shown = items.filter(x => filter === '전체' || x.name.includes(filter) || (filter === '과자' && /칩|깡|과자/.test(x.name)) || (filter === '음료' && /우유|음료|주스/.test(x.name)) || (filter === '젤리' && x.name.includes('젤리')));
  const total = cart.reduce((a,x) => a + x.quantity*x.item.unit_price,0);
  return <Screen tabs footer={cart.length > 0 && <div className="layout" style={{ padding: 12, backgroundColor: C.white }}><Button title={`장바구니 보기 · ${won(total)}`} onClick={() => router.push('/cart')}/></div>}>
    <Row><div className="layout"><Txt style={{ color: C.red, fontWeight: '700', fontSize: 12 }}>{profile.school || '선린인터넷고등학교'}</Txt><Txt style={{ fontWeight: '800', fontSize: 23 }}>오늘은 뭐 먹을까요?</Txt></div><button type="button" className="pressable" onClick={() => router.push('/places')}><Txt style={{ fontSize: 13 }}>⌖ {profile.place} ›</Txt></button></Row>
    <button type="button" className="pressable" onClick={() => router.push('/store')}><Card style={{ backgroundColor: C.pale, borderColor: C.pale }}><Txt style={{ color: C.red, fontWeight: '800', fontSize: 17 }}>선린인터넷고 매점  ›</Txt><Txt muted>지금 주문 가능 · 교내 배달</Txt></Card></button>
    <Row style={{ justifyContent: 'flex-start' }}>{['전체','과자','젤리','음료'].map(x => <button type="button" className="pressable" key={x} onClick={() => setFilter(x)} style={{ paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: 20, backgroundColor: x===filter ? C.red : C.white }}><Txt style={{ color: x===filter ? C.white : C.ink }}>{x}</Txt></button>)}</Row>
    <Row><Txt style={{ fontSize: 18, fontWeight: '800' }}>매점 상품</Txt><button type="button" className="pressable" onClick={refresh}><Txt style={{ color: C.red }}>새로고침</Txt></button></Row>
    {loading ? <Spinner/> : error ? <Notice text={error} retry={refresh}/> : shown.length === 0 ? <Notice text={items.length ? '이 분류에 상품이 없어요.' : '현재 판매 중인 상품이 없어요.'}/> : <div className="layout" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20 }}>{shown.map(item => <ProductCard key={item.id} item={item}/>)}</div>}
  </Screen>;
}
