import jenkins.model.Jenkins

import com.cloudbees.plugins.credentials.*;
import com.cloudbees.plugins.credentials.impl.*;
import com.cloudbees.plugins.credentials.domains.*;
import com.cloudbees.jenkins.*
import org.jenkinsci.plugins.plaincredentials.impl.*;
import java.nio.file.*;

if (new File('/var/run/secrets/browserstack/username').exists()){
  String browserstackUsername = new File('/var/run/secrets/browserstack/username').getText('UTF-8').trim()
  String browserstackAccesskey = new File('/var/run/secrets/browserstack/accesskey').getText('UTF-8').trim()

  Credentials c1 = (Credentials) new UsernamePasswordCredentialsImpl(
    CredentialsScope.GLOBAL,
    "browserstack",
    "Browserstack Automate username and accesskey",
    browserstackUsername,
    browserstackAccesskey);

  SystemCredentialsProvider.getInstance().getStore().addCredentials(Domain.global(), c1);

}

String functionaTestUsersFile = '/var/run/secrets/functional-test-users/functional_test_users_v2'
if (new File(functionaTestUsersFile).exists()){
    Path fileLocation = Paths.get(functionaTestUsersFile);
    def secretBytes = SecretBytes.fromBytes(Files.readAllBytes(fileLocation))
    Credentials c2 = new FileCredentialsImpl(
        CredentialsScope.GLOBAL,
        "functional_test_users_v2", 
        "Functiona Test Users", 
        "functional_test_users_v2", 
        secretBytes);
    SystemCredentialsProvider.getInstance().getStore().addCredentials(Domain.global(), c2);
}
