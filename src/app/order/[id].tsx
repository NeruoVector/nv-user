import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';

import { DroneLive } from '@/components/drone-live';
import { Button, C, Card, Divider, Notice, Row, Screen, Spinner, Txt } from '@/components/ui/app';
import { api, Order } from '@/lib/api';
import { useStore, won } from '@/lib/store';
import { statusText } from '../orders';

const steps = ['pending_payment', 'paid', 'preparing', 'ready', 'assigned', 'in_transit', 'delivered'];
const cancellable = ['pending_payment', 'paid', 'preparing', 'ready'];

export default function OrderScreen() {
  const { id, completed } = useLocalSearchParams<{ id: string; completed?: string }>();
  const { items } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setOrder(await api.order(id));
      setLoadError('');
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : '주문을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => {
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [load]));

  const refundPayment = async (paymentId: string) => {
    setBusy(true);
    setActionError('');
    try {
      await api.refund(paymentId);
      await load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : '환불에 실패했어요. 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => Alert.alert(
    '주문을 취소할까요?',
    '주문을 취소하고 결제된 금액이 있으면 환불합니다.',
    [
      { text: '계속 주문하기', style: 'cancel' },
      { text: '주문 취소', style: 'destructive', onPress: async () => {
        setBusy(true);
        setActionError('');
        try {
          const cancelled = await api.cancelOrder(id);
          setOrder({ ...order!, ...cancelled });
          if (order?.payment?.status === 'captured') {
            await api.refund(order.payment.id);
          }
          await load();
        } catch (e) {
          setActionError(e instanceof Error ? e.message : '주문 취소 또는 환불에 실패했어요.');
          await load();
        } finally {
          setBusy(false);
        }
      } },
    ],
  );

  if (loading) return <Screen title="배달 현황" back><Spinner /></Screen>;
  if (!order) return <Screen title="배달 현황" back><Notice text={loadError || '주문을 찾을 수 없어요.'} retry={load} /></Screen>;

  const stage = steps.indexOf(order.status);
  const needsRefund = order.status === 'cancelled' && order.payment?.status === 'captured';

  return <Screen title={completed === '1' ? '주문 완료' : '배달 현황'} back>
    <View style={{ alignItems: 'center', paddingVertical: 20, gap: 10 }}>
      <Txt style={{ fontSize: 46, color: C.red }}>{order.status === 'delivered' ? '✓' : '⌁'}</Txt>
      <Txt style={{ fontSize: 25, fontWeight: '800' }}>{completed === '1' && order.status === 'paid' ? '주문이 접수됐어요!' : statusText(order.status)}</Txt>
      <Txt muted>{order.status === 'in_transit' ? '약속한 곳으로 이동 중이에요.' : '주문 상태는 서버에서 갱신됩니다.'}</Txt>
    </View>
    <Card>
      <Txt style={{ fontWeight: '800' }}>진행 현황</Txt>
      {steps.slice(1).map((step, index) => <Row key={step}>
        <Txt style={{ color: index + 1 <= stage ? C.red : C.muted }}>
          {index + 1 <= stage ? '●' : '○'}  {statusText(step)}
        </Txt>
      </Row>)}
    </Card>
    {['assigned', 'in_transit', 'delivered'].includes(order.status) && <DroneLive />}
    <Card>
      <Txt style={{ fontWeight: '800' }}>주문 정보</Txt>
      <Divider />
      <Row><Txt muted>주문번호</Txt><Txt>{order.order_number}</Txt></Row>
      <Row><Txt muted>받을 장소</Txt><Txt>{order.delivery_detail || order.delivery_address}</Txt></Row>
      {order.items?.map((line, index) => <Row key={index}>
        <Txt>{items.find(item => item.id === line.item_id)?.name || '상품'} × {line.quantity}</Txt>
        <Txt>{won(line.line_total)}</Txt>
      </Row>)}
      <Divider />
      <Row><Txt style={{ fontWeight: '700' }}>결제금액</Txt><Txt style={{ fontWeight: '800', color: C.red }}>{won(order.total_amount)}</Txt></Row>
      {order.payment && <Row><Txt muted>결제 상태</Txt><Txt>{order.payment.status === 'refunded' ? '환불 완료' : order.payment.status === 'captured' ? '결제 완료' : order.payment.status}</Txt></Row>}
    </Card>
    {loadError ? <Notice text={loadError} retry={load} /> : null}
    {actionError ? <Notice text={actionError} /> : null}
    {['in_transit', 'delivered'].includes(order.status) && <Button title="수령 번호 확인하기" onPress={() => router.push({ pathname: order.status === 'in_transit' ? '/arrival' : '/pickup', params: { id: order.id } })} />}
    {cancellable.includes(order.status) && <Button title={busy ? '처리 중...' : '주문 취소 및 환불'} secondary disabled={busy} onPress={cancel} />}
    {needsRefund && <Button title={busy ? '처리 중...' : '환불 다시 시도'} disabled={busy} onPress={() => refundPayment(order.payment!.id)} />}
    {order.status === 'delivered' && <Button title="리뷰 작성하기" secondary onPress={() => router.push({ pathname: '/review', params: { id: order.id } })} />}
    <Button title="새로고침" secondary onPress={load} />
  </Screen>;
}
