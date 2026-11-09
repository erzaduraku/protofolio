'use client';

import dynamic from 'next/dynamic';

/**
 * Loads the chatbot (panel, robot launcher, useChatLauncher) in its own chunk after hydration,
 * so it is not part of every page's initial JS. `ssr: false` is only allowed in a Client Component
 * in the App Router, hence this small wrapper used by app/[locale]/layout.js.
 */
const ChatWidget = dynamic(() => import('../ChatWidget'), { ssr: false });

export default function ChatWidgetLazy(props) {
  return <ChatWidget {...props} />;
}
