sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller, Device, MessageToast, MessageBox, Filter, FilterOperator,) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.InitialScreen", {
        onInit: function () {
            this.loadConfiguredSystems();
        },
        onsapCancelPress: function () {
            this.oConfigSap.close();
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
            this.getView().byId("idconnectsapeditButton").setVisible(false);
            this.getView().byId("idconnectsapfinishButton").setVisible(true);
        },
        onCloseconnectsap: function () {
            debugger
            this.oConnetSap.close();
            var oModel = this.getView().getModel();
            oModel.refresh(true);
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
        onFinishconnectSAPPress: function () {
            // Get the dialog and its input fields
            var oView = this.getView();
            var sDescription = oView.byId("idDescriptionInput").getValue();
            var sSystemId = oView.byId("idSystemIdInput").getValue();
            var sInstanceNumber = oView.byId("idInstanceNumberInput").getValue();
            var sClient = oView.byId("idClientInput").getValue();
            var sApplicationServer = oView.byId("idApplicationServerInput").getValue();
            var sRouterString = oView.byId("idRouterStringInput").getValue();
            var sService = oView.byId("idServiceInput").getValue();
            var oCheckbox = oView.byId("idCheckboxDescription");
            var bValid = true;
            var bAllFieldsFilled = true;

            // Validate Description only if the checkbox is not selected
            if (!oCheckbox.getSelected() && !sDescription) {
                oView.byId("idDescriptionInput").setValueState("Error");
                oView.byId("idDescriptionInput").setValueStateText("Description is mandatory when checkbox is not selected.");
                bValid = false;
                bAllFieldsFilled = false;
            } else {
                oView.byId("idDescriptionInput").setValueState("None");
            }

            if (!sSystemId) {
                oView.byId("idSystemIdInput").setValueState("Error");
                oView.byId("idSystemIdInput").setValueStateText("System ID must be a 3-digit value");
                bValid = false;
                bAllFieldsFilled = false;
            } else {
                oView.byId("idSystemIdInput").setValueState("None");
            }

            // Validate Username
            if (!sInstanceNumber) {
                oView.byId("idInstanceNumberInput").setValueState("Error");
                oView.byId("idInstanceNumberInput").setValueStateText("InstanceNumber must be a 3-digit value");
                bValid = false;
                bAllFieldsFilled = false;
            } else {
                oView.byId("idInstanceNumberInput").setValueState("None");
            }

            if (!sClient) {
                oView.byId("idClientInput").setValueState("Error");
                oView.byId("idClientInput").setValueStateText("clientID must be a 3-digit value");
                bValid = false;
                bAllFieldsFilled = false;
            } else {
                oView.byId("idClientInput").setValueState("None");
            }

            if (!sApplicationServer) {
                oView.byId("idApplicationServerInput").setValueState("Error");
                bValid = false;
                bAllFieldsFilled = false;
            } else {
                oView.byId("idApplicationServerInput").setValueState("None");
            }

            if (!sService) {
                oView.byId("idServiceInput").setValueState("Error");
                oView.byId("idServiceInput").setValueStateText("Service is mandatory");
                bValid = false;
                bAllFieldsFilled = false;
            } else {
                oView.byId("idServiceInput").setValueState("None");
            }


            // Display appropriate message
            if (!bAllFieldsFilled) {
                sap.m.MessageToast.show("Please fill all mandatory details");
                return;
            }

            if (!bValid) {
                sap.m.MessageToast.show("Please enter correct data");
                return;
            }


            // Get the OData model
            var oModel = this.getView().getModel();

            // Read existing entries to check uniqueness
            oModel.read("/ServiceSet", {
                filters: [new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.EQ, sDescription)],
                filters: [new sap.ui.model.Filter("Client", sap.ui.model.FilterOperator.EQ, sClient)],
                filters: [new sap.ui.model.Filter("SapService", sap.ui.model.FilterOperator.EQ, sService)],
                success: function (oData) {
                    // Initialize an array to hold error messages
                    var errorMessages = [];

                    // Check for duplicates and populate error messages
                    if (oData.results.length > 0) {
                        if (oData.results.some(entry => entry.Client === sClient)) {
                            errorMessages.push("The Client must be unique.");
                        }
                        if (oData.results.some(entry => entry.Description === sDescription)) {
                            errorMessages.push("The Description must be unique.");
                        }
                        if (oData.results.some(entry => entry.SapService === sService)) {
                            errorMessages.push("The SAP Service must be unique.");
                        }

                        if (errorMessages.length > 0) {
                            MessageToast.show(errorMessages.join("\n"));
                            return; // Exit the function if duplicates are found
                        }

                    }

                    // Create a new button for the configured SAP system
                    var oNewButton = new sap.m.Button({
                        type: "Emphasized",
                        width: "11rem",
                        customData: [
                            new sap.ui.core.CustomData({
                                key: "systemId",
                                value: sSystemId // Store system ID in custom data
                            })
                        ]
                    });

                    // Set the button text based on the checkbox state
                    if (oCheckbox.getSelected()) {
                        oNewButton.setText(sSystemId + " / " + sClient);
                    } else {
                        oNewButton.setText(sDescription);
                    }

                    // Attach single click event for CRUD operations
                    oNewButton.attachPress(this.onConfiguredSystemButtonPress.bind(this, oNewButton, sDescription, sSystemId, sClient));

                    // Attach double click event for opening SAP logon
                    oNewButton.attachBrowserEvent("dblclick", function () {
                        this.LoadSapLogon();
                    }.bind(this));

                    // Create entry for OData service
                    var oEntry = {
                        Description: sDescription,
                        SystemId: sSystemId,
                        InstanceNo: sInstanceNumber,
                        Client: sClient,
                        AppServer: sApplicationServer,
                        SapRouterStr: sRouterString,
                        SapService: sService,
                        DescriptionB: (oCheckbox.getSelected() ? (sSystemId + " / " + sClient) : sDescription)
                        // Add other properties as needed based on your OData service structure
                    };

                    // Save to OData service
                    oModel.create("/ServiceSet", oEntry, {
                        success: function () {
                            MessageToast.show("Configured system saved successfully.");
                            this.clearInputFields(oView);

                            // Get the HBox that holds the buttons
                            var oHomePage = oView.byId("environmentButtonsHBox");

                            // Find the reference link to insert after
                            var oLink = oView.byId("_IDCofiguresapLink");

                            // Insert the new button after the link
                            oHomePage.insertItem(oNewButton, oHomePage.indexOfItem(oLink) + 1);
                        }.bind(this), // Ensure 'this' context is correct
                        error: function (oError) {
                            MessageToast.show("Error saving configured system.");
                        }
                    });

                    // Close the dialog after saving
                    this.onCloseconnectsap(); // Assuming you have a method to close the dialog

                }.bind(this), // Ensure 'this' context is correct
                error: function (oError) {
                    MessageToast.show("Error checking existing systems.");
                }
            });
        },
        clearInputFields: function (oView) {
            // Clear all input fields by setting their values to an empty string
            oView.byId("idDescriptionInput").setValue("");
            oView.byId("idSystemIdInput").setValue("");
            oView.byId("idInstanceNumberInput").setValue("");
            oView.byId("idClientInput").setValue("");
            oView.byId("idApplicationServerInput").setValue("");
            oView.byId("idRouterStringInput").setValue("");
            oView.byId("idServiceInput").setValue("");
            var oCheckbox = oView.byId("idCheckboxDescription");
            oCheckbox.setSelected(false);
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
                            text: system.DescriptionB,
                            type: "Emphasized",
                            width: "11rem"
                        });

                        // Attach single click event for CRUD operations
                        oNewButton.attachPress(this.onConfiguredSystemButtonPress.bind(this, oNewButton, system.Description, system.SystemId, system.Client));

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

        onConfiguredSystemButtonPress: function (oButton, description, SystemId, Client) {
            this.selectedButton = oButton;
            this.client = Client;
            this.sdedescription = oButton.mProperties.text;
        },
        // onCloseconnectsap: function () {
        //     // Close the dialog
        //     var oDialog = this.getView().byId("idconnectsapdialog");
        //     oDialog.close();
        // },
        handleAddPress: function () {
            this.handleLinksapPress();
        },
        handleEditPress: function () {
            this.handleLinksapPress();
        },
        onClearconnectSAPPress: function () {
            var oView = this.getView();
            this.clearInputFields(oView);
        },
        onDeleteConfiguredSystem: function () {
            if (!this.selectedButton) {
                MessageToast.show("No button selected for deletion.");
                return;
            }

            var that = this; // Store reference to 'this' for use in callbacks

            MessageBox.warning("Are you sure you want to delete the configured system?", {
                title: "Confirm Deletion",
                actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                onClose: function (status) {
                    if (status === MessageBox.Action.DELETE) {
                        // Delete from OData service
                        var oModel = that.getView().getModel(); // Get the OData model
                        var sPath = "/ServiceSet('" + this.client + "')"; // Construct path based on your entity set

                        oModel.remove(sPath, {
                            success: function () {
                                MessageToast.show("Configured system deleted successfully.");

                                // Remove the button from the UI
                                var oHomePage = that.getView().byId("environmentButtonsHBox");
                                oHomePage.removeItem(that.selectedButton); // Remove the selected button

                                // Clear selection
                                that.selectedButton = null;
                            }.bind(that), // Ensure 'this' context is correct
                            error: function (oError) {
                                MessageToast.show("Error deleting configured system.");
                                console.error(oError);
                            }
                        });
                    } else {
                        MessageToast.show("Deletion cancelled.");
                    }
                }.bind(that) // Bind the controller context
            });
        },
        onEditConfiguredSystem: function () {
            if (!this.selectedButton) {
                MessageToast.show("No button selected to edit.");
                return;
            }
            this.handleLinksapPress();
            this.getView().byId("idconnectsapeditButton").setVisible(true);
            this.getView().byId("idconnectsapfinishButton").setVisible(false);
            var oButtonText = this.sdedescription;

            var oModel = this.getView().getModel();

            var that = this;

            oModel.read("/ServiceSet", {
                filters: [new sap.ui.model.Filter("DescriptionB", sap.ui.model.FilterOperator.EQ, oButtonText)],
                success: function (oData) {

                    var aButtons = oData.results;
                    function checkButton(v) {
                        return v.DescriptionB === oButtonText;
                    }
                    var oButtonedit = aButtons.filter(checkButton);
                    if (oButtonedit) {

                        that.byId("idDescriptionInput").setValue(oButtonedit[0].Description);
                        that.byId("idSystemIdInput").setValue(oButtonedit[0].SystemId);
                        that.byId("idInstanceNumberInput").setValue(oButtonedit[0].InstanceNo);
                        that.byId("idClientInput").setValue(oButtonedit[0].Client);
                        that.byId("idApplicationServerInput").setValue(oButtonedit[0].AppServer);
                        that.byId("idRouterStringInput").setValue(oButtonedit[0].SapRouterStr);
                        that.byId("idServiceInput").setValue(oButtonedit[0].SapService);
                    }
                }
            });
        },
        onEditconnectSAPPress: function () {
            var oView = this.getView();
            var sDescription = oView.byId("idDescriptionInput").getValue();
            var sSystemId = oView.byId("idSystemIdInput").getValue();
            var sInstanceNumber = oView.byId("idInstanceNumberInput").getValue();
            var sClient = oView.byId("idClientInput").getValue();
            var sApplicationServer = oView.byId("idApplicationServerInput").getValue();
            var sRouterString = oView.byId("idRouterStringInput").getValue();
            var sService = oView.byId("idServiceInput").getValue();
            var oCheckbox = oView.byId("idCheckboxDescription");
            var oButton = this.selectedButton;
        
            // Perform validation checks
            if (!sSystemId) {
                sap.m.MessageToast.show("System ID is required.");
                return;
            }
            if (!sInstanceNumber) {
                sap.m.MessageToast.show("Instance Number is required.");
                return;
            }
            if (!sClient) {
                sap.m.MessageToast.show("Client is required.");
                return;
            }
            if (!sApplicationServer) {
                sap.m.MessageToast.show("Application Server is required.");
                return;
            }
            if (!sService) {
                sap.m.MessageToast.show("Service is required.");
                return;
            }
        
            // Update the sDescription based on the checkbox state
            if (oCheckbox.getSelected()) {
                sDescription = sSystemId + " / " + sClient;
            }
        
            // Update button text
            oButton.setText(sDescription);
        
            // Create an object with updated values, setting both Description and DescriptionB
            var oUpdatedData = {
                Description: sDescription,
                DescriptionB: sDescription,  // Ensure DescriptionB is updated to the same value
                SystemId: sSystemId,
                InstanceNo: sInstanceNumber,
                Client: sClient,
                AppServer: sApplicationServer,
                SapRouterStr: sRouterString,
                SapService: sService
            };
        
            var that = this;
            var oModel = this.getView().getModel();
        
            // Update the entry in OData service
            oModel.update("/ServiceSet('" + sClient + "')", oUpdatedData, {
                success: function () {
                    sap.m.MessageToast.show("Data updated successfully.");
                    that.clearInputFields(oView);
                    that.onCloseconnectsap(); // Close the dialog after updating
                },
                error: function (oError) {
                    sap.m.MessageToast.show("Error updating data.");
                }
            });
        },
        onBackconnectSAPPress:function(){
            this.onCloseconnectsap();
        },
        
        
    })
});