module ApplicationCable
  class Channel < ActionCable::Channel::Base
    class Event
      def initialize(attributes)
        @attributes = attributes
      end

      def to_json
        {
          type: self.class.name.demodulize,
          attributes: attributes,
        }
      end

      private

      attr_reader :attributes
    end

    class << self
      def broadcast_event_to(broadcast, event_type, attributes)
        broadcast_to(broadcast, event_type.new(attributes).to_json)
      end
    end
  end
end
