import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Button, C, Card, Notice, Row, Screen, Spinner, Txt } from '@/components/ui/app';
import { ProductCard } from '@/components/product';
import { useStore, won } from '@/lib/store';

export default function Shop() {
  const { profile, items, cart, loading, error, refresh } = useStore();
  const [filter, setFilter] = useState('전체');
  const shown = items.filter(x => filter === '전체' || x.name.includes(filter) || (filter === '과자' && /칩|깡|과자/.test(x.name)) || (filter === '음료' && /우유|음료|주스/.test(x.name)) || (filter === '젤리' && x.name.includes('젤리')));
  const total = cart.reduce((a,x) => a + x.quantity*x.item.unit_price,0);
  return <Screen tabs footer={cart.length > 0 && <View style={{ padding: 12, backgroundColor: C.white }}><Button title={`장바구니 보기 · ${won(total)}`} onPress={() => router.push('/cart')}/></View>}>
    <Row><View><Txt style={{ color: C.red, fontWeight: '700', fontSize: 12 }}>{profile.school || '선린인터넷고등학교'}</Txt><Txt style={{ fontWeight: '800', fontSize: 23 }}>오늘은 뭐 먹을까요?</Txt></View><Pressable onPress={() => router.push('/places')}><Txt style={{ fontSize: 13 }}>⌖ {profile.place} ›</Txt></Pressable></Row>
    <Pressable onPress={() => router.push('/store')}><Card style={{ backgroundColor: C.pale, borderColor: C.pale }}><Txt style={{ color: C.red, fontWeight: '800', fontSize: 17 }}>선린인터넷고 매점  ›</Txt><Txt muted>지금 주문 가능 · 교내 배달</Txt></Card></Pressable>
    <Row style={{ justifyContent: 'flex-start' }}>{['전체','과자','젤리','음료'].map(x => <Pressable key={x} onPress={() => setFilter(x)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: x===filter ? C.red : C.white }}><Txt style={{ color: x===filter ? C.white : C.ink }}>{x}</Txt></Pressable>)}</Row>
    <Row><Txt style={{ fontSize: 18, fontWeight: '800' }}>매점 상품</Txt><Pressable onPress={refresh}><Txt style={{ color: C.red }}>새로고침</Txt></Pressable></Row>
    {loading ? <Spinner/> : error ? <Notice text={error} retry={refresh}/> : shown.length === 0 ? <Notice text={items.length ? '이 분류에 상품이 없어요.' : '현재 판매 중인 상품이 없어요.'}/> : <View style={{ width: '100%' }}>{shown.map(item => <ProductCard key={item.id} item={item}/>)}</View>}
  </Screen>;
}
