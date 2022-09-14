# Copyright 2018 Ivan Yelizariev <https://it-projects.info/team/yelizariev>
# License MIT (https://opensource.org/licenses/MIT).
from odoo import api, models
from odoo.exceptions import AccessError
from odoo.tools.translate import _

STORAGE_KEY = "ir_attachment.location"


class IrConfigParameter(models.Model):
    _inherit = "ir.config_parameter"

    @api.model
    def _attachment_force_storage(self, previous_value):
        self.env["ir.attachment"].force_storage_previous(previous_value=previous_value)

    @api.model
    def create(self, vals):
        res = super(IrConfigParameter, self).create(vals)
        if vals and vals.get("key") == STORAGE_KEY:
            default_value = self.env["ir.attachment"]._storage()
            self._attachment_force_storage(default_value)
        return res

    def _get_storage_value(self):
        for r in self:
            if self.key == STORAGE_KEY:
                return r.value
        return None

    def write(self, vals):
        storage_value = self._get_storage_value()
        res = super(IrConfigParameter, self).write(vals)
        if storage_value:
            self._attachment_force_storage(storage_value)
        return res

    def unlink(self):
        storage_value = self._get_storage_value()
        res = super(IrConfigParameter, self).unlink()
        if storage_value:
            self._attachment_force_storage(storage_value)
        return res

    @api.model
    def set_init_value_for_ir_attachment_location(self):
        if not self.get_param("ir_attachment.location"):
            self.set_param("ir_attachment.location", "postgresql:lobject")


class IrAttachment(models.Model):
    _inherit = "ir.attachment"

    def force_storage_previous(self, previous_value=None):
        """Force all attachments to be stored in the currently configured storage"""
        if not self.env.user._is_admin():
            raise AccessError(_("Only administrators can execute this action."))
        new_value = self._storage()
        if all([v in ["db", "file"] for v in [new_value, previous_value]]):
            # Switching between file and db.
            # We can reduce records to be updated.
            domain = {
                "db": [("store_fname", "!=", False)],
                "file": [("db_datas", "!=", False)],
            }.get(new_value, [])
        else:
            # Update all records if it's not standart switching
            domain = []

        # trick to disable addional filtering in ir.attachment's method _search
        domain += [("id", "!=", -1)]

        for attach in self.search(domain):
            # we add url because in some environment mimetype is not computed correctly
            # see https://github.com/odoo/odoo/issues/11978
            attach.write({"datas": attach.datas, "url": attach.url})
        return True
