import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ProductArt } from '@/components/product';
import { Button, C, Card, Notice, Row, Screen, Txt } from '@/components/ui/app';
import { useStore, won } from '@/lib/store';

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, cart, add } = useStore();
  const [quantity, setQuantity] = useState(1);
  const item = items.find(x => x.id === id);
  if (!item) return <Screen title="메뉴 상세" back><Notice text="상품을 찾을 수 없어요." /></Screen>;

  const inCart = cart.find(x => x.item.id === id)?.quantity ?? 0;
  const remaining = Math.max(0, item.stock_quantity - inCart);

  return <Screen title="메뉴 상세" back footer={<View style={{ padding: 12, backgroundColor: C.white }}>
    <Button title={remaining === 0 ? '재고를 모두 담았어요' : `${won(item.unit_price * quantity)} 담기`}
      disabled={quantity > remaining}
      onPress={() => { add(item, quantity); router.push('/cart'); }} />
  </View>}>
    <ProductArt item={item} large />
    <Txt style={{ color: C.red, fontWeight: '700' }}>매점 인기 메뉴</Txt>
    <Txt style={{ fontSize: 26, fontWeight: '800' }}>{item.name}</Txt>
    <Txt muted>{item.description || '선린인터넷고 매점 상품'}</Txt>
    <Card><Row><Txt>기본 가격</Txt><Txt style={{ fontWeight: '800' }}>{won(item.unit_price)}</Txt></Row></Card>
    <Card><Row><Txt style={{ fontWeight: '700' }}>수량</Txt><Row>
      <Button title="−" secondary onPress={() => setQuantity(Math.max(1, quantity - 1))} style={{ minHeight: 35, paddingHorizontal: 14 }} />
      <Txt>{quantity}</Txt>
      <Button title="+" secondary disabled={quantity >= remaining} onPress={() => setQuantity(Math.min(remaining, quantity + 1))} style={{ minHeight: 35, paddingHorizontal: 14 }} />
    </Row></Row></Card>
    <Txt muted>재고 {item.stock_quantity}개 · 장바구니에 {inCart}개</Txt>
  </Screen>;
}
