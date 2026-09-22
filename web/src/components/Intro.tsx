import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mascot } from './Mascot';

const KEY = 'swaprika.entered';

/**
 * Click to enter gate.
 *
 * Server rendered so it is present on first paint with no flash, and hidden by
 * a noscript rule in the page so a visitor without JavaScript is never locked
 * out. Dismissal is remembered for the session only, so a reload during the
 * same visit does not replay it.
 */
export default function Intro() {
  const [open, setOpen] = useState(true);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === '1') setOpen(false);
    } catch {
      /* private mode, blocked storage: just show it */
    }
  }, []);

  const enter = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    btn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, enter]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Enter Swaprika"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onClick={enter}
        >
          <motion.div
            className="intro-inner"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Mascot mood="idle" size={190} />
            </motion.div>

            <h1 className="intro-title">Swaprika</h1>
            <p className="intro-tag">
              What can replace this ingredient, in this situation,
              <br />
              and what changes if you do.
            </p>

            <button ref={btn} className="intro-btn" onClick={enter}>
              Click to enter
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
