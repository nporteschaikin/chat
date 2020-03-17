.PHONY: deploy.api deploy.web

deploy.api:
	git push -f https://git.heroku.com/npc-chat-api.git HEAD:master
deploy.web:
	git push -f https://git.heroku.com/npc-chat-web.git HEAD:master
