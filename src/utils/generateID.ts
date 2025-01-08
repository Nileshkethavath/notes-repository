import crypto from 'node:crypto'


export const generateID = () => {
  const length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
  let id = '', bytes=null;

  if(typeof window != 'undefined' && window.crypto)
    bytes = Array.from(window.crypto.getRandomValues(new Uint8Array(length)));
  else
    bytes = crypto.randomBytes(length);

  for(let i = 0; i < length; i++){
    id += chars[bytes[i] % chars.length]
  }

  return id;
}

export default generateID