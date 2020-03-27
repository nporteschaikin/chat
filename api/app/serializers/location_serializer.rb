class LocationSerializer < ApplicationSerializer
  identifier :id
  fields *%i(handle human_name)
end
