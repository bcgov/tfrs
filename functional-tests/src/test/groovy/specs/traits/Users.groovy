package traits

/**
 * Methods to manage user credentials.
 */
trait Users {
  def env = System.getenv()
  def getSendingFuelSupplier() {
    [env["FANTASTIC_USERNAME"], env["FT_PASSWORD"]]
  }

  def getReceivingFuelSupplier() {
    [env["GREEN_USERNAME"], env["FT_PASSWORD"]]
  }

  def getAnalyst() {
    [env["ANALYST_USERNAME"], env["FT_PASSWORD"]]
  }

  def getDirector() {
    [env["DIRECTOR_USERNAME"], env["FT_PASSWORD"]]
  }
}
