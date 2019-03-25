tfrs_release='v1.2.19'
result = 0
runParallel = true
IMAGE_HASH_FRONTEND = 'nonexist123'
IMAGE_HASH_NOTIFICATION = 'nonexist123'
IMAGE_HASH_BACKEND = 'nonexist123'
IMAGE_HASH_SCAN_COORDINATOR = 'nonexist123'
IMAGE_HASH_SCAN_HANDLER = 'nonexist123'
IMAGE_HASH_CELERY = 'nonexist123'

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
        openshiftBuild bldCfg: 'tfrs', showBuildLogs: 'true'
        echo ">> Getting Image Hash"
        IMAGE_HASH_BACKEND = sh (
            script: 'oc get istag tfrs:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
 	            returnStdout: true).trim()
        echo ">> IMAGE_HASH_BACKEND: $IMAGE_HASH_BACKEND"
    }
  }
}

def prepareBuildScanCoordinator() {
  return {
    stage('Build-Scan-Coordinator') {
        openshiftBuild bldCfg: 'scan-coordinator', showBuildLogs: 'true'
        echo ">> Getting Image Hash"
        IMAGE_HASH_SCAN_COORDINATOR = sh (
            script: 'oc get istag scan-coordinator:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
 	            returnStdout: true).trim()
        echo ">> IMAGE_HASH_SCAN_COORDINATOR: $IMAGE_HASH_SCAN_COORDINATOR"
    }
  }
}

def prepareBuildScanHandler() {
  return {
    stage('Build-Scan-Handler') {
        openshiftBuild bldCfg: 'scan-handler', showBuildLogs: 'true'
        echo ">> Getting Image Hash"
        IMAGE_HASH_SCAN_HANDLER = sh (
            script: 'oc get istag scan-handler:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
 	            returnStdout: true).trim()
        echo ">> IMAGE_HASH_SCAN_HANDLER: $IMAGE_HASH_SCAN_HANDLER"
    }
  }
}

def prepareBuildCelery() {
  return {
    stage('Build-Celery') {
        openshiftBuild bldCfg: 'celery', showBuildLogs: 'true'
        echo ">> Getting Image Hash"
        IMAGE_HASH_CELERY = sh (
            script: 'oc get istag celery:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
 	            returnStdout: true).trim()
        echo ">> IMAGE_HASH_CELERY: $IMAGE_HASH_CELERY"
    }
  }
}

def prepareBuildFrontend() {
  return {
    stage('Build Frontend') {
        echo "Building Frontend..."
	    openshiftBuild bldCfg: 'client-angular-app-build', showBuildLogs: 'true'
        openshiftBuild bldCfg: 'client', showBuildLogs: 'true'
        echo ">> Getting Image Hash"
        IMAGE_HASH_FRONTEND = sh (
            script: 'oc get istag client:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
 	            returnStdout: true).trim()
        echo ">> IMAGE_HASH_FRONTEND: $IMAGE_HASH_FRONTEND"
    }
  }
}

def prepareBuildNotificationServer() {
  return {
    stage('Build Notification') {
        echo "Building Notification Server ..."
	    openshiftBuild bldCfg: 'notification-server', showBuildLogs: 'true'
        echo ">> Getting Image Hash"
        IMAGE_HASH_NOTIFICATION = sh (
            script: 'oc get istag notification-server:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
 	            returnStdout: true).trim()
        echo ">> IMAGE_HASH_NOTIFICATION: $IMAGE_HASH_NOTIFICATION"
    }

  }
}

stage('Unit Test') {
    podTemplate(label: "master-backend-python-${env.BUILD_NUMBER}", name: "master-backend-python-${env.BUILD_NUMBER}", serviceAccount: 'jenkins', cloud: 'openshift',
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
        checkout scm
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
        
podTemplate(label: "master-maven-${env.BUILD_NUMBER}", name: "master-maven-${env.BUILD_NUMBER}", serviceAccount: 'jenkins', cloud: 'openshift',
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
        input "Deploy to Test?"
        input "Reminder of full database backup and point in time backup have been done."
        input "Deploy to Test? This is the last confirmation required."
        echo "Deploying to Test: ${BUILD_ID}"
    }

    stage('Bring up Maintenance Page') {
        sh returnStatus: true, script: "oc scale dc maintenance-page -n mem-tfrs-test --replicas=1 --timeout=20s"
        sh returnStatus: true, script: "oc patch route/test-lowcarbonfuels-frontend -n mem-tfrs-test -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
        sh returnStatus: true, script: "oc patch route/test-lowcarbonfuels-backend -n mem-tfrs-test -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
    }

    stage('Backup Test Database') {
        postgresql_pod_name=sh (script: 'oc get pods -n mem-tfrs-test | grep postgresql96 | awk \'{print $1}\'', returnStdout: true).trim()
        echo "start backup script tfrs-backup.sh on test, postgresql_pod_name is ${postgresql_pod_name}"
        sh returnStdout: true, script: "oc exec ${postgresql_pod_name} -c postgresql96 -n mem-tfrs-test -- bash /postgresql-backup/tfrs-backup.sh ${tfrs_release} test"
        echo 'backup script completed'
    }

    stage('Deploy Frontend on Test') {
        openshiftTag destStream: 'client', verbose: 'true', destTag: 'test', srcStream: 'client', srcTag: "${IMAGE_HASH_FRONTEND}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'client', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false'
        openshiftTag destStream: 'notification-server', verbose: 'true', destTag: 'test', srcStream: 'notification-server', srcTag: "${IMAGE_HASH_NOTIFICATION}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'notification-server', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false'
    }

    stage('Deploy Backend to Test') {
        openshiftTag destStream: 'tfrs', verbose: 'true', destTag: 'test', srcStream: 'tfrs', srcTag: "${IMAGE_HASH_BACKEND}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'tfrs', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false'
        openshiftTag destStream: 'scan-coordinator', verbose: 'true', destTag: 'test', srcStream: 'scan-coordinator', srcTag: "${IMAGE_HASH_SCAN_COORDINATOR}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'scan-coordinator', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false'
        openshiftTag destStream: 'scan-handler', verbose: 'true', destTag: 'test', srcStream: 'scan-handler', srcTag: "${IMAGE_HASH_SCAN_HANDLER}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'scan-handler', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false'
        openshiftTag destStream: 'celery', verbose: 'true', destTag: 'test', srcStream: 'celery', srcTag: "${IMAGE_HASH_CELERY}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'celery', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false'
    }

    stage('Take down Maintenance Page on Test') {
        sh returnStatus: true, script: "oc patch route/test-lowcarbonfuels-backend -n mem-tfrs-test -p '{\"spec\":{\"to\":{\"name\":\"backend\"}, \"port\":{\"targetPort\":\"web\"}}}'"
        sh returnStatus: true, script: "oc patch route/test-lowcarbonfuels-frontend -n mem-tfrs-test -p '{\"spec\":{\"to\":{\"name\":\"client\"}, \"port\":{\"targetPort\":\"web\"}}}'"
        sh returnStatus: true, script: "oc scale dc maintenance-page -n mem-tfrs-test --replicas=0 --timeout=20s"
    }

    stage('Refresh SchemaSpy Test') {
        echo "Refreshing SchemaSpy for Test Database"
        openshiftScale depCfg: 'schema-spy-public', namespace: 'mem-tfrs-test', replicaCount: 0, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
        openshiftScale depCfg: 'schema-spy-public', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
        openshiftScale depCfg: 'schema-spy-audit', namespace: 'mem-tfrs-test', replicaCount: 0, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
        openshiftScale depCfg: 'schema-spy-audit', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
    }    

    stage ('Confirm to deploy to Prod') {
        input "Deploy to Prod?"
        input "Reminder of full database backup and updating maintenance page."
        input "Deploy to Prod? Please confirm again."
        input "Deploy to Prod? This is the last confirmation required."
        echo "Deploying to Prod: ${BUILD_ID}"
    }

    stage('Bring up Maintenance Page') {
        sh returnStatus: true, script: "oc scale dc maintenance-page -n mem-tfrs-prod --replicas=1 --timeout=20s"
        sh returnStatus: true, script: "oc patch route/lowcarbonfuels-frontend -n mem-tfrs-prod -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
        sh returnStatus: true, script: "oc patch route/lowcarbonfuels-backend -n mem-tfrs-prod -p '{\"spec\":{\"to\":{\"name\":\"maintenance-page\"}, \"port\":{\"targetPort\":\"2015-tcp\"}}}'"
    }

    stage('Backup Prod Database') {
        postgresql_pod_name=sh (script: 'oc get pods -n mem-tfrs-prod | grep postgresql96 | awk \'{print $1}\'', returnStdout: true).trim()
        echo "start backup script tfrsdump-prod.sh on prod, postgresql_pod_name is ${postgresql_pod_name}"
        sh returnStdout: true, script: "oc exec ${postgresql_pod_name} -c postgresql96 -n mem-tfrs-prod -- bash /postgresql-backup/tfrs-backup.sh ${tfrs_release} prod"
        echo 'backup script completed'
    }

    stage('Deploy to Prod') {
        openshiftTag destStream: 'tfrs', verbose: 'true', destTag: 'prod', srcStream: 'tfrs', srcTag: "${IMAGE_HASH_BACKEND}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'tfrs', namespace: 'mem-tfrs-prod', replicaCount: 1, verbose: 'false'
        openshiftTag destStream: 'scan-coordinator', verbose: 'true', destTag: 'prod', srcStream: 'scan-coordinator', srcTag: "${IMAGE_HASH_SCAN_COORDINATOR}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'scan-coordinator', namespace: 'mem-tfrs-prod', replicaCount: 1, verbose: 'false'
        openshiftTag destStream: 'scan-handler', verbose: 'true', destTag: 'prod', srcStream: 'scan-handler', srcTag: "${IMAGE_HASH_SCAN_HANDLER}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'scan-handler', namespace: 'mem-tfrs-prod', replicaCount: 1, verbose: 'false'
        openshiftTag destStream: 'celery', verbose: 'true', destTag: 'prod', srcStream: 'celery', srcTag: "${IMAGE_HASH_CELERY}"
        sh 'sleep 5s'
        openshiftVerifyDeployment depCfg: 'celery', namespace: 'mem-tfrs-prod', replicaCount: 1, verbose: 'false'
    }    

    stage('Take down Maintenance Page on Prod') {
        sh returnStatus: true, script: "oc patch route/lowcarbonfuels-backend -n mem-tfrs-prod -p '{\"spec\":{\"to\":{\"name\":\"backend\"}, \"port\":{\"targetPort\":\"web\"}}}'"
        sh returnStatus: true, script: "oc patch route/lowcarbonfuels-frontend -n mem-tfrs-prod -p '{\"spec\":{\"to\":{\"name\":\"client\"}, \"port\":{\"targetPort\":\"web\"}}}'"
        sh returnStatus: true, script: "oc scale dc maintenance-page -n mem-tfrs-prod --replicas=0 --timeout=20s"
    }

    stage('Refresh SchemaSpy Prod') {
        echo "Refreshing SchemaSpy for Test Database"
        openshiftScale depCfg: 'schema-spy-public', namespace: 'mem-tfrs-prod', replicaCount: 0, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
        openshiftScale depCfg: 'schema-spy-public', namespace: 'mem-tfrs-prod', replicaCount: 1, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
        openshiftScale depCfg: 'schema-spy-audit', namespace: 'mem-tfrs-prod', replicaCount: 0, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
        openshiftScale depCfg: 'schema-spy-audit', namespace: 'mem-tfrs-prod', replicaCount: 1, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
    }    

} //end of node
} //end of podTemplate
