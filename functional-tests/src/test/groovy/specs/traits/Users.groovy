package traits

/**
 * Methods to manage user credentials.
 */
trait Users {
  Map env = System.getenv()
  Map getSendingFuelSupplier() {
    [username:env['SUPPLIER_ONE_USERNAME'], password:env['SUPPLIER_ONE_PASSWORD']]
  }

  Map getReceivingFuelSupplier() {
    [username:env['SUPPLIER_TWO_USERNAME'], password:env['SUPPLIER_TWO_PASSWORD'], org:env['SUPPLIER_TWO_ORG']]
  }

  Map getAnalyst() {
    [username:env['ANALYST_USERNAME'], password:env['ANALYST_PASSWORD']]
  }

  Map getDirector() {
    [username:env['DIRECTOR_USERNAME'], password:env['DIRECTOR_PASSWORD']]
  }
}
