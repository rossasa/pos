/******************************************************************************
*    Point Of Sale - Pricelist for POS Odoo
*    Copyright (C) 2014 Taktik (http://www.taktik.be)
*    @author Adil Houmadi <ah@taktik.be>
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
******************************************************************************/
function pos_pricelist_screens(instance, module) {

    module.ClientListScreenWidget = module.ClientListScreenWidget.extend({
        save_changes: function () {
            this._super();
            if (this.has_client_changed()) {
                var currentOrder = this.pos.get('selectedOrder');
                var orderLines = currentOrder.get('orderLines').models;
                var partner = currentOrder.get_client();
                this.pos.pricelist_engine.update_products_ui(partner);
                this.pos.pricelist_engine.update_ticket(partner, orderLines);
            }
        }
    });

    var _super_ProductScreenWidget = instance.point_of_sale.ProductScreenWidget.prototype
    instance.point_of_sale.ProductScreenWidget = instance.point_of_sale.ProductScreenWidget.extend({
        init: function() {
            this._super.apply(this, arguments);
        },
        start:function(){
            var self = this;
            _super_ProductScreenWidget.start.call(this);
            pos = self.pos;
            selectedOrder = self.pos.get('selectedOrder');
            var pricelist_list = $.map(pos.db.pricelist_by_id, function(value, index) {
                return [value];
            });
            var new_options = [];
            //new_options.push('<option value="">Selecionar Lista de Precios</option>\n');
            if(pricelist_list.length > 0){
                for(var i = 0, len = pricelist_list.length; i < len; i++){
                    new_options.push('<option value="' + pricelist_list[i].id + '">' + pricelist_list[i].display_name + '</option>\n');
                }
                $('#price_list').html(new_options);
                $('#price_list').selectedIndex = 0;
            }

            $('#price_list').on('change', function() {
                //var partner_id = self.pos.get('selectedOrder').get_client() && parseInt(self.pos.get('selectedOrder').get_client().id);
                value = parseInt($('#price_list').val()) || parseInt(this.get_pricelist());
                var partner = self.pos.get('selectedOrder').get_client();
                if(!partner){
                    partner = self.pos.partners[0];
                }
                partner.property_product_pricelist[0] = value;
                var orderLines = self.pos.get('selectedOrder').get('orderLines').models;
                self.pos.get('selectedOrder').pos.pricelist_engine.update_products_ui(partner);
                self.pos.get('selectedOrder').pos.pricelist_engine.update_ticket(partner, orderLines);
                console.log("teste"+ value);

            });
        },
    });
}
