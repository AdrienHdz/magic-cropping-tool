UVICORN ?= uvicorn 

.PHONY : run

run: 
	$(UVICORN) api.main:app

dev: 
	$(UVICORN) --reload api.main:app