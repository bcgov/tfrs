def backendBuildStages() {
    def buildBackendList = []
    def buildBackendStages = [:]
    buildBackendStages.put('Build Backend', prepareBuildBackend())
    buildBackendStages.put('Build Scan Coordinator', prepareBuildScanCoordinator())
    buildBackendStages.put('Build ScanHandler', prepareBuildScanHandler())
    buildBackendStages.put('Build Celery', prepareBuildCelery())
    buildBackendList.add(buildBackendStages)
    return buildBackendList
}

def frontendBuildStages() {
    def buildFrontendList = []
    def buildFrontendStages = [:]
    buildFrontendStages.put('Build Frontend', prepareBuildFrontend())
    buildFrontendStages.put('Build Notification Server', prepareBuildNotificationServer())
    buildFrontendList.add(buildFrontendStages)
    return buildFrontendList
}

def prepareBuildBackend() {
    return {
        stage('Build-Backend') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def tfrsJson = openshift.process(readFile(file:'openshift/templates/components/backend/tfrs-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "TFRS_IS_NAME=tfrs-develop")
                        def tfrsBuild = openshift.apply(tfrsJson)
                        def tfrsSelector = openshift.selector("bc", "tfrs-develop")
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
                        def scanCoordinatorJson = openshift.process(readFile(file:'openshift/templates/components/scan-coordinator/scan-coordinator-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "SCAN_COORDINATOR_IS_NAME=scan-coordinator-develop")
                        def scanCoordinatorBuild = openshift.apply(scanCoordinatorJson)
                        def scanCoordinatorSelector = openshift.selector("bc", "scan-coordinator-develop")
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
                        def scanHandlerJson = openshift.process(readFile(file:'openshift/templates/components/scan-handler/scan-handler-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "SCAN_HANDLER_IS_NAME=scan-handler-develop")
                        def scanHandlerBuild = openshift.apply(scanHandlerJson)
                        def scanHandlerSelector = openshift.selector("bc", "scan-handler-develop")
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
                        def celeryJson = openshift.process(readFile(file:'openshift/templates/components/celery/celery-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "CELERY_IS_NAME=celery-develop")
                        def celeryBuild = openshift.apply(celeryJson)
                        def celeryBuildSelector = openshift.selector("bc", "celery-develop")
                        celeryBuildSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def prepareBuildFrontend() {
    return {
        stage('Build-Frontend') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def clientAngularJson = openshift.process(readFile(file:'openshift/templates/components/frontend/client-angular-app-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "CLIENT_ANGULAR_APP_IS_NAME=client-develop-angular-app")
                        def clientAngularBuild = openshift.apply(clientAngularJson)
                        def clientAngularBuildSelector = openshift.selector("bc", "client-develop-angular-app")
                        clientAngularBuildSelector.startBuild("--wait")
                        def clientJson = openshift.process(readFile(file:'openshift/templates/components/frontend/client-bc.json'), "-p", "CLIENT_IS_NAME=client-develop", "CLIENT_ANGULAR_APP_IS_NAME=client-develop-angular-app")
                        def clientBuild = openshift.apply(clientJson)
                        def clientBuildSelector = openshift.selector("bc", "client-develop")
                        clientBuildSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def prepareBuildNotificationServer() {
    return {
        stage('Build-Notification-Server') {
            timeout(30) {
                script {
                    openshift.withProject("mem-tfrs-tools") {
                        def notificationJson = openshift.process(readFile(file:'openshift/templates/components/notification/notification-server-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "NOTIFICATION_SERVER_IS_NAME=notification-server-develop")
                        def notificationBuild = openshift.apply(notificationJson)
                        def notificationSelector = openshift.selector("bc", "notification-server-develop")
                        notificationSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def sonarqubeStage() {
    return {
        stage('Code Quality Check') {
            //checkout scm
            sh 'sleep 600s'
            SONARQUBE_PWD = sh (
                script: 'oc set env dc/sonarqube --list | awk  -F  "=" \'/SONARQUBE_ADMINPW/{print $2}\'',
                returnStdout: true
            ).trim()
            echo ">> SONARQUBE_PWD: ${SONARQUBE_PWD}"

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

return this