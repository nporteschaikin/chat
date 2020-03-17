require "active_support/concern"

module EncryptedColumn
  extend ActiveSupport::Concern

  class_methods do
    def encrypted(column, prefix = :encrypted)
      define_method(column) do
        unless (value = public_send("%s_%s" % [prefix, column])).nil?
          Encryptor.decrypt(value)
        end
      end

      define_method("%s=" % column) do |value|
        unless value.nil?
          assign_attributes("%s_%s" % [prefix, column] => Encryptor.encrypt(value))
        end
      end
    end
  end
end
