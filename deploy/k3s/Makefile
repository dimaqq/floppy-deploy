# Local dev on macs
ARCH?=arm64
# More realistic for production
ARCH?=amd64

# There's going to be more here
# - k3s required images
# - systemd
# - PATH injection
default: dist/bundle.tar

dist/bundle.tar: build/bundle-$(ARCH).tar
	cp $< $@

all: build/nix-arm64.tar build/nix-amd64.tar

# FIXME: fix nix install issue with multiarch where it tests of eBPF program can be loaded
# Current workaround: separate rules to build for the 2 architectures
build/bundle-arm64.tar: Dockerfile
	docker build -t nix:dev-arm64  --platform linux/arm64 .
	docker create --name nix-tmp-arm64 nix:dev-arm64
	docker cp nix-tmp-arm64:/bundle.tar $@
	docker rm nix-tmp-arm64

build/bundle-amd64.tar: Dockerfile
	docker build -t nix:dev-amd64  --platform linux/amd64 .
	docker create --name nix-tmp-amd64 nix:dev-amd64
	docker cp nix-tmp-amd64:/bundle.tar $@
	docker rm nix-tmp-amd64

clean:
	docker rm nix-tmp-arm64 || true
	docker rmi nix:dev-arm64 || true
	docker rm nix-tmp-amd64 || true
	docker rmi nix:dev-amd64 || true
	rm -rf build/*.tar
	rm -rf dist/*.tar
