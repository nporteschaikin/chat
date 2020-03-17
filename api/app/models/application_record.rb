class ApplicationRecord < ActiveRecord::Base
  include PgSearch::Model
  include EncryptedColumn

  self.abstract_class = true
end
