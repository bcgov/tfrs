def backendBuildStages(String envName) {
    def buildBackendList = []
    def buildBackendStages = [:]
    buildBackendStages.put('Build Backend', prepareBuildBackend(envName))
    buildBackendStages.put('Build Scan Coordinator', prepareBuildScanCoordinator(envName))
    buildBackendStages.put('Build ScanHandler', prepareBuildScanHandler(envName))
    buildBackendStages.put('Build Celery', prepareBuildCelery(envName))
    buildBackendList.add(buildBackendStages)
    return buildBackendList
}

def frontendBuildStages(String envName) {
    def buildFrontendList = []
    def buildFrontendStages = [:]
    buildFrontendStages.put('Build Frontend', prepareBuildFrontend(envName))
    buildFrontendStages.put('Build Notification Server', prepareBuildNotificationServer(envName))
    buildFrontendList.add(buildFrontendStages)
    return buildFrontendList
}

def prepareBuildBackend(String envName) {
    return {
        stage('Build-Backend') {
            timeout(30) {
                script {
                    def IS_NAME
                    if(envName == 'dev') {
                        IS_NAME='tfrs-develop'
                    } else if(envName == 'test' || envName == 'prod') {
                        IS_NAME='tfrs'
                    }
                    openshift.withProject("mem-tfrs-tools") {
                        def tfrsJson = openshift.process(readFile(file:'openshift/templates/components/backend/tfrs-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "TFRS_IS_NAME=${IS_NAME}")
                        def tfrsBuild = openshift.apply(tfrsJson)
                        def tfrsSelector = openshift.selector("bc", "${IS_NAME}")
                        tfrsSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def prepareBuildScanCoordinator(String envName) {
    return {
        stage('Build-Scan-Coordinator') {
            timeout(30) {
                script {
                    def IS_NAME
                    if(envName == 'dev') {
                        IS_NAME='scan-coordinator-develop'
                    } else if(envName == 'test' || envName == 'prod') {
                        IS_NAME='scan-coordinator'
                    }
                    openshift.withProject("mem-tfrs-tools") {
                        def scanCoordinatorJson = openshift.process(readFile(file:'openshift/templates/components/scan-coordinator/scan-coordinator-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "SCAN_COORDINATOR_IS_NAME=${IS_NAME}")
                        def scanCoordinatorBuild = openshift.apply(scanCoordinatorJson)
                        def scanCoordinatorSelector = openshift.selector("bc", "${IS_NAME}")
                        scanCoordinatorSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def prepareBuildScanHandler(String envName) {
    return {
        stage('Build-Scan-Handler') {
            timeout(30) {
                script {
                    def IS_NAME
                    if(envName == 'dev') {
                        IS_NAME='scan-handler-develop'
                    } else if(envName == 'test' || envName == 'prod') {
                        IS_NAME='scan-handler'
                    }
                    openshift.withProject("mem-tfrs-tools") {
                        def scanHandlerJson = openshift.process(readFile(file:'openshift/templates/components/scan-handler/scan-handler-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "SCAN_HANDLER_IS_NAME=${IS_NAME}")
                        def scanHandlerBuild = openshift.apply(scanHandlerJson)
                        def scanHandlerSelector = openshift.selector("bc", "${IS_NAME}")
                        scanHandlerSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def prepareBuildCelery(String envName) {
    return {
        stage('Build-Celery') {
            timeout(30) {
                script {
                    def IS_NAME
                    if(envName == 'dev') {
                        IS_NAME='celery-develop'
                    } else if(envName == 'test' || envName == 'prod') {
                        IS_NAME='celery'
                    }
                    openshift.withProject("mem-tfrs-tools") {
                        def celeryJson = openshift.process(readFile(file:'openshift/templates/components/celery/celery-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "CELERY_IS_NAME=${IS_NAME}")
                        def celeryBuild = openshift.apply(celeryJson)
                        def celeryBuildSelector = openshift.selector("bc", "${IS_NAME}")
                        celeryBuildSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def prepareBuildFrontend(String envName) {
    return {
        stage('Build-Frontend') {
            timeout(30) {
                script {
                    def BASE_IS_NAME
                    def IS_NAME
                    if(envName == 'dev') {
                        BASE_IS_NAME='client-develop-angular-app'
                        IS_NAME='client-develop'
                    } else if(envName == 'test' || envName == 'prod') {
                        BASE_IS_NAME='client-angular-app'
                        IS_NAME='client'
                    }
                    openshift.withProject("mem-tfrs-tools") {
                        def clientAngularJson = openshift.process(readFile(file:'openshift/templates/components/frontend/client-angular-app-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "CLIENT_ANGULAR_APP_IS_NAME=${BASE_IS_NAME}")
                        def clientAngularBuild = openshift.apply(clientAngularJson)
                        def clientAngularBuildSelector = openshift.selector("bc", "${BASE_IS_NAME}")
                        clientAngularBuildSelector.startBuild("--wait")
                        def clientJson = openshift.process(readFile(file:'openshift/templates/components/frontend/client-bc.json'), "-p", "CLIENT_IS_NAME=${IS_NAME}", "CLIENT_ANGULAR_APP_IS_NAME=${BASE_IS_NAME}")
                        def clientBuild = openshift.apply(clientJson)
                        def clientBuildSelector = openshift.selector("bc", "${IS_NAME}")
                        clientBuildSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

def prepareBuildNotificationServer(String envName) {
    return {
        stage('Build-Notification-Server') {
            timeout(30) {
                script {
                    def IS_NAME
                    if(envName == 'dev') {
                        IS_NAME='notification-server-develop'
                    } else if(envName == 'test' || envName == 'prod') {
                        IS_NAME='notification-server'
                    }
                    openshift.withProject("mem-tfrs-tools") {
                        def notificationJson = openshift.process(readFile(file:'openshift/templates/components/notification/notification-server-bc.json'), "-p", "TFRS_RELEASE_TAG=${tfrsRelease}", "NOTIFICATION_SERVER_IS_NAME=${IS_NAME}")
                        def notificationBuild = openshift.apply(notificationJson)
                        def notificationSelector = openshift.selector("bc", "${IS_NAME}")
                        notificationSelector.startBuild("--wait")
                    } //end of openshift.withProject
                } //end of script
            } //end of timeout
        }
    }
}

return this