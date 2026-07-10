/**
 * The founder of GitGrimoire — like a certain magic-less knight, chosen by a
 * black five-leaf grimoire and sworn to the Black Bulls.
 */
export const FOUNDER_LOGIN = "tosxin-456";

export function isFounder(login: string): boolean {
  return login.toLowerCase() === FOUNDER_LOGIN;
}
