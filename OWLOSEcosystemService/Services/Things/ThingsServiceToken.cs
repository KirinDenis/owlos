using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace OWLOSEcosystemService.Services.Things
{
    public partial class ThingsService : IThingsService
    {
        #region Crypt
        //Crypt codes from:
        //https://docs.microsoft.com/en-us/previous-versions/windows/silverlight/dotnet-windows-silverlight/bb352553(v=vs.95)?redirectedfrom=MSDN
        //https://coderoad.ru/202011/%D0%A8%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B8-%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BA%D0%B0-%D1%81%D1%82%D1%80%D0%BE%D0%BA%D0%B8-%D0%B2-C


        private static byte[] GetRandom256BitsSals()
        {
            byte[] sals = new byte[32]; 
            new RNGCryptoServiceProvider().GetBytes(sals);            
            return sals;
        }

        private const int Iterations = 1024;

        /// <summary>
        /// 256 bits key length
        /// </summary>
        private const int keyLength = 256;


        /// <summary>
        /// Encrypt the given string using AES.  The string can be decrypted using 
        /// DecryptStringAES().  The sharedSecret parameters must match.
        /// </summary>
        /// <param name="plainText">The text to encrypt.</param>
        /// <param name="sharedSecret">A password used to generate a key for encryption.</param>
        public static string EncryptStringAES(string plainText, string sharedSecret)
        {

            string outStr = null;                       // Encrypted string to return
            RijndaelManaged aesAlg = null;              // RijndaelManaged object used to encrypt the data.

            try
            {
                byte[] salt = GetRandom256BitsSals();
                // generate the key from the shared secret and the salt
                Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(sharedSecret, salt, Iterations);

                // Create a RijndaelManaged object
                aesAlg = new RijndaelManaged();
                aesAlg.Key = key.GetBytes(aesAlg.KeySize / 8);

                // Create a decryption to perform the stream transform.
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    // prepends salt                    
                    msEncrypt.Write(salt, 0, salt.Length);
                    // prepends the IV
                    msEncrypt.Write(BitConverter.GetBytes(aesAlg.IV.Length), 0, sizeof(int));
                    msEncrypt.Write(aesAlg.IV, 0, aesAlg.IV.Length);
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                    }
                    outStr = Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
            finally
            {
                // Clear the RijndaelManaged object.
                if (aesAlg != null)
                {
                    aesAlg.Clear();
                }
            }

            // Return the encrypted bytes from the memory stream.
            return outStr;
        }

        /// <summary>
        /// Decrypt the given string.  Assumes the string was encrypted using 
        /// EncryptStringAES(), using an identical sharedSecret.
        /// </summary>
        /// <param name="cipherText">The text to decrypt.</param>
        /// <param name="sharedSecret">A password used to generate a key for decryption.</param>
        public static string DecryptStringAES(string cipherText, string sharedSecret)
        {

            RijndaelManaged aesAlg = null;
            try
            {
                byte[] bytes = Convert.FromBase64String(cipherText);

                //read salt from cipherText
                byte[] salt = bytes.Take(keyLength / 8).ToArray();
                bytes = bytes.Skip(keyLength / 8).Take(bytes.Length - keyLength / 8).ToArray();

                Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(sharedSecret, salt, Iterations);

                // Create the streams used for decryption.                
                using (MemoryStream msDecrypt = new MemoryStream(bytes))
                {
                    // Create a RijndaelManaged object with the specified key and IV.
                    aesAlg = new RijndaelManaged();

                    aesAlg.Key = key.GetBytes(aesAlg.KeySize / 8);
                    // Get the initialization vector from the encrypted stream
                    aesAlg.IV = ReadByteArray(msDecrypt);

                    // Create a decrytor to perform the stream transform.
                    ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
            finally
            {
                // Clear the RijndaelManaged object.
                if (aesAlg != null)
                {
                    aesAlg.Clear();
                }
            }

            return string.Empty;
        }

        private static byte[] ReadByteArray(Stream s)
        {
            byte[] rawLength = new byte[sizeof(int)];
            if (s.Read(rawLength, 0, rawLength.Length) != rawLength.Length)
            {
                throw new SystemException("Stream did not contain properly formatted byte array");
            }

            byte[] buffer = new byte[BitConverter.ToInt32(rawLength, 0)];
            if (s.Read(buffer, 0, buffer.Length) != buffer.Length)
            {
                throw new SystemException("Did not read byte array properly");
            }

            return buffer;
        }
        #endregion

        public string CreateThingToken(ThingTokenDTO thingTokenDTO)
        {
            byte[] sign = Encoding.UTF8.GetBytes("OWLOSThingToken");
            byte[] userId = Encoding.UTF8.GetBytes(thingTokenDTO.UserId.ToString());
            byte[] thingName = Encoding.UTF8.GetBytes(thingTokenDTO.ThingName);
            byte[] currentTime = BitConverter.GetBytes(thingTokenDTO.CreationDateTime.ToBinary());
            
            byte[] cryptSource = new byte[sign.Length + userId.Length + thingName.Length + currentTime.Length];

            Buffer.BlockCopy(sign, 0, cryptSource, 0, sign.Length);
            Buffer.BlockCopy(userId, 0, cryptSource, sign.Length, userId.Length);
            Buffer.BlockCopy(thingName, 0, cryptSource, sign.Length + userId.Length, thingName.Length);
            Buffer.BlockCopy(currentTime, 0, cryptSource, sign.Length + userId.Length + thingName.Length, currentTime.Length);

            return Convert.ToBase64String(Encoding.UTF8.GetBytes(EncryptStringAES(Convert.ToBase64String(cryptSource.ToArray()), "tokenCode")));            
        }

        public ThingTokenDTO DecodeThingToken(string thingToken)
        {
            if (String.IsNullOrEmpty(thingToken))
            {
                return null;
            }
            
            try
            {                
                thingToken = Encoding.UTF8.GetString(Convert.FromBase64String(thingToken));
                thingToken = DecryptStringAES(thingToken, "tokenCode");
                byte[] cryptSource = Convert.FromBase64String(thingToken);
                string decodedToken = Encoding.UTF8.GetString(cryptSource);

                if (decodedToken.Contains("OWLOSThingToken"))
                {
                    ThingTokenDTO result = new ThingTokenDTO();
                    result.ThingName = decodedToken;
                    return result;
                }
            }
            catch { }

            return null;
        }


    }
}
