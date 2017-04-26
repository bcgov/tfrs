node('maven') {

   stage('list working dir')
   sh 'ls -l -srt'

   stage('chg to functional-tests dir')
   dir('functional-tests'){
      stage('list dir')
      sh 'ls -l -srt'
   
      stage('execute functional-tests')
      sh './gradlew phantomJsTest'
   }
}
