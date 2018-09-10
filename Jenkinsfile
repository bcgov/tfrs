// Jenkinsfile (Scripted Pipeline)

/* Gotchas:
    - PodTemplate name/label has to be unique to ensure proper caching/validation
    - https://gist.github.com/matthiasbalke/3c9ecccbea1d460ee4c3fbc5843ede4a

   Libraries:
    - https://github.com/BCDevOps/jenkins-pipeline-shared-lib
    - http://github-api.kohsuke.org/apidocs/index.html
*/
import hudson.model.Result;
import jenkins.model.CauseOfInterruption.UserInterruption;
import org.kohsuke.github.*
import bcgov.OpenShiftHelper
import bcgov.GitHubHelper

// Print stack trace of error
@NonCPS
private static String stackTraceAsString(Throwable t) {
    StringWriter sw = new StringWriter();
    t.printStackTrace(new PrintWriter(sw));
    return sw.toString()
}


// Notify stage status and pass to Jenkins-GitHub library
void notifyStageStatus (Map context, String name, String status) {
    // TODO: broadcast status/result to Slack channel
    GitHubHelper.createCommitStatus(
        this,
        context.pullRequest.head,
        status,
        "${env.BUILD_URL}",
        "Stage '${name}'",
        "stages/${name.toLowerCase()}"
    )
}

/* Project and pipeline-specific settings
   Includes:
    - project name
    - uuid
    - web path (dev|test|prod)
    - build config templates (*.bc)
    - deployment config templates (*.dc) and parameters
    - stage names and enabled status (true|false)
    - git pull request details
*/
Map context = [
    'name': 'tfrs',
    'uuid' : "${env.JOB_BASE_NAME}-${env.BUILD_NUMBER}-${env.CHANGE_ID}",
    'env': [
        'dev':[:],
        'test':[
            'params':[
                'host':'gwells-test.pathfinder.gov.bc.ca',
                'DB_PVC_SIZE':'5Gi'
            ]
        ],
        'prod':[
            'params':[
                'host':'gwells-prod.pathfinder.gov.bc.ca',
                'DB_PVC_SIZE':'5Gi'
            ]
        ]
    ],
    'templates': [
        'build':[
            ['file':'openshift/postgresql.bc.json'],
            ['file':'openshift/backend.bc.json']
        ],
        'deployment':[
            [
                'file':'openshift/postgresql.dc.json',
                'params':[
                    'DATABASE_SERVICE_NAME':'gwells-pgsql${deploy.dcSuffix}',
                    'IMAGE_STREAM_NAMESPACE':'',
                    'IMAGE_STREAM_NAME':'gwells-postgresql${deploy.dcSuffix}',
                    'IMAGE_STREAM_VERSION':'${deploy.envName}',
                    'POSTGRESQL_DATABASE':'gwells',
                    'VOLUME_CAPACITY':'${env[DEPLOY_ENV_NAME]?.params?.DB_PVC_SIZE?:"1Gi"}'
                ]
            ],
            [
                'file':'openshift/backend.dc.json',
                'params':[
                    'HOST':'${env[DEPLOY_ENV_NAME]?.params?.host?:("gwells" + deployments[DEPLOY_ENV_NAME].dcSuffix + "-" + deployments[DEPLOY_ENV_NAME].projectName + ".pathfinder.gov.bc.ca")}'
                ]
            ]
        ]
    ],
    stages:[
        'Build': true,
        'Unit Test': true,
        'Code Quality': false,
        'Readiness - DEV': false,
        'Deploy - DEV': false,
        'Load Fixtures - DEV': false,
        'ZAP Security Scan': false,
        'API Test': false,
        'Full Test - DEV': false
    ],
    pullRequest:[
        'id': env.CHANGE_ID,
        'head': GitHubHelper.getPullRequestLastCommitId(this)
    ]
]

echo "deploy.dcSuffix=${deploy.dcSuffix}"
echo "env.BUILD_URL=${env.BUILD_URL}"
echo "env.JOB_BASE_NAME=${env.JOB_BASE_NAME}"
echo "env.BUILD_NUMBER=${env.BUILD_NUMBER}"
echo "env.CHANGE_ID=${env.CHANGE_ID}"

System.exit(0)

/* _Stage wrapper:
    - primary means of running stages
    - reads which stages are to be run
    - handles stages defined separately in closures (body)
    - catches errors and provides output
*/
def _stage(String name, Map context, boolean retry=0, boolean withCommitStatus=true, Closure body) {
    def stageOpt =(context?.stages?:[:])[name]
    boolean isEnabled=(stageOpt == null || stageOpt == true)
    echo "Running Stage '${name}' - enabled:${isEnabled}"

    if (isEnabled){
        stage(name) {
            waitUntil {
                notifyStageStatus(context, name, 'PENDING')
                boolean isDone=false
                try{
                    body()
                    isDone=true
                    notifyStageStatus(context, name, 'SUCCESS')
                }catch (ex){
                    notifyStageStatus(context, name, 'FAILURE')
                    echo "${stackTraceAsString(ex)}"
                    def inputAction = input(
                        message: "This step (${name}) has failed. See error above.",
                        ok: 'Confirm',
                        parameters: [
                            choice(
                                name: 'action',
                                choices: 'Re-run\nIgnore',
                                description: 'What would you like to do?'
                            )
                        ]
                    )
                    if ('Ignore'.equalsIgnoreCase(inputAction)){
                        isDone=true
                    }
                }
                return isDone
            } //end waitUntil
        } //end Stage
    }else{
        stage(name) {
            echo 'Skipping'
        }
    }
}

/* Continuous integration (CI)
   Triggers when a PR targets a sprint release branch
    - prepare OpenShift environment
    - build (build configs, imagestreams)
    - unit tests
    - code quality (SonarQube)
    - deployment to transient dev environment
    - load fixtures
    - API tests
    - functional tests
    - merge PR into sprint release branch

   Continuous deployment (CD)
   Triggers when a PR targets the master branch, reserved for release branches and hotfixes
    - All CI steps
    - [prompt/stop]
      - deployment to persistent test environment
      - smoke tests
      - deployment
    - [prompt/stop]
      - deployment to persistent production environment
    - [prompt/stop]
      - merge sprint release or hotfix branch into master
      - close PR
      - delete branch
*/
//commented for TFRS
//def isCI = !"master".equalsIgnoreCase(env.CHANGE_TARGET)
//def isCD = "master".equalsIgnoreCase(env.CHANGE_TARGET)
def isCI = true

/* Jenkins properties can be set on a pipeline-by-pipeline basis
   Includes:
    - build discarder
    - build concurrency
    - master node failure handling
    - throttling
    - parameters
    - build triggers
    See Jenkins' Pipeline Systax for generation
    Globally equivalent to Jenkins > Manage Jenkins > Configure System
*/
properties([
    buildDiscarder(
        logRotator(
            artifactDaysToKeepStr: '',
            artifactNumToKeepStr: '',
            daysToKeepStr: '',
            numToKeepStr: '5'
        )
    ),
    durabilityHint(
        'PERFORMANCE_OPTIMIZED'
    )
])

/* Prepare stage
    - abort any existing builds
    - echo pull request number
*/
stage('Prepare') {
    abortAllPreviousBuildInProgress(currentBuild)
    echo "BRANCH_NAME=${env.BRANCH_NAME}"
    echo "CHANGE_ID=${env.CHANGE_ID}"
    echo "CHANGE_TARGET=${env.CHANGE_TARGET}"
    echo "BUILD_URL=${env.BUILD_URL}"
}

/* Build stage
    - applying OpenShift build configs
    - creating OpenShift imagestreams, annotations and builds
    - build time optimizations (e.g. image reuse, build scheduling/readiness)
*/
_stage('Build', context) {
    node('master') {
        checkout scm
        new OpenShiftHelper().build(this, context)
        if ("master".equalsIgnoreCase(env.CHANGE_TARGET)) {
            new OpenShiftHelper().prepareForCD(this, context)
        }
        deleteDir()
    }
} //end stage

/* Unit test stage - pipeline step/closure
    - use Django's manage.py to run python unit tests (w/ nose.cfg)
    - use 'npm run unit' to run JavaScript unit tests
    - stash test results for code quality stage
*/
_stage('Unit Test', context) {
    podTemplate(
        label: "node-${context.uuid}",
        name:"node-${context.uuid}",
        serviceAccount: 'jenkins',
        cloud: 'openshift',
        containers: [
            containerTemplate(
                name: 'jnlp',
                image: 'jenkins/jnlp-slave:3.10-1-alpine',
                args: '${computer.jnlpmac} ${computer.name}',
                resourceRequestCpu: '100m',
                resourceLimitCpu: '100m'
            ),
            containerTemplate(
                name: 'app',
                image: "docker-registry.default.svc:5000/mem-tfrs-tools/tfrs${context.buildNameSuffix}:${context.buildEnvName}",
                ttyEnabled: true,
                command: 'cat',
                resourceRequestCpu: '2000m',
                resourceLimitCpu: '2000m',
                resourceRequestMemory: '2.5Gi',
                resourceLimitMemory: '2.5Gi'
            )
        ]
    ) {
        node("node-${context.uuid}") {
            try {
                container('app') {
                    sh script: '''#!/usr/bin/container-entrypoint /bin/sh
                        set -euo pipefail

                        printf "Python version: "&& python --version
                        printf "Pip version:    "&& pip --version
                        printf "Node version:   "&& node --version
                        printf "NPM version:    "&& npm --version

                        (
                            cd /opt/app-root/src
                            python manage.py migrate
                            # ENABLE_DATA_ENTRY="True" python manage.py test -c nose.cfg
                        )
                        (
                            # cd /opt/app-root/src/frontend
                            # npm test
                        )
                        # mkdir -p frontend/test/
                        # cp -R /opt/app-root/src/frontend/test/unit ./frontend/test/
                        # cp /opt/app-root/src/nosetests.xml /opt/app-root/src/coverage.xml ./
                        # cp /opt/app-root/src/frontend/junit.xml ./frontend/
                    '''
                }
            } finally {
                /***
                archiveArtifacts allowEmptyArchive: true, artifacts: 'frontend/test/unit/*  * / *'
                stash includes: 'nosetests.xml,coverage.xml', name: 'coverage'
                stash includes: 'frontend/test/unit/coverage/clover.xml', name: 'nodecoverage'
                stash includes: 'frontend/junit.xml', name: 'nodejunit'
                junit 'nosetests.xml,frontend/junit.xml'
                publishHTML (
                    target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'frontend/test/unit/coverage/lcov-report/',
                        reportFiles: 'index.html',
                        reportName: "Node Coverage Report"
                    ]
                )
                ***/
            }
        }
    }
} //end stage