import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { DroneLive } from '@/components/drone-live';
import { Button, C, Card, Notice, Screen, Spinner, Txt } from '@/components/ui/app';
import { api, Order } from '@/lib/api';
import { useStore } from '@/lib/store';

export default function Arrival() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setOrder(await api.order(id));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '주문 상태를 불러오지 못했어요.');
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => { void load(); }, 8000);
    void Promise.resolve().then(load);
    return () => clearInterval(timer);
  }, [load]);

  const place = order?.delivery_detail || order?.delivery_address || profile.place;

  return <Screen title="도착 안내" back>
    <Txt style={{ color: C.red, fontWeight: '700' }}>수령 준비</Txt>
    <Txt style={{ fontSize: 27, fontWeight: '800', lineHeight: 39 }}>간식이 곧 도착해요.{'\n'}이제 나와주세요!</Txt>
    <DroneLive />
    <Card style={{ backgroundColor: C.pale, borderColor: C.pale }}>
      <Txt style={{ fontWeight: '800', fontSize: 20 }}>{place}</Txt>
      <Txt>도착하면 주문번호를 확인해 주세요.</Txt>
      {order ? <Txt muted>주문번호 {order.order_number}</Txt> : error ? null : <Spinner />}
    </Card>
    {error ? <Notice text={error} retry={load} /> : null}
    <Txt muted>다른 사람의 간식과 바뀌지 않도록 주문번호와 메뉴를 확인해 주세요.</Txt>
    <Button title="수령 번호 확인하기" onPress={() => router.push({ pathname: '/pickup', params: { id } })} />
  </Screen>;
}
