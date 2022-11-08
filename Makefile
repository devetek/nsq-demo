docker-build-sshserver:
	@docker build -f ssh-server/Dockerfile.ssh -t prakasa1904/ubuntu-sshserver:latest .

sshserver:
	@ssh -i ssh-server/id_rsa_fake root@localhost


sshserver-exec:
	@ssh -i ssh-server/id_rsa_fake root@localhost "python3 main.py"

node-sshclient:
	@cd nodejs && PROVIDER=virtual-machine ENV=development node providers/virtual-machine.js


vm-agent:
	@echo "require python 3.x"
	@python ./scripts/main.py