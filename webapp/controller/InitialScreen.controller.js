sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/PDFViewer",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    function (Controller, PDFViewer,JSONModel,Device, MessageToast, MessageBox, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.InitialScreen", {
            onInit: function () {
                this.isIPhone = /iPhone/i.test(navigator.userAgent);
                this.isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent);
                this.loadConfiguredSystems();
                this.aAllButtons = []; // Store all button instances
                this.currentIndex = 0;
                this.arrayOfButton = [];
                this.arrayOfClient = [];

                if (Device.system.phone) {
                    if (this.isIPhone) {
                        // Targeting iPhones (common pixel density for Retina displays and screen width)
                        this.byId("idImageLogoAvatarinitial").setWidth("42.5%");
                        this.byId("idImageLogoAvatarinitial").setHeight("45.5%");
                        // this.byId("initialscreentitle").setMarginRight("25%")
                        this.byId("idImageLogoAvatarinitial").addStyleClass("iphoneMarginLeft");
                        this.byId("initialscreentitle").addStyleClass("iphoneInitialTitle");


                    } else {
                        // Non-iPhone phones
                        this.byId("idImageLogoAvatarinitial").setWidth("90%");
                        this.byId("idImageLogoAvatarinitial").setHeight("35%");
                    }
                }
                else if (Device.system.tablet) {
                    this.byId("environmentButtonsHBox").setWidth("40%");
                }

            },
        
            FunctionKeysPress: function (event) {
                if (event.key === "F1") {
                    this.handleAddPressfragment();
                    event.preventDefault();

                }
                else if (event.key === "F2") {
                    this.handleEditPressfragment();
                    event.preventDefault();
                }
                else if (event.key === "F4") {
                    this.handleDeletePressfragment();
                    event.preventDefault();
                }
            },
            onTouchEnd: function (oEvent) {
                // Cleanup if necessary
            },
            handleAddPressfragment: function () {
                this.handleLinksapPress();
            },
            handleEditPressfragment: async function () {
                await this.onEditConfiguredSystem();
            },
            handleDeletePressfragment: function () {
                this.onDeleteConfiguredSystem();
            },
            onsapCancelPress: function () {
                this.oConfigSap.close();
            },
            LoadSapLogon: async function () {

                // Load the fragment if it hasn't been loaded yet
                this.oConfigSap ??= await this.loadFragment({
                    name: "com.app.rfapp.fragments.SapLogon"
                });

                // Open the dialog
                this.oConfigSap.open();

                // Call the user login function
                this.onUserLogin();


                if (Device.system.phone) {

                    if (this.isIPhone) {
                        // Targeting iPhones (common pixel density for Retina displays and screen width)
                        this.byId("_IDGenImage_CS").setWidth("25.5%");
                        this.byId("_IDGenImage_CS").setHeight("50.5%");
                        this.byId("idLanguageSelectorMultiComboBox_CS").setWidth("78.5%");
                        this.byId("LoginButton_CS").setWidth("78.5%");
                        this.byId("LoginButton_CS").setHeight("100%");

                        // Add margin-left by applying a CSS class
                        this.byId("_IDGenImage_CS").addStyleClass("iphoneMarginSapLogon");
                        this.byId("_IDTitleconnectsap_CS").addStyleClass("iphoneMarginSapLogon");

                        // this.byId("idLanguageSelectorMultiComboBox_CS").setWidth("75%");
                        // this.byId("LoginButton_CS").setWidth("75%");


                    }
                    else {
                        this.byId("idLanguageSelectorMultiComboBox_CS").setWidth("85%");
                        this.byId("LoginButton_CS").setWidth("85%");
                        // Non-iPhone phones
                        // this.byId("_IDGenImage_CS").setWidth("90%");
                        // this.byId("_IDGenImage_CS").setHeight("35%");
                    }
                }
                else if (Device.system.tablet) {
                    this.byId("idLanguageSelectorMultiComboBox_CS").setWidth("91%");
                    this.byId("LoginButton_CS").setWidth("92%");
                }


            },
            handleLinksapPress: async function () {
                debugger
                if (this.isEditButtonPressed === true) {
                    // MessageToast.show("Please deselect the buttons");
                    // return
                }
                else if (this.arrayOfButton.length > 0) {
                    MessageToast.show("Please deselect the buttons");
                    return
                }
                // Load the SAP connection fragment if it hasn't been loaded yet
                this.oConnetSap ??= await this.loadFragment({
                    name: "com.app.rfapp.fragments.ConnecttoSAP"
                });

                // Set button visibility
                this.getView().byId("idconnectsapfinishButton").setVisible(true);
                this.getView().byId("idconnectsapeditButton").setVisible(false);

                this.oConnetSap.open();
            },
            handleAddPress: async function () {
                await this.handleLinksapPress();
            },

            onCloseconnectsap: function () {
                this.isEditButtonPressed = false;
                this.oConnetSap.close();
                var oView = this.getView();
                oView.byId("idDescriptionInput").setValueState("None");
                oView.byId("idSystemIdInput").setValueState("None");
                oView.byId("idInstanceNumberInput").setValueState("None");
                oView.byId("idClientInput").setValueState("None");
                oView.byId("idApplicationServerInput").setValueState("None");
                this.clearInputFields(oView);
            },
            onsapsubmitPress: function () {
                var oU = this.getView().byId("idsaplogonUserId").getValue();
                var oP = this.getView().byId("idSapLogonPassword").getValue();
                if (oU === "111010" && oP === "ARTIHCUS") {
                    this.getOwnerComponent().getRouter().navTo("Homepage", { id: oU })
                }
            },
            onExit: function () {
                this.onUserLogin();
            },
            onUserLogin: function () {
                this.getView().byId("idUserInput_CS").setValue("");
                this.getView().byId("idSPasswordInput_CS").setValue("");
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
                var oModel = this.getOwnerComponent().getModel();

                // Read existing entries to check uniqueness
                oModel.read("/ServiceSet", {
                    filters: [new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.EQ, sDescription)],
                    filters: [new sap.ui.model.Filter("Client", sap.ui.model.FilterOperator.EQ, sClient)],
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
                                window.location.reload();
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
            // onHelpconnectsapDialog: function() {
            //     // Open the PDF when the help dialog is activated
            //     this.onOpenPDF();
            // },
            onOpenPDF: function () {
                // Get the source of the PDF from the model
                var sSource = this.getView().getModel().getProperty("/documents/0/Source");
            
                if (sSource) {
                    // Open the PDF in a new tab
                    window.open(sSource, '_blank');
                } else {
                    sap.m.MessageToast.show("PDF source not found.");
                    console.error("PDF source not found.");
                }
            },
            onDownloadPDF: function () {
                // Get the source of the PDF from the model
                var sSource = this.getView().getModel().getProperty("/documents/0/Source");
    
                if (sSource) {
                    // Create an anchor element to trigger download
                    var link = document.createElement('a');
                    link.href = sSource;
                    link.download = 'helpdoc.pdf'; // Set the name for downloaded file
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    console.error("PDF source not found.");
                }
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


            onConfiguredSystemButtonPress: function (oButton, description, SystemId, Client, oEvent) {
                this.isButtonPressed = true
                // arr = arr.filter(item => item !== valueToRemove);
                if (this.arrayOfButton.length >= 1) {
                    if (oButton.getType() === "Accept") {
                        console.log(oButton.getType())
                        oButton.setType("Emphasized")
                        this.arrayOfButton = this.arrayOfButton.filter(item => item !== oButton)
                        this.arrayOfClient = this.arrayOfClient.filter(item => item !== Client)


                    }
                    else {
                        this.arrayOfButton.push(oButton);
                        oButton.setType("Accept")
                        this.arrayOfClient.push(Client)
                    }

                }
                else {
                    this.arrayOfButton.push(oButton);
                    oButton.setType("Accept")
                    this.arrayOfClient.push(Client)
                }
                console.log(this.arrayOfButton);

                console.log(this.arrayOfButton.length);
                console.log(this.arrayOfClient);

                console.log(this.arrayOfClient.length);
                this.selectedButton = oButton;
                this.client = Client;
                this.sdedescription = oButton.mProperties.text;
            },

            onClearconnectSAPPress: function () {
                var oView = this.getView();
                this.clearInputFields(oView);
            },
            onDeleteConfiguredSystem: function () {
                // if (!this.selectedButton) {
                //     MessageToast.show("No System selected for deletion.");
                //     return;
                // }
                if (this.arrayOfButton < 1) {
                    MessageToast.show("Please select atleast one system to delete");
                    return;
                }

                console.log(this.arrayOfClient)
                var that = this; // Store reference to 'this' for use in callbacks

                MessageBox.warning(`Delete the ${this.arrayOfButton.length} selected system?`, {
                    title: "Delete",
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    onClose: function (status) {
                        if (status === MessageBox.Action.DELETE) {
                            this.arrayOfButton.forEach(element => {
                                console.log(element.mProperties)
                            });
                            console.log(this.client)
                            // Delete from OData service
                            var oModel = that.getView().getModel(); // Get the OData model
                            this.arrayOfClient.forEach(element => {
                                console.log(element)
                                var sPath = "/ServiceSet('" + element + "')";
                                oModel.remove(sPath, {
                                    success: function () {
                                        MessageToast.show("Configured system deleted successfully.");

                                        // Remove the button from the UI
                                        var oHomePage = that.getView().byId("environmentButtonsHBox");
                                        oHomePage.removeItem(that.selectedButton); // Remove the selected button
                                        var index = that.aAllButtons.indexOf(that.selectedButton);
                                        if (index !== -1) {
                                            that.aAllButtons.splice(index, 1); // Remove button from array
                                        }
                                        // Clear selection
                                        that.selectedButton = null;
                                        that.updateDisplayedButtons()

                                        var index = that.aAllButtons.indexOf(that.selectedButton);
                                        if (index !== -1) {
                                            that.aAllButtons.splice(index, 1); // Remove button from array
                                        }
                                        // Clear selection
                                        that.selectedButton = null;
                                        this.arrayOfButton.forEach(element => {
                                            element.setType("Emphasized")
                                        });
                                        this.arrayOfButton = [];
                                        this.arrayOfClient = []
                                        that.updateDisplayedButtons();
                                    }.bind(that), // Ensure 'this' context is correct
                                    error: function (oError) {
                                        MessageToast.show("Error deleting configured system.");
                                        this.arrayOfButton.forEach(element => {
                                            element.setType("Emphasized")
                                        });
                                        this.arrayOfButton = [];
                                        this.arrayOfClient = []
                                        console.error(oError);
                                    }
                                });
                            });
                            // var sPath = "/ServiceSet('" + this.client + "')"; // Construct path based on your entity set

                            // oModel.remove(sPath, {
                            //     success: function () {
                            //         MessageToast.show("Configured system deleted successfully.");

                            //         // Remove the button from the UI
                            //         var oHomePage = that.getView().byId("environmentButtonsHBox");
                            //         oHomePage.removeItem(that.selectedButton); // Remove the selected button
                            //         var index = that.aAllButtons.indexOf(that.selectedButton);
                            //         if (index !== -1) {
                            //             that.aAllButtons.splice(index, 1); // Remove button from array
                            //         }
                            //         // Clear selection
                            //         that.selectedButton = null;
                            //         that.updateDisplayedButtons()

                            //         var index = that.aAllButtons.indexOf(that.selectedButton);
                            //         if (index !== -1) {
                            //             that.aAllButtons.splice(index, 1); // Remove button from array
                            //         }
                            //         // Clear selection
                            //         that.selectedButton = null;
                            //         this.arrayOfButton.forEach(element => {
                            //             element.setType("Emphasized")
                            //         });
                            //        this.arrayOfButton=[];
                            //        this.arrayOfClient=[]
                            //         that.updateDisplayedButtons();
                            //     }.bind(that), // Ensure 'this' context is correct
                            //     error: function (oError) {
                            //         MessageToast.show("Error deleting configured system.");
                            //         this.arrayOfButton.forEach(element => {
                            //             element.setType("Emphasized")
                            //         });
                            //        this.arrayOfButton=[];
                            //        this.arrayOfClient=[]
                            //         console.error(oError);
                            //     }
                            // });
                        } else {
                            MessageToast.show("Deletion cancelled.");
                            this.selectedButton = null;
                            this.arrayOfButton.forEach(element => {
                                element.setType("Emphasized")
                            });
                            this.arrayOfButton = [];
                            this.arrayOfClient = [];
                        }
                    }.bind(that) // Bind the controller context
                });
            },
            onEditConfiguredSystem: async function () {
                // if (!this.selectedButton) {
                //     MessageToast.show("No System selected to edit.");
                //     return;
                // }
                if (this.arrayOfButton.length > 1) {
                    MessageToast.show("Please select only one system to edit");
                    return
                }
                else if (this.arrayOfButton.length < 1) {
                    MessageToast.show("Please select atleast one system to edit");
                    return
                }
                let oButtonText;
                this.arrayOfButton.forEach(element => {
                    oButtonText = element.mProperties.text
                });
                this.isEditButtonPressed = true

                await this.handleLinksapPress();
                this.getView().byId("idconnectsapfinishButton").setVisible(false);
                this.getView().byId("idconnectsapeditButton").setVisible(true);
                // var oButtonText = this.sdedescription;
                var oModel = this.getView().getModel();
                var that = this;

                oModel.read("/ServiceSet", {
                    //filters: [new sap.ui.model.Filter("DescriptionB", sap.ui.model.FilterOperator.EQ, oButtonText)],
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
                        sap.m.MessageToast.show("system Configuration updated successfully");
                        that.clearInputFields(oView);
                        that.onCloseconnectsap(); // Close the dialog after updating
                    },
                    error: function (oError) {
                        sap.m.MessageToast.show("Error updating data.");
                    }
                });
            },
            onBackconnectSAPPress: function () {
                this.onCloseconnectsap();
                // this.selectedButton = null;
                this.arrayOfButton.forEach(element => {
                    element.setType("Emphasized")
                });
                this.arrayOfButton.pop();
                this.arrayOfClient.pop();
            },
            onToggleButtonPress: function (oEvent) {
                const oButton = oEvent.getSource();
                // Toggle the selected state
                oButton.setPressed(!oButton.getPressed());
            },

            // Load configured systems from OData service and display them in the UI
            loadConfiguredSystems: function () {
                var oModel = this.getOwnerComponent().getModel(); // Get the OData model

                oModel.read("/ServiceSet", {
                    success: function (oData) {
                        var aConfiguredSystems = oData.results; // Assuming results is an array of configured systems

                        this.aAllButtons = []; // Reset the array

                        // Store all button instances
                        for (var i = 0; i < aConfiguredSystems.length; i++) {
                            var system = aConfiguredSystems[i]; // Get the current system

                            var oNewButton = new sap.m.Button({
                                text: system.DescriptionB,
                                type: "Emphasized",
                                width: "11rem",
                            });

                            // Attach single click event for CRUD operations
                            oNewButton.attachPress(this.onConfiguredSystemButtonPress.bind(this, oNewButton, system.Description, system.SystemId, system.Client));

                            // Attach double click event for opening SAP logon
                            oNewButton.attachBrowserEvent("dblclick", function () {
                                this.LoadSapLogon();
                            }.bind(this));

                            // Store the button in the array
                            this.aAllButtons.push(oNewButton);
                        }

                        // Load initial set of buttons
                        this.updateDisplayedButtons();

                    }.bind(this), // Ensure 'this' context is correct
                    error: function (oError) {
                        MessageToast.show("Error loading configured systems.");
                        console.error(oError);
                    }
                });
            },

            updateDisplayedButtons: function () {
                var oHomePage = this.getView().byId("environmentButtonsHBox");

                oHomePage.addItem(this.getView().byId("upNavigationButtonId"));

                // Determine how many buttons to display (3 at a time)
                var iLimit = Math.min(3, this.aAllButtons.length - this.currentIndex);

                for (var i = 0; i < this.aAllButtons.length; i++) {
                    if (i >= this.currentIndex && i < this.currentIndex + iLimit) {
                        // Show buttons within the current range
                        this.aAllButtons[i].setVisible(true);
                    } else {
                        // Hide buttons outside the current range
                        this.aAllButtons[i].setVisible(false);
                    }

                    // Add visible buttons to the HBox
                    if (this.aAllButtons[i].getVisible()) {
                        oHomePage.addItem(this.aAllButtons[i]);

                    }
                }
                if (this.currentIndex + 3 >= this.aAllButtons.length) {
                    this.getView().byId("downNavigationButtonId").setVisible(false); // Hide down navigation button
                } else {
                    this.getView().byId("downNavigationButtonId").setVisible(true); // Show down navigation button
                }
                oHomePage.addItem(this.getView().byId("downNavigationButtonId"));
            },
            onNavPrevious: function () {
                if (this.currentIndex + 3 < this.aAllButtons.length) { // Check if there are more buttons to show
                    this.currentIndex += 3; // Move to next set of buttons
                    this.updateDisplayedButtons(); // Update displayed buttons
                    this.getView().byId("upNavigationButtonId").setVisible(true)
                } else {
                    MessageToast.show("No more Systems to display."); // Optional feedback for user
                }
            },

            onNavNext: function () {
                if (this.currentIndex - 3 >= 0) { // Check if we can go back
                    this.currentIndex -= 3; // Move to previous set of buttons
                    this.updateDisplayedButtons(); // Update displayed buttons
                    if (this.currentIndex === 0) {
                        this.getView().byId("upNavigationButtonId").setVisible(false)
                    }
                } else {
                    MessageToast.show("No previous buttons to display."); // Optional feedback for user
                }
            },
            onLogOnPress: async function () {
                if (!(this.getView().byId("idUserInput_CS").getValue())) {
                    MessageToast.show("Please enter the username");
                    return
                }
                if (!(this.getView().byId("idSPasswordInput_CS").getValue())) {
                    MessageToast.show("Please enter the Password");
                    return
                }
                //filter(num => num % 2 !== 0);
                var oResourceId = this.getView().byId("idUserInput_CS").getValue();
                var oPassword = this.getView().byId("idSPasswordInput_CS").getValue();
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/RESOURCESSet('" + oResourceId + "')", {
                    success: function (oData) {
                        if (oData.Password === oPassword) {

                            this.getOwnerComponent().getRouter().navTo("Homepage", { id: oResourceId })
                        }
                        else {
                            MessageToast.show("Please enter the correct Password");
                        }

                    }.bind(this),
                    error: function () {
                        MessageToast.show("User doesn't exist")
                    }
                });
            },
            onPressCancleSapLogon: function () {
                this.oConfigSap.close();
            },
            onPressCancleSapLogonInChangePassword: function () {
                this.oConfigSapCP.close();
            },

            onChangePasswordBtn: async function () {
                var oView = this.getView();
                var sResourceId = oView.byId("idUserInput_CS").getValue(); // Get the Resource ID from user input
                this.sResourceID = sResourceId;
                if (!sResourceId) {
                    MessageBox.error("Please enter User");
                    return;
                }

                // Load the Change Password fragment if not already loaded
                this.oConfigSapCP ??= await this.loadFragment({
                    name: "com.app.rfapp.fragments.ChangePassword"
                });

                var oModel = this.getView().getModel(); // Get your OData model

                // Read user data based on Resource ID
                oModel.read("/RESOURCESSet('" + sResourceId + "')", {
                    success: function (oData) {
                        // Assuming 'Resourcename' is the property that holds the resource name
                        var sResourceName = oData.Resourcename; // Adjust property name as necessary
                        this.byId("idUserInput_CP").setValue(sResourceName); // Set the resource name in the input field
                        this.onUserLogin();
                        this.oConfigSapCP.open(); // Open the dialog after setting the value
                    }.bind(this), // Bind 'this' to maintain context
                    error: function () {
                        MessageBox.error("Error retrieving user data. Please try again later.");
                    }

                });
            },

            onChangePasswordPress: function () {
                var oView = this.getView();
                var sCurrentPassword = oView.byId("idSPasswordInput_CP").getValue();
                var sNewPassword = oView.byId("idNewPasswordInput_CP").getValue();
                var sConfirmPassword = oView.byId("idRepeatPasswordInput_CP").getValue();
                var oModel = this.getView().getModel(); // Get your model
                var sResourceId = this.sResourceID;

                if (!sCurrentPassword) {
                    MessageToast.show("Please enter current password");
                    return;
                }

                // Check if all mandatory fields are filled
                if (!sNewPassword || !sConfirmPassword) {
                    MessageToast.show("Please fill all feilds");
                    return;
                }

                // Read user data from model (adjust path as necessary)
                oModel.read("/RESOURCESSet('" + sResourceId + "')", {
                    success: function (oData) {
                        // Compare entered current password with stored password
                        if (oData.Password === sCurrentPassword) {
                            // Check if the new passwords match
                            if (sNewPassword !== sConfirmPassword) {
                                MessageBox.error("Passwords do not match. Please try again.");
                                return;
                            }

                            oModel.update(`/RESOURCESSet('${sResourceId}')`, {
                                Password: sNewPassword // Use an object to set the new password
                            }, {
                                success: function () {
                                    MessageToast.show("Password updated successfully!");
                                    oView.byId("idSPasswordInput_CP").setValue("");
                                    oView.byId("idNewPasswordInput_CP").setValue("");
                                    oView.byId("idRepeatPasswordInput_CP").setValue("");
                                }.bind(this),
                                error: function () {
                                    MessageBox.error("Error updating user login status.");
                                }
                            });
                        } else {
                            MessageBox.error("Current password is incorrect. Please try again.");
                        }
                    },
                    error: function () {
                        MessageBox.error("Error retrieving user data.");
                    }
                });
            }


        })
    });