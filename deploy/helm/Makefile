CHARTS := mongodb api worker

all: $(patsubst %,dist/%.yaml,$(CHARTS)) dist/minio.yaml
	cat $^ > dist/helm.yaml

define build_chart
TARGET := dist/$(1).yaml
dist/$(1).yaml: $(wildcard $(1)/*.yaml $(1)/*/*.yaml)
	helm template ignored $(1) --namespace data-store --include-crds > $$@
endef

$(foreach dir,$(CHARTS),$(eval $(call build_chart,$(dir))))

dist/minio.yaml: minio/minio-12.8.5.tgz minio/values.yaml
	helm template minio minio/minio-12.8.5.tgz --namespace data-store --include-crds --values minio/values.yaml > dist/minio.yaml

minio/minio-12.8.5.tgz:
	test -f $@ || helm pull oci://registry-1.docker.io/bitnamicharts/minio --version 12.8.5 -d minio

clean:
	rm -rf minio/minio-12.8.5.tgz
	rm -rf dist/*.yaml
