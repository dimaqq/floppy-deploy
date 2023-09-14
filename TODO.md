## Plan

## Overview

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
