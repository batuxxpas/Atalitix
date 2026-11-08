export const INTRO_DONE_EVENT = "atx:intro-done";
export const INTRO_STORAGE_KEY = "atx-intro";

/**
 * Runs inline before paint: decides whether the intro plays.
 * First visit of the session only, and never with reduced motion.
 */
export const INTRO_BOOT_SCRIPT = `try{var d=document.documentElement;if(!sessionStorage.getItem('${INTRO_STORAGE_KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='playing';}}catch(e){}`;
