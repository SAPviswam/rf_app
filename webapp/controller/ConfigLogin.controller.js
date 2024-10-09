sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.ConfigLogin", {
            onInit: function () {
            },
            onpresslogin: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("InitialScreen");
            },
            onpresssignup: async function () {
                try {
                    // Load the fragment if it hasn't been loaded yet
                    if (!this.oConnetSap) {
                        this.oConnetSap = await this.loadFragment({
                            name: "com.app.rfapp.fragments.signupl"
                        });
                    }

                    // Open the dialog once fragment is loaded
                    this.oConnetSap.open();
                } catch (oError) {
                    console.error("Error loading fragment:", oError);
                }
            },
            onpresscancel: function () {
                if (this.oConnetSap.isOpen()) {
                    this.oConnetSap.close();
                }
            }
        });
    }
);
