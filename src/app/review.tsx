import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import { Button, C, Card, Field, Notice, Row, Screen, Txt } from '@/components/ui/app';
import { api } from '@/lib/api';

const availableTags = ['맛있어요', '배달이 빨라요', '포장이 깔끔해요'];

export default function Review() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    api.review(id).then(() => setAlreadyReviewed(true)).catch(() => {});
  }, [id]);

  const pickPhoto = async () => {
    setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });
      if (result.canceled || !result.assets[0]?.base64) return;
      const base64 = result.assets[0].base64;
      const bytes = Math.ceil(base64.length * 3 / 4);
      if (bytes > 1024 * 1024) {
        setError('사진은 1MB 이하만 등록할 수 있어요. 더 작은 사진을 선택해 주세요.');
        return;
      }
      setPhoto(`data:image/jpeg;base64,${base64}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : '사진을 선택하지 못했어요.');
    }
  };

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      await api.createReview(id, {
        rating,
        content: body.trim(),
        tags,
        ...(photo ? { photo_data_url: photo } : {}),
      });
      router.replace('/reviews');
    } catch (e) {
      setError(e instanceof Error ? e.message : '리뷰를 등록하지 못했어요.');
    } finally {
      setBusy(false);
    }
  };

  return <Screen title="리뷰 작성" back>
    <Card><Txt style={{ fontWeight: '800' }}>선린인터넷고 매점</Txt><Txt muted>주문 {id?.slice(0, 8)}</Txt></Card>
    {alreadyReviewed ? <><Notice text="이미 작성한 리뷰가 있어요." /><Button title="내 리뷰 보기" onPress={() => router.replace('/reviews')} /></> : <>
    <Txt style={{ fontSize: 22, fontWeight: '800' }}>어떤 점이 좋았나요?</Txt>
    <Row style={{ justifyContent: 'center' }}>{[1, 2, 3, 4, 5].map(n =>
      <Pressable key={n} onPress={() => setRating(n)} accessibilityRole="button" accessibilityLabel={`${n}점`}>
        <Txt style={{ fontSize: 32, color: n <= rating ? '#E7AB39' : '#D9D0C7' }}>★</Txt>
      </Pressable>)}</Row>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{availableTags.map(tag =>
      <Pressable key={tag} onPress={() => setTags(current => current.includes(tag) ? current.filter(x => x !== tag) : [...current, tag])}>
        <Card style={{ padding: 10, backgroundColor: tags.includes(tag) ? C.pale : C.white, borderColor: tags.includes(tag) ? C.red : C.line }}>
          <Txt>{tag}</Txt>
        </Card>
      </Pressable>)}</View>
    <Field label="리뷰" value={body} onChangeText={setBody} placeholder="맛과 배달 경험을 알려주세요" multiline />
    <Txt muted>{body.length} / 500 · 연락처 등 개인정보는 적지 말아주세요.</Txt>
    <Button title={photo ? '사진 변경' : '사진 추가'} secondary onPress={pickPhoto} />
    {photo ? <><Image source={{ uri: photo }} style={{ width: 120, height: 120, borderRadius: 8 }} /><Button title="사진 제거" secondary onPress={() => setPhoto('')} /></> : null}
    {error ? <Notice text={error} /> : null}
    <Button title={busy ? '등록 중...' : '리뷰 등록하기'} disabled={busy || body.trim().length < 1 || body.length > 500} onPress={submit} />
    </>}
  </Screen>;
}
