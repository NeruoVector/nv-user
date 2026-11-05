import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image } from 'react-native';

import { Button, Card, Notice, Row, Screen, Spinner, Txt } from '@/components/ui/app';
import { api, ReviewList } from '@/lib/api';
import { useStore } from '@/lib/store';

export default function Reviews() {
  const { profile } = useStore();
  const [list, setList] = useState<ReviewList | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (!profile.phone) { setLoading(false); return; }
    try {
      setList(await api.reviews(profile.phone));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '리뷰를 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, [profile.phone]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return <Screen title="내 리뷰" back>
    {!profile.phone ? <Notice text="리뷰를 보려면 연락처를 등록해 주세요." /> :
      loading ? <Spinner /> : error ? <Notice text={error} retry={load} /> :
      !list?.items.length ? <Notice text="작성한 리뷰가 없어요." /> :
      list.items.map(review => <Card key={review.id}>
        <Row><Txt style={{ fontWeight: '700' }}>선린인터넷고 매점</Txt><Txt>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</Txt></Row>
        <Txt muted>{new Date(review.created_at).toLocaleDateString('ko-KR')}</Txt>
        <Txt>{review.content}</Txt>
        {review.tags.length > 0 && <Txt muted>{review.tags.join(' · ')}</Txt>}
        {review.has_photo && <Image source={{ uri: api.reviewPhotoUrl(review.id) }} style={{ width: 120, height: 120, borderRadius: 8 }} />}
      </Card>)}
    <Button title="주문 내역 보기" secondary onPress={() => router.push('/orders')} />
  </Screen>;
}
