/* Copyright (c) 2004-2018 Odoo S.A.
   Copyright 2018 Kolushov Alexandr <https://it-projects.info/team/KolushovAlexandr>
   License MIT (https://opensource.org/licenses/MIT). */
odoo.define("base_attendance.partner_kanban_view_handler", function(require) {
    "use strict";

    var KanbanRecord = require("web.KanbanRecord");

    KanbanRecord.include({
        _openRecord: function() {
            if (
                this.modelName === "res.partner" &&
                this.$el.parents(".o_res_partner_attendance_kanban").length
            ) {
                // Needed to diffentiate : check in/out kanban view of employees <-> standard employee kanban view
                var action = {
                    type: "ir.actions.client",
                    name: "Confirm",
                    tag: "base_attendance_kiosk_confirm",
                    partner_id: this.record.id.raw_value,
                    partner_name: this.record.name.raw_value,
                    partner_state: this.record.attendance_state.raw_value,
                };
                this.do_action(action);
            } else {
                this._super.apply(this, arguments);
            }
        },
    });
});
