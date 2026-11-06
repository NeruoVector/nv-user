import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { Button, C, Card, Notice, Screen, Spinner, Txt } from '@/components/ui/app';
import { api, Order } from '@/lib/api';

export default function Pickup() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setOrder(await api.order(id));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '주문을 찾을 수 없어요.');
    }
  }, [id]);

  useEffect(() => { Promise.resolve().then(load); }, [load]);

  const confirm = async () => {
    if (!order || order.status !== 'in_transit') return;
    setBusy(true);
    setError('');
    try {
      await api.updateOrderStatus(order.id, 'delivered');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : '수령 확인에 실패했어요.');
    } finally {
      setBusy(false);
    }
  };

  return <Screen title="간식 수령" back>
    <Txt style={{ color: C.red, fontWeight: '700' }}>수령 준비</Txt>
    <Txt style={{ fontSize: 26, fontWeight: '800' }}>간식이 도착하면 주문번호를 확인해 주세요</Txt>
    {error ? <Notice text={error} retry={load} /> : !order ? <Spinner /> : <>
      <Txt muted>{order.delivery_detail || order.delivery_address}에서 주문한 간식을 받아주세요.</Txt>
      <Card style={{ alignItems: 'center', backgroundColor: C.pale, borderColor: C.pale }}>
        <Txt muted>내 수령번호</Txt>
        <Txt style={{ fontSize: 24, fontWeight: '800', color: C.red }}>{order.pickup_code || '준비 중'}</Txt>
      </Card>
      <Card>
        <Txt>1. 주문한 메뉴와 수량을 확인해 주세요.</Txt>
        <Txt>2. 간식을 받은 뒤 수령 완료를 눌러주세요.</Txt>
      </Card>
      {order.status === 'delivered' ? <>
        <Txt style={{ fontWeight: '800' }}>서버에 수령 완료로 기록됐어요.</Txt>
        <Button title="리뷰 작성하기" onPress={() => router.push({ pathname: '/review', params: { id } })} />
      </> : order.status === 'in_transit' ?
        <Button title={busy ? '확인 중...' : '간식 받았어요'} disabled={busy} onPress={confirm} /> :
        <Notice text="배달 중 상태가 되면 수령을 확인할 수 있어요." retry={load} />}
    </>}
  </Screen>;
}
