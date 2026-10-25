// Everything that leaves the browser is sealed with a key that only lives in the
// share link, after the #. Browsers never send that part to a server, so the
// relay stores and forwards bytes it cannot read.

const toBase64Url = (bytes: Uint8Array) => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (text: string) => {
  const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

export const randomId = (bytes = 16) => toBase64Url(crypto.getRandomValues(new Uint8Array(bytes)))

export const makeKey = () => crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])

export const exportKey = async (key: CryptoKey) => toBase64Url(new Uint8Array(await crypto.subtle.exportKey('raw', key)))

export const importKey = (text: string) => crypto.subtle.importKey('raw', fromBase64Url(text), 'AES-GCM', false, ['encrypt', 'decrypt'])

export const seal = async (key: CryptoKey, plain: Uint8Array) => {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new Uint8Array(plain)))
  const out = new Uint8Array(iv.length + sealed.length)
  out.set(iv)
  out.set(sealed, iv.length)
  return toBase64Url(out)
}

export const unseal = async (key: CryptoKey, text: string) => {
  const bytes = fromBase64Url(text)
  return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.subarray(0, 12) }, key, bytes.subarray(12)))
}
