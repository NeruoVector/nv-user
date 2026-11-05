import { useCallback, useEffect, useRef, useState } from 'react';

import { absoluteUrl, api, StreamInfo } from './api';

export function useDroneFeed() {
  const [stream, setStream] = useState<StreamInfo | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const locked = useRef(false);

  const load = useCallback(async () => {
    try {
      const listed = await api.streams();
      const chosen = listed.find(item => item.active) ?? listed[0];
      const next = chosen ? await api.stream(chosen.drone_id) : null;
      const recordings = await api.recordings(next?.drone_id);
      const latest = recordings[0];
      if (locked.current) return;
      setStream(next);
      setRecordingUrl(latest ? absoluteUrl(latest.download_url) : null);
      setError('');
      if (next?.active) locked.current = true;
    } catch (e) {
      if (!locked.current) setError(e instanceof Error ? e.message : '드론 상태를 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => { void load(); }, 10000);
    void Promise.resolve().then(load);
    return () => clearInterval(timer);
  }, [load]);

  const reload = useCallback(() => {
    locked.current = false;
    setLoading(true);
    return load();
  }, [load]);

  return { stream, recordingUrl, error, loading, reload };
}
