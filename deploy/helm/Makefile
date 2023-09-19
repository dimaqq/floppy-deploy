CHARTS := mongodb api worker

dist/all.yaml: $(patsubst %,build/%.yaml,$(CHARTS)) build/minio.yaml
	cat $^ > dist/all.yaml

define build_chart
build/$(1).yaml: $(wildcard $(1)/*.yaml $(1)/*/*.yaml)
	helm template ignored $(1) --namespace data-store --include-crds > $$@
endef

$(foreach dir,$(CHARTS),$(eval $(call build_chart,$(dir))))

build/minio.yaml: minio/minio-12.8.5.tgz minio/values.yaml
	helm template minio minio/minio-12.8.5.tgz --namespace data-store --include-crds --values minio/values.yaml > $@

minio/minio-12.8.5.tgz:
	test -f $@ || helm pull oci://registry-1.docker.io/bitnamicharts/minio --version 12.8.5 -d minio

clean:
	rm -rf minio/minio-12.8.5.tgz
	rm -rf build/*.yaml
	rm -rf dist/*.yaml
