pipeline {
    agent none
    options {
        disableResume()
    }
    environment {
        BASE_VERSION = 'v1'
        IMAGE_STREAM_NAME = 's2i-caddy'
        SOURCE_DIR = '.'
    }
    stages {
        stage('Build') {
            agent { label 'build' }
            steps {
                echo "Aborting all running jobs ..."
                script {
                    abortAllPreviousBuildInProgress(currentBuild)
                }
                echo "BRANCH_NAME:${env.BRANCH_NAME}\nCHANGE_ID:${env.CHANGE_ID}\nCHANGE_TARGET:${env.CHANGE_TARGET}"
                echo "Building ..."
                sh ".pipeline/pipeline-cli build --pr=${CHANGE_ID} --config=${env.SOURCE_DIR}/openshift/config.groovy"
            }
        }
        stage('Tag as latest') {
            agent { label 'deploy' }
            input {
                message "Should we continue with tagging this image as ${env.BASE_VERSION}-latest?"
                ok "Yes!"
            }
            steps {
                echo "Tagging ${env.IMAGE_STREAM_NAME}:${env.BASE_VERSION}-latest and ${env.IMAGE_STREAM_NAME}:latest"
                sh "oc -n 'bcgov-tools' tag ${env.IMAGE_STREAM_NAME}:build-v${CHANGE_ID} ${env.IMAGE_STREAM_NAME}:${env.BASE_VERSION}-latest"
                sh "oc -n 'bcgov' tag bcgov-tools/${env.IMAGE_STREAM_NAME}:build-v${CHANGE_ID} ${env.IMAGE_STREAM_NAME}:${env.BASE_VERSION}-latest"
                sh "oc -n 'bcgov' tag bcgov-tools/${env.IMAGE_STREAM_NAME}:build-v${CHANGE_ID} ${env.IMAGE_STREAM_NAME}:latest"
            }
        }
        stage('Tag as stable') {
            agent { label 'deploy' }
            input {
                message "Should we continue with tagging this image as ${env.BASE_VERSION}-stable?"
                ok "Yes!"
            }
            steps {
                echo "Tagging ${env.IMAGE_STREAM_NAME}:${env.BASE_VERSION}-stable and ${env.IMAGE_STREAM_NAME}:stable"
                sh "oc -n 'bcgov' tag bcgov-tools/${env.IMAGE_STREAM_NAME}:build-v${CHANGE_ID} ${env.IMAGE_STREAM_NAME}:${env.BASE_VERSION}-stable"
                sh "oc -n 'bcgov' tag bcgov-tools/${env.IMAGE_STREAM_NAME}:build-v${CHANGE_ID} ${env.IMAGE_STREAM_NAME}:stable"
            }
        }
        stage('Acceptance') {
            agent { label 'deploy' }
            input {
                message "is this PR closed in GitHub?"
                ok "Yes!"
            }
            steps {
                echo "Please accept/close PR via github UI for cleaning temporary objects"
            }
        }
    }
}