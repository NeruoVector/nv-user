import { createElement, useEffect, useId, useRef } from 'react';

import { endStream, postSdp } from '@/lib/api';

type Playable = {
  src: string;
  srcObject: unknown;
  muted: boolean;
  controls: boolean;
  autoplay: boolean;
  playsInline: boolean;
  play: () => Promise<void>;
};

function findVideo(id: string) {
  const root = globalThis as { document?: { getElementById: (value: string) => Playable | null } };
  return root.document?.getElementById(id) ?? null;
}

export function DronePlayer({ mode, source, onFail }: { mode: 'whep' | 'file'; source: string; onFail?: () => void }) {
  const id = useId();
  const session = useRef<string | null>(null);
  const fail = useRef(onFail);

  useEffect(() => { fail.current = onFail; }, [onFail]);

  useEffect(() => {
    const node = findVideo(id);
    if (!node) return;
    if (mode === 'file') {
      node.src = source;
      node.play().catch(() => undefined);
      return;
    }
    const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    let sent = false;
    let cancelled = false;
    peer.addTransceiver('video', { direction: 'recvonly' });
    peer.addTransceiver('audio', { direction: 'recvonly' });
    peer.ontrack = (event) => {
      node.srcObject = event.streams[0];
      node.play().catch(() => undefined);
    };
    const sendOffer = async () => {
      if (sent || cancelled || !peer.localDescription) return;
      sent = true;
      try {
        const { answer, sessionPath } = await postSdp(source, peer.localDescription.sdp);
        session.current = sessionPath;
        if (!cancelled) await peer.setRemoteDescription({ type: 'answer', sdp: answer });
      } catch {
        if (!cancelled) fail.current?.();
      }
    };
    peer.onicegatheringstatechange = () => { if (peer.iceGatheringState === 'complete') void sendOffer(); };
    peer.createOffer().then(offer => peer.setLocalDescription(offer)).then(() => setTimeout(() => void sendOffer(), 2500)).catch(() => fail.current?.());
    return () => {
      cancelled = true;
      peer.close();
      if (session.current) endStream(session.current);
    };
  }, [id, mode, source]);

  return createElement('video', {
    id,
    autoPlay: true,
    muted: true,
    playsInline: true,
    controls: mode === 'file',
    style: { width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#111' },
  });
}
