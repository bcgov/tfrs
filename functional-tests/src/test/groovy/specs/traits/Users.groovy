package traits

/**
 * Methods to manage user credentials.
 */
trait Users {
  Map env = System.getenv()
  Map getSendingFuelSupplier() {
    [env['FANTASTIC_USERNAME'], env['FT_PASSWORD']]
  }

  Map getReceivingFuelSupplier() {
    [env['GREEN_USERNAME'], env['FT_PASSWORD']]
  }

  Map getAnalyst() {
    [env['ANALYST_USERNAME'], env['FT_PASSWORD']]
  }

  Map getDirector() {
    [env['DIRECTOR_USERNAME'], env['FT_PASSWORD']]
  }
}
