/**
 *
 * @param {number} v a number to be limited
 * @param {number} min the minimal value to return
 * @param {number} max the maximal value to return
 * @eturns the value v limited to the interval [min, max] v if v is in [min, max] else min if v is less than
 */
export function clamp(v, min, max) {
  return Math.max(min, Math.min(v, max));
}
