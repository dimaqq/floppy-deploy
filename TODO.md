## Plan

- Discussion
  - Ideally, I'd distribute the software as a VM image:
    - Software on the distributed VM image disk, in installed and working state
    - Customer data on an attached disk
  - But, the requirements being what they are, I'm thinking the next best thing is ...
- Concept
  - Don't touch the host OS
  - install software into ~`/opt` or similar~ `/nix` (as much as possible)
  - store data e.g. in `/var`, don't clear on uninstall
  - upgrade = uninstall + install
  - upgrade only needs to detect existing customer data
  - downgrade is the application's problem
  - testability first, the installer will be used in automated tests more than in real deployments
- Κυβερνήτης
  - [ ] ~play around with `k0s`, because it's cool~ maybe later
  - [x] get the setup to work on local machine, that's what future devs will use
    - Docker Desktop with k8s enabled
    - tilt.dev
- Dependencies
  - local image repository (except k0s can preload from a directory?)
  - etcd
- Installer
  - [x] try `nix` because both build and deploy is reproducible
    - nix installation is very nice and clean, but...
    - It turns out that while nix ships `.service` files with the installed packages and these files are meant to integrate into `systemd`, the integration only works with nixOS and not e.g. Ubuntu `systemd`.
    - Upgrading VM in place to nixOS... is tempting
    - Getting the files into the VM using nix bolting systemd integration on top is doable, though fragile
    - Relying on k3s/helm/etc. executable installed on Ubuntu is more fragile though, esp. the cleanup and upgrade parts
  - [x] try Snap
    - k3s not available, there's a 2-year-old private project though
  - [x] try Flatpak
    - doesn't seem to be available
- Integration
  - [ ] set up GHA for components
  - [x] port to `k3s`, because it's a stated requirement
  - [ ] automated smoke test
- Installer
  - [x] AppImage
  - [x] some scripting, e.g. ~micropython~ python or bash
    - there's x86_64 python AppImage out there, but no arm64 version
    - ubuntu server (default) install includes python3, but I'm not clear if this can be relied on
    - I'll use bash for now
  - [x] a bunch of tar files
    - k3s images
    - api image
  - [ ] Traefik chart
    - k3s runs a chart via whatchamacallit at run-time to spin up Traefik, make sure it's not pulled live

[Leftovers and to do](deploy/leftovers.md)

```
sudo systemctl daemon-reload
sudo systemctl enable k3s.service
sudo systemctl start k3s.service
```

```
# remove k3s iptables rules
iptables-save | grep -v KUBE-ROUTER | iptables-restore
ip6tables-save | grep -v KUBE-ROUTER | ip6tables-restore
```

Add this to status command

```
k3s check-config
# sample badness (?)
#     - CONFIG_INET_XFRM_MODE_TRANSPORT: missing
# This is a red herring, as that kernel option is used for IPSec which is only used by the deprecated flannel backend in k3s.
```

Add this to all users

```
# Nix
. /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
# k3s
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

#### SystemD

```
# default systemd path
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# needed systemd path
> PATH=/root/.nix-profile/bin:/nix/var/nix/profiles/default/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin
# delta:
# /root/.nix-profile/bin:/nix/var/nix/profiles/default/bin:
# Other env
> NIX_PROFILES=/nix/var/nix/profiles/default /root/.nix-profile
> NIX_SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
```

[Building and testing the kubernetes all-in-one manifest](deploy/readme.md)

### What's Hard?

- artefacts
  - business images
  - internal images, like `pause`
  - infra images like admission controllers
  - debug images
  - helm charts
  - helm operators
- updates
  - update lag when a CVE is published
  - updates of the business logic
  - data and historical data format updates
- storage
  - attached storage
  - object storage
  - logging and telemetry storage
  - kubernetes state storage
  - snapshots, backup and restore
- infrastructure
  - logging
  - DNS
  - NTP
  - access control
  - API gateways
  - compliance, e.g. right to be forgotten
- certificates
  - browsers rely on TLS for security, but also
  - browsers don't do HTTP/2 without TLS, meaning slower access
  - the traditional solution is for each vendor to bake a 100-year self-signed CA, ideally separate for each deployment
  - ultimately, client company wants security, so maybe they have their own custom CA preinstalled in all client machines, how does the API deployment get a certificate from this CA?
- instrumentation
  - where to store the data?
  - how to expose telemetry to client's IT for monitoring?
  - how to send notifications when a metric passes a threshold?
- cost-effectiveness
  - cloud provides resources to workload scale
  - on-prem environment essentially has be provisioned to max forseeable capacity instead
  - that affects not only business logic, but also business backing store, logging and logging backing store, all the way down

### Lessons Learnt

Supporting developers and production at the same time is still hard.

- bitnami chart pulls amd64 image on arm64 platform, ouch!
- bitnami only build mongodb for amd64, oh no!
- https://hub.docker.com/r/bitnami/mongodb/tags
- https://stackoverflow.com/a/73162339/705086
- Sadly, even that's not enough as mongodb binary is huge, it takes a lot of CPU crunching to start up... like minutes...

## Overview

### Technologies

- [ ] Your solution must make use of `k3s` and must be able to install it air-gapped (not requiring internet access during installation).
- [ ] You must create a helm chart(s) for deploying the application and its dependencies into kubernetes.
- [ ] You are free to make other technology choices as you see fit, in order to meet or exceed the other requirements below - as long as you can guarantee they will work out of the box on Cogent’s side.

### Installer

#### Building your installer (developer POV)

- A distributable version of your installer must be buildable from scratch using a single make command.
- The installer must be distributable as a single file (e.g. tarball or ZIP or a single binary)
- The build process need not be air-gapped (relying on the internet for building is OK)

#### Running your installer (user POV)

Your installer should be runnable as a simple command-line interface (CLI) with at least the following sub-commands:

- [ ] `install` This should install k3s on the local machine, and then install the application into the k3s cluster via helm . You only need to support a single-node “cluster”. The user should not need to be familiar with technical details of kubernetes or helm in order to run this command - it should encapsulate that for them.
- [ ] `uninstall` This should uninstall/remove from the host anything created by the install command.
- [ ] `diagnose` This should dump useful information for you (the maintainer of the installer) to debug or diagnose issues that the user may encounter in the future. It is up to you to decide what information you think is relevant here and how the user (Cogent) would provide that output to you.

Any additional parameters for the commands above, or any additional commands, are your choice. As a customer-focused engineer, you will of course consider the ease of use of your CLI and extensibility to future functionality.

The installation process must be runnable in an air-gapped environment. It cannot depend on internet access, nor can the running application itself.

#### Target test environment

Your installer will be tested in a virtual machine having the following properties:

- Ubuntu 22.04
- Substantial CPU, RAM, and disk space to accommodate k3s and the running application All network egress blocked (i.e. air-gapped)
- Some useful tools pre-installed: `make`, `kubectl`, `helm`, `jq`, `yq`

#### Documentation

As an experienced and careful engineer, you recognize the importance of documentation, and would provide the following:

- [ ] An overview of your system that is understandable by other engineers with similar backgrounds
- [ ] Insight into your choices and trade-offs you considered in your implementation
- [ ] Discussion of some improvements you could make that go beyond the scope of the assignment

### Nice to Have

- [ ] Diagnostics and logging
  - How easy it is to diagnose and debug issues in your system at the application, cluster, and host level?
- [ ] Updates
  - Suppose you made changes to the code or helm charts - how would you provide those updates to the user?
    - Rebuild, test, send someone with new installer to the customer, uninstall, install new version.
- [ ] Security
  - Is traffic securely handled within your k3s cluster?
  - Do pods have appropriate RBAC?
- [ ] Protection against IP theft and unauthorized use
  - Suppose your application contained sensitive intellectual property - how could this be protected in your installation?
    - Company level
      - Adaptability Over Code: The real competitive advantage lies in a company's ability to rapidly innovate and update its algorithms, rendering any stolen older versions obsolete.
      - Business Relationships and Ecosystem: The value of a business often lies in its established partnerships and role within a broader ecosystem, aspects that are hard to replicate even with access to the source code.
      - Operational Excellence: The unique data and operational skills required to effectively run and support the application provide a competitive edge that goes beyond the code itself.
      - Knowledge and Expertise: The human talent and contextual understanding behind an application are irreplaceable assets that can't be duplicated simply by copying source code.
      - Legal Protections: While not foolproof, the potential for legal repercussions serves as a deterrent against IP theft and reinforces other forms of competitive advantage.
    - Technical level
      - My personal take is that it's a fool's errand. Having worked in 3 companies that considered this, I found that in 2/3 the issue always falls behind acquiring new customers and making new features; and 1/3 required the code to run in vendor's own cloud, no exceptions allowed.
  - Suppose you had licensing within the application that limited API usage - how could you use that to prevent repeated uninstall/reinstall for unlimited usage?
    - In the spirit of Socratic method, let's consider
      - What stops the client from cloning the VM after the installation is complete and working?
        - Maybe a hardware token?
          - Doable, but then customer's rack will soon have all USB ports taken by different vendors' tokens... It's not truly scalable, but may just work if we're first.
        - MAC address change
          - New VM can be created with the same virtual MAC
        - Disk UUID
          - Ditto, ultimately, what id customer has a legitimate reason to migrate the VM or take a backup or to upgrade underlying hardware?
        - A gap in logs
          - What if the customer has a power outage, surely we'd want our service to come up?
- [ ] Multi-node support
  - Suppose you wanted to support multiple VMs connected into a single cluster - how might you support that in your installer?
    - [ ] etcd or mysql/postgres instead of sqlite in k3s
    - [ ] istio or similar to secure traffic between nodes
      - PKI rollout
    - [ ] beefier upgrade testing infrastructure
- [ ] Autoscaling
  - Suppose the application needed to autoscale - how might that look in this setting and how
    - In my (current) opinion, that's rarely asked for in on-prem deployments, because the resources are provisioned in advance
    - It's a thing for private cloud deployments... I feel that the deployment would be rather different in this case
