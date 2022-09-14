=====================
 Partner Attendances
=====================


Configuration
=============

Access rights
-------------

In order to set access rights for users

* Open menu ``[[ Settings ]] >> Users``
* Click on required user
* Click ``Edit`` and set field **Attendance**:

    * ``Read-Only`` may see only *Attendances* menu
    * ``Manual Attendance`` may create and update partner attendances, but not delete
    * ``Manager`` may also delete partners attendances, has access to *Partners*, *Reports* menus and *Kiosk Mode*

* In order to get access to ``Configuration`` menu user has to have **Administration** ``Settings`` rights

Barcode
-------

* If you want to use barcodes install module ``Point of sale``, or add barcode field to the partner form manually


Usage
=====

Attendances
-----------

To create *Attendances*

* Open menu ``[[ Partner Attendances ]] >> Attendances``
* Click ``Create``
* Choose a partner in **Partner**
* Specify the **Check In** field
* Field **Check Out** is not required, it may be specified later
* Click ``Save``

Kiosk Mode
----------

*Attendances* records creating is also possible via *Kiosk Mode*

* Open menu ``[[ Partner Attendances ]] >> Kiosk Mode``
* Click ``Select Partner``
* Click on a partner
* Click the blue icon to check in/ check out a partner
* Click ``ok``

Also it is possible to use barcodes to check partners attendance

* Open menu ``[[ Partner Attendances ]] >> Kiosk Mode``
* Scan a partner's barcode to check him in or out, it depends on the actual partner's presence

Auto Checkout
-------------

Restriction on the maximum partner attendance time. Each ten minutes odoo checks for opened partner session, if a session lasts more then defined time it will be closed.

* Open menu ``[[ Partner Attendances ]] >> Configuration``
* Set ``AutoCheckout`` field in minutes.

Installation
============

* `Install <https://odoo-development.readthedocs.io/en/latest/odoo/usage/install-module.html>`__ this module in a usual way
