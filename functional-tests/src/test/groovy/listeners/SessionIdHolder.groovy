package listeners

@Singleton
class SessionIdHolder {

  public static final ThreadLocal<String> sessionId = new ThreadLocal<String>()

  public static final String buildId

  static {
    def env = System.getenv()
    if (env['BUILD_NUMBER']) {
      buildId = "Jenkins build " + env['BUILD_NUMBER']
    } else {
      buildId = "Manual build " + UUID.randomUUID().toString()
    }
  }
}
