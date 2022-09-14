from . import controllers
from odoo import api, SUPERUSER_ID


def init_auth(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    icp = env["ir.config_parameter"]

    icp.set_param("auth_signup.allow_uninvited", True)
