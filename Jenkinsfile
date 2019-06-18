result = 0
runParallel = true
tfrsRelease="v1.4.8-dc-pipeline-fix"


def prepareBackendBuildStages() {
    def buildBackendList = []
    def buildBackendStages = [:]
    buildBackendStages.put('Build Backend', prepareBuildBackend())
    buildBackendStages.put('Build Scan Coordinator', prepareBuildScanCoordinator())
    buildBackendStages.put('Build ScanHandler', prepareBuildScanHandler())
    buildBackendStages.put('Build Celery', prepareBuildCelery())
    buildBackendList.add(buildBackendStages)
    return buildBackendList
}

def prepareFrontendBuildStages() {
    def buildFrontendList = []
    def buildFrontendStages = [:]
    buildFrontendStages.put('Build Frontend', prepareBuildFrontend())
    buildFrontendStages.put('Build Notification Server', prepareBuildNotificationServer())
    buildFrontendList.add(buildFrontendStages)
    return buildFrontendList
}

def prepareBuildBackend() {
    return {
        stage('Build Backend') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def tfrsJson = openshift.process(readFile(file:'openshift/templates/components/backend/tfrs-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "TFRS_IS_NAME=tfrs")
                        def tfrsBuild = openshift.apply(tfrsJson)
                        def tfrsSelector = openshift.selector("bc", "tfrs")
                        tfrsSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def prepareBuildScanCoordinator() {
  return {
    stage('Build-Scan-Coordinator') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def scanCoordinatorJson = openshift.process(readFile(file:'openshift/templates/components/scan-coordinator/scan-coordinator-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "SCAN_COORDINATOR_IS_NAME=scan-coordinator")
                        def scanCoordinatorBuild = openshift.apply(scanCoordinatorJson)
                        def scanCoordinatorSelector = openshift.selector("bc", "scan-coordinator")
                        scanCoordinatorSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
    }
  }
}

def prepareBuildScanHandler() {
  return {
    stage('Build-Scan-Handler') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def scanHandlerJson = openshift.process(readFile(file:'openshift/templates/components/scan-handler/scan-handler-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "SCAN_HANDLER_IS_NAME=scan-handler")
                        def scanHandlerBuild = openshift.apply(scanHandlerJson)
                        def scanHandlerSelector = openshift.selector("bc", "scan-handler")
                        scanHandlerSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
    }
  }
}

def prepareBuildCelery() {
  return {
    stage('Build-Celery') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def celeryJson = openshift.process(readFile(file:'openshift/templates/components/celery/celery-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "CELERY_IS_NAME=celery")
                        def celeryBuild = openshift.apply(celeryJson)
                        def celeryBuildSelector = openshift.selector("bc", "celery")
                        celeryBuildSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
    }
  }
}

def prepareBuildFrontend() {
  return {
    stage('Build Frontend') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def clientAngularJson = openshift.process(readFile(file:'openshift/templates/components/frontend/client-angular-app-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "CLIENT_ANGULAR_APP_IS_NAME=client-angular-app")
                        def clientAngularBuild = openshift.apply(clientAngularJson)
                        def clientAngularBuildSelector = openshift.selector("bc", "client-angular-app")
                        clientAngularBuildSelector.startBuild("--wait")
                        def clientJson = openshift.process(readFile(file:'openshift/templates/components/frontend/client-bc.json'), "-p", "CLIENT_IS_NAME=client", "CLIENT_ANGULAR_APP_IS_NAME=client-angular-app")
                        def clientBuild = openshift.apply(clientJson)
                        def clientBuildSelector = openshift.selector("bc", "client")
                        clientBuildSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
    }
  }
}

def prepareBuildNotificationServer() {
  return {
    stage('Build Notification') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def notificationJson = openshift.process(readFile(file:'openshift/templates/components/notification/notification-server-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "NOTIFICATION_SERVER_IS_NAME=notification-server")
                        def notificationBuild = openshift.apply(notificationJson)
                        def notificationSelector = openshift.selector("bc", "notification-server")
                        notificationSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
    }

  }
}

stage('Unit Test') {
    podTemplate(label: "master-backend-python-${env.BUILD_NUMBER}", name: "master-backend-python-${env.BUILD_NUMBER}", serviceAccount: 'jenkins-basic', cloud: 'openshift',
        containers: [
            containerTemplate(
                name: 'jnlp',
                image: 'docker-registry.default.svc:5000/openshift/jenkins-slave-python-rhel7',
                resourceRequestCpu: '500m',
                resourceLimitCpu: '1000m',
                resourceRequestMemory: '2Gi',
                resourceLimitMemory: '4Gi',
                workingDir: '/home/jenkins',
                command: '',
                args: '${computer.jnlpmac} ${computer.name}'
            )
        ]
    ){
    node("master-backend-python-${env.BUILD_NUMBER}") {
        checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: "${tfrsRelease}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github-account', url: 'https://github.com/bcgov/tfrs.git']]]
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
    } //end of node
    } //end of podTemplate
} //end of stage
        
echo "result is ${result}"
if (result != 0) {
    echo "[FAILURE] Unit Test stage failed"
    currentBuild.result = 'FAILURE'
    return
}

backendBuildStages = prepareBackendBuildStages()
frontendBuildStages = prepareFrontendBuildStages()
        
podTemplate(label: "master-maven-${env.BUILD_NUMBER}", name: "master-maven-${env.BUILD_NUMBER}", serviceAccount: 'jenkins-basic', cloud: 'openshift',
        containers: [
            containerTemplate(
                name: 'jnlp',
                image: 'registry.access.redhat.com/openshift3/jenkins-slave-maven-rhel7:v3.9',
                resourceRequestCpu: '500m',
                resourceLimitCpu: '1000m',
                resourceRequestMemory: '2Gi',
                resourceLimitMemory: '4Gi',
                workingDir: '/home/jenkins',
                command: '',
                args: '${computer.jnlpmac} ${computer.name}'
            )
        ]
) {
node("master-maven-${env.BUILD_NUMBER}") {

    checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: "${tfrsRelease}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github-account', url: 'https://github.com/bcgov/tfrs.git']]]

    //run frontend builds
    for (builds in frontendBuildStages) {
        if (runParallel) {
            parallel(builds)
        } else {
            // run serially (nb. Map is unordered! )
            for (build in builds.values()) {
                build.call()
            }
        }
    }

    //run backend builds
    for (builds in backendBuildStages) {
        if (runParallel) {
            parallel(builds)
        } else {
            // run serially (nb. Map is unordered! )
            for (build in builds.values()) {
                build.call()
            }
        }
    }

    stage ('Confirm to deploy to Test') {
        input "Deploy release ${tfrsRelease} to Test? There will be one more confirmation before deploying on Test."
    }

    stage('Bring up Maintenance Page on Test') {
        sh returnStatus: true, script: "oc scale dc maintenance-page -n mem-tfrs-test --replicas=1 --timeout=20s"
        sh returnStatus: true, script: "oc patch route/test-lowcarbonfuels-frontend -n mem-tfrs-test -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
        sh returnStatus: true, script: "oc patch route/test-lowcarbonfuels-backend -n mem-tfrs-test -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
    }

    stage('Backup Test Database') {
        postgresql_pod_name=sh (script: 'oc get pods -n mem-tfrs-test | grep postgresql96 | awk \'{print $1}\'', returnStdout: true).trim()
        echo "start backup script tfrs-backup.sh on test, postgresql_pod_name is ${postgresql_pod_name}"
        sh returnStdout: true, script: "oc exec ${postgresql_pod_name} -c postgresql96 -n mem-tfrs-test -- bash /postgresql-backup/tfrs-backup.sh ${tfrsRelease} test"
        echo 'backup script completed'
    }
	
    stage ('Last confirmation to deploy to Test') {
        input "Maintenance Page is up and Test Database backup has completed, confirm to deploy ${tfrsRelease} to Test? This is the last confirmation required."
    }

    stage('Apply Deployment Configs') {
        timeout(30) {
            script {
                openshift.withProject("mem-tfrs-test") {
                    def backendDCJson = openshift.process(readFile(file:'openshift/templates/components/backend/tfrs-dc.json'), 
                        "-p", 
                        "ENV_NAME=test", 
                        "SOURCE_IS_NAME=tfrs",
                        "ROUTE_HOST_NAME=test-lowcarbonfuels.pathfinder.gov.bc.ca",
                        "ROUTE_NAME=test-lowcarbonfuels-backend",
                        "KEYCLOAK_SA_BASEURL=https://sso-test.pathfinder.gov.bc.ca",
                        "KEYCLOAK_SA_CLIENT_ID=tfrs-django-sa",
                        "KEYCLOAK_SA_REALM=tfrs",
                        "KEYCLOAK_AUDIENCE=tfrs",
                        "KEYCLOAK_CERTS_URL=https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs/protocol/openid-connect/certs",
                        "KEYCLOAK_CLIENT_ID=tfrs",
                        "KEYCLOAK_ISSUER=https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs",
                        "KEYCLOAK_REALM=https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs")
                    def backendDC = openshift.apply(backendDCJson)
                    sh 'sleep 120s'
                } //end of openshift.withProject
            } //end of script
        }
    }

    stage('Deploy Backend to Test') {
        script {
            openshift.withProject("mem-tfrs-tools") {
                openshift.tag("mem-tfrs-tools/tfrs:latest", "mem-tfrs-tools/tfrs:test")
                sh 'sleep 120s'
            }
        }
    }
	
    stage('Deploy scan-coordinator, scan-handler and celery to Test') {
        script {
            openshift.withProject("mem-tfrs-tools") {
                openshift.tag("mem-tfrs-tools/scan-coordinator:latest", "mem-tfrs-tools/scan-coordinator:test")
                sh 'sleep 30s'
                openshift.tag("mem-tfrs-tools/scan-handler:latest", "mem-tfrs-tools/scan-handler:test")
                sh 'sleep 30s'
                openshift.tag("mem-tfrs-tools/celery:latest", "mem-tfrs-tools/celery:test")
                sh 'sleep 30s'
            }
        }
    }

    stage('Deploy Frontend on Test') {
        script {
            openshift.withProject("mem-tfrs-tools") {
                openshift.tag("mem-tfrs-tools/client:latest", "mem-tfrs-tools/client:test")
                sh 'sleep 30s'
                openshift.tag("mem-tfrs-tools/notification-server:latest", "mem-tfrs-tools/notification-server:test")
                sh 'sleep 30s'
            }
        }
    }
    stage('Take down Maintenance Page on Test') {
	    input "Before taking dowm the maintenance page, this is the last chance to make a change on Test."
        sh returnStatus: true, script: "oc patch route/test-lowcarbonfuels-backend -n mem-tfrs-test -p '{\"spec\":{\"to\":{\"name\":\"backend\"}, \"port\":{\"targetPort\":\"web\"}}}'"
        sh returnStatus: true, script: "oc patch route/test-lowcarbonfuels-frontend -n mem-tfrs-test -p '{\"spec\":{\"to\":{\"name\":\"client\"}, \"port\":{\"targetPort\":\"web\"}}}'"
        sh returnStatus: true, script: "oc scale dc maintenance-page -n mem-tfrs-test --replicas=0 --timeout=20s"
    }

    stage('Refresh SchemaSpy on Test') {
        echo "Refreshing SchemaSpy for Test Database"
        sh returnStdout: true, script: "oc scale dc schema-spy-public --replicas=0 -n mem-tfrs-test"
        sh 'sleep 10s'
        sh returnStdout: true, script: "oc scale dc schema-spy-public --replicas=1 -n mem-tfrs-test"
        sh returnStdout: true, script: "oc scale dc schema-spy-audit --replicas=0 -n mem-tfrs-test"
        sh 'sleep 10s'
        sh returnStdout: true, script: "oc scale dc schema-spy-audit --replicas=1 -n mem-tfrs-test"
    }     

    stage ('Confirm to deploy to Prod') {
        input "Deploy release ${tfrsRelease} to Prod? There will be one more confirmation before deploying on Prod."
    }

    stage('Bring up Maintenance Page on Prod') {
        sh returnStatus: true, script: "oc scale dc maintenance-page -n mem-tfrs-prod --replicas=1 --timeout=20s"
        sh returnStatus: true, script: "oc patch route/lowcarbonfuels-frontend -n mem-tfrs-prod -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
        sh returnStatus: true, script: "oc patch route/lowcarbonfuels-backend -n mem-tfrs-prod -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
    }

    stage('Backup Prod Database') {
        postgresql_pod_name=sh (script: 'oc get pods -n mem-tfrs-prod | grep postgresql96 | awk \'{print $1}\'', returnStdout: true).trim()
        echo "start backup script tfrsdump-prod.sh on prod, postgresql_pod_name is ${postgresql_pod_name}"
        sh returnStdout: true, script: "oc exec ${postgresql_pod_name} -c postgresql96 -n mem-tfrs-prod -- bash /postgresql-backup/tfrs-backup.sh ${tfrsRelease} prod"
        echo 'backup script completed'
    }

    stage ('Last confirmation to deploy to Prod') {
        input "Maintenance Page is up and Prod Database backup has completed, confirm to deploy ${tfrsRelease} to Prod? This is the last confirmation required."
    }

    stage('Apply Deployment Configs') {
        timeout(30) {
            script {
                openshift.withProject("mem-tfrs-prod") {
                    def backendDCJson = openshift.process(readFile(file:'openshift/templates/components/backend/tfrs-dc.json'), 
                        "-p", 
                        "ENV_NAME=prod", 
                        "SOURCE_IS_NAME=tfrs",
                        "ROUTE_HOST_NAME=lowcarbonfuels.gov.bc.ca",
                        "ROUTE_NAME=lowcarbonfuels-backend",
                        "KEYCLOAK_SA_BASEURL=https://sso.pathfinder.gov.bc.ca",
                        "KEYCLOAK_SA_CLIENT_ID=tfrs-django-sa",
                        "KEYCLOAK_SA_REALM=tfrs",
                        "KEYCLOAK_AUDIENCE=tfrs",
                        "KEYCLOAK_CERTS_URL=https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs/protocol/openid-connect/certs",
                        "KEYCLOAK_CLIENT_ID=tfrs",
                        "KEYCLOAK_ISSUER=https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs",
                        "KEYCLOAK_REALM=https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs")
                    def backendDC = openshift.apply(backendDCJson)
                    sh 'sleep 120s'
                } //end of openshift.withProject
            } //end of script
        }
    }

    stage('Deploy Backend to Prod') {
        script {
            openshift.withProject("mem-tfrs-tools") {
                openshift.tag("mem-tfrs-tools/tfrs:latest", "mem-tfrs-tools/tfrs:prod")
                sh 'sleep 120s'
            }
        }
    }
	
    stage('Deploy scan-coordinator, scan-handler and celery to Prod') {
        script {
            openshift.withProject("mem-tfrs-tools") {
                openshift.tag("mem-tfrs-tools/scan-coordinator:latest", "mem-tfrs-tools/scan-coordinator:prod")
                sh 'sleep 30s'
                openshift.tag("mem-tfrs-tools/scan-handler:latest", "mem-tfrs-tools/scan-handler:prod")
                sh 'sleep 30s'
                openshift.tag("mem-tfrs-tools/celery:latest", "mem-tfrs-tools/celery:prod")
                sh 'sleep 30s'
            }
        }
    }
	
    stage('Deploy Frontend on Prod') {
        script {
            openshift.withProject("mem-tfrs-tools") {
                openshift.tag("mem-tfrs-tools/client:latest", "mem-tfrs-tools/client:prod")
                sh 'sleep 30s'
                openshift.tag("mem-tfrs-tools/notification-server:latest", "mem-tfrs-tools/notification-server:prod")
                sh 'sleep 30s'
            }
        }
    }

    stage('Take down Maintenance Page on Prod') {
	input "Before taking dowm the maintenance page, this is the last chance to make a change on Prod."
        sh returnStatus: true, script: "oc patch route/lowcarbonfuels-backend -n mem-tfrs-prod -p '{\"spec\":{\"to\":{\"name\":\"backend\"}, \"port\":{\"targetPort\":\"web\"}}}'"
        sh returnStatus: true, script: "oc patch route/lowcarbonfuels-frontend -n mem-tfrs-prod -p '{\"spec\":{\"to\":{\"name\":\"client\"}, \"port\":{\"targetPort\":\"web\"}}}'"
        sh returnStatus: true, script: "oc scale dc maintenance-page -n mem-tfrs-prod --replicas=0 --timeout=20s"
    }

    stage('Refresh SchemaSpy on Prod') {
        echo "Refreshing SchemaSpy for Prod Database"
        sh returnStdout: true, script: "oc scale dc schema-spy-public --replicas=0 -n mem-tfrs-prod"
        sh 'sleep 10s'
        sh returnStdout: true, script: "oc scale dc schema-spy-public --replicas=1 -n mem-tfrs-prod"
        sh returnStdout: true, script: "oc scale dc schema-spy-audit --replicas=0 -n mem-tfrs-prod"
        sh 'sleep 10s'
        sh returnStdout: true, script: "oc scale dc schema-spy-audit --replicas=1 -n mem-tfrs-prod"
    }      

} //end of node
} //end of podTemplate
