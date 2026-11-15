"use client";

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { RealTimeClient } from '@decartai/sdk';
import type { Product } from '@/lib/types';
import { productImagesForColor } from '@/lib/product-preview';
import { TRY_ON_MODEL, TRY_ON_SECONDS } from '@/lib/try-on';
import { lockScroll } from '@/components/motion/SmoothScroll';
import { CloseIcon } from '@/components/ui/Icons';

export function TryOns({ product, color }: { product: Product; color?: string }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const inputVideo = useRef<HTMLVideoElement>(null);
  const outputVideo = useRef<HTMLVideoElement>(null);
  const camera = useRef<MediaStream | null>(null);
  const session = useRef<RealTimeClient | null>(null);
  const run = useRef(0);
  const busy = useRef(false);
  const sourceUrl = useRef<string | null>(null);
  const [clip, setClip] = useState<File | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const [open, setOpen] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [status, setStatus] = useState('Ready to try');
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(TRY_ON_SECONDS);
  const previewImages = productImagesForColor(product, color);
  const garment = previewImages[1];
  const portrait = previewImages[0];

  const cleanup = useCallback(() => {
    run.current++;
    busy.current = false;
    if (timeout.current) clearTimeout(timeout.current);
    if (ticker.current) clearInterval(ticker.current);
    timeout.current = null;
    ticker.current = null;
    const current = session.current;
    session.current = null;
    current?.disconnect();
    camera.current?.getTracks().forEach(track => track.stop());
    camera.current = null;
    if (inputVideo.current) { inputVideo.current.pause(); inputVideo.current.srcObject = null; inputVideo.current.removeAttribute('src'); inputVideo.current.load(); }
    if (sourceUrl.current) URL.revokeObjectURL(sourceUrl.current);
    sourceUrl.current = null;
    if (outputVideo.current) outputVideo.current.srcObject = null;
  }, []);
  const stop = useCallback((message = 'Session stopped') => {
    cleanup(); setActive(false); setReady(false); setStatus(message);
  }, [cleanup]);

  useEffect(() => cleanup, [cleanup]);
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    let cancelled = false;
    setConfigured(null);
    fetch('/api/try-on/session', { cache: 'no-store' }).then(r => r.json()).then(data => {
      if (!cancelled) setConfigured(data.configured === true);
    }).catch(() => { if (!cancelled) setError('Could not check try-on availability. Please reopen this window.'); });
    const onHidden = () => { if (document.hidden) stop('Paused because you left this tab'); };
    document.addEventListener('visibilitychange', onHidden);
    return () => { cancelled = true; document.removeEventListener('visibilitychange', onHidden); cleanup(); lockScroll(false); };
  }, [open, cleanup, stop]);

  async function start() {
    if (busy.current || !garment || !configured) return;
    cleanup();
    const attempt = run.current;
    busy.current = true;
    setActive(true); setReady(false); setError(''); setSeconds(TRY_ON_SECONDS); setStatus(clip ? 'Loading your clip…' : 'Allow camera access…');
    try {
      const { createDecartClient, models } = await import('@decartai/sdk');
      if (attempt !== run.current) return;
      const model = models.realtime(TRY_ON_MODEL);
      let stream: MediaStream;
      if (clip) {
        const video = inputVideo.current as HTMLVideoElement & { captureStream?: () => MediaStream };
        if (!video?.captureStream) throw new Error('Video upload is not supported in this browser. Use camera mode in Chrome or Edge.');
        sourceUrl.current = URL.createObjectURL(clip);
        video.src = sourceUrl.current;
        video.loop = true;
        await video.play();
        stream = video.captureStream();
        stream.getAudioTracks().forEach(track => { track.stop(); stream.removeTrack(track); });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user', width: { ideal: model.width }, height: { ideal: model.height }, frameRate: model.fps } });
      }
      if (attempt !== run.current) { stream.getTracks().forEach(track => track.stop()); return; }
      camera.current = stream;
      stream.getVideoTracks().forEach(track => { track.onended = () => { if (attempt === run.current) stop('Camera disconnected'); }; });
      if (!clip && inputVideo.current) { inputVideo.current.srcObject = stream; await inputVideo.current.play(); }
      setStatus('Preparing your garment…');
      const imageResponse = await fetch(garment.src);
      if (!imageResponse.ok) throw new Error('The selected garment image could not be loaded.');
      const image = await imageResponse.blob();
      if (attempt !== run.current) return;
      const res = await fetch('/api/try-on/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: product.slug, color }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to start try-on.');
      if (attempt !== run.current) return;
      setStatus('Connecting to your fitting room…');
      timeout.current = setTimeout(() => stop('30-second trial finished'), TRY_ON_SECONDS * 1000);
      const deadline = Date.now() + TRY_ON_SECONDS * 1000;
      ticker.current = setInterval(() => setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))), 250);
      const connection = await createDecartClient({ apiKey: data.apiKey }).realtime.connect(stream, {
        model, mirror: clip ? false : 'auto', retries: 0,
        initialState: { prompt: { text: data.prompt, enhance: false }, image },
        onRemoteStream: remote => {
          if (attempt !== run.current) return;
          if (outputVideo.current) { outputVideo.current.srcObject = remote; void outputVideo.current.play().catch(() => {}); }
          setReady(true); setStatus('Live try-on');
        },
      });
      if (attempt !== run.current) { connection.disconnect(); return; }
      session.current = connection;
      connection.on('error', () => { if (attempt === run.current) { stop('Session ended'); setError('Connection interrupted. Please try again.'); } });
      connection.on('sessionEnded', () => { if (attempt === run.current) stop('Session finished'); });
    } catch (err) {
      if (attempt !== run.current) return;
      stop('Unable to start');
      setError(err instanceof DOMException && err.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access in your browser and try again.' : err instanceof DOMException && err.name === 'NotFoundError' ? 'No camera found. Connect a camera and try again.' : err instanceof Error ? err.message : 'Unable to start try-on.');
    }
  }

  return <>
    <button type="button" aria-haspopup="dialog" aria-controls={id} onClick={() => { dialog.current?.showModal(); setOpen(true); setError(''); setStatus('Ready to try'); }} className="inline-flex items-center gap-2 whitespace-nowrap text-[16px] font-medium tracking-[-0.02em] hover:text-muted">
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.1-1.5 2.4m0 0 8.8 5.1a1.6 1.6 0 0 1-.8 3H4a1.6 1.6 0 0 1-.8-3L12 11Z" /></svg>Try-ons
    </button>
    <dialog ref={dialog} id={id} aria-label="Try-ons" onClose={() => { stop(); setOpen(false); }}
      onPointerDown={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        backdropPress.current = event.target === event.currentTarget &&
          (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
      }}
      onClick={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (backdropPress.current && event.target === event.currentTarget && outside) {
          stop();
          event.currentTarget.close();
        }
        backdropPress.current = false;
      }}
      className="fitting-room" data-lenis-prevent>
      <div className="fitting-room-header"><img src="/images/trylivo-wordmark.png" alt="TRYLIVO" /><button aria-label="Close try-ons" onClick={() => { stop(); dialog.current?.close(); }} className="fitting-room-close"><CloseIcon size={16} /></button></div>
      {open && <div className="fitting-room-layout">
        <div className="fitting-room-stage">
          <div className="fitting-mirror" data-live={ready}>
            <div className="fitting-mirror-glass">
              <video ref={outputVideo} autoPlay playsInline muted className={`fitting-mirror-output ${ready ? '' : 'invisible'}`} />
              {!ready && <div className="fitting-mirror-idle">{portrait && <img src={portrait.src} alt={`${product.title} in ${color} — product photo`} />}<span className="fitting-preview-label">Product preview</span></div>}
              <video ref={inputVideo} autoPlay playsInline muted aria-label="Your camera" className={`fitting-mirror-original ${active ? '' : 'hidden'}`} />
            </div>
          </div>
          <div role="status" className="fitting-room-status"><span className={ready ? 'is-live' : ''} />{status}{active && ` · ${seconds}s`}</div>
        </div>
        <div className="fitting-room-details">
          <div className="fitting-room-heading"><h2>Try-ons</h2><p>Try this piece on with your camera.</p></div>
          <div className="fitting-room-garment">{garment && <img src={garment.src} alt={`${product.title} in ${color}`} />}<div><h3>{product.title}</h3><p>{color}</p></div></div>
          <p className="fitting-room-guidance">Keep your upper body in view, with good lighting.</p>
          {configured === false && <p role="status" className="mt-3 text-sm text-muted">Try-ons is unavailable right now.</p>}
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          <div className="fitting-room-actions">
            {active ? <button onClick={() => stop()} className="fitting-room-start">Stop try-on <span aria-hidden="true">×</span></button> : <button disabled={!configured || !garment} onClick={start} className="fitting-room-start">Start {clip ? 'video' : 'camera'} try-on <span aria-hidden="true">↗</span></button>}
            {!active && <div className="fitting-room-upload"><label>{clip ? 'Change video' : 'Or use a short video'}<input aria-label="Try-on video" type="file" accept="video/mp4,video/webm" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 50 * 1024 * 1024) { setError('Choose a video smaller than 50 MB.'); return; } setClip(file); setError(''); }} /></label>{clip && <div className="mt-2"><p className="truncate">{clip.name}</p><button onClick={() => setClip(null)}>Use camera instead</button></div>}</div>}
          </div>
          <p className="fitting-room-notice">30-second preview · No microphone<br />Starting sends your {clip ? 'video' : 'camera video'} and garment to Decart. AI fit may vary. Watermark included.</p>
        </div>
      </div>}
    </dialog>
  </>;
}
