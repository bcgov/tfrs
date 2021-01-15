### Files included
* keycloak-secret.yaml includes keycloak secrets

### Create Secret keycloak-secret.yaml in tools, dev, test and prod env. The value for tools and dev should be same
oc process -f keycloak-secret.yaml KEYCLOAK_SA_CLIENT_SECRET=[Clients->sa client->Credentials->secret] \
clientId=[sa client] clientSecret=[same value of KEYCLOAK_SA_CLIENT_SECRET] \
tfrsPublic=[public client id, it is not tfrs, on sso console click Clients->tfrs] realmId=[realmId] host=[sso host name] \
| oc create -f - -n 0ab226-xxx --dry-run=client
Notes: in keycloak, there are two clients: one is sa client, the other one is public client



