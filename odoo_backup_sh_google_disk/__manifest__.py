# Copyright 2019 Dinar Gabbasov <https://it-projects.info/team/GabbasovDinar>
# License MIT (https://opensource.org/licenses/MIT).
{
    "name": """Google drive backing up""",
    "summary": """The small investment to protect your business""",
    "category": "Backup",
    # "live_test_url": "",
    "images": ["images/google drive backing up.jpg"],
    "version": "13.0.1.0.0",
    "application": False,
    "author": "IT-Projects LLC, Dinar Gabbasov",
    "support": "apps@itpp.dev",
    "website": "https://apps.odoo.com/apps/modules/13.0/odoo_backup_sh_google_disk/",
    "license": "Other OSI approved licence",  # MIT
    "price": 119.00,
    "currency": "EUR",
    "depends": ["odoo_backup_sh"],
    "external_dependencies": {"python": ["google-api-python-client"], "bin": []},
    "data": [
        "views/odoo_backup_sh_views.xml",
        "views/odoo_backup_sh_google_drive_templates.xml",
        "views/res_config_settings_views.xml",
    ],
    "qweb": ["static/src/xml/dashboard.xml"],
    "demo": [],
    "post_load": None,
    "pre_init_hook": None,
    "post_init_hook": None,
    "uninstall_hook": None,
    "auto_install": False,
    "installable": True,
}
