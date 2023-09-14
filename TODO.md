## Plan

## Overview

### Technologies

- [ ] Your solution must make use of k3s and must be able to install it air-gapped (not requiring internet access during installation).
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
- [ ] Security
  - Is traffic securely handled within your k3s cluster?
  - Do pods have appropriate RBAC?
- [ ] Protection against IP theft and unauthorized use
  - Suppose your application contained sensitive intellectual property - how could this be protected in your installation?
  - Suppose you had licensing within the application that limited API usage - how could you use that to prevent repeated uninstall/reinstall for unlimited usage?
- [ ] Multi-node support
  - Suppose you wanted to support multiple VMs connected into a single cluster - how might you support that in your installer?
- [ ] Autoscaling
  - Suppose the application needed to autoscale - how might that look in this setting and how
