'use client';

import { useEffect, useRef, useState } from 'react';
import useMediaQuery, { REDUCED_MOTION } from '@/hooks/use-media-query';
import { useLocale } from './LocaleProvider';
import { getDict } from '@/lib/i18n';
import ChatPanel from './chat/ChatPanel';
import ChatLauncher from './chat/ChatLauncher';
import useChatApi from './chat/useChatApi';
import useChatLauncher from './chat/useChatLauncher';

/** Portfolio chatbot shell: panel + draggable robot launcher. Import path unchanged for layout. */
export default function ChatWidget() {
  const locale = useLocale();
  const t = getDict(locale).chat;
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);

  const launcher = useChatLauncher({ open, setOpen, t });
  const chat = useChatApi({ locale, t, inputRef, listRef });

  // Focus the input on open; Esc closes and restores focus.
  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        launcher.launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, launcher.launcherRef]);

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 12 },
        transition: { duration: 0.22, ease: [0.2, 0.7, 0.2, 1] },
      };

  return (
    <>
      <ChatPanel
        open={open}
        onClose={() => setOpen(false)}
        panelRef={panelRef}
        panelStyle={launcher.panelStyle}
        motionProps={motionProps}
        t={t}
        listRef={listRef}
        messages={chat.messages}
        loading={chat.loading}
        wait={chat.wait}
        rateFailed={chat.rateFailed}
        error={chat.error}
        busy={chat.busy}
        send={chat.send}
        request={chat.request}
        input={chat.input}
        setInput={chat.setInput}
        inputRef={inputRef}
        launcherRef={launcher.launcherRef}
      />
      <ChatLauncher
        open={open}
        t={t}
        launcherRef={launcher.launcherRef}
        walkerRef={launcher.walkerRef}
        bubbleRef={launcher.bubbleRef}
        quietRef={launcher.quietRef}
        bubbleIdx={launcher.bubbleIdx}
        bubbleShown={launcher.bubbleShown}
        setBubbleShown={launcher.setBubbleShown}
        bubbleSide={launcher.bubbleSide}
        robotMode={launcher.robotMode}
        photoIdx={launcher.photoIdx}
        jokeIdx={launcher.jokeIdx}
        onLauncherClick={launcher.onLauncherClick}
        onPointerDown={launcher.onPointerDown}
        onPointerMove={launcher.onPointerMove}
        onPointerEnd={launcher.onPointerEnd}
      />
    </>
  );
}
