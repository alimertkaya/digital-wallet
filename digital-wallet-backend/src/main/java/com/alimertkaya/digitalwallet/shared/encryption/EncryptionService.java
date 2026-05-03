package com.alimertkaya.digitalwallet.shared.encryption;

public interface EncryptionService {
    String encrypt(String plaintext);
    String decrypt(String ciphertext);
}
