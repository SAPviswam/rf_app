sap.ui.define([
    "./BaseController",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/v2/ODataModel"
],
    function (Controller, Device, MessageToast, MessageBox, Filter, FilterOperator, ODataModel) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.InitialScreen", {
            onInit: async function () {

                // json model to compare the SAP connections details 
                const OData = new sap.ui.model.json.JSONModel({
                    connectionData: {
                        SystemId: "",
                        InstanceNumber: "",
                        Client: "",
                        ApplicationServer: "",
                        SaprouterString: "",
                        Description: ""
                    }
                });
                this.getView().setModel(OData, "ODataModel");


                await this.load_100_Client_Metadata();
                //this.applyStoredProfileImage();

                this.isIPhone = /iPhone/i.test(navigator.userAgent);
                this.isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent);


                this.aAllButtons = [];
                this.currentIndex = 0;
                this.arrayOfButton = [];
                this.arrayOfDescription = [];
                this.arrayOfClient = [];
                this.arryOfUuids = [];

                if (Device.system.phone) {
                    this.getView().byId("IdMainVbox_InitialView").setVisible(false);
                    this.getView().byId("idBtnsVbox_InitialView").addStyleClass("TitleMQ");
                    this.getView().byId("idConfigSapSysVbox_InitialView").addStyleClass("VboxAddConfig");
                    this.getView().byId("idTitle_InitialView").addStyleClass("titleMobile");
                }
                else if (Device.system.tablet) {
                    this.getView().byId("IdSubTitle_InitialView").addStyleClass("InitialScreenTitle");
                }

                this._handleKeyDownBound = this._handleKeyDown.bind(this);
                document.addEventListener("keydown", this._handleKeyDownBound);

                // Wait for the route pattern matched to complete
                const oRouter = this.getOwnerComponent().getRouter();
                await new Promise(resolve => {
                    oRouter.attachRoutePatternMatched(async (oEvent) => {
                        await this.onUserDetailsLoad(oEvent);
                        resolve();
                    });
                });


                // load configured systems from the backend
                await this.loadConfiguredSystems();


            },
            onUserDetailsLoad: async function (oEvent) {
                const { Userid } = oEvent.getParameter("arguments");
                this.Userid = Userid;
            },

            onExit: function () {
                // Remove the event listener when the controller is destroyed
                document.removeEventListener("keydown", this._handleKeyDownBound);
            },

            // Language Change 

            onLanguageChange: function (oEvent) {
                // Create a Busy Dialog instance
                if (!this._oBusyDialog) {
                    this._oBusyDialog = new sap.m.BusyDialog({
                        text: "Please wait while we complete your request..."
                    });
                }

                // Open the Busy Dialog
                this._oBusyDialog.open();

                // Get selected language from dropdown
                var sSelectedLanguage = oEvent.getSource().getSelectedKey();

                // Simulate a short delay (if needed, such as for model reloading or any async operation)
                setTimeout(function () {
                    // Set the new language for the core configuration
                    sap.ui.getCore().getConfiguration().setLanguage(sSelectedLanguage);

                    // Reload i18n model with the selected language
                    var oI18nModel = new sap.ui.model.resource.ResourceModel({
                        bundleName: "com.app.rfapp.i18n.i18n",
                        bundleLocale: sSelectedLanguage // Set to selected language
                    });
                    this.getView().setModel(oI18nModel, "i18n");

                    // Close the Busy Dialog
                    this._oBusyDialog.close();
                }.bind(this), 700);
            },


            load_100_Client_Metadata: function () {
                var oModel = new ODataModel("/sap/opu/odata/sap/ZEWM_RFUI_SRV_01/", {
                    headers: {
                        "Authorization": "Basic " + btoa("sreedhars:Sreedhar191729"),
                        "sap-client": "100"
                    }
                });
                this.getView().setModel(oModel);
            },
            _handleKeyDown: function (oEvent) {
                // Prevent default action for specific function keys
                if (["F1", "F2", "F4"].includes(oEvent.key)) {
                    oEvent.preventDefault(); // Prevent default browser actions

                    // Check if the active page is the InitialScreen
                    var activePageId = this.getView().getId();
                    var toolPageId = "container-com.app.rfapp---InitialScreen";
                    if (activePageId === toolPageId) {
                        // Perform actions based on the key pressed
                        switch (oEvent.key) {
                            case "F1":
                                this.AddPress_InitialView();
                                break;
                            case "F2":
                                this.onEditConfiguredSystem();
                                break;
                            case "F4":
                                this.onDeleteConfiguredSystem();
                                break;
                        }
                    }
                }
            },
            LoadSapLogon: async function () {

                // Load the fragment if it hasn't been loaded yet
                this.oConfigSap ??= await this.loadFragment("SapLogon");

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

            onFinishconnectSAPPress: async function (oEvent) {
                const oView = this.getView(),
                    oPayload = this.getView().getModel("ODataModel").getProperty("/connectionData"),
                    oCheckbox = oView.byId("idCheckboxDescription_InitialView"),
                    oButton = oEvent.getSource()
                oButton.setEnabled(false);

                // Validation Logic
                const validationErrors = [];
                const validateField = (fieldId, value, regex, errorMessage) => {
                    const oField = oView.byId(fieldId);
                    if (!value || (regex && !regex.test(value))) {
                        oField.setValueState("Error");
                        oField.setValueStateText(errorMessage);
                        validationErrors.push(errorMessage);
                    } else {
                        oField.setValueState("None");
                    }
                };

                validateField("idSystemIdInput_InitialView", oPayload.SystemId, /^\w{3}$/, "System ID must be a 3-character value");
                validateField("idInstanceNumberInput_InitialView", oPayload.InstanceNumber, /^\d{2}$/, "Instance Number must be a 2-digit numeric value");
                validateField("idClientInput_InitialView", oPayload.Client, /^\d{3}$/, "Client ID must be a 3-digit numeric value");
                validateField("idApplicationServerInput_InitialView", oPayload.ApplicationServer, null, "Application Server is required");

                if (!oCheckbox.getSelected()) {
                    validateField(
                        "idDescriptionInput_InitialView",
                        oPayload.Description,
                        null,
                        "Description is mandatory when checkbox is not selected"
                    )
                } else {
                    oView.byId("idDescriptionInput_InitialView").setValueState("None");
                }

                if (validationErrors.length > 0) {
                    MessageToast.show("Please enter correct data");
                    oButton.setEnabled(true);
                    return;
                }

                const oModel = this.getOwnerComponent().getModel(),      // Get the OData model                     
                    sPath = "/Configure_SystemSet";
                try {
                    // Check for existing combinations in Configure_SystemSet
                    const oResponse = await this.readData(oModel, sPath),
                        aResults = oResponse.results
                    const configCombinationExists = aResults.find(
                        (obj) => obj.SystemId === oPayload.SystemId &&
                            obj.InstanceNumber === oPayload.InstanceNumber &&
                            obj.Client === oPayload.Client &&
                            obj.ApplicationServer === oPayload.ApplicationServer);

                    if (configCombinationExists) {
                        const sConnectionId = configCombinationExists.Uuid,
                            sCurreUserId = this.Userid,
                            oCurreUserId = new Filter("Userid", FilterOperator.EQ, sCurreUserId),
                            sUsersRelPath = "/LogonServiceRelSet",
                            aCheckFilters = new sap.ui.model.Filter({
                                filters: [oCurreUserId]
                            });
                        try {
                            // check if user already configured or not and desscription is different
                            const oCheckResponse = await this.readData(oModel, sUsersRelPath, aCheckFilters),
                                aCheckResult = oCheckResponse.results;
                            // Check for UserId and Uuid combination
                            const combinationExists = aCheckResult.find(
                                (obj) => obj.Userid === sCurreUserId && obj.Uuid === sConnectionId);
                            // Check for Description
                            const descriptionExists = aCheckResult.some(
                                (obj) => obj.Description.toLowerCase() === oPayload.Description.toLowerCase()
                            );
                            if (combinationExists) {
                                sap.m.MessageBox.information(`Oops...Please check this system is already configured with description as ${combinationExists.Description}`)
                                return;
                            }

                            if (descriptionExists) {
                                sap.m.MessageToast.show("Description Already taken")
                                this.getView().byId("idDescriptionInput_InitialView").setValueState("Error");
                                this.getView().byId("idDescriptionInput_InitialView").setValueStateText("Description must be unique");
                                return;
                            } else {
                                this.getView().byId("idDescriptionInput_InitialView").setValueState("None");
                            }

                            if (!combinationExists && !descriptionExists) {
                                const oUserCOnfigPayload = {
                                    Userid: sCurreUserId,
                                    Uuid: sConnectionId,
                                    Description: (oCheckbox.getSelected() ? (oPayload.SystemId + " / " + oPayload.Client) : oPayload.Description)
                                }
                                try {
                                    const oCreateResp = await this.createData(oModel, oUserCOnfigPayload, sUsersRelPath)
                                    sap.m.MessageToast.show("Configured system saved successfully.");
                                    window.location.reload();
                                } catch (error) {
                                    sap.m.MessageBox.error("Oops...Creation failed Give another try")
                                    oButton.setEnabled(true);
                                    console.error("CREATION ERROR: " + error);
                                }
                            } else {
                                sap.m.MessageBox.error("Oops...Something went wrong please try with different data")
                            }
                        } catch (error) {
                            sap.m.MessageToast.show("something went wrong technical issue");
                            oButton.setEnabled(true);
                            console.error("Error: " + error);
                        }
                    } else {
                        sap.m.MessageBox.information("Entered system not found")
                    }
                    oButton.setEnabled(true);
                } catch (error) {
                    sap.m.MessageToast.show("something went wrong technical issue")
                    oButton.setEnabled(true);
                    console.error(error);
                }
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
                // Check if the button is already selected
                if (this.arrayOfButton.length >= 1) {
                    if (oButton.hasStyleClass("buttonSelected")) {
                        // Deselect the button
                        oButton.removeStyleClass("buttonSelected");
                        oButton.addStyleClass("customButtonBackground");

                        this.arrayOfButton = this.arrayOfButton.filter(item => item !== oButton);
                        this.arrayOfClient = this.arrayOfClient.filter(item => item !== Client);
                        this.arrayOfDescription = this.arrayOfDescription.filter(item => item !== description);
                        // this.arryOfUuids = this.arryOfUuids.filter(item => item !== sUuid);


                    } else {
                        // Select the button
                        this.arrayOfButton.push(oButton);
                        oButton.removeStyleClass("customButtonBackground");
                        oButton.addStyleClass("buttonSelected");

                        this.arrayOfClient.push(Client);
                        this.arrayOfDescription.push(description);
                    }
                } else {
                    // First button press
                    this.arrayOfButton.push(oButton);
                    oButton.addStyleClass("buttonSelected"); // Set to selected
                    oButton.removeStyleClass("customButtonBackground");

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
            onDeleteConfiguredSystem: async function () {
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
                    onClose: async function (status) {
                        if (status === MessageBox.Action.DELETE) {
                            // last change here....Delete the selected system

                            try {
                                const oFilters = new sap.ui.model.Filter({
                                    filters: [
                                        new sap.ui.model.Filter("Userid", sap.ui.model.FilterOperator.EQ, this.Userid),
                                        new sap.ui.model.Filter({
                                            filters: this.arrayOfDescription.map(function (sDescription) {
                                                return new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.EQ, sDescription);
                                            }),
                                            and: false
                                        })
                                    ],
                                    and: true
                                }),
                                    // Read and get the data
                                    sPath = "/LogonServiceRelSet",
                                    aDelUuidArray = [],
                                    oModel = this.getOwnerComponent().getModel(),
                                    oReadResponse = await this.readData(oModel, sPath, oFilters),
                                    aReadResults = oReadResponse.results;
                                aReadResults.forEach((element) => {
                                    aDelUuidArray.push(element.Uuid)
                                });

                                // batch delete
                                var url = this.getOwnerComponent().getModel().sServiceUrl;
                                var oDataModel = new sap.ui.model.odata.ODataModel(url);
                                var batchChanges = [];
                                var that = this;

                                aDelUuidArray.forEach(async (sUUID) => {
                                    // await this.deleteData(oModel, `${sPath}(Userid='${this.Userid}',Uuid='${sUUID}')`, batchGroupId)
                                    batchChanges.push(oDataModel.createBatchOperation(`${sPath}(Userid='${this.Userid}',Uuid='${sUUID}')`, "DELETE"));
                                });

                                oDataModel.addBatchChangeOperations(batchChanges);
                                oDataModel.submitBatch(async function (oData, oResponse) {
                                    // Success callback function
                                    if (oResponse.statusCode === "202" || oResponse.statusCode === 202) {
                                        sap.m.MessageToast.show("Selected systems deleted successfully");

                                        // test
                                        // Remove selected the buttons from the UI
                                        var oHomePage = that.getView().byId("idEnvironmentButtonsHBox_InitialView");
                                        that.arrayOfButton.forEach(async (currentButton) => {
                                            oHomePage.removeItem(currentButton); // Remove the selected button
                                            var index = that.aAllButtons.indexOf(currentButton);
                                            if (index !== -1) {
                                                that.aAllButtons.splice(index, 1); // Remove button from array
                                            }
                                            // Clear selection
                                            currentButton = null;
                                            await that.updateDisplayedButtons()
                                            var index = that.aAllButtons.indexOf(currentButton);
                                            if (index !== -1) {
                                                that.aAllButtons.splice(index, 1); // Remove button from array
                                            }
                                            // Clear selection
                                            currentButton = null;
                                        })


                                        that.arrayOfButton.forEach(element => {
                                            element.setType("Unstyled")
                                        });
                                        that.arrayOfButton = [];
                                        that.arrayOfClient = [];
                                        that.arrayOfDescription = [];
                                        that.updateDisplayedButtons();
                                        // test

                                    }
                                    // Handle the response data
                                    await that.loadConfiguredSystems();

                                }, function (oError) {
                                    // Error callback function
                                    sap.m.MessageBox.success("Delete failed batch operation failed");
                                });

                            } catch (error) {
                                sap.m.MessageToast.show("Facing technical issue")
                                console.error("Error: " + error);
                            }
                        } else {
                            MessageToast.show("Deletion cancelled.");
                            this.selectedButton = null;
                            this.arrayOfButton.forEach(oButton => {
                                oButton.removeStyleClass("buttonSelected");
                                oButton.addStyleClass("customButtonBackground");
                            });
                            this.arrayOfButton = [];
                            this.arrayOfClient = [];
                            this.arrayOfDescription = [];

                        }
                    }.bind(that) // Bind the controller context
                });
            },
            // onDeleteConfiguredSystems: function () {
            //     if (this.arrayOfButton < 1) {
            //         MessageToast.show("Please select atleast one system to delete");
            //         return;
            //     }

            //     var that = this; // Store reference to 'this' for use in callbacks

            //     if (this.arrayOfDescription.length > 1) {
            //         var oString = this.arrayOfDescription.length
            //     }
            //     else {
            //         var oString = this.arrayOfDescription[0];
            //     }

            //     MessageBox.warning(`Are you sure want to delete the ${oString} selected system?`, {
            //         title: "Delete",
            //         actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
            //         onClose: function (status) {
            //             if (status === MessageBox.Action.DELETE) {
            //                 this.arrayOfButton.forEach(element => {
            //                 });
            //                 // Delete from OData service
            //                 var oModel = this.getOwnerComponent().getModel(); // Get the OData model
            //                 this.arrayOfClient.forEach(element => {
            //                     var sPath = "/ServiceSet('" + element + "')";
            //                     oModel.remove(sPath, {
            //                         success: function () {
            //                             MessageToast.show("Configured system deleted successfully.");

            //                             // Remove selected the buttons from the UI
            //                             debugger
            //                             var oHomePage = that.getView().byId("idEnvironmentButtonsHBox_InitialView");
            //                             that.arrayOfButton.forEach((currentButton) => {
            //                                 oHomePage.removeItem(currentButton); // Remove the selected button
            //                                 var index = that.aAllButtons.indexOf(currentButton);
            //                                 if (index !== -1) {
            //                                     that.aAllButtons.splice(index, 1); // Remove button from array
            //                                 }
            //                                 // Clear selection
            //                                 currentButton = null;
            //                                 that.updateDisplayedButtons()
            //                                 var index = that.aAllButtons.indexOf(currentButton);
            //                                 if (index !== -1) {
            //                                     that.aAllButtons.splice(index, 1); // Remove button from array
            //                                 }
            //                                 // Clear selection
            //                                 currentButton = null;
            //                             })


            //                             that.arrayOfButton.forEach(element => {
            //                                 element.setType("Unstyled")
            //                             });
            //                             that.arrayOfButton = [];
            //                             that.arrayOfClient = [];
            //                             that.arrayOfDescription = [];
            //                             that.updateDisplayedButtons();
            //                         }.bind(that), // Ensure 'this' context is correct
            //                         error: function (oError) {
            //                             console.error(oError);
            //                             MessageToast.show("Error deleting configured system.");
            //                             that.arrayOfButton.forEach(element => {
            //                                 element.setType("Unstyled")
            //                             });
            //                             that.arrayOfButton = [];
            //                             that.arrayOfClient = [];

            //                             that.arrayOfDescription = [];

            //                         }
            //                     });
            //                 });
            //             } else {
            //                 MessageToast.show("Deletion cancelled.");
            //                 this.selectedButton = null;
            //                 this.arrayOfButton.forEach(oButton => {
            //                     oButton.removeStyleClass("buttonSelected");
            //                     oButton.addStyleClass("customButtonBackground");
            //                 });
            //                 this.arrayOfButton = [];
            //                 this.arrayOfClient = [];
            //                 this.arrayOfDescription = [];
            //             }
            //         }.bind(that) // Bind the controller context
            //     });
            // },
            onEditConfiguredSystem: async function () {
                // Validate user selection
                const selectedButtons = this.arrayOfButton;
                if (selectedButtons.length !== 1) {
                    MessageToast.show(
                        selectedButtons.length > 1
                            ? "Please select only one system to edit"
                            : "Please select at least one system to edit"
                    );
                    return;
                }

                const sButtonDescription = selectedButtons[0]?.mProperties?.text; // Assume one button is selected
                this.isEditButtonPressed = true;

                // Update button visibility
                const oView = this.getView();
                oView.byId("idconnectsapfinishButton_InitialView").setVisible(false);
                oView.byId("idconnectsapeditButton_InitialView").setVisible(true);

                const oModel = this.getOwnerComponent().getModel(),
                    sPath = "/LogonServiceRelSet",
                    oCheckbox = this.getView().byId("idCheckboxDescription_InitialView"),
                    sCurrentUserId = this.Userid;

                try {
                    // Fetch user-specific system descriptions
                    const oResponse = await this.readData(oModel, sPath),
                        aResults = oResponse.results;

                    const userDescriptionExists = aResults.find(
                        (obj) => obj.Userid === sCurrentUserId && obj.Description === sButtonDescription
                    );

                    if (!userDescriptionExists) {
                        MessageToast.show("Reading description failed");
                        return;
                    }

                    const sSelectedSysID = userDescriptionExists.Uuid,
                        sSysPath = "/Configure_SystemSet";

                    this.sDescription = userDescriptionExists.Description;

                    try {
                        // Fetch system details for the selected UUID
                        const oSysResponse = await this.readData(oModel, sSysPath),
                            aSysResults = oSysResponse.results;

                        const sSysUuidExists = aSysResults.find((obj) => obj.Uuid === sSelectedSysID);

                        if (!sSysUuidExists) {
                            MessageToast.show("Reading selected system failed");
                            return;
                        }

                        // Show connection data
                        oView.getModel("ODataModel").setProperty("/connectionData", {
                            SystemId: sSysUuidExists.SystemId,
                            InstanceNumber: sSysUuidExists.InstanceNumber,
                            Client: sSysUuidExists.Client,
                            ApplicationServer: sSysUuidExists.ApplicationServer,
                            SaprouterString: sSysUuidExists.SaprouterString,
                            Description: ""
                        });
                        if (this.sDescription === `${sSysUuidExists.SystemId} / ${sSysUuidExists.Client}`) {
                            oCheckbox.setSelected(true);
                        }

                        // Update visibility of sections
                        oView.byId("idConfigSapSysVbox_InitialView").setVisible(true);
                        oView.byId("idBtnsVbox_InitialView").setVisible(false);

                    } catch (error) {
                        MessageToast.show("Error while reading selected system. Try again later.");
                        console.error("Error: ", error);
                    }
                } catch (error) {
                    MessageToast.show("Something went wrong. Facing a technical issue.");
                    console.error("Error: ", error);
                }
            },

            onEditconnectSAPPress: async function () {
                const oModel = this.getOwnerComponent().getModel(),
                    oPayload = this.getView().getModel("ODataModel").getProperty("/connectionData"),
                    oCheckbox = this.getView().byId("idCheckboxDescription_InitialView"),
                    sConfigPath = "/Configure_SystemSet",
                    sRelPath = "/LogonServiceRelSet";

                // Validation
                for (let key in oPayload) {
                    if (!oPayload[key] && key !== "SaprouterString") {
                        if (key === "Description" && !oCheckbox.getSelected()) {
                            sap.m.MessageToast.show(`${key} is required`);
                            return;
                        }
                        if (key !== "Description") {
                            sap.m.MessageToast.show(`${key} is required`);
                            return;
                        }
                    }
                }

                try {
                    //  Fetch All Required Data in Parallel
                    const [oConfigResponse, oRelResponse] = await Promise.all([
                        this.readData(oModel, sConfigPath),
                        this.readData(oModel, sRelPath)
                    ]);
                    const aConfigResults = oConfigResponse.results;
                    const aRelResults = oRelResponse.results;

                    //  Check for Existing System Configuration
                    const configCombinationExists = aConfigResults.find(
                        obj =>
                            obj.SystemId === oPayload.SystemId &&
                            obj.InstanceNumber === oPayload.InstanceNumber &&
                            obj.Client === oPayload.Client &&
                            obj.ApplicationServer === oPayload.ApplicationServer
                    );

                    if (!configCombinationExists) {
                        sap.m.MessageBox.information("Ooops entered system not found");
                        return;
                    }

                    const sUpdatedSysID = configCombinationExists.Uuid;

                    //  Check Description Uniqueness
                    const descriptionExists = aRelResults.find(
                        obj => obj.Userid === this.Userid && obj.Description === this.sDescription
                    );

                    const isDescriptionUnique = !aRelResults.some(
                        obj => obj.Userid === this.Userid && obj.Description.toLowerCase() === oPayload.Description.toLowerCase()
                    );

                    if (!isDescriptionUnique) {
                        sap.m.MessageToast.show("Description must be unique");
                        return;
                    }

                    if (descriptionExists) {
                        //  Delete Existing Entry
                        const sSelectedSysID = descriptionExists.Uuid;
                        const sDeletePath = `${sRelPath}(Userid='${this.Userid}',Uuid='${sSelectedSysID}')`;

                        await this.deleteData(oModel, sDeletePath);
                    }

                    //  Create/Update Entry
                    const oUserUpdatedPayload = {
                        Userid: this.Userid,
                        Uuid: sUpdatedSysID,
                        Description: oCheckbox.getSelected() ? `${oPayload.SystemId} / ${oPayload.Client}` : oPayload.Description
                    };

                    await this.createData(oModel, oUserUpdatedPayload, sRelPath);
                    sap.m.MessageToast.show("Updated Successfully");
                    window.location.reload();
                } catch (error) {
                    sap.m.MessageToast.show("Operation failed due to a technical issue");
                    console.error("ERROR: ", error);
                }
            },

            onToggleButtonPress: function (oEvent) {
                const oButton = oEvent.getSource();
                // Toggle the selected state
                oButton.setPressed(!oButton.getPressed());
            },

            // Load configured systems from OData service and display them in the UI
            // first read the relation table to get the configured systems based on User ID 
            // take the configured systems UUID into an array next read the actual systems table and show it in UI

            loadConfiguredSystems: async function () {

                if (!this._loadingSysDialog) {
                    this._loadingSysDialog = new sap.m.BusyDialog({
                        text: "Please wait while Loading configured systems"
                    });
                }
                // Open the Busy Dialog
                this._loadingSysDialog.open();

                const oModel = this.getOwnerComponent().getModel(),// Get the OData model                 
                    sPath = "/LogonServiceRelSet",
                    sCurrentUser = this.Userid,
                    aFilters = new sap.ui.model.Filter("Userid", sap.ui.model.FilterOperator.EQ, sCurrentUser);
                try {
                    // Simulate buffer using setTimeout
                    await new Promise((resolve) => setTimeout(resolve, 2000));

                    const oResponse = await this.readData(oModel, sPath, aFilters),
                        oResults = oResponse.results;
                    if (oResults.length > 0) {

                        this.aAllButtons = []; // Reset the array
                        // Store all button instances
                        for (var i = 0; i < oResults.length; i++) {
                            var system = oResults[i]; // Get the current system
                            var oNewButton = new sap.m.Button({
                                text: system.Description,
                                type: "Unstyled",
                                width: "11rem",
                            });
                            // Attach single click event for CRUD operations
                            oNewButton.attachPress(this.onConfiguredSystemButtonPress.bind(this, oNewButton, system.Description, system.SystemId, system.Client));

                            oNewButton.addStyleClass("customButtonBackground");
                            // Attach double click event for opening SAP logon
                            oNewButton.attachBrowserEvent("dblclick", function () {
                                this.LoadSapLogon();
                            }.bind(this));
                            // Store the button in the array
                            this.aAllButtons.push(oNewButton);
                        }
                        // Load initial set of buttons
                        this.updateDisplayedButtons();

                    } else {
                        sap.m.MessageBox.information("No configured systems found")
                    }
                } catch (error) {
                    sap.m.MessageToast.show("Something went wrong please try again later...")
                    console.error("Error:" + error);
                } finally {
                    // Close the Busy Dialog
                    this._loadingSysDialog.close();
                }
            },
            onSignoutPress: async function () {

                // Create a Busy Dialog instance
                if (!this._oSignOutBusyDialog) {
                    this._oSignOutBusyDialog = new sap.m.BusyDialog({
                        text: "Signing out..."
                    });
                }
                // clear local storage 
                localStorage.removeItem('loginData');

                // Open the Busy Dialog
                this._oSignOutBusyDialog.open();
                this.getView().byId("idEnvironmentButtonsHBox_InitialView").removeAllItems();
                try {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("ConfigLogin", {}, true);

                } catch (error) {
                    console.error("Error: " + error);

                } finally {
                    this._oSignOutBusyDialog.close();
                }
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
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/RESOURCESSet('" + oResourceId + "')", {
                    success: function (oData) {
                        if (oData.Password === oPassword) {
                            if (oData.Loginfirst) {
                                // Open the password change dialog
                                this.onChangePasswordBtn(oResourceId);
                            }
                            else {
                                this.getOwnerComponent().getRouter().navTo("Homepage", { id: oResourceId, idI: that.Userid }, true)
                                window.location.reload(true);
                            }
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
                var oModel = this.getOwnerComponent().getModel(); // Get your OData model
                // Read user data based on Resource ID
                const that = this
                oModel.read("/RESOURCESSet('" + sResourceId + "')", {
                    success: function (oData) {
                        // Assuming 'Resourcename' is the property that holds the resource name
                        var sResourceName = oData.Resourcename; // Adjust property name as necessary
                        that.byId("idUserInput_CP").setValue(sResourceName); // Set the resource name in the input field
                        that.onUserLogin();
                        that.oConfigSapCP.open(); // Open the dialog after setting the value
                        that.onPressCancleSapLogon();
                    }.bind(this), // Bind 'this' to maintain context
                    error: function () {
                        MessageBox.information("No user found.");
                    }

                });
            },
            onChangePasswordPress: function () {
                var oView = this.getView();
                var sCurrentPassword = oView.byId("idSPasswordInput_CP").getValue();
                var sNewPassword = oView.byId("idNewPasswordInput_CP").getValue();
                var sConfirmPassword = oView.byId("idRepeatPasswordInput_CP").getValue();
                var oModel = this.getOwnerComponent().getModel(); // Get your model
                var sResourceId = this.sResourceID;
                var that = this
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
                                Password: sNewPassword,
                                Loginfirst: false // Use an object to set the new password
                            }, {
                                success: function () {
                                    MessageToast.show("Password updated successfully!");
                                    oView.byId("idSPasswordInput_CP").setValue("");
                                    oView.byId("idNewPasswordInput_CP").setValue("");
                                    oView.byId("idRepeatPasswordInput_CP").setValue("");
                                    that.onPressCancleSapLogonInChangePassword();
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
                const oView = this.getView(),
                    oFormData = oView.getModel("ODataModel").setProperty("/connectionData", {});

                const SetValueStates = (fieldId) => {
                    const oField = oView.byId(fieldId);
                    oField.setValueState("None");
                };
                SetValueStates("idDescriptionInput_InitialView")
                SetValueStates("idSystemIdInput_InitialView")
                SetValueStates("idInstanceNumberInput_InitialView")
                SetValueStates("idClientInput_InitialView")
                SetValueStates("idApplicationServerInput_InitialView")
                SetValueStates("idRouterStringInput_InitialView")
                SetValueStates("idServiceInput_InitialView")

                this.getView().byId("idCheckboxDescription_InitialView").setSelected(false);
                this.getView().byId("idConfigSapSysVbox_InitialView").setVisible(false);
                this.getView().byId("idBtnsVbox_InitialView").setVisible(true);
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
            onHelpconnectsapDialog: function () {


                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("HelpTourOnEditConfigSAPSystem");






                // var filepath = "/webapp/docs/How%20to%20Edit%20SAP%20Configure%20System.pdf";
                // var link = document.createElement("a");
                // link.href = filepath;
                // link.download = "How to Edit SAP Configure System.pdf"
                // link.click();
                // MessageToast.show("File Downloaded");
            }

            // New UI snippets end

        })
    });
