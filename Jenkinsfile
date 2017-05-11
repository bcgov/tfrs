node('maven') {

   stage('checkout tfrs src onto docker slave')
   git url: 'https://github.com/bcgov/tfrs.git'

   stage('list working dir')
   sh 'ls -l -srt'

   stage('chg to functional-tests dir')
   dir('functional-tests'){
      stage('list dir')
      sh 'ls -l -srt'
   
      stage('execute functional-tests')
      sh './gradlew phantomJsTest'
   }

   stage('chg to sonar-runner dir')
   dir('sonar-runner'){
       stage('list dir runner')
       sh 'ls -l -srt'

       stage('execute sonar-runner')
       sh './gradlew sonarqube -Dsonar.host.url=http://sonarqube-mem-tfrs-tools.pathfinder.gov.bc.ca -Dsonar.verbose=true --stacktrace'
   }
}
