oc export imagestream/client imagestream/client-angular-app bc/client bc/client-angular-app-build --as-template='client' --output=json > client.json
oc export imagestream/client-develop imagestream/client-develop-angular-app bc/client-develop bc/client-develop-angular-app-build --as-template='client-develop' --output=json > client-develop.json
oc export imagestream/tfrs bc/tfrs --as-template='tfrs' --output=json > tfrs.json
oc export imagestream/tfrs-develop bc/tfrs-develop --as-template='tfrs-develop' --output=json > tfrs-develop.json
oc export imagestream/nginx-runtime bc/nginx-runtime --as-template='nginx' --output=json > nginx.json
oc export bc/owasp-zap-openshift imagestream/owasp-zap-openshift --as-template='owasp-zap-openshift' --output=json > owasp-zap-openshift.json
oc export bc/jenkins dc/jenkins imagestream/jenkins service/jenkins service/jenkins-jnlp route/jenkins  --as-template='jenkins' --output=json > jenkins.json
oc export bc/develop-client-pipeline bc/develop-tfrs-pipeline bc/master-client-pipeline bc/master-tfrs-pipeline --as-template='pipeline' --output=json > pipeline.json
oc export imagestream/schema-spy bc/schema-spy --as-template='schema-spy' --output=json > schema-spy.json
oc export imagestream/request-logger bc/request-logger --as-template='request-logger' --output=json > request-logger.json
oc export dc/postgresql-sonarqube dc/sonarqube service/postgresql-sonarqube service/sonarqube route/sonarqube --as-template='sonarqube' --output=json > sonarqube.json
oc export bc/client-prod-angular-app-build bc/client-prod bc/tfrs-prod bc/prod-client-pipeline bc/prod-tfrs-pipeline --as-template='prod-build-pipeline' --output=json > prod-build-pipeline.json
