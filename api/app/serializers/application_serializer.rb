class ApplicationSerializer < Blueprinter::Base
  class << self
    # Helper for sending date times in iso8601.
    def time_fields(*names)
      names.each do |name|
        field(name) do |obj|
          obj.public_send(name).iso8601
        end
      end
    end
  end
end
