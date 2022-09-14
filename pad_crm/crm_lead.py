# Copyright 2016 Ivan Yelizariev <https://it-projects.info/team/yelizariev>
# Copyright 2019 Artem Rafailov <https://it-projects.info/team/Ommo73/>
# License MIT (https://opensource.org/licenses/MIT)
from odoo import fields, models


class Lead(models.Model):
    _name = "crm.lead"
    _inherit = ["crm.lead", "pad.common"]
    description = fields.Text("Notes", track_visibility=False)
    description_pad = fields.Char("Description PAD", pad_content_field="description")
