Most of these are integrated already

```
wget https://github.com/k3s-io/k3s/releases/download/v1.25.14-rc1%2Bk3s1/k3s-airgap-images-arm64.tar.gz
gunzip k3s-airgap-images-arm64.tar.gz
mkdir -p /var/lib/rancher/k3s/agent/images/
cp k3s-airgap-images-arm64.tar /var/lib/rancher/k3s/agent/images/

wget https://github.com/k3s-io/k3s/releases/download/v1.25.14-rc1%2Bk3s1/k3s-arm64
chmod a+x k3s-arm64
cp k3s-arm64 /usr/local/bin/
(cd /usr/local/bin/; ln -s k3s-arm64 k3s)

ufw disable

# Must have a default route, even if that's unreachable, e.g.
ip link add dummy0 type dummy
ip link set dummy0 up
ip addr add 169.254.255.254/31 dev dummy0
ip route add default via 169.254.255.255 dev dummy0 metric 1000

wget https://get.k3s.io -O install.sh
INSTALL_K3S_SKIP_DOWNLOAD=true sh ./install.sh
```
