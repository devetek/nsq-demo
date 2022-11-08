docker-build-sshserver:
	@docker build -f ssh-server/Dockerfile.ssh -t prakasa1904/ubuntu-sshserver:latest .

sshserver:
	@ssh -i ssh-server/id_rsa_fake root@localhost


vm-agent:
	@echo "require python 3.x"
	@python ./scripts/main.py