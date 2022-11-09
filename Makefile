################################################################################
##@ sshserver development helper
################################################################################
docker-sshserver-build:
	@docker build -f ssh-server/Dockerfile.ssh -t prakasa1904/ubuntu-sshserver:latest .

docker-sshserver-enter:
	@ssh -i ssh-server/id_rsa_fake root@localhost


docker-sshserver-exec:
	@ssh -i ssh-server/id_rsa_fake root@localhost "python3 main.py"

################################################################################
##@ provider manager, script to used to communicate with the provider
################################################################################
nodejs-vm:
	@yarn run-vm

nodejs-ghaction:
	@echo "Coming Soon....!!"

nodejs-cloudbuild:
	@echo "Coming Soon....!!"


################################################################################
##@ Script to communicate with provider
################################################################################
scripts-vm-agent:
	@echo "require python 3.x"
	@python ./scripts/main.py

scripts-ghaction:
	@echo "Coming Soon if need....!!"

scripts-cloudbuild:
	@echo "Coming Soon if need....!!"