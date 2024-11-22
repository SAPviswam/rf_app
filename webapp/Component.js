/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/app/rfapp/model/models",
    "sap/ui/model/odata/v2/ODataModel"

],
function (UIComponent, Device, models, ODataModel) {
    "use strict";

    return UIComponent.extend("com.app.rfapp.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            var oModel = new ODataModel("/sap/opu/odata/sap/ZEWM_RFUI_SRV_01/", {
                headers: {
                  "Authorization": "Basic" + btoa("sreedhars:Sreedhar191729"),
                  "sap-client": "100"
                }
              });
              this.setModel(oModel);

        },
        getPopover: function () {
            return this._oPopover;
        },
        setPopover: function (oPopover) {
            this._oPopover = oPopover;
        },

        
    });
}
);