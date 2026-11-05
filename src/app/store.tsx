import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

import { ProductCard } from '@/components/product';
import { Button, C, Card, Row, Screen, Txt } from '@/components/ui/app';
import { api, ReviewList } from '@/lib/api';
import { useStore, won } from '@/lib/store';

export default function Store() {
  const { items, cart, profile } = useStore();
  const [reviews, setReviews] = useState<ReviewList | null>(null);
  const total = cart.reduce((sum, line) => sum + line.quantity * line.item.unit_price, 0);
  useEffect(() => { api.reviews().then(setReviews).catch(() => {}); }, []);

  return <Screen title="선린인터넷고 매점" back footer={cart.length > 0 && <View style={{ padding: 12, backgroundColor: C.white }}><Button title={`장바구니 보기 · ${won(total)}`} onPress={() => router.push('/cart')} /></View>}>
    <View style={{ height: 140, backgroundColor: C.pale, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
      <Txt style={{ fontSize: 30, fontWeight: '800', color: C.red }}>선린인터넷고 매점</Txt>
    </View>
    <Card><Txt>교내 배달 · 수령 장소 {profile.place}</Txt><Row><Txt muted>최소주문 1,000원</Txt><Txt muted>예상 10~15분</Txt></Row></Card>
    <Txt style={{ fontWeight: '800', fontSize: 18 }}>메뉴</Txt>
    <View style={{ width: '100%' }}>{items.map(item => <ProductCard key={item.id} item={item} />)}</View>
    <Txt style={{ fontWeight: '800', fontSize: 18 }}>리뷰 {reviews?.total ?? ''}</Txt>
    {reviews?.average_rating != null && <Txt style={{ color: C.red, fontWeight: '700' }}>★ {reviews.average_rating.toFixed(1)}</Txt>}
    {reviews?.items.map(review => <Card key={review.id}>
      <Row><Txt>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</Txt><Txt muted>{new Date(review.created_at).toLocaleDateString('ko-KR')}</Txt></Row>
      <Txt>{review.content}</Txt>
      {review.tags.length > 0 && <Txt muted>{review.tags.join(' · ')}</Txt>}
      {review.has_photo && <Image source={{ uri: api.reviewPhotoUrl(review.id) }} style={{ width: 120, height: 120, borderRadius: 8 }} />}
    </Card>)}
  </Screen>;
}
