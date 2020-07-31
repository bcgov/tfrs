### Files included

rabbitmq-bc.json build config
rabbitmq-dc.json deployment config

### Build and deploy rabbitmq

oc process -f ./rabbitmq-bc.yaml | oc create -f - -n mem-tfrs-tools

oc process -f ./rabbitmq-dc.yaml ENV_NAME=[dev, test or prod] | oc create -f - -n mem-tfrs-[dev, test or prod]

