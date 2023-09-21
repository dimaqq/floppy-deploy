default: build/api-image.tar
	# Make a bit ugly, but it's better to inject the input explicitly than have subdir make call parent make
	# FIXME: unconditional copy forces rebuild down the line
	cp build/api-image.tar deploy/build/
	make -C deploy

build/api-image.tar:
	docker build -t floppies:dev --platform linux/amd64,linux/arm64 .
	docker save -o build/api-image.tar floppies:dev

clean:
	make -C deploy clean
	rm -f build/*
