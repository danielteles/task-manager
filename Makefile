.PHONY: all install_client install_server

all: install_client install_server

install_client:
	cd client/task-manager && npm i && cd ../..

install_server:
	cd server && npm i && cd ..
