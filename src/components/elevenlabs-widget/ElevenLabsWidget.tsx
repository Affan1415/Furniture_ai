'use client';

import { useEffect, useRef, useState } from 'react';

const WIDGET_SCRIPT_URL = 'https://unpkg.com/@elevenlabs/convai-widget-embed';

export function ElevenLabsWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [agentId, setAgentId] = useState<string | null>(() =>
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() || null
  );

  // Support both NEXT_PUBLIC_ and API so your agent ID is always used
  useEffect(() => {
    if (agentId) return;
    fetch('/api/convai-config', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.agentId) setAgentId((data.agentId as string).trim());
      })
      .catch(() => {});
  }, [agentId]);

  useEffect(() => {
    if (!agentId || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const widgetEl = document.createElement('elevenlabs-convai');
    widgetEl.setAttribute('agent-id', agentId);
    widgetEl.setAttribute('dismissible', 'true');
    containerRef.current.appendChild(widgetEl);

    // If script already on page it was likely initialized with default agent — remove and re-add so it runs again and finds THIS element (your agent)
    const existing = document.querySelector(`script[src="${WIDGET_SCRIPT_URL}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = WIDGET_SCRIPT_URL;
    script.async = true;
    document.body.appendChild(script);
  }, [agentId]);

  if (!agentId) return null;

  return (
    <div
      ref={containerRef}
      className="elevenlabs-widget-root"
      style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
    />
  );
}
