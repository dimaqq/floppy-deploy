.PHONY: kubernetes/dist/all.yaml helm/dist/all.yaml k3s/dist/nix.tar

dist/manifest.yaml: kubernetes/dist/all.yaml helm/dist/all.yaml
	cat $^ > $@

kubernetes/dist/all.yaml:
	make -C kubernetes

helm/dist/all.yaml:
	make -C helm

# There's going to be more here
k3s/dist/nix.tar:
	make -C k3s

clean:
	make -C k3s clean
	make -C helm clean
	make -C kubernetes clean
