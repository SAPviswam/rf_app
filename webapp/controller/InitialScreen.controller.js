
sap.ui.define([
    "./BaseController", 
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/ODataModel",
],
    function (Controller, Device, MessageToast, MessageBox, Filter, FilterOperator, ODataModel) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.InitialScreen", {
            onInit: function () {
                //Profile Image updating(from Base Controller)...
                var oModel = new ODataModel("/sap/opu/odata/sap/ZEWM_RFUI_SRV_01/", { 
                    headers: { 
                        "Authorization": "Basic " + btoa("psrilekha:Artihcus@123"), 
                        "sap-client": "100" 
                    } 
                }); 
                this.getView().setModel(oModel); 
                this.applyStoredProfileImage();

                this.isIPhone = /iPhone/i.test(navigator.userAgent);
                this.isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent);
                
                // load configured systems from the backend
                this.loadConfiguredSystems();
                
                this.aAllButtons = [];
                this.currentIndex = 0;
                this.arrayOfButton = [];
                this.arrayOfDescription = [];
                this.arrayOfClient = [];



                if (Device.system.phone) {
                    this.getView().byId("IdMainVbox_InitialView").setVisible(false);
                    this.getView().byId("idBtnsVbox_InitialView").addStyleClass("TitleMQ");
                    this.getView().byId("idConfigSapSysVbox_InitialView").addStyleClass("VboxAddConfig");

                }
                else if (Device.system.tablet) {
                    this.getView().byId("IdSubTitle_InitialView").addStyleClass("InitialScreenTitle");
                }

                this._handleKeyDownBound = this._handleKeyDown.bind(this);
                document.addEventListener("keydown", this._handleKeyDownBound);
              

            },
            _handleKeyDown: function (oEvent) {
                // Prevent default action for specific function keys
                if (["F1", "F2", "F4"].includes(oEvent.key)) {
                    oEvent.preventDefault();
                }

                // Check if the current view is the specified one
                if (this.getView().getId() === "container-com.app.rfapp---InitialScreen") {
                    switch (oEvent.key) {
                        case "F1":
                            this.onSavef1Press();
                            break;
                        case "F4":
                            this.onDeletef4press();
                            break;
                        case "F2":
                            this.onEditf2press();
                            break;
                    }
                }
            },
            LoadSapLogon: async function () {

                // Load the fragment if it hasn't been loaded yet
                this.oConfigSap ??= await this.loadFragment(
                    "SapLogon"
                );

                // Open the dialog
                this.oConfigSap.open();

                // Call the user login function
                this.onUserLogin();

                // responsive code for switching over the different devices of sap logon fragment
                if (Device.system.phone) {
                    if (this.isIPhone) {
                        this.getView().byId("LoginButton_CS").setHeight("500px");
                    }
                    this.getView().byId("LoginButton_CS").setWidth("100%");
                }
                else if (Device.system.desktop) {
                    var oButton = this.byId("LoginButton_CS");
                    oButton.$().find(".sapMBtnInner").css({
                        height: "2rem",
                        "min-width": "2rem",
                        "display": "flex",           // Use flexbox for centering
                        "align-items": "center",     // Center vertically
                        "justify-content": "center",  // Center horizontally
                        "text-align": "center"
                    });
                    this.getView().byId("SAPlogonform1").addStyleClass("vboxSapLagonForDesktop");
                }

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
                var sDescription = oView.byId("idDescriptionInput_InitialView").getValue();
                var sSystemId = oView.byId("idSystemIdInput_InitialView").getValue();
                var sInstanceNumber = oView.byId("idInstanceNumberInput_InitialView").getValue();
                var sClient = oView.byId("idClientInput_InitialView").getValue();
                var sApplicationServer = oView.byId("idApplicationServerInput_InitialView").getValue();
                var sRouterString = oView.byId("idRouterStringInput_InitialView").getValue();
                var sService = oView.byId("idServiceInput_InitialView").getValue();
                var oCheckbox = oView.byId("idCheckboxDescription_InitialView");

                if (!(sSystemId && sInstanceNumber && sClient)) {
                    MessageToast.show("Please enter the mandatory fields");
                    return
                }
                var bValid = true;
                var bAllFieldsFilled = true;
                // Validate Description only if the checkbox is not selected
                if (!oCheckbox.getSelected() && !sDescription) {
                    oView.byId("idDescriptionInput_InitialView").setValueState("Error");
                    oView.byId("idDescriptionInput_InitialView").setValueStateText("Description is mandatory when checkbox is not selected.");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oView.byId("idDescriptionInput_InitialView").setValueState("None");
                }
                if (!sSystemId) {
                    oView.byId("idSystemIdInput_InitialView").setValueState("Error");
                    oView.byId("idSystemIdInput_InitialView").setValueStateText("System ID must be a 3-digit value");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oView.byId("idSystemIdInput_InitialView").setValueState("None");
                }
                // Validate Instance Number
                if (!sInstanceNumber || !/^\d{2}$/.test(sInstanceNumber)) {
                    oView.byId("idInstanceNumberInput_InitialView").setValueState("Error");
                    oView.byId("idInstanceNumberInput_InitialView").setValueStateText("Instance Number must be a 2-digit numeric value");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oView.byId("idInstanceNumberInput_InitialView").setValueState("None");
                }

                // Validate Client ID
                if (!sClient || !/^\d{3}$/.test(sClient)) {
                    oView.byId("idClientInput_InitialView").setValueState("Error");
                    oView.byId("idClientInput_InitialView").setValueStateText("Client ID must be a 3-digit numeric value");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oView.byId("idClientInput_InitialView").setValueState("None");
                }
                if (!sApplicationServer) {
                    oView.byId("idApplicationServerInput_InitialView").setValueState("Error");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oView.byId("idApplicationServerInput_InitialView").setValueState("None");
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

                // Check for existing combinations in Configure_SystemSet
                const aSystemId = new Filter("SystemId", FilterOperator.EQ, sSystemId),
                    aClient = new Filter("Client", sap.ui.model.FilterOperator.EQ, sClient),
                    aInstanceNumber = new Filter("InstanceNumber", FilterOperator.EQ, sInstanceNumber),
                    aAllFilters = new Filter([aSystemId, aClient, aInstanceNumber]);
                oModel.read("/Configure_SystemSet", {
                    filters: [aAllFilters],
                    success: function (oData) {
                        // Check if the combination exists
                        var isCombinationExists = oData.results.some(entry =>
                            entry.Client === sClient &&
                            entry.SystemId === sSystemId &&
                            entry.InstanceNo === sInstanceNumber
                        );

                        // Read existing entries to check uniqueness in ServiceSet
                        var oDescription = new Filter("Description", FilterOperator.EQ, sDescription);
                        var oClient = new Filter("Client", FilterOperator.EQ, sClient);
                        var allFilter = new Filter([oDescription, oClient]);
                        oModel.read("/ServiceSet", {
                            filters: [allFilter],
                            success: function (oData) {
                                // Initialize an array to hold error messages
                                var errorMessages = [];

                                // Check for duplicates and populate error messages
                                if (oData.results.length > 0) {
                                    if (oData.results.some(entry => entry.Client === sClient)) {
                                        errorMessages.push("The Client must be unique.");
                                        oView.byId("idClientInput_InitialView").setValueState("Error");
                                        oView.byId("idClientInput_InitialView").setValueStateText("Please enter unique value.");
                                    }
                                    if (oData.results.some(entry => entry.Description.toLowerCase() === sDescription.toLowerCase())) {
                                        errorMessages.push("The Description must be unique.");
                                        oView.byId("idDescriptionInput_InitialView").setValueState("Error");
                                        oView.byId("idDescriptionInput_InitialView").setValueStateText("Please enter unique value");
                                    }

                                    // Show error messages if duplicates are found
                                    if (errorMessages.length > 0) {
                                        MessageBox.information(errorMessages.join("\n"));
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
                                oNewButton.setText(oCheckbox.getSelected() ? (sSystemId + " / " + sClient) : sDescription);

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
                                };

                                // Only proceed with creation if combination exists
                                if (!isCombinationExists) {
                                    // Save to OData service
                                    oModel.create("/ServiceSet", oEntry, {
                                        success: function () {
                                            MessageToast.show("Configured system saved successfully.");
                                            this.clearInputFields(oView);

                                            // Get the HBox that holds the buttons
                                            var oHomePage = oView.byId("idEnvironmentButtonsHBox_InitialView");

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
                                } else {
                                    MessageBox.show("The combination of Client, System ID, and Instance Number must exist in Configure_SystemSet before creating a new entry.");
                                }

                                // Close the dialog after saving or showing an error message
                                this.onCloseconnectsap();
                            }.bind(this), // Ensure 'this' context is correct
                            error: function (oError) {
                                MessageToast.show("Error checking existing systems.");
                            }
                        });
                    }.bind(this), // Ensure 'this' context is correct
                    error: function (oError) {
                        MessageToast.show("Error checking existing systems.");
                    }
                });
            },

            clearInputFields: function (oView) {
                // Clear all input fields by setting their values to an empty string
                oView.byId("idDescriptionInput_InitialView").setValue("");
                oView.byId("idSystemIdInput_InitialView").setValue("");
                oView.byId("idInstanceNumberInput_InitialView").setValue("");
                oView.byId("idClientInput_InitialView").setValue("");
                oView.byId("idApplicationServerInput_InitialView").setValue("");
                oView.byId("idRouterStringInput_InitialView").setValue("");
                oView.byId("idServiceInput_InitialView").setValue("");
                var oCheckbox = oView.byId("idCheckboxDescription_InitialView");
                oCheckbox.setSelected(false);
            },
            onConfiguredSystemButtonPress: function (oButton, description, SystemId, Client, oEvent) {
                this.isButtonPressed = true
                if (this.arrayOfButton.length >= 1) {
                    if (oButton.getType() === "Accept") {
                        oButton.setType("Emphasized")
                        this.arrayOfButton = this.arrayOfButton.filter(item => item !== oButton)
                        this.arrayOfClient = this.arrayOfClient.filter(item => item !== Client)
                        this.arrayOfDescription = this.arrayOfDescription.filter(item => item !== description)

                    }
                    else {
                        this.arrayOfButton.push(oButton);
                        oButton.setType("Accept")
                        this.arrayOfClient.push(Client);
                        this.arrayOfDescription.push(description);
                    }

                }
                else {
                    this.arrayOfButton.push(oButton);
                    oButton.setType("Accept")
                    this.arrayOfClient.push(Client);
                    this.arrayOfDescription.push(description);
                }

                this.selectedButton = oButton;
                this.client = Client;
                this.sdedescription = oButton.mProperties.text;
            },
            onClearconnectSAPPress: function () {
                var oView = this.getView();
                this.clearInputFields(oView);
            },
            onDeleteConfiguredSystem: function () {
                if (this.arrayOfButton < 1) {
                    MessageToast.show("Please select atleast one system to delete");
                    return;
                }

                var that = this; // Store reference to 'this' for use in callbacks

                if (this.arrayOfDescription.length > 1) {
                    var oString = this.arrayOfDescription.length
                }
                else {
                    var oString = this.arrayOfDescription[0];
                }

                MessageBox.warning(`Are you sure want to delete the ${oString} selected system?`, {

                    title: "Delete",
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    onClose: function (status) {
                        if (status === MessageBox.Action.DELETE) {
                            this.arrayOfButton.forEach(element => {
                            });
                            // Delete from OData service
                            var oModel = that.getView().getModel(); // Get the OData model
                            this.arrayOfClient.forEach(element => {
                                var sPath = "/ServiceSet('" + element + "')";
                                oModel.remove(sPath, {
                                    success: function () {
                                        MessageToast.show("Configured system deleted successfully.");

                                        // Remove the button from the UI
                                        var oHomePage = that.getView().byId("idEnvironmentButtonsHBox_InitialView");
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
                                        this.arrayOfClient = [];
                                        this.arrayOfDescription = [];
                                        that.updateDisplayedButtons();
                                    }.bind(that), // Ensure 'this' context is correct
                                    error: function (oError) {
                                        MessageToast.show("Error deleting configured system.");
                                        this.arrayOfButton.forEach(element => {
                                            element.setType("Emphasized")
                                        });
                                        this.arrayOfButton = [];
                                        this.arrayOfClient = [];
                                        this.arrayOfDescription = [];
                                        console.error(oError);
                                    }
                                });
                            });
                        } else {
                            MessageToast.show("Deletion cancelled.");
                            this.selectedButton = null;
                            this.arrayOfButton.forEach(element => {
                                element.setType("Emphasized")
                            });
                            this.arrayOfButton = [];
                            this.arrayOfClient = [];
                            this.arrayOfDescription = [];
                        }
                    }.bind(that) // Bind the controller context
                });
            },
            onEditConfiguredSystem: async function () {

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

                // await this.handleLinksapPress();
                this.getView().byId("idconnectsapfinishButton_InitialView").setVisible(false);
                this.getView().byId("idconnectsapeditButton_InitialView").setVisible(true);
                this.getView().byId("idClientInput_InitialView").setEditable(false);
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
                            that.byId("idDescriptionInput_InitialView").setValue(oButtonedit[0].Description);
                            that.byId("idSystemIdInput_InitialView").setValue(oButtonedit[0].SystemId);
                            that.byId("idInstanceNumberInput_InitialView").setValue(oButtonedit[0].InstanceNo);
                            that.byId("idClientInput_InitialView").setValue(oButtonedit[0].Client);
                            that.byId("idApplicationServerInput_InitialView").setValue(oButtonedit[0].AppServer);
                            that.byId("idRouterStringInput_InitialView").setValue(oButtonedit[0].SapRouterStr);
                            that.byId("idServiceInput_InitialView").setValue(oButtonedit[0].SapService);
                        }
                        // New UI modification start
                        that.getView().byId("idConfigSapSysVbox_InitialView").setVisible(true);
                        that.getView().byId("idBtnsVbox_InitialView").setVisible(false);
                    }
                });
            },
            onEditconnectSAPPress: function () {
                var oView = this.getView();
                var sDescription = oView.byId("idDescriptionInput_InitialView").getValue();
                var sSystemId = oView.byId("idSystemIdInput_InitialView").getValue();
                var sInstanceNumber = oView.byId("idInstanceNumberInput_InitialView").getValue();
                var sClient = oView.byId("idClientInput_InitialView").getValue();
                var sApplicationServer = oView.byId("idApplicationServerInput_InitialView").getValue();
                var sRouterString = oView.byId("idRouterStringInput_InitialView").getValue();
                var sService = oView.byId("idServiceInput_InitialView").getValue();
                var oCheckbox = oView.byId("idCheckboxDescription_InitialView");
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

                var that = this;
                var oModel = this.getView().getModel();

                // First read the values if entered unique values if entered uniquely.

                const oDescription = new Filter("Description", FilterOperator.EQ, sDescription),
                    oClient = new Filter("Client", FilterOperator.EQ, sClient),
                    aAllFilters = new Filter([oClient, oDescription]);

                oModel.read("/ServiceSet", {
                    filters: [aAllFilters],
                    success: function (oData) {
                        // Initialize an array to hold error messages
                        var errorMessages = [];

                        // if no changes made
                        // if (oData.results.length > 0) {

                        // }

                        // Check for duplicates and populate error messages
                        if (oData.results.length > 0) {
                            if (oData.results.some(entry => entry.Description === sDescription &&
                                entry.Client === sClient && entry.SystemId === sSystemId &&
                                entry.InstanceNo === sInstanceNumber &&
                                entry.AppServer === sApplicationServer &&
                                entry.SapRouterStr === sRouterString &&
                                entry.SapService === sService)) {
                                MessageToast.show("No changes made cancel to exit")
                                return;
                            }

                            if (oData.results.some(entry => entry.Description === sDescription && entry.Client !== sClient)) {
                                errorMessages.push("Description already exists.");
                                oView.byId("idDescriptionInput_InitialView").setValueState("Error");
                                oView.byId("idDescriptionInput_InitialView").setValueStateText("Description already exists");
                            } else {
                                oView.byId("idDescriptionInput_InitialView").setValueState("None");
                            }

                            // Show error messages if duplicates are found
                            if (errorMessages.length > 0) {
                                MessageBox.information(errorMessages.join("\n"));
                                return; // Exit the function if duplicates are found
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
                            // Update the entry in OData service
                            oModel.update("/ServiceSet('" + sClient + "')", oUpdatedData, {
                                success: function () {
                                    that.getView().byId("idConfigSapSysVbox_InitialView").setVisible(false);
                                    that.getView().byId("idBtnsVbox_InitialView").setVisible(true);
                                    sap.m.MessageToast.show("system Configuration updated successfully");
                                    that.clearInputFields(oView);
                                },
                                error: function (oError) {
                                    sap.m.MessageToast.show("Error updating data.");
                                }
                            });
                        } else {
                            MessageToast.show("Data not found")
                        }
                        that.getView().byId("idClientInput_InitialView").setEditable(false);

                    },
                    error: function (oError) {
                        MessageBox.error("Error while reading data ", oError.messagew)
                    }
                })
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
                this.getView().getModel().refresh(true)
                var oHomePage = this.getView().byId("idEnvironmentButtonsHBox_InitialView");
                oHomePage.addItem(this.getView().byId("idUpNavigationButton_InitialView"));
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
                    this.getView().byId("idDownNavigationButton_InitialView").setVisible(false); // Hide down navigation button
                } else {
                    this.getView().byId("idDownNavigationButton_InitialView").setVisible(true); // Show down navigation button
                }
                oHomePage.addItem(this.getView().byId("idDownNavigationButton_InitialView"));
            },
            onNavPrevious: function () {
                if (this.currentIndex + 3 < this.aAllButtons.length) { // Check if there are more buttons to show
                    this.currentIndex += 3; // Move to next set of buttons
                    this.updateDisplayedButtons(); // Update displayed buttons
                    this.getView().byId("idUpNavigationButton_InitialView").setVisible(true)
                } else {
                    MessageToast.show("No more Systems to display."); // Optional feedback for user
                }
            },
            onNavNext: function () {
                if (this.currentIndex - 3 >= 0) { // Check if we can go back
                    this.currentIndex -= 3; // Move to previous set of buttons
                    this.updateDisplayedButtons(); // Update displayed buttons
                    if (this.currentIndex === 0) {
                        this.getView().byId("idUpNavigationButton_InitialView").setVisible(false)
                    }
                } else {
                    MessageToast.show("No previous systems to display."); // Optional feedback for user
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
                var oResourceId = this.getView().byId("idUserInput_CS").getValue();
                var oPassword = this.getView().byId("idSPasswordInput_CS").getValue();
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/RESOURCESSet('" + oResourceId + "')", {
                    success: function (oData) {
                        if (oData.Password === oPassword) {
                            this.getOwnerComponent().getRouter().navTo("Homepage", { id: oResourceId }, true)
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
                this.oConfigSapCP ??= await this.loadFragment("ChangePassword");               
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
                    MessageToast.show("Please enter password");
                    return;
                }
                 // Check if the new passwords match
                 if (sNewPassword !== sConfirmPassword) {
                    MessageBox.error("Passwords do not match. Please try again.");
                    return;
                }
                // Read user data from model (adjust path as necessary)
                oModel.read("/RESOURCESSet('" + sResourceId + "')", {
                    success: function (oData) {
                        // Compare entered current password with stored password
                        if (oData.Password === sCurrentPassword) {
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
            },

            // New UI snippets

            AddPress_InitialView: function () {
                if (this.arrayOfButton.length > 0) {
                    MessageToast.show("Please deselect the buttons");
                    return
                }

                // Set button visibility
                this.getView().byId("idconnectsapfinishButton_InitialView").setVisible(true);
                this.getView().byId("idconnectsapeditButton_InitialView").setVisible(false);

                this.getView().byId("idConfigSapSysVbox_InitialView").setVisible(true);
                this.getView().byId("idBtnsVbox_InitialView").setVisible(false);
            },


            onBackconnectSAPPress: function () {
                this.getView().byId("idDescriptionInput_InitialView").setValue("");
                this.getView().byId("idSystemIdInput_InitialView").setValue("");
                this.getView().byId("idInstanceNumberInput_InitialView").setValue("");
                this.getView().byId("idClientInput_InitialView").setValue("");
                this.getView().byId("idApplicationServerInput_InitialView").setValue("");
                this.getView().byId("idRouterStringInput_InitialView").setValue("");
                this.getView().byId("idServiceInput_InitialView").setValue("");
                this.getView().byId("idCheckboxDescription_InitialView").setSelected(false);
                this.getView().byId("idConfigSapSysVbox_InitialView").setVisible(false);
                this.getView().byId("idBtnsVbox_InitialView").setVisible(true);
                this.getView().byId("idClientInput_InitialView").setEditable(true);

            },

            onClearconnectSAPPress: function () {
                this.getView().byId("idDescriptionInput_InitialView").setValue("");
                this.getView().byId("idSystemIdInput_InitialView").setValue("");
                this.getView().byId("idInstanceNumberInput_InitialView").setValue("");
                this.getView().byId("idClientInput_InitialView").setValue("");
                this.getView().byId("idApplicationServerInput_InitialView").setValue("");
                this.getView().byId("idRouterStringInput_InitialView").setValue("");
                this.getView().byId("idServiceInput_InitialView").setValue("");
                this.getView().byId("idCheckboxDescription_InitialView").setSelected(false);

            },

            // New UI snippets end

        })
    });
