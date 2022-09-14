# Copyright 2014 Ivan Yelizariev <https://it-projects.info/team/yelizariev>
# Copyright 2019 Anvar Kildebekov <https://it-projects.info/team/fedoranvar>
# License MIT (https://opensource.org/licenses/MIT).
{
    "name": "Signature templates for user emails",
    "external_dependencies": {"python": ["bs4", "html2text"]},
    "version": "13.0.1.0.0",
    "author": "IT-Projects LLC, Ivan Yelizariev",
    "license": "Other OSI approved licence",  # MIT
    "category": "Social Network",
    "images": ["images/main.png"],
    "website": "https://yelizariev.github.io",
    "depends": ["base"],
    "data": [
        "views/res_users_signature_views.xml",
        "security/res_users_signature_security.xml",
        "security/ir.model.access.csv",
    ],
    "demo": [],
    "installable": False,
}
