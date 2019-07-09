package listeners

@Singleton
class SessionIdHolder {

  public static final ThreadLocal<String> sessionId = new ThreadLocal<String>()

  public static final String buildId = UUID.randomUUID().toString()
}
