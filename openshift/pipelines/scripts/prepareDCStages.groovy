def backendDCStage (String envName) {
    return {
        stage("Apply Backend Deployment Config on ${envName}") {
            timeout(300) {
                script {
                    def projectName
                    def ENV_NAME
                    def SOURCE_IS_NAME
                    def KEYCLOAK_SA_BASEURL
                    def KEYCLOAK_SA_CLIENT_ID
                    def KEYCLOAK_SA_REALM
                    def KEYCLOAK_AUDIENCE
                    def KEYCLOAK_CERTS_URL
                    def KEYCLOAK_CLIENT_ID
                    def KEYCLOAK_ISSUER
                    def KEYCLOAK_REALM
                    def CPU_REQUEST
                    def CPU_LIMIT
                    def MEMORY_REQUEST
                    def MEMORY_LIMIT
                    if(envName == 'dev') {
                        projectName = "mem-tfrs-dev"
                        ENV_NAME = "dev"
                        SOURCE_IS_NAME = 'tfrs-develop'
                        KEYCLOAK_SA_BASEURL = "https://sso-dev.pathfinder.gov.bc.ca"
                        KEYCLOAK_SA_CLIENT_ID = "tfrs-dev-django-sa"
                        KEYCLOAK_SA_REALM = "tfrs-dev"
                        KEYCLOAK_AUDIENCE = "tfrs-dev"
                        KEYCLOAK_CERTS_URL = "https://sso-dev.pathfinder.gov.bc.ca/auth/realms/tfrs-dev/protocol/openid-connect/certs"
                        KEYCLOAK_CLIENT_ID = "tfrs-dev"
                        KEYCLOAK_ISSUER = "https://sso-dev.pathfinder.gov.bc.ca/auth/realms/tfrs-dev"
                        KEYCLOAK_REALM = "https://sso-dev.pathfinder.gov.bc.ca/auth/realms/tfrs-dev"
                        CPU_REQUEST='100m'
                        CPU_LIMIT='600m'
                        MEMORY_REQUEST='700Mi'
                        MEMORY_LIMIT='2Gi'
                    } else if(envName == 'test') {
                        projectName = "mem-tfrs-test"
                        ENV_NAME = "test"
                        SOURCE_IS_NAME = 'tfrs'
                        KEYCLOAK_SA_BASEURL = "https://sso-test.pathfinder.gov.bc.ca"
                        KEYCLOAK_SA_CLIENT_ID = "tfrs-django-sa"
                        KEYCLOAK_SA_REALM = "tfrs"
                        KEYCLOAK_AUDIENCE = "tfrs"
                        KEYCLOAK_CERTS_URL = "https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs/protocol/openid-connect/certs"
                        KEYCLOAK_CLIENT_ID = "tfrs"
                        KEYCLOAK_ISSUER = "https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs"
                        KEYCLOAK_REALM = "https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs"
                        CPU_REQUEST='100m'
                        CPU_LIMIT='600m'
                        MEMORY_REQUEST='700Mi'
                        MEMORY_LIMIT='2Gi'
                    } else if(envName == 'prod') {
                        projectName = "mem-tfrs-prod"
                        ENV_NAME = "prod"
                        SOURCE_IS_NAME = 'tfrs'
                        KEYCLOAK_SA_BASEURL = "https://sso.pathfinder.gov.bc.ca"
                        KEYCLOAK_SA_CLIENT_ID = "tfrs-django-sa"
                        KEYCLOAK_SA_REALM = "tfrs"
                        KEYCLOAK_AUDIENCE = "tfrs"
                        KEYCLOAK_CERTS_URL = "https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs/protocol/openid-connect/certs"
                        KEYCLOAK_CLIENT_ID = "tfrs"
                        KEYCLOAK_ISSUER = "https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs"
                        KEYCLOAK_REALM = "https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs"
                        CPU_REQUEST='400m'
                        CPU_LIMIT='600m'
                        MEMORY_REQUEST='700Mi'
                        MEMORY_LIMIT='2Gi'
                    }
                    openshift.withProject("${projectName}") {
                        def backendDCJson = openshift.process(readFile(file:'openshift/templates/components/backend/tfrs-dc.json'), 
                        "-p", 
                        "ENV_NAME=${ENV_NAME}", 
                        "SOURCE_IS_NAME=${SOURCE_IS_NAME}",
                        "KEYCLOAK_SA_BASEURL=${KEYCLOAK_SA_BASEURL}",
                        "KEYCLOAK_SA_CLIENT_ID=${KEYCLOAK_SA_CLIENT_ID}",
                        "KEYCLOAK_SA_REALM=${KEYCLOAK_SA_REALM}",
                        "KEYCLOAK_AUDIENCE=${KEYCLOAK_AUDIENCE}",
                        "KEYCLOAK_CERTS_URL=${KEYCLOAK_CERTS_URL}",
                        "KEYCLOAK_CLIENT_ID=${KEYCLOAK_CLIENT_ID}",
                        "KEYCLOAK_ISSUER=${KEYCLOAK_ISSUER}",
                        "KEYCLOAK_REALM=${KEYCLOAK_REALM}",
                        "CPU_REQUEST=${CPU_REQUEST}",
                        "CPU_LIMIT=${CPU_LIMIT}",
                        "MEMORY_REQUEST=${MEMORY_REQUEST}",
                        "MEMORY_LIMIT=${MEMORY_LIMIT}"
                        )
                        openshift.apply(backendDCJson)
                    }
                }
            }
        }
    }
}

def backendDCOthersStage (String envName) {
    return {
        stage("Apply Backend Others Config on ${envName}") {
            timeout(300) {
                script {
                    def projectName
                    def ROUTE_HOST_NAME
                    def ROUTE_NAME
                    if(envName == 'dev') {
                        projectName = "mem-tfrs-dev"
                        ROUTE_HOST_NAME = "dev-lowcarbonfuels.pathfinder.gov.bc.ca"
                        ROUTE_NAME = "dev-lowcarbonfuels-backend"
                    } else if(envName == 'test') {
                        projectName = "mem-tfrs-test"
                        ROUTE_HOST_NAME = "test-lowcarbonfuels.pathfinder.gov.bc.ca"
                        ROUTE_NAME = "test-lowcarbonfuels-backend"
                    } else if(envName == 'prod') {
                        projectName = "mem-tfrs-prod"
                        ROUTE_HOST_NAME = "lowcarbonfuels.gov.bc.ca"
                        ROUTE_NAME = "lowcarbonfuels-backend"
                    }
                    openshift.withProject("${projectName}") {
                        def backendDCJson = openshift.process(readFile(file:'openshift/templates/components/backend/tfrs-dc-others.json'), 
                        "-p", 
                        "ROUTE_HOST_NAME=${ROUTE_HOST_NAME}}",
                        "ROUTE_NAME=${ROUTE_NAME}"
                        )
                        openshift.apply(backendDCJson)
                    }
                }
            }
        }
    }
}

def celeryDCStage (String envName) {
    return {
        stage("Apply Celery Deployment Config on ${envName}") {
            timeout(30) {
                script {
                    def projectName
                    def ENV_NAME
                    def SOURCE_IS_NAME
                    if(envName == 'dev') {
                        projectName = "mem-tfrs-dev"
                        ENV_NAME = 'dev'
                        SOURCE_IS_NAME = 'celery-develop'
                    } else if(envName == 'test') {
                        projectName = "mem-tfrs-test"
                        ENV_NAME = 'test'
                        SOURCE_IS_NAME = 'celery'
                    } else if(envName == 'prod') {
                        projectName = "mem-tfrs-prod"
                        ENV_NAME = 'prod'
                        SOURCE_IS_NAME = 'celery'
                    }
                    openshift.withProject("${projectName}") {
                        def celeryDCJson = openshift.process(readFile(file:'openshift/templates/components/celery/celery-dc.json'), 
                        "-p", 
                        "ENV_NAME=${ENV_NAME}", 
                        "SOURCE_IS_NAME=${SOURCE_IS_NAME}"
                        )
                        openshift.apply(celeryDCJson)
                    }
                }
            }
        }
    }
}

def scanCoordinatorDCStage (String envName) {
    return {
        stage('Apply Scan-coordinator Deployment Config on ${envName}') {
            timeout(30) {
                script {
                    def projectName
                    def ENV_NAME
                    def SOURCE_IS_NAME
                    def CPU_REQUEST
                    def CPU_LIMIT
                    def MEMORY_REQUEST
                    def MEMORY_LIMIT
                    if(envName == 'dev') {
                        projectName = "mem-tfrs-dev"
                        ENV_NAME = 'dev'
                        SOURCE_IS_NAME = 'scan-coordinator-develop'
                        CPU_REQUEST='10m'
                        CPU_LIMIT='100m'
                        MEMORY_REQUEST='30Mi'
                        MEMORY_LIMIT='100Mi'
                    } else if(envName == 'test') {
                        projectName = "mem-tfrs-test"
                        ENV_NAME = 'test'
                        SOURCE_IS_NAME = 'scan-coordinator'
                        CPU_REQUEST='10m'
                        CPU_LIMIT='100m'
                        MEMORY_REQUEST='30Mi'
                        MEMORY_LIMIT='100Mi'
                    } else if(envName == 'prod') {
                        projectName = "mem-tfrs-prod"
                        ENV_NAME = 'prod'
                        SOURCE_IS_NAME = 'scan-coordinator'
                        CPU_REQUEST='100m'
                        CPU_LIMIT='250m'
                        MEMORY_REQUEST='256Mi'
                        MEMORY_LIMIT='512Mi'
                    }
                    openshift.withProject("${projectName}") {
                        def scanCoordinatorDCJson = openshift.process(readFile(file:'openshift/templates/components/scan-coordinator/scan-coordinator-dc.json'), 
                        "-p", 
                        "ENV_NAME=${ENV_NAME}", 
                        "SOURCE_IS_NAME=${SOURCE_IS_NAME}",
                        "CPU_REQUEST=${CPU_REQUEST}",
                        "CPU_LIMIT=${CPU_LIMIT}",
                        "MEMORY_REQUEST=${MEMORY_REQUEST}",
                        "MEMORY_LIMIT=${MEMORY_LIMIT}"
                        )
                        openshift.apply(scanCoordinatorDCJson)
                    }
                }
            }
        }
    }
}

def scanHandlerDCStage (String envName) {
    return {
        stage("Apply Scan-handler Deployment Config on ${envName}") {
            timeout(30) {
                script {
                    def projectName
                    def ENV_NAME
                    def SOURCE_IS_NAME
                    def CPU_REQUEST
                    def CPU_LIMIT
                    def MEMORY_REQUEST
                    def MEMORY_LIMIT
                    if(envName == 'dev') {
                        projectName = "mem-tfrs-dev"
                        ENV_NAME = 'dev'
                        SOURCE_IS_NAME = 'scan-handler-develop'
                        CPU_REQUEST='10m'
                        CPU_LIMIT='100m'
                        MEMORY_REQUEST='120Mi'
                        MEMORY_LIMIT='200Mi'
                    } else if(envName == 'test') {
                        projectName = "mem-tfrs-test"
                        ENV_NAME = 'test'
                        SOURCE_IS_NAME = 'scan-handler'
                        CPU_REQUEST='10m'
                        CPU_LIMIT='100m'
                        MEMORY_REQUEST='120Mi'
                        MEMORY_LIMIT='200Mi'
                    } else if(envName == 'prod') {
                        projectName = "mem-tfrs-prod"
                        ENV_NAME = 'prod'
                        SOURCE_IS_NAME = 'scan-handler'
                        CPU_REQUEST='100m'
                        CPU_LIMIT='250m'
                        MEMORY_REQUEST='256Mi'
                        MEMORY_LIMIT='512Mi'
                    }
                    openshift.withProject("${projectName}") {
                        def scanHandlerDCJson = openshift.process(readFile(file:'openshift/templates/components/scan-handler/scan-handler-dc.json'), 
                        "-p", 
                        "ENV_NAME=${ENV_NAME}", 
                        "SOURCE_IS_NAME=${SOURCE_IS_NAME}",
                        "CPU_REQUEST=${CPU_REQUEST}",
                        "CPU_LIMIT=${CPU_LIMIT}",
                        "MEMORY_REQUEST=${MEMORY_REQUEST}",
                        "MEMORY_LIMIT=${MEMORY_LIMIT}"
                        )
                        openshift.apply(scanHandlerDCJson)
                    }
                }
            }
        }        
    }
}

def notificationServerDCStage (String envName) {
    return {
        stage("Apply Notificstion-server Deployment Config on ${envName}") {
            timeout(30) {
                script {
                    def projectName
                    def ENV_NAME
                    def SOURCE_IS_NAME
                    def KEYCLOAK_CERTS_URL
                    def CPU_REQUEST
                    def CPU_LIMIT
                    def MEMORY_REQUEST
                    def MEMORY_LIMIT
                    if(envName == 'dev') {
                        projectName = 'mem-tfrs-dev'
                        ENV_NAME = 'dev'
                        SOURCE_IS_NAME = 'notification-server-develop'
                        KEYCLOAK_CERTS_URL = 'https://sso-dev.pathfinder.gov.bc.ca/auth/realms/tfrs-dev/protocol/openid-connect/certs'
                        CPU_REQUEST='10m'
                        CPU_LIMIT='30m'
                        MEMORY_REQUEST='110Mi'
                        MEMORY_LIMIT='200Mi'
                    } else if(envName == 'test') {
                        projectName = 'mem-tfrs-test'
                        ENV_NAME = 'test'
                        SOURCE_IS_NAME = 'notification-server'
                        KEYCLOAK_CERTS_URL = 'https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs/protocol/openid-connect/certs'
                        CPU_REQUEST='10m'
                        CPU_LIMIT='30m'
                        MEMORY_REQUEST='110Mi'
                        MEMORY_LIMIT='200Mi'                    
                    } else if(envName == 'prod') {
                        projectName = 'mem-tfrs-prod'
                        ENV_NAME = 'prod'
                        SOURCE_IS_NAME = 'notification-server'
                        KEYCLOAK_CERTS_URL = 'https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs/protocol/openid-connect/certs'
                        CPU_REQUEST='100m'
                        CPU_LIMIT='400m'
                        MEMORY_REQUEST='256Mi'
                        MEMORY_LIMIT='512Mi'                    
                    }
                    openshift.withProject("${projectName}") {
                        def notificationServerDCJson = openshift.process(readFile(file:'openshift/templates/components/notification/notification-server-dc.json'), 
                        "-p", 
                        "ENV_NAME=${ENV_NAME}", 
                        "SOURCE_IS_NAME=${SOURCE_IS_NAME}",
                        "KEYCLOAK_CERTS_URL=${KEYCLOAK_CERTS_URL}",
                        "CPU_REQUEST=${CPU_REQUEST}",
                        "CPU_LIMIT=${CPU_LIMIT}",
                        "MEMORY_REQUEST=${MEMORY_REQUEST}",
                        "MEMORY_LIMIT=${MEMORY_LIMIT}"
                        )
                        openshift.apply(notificationServerDCJson)
                    }
                }
            }
        }
    }
}

def notificationServerOthersDCStage (String envName) {
    return {
        stage("Apply Notificstion-server Others Config on ${envName}") {
            timeout(30) {
                script {
                    def projectName
                    def ROUTE_NAME
                    def ROUTE_HOST
                    if(envName == 'dev') {
                        projectName = 'mem-tfrs-dev'
                        ROUTE_NAME = 'dev-lowcarbonfuels-notification'
                        ROUTE_HOST = 'dev-lowcarbonfuels.pathfinder.gov.bc.ca'
                    } else if(envName == 'test') {
                        projectName = 'mem-tfrs-test'
                        ROUTE_NAME = 'dev-lowcarbonfuels-notification'
                        ROUTE_HOST = 'dev-lowcarbonfuels.pathfinder.gov.bc.ca'
                    } else if(envName == 'prod') {
                        projectName = 'mem-tfrs-prod'
                        ROUTE_NAME = 'dev-lowcarbonfuels-notification'
                        ROUTE_HOST = 'dev-lowcarbonfuels.pathfinder.gov.bc.ca'
                    }
                    openshift.withProject("${projectName}") {
                        def notificationServerDCJson = openshift.process(readFile(file:'openshift/templates/components/notification/notification-server-others-dc.json'), 
                        "-p", 
                        "ROUTE_NAME=dev-lowcarbonfuels-notification",
                        "ROUTE_HOST=dev-lowcarbonfuels.pathfinder.gov.bc.ca"
                        )
                        openshift.apply(notificationServerDCJson)
                    }
                }
            }
        }
    }
}

def frontendDCStage (String envName) {
    return {
        stage("Apply Client Deployment Config on ${envName}") {
            timeout(30) {
                script {
                    def projectName
                    def ENV_NAME
                    def SOURCE_IS_NAME
                    def CPU_REQUEST
                    def CPU_LIMIT
                    def MEMORY_REQUEST
                    def MEMORY_LIMIT
                    if(envName == 'dev') {
                        projectName = "mem-tfrs-dev"
                        ENV_NAME = 'dev'
                        SOURCE_IS_NAME = 'client-develop'
                        CPU_REQUEST='10m'
                        CPU_LIMIT='400m'
                        MEMORY_REQUEST='80Mi'
                        MEMORY_LIMIT='200Mi'
                    } else if(envName == 'test') {
                        projectName = "mem-tfrs-test"
                        ENV_NAME = 'test'
                        SOURCE_IS_NAME = 'client'
                        CPU_REQUEST='10m'
                        CPU_LIMIT='400m'
                        MEMORY_REQUEST='80Mi'
                        MEMORY_LIMIT='200Mi'
                    } else if(envName == 'prod') {
                        projectName = "mem-tfrs-prod"
                        ENV_NAME = 'prod'
                        SOURCE_IS_NAME = 'client'
                        CPU_REQUEST='100m'
                        CPU_LIMIT='400m'
                        MEMORY_REQUEST='200Mi'
                        MEMORY_LIMIT='250Mi'
                    }
                    openshift.withProject("${projectName}") {
                        def clientDCJson = openshift.process(readFile(file:'openshift/templates/components/frontend/client-dc.json'), 
                        "-p", 
                        "ENV_NAME=${ENV_NAME}", 
                        "SOURCE_IS_NAME=${SOURCE_IS_NAME}",
                        "CPU_REQUEST=${CPU_REQUEST}",
                        "CPU_LIMIT=${CPU_LIMIT}",
                        "MEMORY_REQUEST=${MEMORY_REQUEST}",
                        "MEMORY_LIMIT=${MEMORY_LIMIT}"
                        )
                        openshift.apply(clientDCJson)
                    }
                }
            }
        }
    }
}

def frontendDCOthersStage (String envName) {
    return {
        stage("Apply Client Others Config on ${envName}") {
            timeout(30) {
                script {
                    def projectName
                    def KEYCLOAK_AUTHORITY
                    def KEYCLOAK_CLIENT_ID
                    def KEYCLOAK_CALLBACK_URL
                    def KEYCLOAK_LOGOUT_URL
                    def ROUTE_HOST_NAME
                    def ROUTE_NAME
                    if(envName == 'dev') {
                        projectName = "mem-tfrs-dev"
                        KEYCLOAK_AUTHORITY = 'https://sso-dev.pathfinder.gov.bc.ca/auth/realms/tfrs-dev'
                        KEYCLOAK_CLIENT_ID = 'tfrs-dev'
                        KEYCLOAK_CALLBACK_URL = 'https://dev-lowcarbonfuels.pathfinder.gov.bc.ca/authCallback'
                        KEYCLOAK_LOGOUT_URL = 'https://logontest.gov.bc.ca/clp-cgi/logoff.cgi?returl=https%3A%2F%2Fdev-lowcarbonfuels.pathfinder.gov.bc.ca%2F'
                        ROUTE_HOST_NAME = 'dev-lowcarbonfuels.pathfinder.gov.bc.ca'
                        ROUTE_NAME = 'dev-lowcarbonfuels-frontend'
                    } else if(envName == 'test') {
                        projectName = "mem-tfrs-test"
                        KEYCLOAK_AUTHORITY = 'https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs'
                        KEYCLOAK_CLIENT_ID = 'tfrs'
                        KEYCLOAK_CALLBACK_URL = 'https://test-lowcarbonfuels.pathfinder.gov.bc.ca/authCallback'
                        KEYCLOAK_LOGOUT_URL = 'https://logontest.gov.bc.ca/clp-cgi/logoff.cgi?returl=https%3A%2F%2Ftest-lowcarbonfuels.pathfinder.gov.bc.ca%2F'
                        ROUTE_HOST_NAME = 'test-lowcarbonfuels.pathfinder.gov.bc.ca'
                        ROUTE_NAME = 'test-lowcarbonfuels-frontend'
                    } else if(envName == 'prod') {
                        projectName = "mem-tfrs-prod"
                        KEYCLOAK_AUTHORITY = 'https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs'
                        KEYCLOAK_CLIENT_ID = 'tfrs'
                        KEYCLOAK_CALLBACK_URL = 'https://lowcarbonfuels.gov.bc.ca/authCallback'
                        KEYCLOAK_LOGOUT_URL = 'https://logon.gov.bc.ca/clp-cgi/logoff.cgi?returl=https%3A%2F%lowcarbonfuels.gov.bc.ca%2F'
                        ROUTE_HOST_NAME = 'lowcarbonfuels.gov.bc.ca'
                        ROUTE_NAME = 'lowcarbonfuels-frontend'
                    }
                    openshift.withProject("${projectName}") {
                        def clientDCJson = openshift.process(readFile(file:'openshift/templates/components/frontend/client-dc-others.json'), 
                        "-p", 
                        "KEYCLOAK_AUTHORITY=${KEYCLOAK_AUTHORITY}",
                        "KEYCLOAK_CLIENT_ID=${KEYCLOAK_CLIENT_ID}",
                        "KEYCLOAK_CALLBACK_URL=${KEYCLOAK_CALLBACK_URL}",
                        "KEYCLOAK_LOGOUT_URL=${KEYCLOAK_LOGOUT_URL}",
                        "ROUTE_HOST_NAME=${ROUTE_HOST_NAME}",
                        "ROUTE_NAME=${ROUTE_NAME}"
                        )
                        openshift.apply(clientDCJson)
                    }
                }
            }
        }
    }
}
return this