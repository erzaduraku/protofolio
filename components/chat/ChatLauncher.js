'use client';

import ChatRobot from '../ChatRobot';
import { BUBBLE_POS } from './constants';

/** Draggable floating robot button + speech bubble. */
export default function ChatLauncher({
  open,
  t,
  launcherRef,
  walkerRef,
  bubbleRef,
  quietRef,
  bubbleIdx,
  bubbleShown,
  setBubbleShown,
  bubbleSide,
  robotMode,
  photoIdx,
  jokeIdx,
  onLauncherClick,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
}) {
  const bubbleText =
    bubbleIdx === 'photo'
      ? typeof photoIdx === 'string'
        ? t.robotPhotoComments[photoIdx]
        : t.robotPhotoJokes[photoIdx]
      : bubbleIdx === 'joke'
        ? jokeIdx < 0
          ? t.robotSecret
          : t.robotJokes[jokeIdx]
        : bubbleIdx === 'idle'
          ? t.robotIdle
          : bubbleIdx === 'back'
            ? t.robotBack
            : (t.robotPrompts[bubbleIdx] ?? t.robotPrompts[0]);

  return (
    <button
      ref={launcherRef}
      type="button"
      onClick={onLauncherClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      aria-expanded={open}
      aria-controls="chat-title"
      aria-label={open ? t.close : t.robotLabel}
      className={`group fixed right-3 bottom-3 z-70 cursor-grab touch-none items-center rounded-full select-none data-[dragging=true]:cursor-grabbing p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk sm:right-5 sm:bottom-5 ${
        open ? 'hidden sm:flex' : 'flex'
      }`}
    >
      <span ref={walkerRef} className="relative block">
        <span
          ref={bubbleRef}
          aria-hidden="true"
          className={`pointer-events-none absolute w-max max-w-[min(220px,calc(100vw-16px))] ${BUBBLE_POS[bubbleSide]} whitespace-normal wrap-break-word rounded-2xl border border-ink/15 bg-paper px-3 py-2 text-left text-sm leading-snug text-ink shadow-lg transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none ${
            bubbleShown && !open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          }`}
        >
          <span
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              quietRef.current = true;
              // quiet for 1 minute only, then the prompts come back
              setTimeout(() => (quietRef.current = false), 60000);
              setBubbleShown(false);
            }}
            className={`absolute -top-2 -right-2 grid size-5 cursor-pointer place-items-center rounded-full border border-ink/15 bg-paper text-[10px] leading-none text-ink/70 shadow hover:text-ink ${bubbleShown && !open ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            ✕
          </span>
          {bubbleText}
        </span>
        <ChatRobot mode={open ? 'normal' : robotMode} />
      </span>
    </button>
  );
}
