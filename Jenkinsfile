node('maven') {
    stage('build') {
        echo "Building..."
        openshiftBuild bldCfg: 'tfrs', showBuildLogs: 'true'
        openshiftTag destStream: 'tfrs', verbose: 'true', destTag: '$BUILD_ID', srcStream: 'tfrs', srcTag: 'latest'
    }

    stage('deploy-dev') {
        echo "Deploying to dev..."
        openshiftTag destStream: 'tfrs', verbose: 'true', destTag: 'dev', srcStream: 'tfrs', srcTag: 'latest'
    }

    stage('checkout for static code analysis') {
        echo "checking out source"
        echo "Build: ${BUILD_ID}"
        checkout scm
    }

    stage('code quality check') {
        SONARQUBE_PWD = sh (
            script: 'oc env dc/sonarqube --list | awk  -F  "=" \'/SONARQUBE_ADMINPW/{print $2}\'',
            returnStdout: true
        ).trim()
        echo "SONARQUBE_PWD: ${SONARQUBE_PWD}"

        SONARQUBE_URL = sh (
            script: 'oc get routes -o wide --no-headers | awk \'/sonarqube/{ print match($0,/edge/) ?  "https://"$2 : "http://"$2 }\'',
            returnStdout: true
        ).trim()
        echo "SONARQUBE_URL: ${SONARQUBE_URL}"

        dir('sonar-runner') {
            sh returnStdout: true, script: "./gradlew sonarqube -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.verbose=true --stacktrace --info  -Dsonar.sources=.."
        }
    }
	
	  stage('validation') {
        dir('functional-tests') {
            sh './gradlew --debug --stacktrace phantomJsTest'
        }
    }
}

stage('deploy-test') {
    input "Deploy to test?"
  
    node('maven') {
        openshiftTag destStream: 'tfrs', verbose: 'true', destTag: 'test', srcStream: 'tfrs', srcTag: '$BUILD_ID'
    }
}

stage('deploy-prod') {
    input "Deploy to prod?"
    node('maven') {
        openshiftTag destStream: 'tfrs', verbose: 'true', destTag: 'prod', srcStream: 'tfrs', srcTag: '$BUILD_ID'
    }
}


