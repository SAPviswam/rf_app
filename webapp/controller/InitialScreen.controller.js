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


                // await this.load_100_Client_Metadata();
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
                this.onSetSrcSavedInitialPageProfilePic();
            },

            //Setting the Saved Profile Pic at Initial Page only...
            onSetSrcSavedInitialPageProfilePic: async function () {
                const UserId = this.Userid;
                const oView = this.getView();
                var sEntityPath = `/APP_LOGON_DETAILSSet('${UserId}')`; // Entity path for user-specific data
                var oModel = this.getOwnerComponent().getModel();

                try {
                    const userData_Initial = await new Promise((resolve, reject) => {
                        oModel.read(sEntityPath, {
                            success: (oData) => resolve(oData),
                            error: (oError) => reject(oError)
                        });
                    });

                    // Extract the profile image from the `Profileimage` field
                    const oSavedImage = userData_Initial.Initialprofilepic;
                    // Add the Base64 prefix if missing
                    const savedImageSrc = `data:image/png;base64,${oSavedImage}`;

                    // Find all `sap.m.Avatar` controls in the view
                    var allAvatars = oView.findElements(true, function (element) {
                        return element.isA("sap.m.Avatar");
                    });

                    // Apply the stored image to each avatar
                    allAvatars.forEach(function (avatar) {
                        avatar.setSrc(savedImageSrc);
                    });
                } catch (error) {
                    //sap.m.MessageToast.show("Failed to apply profile image.");
                    console.error("Error fetching user data:", error);
                }
            },
            //Avatar Press function from INITIAL PAGE...
            onPressAvatarBtn_InitialScreen: async function (oEvent) {
                debugger;
                const userId = this.Userid;
                const oView = this.getView();
                const oComponent = this.getOwnerComponent();
                const oModel = oComponent.getModel();

                // Check if the popover is already open
                const existingPopover = oComponent.getPopover();
                if (existingPopover && existingPopover.isOpen()) {
                    return;
                }
                try {
                    sap.ui.core.BusyIndicator.show(0);
                    const oData = await new Promise((resolve, reject) => {
                        oModel.read(`/APP_LOGON_DETAILSSet('${userId}')`, {
                            success: resolve,
                            error: reject
                        });
                    });

                    // Create profile data model
                    const oProfileModel = new sap.ui.model.json.JSONModel({
                        Name: `${oData.Firstname} ${oData.Lastname}`,
                        Number: oData.Phonenumber
                    });

                    // Check if the popover is already created
                    if (!this._oProfilePopover) {
                        this._oProfilePopover = await sap.ui.core.Fragment.load({
                            name: "com.app.rfapp.fragments.InitialPageProfilePopOver",
                            controller: this
                        });
                        oView.addDependent(this._oProfilePopover);
                    }

                    // Set the model for profile data
                    this._oProfilePopover.setModel(oProfileModel, "initialProfile");
                    oComponent.setPopover(this._oProfilePopover); // Set the popover in the component
                    this._oProfilePopover.openBy(oEvent.getSource());
                    this.onSetSrcSavedInitialPageProfilePic();
                } catch (error) {
                    sap.m.MessageToast.show("User does not exist or an error occurred.");
                } finally {
                    sap.ui.core.BusyIndicator.hide();
                }
            },
            //Press Hover effect Avatar Press at Initial View...
            onPressPopoverHoverEffectAvatar_InitialPage: function () {
                var This = this;
                const oUserId = this.Userid;
                const oModel = This.getOwnerComponent().getModel();
                const oView = this.getView();
                var fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.style.display = "none";

                // Add event listener to handle the file selection
                fileInput.addEventListener("change", async (event) => {
                    var selectedFile = event.target.files[0];
                    if (selectedFile) {
                        var reader = new FileReader();

                        // Set up the onload event for FileReader
                        reader.onload = async (e) => {
                            var selectedImageBase64 = e.target.result; // Get the base64 encoded image

                            // Find all `sap.m.Avatar` controls in the view
                            var allAvatars = oView.findElements(true, function (element) {
                                return element.isA("sap.m.Avatar");
                            });
                            allAvatars.forEach(function (avatar) {
                                avatar.setSrc(selectedImageBase64);
                            });

                            // Clean the Base64 data for backend storage
                            const cleanBase64 = selectedImageBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                            const oPayload = {
                                Initialprofilepic: cleanBase64
                            };

                            try {
                                await new Promise((resolve, reject) => {
                                    oModel.update(`/APP_LOGON_DETAILSSet('${oUserId}')`, oPayload, {
                                        success: resolve,
                                        error: reject
                                    });
                                });
                                sap.m.MessageToast.show("Profile image updated successfully.");
                            } catch (oError) {
                                sap.m.MessageToast.show("Failed to update the profile image.");
                            }
                        };
                        reader.readAsDataURL(selectedFile);
                    } else {
                        sap.m.MessageToast.show("No image selected.");
                    }
                });
                fileInput.click();
            },
            //account details press for the INITIAL PAGE USER..
            onPressAccountDetails_Initial: async function () {
                const userId = this.Userid;
                const oModel1 = this.getOwnerComponent().getModel();
                try {
                    sap.ui.core.BusyIndicator.show(0); // 0ms delay for instant appearance
                    await new Promise((resolve, reject) => {
                        oModel1.read(`/APP_LOGON_DETAILSSet('${userId}')`, {
                            success: function (oData) {
                                const userDetails = oData; // Adjust this based on your data structure
                                const oUserModel_Initial = new sap.ui.model.json.JSONModel(userDetails);
                                this.getView().setModel(oUserModel_Initial, "oUserModel_Initial"); // Set the model with name
                                resolve();
                            }.bind(this), // Bind this to ensure the context is correct
                            error: function () {
                                MessageToast.show("Error loading user details");
                                reject();
                            }
                        });
                    });

                    if (!this.UserDetailsFragment_Initial) {
                        this.UserDetailsFragment_Initial = await this.loadFragment("InitialPageUserDetails");
                    }
                    this.UserDetailsFragment_Initial.open();
                    this.onSetSrcSavedInitialPageProfilePic();
                } catch (error) {
                    console.error("Error fetching user details:", error);
                } finally {
                    sap.ui.core.BusyIndicator.hide();
                }
            },
            //Upload Btn from Initial Page User Details Fragment...
            onPressUploadProfilePic_InitialPage: async function () {
                debugger
                var This = this;
                const oView1 = This.getView();
                const oModel = This.getOwnerComponent().getModel();
                const userId = this.Userid;

                var fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.style.display = "none";

                // Add event listener to handle the file selection
                fileInput.addEventListener("change", async (event) => {
                    var selectedFile = event.target.files[0];
                    if (selectedFile) {
                        var reader = new FileReader();

                        // Set up the onload event for FileReader
                        reader.onload = async (e) => {
                            var selectedImageBase64 = e.target.result; // Get the base64 encoded image
                            //localStorage.removeItem("userProfileImage");
                            var allAvatars = oView1.findElements(true, function (element) {
                                return element.isA("sap.m.Avatar");
                            });
                            allAvatars.forEach(function (avatar) {
                                avatar.setSrc(selectedImageBase64);
                            });
                            const cleanBase64 = selectedImageBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

                            const oPayload = {
                                Initialprofilepic: cleanBase64
                            };
                            await new Promise((resolve, reject) => {
                                oModel.update(`/APP_LOGON_DETAILSSet('${userId}')`, oPayload, {
                                    success: resolve,
                                    error: reject
                                });
                            });
                            sap.m.MessageToast.show("Profile image updated successfully.");
                        };
                        // Read the selected file as a Data URL (base64 string)
                        reader.readAsDataURL(selectedFile);
                    } else {
                        sap.m.MessageToast.show("Please select an image to upload.");
                    }
                });
                fileInput.click();
            },
            //Delete the Profile Pic at Initial Page(Front & Backend)...
            onPressDeleteProfilePic_InitialPage: async function () {
                debugger
                const This = this;
                const oView = This.getView();
                const oModel = This.getOwnerComponent().getModel();
                const oUserId = This.Userid;
                try {
                    sap.ui.core.BusyIndicator.show(0);
                    const sEntityPath = `/APP_LOGON_DETAILSSet('${oUserId}')`;
                    const userData = await new Promise((resolve, reject) => {
                        oModel.read(sEntityPath, {
                            success: (oData) => resolve(oData),
                            error: (oError) => reject(oError)
                        });
                    });

                    if (userData.Initialprofilepic) {
                        const oPayload = {
                            Initialprofilepic: "" // Clear the field in the backend
                        };

                        await new Promise((resolve, reject) => {
                            oModel.update(sEntityPath, oPayload, {
                                success: resolve,
                                error: reject
                            });
                        });

                        // Clear the image from UI and local storage
                        var allAvatars = oView.findElements(true, function (element) {
                            return element.isA("sap.m.Avatar");
                        });

                        // Apply the stored image to each avatar
                        allAvatars.forEach(function (avatar) {
                            avatar.setSrc("");
                        });

                        sap.m.MessageToast.show("Profile image removed successfully!");
                    } else {
                        sap.m.MessageToast.show("No profile image found to delete.");
                    }
                } catch (oError) {
                    console.error("Error deleting profile image:", oError);
                } finally {
                    sap.ui.core.BusyIndicator.hide();
                }
            },
            //Cancel the Initial Page User Details...starts here
            onPressDeclineProfileDetails_InitialPage: function () {
                if (this.UserDetailsFragment_Initial) {
                    this.UserDetailsFragment_Initial.close();
                }
                this.onPressCancelProfileDetails_InitialPage();
            },
            //Edit Btn for Profile details changing...
            onPressEditProfileDetails_InitialPage: function () {
                this.pastFirstName = this.byId("idInputTextResourceFirstname_InitialPage").getText();
                this.pastlLastName = this.byId("idInputTextResourceLastname_InitialPage").getText();
                this.pastPhonenumber = this.byId("idInputTextUserPhonenumber_InitialPage").getText();
                this.pastEmailID = this.byId("idInputTextUserEmail_InitialPage").getText();

                // Hide view-only fields and show editable input fields
                this.byId("idInputTextResourceFirstname_InitialPage").setVisible(false);
                this.byId("idInputTextResourceLastname_InitialPage").setVisible(false);
                this.byId("idInputTextUserPhonenumber_InitialPage").setVisible(false);
                this.byId("idInputTextUserEmail_InitialPage").setVisible(false);

                this.byId("idFrontandInputFirstName_InitialPage").setVisible(true).setValue(this.pastFirstName);
                this.byId("idFrontandInputLastName_InitialPage").setVisible(true).setValue(this.pastlLastName);
                this.byId("idFrontandInputPhoneNumber_InitialPage").setVisible(true).setValue(this.pastPhonenumber);
                this.byId("idFrontandInputEmail_InitialPage").setVisible(true).setValue(this.pastEmailID);

                // Toggle button visibility
                this.byId("idBtnUploadImageforProfile_InitialPage").setVisible(false);
                this.byId("idBtnDeleteImageforProfile_InitialPage").setVisible(false);
                this.byId("idBtnEditDetailsforProfile_InitialPage").setVisible(false);
                this.byId("idBtnSaveProfileDetails_InitialPage").setVisible(true);
                this.byId("idBtnCancelProfileDetails_InitialPage").setVisible(true);
            },
            onPressSaveProfileDetails_InitialPage: async function () {
                debugger
                var userId = this.Userid; // Assuming this is defined as the user ID for the current session
                var oModel = this.getOwnerComponent().getModel();

                // Get the input values
                var sFName = this.byId("idFrontandInputFirstName_InitialPage").getValue();
                var sLName = this.byId("idFrontandInputLastName_InitialPage").getValue();
                var sPhone = this.byId("idFrontandInputPhoneNumber_InitialPage").getValue();
                var sEmail = this.byId("idFrontandInputEmail_InitialPage").getValue();

                var bValid = true;

                // Check for empty or too-short values in Name field
                if (!sFName || sFName.length < 3) {
                    this.byId("idFrontandInputFirstName_InitialPage").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idFrontandInputFirstName_InitialPage").setValueStateText(sFName ? "Firstname should be at least 3 letters!" : "Firstname is required!");
                    bValid = false;
                } else {
                    this.byId("idFrontandInputFirstName_InitialPage").setValueState(sap.ui.core.ValueState.None);
                }

                if (!sLName || sLName.length < 1) {
                    this.byId("idFrontandInputLastName_InitialPage").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idFrontandInputLastName_InitialPage").setValueStateText(sLName ? "Lastname should be at least 1 letters!" : "Lastname is required!");
                    bValid = false;
                } else {
                    this.byId("idFrontandInputLastName_InitialPage").setValueState(sap.ui.core.ValueState.None);
                }

                // Check for empty or too-short values in Phone field
                var phoneRegex = /^\d{10}$/;
                if (!sPhone || sPhone.length < 3 || !phoneRegex.test(sPhone)) {
                    this.byId("idFrontandInputPhoneNumber_InitialPage").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idFrontandInputPhoneNumber_InitialPage").setValueStateText(sPhone ? "Phone number should be 10 digits!" : "Phone number is required!");
                    bValid = false;
                } else {
                    this.byId("idFrontandInputPhoneNumber_InitialPage").setValueState(sap.ui.core.ValueState.None);
                }

                // Check for empty or too-short values in Email field
                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if (!sEmail || sEmail.length < 3 || !emailRegex.test(sEmail)) {
                    this.byId("idFrontandInputEmail_InitialPage").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idFrontandInputEmail_InitialPage").setValueStateText(sEmail ? "Invalid email format!" : "Email is required!");
                    bValid = false;
                } else {
                    this.byId("idFrontandInputEmail_InitialPage").setValueState(sap.ui.core.ValueState.None);
                }

                // If any field is invalid, show an error message and return
                if (!bValid) {
                    sap.m.MessageBox.error("Please correct the highlighted errors.");
                    return;
                }


                // Retrieve all resources for validation
                var sEntityPath = `/APP_LOGON_DETAILSSet('${userId}')`;
                try {
                    sap.ui.core.BusyIndicator.show(0);
                    const currentUserData = await new Promise((resolve, reject) => {
                        oModel.read(sEntityPath, {
                            success: (oData) => resolve(oData),
                            error: (oError) => reject(oError)
                        });
                    });

                    // Check if the phone number has been changed
                    if (currentUserData.Phonenumber !== sPhone) {
                        const existingResources = await new Promise((resolve, reject) => {
                            oModel.read(`/APP_LOGON_DETAILSSet`, {
                                success: (oData) => resolve(oData.results),
                                error: (oError) => reject(oError)
                            });
                        });

                        // Check if the new phone number is already used by another resource
                        if (existingResources.some(resource => resource.Phonenumber === sPhone && resource.Userid !== userId)) {
                            sap.m.MessageBox.error("Phone number is already used. Please enter a different phone number.");
                            return;
                        }
                    }

                    // Proceed with updating the resource details
                    var sEntityPath = `/APP_LOGON_DETAILSSet('${userId}')`;
                    var oPayload = {
                        Firstname: sFName,
                        Lastname: sLName,
                        Phonenumber: sPhone,
                        Email: sEmail
                    };

                    await new Promise((resolve, reject) => {
                        oModel.update(sEntityPath, oPayload, {
                            success: resolve,
                            error: reject
                        });
                    });

                    sap.m.MessageToast.show("Profile updated successfully!");

                    // Hide buttons and show text fields
                    this.byId("idBtnSaveProfileDetails_InitialPage").setVisible(false);
                    this.byId("idBtnCancelProfileDetails_InitialPage").setVisible(false);
                    this.byId("idBtnEditDetailsforProfile_InitialPage").setVisible(true);
                    this.byId("idBtnUploadImageforProfile_InitialPage").setVisible(true);
                    this.byId("idBtnDeleteImageforProfile_InitialPage").setVisible(true);

                    this.byId("idFrontandInputFirstName_InitialPage").setVisible(false);
                    this.byId("idFrontandInputLastName_InitialPage").setVisible(false);
                    this.byId("idFrontandInputPhoneNumber_InitialPage").setVisible(false);
                    this.byId("idFrontandInputEmail_InitialPage").setVisible(false);

                    this.byId("idInputTextResourceFirstname_InitialPage").setVisible(true);
                    this.byId("idInputTextResourceLastname_InitialPage").setVisible(true);
                    this.byId("idInputTextUserPhonenumber_InitialPage").setVisible(true);
                    this.byId("idInputTextUserEmail_InitialPage").setVisible(true);
                } catch (error) {
                    sap.m.MessageToast.show("Error updating profile or fetching data.");
                } finally {
                    sap.ui.core.BusyIndicator.hide();
                }
            },
            //Cancel the Profile Details Changing...
            onPressCancelProfileDetails_InitialPage: function () {
                this.byId("idInputTextResourceFirstname_InitialPage").setText(this.pastFirstName).setVisible(true);
                this.byId("idInputTextResourceLastname_InitialPage").setText(this.pastlLastName).setVisible(true);
                this.byId("idInputTextUserPhonenumber_InitialPage").setText(this.pastPhonenumber).setVisible(true);
                this.byId("idInputTextUserEmail_InitialPage").setText(this.pastEmailID).setVisible(true);

                // Hide editable input fields
                this.byId("idFrontandInputFirstName_InitialPage").setVisible(false);
                this.byId("idFrontandInputLastName_InitialPage").setVisible(false);
                this.byId("idFrontandInputPhoneNumber_InitialPage").setVisible(false);
                this.byId("idFrontandInputEmail_InitialPage").setVisible(false);

                // Restore button visibility
                this.byId("idBtnUploadImageforProfile_InitialPage").setVisible(true);
                this.byId("idBtnDeleteImageforProfile_InitialPage").setVisible(true);
                this.byId("idBtnEditDetailsforProfile_InitialPage").setVisible(true);
                this.byId("idBtnSaveProfileDetails_InitialPage").setVisible(false);
                this.byId("idBtnCancelProfileDetails_InitialPage").setVisible(false);
            },

            //Create Resource(New User to the warehouse.)
            onPressCreateResource_InitialPage: async function () {
                if (!this.CreateResorceFragment_Initial) {
                    this.CreateResorceFragment_Initial = await this.loadFragment("InitialPageCreateResource");
                }
                this.CreateResorceFragment_Initial.open();
            },
            onPressDeclineCreateResource_InitialPage: function () {
                this.CreateResorceFragment_Initial.close();
            },
            //Create Resource (New user to warehouse)..
            oncreatesingupPress: function () {
                var oView = this.getView();
                // Retrieve values from input fields
                var sFirstName = oView.byId("idFirstnameInput").getValue();
                var sLastName = oView.byId("idLastnameInput").getValue();
                var sEmployeeNo = oView.byId("idEmployeenoInput").getValue();
                var sMobileNo = oView.byId("idMobilenoInput").getValue();
                var sEmailID = oView.byId("idEmailIDInput").getValue();
                var sResourceType = this.getSelectedResourceType(); // Method to get selected resource type
                var bValid = true;

                // Validate First Name
                if (!sFirstName || sFirstName.length < 3) {
                    this.byId("idFirstnameInput").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idFirstnameInput").setValueStateText(sFirstName ? "First name must be at least 3 characters long!" : "First name is required!");
                    bValid = false;
                } else {
                    this.byId("idFirstnameInput").setValueState(sap.ui.core.ValueState.None);
                }

                // Validate Last Name
                if (!sLastName || sLastName.length < 3) {
                    this.byId("idLastnameInput").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idLastnameInput").setValueStateText(sLastName ? "Last name must be at least 3 characters long!" : "Last name is required!");
                    bValid = false;
                } else {
                    this.byId("idLastnameInput").setValueState(sap.ui.core.ValueState.None);
                }

                // Validate Employee No
                var employeeNo = /^\d{6}$/;
                if (!sEmployeeNo || !employeeNo.test(sEmployeeNo)) {
                    this.byId("idEmployeenoInput").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idEmployeenoInput").setValueStateText(sEmployeeNo ? "Employee number should be 6 digits!" : "Employee number is required!");
                    bValid = false;
                } else {
                    this.byId("idEmployeenoInput").setValueState(sap.ui.core.ValueState.None);
                }

                // Validate Mobile Number
                var phoneRegex = /^\d{10}$/;
                if (!sMobileNo || !phoneRegex.test(sMobileNo)) {
                    this.byId("idMobilenoInput").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idMobilenoInput").setValueStateText(sMobileNo ? "Phone number must be exactly 10 digits!" : "Phone number is required!");
                    bValid = false;
                } else {
                    this.byId("idMobilenoInput").setValueState(sap.ui.core.ValueState.None);
                }

                // Validate Email
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!sEmailID || !emailRegex.test(sEmailID)) {
                    this.byId("idEmailIDInput").setValueState(sap.ui.core.ValueState.Error);
                    this.byId("idEmailIDInput").setValueStateText(sEmailID ? "Email should be like this 'xyz@xyz.com' !" : "Email is required!");
                    bValid = false;
                } else {
                    this.byId("idEmailIDInput").setValueState(sap.ui.core.ValueState.None);
                }
            
                // Show error message if invalid fields
                if (!bValid) {
                    MessageToast.show("Please correct the highlighted errors.");
                    return;
                }

                if (!sResourceType) {
                    MessageToast.show("Please select resource type!");
                    return;
                }

                const oModel = this.getView().getModel();
                // Check if Employee No already exists
                oModel.read("/RESOURCESSet", {
                    filters: [new sap.ui.model.Filter("Resourceid", sap.ui.model.FilterOperator.EQ, sEmployeeNo)],
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            MessageToast.show("Employee Number already exists. Please use a different one.");
                        } else {
                            // Create a data object for new user
                            var oDataToCreate = {
                                Resourcename: sFirstName,
                                Lname: sLastName,
                                Resourceid: sEmployeeNo,
                                Phonenumber: sMobileNo,
                                Email: sEmailID,
                                Resourcetype: sResourceType
                            };

                            // Send data to backend (adjust path as necessary)
                            oModel.create("/RESOURCESSet", oDataToCreate, {
                                success: function () {
                                    MessageBox.success("Woohoo!\nYour Request Has Been Placed");
                                    // Reset input fields
                                    oView.byId("idFirstnameInput").setValue("");
                                    oView.byId("idLastnameInput").setValue("");
                                    oView.byId("idEmployeenoInput").setValue("");
                                    oView.byId("idMobilenoInput").setValue("");
                                    oView.byId("idEmailIDInput").setValue("");
                                    oView.byId("idinternal").setSelected(false);
                                    oView.byId("idexternal").setSelected(false);
                                    oView.byId("idothers").setSelected(false);
                                    //oView.byId("dialog").close();
                                },
                                error: function () {
                                    MessageToast.show("Error creating user. Please try again.");
                                }
                            });
                        }
                    },
                    error: function () {
                        MessageToast.show("Error checking existing Employee No. Please try again.");
                    }
                });
                this.CreateResorceFragment_Initial.close();
            },
            getSelectedResourceType: function () {
                // Get selected resource type from radio buttons
                var oView = this.getView();
                if (oView.byId("idinternal").getSelected()) {
                    return "Internal";
                } else if (oView.byId("idexternal").getSelected()) {
                    return "External";
                } else if (oView.byId("idothers").getSelected()) {
                    return "Others";
                } 
            },
            //After enters some values into fileds then press on clear, it removes all fields and radio btns... 
            onPressClearsignupPress: function () {
                //this.getView().byId("idVBoxInputFields_HomeView").setVisible(true);
                //this.getView().byId("createResourceVbox").setVisible(false);
                this.byId("idFirstnameInput").setValue("");
                this.byId("idLastnameInput").setValue("");
                this.byId("idEmployeenoInput").setValue("");
                this.byId("idMobilenoInput").setValue("");
                this.byId("idEmailIDInput").setValue("");
                this.byId("idinternal").setSelected(false);
                this.byId("idexternal").setSelected(false);
                this.byId("idothers").setSelected(false);
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
            // last change here.......12-12-2024
            __onEditconnectSAPPress: function () {

                const EditCall = async function () {
                    // console.log("ERROR: ", this)
                    const oModel = this.getOwnerComponent().getModel();
                    const oPayload = this.getView().getModel("ODataModel").getProperty("/connectionData");
                    const oCheckbox = this.getView().byId("idCheckboxDescription_InitialView");
                    const sConfigPath = "/Configure_SystemSet";
                    const sRelPath = "/LogonServiceRelSet";

                    // Validation check
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
                        // Fetching required data in parallel
                        const [oConfigResponse, oRelResponse] = await Promise.all([
                            this.readData(oModel, sConfigPath),
                            this.readData(oModel, sRelPath)
                        ]);

                        const aConfigResults = oConfigResponse.results;
                        const aRelResults = oRelResponse.results;

                        // Check for existing system configuration
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

                        // Check description uniqueness
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
                            // Delete existing entry if description already exists
                            const sSelectedSysID = descriptionExists.Uuid;
                            const sDeletePath = `${sRelPath}(Userid='${this.Userid}',Uuid='${sSelectedSysID}')`;

                            await this.deleteData(oModel, sDeletePath);
                        }

                        // Create/Update Entry
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
                }.bind(this);
                const bouncedRespose = this.debounceCall(EditCall, 1000);
                bouncedRespose()
            },

            // onEditconnectSAPPress: ,
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
            onPressBtnSignoutProfilePopover_InitialPage: async function () {

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
