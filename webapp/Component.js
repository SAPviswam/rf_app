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

                // var oModel = new ODataModel("/sap/opu/odata/sap/ZEWM_RFUI_SRV_01/", {
                //     headers: {
                //         "Authorization": "Basic" + btoa("sreedhars:Sreedhar191729"),
                //         "sap-client": "100"
                //     }
                // });
                // this.setModel(oModel);

                // testing dynamic client
                async function changeClient(newClient) {
                    // Get the base service URL
                    var baseUrl = "/sap/opu/odata/sap/ZEWM_RFUI_SRV_01/";

                    // Append the desired client dynamically
                    var updatedUrl = baseUrl + "?sap-client=" + newClient;

                    // Create a new OData model with the updated URL
                    var oModel = new sap.ui.model.odata.v2.ODataModel(updatedUrl, {
                        useBatch: true, // Enable batch requests if required
                        defaultBindingMode: "TwoWay" // Adjust binding mode as needed
                    });

                    // Set the new model to the core or specific view
                    sap.ui.getCore().setModel(oModel);
                }

                changeClient("100")
                // test

                // Load config.json
                const oConfigModel = new sap.ui.model.json.JSONModel();
                oConfigModel.loadData("utils/config.json");
                this.setModel(oConfigModel, "config"); // Set model with name 'config'

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