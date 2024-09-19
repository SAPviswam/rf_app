sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, Device, MessageToast, MessageBox) {
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
        onCancelconnectSAPPress: function () {
            this.getView().byId("idDescriptionInput").setValue();
            this.getView().byId("idSystemIdInput").setValue();
            this.getView().byId("idInstanceNumberInput").setValue();
            this.getView().byId("idApplicationServerInput").setValue();
            this.getView().byId("idClientInput").setValue();
            this.getView().byId("idServiceInput").setValue();
        },
        onFinishconnectSAPPress: function () {
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
            var oNewButton = new sap.m.Button({
                text: sDescription + " (" + sSystemId + ")",
                type: "Emphasized",
                width: "11rem",
            });

            // Attach single click event for CRUD operations
            oNewButton.attachPress(this.onConfiguredSystemButtonPress.bind(this, oNewButton, sDescription, sSystemId));

            // Attach double click event for opening SAP logon
            oNewButton.attachBrowserEvent("dblclick", function () {
                this.LoadSapLogon();
            }.bind(this));

            // Get the HBox that holds the buttons
            var oHomePage = oView.byId("environmentButtonsHBox");

            // Find the reference link to insert after
            var oLink = oView.byId("_IDCofiguresapLink");

            // Insert the new button after the link
            oHomePage.insertItem(oNewButton, oHomePage.indexOfItem(oLink) + 1);

            // Save the button data in local storage
            this.saveConfiguredSystem(sDescription, sSystemId);

            // Close the dialog after saving
            oDialog.close();
        },

        // Single click handler for CRUD operations
        onConfiguredSystemButtonPress: function (oButton, description, systemId) {
            this.selectedButton = oButton;

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
                oNewButton.attachPress(this.onConfiguredSystemButtonPress.bind(this, system.description, system.systemId));

                // Attach double click event for opening SAP logon
                oNewButton.attachBrowserEvent("dblclick", function () {
                    this.LoadSapLogon();
                }.bind(this));

                // Get the "Configure SAP system" link
                var oLink = this.getView().byId("_IDCofiguresapLink");

                // Insert the new button before the link
                oHomePage.insertItem(oNewButton, oHomePage.indexOfItem(oLink) + 1);
            }, this);
        },

        onCloseconnectsap: function () {
            // Close the dialog
            var oDialog = this.getView().byId("idconnectsapdialog");
            oDialog.close();
        },
        handleAddPress: function () {
            this.handleLinksapPress();
        },
        handleEditPress: function () {
            this.handleLinksapPress();
        },
        onDeleteConfiguredSystem: function () {
            if (!this.selectedButton) {
                MessageToast.show("No button selected for deletion.");
                return;
            }

            // Get the description and systemId from the selected button
            var description = this.selectedButton
            var systemId = this.selectedButton
            MessageBox.warning("Are you sure you want to delete the configured system?", {
                title: "Confirm Deletion",
                onClose: function (status) {
                    if (status === "OK") {
                        // Remove from local storage
                        this.removeConfiguredSystem(description, systemId);
                        // Clear selection
                        this.selectedButton = null;
                        MessageToast.show("Configured system removed from local storage.");
                    } else {
                        MessageToast.show("Deletion cancelled.");
                    }
                }.bind(this) // Bind the controller context
            });
        },

        removeConfiguredSystem: function (description) {
            var configuredSystems = JSON.parse(localStorage.getItem("configuredSystems")) || [];

            // Filter out the system that matches description and systemId
            configuredSystems = configuredSystems.filter(function (system) {
                return !(system.description === description);
            });

            localStorage.removeItem("configuredSystems", JSON.stringify(configuredSystems));
        }

    });


});