package listeners

import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.Method.*
import static groovyx.net.http.ContentType.*

class BrowserStackAPI {



  static void updateSessionName(String sessionId, String newName) {
    HTTPBuilder client = new HTTPBuilder("https://api.browserstack.com/automate/sessions/${sessionId}.json")
    def env = System.getenv()
    client.auth.basic env['BROWSERSTACK_USERNAME'], env['BROWSERSTACK_TOKEN']

    client.request(PUT, JSON) { req ->
      body = "{\"name\":\"${newName}\"}"
      response.success = { resp, reader ->
        println(resp.status)
        System.out << reader
      }
      response.failure = { resp, reader ->
        println('error!')
        System.err << reader
      }
    }
  }

  static void markSessionFailed(String sessionId, String reason) {
    HTTPBuilder client = new HTTPBuilder("https://api.browserstack.com/automate/sessions/${sessionId}.json")
    def env = System.getenv()
    client.auth.basic env['BROWSERSTACK_USERNAME'], env['BROWSERSTACK_TOKEN']

    client.request(PUT, JSON) { req ->
      body = "{\"status\": \"failed\", \"reason\": \"${reason}\"}"
      response.success = { resp, reader ->
        println(resp.status)
        System.out << reader
      }
      response.failure = { resp, reader ->
        println('error!')
        System.err << reader
      }
    }
  }
}

