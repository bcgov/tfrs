def result = 0;
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
        try {
            sh 'cd backend && pip install --upgrade pip && pip install -r requirements.txt'
            sh 'cd backend && coverage erase && coverage run --source=. manage.py test && coverage html && coverage xml'
        } catch(Throwable t) {
            result = 1;
            mail (from: "${EMAIL_FROM}", to: "${EMAIL_TO}", subject: "FYI: Job '${env.JOB_NAME}' (${env.BUILD_NUMBER}) unit test failed", body: "See ${env.BUILD_URL} for details. ");
        } finally {
            if(fileExists('backend/htmlcov/index.html')) {
                publishHTML (target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'backend/htmlcov',
                    reportFiles: 'index.html',
                    reportName: "Unit Test Code Coverage Report" ])
            }
        } //end of finally
    } //end of node
    } //end of podTemplate
} //end of stage
        
echo "result is ${result}"
if (result != 0) {
    echo "[FAILURE] Unit Test stage failed"
    currentBuild.result = 'FAILURE'
    return
}
        
podTemplate(label: "master-backend-maven-${env.BUILD_NUMBER}", name: "master-backend-maven-${env.BUILD_NUMBER}", serviceAccount: 'jenkins', cloud: 'openshift',
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
node("master-backend-maven-${env.BUILD_NUMBER}") {
    
    stage('Build') {
        openshiftBuild bldCfg: 'tfrs', showBuildLogs: 'true'
        echo ">> Getting Image Hash"
        IMAGE_HASH = sh (
            script: 'oc get istag tfrs:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
 	            returnStdout: true).trim()
        echo ">> IMAGE_HASH: $IMAGE_HASH"
    }

    stage('Deploy to Test') {
        input "Deploy to Test?"
        echo "Deploying to Test: ${BUILD_ID}"
        openshiftTag destStream: 'tfrs', verbose: 'true', destTag: 'test', srcStream: 'tfrs', srcTag: "${IMAGE_HASH}"
        openshiftVerifyDeployment depCfg: 'tfrs', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false'
    }
    
    stage('Refresh SchemaSpy Test') {
        echo "Refreshing SchemaSpy for Test Database"
        openshiftScale depCfg: 'schema-spy', namespace: 'mem-tfrs-test', replicaCount: 0, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
        openshiftScale depCfg: 'schema-spy', namespace: 'mem-tfrs-test', replicaCount: 1, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 10s'
    }    
    
    stage('Deploy to Prod') {
        input "Deploy to Prod?"
        input "Deploy to Prod? Please confirm again."
        input "Deploy to Prod? This is the last confirmation required."
        echo "Deploying to Prod: ${BUILD_ID}"
        openshiftTag destStream: 'tfrs', verbose: 'true', destTag: 'prod', srcStream: 'tfrs', srcTag: "${IMAGE_HASH}"
        openshiftVerifyDeployment depCfg: 'tfrs', namespace: 'mem-tfrs-prod', replicaCount: 1, verbose: 'false'
    }    
    
    stage('Refresh SchemaSpy Prod') {
        echo "Refreshing SchemaSpy for Test Database"
        openshiftScale depCfg: 'schema-spy', namespace: 'mem-tfrs-prod', replicaCount: 0, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 5s'
        openshiftScale depCfg: 'schema-spy', namespace: 'mem-tfrs-prod', replicaCount: 1, verbose: 'false', verifyReplicaCount: 'true'
        sh 'sleep 10s'
    }    

} //end of node
} //end of podTemplate
