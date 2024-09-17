sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device"
], function (Controller, Device) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.InitialScreen", {
        onInit: function () {
            this.loadConfiguredSystems();
        },
        onDevButtonPress: async function () {
            this.LoadSapLogon();
        },
        onsapCancelPress: function () {
            this.oConfigSap.close();
        },
        onProdButtonPress: function () {
            this.LoadSapLogon();
        },
        onEnvButtonPress: function () {
            this.LoadSapLogon();
        },
        LoadSapLogon: async function () {
            this.oConfigSap ??= await this.loadFragment({
                name: "com.app.rfapp.fragments.SapLogon"
            })
            this.oConfigSap.open();
        },
        handleLinksapPress: async function () {
            this.oConnetSap ??= await this.loadFragment({
                name: "com.app.rfapp.fragments.ConnecttoSAP"
            })
            this.oConnetSap.open();
        },
        onCloseconnectsap: function () {
            this.oConnetSap.close();
        },
        onsapsubmitPress: function () {
            var oU = this.getView().byId("idsaplogonUserId").getValue();
            var oP = this.getView().byId("idSapLogonPassword").getValue();
            if (oU === "111010" && oP === "ARTIHCUS") {
                this.getOwnerComponent().getRouter().navTo("Homepage", { id: oU })
            }

            this.onUserLogin();

        },
        onUserLogin: function () {
            this.getView().byId("idsaplogonUserId").setValue();
            this.getView().byId("idSapLogonPassword").setValue();
        },
        // clear btn in the configure SAP fragment.
        onClearconnectsapDialog: function () {
            this.getView().byId("idDescriptionInput").setValue();
            this.getView().byId("idSystemIdInput").setValue();
            this.getView().byId("idInstanceNumberInput").setValue();
            this.getView().byId("idApplicationServerInput").setValue();
            this.getView().byId("idClientInput").setValue();
            this.getView().byId("idServiceInput").setValue();
        },
        onsaveconnectSAPPress: function () {
            // Get the dialog and its input fields
            var oView = this.getView();
            var oDialog = oView.byId("idconnectsapdialog");
            var sDescription = oView.byId("idDescriptionInput").getValue();
            var sSystemId = oView.byId("idSystemIdInput").getValue();

            // Validate input
            if (!sDescription || !sSystemId) {
                MessageToast.show("Please enter required fields.");
                return;
            }

            // Create a new button for the configured SAP system
            var oHomePage = oView.byId("environmentButtonsHBox");
            var oNewButton = new sap.m.Button({
                text: sDescription + " (" + sSystemId + ")",
                type: "Emphasized",
                width: "11rem",
                press: function () {
                    this.onConfiguredSystemPress(oNewButton, sDescription, sSystemId);
                }.bind(this)
            });

            // Create a delete button
            var oDeleteButton = new sap.m.Button({
                icon: "sap-icon://delete",
                tooltip: "Delete",
                type :"Reject",
                press: function () {
                    this.onDeleteConfiguredSystem(oNewButton, sDescription, sSystemId);
                }.bind(this)
            });

            // Create a HBox to hold the buttons
            var oHBox = new sap.m.HBox({
                items: [oNewButton, oDeleteButton]
            });

            // Insert the HBox into the Home Page
            oHomePage.insertItem(oHBox, oHomePage.indexOfItem(oView.byId("_IDCofiguresapLink")));

            // Save the button data in local storage
            this.saveConfiguredSystem(sDescription, sSystemId);

            // Close the dialog after saving
            oDialog.close();

        },

        // Save configured system in local storage
        saveConfiguredSystem: function (description, systemId) {
            var configuredSystems = JSON.parse(localStorage.getItem("configuredSystems")) || [];
            configuredSystems.push({ description: description, systemId: systemId });
            localStorage.setItem("configuredSystems", JSON.stringify(configuredSystems));
        },

        // Load configured systems from local storage
        loadConfiguredSystems: function () {
            var configuredSystems = JSON.parse(localStorage.getItem("configuredSystems")) || [];
            var oHomePage = this.getView().byId("environmentButtonsHBox");

            configuredSystems.forEach(function (system) {
                var oNewButton = new sap.m.Button({
                    text: system.description + " (" + system.systemId + ")",
                    type: "Emphasized",
                    width: "11rem"
                });

                // Attach the press event to the new button
                oNewButton.attachPress(this.onConfiguredSystemPress.bind(this, system.description, system.systemId));

                // Get the "Configure SAP system" link
                var oLink = this.getView().byId("_IDCofiguresapLink");

                // Insert the new button before the link
                oHomePage.insertItem(oNewButton, oHomePage.indexOfItem(oLink));
            }, this);
        },
        // Define the press function for the new button
        onConfiguredSystemPress: function (description, systemId) {
            this.LoadSapLogon();
        },
        onCloseconnectsap: function () {
            // Close the dialog
            var oDialog = this.getView().byId("idconnectsapdialog");
            oDialog.close();
        },

        onDeleteConfiguredSystem: function (oButton, description, systemId) {
            // Remove the button from the UI
            var oHomePage = this.getView().byId("environmentButtonsHBox");
            oHomePage.removeItem(oButton.getParent()); // Remove the HBox containing the button
        
            // Update local storage
            this.removeConfiguredSystem(description, systemId);
        },
        
        // Remove configured system from local storage
        removeConfiguredSystem: function (description, systemId) {
            var configuredSystems = JSON.parse(localStorage.getItem("configuredSystems")) || [];
            configuredSystems = configuredSystems.filter(function(system) {
                return !(system.description === description && system.systemId === systemId);
            });
            localStorage.setItem("configuredSystems", JSON.stringify(configuredSystems));
        },
        
    });


});