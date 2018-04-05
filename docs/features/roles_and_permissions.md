Roles and Permissions
--------

**Status:** *(not yet implemented)*

Django has Roles & Permissions built in but it looks like it only applies specifically to models, so my best guess is that we would need a custom implementation of Roles & Permissions

There are a few ways to achieve this:

**Simple Role & Permission**

Define roles and permissions

Sample roles:
- fuel_supplier_admin
- fuel_supplier_user
- government_admin
- government_user

Sample permissions:

|Role|Permission|
|--|--|
|fuel_supplier_admin|Can access basic + admin functionality|
|fuel_supplier_user|Can access basic functionality|
|government_admin|Can access basic + admin functionality|
|government_user|Can access basic functionality|


**RBAC (Role-based access control)**

Same as the previous, but defines actual roles and allows for more permissions

Sample roles:
- fuel_supplier_tfrs_admin
- fuel_supplier_basic
- fuel_supplier_analyst
- fuel_supplier_signing_authority
- government_tfrs_admin
- government_basic
- government_analyst
- government_director

Sample permissions:
1. Can access the organization admin page
  1. Can add/edit/remove users
  - Can modify organization info
- Can view a credit transfer
- Can created a credit transfer of status `draft`
- Can propose (sign) a credit transfer
- Can accept (sign) a credit transfer
- Can approve (sign) a credit transfer
- Can recommend a credit transfer

|Role|Permissions|
|--|--|
| fuel_supplier_tfrs_admin | 1, 1.1, 1.2, 2, 3 |
| fuel_supplier_basic | 2 |
| fuel_supplier_analyst | 2, 3|
| fuel_supplier_signing_authority |2, 3, 4, 5|
| government_tfrs_admin | 1, 1.1, 1.2, 2, 3 |
| government_basic | 2 |
| government_analyst |2, 3|
| government_director |2, 3, 4, 5, 6, 7|

**User-defined roles vs System-defined roles**

If you choose to go down the route of allowing users to define their roles, keep in mind that there is more complexity in maintaining the application

**User-defined permissions vs System-defined permissions**

I find no good use-case for allowing users to set their own permissions. Permissions will have to surround the code itself, so allowing users to define them is disastrous.
