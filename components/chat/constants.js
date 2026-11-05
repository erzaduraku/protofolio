/** Shared chat widget constants. */
export const MAX_RETRIES = 3; // automatic resends after a rate limit
export const DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag
export const EDGE = 8; // keep the launcher this far from the viewport edges
export const PANEL_W = 384;
export const PANEL_MAX_H = 576;
export const POS_KEY = 'chat-launcher-offset';

// Speech bubble placement per side; the squared corner acts as the tail toward the robot.
export const BUBBLE_POS = {
  left: 'right-full bottom-[60%] mr-1 rounded-br-sm',
  right: 'left-full bottom-[60%] ml-1 rounded-bl-sm',
  'top-start': 'bottom-full left-0 mb-1 rounded-bl-sm',
  'top-end': 'bottom-full right-0 mb-1 rounded-br-sm',
};

// The greeting is a marker; its text is rendered in the page language.
export const GREETING = { role: 'assistant', content: '', greeting: true };
