class Encryptor
  class << self
    def base_encryptor
      ActiveSupport::MessageEncryptor.new(
        ActiveSupport::KeyGenerator.new(Rails.application.secret_key_base).generate_key(
          ENV.fetch("ENCRYPTOR_SALT"),
          ActiveSupport::MessageEncryptor.key_len,
        ),
      )
    end
  end

  def self.encrypt(value)
    new.encrypt(value)
  end

  def self.decrypt(value)
    new.decrypt(value)
  end

  def encrypt(value)
    unless value.nil?
      self.class.base_encryptor.encrypt_and_sign(value)
    end
  end

  def decrypt(value)
    unless value.nil?
      self.class.base_encryptor.decrypt_and_verify(value)
    end
  end
end
