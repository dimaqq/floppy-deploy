build/nix.tar:
	# FIXME: fix nix install issue with multiarch where it tests of eBPF program can be loaded
	docker build -t nix:dev  --platform linux/arm64 .
	docker create --name nix-tmp nix:dev
	docker cp nix-tmp:/nix.tar $@
	docker rm nix-tmp

clean:
	docker rm nix-tmp || true
	docker rmi nix:dev || true
