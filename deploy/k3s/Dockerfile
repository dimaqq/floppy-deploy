FROM ubuntu:22.04

RUN <<EOF
  # Install build-time deps
  set -vex
  apt update
  apt install -y curl xz-utils
  yes | unminimize
EOF

RUN <<EOF
  # Install nix
  set -vex
  curl --fail https://releases.nixos.org/nix/nix-2.17.0/install > install.sh
  # TODO: continue the attempt to get multi-platform build to work...
  # export NIX_INSTALL_ARGS="install linux --extra-conf 'sandbox = false' --extra-conf 'filter-syscalls = false' --init none --no-confirm"
  sh install.sh --daemon --yes
EOF

# FIXME: patch up VM at runtime
#  cat >> /etc/bash.bashrc <<BASHOFF
# Nix
# if [ -e '/nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh' ]; then
#   . '/nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh'
# fi
# End Nix
# BASHOFF

# FIXME: add tools that on-site SRE may need to debug and fix stuff in airgapped production
# k9s kubetail jq traceroute vim  # work ok
# emacs zip  # nix builds those from source and installs way too many deps to do that
#
# already available
# nc pstree tcpdump curl wget top htop dig tmux
# pstree tracepath mtr ss grep sed wget nslookup nano screen tmux ufw tar

RUN <<EOF
  # Install k3s and deps
  set -vex
  . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
  # Prod cluster
  nix-env -i k3s
  # SRE tools
  nix-env -i k9s kubetail jq traceroute vim
  # Cleanup
  nix-store --gc
EOF

RUN <<EOF
  # Fetch k3s images
  mkdir -p /var/lib/rancher/k3s/agent/images/
  [ `arch` = aarch64 ] && tag=arm64 || tag=amd64
  curl -sL --fail https://github.com/k3s-io/k3s/releases/download/v1.27.5%2Bk3s1/k3s-airgap-images-$tag.tar -o /var/lib/rancher/k3s/agent/images/k3s.tar
EOF

COPY ./k3s.service /etc/systemd/system/

RUN <<EOF
  # Bundle k3s and images
  # TODO: tar has a few issues that prevent deterministic builds
  # Either post-process, or use some other tool
  tar --owner=0 --group=0 --numeric-owner -cf bundle.tar nix var/lib/rancher /etc/systemd/system/k3s.service
EOF
