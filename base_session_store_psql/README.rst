==============================
 Store sessions in postgresql
==============================

Odoo uses ``werkzeug.contrib.sessions.FilesystemSessionStore`` that lead to periodic "Session Expired" errors on disributed deployment. Saving sessions in postgresql fixes this issue.

Roadmap
=======

* Some good ideas can be taken from `session_db <https://github.com/odoo/odoo-extra/blob/master/session_db/models/session.py>`_ module

Credits
=======

Contributors
------------
* Ivan Yelizariev <yelizariev@it-projects.info>
* Christoph Giesel <mail@cgiesel.de>

Sponsors
--------
* `IT-Projects LLC <https://it-projects.info>`_

Further information
===================

HTML Description: https://apps.odoo.com/apps/modules/9.0/base_session_store_psql/

Usage instructions: `<doc/index.rst>`_

Changelog: `<doc/changelog.rst>`_

Tested on Odoo 9.0 e49893ab2deea0d0be9b1ffcdfae56db1d2fc7c9
