# Welcome to Tilt!
#   To get you started as quickly as possible, we have created a
#   starter Tiltfile for you.
#
#   Uncomment, modify, and delete any commands as needed for your
#   project's configuration.


# Output diagnostic messages
#   You can print log messages, warnings, and fatal errors, which will
#   appear in the (Tiltfile) resource in the web UI. Tiltfiles support
#   multiline strings and common string operations such as formatting.
#
#   More info: https://docs.tilt.dev/api.html#api.warn
print(
    """
-----------------------------------------------------------------
✨ Hello Tilt! This appears in the (Tiltfile) pane whenever Tilt
   evaluates this file.
-----------------------------------------------------------------
""".strip()
)

docker_build(
    "floppies",
    ".",
    only=["package.json", "package-lock.json", "tsconfig.json", "src"],
    build_args={"platform": "linux/amd64,linux/arm64"},
    extra_tag="floppies:dev",
)

load("ext://namespace", "namespace_create", "namespace_inject")
namespace_create("data-store")
k8s_yaml("deploy/kubernetes/network-policy.yaml")

namespace_create("web-api")

load("ext://helm_resource", "helm_resource", "helm_repo")
load("ext://helm_remote", "helm_remote")

helm_remote(
    "minio",
    repo_name="bitnami",
    repo_url="https://charts.bitnami.com/bitnami",
    namespace="data-store",
    values=["deploy/helm/minio/values.yaml"],
)

mongo_yaml = helm(
    "deploy/helm/mongodb",
    # The release name, equivalent to helm --name
    # name='release-name',
    # The namespace to install in, equivalent to helm --namespace
    namespace="data-store",
    # The values file to substitute into the chart.
    # values=['./path/to/chart/dir/values-dev.yaml'],
    # Values to set from the command-line
    # FIXME: not sure if it's needed...
    # FIXME: drop ingress when API works
    set=["service.port=27017", "ingress.enabled=true"],
)

k8s_yaml(mongo_yaml)


api_yaml = helm(
    "deploy/helm/api",
    # The release name, equivalent to helm --name
    # name='release-name',
    # The namespace to install in, equivalent to helm --namespace
    # FIXME: temporary, get this to work first, then move to own namespace
    namespace="web-api",
    # The values file to substitute into the chart.
    # values=['./path/to/chart/dir/values-dev.yaml'],
    # Values to set from the command-line
    # FIXME: not sure if it's needed...
    # FIXME: drop ingress when API works
    set=["service.port=3000", "ingress.enabled=true"],
)

k8s_yaml(api_yaml)

worker_yaml = helm("deploy/helm/worker", namespace="web-api")

k8s_yaml(worker_yaml)


# FIXME these dependencies must be replicated somehow in production
k8s_resource("minio", port_forwards="9000:9000")
k8s_resource("mongodb", port_forwards="27017:27017")
k8s_resource("api", resource_deps=["minio", "mongodb"], port_forwards="3000:3000")
k8s_resource("worker", resource_deps=["minio", "mongodb"])

# Build Docker image
#   Tilt will automatically associate image builds with the resource(s)
#   that reference them (e.g. via Kubernetes or Docker Compose YAML).
#
#   More info: https://docs.tilt.dev/api.html#api.docker_build
#
# docker_build('registry.example.com/my-image',
#              context='.',
#              # (Optional) Use a custom Dockerfile path
#              dockerfile='./deploy/app.dockerfile',
#              # (Optional) Filter the paths used in the build
#              only=['./app'],
#              # (Recommended) Updating a running container in-place
#              # https://docs.tilt.dev/live_update_reference.html
#              live_update=[
#                 # Sync files from host to container
#                 sync('./app', '/src/'),
#                 # Execute commands inside the container when certain
#                 # paths change
#                 run('/src/codegen.sh', trigger=['./app/api'])
#              ]
# )


# Apply Kubernetes manifests
#   Tilt will build & push any necessary images, re-deploying your
#   resources as they change.
#
#   More info: https://docs.tilt.dev/api.html#api.k8s_yaml
#
# k8s_yaml(['k8s/deployment.yaml', 'k8s/service.yaml'])


# Customize a Kubernetes resource
#   By default, Kubernetes resource names are automatically assigned
#   based on objects in the YAML manifests, e.g. Deployment name.
#
#   Tilt strives for sane defaults, so calling k8s_resource is
#   optional, and you only need to pass the arguments you want to
#   override.
#
#   More info: https://docs.tilt.dev/api.html#api.k8s_resource
#
# k8s_resource('my-deployment',
#              # map one or more local ports to ports on your Pod
#              port_forwards=['5000:8080'],
#              # change whether the resource is started by default
#              auto_init=False,
#              # control whether the resource automatically updates
#              trigger_mode=TRIGGER_MODE_MANUAL
# )


# Run local commands
#   Local commands can be helpful for one-time tasks like installing
#   project prerequisites. They can also manage long-lived processes
#   for non-containerized services or dependencies.
#
#   More info: https://docs.tilt.dev/local_resource.html
#
# local_resource('install-helm',
#                cmd='which helm > /dev/null || brew install helm',
#                # `cmd_bat`, when present, is used instead of `cmd` on Windows.
#                cmd_bat=[
#                    'powershell.exe',
#                    '-Noninteractive',
#                    '-Command',
#                    '& {if (!(Get-Command helm -ErrorAction SilentlyContinue)) {scoop install helm}}'
#                ]
# )


# Extensions are open-source, pre-packaged functions that extend Tilt
#
#   More info: https://github.com/tilt-dev/tilt-extensions
#
load("ext://git_resource", "git_checkout")


# Organize logic into functions
#   Tiltfiles are written in Starlark, a Python-inspired language, so
#   you can use functions, conditionals, loops, and more.
#
#   More info: https://docs.tilt.dev/tiltfile_concepts.html
#
def tilt_demo():
    # Tilt provides many useful portable built-ins
    # https://docs.tilt.dev/api.html#modules.os.path.exists
    if os.path.exists("tilt-avatars/Tiltfile"):
        # It's possible to load other Tiltfiles to further organize
        # your logic in large projects
        # https://docs.tilt.dev/multiple_repos.html
        load_dynamic("tilt-avatars/Tiltfile")
    watch_file("tilt-avatars/Tiltfile")
    git_checkout(
        "https://github.com/tilt-dev/tilt-avatars.git", checkout_dir="tilt-avatars"
    )


# Edit your Tiltfile without restarting Tilt
#   While running `tilt up`, Tilt watches the Tiltfile on disk and
#   automatically re-evaluates it on change.
#
#   To see it in action, try uncommenting the following line with
#   Tilt running.
# tilt_demo()
