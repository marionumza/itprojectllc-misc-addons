from odoo import SUPERUSER_ID, api


def migrate(cr, version):
    # fill column
    #
    # we can do it only "post-", because in "pre-" there is no
    # _update_config_parameter_value method yet
    env = api.Environment(cr, SUPERUSER_ID, {})

    field_id = env.ref("base.field_ir_config_parameter__value").id
    default_values = env["ir.property"].search(
        [("fields_id", "=", field_id), ("company_id", "=", False)]
    )

    field = env.ref("base.field_ir_config_parameter__value")
    default_values._update_db_value_website_dependent(field)
