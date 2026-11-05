import { useState } from 'react';
import { View } from 'react-native';

import { useDroneFeed } from '@/lib/drone';
import { C, Card, Notice, Row, Spinner, Txt } from './ui/app';
import { DronePlayer } from './drone-player';

export function DroneLive() {
  const feed = useDroneFeed();
  const [liveFailed, setLiveFailed] = useState(false);
  const showLive = Boolean(feed.stream?.active && feed.stream.webrtc_whep_path && !liveFailed);
  const showFile = !showLive && Boolean(feed.recordingUrl);

  return <Card>
    <Row>
      <Txt style={{ fontWeight: '800' }}>배달 드론</Txt>
      <Txt style={{ color: feed.stream?.active ? C.red : C.muted, fontWeight: '700' }}>{feed.stream?.active ? '송출 중' : '대기'}</Txt>
    </Row>
    <Txt muted>{feed.stream ? feed.stream.drone_id : '학교 드론 영상을 확인하고 있어요.'}</Txt>
    <View style={{ height: 210, borderRadius: 8, overflow: 'hidden', backgroundColor: '#111' }}>
      {feed.loading ? <Spinner /> : showLive ? <DronePlayer mode="whep" source={feed.stream!.webrtc_whep_path} onFail={() => setLiveFailed(true)} /> : showFile ? <DronePlayer mode="file" source={feed.recordingUrl!} /> : <Txt style={{ color: '#fff', padding: 16 }}>송출 중인 드론 영상이 없어요.</Txt>}
    </View>
    {liveFailed && feed.recordingUrl ? <Txt muted>실시간 연결에 실패해 최근 녹화를 보여 드려요.</Txt> : null}
    {feed.error ? <Notice text={feed.error} retry={() => { setLiveFailed(false); void feed.reload(); }} /> : null}
  </Card>;
}
