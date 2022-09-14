odoo.define("web_gantt8.gantt", function(require) {
    "use strict";
    /* global GanttProjectInfo,GanttTaskInfo,GanttTaskInfo,GanttChart*/
    var core = require("web.core");
    var View = require("web.View");
    var Model = require("web.DataModel");
    var formats = require("web.formats");
    var time = require("web.time");
    var parse_value = require("web.web_client");
    var form_common = require("web.form_common");

    var _lt = core._lt;
    var QWeb = core.qweb;

    var GanttView = View.extend({
        display_name: _lt("Gantt"),
        template: "GanttView",
        view_type: "gantt8",
        icon: "fa-tasks",
        init: function() {
            this._super.apply(this, arguments);
            this.has_been_loaded = $.Deferred();
            this.chart_id = _.uniqueId();
        },
        willStart: function() {
            var self = this;
            this.$el.addClass(this.fields_view.arch.attrs.class);
            return self
                .alive(new Model(this.dataset.model).call("fields_get"))
                .then(function(fields) {
                    self.fields = fields;
                    self.has_been_loaded.resolve();
                });
        },
        do_search: function(domains, contexts, group_bys) {
            var self = this;
            self.last_domains = domains;
            self.last_contexts = contexts;
            self.last_group_bys = group_bys;
            // Select the group by
            var n_group_bys = [];
            if (this.fields_view.arch.attrs.default_group_by) {
                n_group_bys = this.fields_view.arch.attrs.default_group_by.split(",");
            }
            if (group_bys.length) {
                n_group_bys = group_bys;
            }
            // Gather the fields to get
            var fields = _.compact(
                _.map(["date_start", "date_delay", "date_stop", "progress"], function(
                    key
                ) {
                    return self.fields_view.arch.attrs[key] || "";
                })
            );
            fields = _.uniq(fields.concat(n_group_bys));

            return $.when(this.has_been_loaded).then(function() {
                return self.dataset
                    .read_slice(fields, {
                        domain: domains,
                        context: contexts,
                    })
                    .then(function(data) {
                        return self.on_data_loaded(data, n_group_bys);
                    });
            });
        },
        reload: function() {
            if (typeof this.last_domains !== "undefined") {
                return this.do_search(
                    this.last_domains,
                    this.last_contexts,
                    this.last_group_bys
                );
            }
        },
        on_data_loaded: function(tasks, group_bys) {
            var self = this;
            var ids = _.pluck(tasks, "id");
            return this.dataset.name_get(ids).then(function(names) {
                var ntasks = _.map(tasks, function(task) {
                    return _.extend(
                        {
                            __name: _.detect(names, function(name) {
                                return name[0] === task.id;
                            })[1],
                        },
                        task
                    );
                });
                return self.on_data_loaded_2(ntasks, group_bys);
            });
        },
        on_data_loaded_2: function(tasks, group_bys_arg) {
            var group_bys = group_bys_arg;
            var self = this;
            $(".oe_gantt", this.$el).html("");

            // Prevent more that 1 group by
            if (group_bys.length > 0) {
                group_bys = [group_bys[0]];
            }
            // If there is no group by, simulate it
            if (group_bys.length === 0) {
                group_bys = ["_pseudo_group_by"];
                _.each(tasks, function(el) {
                    el._pseudo_group_by = "Gantt View";
                });
                this.fields._pseudo_group_by = {type: "string"};
            }

            // Get the groups
            var split_groups = function(tasks_, group_bys_) {
                if (group_bys_.length === 0) {
                    return tasks_;
                }
                var groups = [];
                _.each(tasks_, function(task) {
                    var group_name = task[_.first(group_bys_)];
                    var group = _.find(groups, function(group_) {
                        return _.isEqual(group_.name, group_name);
                    });
                    if (typeof group === "undefined") {
                        group = {name: group_name, tasks_: [], __is_group: true};
                        groups.push(group);
                    }
                    group.tasks.push(task);
                });
                _.each(groups, function(group) {
                    group.tasks = split_groups(group.tasks, _.rest(group_bys_));
                });
                return groups;
            };
            var groups = split_groups(tasks, group_bys);

            // Track ids of task items for context menu
            var task_ids = {};
            // Creation of the chart
            var generate_task_info = function(task, plevel) {
                var percent = 100;
                if (_.isNumber(task[self.fields_view.arch.attrs.progress])) {
                    percent = task[self.fields_view.arch.attrs.progress] || 0;
                }
                var level = plevel || 0;
                if (task.__is_group) {
                    var task_infos = _.compact(
                        _.map(task.tasks, function(sub_task) {
                            return generate_task_info(sub_task, level + 1);
                        })
                    );
                    if (task_infos.length === 0) {
                        return;
                    }
                    var task_start = _.reduce(
                        _.pluck(task_infos, "task_start"),
                        function(date, memo) {
                            return typeof memo === "undefined" || date < memo
                                ? date
                                : memo;
                        }
                    );
                    var task_stop = _.reduce(_.pluck(task_infos, "task_stop"), function(
                        date,
                        memo
                    ) {
                        return typeof memo === "undefined" || date > memo ? date : memo;
                    });
                    var duration =
                        (task_stop.getTime() - task_start.getTime()) / (1000 * 60 * 60);
                    var group_name = task.name
                        ? formats.format_value(task.name, self.fields[group_bys[level]])
                        : "-";
                    var group = null;
                    if (level === 0) {
                        group = new GanttProjectInfo(
                            _.uniqueId("gantt_project_"),
                            group_name,
                            task_start
                        );
                        _.each(task_infos, function(el) {
                            group.addTask(el.task_info);
                        });
                        return group;
                    }
                    group = new GanttTaskInfo(
                        _.uniqueId("gantt_project_task_"),
                        group_name,
                        task_start,
                        duration || 1,
                        percent
                    );
                    _.each(task_infos, function(el) {
                        group.addChildTask(el.task_info);
                    });
                    return {
                        task_info: group,
                        task_start: task_start,
                        task_stop: task_stop,
                    };
                }
                var task_name = task.__name;
                var duration_in_business_hours = false;
                task_start = time.auto_str_to_date(
                    task[self.fields_view.arch.attrs.date_start]
                );
                if (!task_start) {
                    return;
                }
                if (self.fields_view.arch.attrs.date_stop) {
                    task_stop = time.auto_str_to_date(
                        task[self.fields_view.arch.attrs.date_stop]
                    );
                    if (!task_stop) {
                        task_stop = task_start;
                    }
                } else {
                    // We assume date_duration is defined
                    var tmp = formats.format_value(
                        task[self.fields_view.arch.attrs.date_delay],
                        self.fields[self.fields_view.arch.attrs.date_delay]
                    );
                    if (!tmp) {
                        return;
                    }
                    task_stop = new Date(task_start);
                    task_stop.setMilliseconds(
                        parse_value(tmp, {type: "float"}) * 60 * 60 * 1000
                    );
                    duration_in_business_hours = true;
                }
                duration =
                    (task_stop.getTime() - task_start.getTime()) / (1000 * 60 * 60);
                var id = _.uniqueId("gantt_task_");
                if (!duration_in_business_hours) {
                    duration = (duration / 24) * 8;
                }
                var task_info = new GanttTaskInfo(
                    id,
                    task_name,
                    task_start,
                    duration || 1,
                    percent
                );
                task_info.internal_task = task;
                task_ids[id] = task_info;
                return {
                    task_info: task_info,
                    task_start: task_start,
                    task_stop: task_stop,
                };
            };
            var $div = $("<div id='" + this.chart_id + "'></div>");
            $div.css("min-height", 500);
            $div.prependTo(document.body);
            var gantt = new GanttChart();
            gantt.maxWidthPanelNames = 250;
            _.each(
                _.compact(
                    _.map(groups, function(e) {
                        return generate_task_info(e, 0);
                    })
                ),
                function(project) {
                    gantt.addProject(project);
                }
            );
            gantt.setEditable(true);
            gantt.setImagePath("/web_gantt8/static/lib/dhtmlxGantt/codebase/imgs/");
            gantt.attachEvent("onTaskEndDrag", function(task) {
                self.on_task_changed(task);
            });
            gantt.attachEvent("onTaskEndResize", function(task) {
                self.on_task_changed(task);
            });
            gantt.create(this.chart_id);
            this.$el.children().append($div.contents());
            $div.remove();

            // Bind event to display task when we click the item in the tree
            $(".taskNameItem", self.$el).click(function(event) {
                var task_info = task_ids[event.target.id];
                if (task_info) {
                    self.on_task_display(task_info.internal_task);
                }
            });
            if (this.is_action_enabled("create")) {
                // Insertion of create button
                var td = $($("table td", self.$el)[0]);
                var rendered = QWeb.render("GanttView-create-button");
                $(rendered).prependTo(td);
                $(".oe_gantt_button_create", this.$el).click(this.on_task_create);
            }
            // Fix for IE to display the content of gantt view.
            this.$el
                .find(".oe_gantt td:first > div, .oe_gantt td:eq(1) > div > div")
                .css("overflow", "");
        },
        on_task_changed: function(task_obj) {
            var self = this;
            var itask = task_obj.TaskInfo.internal_task;
            var start = task_obj.getEST();
            var duration = task_obj.getDuration();
            var duration_in_business_hours = Boolean(
                self.fields_view.arch.attrs.date_delay
            );
            if (!duration_in_business_hours) {
                duration = (duration / 8) * 24;
            }
            var end = new Date(start);
            end.setMilliseconds(duration * 60 * 60 * 1000);
            var data = {};
            data[self.fields_view.arch.attrs.date_start] = time.auto_date_to_str(
                start,
                self.fields[self.fields_view.arch.attrs.date_start].type
            );
            if (self.fields_view.arch.attrs.date_stop) {
                data[self.fields_view.arch.attrs.date_stop] = time.auto_date_to_str(
                    end,
                    self.fields[self.fields_view.arch.attrs.date_stop].type
                );
            } else {
                // We assume date_duration is defined
                data[self.fields_view.arch.attrs.date_delay] = duration;
            }
            this.dataset.write(itask.id, data);
        },
        on_task_display: function(task) {
            var self = this;
            var pop = new form_common.FormViewDialog(self, {
                res_model: self.dataset.model,
                res_id: task.id,
            }).open();
            pop.on("write_completed", self, function() {
                self.reload();
            });
        },
        on_task_create: function() {
            var self = this;
            new form_common.SelectCreateDialog(this, {
                res_model: self.dataset.model,
                initial_view: "form",
                on_selected: function() {
                    self.reload();
                },
            }).open();
        },
    });
    core.view_registry.add("gantt8", GanttView);
});
