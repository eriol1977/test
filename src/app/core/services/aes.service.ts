import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AESService {
  private ENCRYPTION_KEY = CryptoJS.enc.Base64.parse(
    'a3NlJCRyJXBwZGd0IWM0NQ=='
  );
  private ENCRYPTION_IV = CryptoJS.enc.Base64.parse('WmVJQjY3JCE9LmVSP3NhNw==');

  encryptStr(str: string): string {
    // Psw Encryption in AES MODE with Key and Iv method (AES/CBC/PKS7Padding)
    var stringToEncrypt = str.toString();
    var encrypted = CryptoJS.AES.encrypt(stringToEncrypt, this.ENCRYPTION_KEY, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: this.ENCRYPTION_IV,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  decryptStr(str: string): string {
    // String Decryption in AES MODE with Key and Iv method (AES/CBC/PKS7Padding)
    var stringToDecrypt = str.toString();
    var decrypted = CryptoJS.AES.decrypt(stringToDecrypt, this.ENCRYPTION_KEY, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: this.ENCRYPTION_IV,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
