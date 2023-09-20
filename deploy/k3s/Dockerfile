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
# k9s kubetail jq
# traceroute emacs zip
#
# already available
# nc pstree tcpdump curl wget top htop dig tmux
# pstree tracepath mtr ss grep sed wget nslookup nano screen tmux ufw tar

RUN <<EOF
  # Install k3s and deps
  set -vex
  . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
  nix-env -i k3s
  # TODO: tar has a few issues that prevent deterministic builds
  # Either post-process, or use some other tool
  tar --owner=0 --group=0 --numeric-owner -cf nix.tar nix
EOF
