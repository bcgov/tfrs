FROM rabbitmq:3.8.3-management
RUN apt-get update
RUN apt-get install -y gettext-base vim
RUN chgrp -R root /var/log/rabbitmq && \
    chmod -R g+w /var/log/rabbitmq
ARG ADMIN_PASSWORD
ARG ZEVA_PASSWORD
RUN echo "H4sICJ+6cl4AA3BvbGljeS5qc29uALVUW2vCMBR+91eUsqehDiaOsTfBPexhFyZssDHKsU2bQJpIcqJT8b8vSe2FWt2LvoT0+87lO5dm2wuCUMF8zjBaEqWZFOFDEI6G98NR2Hek0Ra22Lf9CIKtPy0sICfOEpKcCW/p4QVovZIqcdTVZPr89BK9TWazz9f3aW1EQVMmsgh4JhVDmjvrvYgyQFQaaQq347vaGSHTVWKmUQFKFXp21+/WuCFLOCLx6/FjcimFp0VlhmjsVtWizinGHfb240e7pFLjidne+MYVjpXTgqicabcoHZ5uWQ477vPUASs8liJlmVE+2fC6Jla2zANQEUj2WGdjy9ytjbxQ8qof5DemIDJyoo9CIktZDOib9q8yXC+8WwpCmsYeJMYOnTsKlSEVDAZllBBOvOoUuK45JpAoAfyAAJWZnAg//e2uPWLJWcxcRa2CjikuC6UwAM6bS40uv9+/flDVQVL752Lx1JSx/Z4PcpkUr0ojSsHotYhr2pac23bGXUZzwJgONNs40/Geb5TY2/0B49pirvUEAAA=" | base64 -d | gunzip - | envsubst > /tmp/policy.json
