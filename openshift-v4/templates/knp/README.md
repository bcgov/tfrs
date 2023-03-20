# Quick Start allow all network policies

## knp-quick-start.yaml
It has the following three policies, these policies will open all communications. Typically they can be applied at the early stage of the project during the development phase.
* deny-by-default
* allow-from-openshift-ingress
* allow-all-internal

# Application Network Security Policies
Applying the following policies allows TFRS applications communicated properly under security rules.
* 1-base.yaml
* 2-apps.yaml
* 3-spilo.yaml
* 4-clamav-rabbitmq.yaml

# Security Model
* knp-diagram-1.0.0.drawio: the security model under TFRS V1.*
* knp-diagram-2.0.0.drawio: the security model under TFRS V2.*


