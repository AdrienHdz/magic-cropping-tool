UVICORN ?= uvicorn 

.PHONY : run

run: 
	$(UVICORN) api.main:app

dev: 
	. $(PWD)/.env 
	$(UVICORN) --reload api.main:app