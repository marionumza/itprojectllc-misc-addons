=======================
 S3 Attachment Storage
=======================

* The module allows to upload the attachments in Amazon S3 automatically without storing them in Odoo database. It will allow to reduce the load on your server. Attachments will be uploaded on S3 depending on the condition you specified in Odoo settings. So you can choose and manage which type of attachments should be uploaded on S3.
* It is useful in cases where your database was crashed, because you will be able to easily restore all attachments from external storage at any time.
* The possibility to use one external storage for any number of databases.

Roadmap
=======

* Rewrite this module from scratch. Module must include:

  * Storing s3-related settings: bucket, access key and access password.
  * Methods for reading, writing and deleting objects from s3 bucket. Those methods can be used in other modules
  * Working with s3 objects like binary data, so take away `ir_attachment_url` dependency
  * `ir_attachment` model must have `s3_store_fname` field. Non-falsy value means, that attachment is stored in s3

* Create new module `ir_attachment_image` and move following classes, methods from this module to new one:

  * class `BinaryExtended` (excluding s3-related check)
  * class `IrAttachmentResized`
  * partially class `IrAttachment`. Leave s3-related methods here and `_inverse_datas`
  * method `test_getting_cached_images_url_instead_computing`. Probably this modules's test must override test from `ir_attachment_image`
  * `ir_attachment_s3` is dependency of `ir_attachment_image`

* Refactoring:

  * `S3Setting.upload_existing` and `IrAttachment._inverse_datas` look almost equal

* In settings add options:

  * condition, if object in s3 must be stored as public (as it does now)
  * condition, if object in s3 must be stored as private and think about, how to return it to user, 'cos you cannot use link to that. Possibly read from bucket and return and uncomment this: https://github.com/it-projects-llc/misc-addons/pull/775/files#r302856876

* Fix these bugs (possible in ir_attachment_url):

  * After loading image url to existing product variant, image does not change in backend
  * Set image with url, then upload other image as binary file (s3), backend shows old image. It can be fixed with clearing cache. Reason: there is no 'unique' parameter in image source attribute (<img src)
  * Using `website_sale` addon. Upload main image to product variant. Then

    * in list of products old image is shown (bug)
    * in product page main image is shown as main, previous main image is extra (maybe not a bug, but don't know how to remove previous main image)

* Make endpoint_url customizable to allow using other s3-supported storages. Example: https://docs.min.io/docs/how-to-use-aws-sdk-for-python-with-minio-server.html

Credits
=======

Contributors
------------
* `Ildar Nasyrov <https://it-projects.info/team/iledarn>`
* `Kolushov Alexandr <https://it-projects.info/team/KolushovAlexandr>`
* `Dinar Gabbasov <https://it-projects.info/team/GabbasovDinar>`
* `Eugene Molotov <https://it-projects.info/team/em230418>`

Sponsors
--------
* `IT-Projects LLC <https://it-projects.info>`_

Maintainers
-----------
* `IT-Projects LLC <https://it-projects.info>`__

      To get a guaranteed support you are kindly requested to purchase the module at `odoo apps store <https://apps.odoo.com/apps/modules/12.0/ir_attachment_s3/>`__.

      Thank you for understanding!

      `IT-Projects Team <https://www.it-projects.info/team>`__

Further information
===================

HTML Description: https://apps.odoo.com/apps/modules/12.0/ir_attachment_s3/

Usage instructions: `<doc/index.rst>`_

Changelog: `<doc/changelog.rst>`_

Tested on Odoo 12.0 b535558d23778a8960fcdc494067b70fe9c8ecab
