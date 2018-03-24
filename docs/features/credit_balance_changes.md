Credit Balance Changes
-----

**Status:** *(some might already be implemented)*

Most of the features discussed in [controls](controls.md) deal with regular credit transfers (buy and sell).

There are other types of credit transfers which are used by the government only:

- **Credit Validation** A government user will login to the TFRS app to create a Credit Validation transaction. This transaction would be in the `approved` status once entered/created. Once it is created, the system will transfer credits to the fuel supplier.

- **Part 3 Award** A government user will login to the TFRS app to create a Credit Validation transaction. This transaction would be in the `approved` status once entered/created. Once it is created, the system will transfer credits to the fuel supplier. The difference between a `Part 3 Award` and a `Validation` is that a validation is more commonly used for adjusting credits.

- **Credit Retirement** May also be referenced as `reduction`. A government use will login to the TFRS app to create a Credit Retirement transaction. This transaction would be in the `approved` status once entered/created. Once it is created, the system will transfer credits away from the fuel supplier. You can think of this as adjusting credits as well.

**System design on government balance**

Currently, the system is modeled to appoint an arbitrary high number to the government organization upon initialization to make a repeatable function for transferring credits between organizations. However, do realize that in reality, the government does not carry a balance. It might be worth revisiting in the future if it's better to just get rid of the government balance as long as it does not affect the other models.

Note that having an arbitrary high number poses a risk of the system failing at some point if the balance becomes zero or negative (which might never happen).

**Status change to completed**
Once the credits have been transferred from one balance to another, an `approved` transaction will automatically be changed to be `completed` to mark this event.
