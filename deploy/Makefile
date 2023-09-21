.PHONY: kubernetes/dist/all.yaml helm/dist/all.yaml k3s/dist/nix.tar

default: dist/manifest.yaml build/api-image.tar k3s/dist/bundle.tar
	docker build -t installer:dev .
	# AppImageKit will create exact same arch AppImage as the kit itself
	docker create --name installer-arm64 installer:dev
	docker cp installer-arm64:SampleApp-aarch64.AppImage ./dist
	docker rm installer-arm64
	# docker create --name installer-amd64 installer:dev
	# docker cp installer-amd64:SampleApp-x86_64.AppImage ./dist
	# docker rm installer-amd64

dist/manifest.yaml: kubernetes/dist/all.yaml helm/dist/all.yaml
	cat $^ > $@

kubernetes/dist/all.yaml:
	make -C kubernetes

helm/dist/all.yaml:
	make -C helm

# There's going to be more here
k3s/dist/bundle.tar:
	make -C k3s

clean:
	make -C k3s clean
	make -C helm clean
	make -C kubernetes clean
