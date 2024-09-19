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
            var sInstanceNumber = oView.byId("idInstanceNumberInput").getValue();
            var sClient = oView.byId("idClientInput").getValue();
            var sApplicationServer = oView.byId("idApplicationServerInput").getValue();
            var sRouterString = oView.byId("idRouterStringInput").getValue();
            var sService = oView.byId("idServiceInput").getValue();

            // // Initialize an array to hold error messages
            // var aErrorMessages = [];

            // // Validate input fields
            // if (!sDescription) {
            //     aErrorMessages.push("Please fill in the Description field.");
            //     oView.byId("idDescriptionInput").setValueState(sap.ui.core.ValueState.Error); // Highlight the field
            // } else {
            //     oView.byId("idDescriptionInput").setValueState(sap.ui.core.ValueState.None); // Clear error state
            // }

            // if (!sSystemId) {
            //     aErrorMessages.push("Please fill in the System ID field.");
            //     oView.byId("idSystemIdInput").setValueState(sap.ui.core.ValueState.Error);
            // } else {
            //     oView.byId("idSystemIdInput").setValueState(sap.ui.core.ValueState.None);
            // }

            // if (!sInstanceNumber) {
            //     aErrorMessages.push("Please fill in the Instance Number field.");
            //     oView.byId("idInstanceNumberInput").setValueState(sap.ui.core.ValueState.Error);
            // } else {
            //     oView.byId("idInstanceNumberInput").setValueState(sap.ui.core.ValueState.None);
            // }

            // if (!sClient) {
            //     aErrorMessages.push("Please fill in the Client field.");
            //     oView.byId("idClientInput").setValueState(sap.ui.core.ValueState.Error);
            // } else {
            //     oView.byId("idClientInput").setValueState(sap.ui.core.ValueState.None);
            // }

            // if (!sApplicationServer) {
            //     aErrorMessages.push("Please fill in the Application Server field.");
            //     oView.byId("idApplicationServerInput").setValueState(sap.ui.core.ValueState.Error);
            // } else {
            //     oView.byId("idApplicationServerInput").setValueState(sap.ui.core.ValueState.None);
            // }

            // // Optional: Validate Router String and Service if needed
            // // Add similar checks for Router String and Service fields if they are mandatory

            // // If there are any error messages, show them and return
            // if (aErrorMessages.length > 0) {
            //     MessageToast.show("Please fill all mandatory fields "); // Show all error messages
            //     return;
            // }

            // Create a new button for the configured SAP system
            var oNewButton = new sap.m.Button({
                text: sDescription,
                type: "Emphasized",
                width: "11rem",
                customData: [
                    new sap.ui.core.CustomData({
                        key: "systemId",
                        value: sSystemId // Store system ID in custom data
                    })
                ]
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

            // Save to OData service (if needed)
            var oModel = this.getView().getModel(); // Get the OData model
            var oEntry = {
                Description: sDescription,
                SystemId: sSystemId,
                InstanceNo:sInstanceNumber,
                Client:sClient,
                AppServer:sApplicationServer,
                SapRouterStr:sRouterString,
                SapService:sService
                // Add other properties as needed based on your OData service structure
            };

            oModel.create("/ServiceSet", oEntry, {
                success: function () {
                    MessageToast.show("Configured system saved successfully.");
                    this.clearInputFields(oView);
                }.bind(this), // Ensure 'this' context is correct
                error: function (oError) {
                    MessageToast.show("Error saving configured system.");
                }
            });

            // Close the dialog after saving
            oDialog.close();
        },
        clearInputFields: function(oView) {
            // Clear all input fields by setting their values to an empty string
            oView.byId("idDescriptionInput").setValue("");
            oView.byId("idSystemIdInput").setValue("");
            oView.byId("idInstanceNumberInput").setValue("");
            oView.byId("idClientInput").setValue("");
            oView.byId("idApplicationServerInput").setValue("");
            oView.byId("idRouterStringInput").setValue(""); 
            oView.byId("idServiceInput").setValue(""); 
         },

        // Load configured systems from OData service and display them in the UI
        loadConfiguredSystems: function () {
            var oModel = this.getOwnerComponent().getModel(); // Get the OData model

            oModel.read("/ServiceSet", {
                success: function (oData) {
                    var aConfiguredSystems = oData.results; // Assuming results is an array of configured systems

                    var oHomePage = this.getView().byId("environmentButtonsHBox");
                    // Clear existing items before adding new ones

                    aConfiguredSystems.forEach(function (system) {
                        var oNewButton = new sap.m.Button({
                            text: system.Description,
                            type: "Emphasized",
                            width: "11rem"
                        });

                        // Attach single click event for CRUD operations
                        oNewButton.attachPress(this.onConfiguredSystemButtonPress.bind(this, oNewButton, system.Description, system.SystemId));

                        // Attach double click event for opening SAP logon
                        oNewButton.attachBrowserEvent("dblclick", function () {
                            this.LoadSapLogon();
                        }.bind(this));

                        // Add button to the HBox
                        oHomePage.addItem(oNewButton);
                    }, this); // Bind 'this' context for inner function

                }.bind(this), // Ensure 'this' context is correct
                error: function (oError) {
                    MessageToast.show("Error loading configured systems.");
                    console.error(oError);
                }
            });
        },

        onConfiguredSystemButtonPress: function (oButton, description, systemId) {
            this.selectedButton = oButton;
            this.systemId = systemId;
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

            var that = this; // Store reference to 'this' for use in callbacks

            MessageBox.warning("Are you sure you want to delete the configured system?", {
                title: "Confirm Deletion",
                onClose: function (status) {
                    if (status === "OK") {
                        // Delete from OData service
                        var oModel = that.getView().getModel(); // Get the OData model
                        var sPath = "/ServiceSet('" + that.systemId + "')"; // Construct path based on your entity set

                        oModel.remove(sPath, {
                            success: function () {
                                MessageToast.show("Configured system deleted successfully.");
                            }.bind(that), // Ensure 'this' context is correct
                            error: function (oError) {
                                MessageToast.show("Error deleting configured system.");
                                console.error(oError);
                            }
                        });

                        // Clear selection
                        that.selectedButton = null;
                    } else {
                        MessageToast.show("Deletion cancelled.");
                    }
                }.bind(that) // Bind the controller context
            });
        }
    });


});