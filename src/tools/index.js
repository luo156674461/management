var CryptoJS = require('crypto-js')

function encrypt(string) {
  var key = CryptoJS.enc.Utf8.parse('1234567890123456')
  var iv = CryptoJS.enc.Utf8.parse('1234560123456789')
  var password = CryptoJS.enc.Utf8.parse(string)
  var encrypted = CryptoJS.AES.encrypt(password, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}

function decrypt(string) {
  var key = CryptoJS.enc.Utf8.parse('1234567890123456')
  var iv = CryptoJS.enc.Utf8.parse('1234560123456789')
  var decrypted = CryptoJS.AES.decrypt(string, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypted).toString()
}

export default { encrypt, decrypt }
