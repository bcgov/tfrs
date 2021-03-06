package specs.traits

/**
 * Methods to manage user credentials.
 */
trait Users {
  Map env = System.getenv()
  Map getSendingFuelSupplier() {
    [username:env['SUPPLIER_ONE_USERNAME'], password:env['SUPPLIER_ONE_PASSWORD'], org:env['SUPPLIER_ONE_ORG']]
  }

  Map getReceivingFuelSupplier() {
    [username:env['SUPPLIER_TWO_USERNAME'], password:env['SUPPLIER_TWO_PASSWORD'], org:env['SUPPLIER_TWO_ORG']]
  }

  Map getFuelSupplierAdmin() {
    [username:env['SUPPLIER_ONE_ADMIN_USERNAME'], password:env['SUPPLIER_ONE_ADMIN_PASSWORD']]
  }

  Map getAnalyst() {
    [username:env['ANALYST_USERNAME'], password:env['ANALYST_PASSWORD']]
  }

  Map getDirector() {
    [username:env['DIRECTOR_USERNAME'], password:env['DIRECTOR_PASSWORD']]
  }

  Map getAdmin() {
    [username:env['ADMIN_USERNAME'], password:env['ADMIN_PASSWORD']]
  }
}
