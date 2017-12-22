/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2017 Yuri Kuznetsov, Taras Machyshyn, Oleksiy Avramenko
 * Website: http://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

Espo.define('crm:views/opportunity/record/list', 'views/record/list', function (Dep) {

    return Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);
            this.massActionList.push('setClosedWon');
            this.massActionList.push('setClosedLost');
        },

        actionSetClosedWon: function (data) {
            var id = data.id;
            if (!id) {
                return;
            }
            var model = this.collection.get(id);
            if (!model) {
                return;
            }

            model.set('stage', 'Closed Won');

            this.listenToOnce(model, 'sync', function () {
                this.notify(false);
                this.collection.fetch();
            }, this);

            this.notify('Saving...');
            model.save();

        },

        actionSetClosedLost: function (data) {
            var id = data.id;
            if (!id) {
                return;
            }
            var model = this.collection.get(id);
            if (!model) {
                return;
            }

            model.set('stage', 'Closed Lost');

            this.listenToOnce(model, 'sync', function () {
                this.notify(false);
                this.collection.fetch();
            }, this);

            this.notify('Saving...');
            model.save();
        },

        massActionSetClosedWon: function () {
            this.notify('Please wait...');
            var data = {};
            data.ids = this.checkedList;
            $.ajax({
                url: this.collection.url + '/action/massSetClosedWon',
                type: 'POST',
                data: JSON.stringify(data)
            }).done(function (result) {
                this.notify(false);
                this.listenToOnce(this.collection, 'sync', function () {
                    data.ids.forEach(function (id) {
                        if (this.collection.get(id)) {
                            this.checkRecord(id);
                        }
                    }, this);
                }, this);
                this.collection.fetch();
            }.bind(this));
        },

        massActionSetClosedLost: function () {
            this.notify('Please wait...');
            var data = {};
            data.ids = this.checkedList;
            $.ajax({
                url: this.collection.url + '/action/massSetClosedLost',
                type: 'POST',
                data: JSON.stringify(data)
            }).done(function (result) {
                this.notify(false);
                this.listenToOnce(this.collection, 'sync', function () {
                    data.ids.forEach(function (id) {
                        if (this.collection.get(id)) {
                            this.checkRecord(id);
                        }
                    }, this);
                }, this);
                this.collection.fetch();
            }.bind(this));
        },

    });

});