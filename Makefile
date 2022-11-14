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
##@ script to running nsq consumer / producer
################################################################################
nodejs-nsq-consumer:
	@yarn run-consumer

nodejs-nsq-producer:
	@yarn run-producer

golang-nsq-consumer:
	@go run golang/consumer/consumer.go

golang-nsq-producer:
	@go run golang/producer/producer.go

################################################################################
##@ Script to communicate with provider
################################################################################
scripts-vm-agent:
	@./nodejs/providers/virtual-machine/scripts/kratos-agent-manager -rep=https://github.com/creativetimofficial/nextjs-material-kit.git -fra=skipper-framework -dir=. -pre="yarn" -pos="yarn build" -dev=true -cli=developer

scripts-ghaction:
	@echo "Coming Soon if need....!!"

scripts-cloudbuild:
	@echo "Coming Soon if need....!!"