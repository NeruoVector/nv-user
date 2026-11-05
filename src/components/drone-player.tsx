import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { BASE_URL, endStream, postSdp } from '@/lib/api';

const liveHtml = `<!doctype html>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;height:100%;background:#111}video{width:100%;height:100%;object-fit:cover;background:#111}</style>
<video id="v" autoplay muted playsinline></video>
<script>
const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
const video = document.getElementById('v');
let sent = false;
pc.addTransceiver('video', { direction: 'recvonly' });
pc.addTransceiver('audio', { direction: 'recvonly' });
pc.ontrack = (event) => {
  video.srcObject = event.streams[0];
  video.play().catch(() => {});
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'playing' }));
};
function sendOffer() {
  if (sent || !pc.localDescription) return;
  sent = true;
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'offer', sdp: pc.localDescription.sdp }));
}
pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === 'complete') sendOffer(); };
window.__applyAnswer = async (sdp) => {
  try { await pc.setRemoteDescription({ type: 'answer', sdp }); }
  catch (e) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: String(e) })); }
};
pc.createOffer().then((offer) => pc.setLocalDescription(offer)).then(() => setTimeout(sendOffer, 2500)).catch((e) => {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: String(e) }));
});
</script>`;

function fileHtml(uri: string) {
  return `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,video{margin:0;width:100%;height:100%;background:#111;object-fit:cover}</style><video src=${JSON.stringify(uri)} autoplay muted playsinline controls></video>`;
}

export function DronePlayer({ mode, source, onFail }: { mode: 'whep' | 'file'; source: string; onFail?: () => void }) {
  const session = useRef<string | null>(null);
  const started = useRef(false);
  const web = useRef<WebView<object>>(null);

  useEffect(() => () => {
    if (session.current) endStream(session.current);
  }, []);

  const onMessage = async (event: WebViewMessageEvent) => {
    let message: { type?: string; sdp?: string; message?: string };
    try { message = JSON.parse(event.nativeEvent.data); } catch { return; }
    if (message.type === 'playing') return;
    if (message.type === 'error') {
      onFail?.();
      return;
    }
    if (message.type !== 'offer' || !message.sdp || started.current) return;
    started.current = true;
    try {
      const { answer, sessionPath } = await postSdp(source, message.sdp);
      session.current = sessionPath;
      web.current?.injectJavaScript(`window.__applyAnswer(${JSON.stringify(answer)}); true;`);
    } catch {
      onFail?.();
    }
  };

  return <WebView<object>
    ref={web}
    style={styles.view}
    source={mode === 'file' ? { html: fileHtml(source) } : { html: liveHtml, baseUrl: BASE_URL }}
    originWhitelist={['*']}
    allowsInlineMediaPlayback
    mediaPlaybackRequiresUserAction={false}
    javaScriptEnabled
    onMessage={onMessage}
    onError={() => onFail?.()}
  />;
}

const styles = StyleSheet.create({ view: { flex: 1, backgroundColor: '#111' } });
