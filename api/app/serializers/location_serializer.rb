class LocationSerializer < ApplicationSerializer
  identifier :id
  fields *%i(human_name)
end
