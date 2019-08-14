def unitTestStage () {
    return {
        stage('Unit Test') {
            dir('backend') {
                try {
                    sh 'pip install --upgrade pip && pip install -r requirements.txt'
                    sh 'python manage.py collectstatic && python manage.py migrate'
                    sh 'python manage.py test -c nose.cfg'
                } catch(Throwable t) {
                    result = 1;
                } finally {
                    stash includes: 'nosetests.xml,coverage.xml', name: 'coverage'
                    junit 'nosetests.xml'
                }
            }
        }
    }
}

def bringUpMaintenancePageStage (String projectName) {
    return {
        stage('Bring up Maintenance Page') {
            script {
                def frontendRouteName
                def backendRouteName
                if(projectName == "mem-tfrs-dev") {
                    frontendRouteName = "dev-lowcarbonfuels-frontend"
                    backendRouteName = "dev-lowcarbonfuels-backend"
                } else if(projectName == "mem-tfrs-test" ) {
                    frontendRouteName = "test-lowcarbonfuels-frontend"
                    backendRouteName = "test-lowcarbonfuels-backend"
                } else if(projectName == "mem-tfrs-prod" ) {
                    frontendRouteName = "lowcarbonfuels-frontend"
                    backendRouteName = "lowcarbonfuels-backend"
                }
                sh returnStatus: true, script: "oc scale dc maintenance-page -n ${projectName} --replicas=1 --timeout=20s"
                sh returnStatus: true, script: "oc patch route/${frontendRouteName} -n ${projectName} -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
                sh returnStatus: true, script: "oc patch route/${backendRouteName} -n ${projectName} -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
            }
        }
    }
}

def databaseBackupStage (String projectName, String tfrsRelease) {
    return {
        stage('Datebase Backup') {
            def ENV_NAME
            if( projectName == "mem-tfrs-dev") {
                ENV_NAME='dev'
                postgresql_pod_name= sh (script: "oc get pods -n mem-tfrs-dev | grep postgresql96 | awk \'{print \$1}\'", returnStdout: true).trim()
            } else if( projectName == "mem-tfrs-test") {
                ENV_NAME='test'
                postgresql_pod_name= sh (script: "oc get pods -n mem-tfrs-test | grep postgresql96 | awk \'{print \$1}\'", returnStdout: true).trim()
            } else if( projectName == "mem-tfrs-prod") {
                ENV_NAME='prod'
                postgresql_pod_name= sh (script: "oc get pods -n mem-tfrs-prod | grep postgresql96 | awk \'{print \$1}\'", returnStdout: true).trim()
            }
            echo "start backup script on ${projectName}, postgresql_pod_name is ${postgresql_pod_name}"
            sh returnStdout: true, script: "oc exec ${postgresql_pod_name} -c postgresql96 -n ${projectName} -- bash /postgresql-backup/tfrs-backup.sh ${tfrsRelease} ${ENV_NAME}"
            echo 'backup script completed'
        }
    }
}

def deployBackendStage (String projectName) {
    return {
        stage("Deploy Backend on ${projectName}") {
            script {
                def envName
                def tfrsISName
                def scanCoordinatorISName
                def scanHandlerISName
                def celeryISName
                if(projectName == "mem-tfrs-dev") {
                    envName = "dev"
                    tfrsISName = "tfrs-develop"
                    scanCoordinatorISName = "scan-coordinator-develop"
                    scanHandlerISName = "scan-handler-develop"
                    celeryISName = "celery-develop"
                } else if(projectName == "mem-tfrs-test" || projectName == "mem-tfrs-prod") {
                    if(projectName == "mem-tfrs-test") {
                        envName = "test"
                    } else if(projectName == "mem-tfrs-prod") {
                        envName = "prod"
                    }
                    tfrsISName = "tfrs"
                    scanCoordinatorISName = "scan-coordinator"
                    scanHandlerISName = "scan-handler"
                    celeryISName = "celery"
                }
                openshift.withProject("mem-tfrs-tools") {
                    openshift.tag("mem-tfrs-tools/${tfrsISName}:latest", "mem-tfrs-tools/${tfrsISName}:${envName}")
                    sh 'sleep 180s'
                    openshift.tag("mem-tfrs-tools/${scanCoordinatorISName}:latest", "mem-tfrs-tools/${scanCoordinatorISName}:${envName}")
                    openshift.tag("mem-tfrs-tools/${scanHandlerISName}:latest", "mem-tfrs-tools/${scanHandlerISName}:${envName}")
                    openshift.tag("mem-tfrs-tools/${celeryISName}:latest", "mem-tfrs-tools/${celeryISName}:${envName}")
                    sh 'sleep 120s'
                }
            }
        }
    }
}

def deployBackendToProdStage () {
    return {
        stage("Deploy Backend on Prod") {
            script {
                openshift.withProject("mem-tfrs-tools") {
                    openshift.tag("mem-tfrs-tools/tfrs:test", "mem-tfrs-tools/tfrs:prod")
                    sh 'sleep 180s'
                    openshift.tag("mem-tfrs-tools/scan-coordinator:test", "mem-tfrs-tools/scan-coordinator:prod")
                    openshift.tag("mem-tfrs-tools/scan-handler:test", "mem-tfrs-tools/scan-handler:prod")
                    openshift.tag("mem-tfrs-tools/celery:test", "mem-tfrs-tools/celery:prod")
                    sh 'sleep 120s'
                }
            }
        }
    }
}

def deployFrontendStage(String projectName) {
    return {
        stage("Deploy Frontend on ${projectName}") {
            script {
                def envName
                def clientISName
                def notificationServerISName
                if(projectName == "mem-tfrs-dev") {
                    envName = "dev"
                    clientISName = "client-develop"
                    notificationServerISName = "notification-server-develop"
                } else if(projectName == "mem-tfrs-test" || projectName == "mem-tfrs-prod") {
                    if(projectName == "mem-tfrs-test") {
                        envName = "test"
                    } else if(projectName == "mem-tfrs-prod") {
                        envName = "prod"
                    }
                    clientISName = "client"
                    notificationServerISName = "notification-server"
                }
                openshift.withProject("mem-tfrs-tools") {
                    openshift.tag("mem-tfrs-tools/${clientISName}:latest", "mem-tfrs-tools/${clientISName}:${envName}")
                    openshift.tag("mem-tfrs-tools/${notificationServerISName}:latest", "mem-tfrs-tools/${notificationServerISName}:${envName}")
                    sh 'sleep 120s'
                }
            }
        }
    }
}

def deployFrontendToProdStage() {
    return {
        stage("Deploy Frontend on Prod") {
            script {
                openshift.withProject("mem-tfrs-tools") {
                    openshift.tag("mem-tfrs-tools/client:test", "mem-tfrs-tools/client:prod")
                    openshift.tag("mem-tfrs-tools/notification-server:test", "mem-tfrs-tools/notification-server:prod")
                    sh 'sleep 120s'
                }
            }
        }
    }
}

def refreshSchemaspyStage(String projectName) {
    return {
        stage('Refresh SchemaSpy') {
            echo "Refreshing SchemaSpy for Dev Database"
            sh returnStdout: true, script: "oc scale dc schema-spy-public --replicas=0 -n ${projectName}"
            sh 'sleep 30s'
            sh returnStdout: true, script: "oc scale dc schema-spy-public --replicas=1 -n ${projectName}"
            sh returnStdout: true, script: "oc scale dc schema-spy-audit --replicas=0 -n ${projectName}"
            sh 'sleep 30s'
            sh returnStdout: true, script: "oc scale dc schema-spy-audit --replicas=1 -n ${projectName}"
            sh 'sleep 120s'
        }    
    }
}

def takeDownMaintenancePageStage(String projectName) {
    return {
        stage('Take down Maintenance Page') {
            script {
                def frontendRouteName
                def backendRouteName
                if(projectName == "mem-tfrs-dev") {
                    frontendRouteName = "dev-lowcarbonfuels-frontend"
                    backendRouteName = "dev-lowcarbonfuels-backend"
                } else if(projectName == "mem-tfrs-test" ) {
                    frontendRouteName = "test-lowcarbonfuels-frontend"
                    backendRouteName = "test-lowcarbonfuels-backend"
                } else if(projectName == "mem-tfrs-prod" ) {
                    frontendRouteName = "lowcarbonfuels-frontend"
                    backendRouteName = "lowcarbonfuels-backend"
                }
                sh returnStatus: true, script: "oc patch route/${backendRouteName} -n ${projectName} -p '{\"spec\":{\"to\":{\"name\":\"backend\"}, \"port\":{\"targetPort\":\"web\"}}}'"
                sh returnStatus: true, script: "oc patch route/${frontendRouteName} -n ${projectName} -p '{\"spec\":{\"to\":{\"name\":\"client\"}, \"port\":{\"targetPort\":\"web\"}}}'"
                sh returnStatus: true, script: "oc scale dc maintenance-page -n ${projectName} --replicas=0 --timeout=20s"
            }
        }
    }
}

def confirmStage(String message) {
    return {
        stage ('Confirmation required in order to continue') {
            input "${message}"
        }
    }
}


def sonarqubeStage() {
    return {
        stage('Code Quality Check') {
            SONARQUBE_URL = sh (
                script: 'oc get routes -o wide --no-headers | awk \'/sonarqube/{ print match($0,/edge/) ?  "https://"$2 : "http://"$2 }\'',
                returnStdout: true
            ).trim()
            echo ">> SONARQUBE_URL: ${SONARQUBE_URL}"
            dir('frontend/sonar-runner') {
                sh returnStdout: true, script: "./gradlew sonarqube -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.verbose=true --stacktrace --info"
            }
            dir('backend/sonar-runner') {
                unstash 'coverage'
                sh returnStdout: true, script: "./gradlew sonarqube -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.verbose=true --stacktrace --info"
            }
        }
    }
}

def functionalTestStage() {
    return {
        stage('Functional Test') {
            dir('functional-tests') {
                withCredentials([usernamePassword(credentialsId: 'browserstack', usernameVariable: 'BROWSERSTACK_USERNAME', passwordVariable: 'BROWSERSTACK_TOKEN'),
                            file(credentialsId: 'functional_test_users_v2', variable: 'envfile')]) {
                    sh "cp \$envfile .env"
                    sh './gradlew remoteChromeTest --tests specs.CreditTransferSpec'
                    sh './gradlew remoteFirefoxTest --tests specs.CreditTransferSpec'
                    sh './gradlew remoteEdgeTest --tests specs.CreditTransferSpec'
                }
            }
        }
    }
}

return this
