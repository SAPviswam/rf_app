

sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "sap/ui/Device",
    "sap/ui/core/UIComponent"

],
    function (Controller, MessageBox, MessageToast, BusyIndicator, Device,UIComponent) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.Home", {
            onInit: function () {
                this.isIPhone = /iPhone/i.test(navigator.userAgent);
                this.isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent);
                console.log(this.isTablet)

                this.bOtpVerified = false;
                const huValue = localStorage.getItem("warehouseNo");
                const userIdValue = localStorage.getItem("resource");

                if (huValue) {
                    this.byId("idHUInput").setValue(huValue);
                }
                if (userIdValue) {
                    this.byId("idUserIDInput").setValue(userIdValue);
                }
                // var sUsername = localStorage.getItem("username");
                // var sPassword = localStorage.getItem("password");
                // var bAutoSave = localStorage.getItem("autoSave") === "true";

                // if (sUsername) {
                //     this.getView().byId("idUserIDInput").setValue(sUsername);
                // }
                // if (sPassword) {
                //     this.getView().byId("idPasswordInput").setValue(sPassword);
                // }
                //     this.getView().byId("idButtonSignUpcheckbox").setSelected(bAutoSave);

                //                 var savedResourceID = localStorage.getItem("resourceID");
                //                 var savedPassword = localStorage.getItem("password");

                //                 if (savedResourceID) {
                //                     this.byId("idUserIDInput").setValue(savedResourceID);
                //                 }
                //                 if (savedPassword) {
                //                     this.byId("idPasswordInput").setValue(savedPassword);
                //                 }
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onInitialDetailsLoad, this);

                if (Device.system.phone) {
                    if (this.isIPhone) {
                        // Targeting iPhones (common pixel density for Retina displays and screen width)
                        this.byId("idImageLogoAvatarHome").setWidth("42.5%");
                        this.byId("idImageLogoAvatarHome").setHeight("45.5%");
                        this.byId("idImageLogoAvatarHome").addStyleClass("iphoneMarginLeft");
                        // this.byId("initialscreentitle").setMarginRight("25%")

                    } 
                    else {
                        // Non-iPhone phones
                        // this.byId("idImageLogoAvatarHome").setWidth("85%");
                        // this.byId("idImageLogoAvatarHome").setHeight("35%");
                    }
                }
                else if (Device.system.tablet) {
                    this.byId("environmentButtonsHBoxHome").setWidth("40%");
                }
                else{
                    this.byId("environmentButtonsHBoxHome").setWidth("23%");
                }

            },
            onSelectCheckBox: function (oEvent) {
                const isSelected = oEvent.getParameter("selected");

                if (isSelected) {
                    // Save the current input values to localStorage
                    const huInput = this.byId("idHUInput").getValue();
                    const userIdInput = this.byId("idUserIDInput").getValue();

                    localStorage.setItem("warehouseNo", huInput);
                    localStorage.setItem("resource", userIdInput);

                    MessageToast.show("Auto Save enabled. Your details will be saved.");
                } else {
                    // Optionally clear the saved values if unchecked
                    localStorage.removeItem("warehouseNo");
                    localStorage.removeItem("resource");

                    MessageToast.show("Auto Save disabled. Your details will not be saved.");
                }
            },
            onInitialDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
                var oUserId = this.getView().byId("idUserIDInput").setValue(this.ID)
                oUserId.setEditable(false)
            },
            //             onPressAutoSaveBtn: function (oEvent) {
            //                 var isChecked = oEvent.getParameter("selected");

            //                 if (isChecked) {
            //                     // Save details when checked
            //                     var resourceID = this.byId("idUserIDInput").getValue();
            //                     var password = this.byId("idPasswordInput").getValue();

            //                     // Store data in local storage
            //                     localStorage.setItem("resourceID", resourceID);
            //                     localStorage.setItem("password", password);
            //                 } else {
            //                     // Optionally, handle when unchecked (e.g., clear saved data)
            //                     localStorage.removeItem("resourceID");
            //                     localStorage.removeItem("password");
            //                 }
            //             },
            onLoginPress: async function () {
                var oView = this.getView();

                // Retrieve values from input fields
                var sWarehouseNumber = oView.byId("idHUInput").getValue();
                var sResourceId = oView.byId("idUserIDInput").getValue();
                var sPassword = oView.byId("idPasswordInput").getValue();

                var bAutoSave = this.getView().byId("idButtonSignUpcheckbox").getSelected();
                if (bAutoSave) {
                    localStorage.setItem("username", sResourceId);
                    localStorage.setItem("password", sPassword);
                    localStorage.setItem("autoSave", "true");
                } else {
                    // Clear stored credentials if auto-save is unchecked
                    localStorage.removeItem("username");
                    localStorage.removeItem("password");
                    localStorage.removeItem("autoSave");
                }

                // Perform validation checks
                if (!sWarehouseNumber) {
                    MessageToast.show("Please enter the Warehouse Number.");
                    return;
                }
                if (!sResourceId) {
                    MessageToast.show("Please enter the Resource ID.");
                    return;
                }
                if (!sPassword) {
                    MessageToast.show("Please enter the Password.");
                    return;
                }

                // Special case for Resource ID 111010 and Password ARTIHCUS
                // if (sResourceId === "111010" && sPassword === "ARTIHCUS") {
                //     this.getRouter().navTo("Supervisor");
                //     return;
                // }

                // Get the model from the component
                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                try {
                    // Make the API call to check if the resource exists
                    await oModel.read("/RESOURCESSet('" + sResourceId + "')", {
                        success: function (oData) {
                            // Validate the returned Resource ID and Password
                            if (oData.Resourceid === sResourceId && oData.Password === sPassword) {

                                // Check if the user is logging in for the first time
                                if (oData.Loginfirst === true) {
                                    sap.m.MessageToast.show("Welcome! It seems this is your first login.");
                                    that.sample(); // Your custom logic for first-time login
                                } else {
                                    sap.m.MessageToast.show("Welcome back!");

                                    // NOTE: just uncomment below code for buffering effect for resource login  

                                    // BusyIndicator.show(3);
                                    // setTimeout(function () {
                                    //     // Navigate to another page (user page)
                                    //     var oRouter = that.getOwnerComponent().getRouter();
                                    //     oRouter.navTo("RouteResourcePage", { id: sResourceId });
                                    //     BusyIndicator.hide();
                                    //   }.bind(this), 2000);

                                    // Navigate to the ResourcePage with the correct ID


                                    let oUser = oData.Users.toLowerCase();

                                    if (oUser === "supervisor") {

                                        that.getRouter().navTo("Supervisor", { id: sResourceId });
                                    }
                                    else {
                                        that.getRouter().navTo("RouteResourcePage", { id: sResourceId });
                                    }

                                }

                            } else {
                                // If password doesn't match, show an error message
                                MessageToast.show("Invalid Resource ID or Password.");
                            }
                        }.bind(this),
                        error: function () {
                            MessageToast.show("User does not exist.");
                        }
                    });
                } catch (error) {
                    MessageToast.show("An error occurred while checking the user.");
                }
            },
            _onUserDetailsFetched: function (oData) {
                // Assuming oData contains username, email, and phone number
                var oUserDetails = {
                    username: oData.username,
                    email: oData.email,
                    mobileno: oData.mobileno
                };

                // Set the user details to a model for binding in the view
                var oUserModel = new sap.ui.model.json.JSONModel(oUserDetails);
                this.getView().setModel(oUserModel, "userDetails");
            },

            onClearPress: function () {
                var oView = this.getView();
                oView.byId("idUserIDInput").setValue("");
                oView.byId("idPasswordInput").setValue("");
            },
            //-------------------------------------------------------------------------- Signup logic--------------------------------------------------------------------------
            /*Loading Signup Fragment */
            onPressSignupBtn: async function () {
                this.oSignupForm ??= await this.loadFragment({
                    name: "com.app.rfapp.fragments.SignUpDetails"
                })
                this.oSignupForm.open();
            },
            /*Close Signup Form */
            oncancelsignupPress: function () {
                this.oSignupForm.close();
            },

            onVerify: function () {
                // Get the phone number from the input field
                var sPhoneNumber = this.byId("idInputPhoneNumber").getValue();

                // Basic validation to ensure the phone number is entered
                if (!sPhoneNumber) {
                    sap.m.MessageToast.show("Please enter a valid phone number.");
                    return;
                }
                this.OnGenereateOTP(sPhoneNumber);
                this.byId("idOtpInput").setVisible(true);
            },
            handleEscape: function () {
                // Handle the escape key event if necessary
                this.byId("idOtpDialog").close();
            },
            onSubmitOtp: function () {
                var oMobileinput = this.byId("idInputPhoneNumber")
                var oOtpInput = this.byId("idOtpInput");
                var oVerfied = this.byId("verficationId");
                var oGetotp = this.byId("VerifyButton");
                var sEnteredOtp = oOtpInput.getValue();

                // Reset the ValueState and ValueStateText before validation
                oOtpInput.setValueState(sap.ui.core.ValueState.None);
                oOtpInput.setValueStateText("");

                // Basic validation: Check if OTP is entered
                if (!sEnteredOtp) {
                    oOtpInput.setValueState(sap.ui.core.ValueState.Error);
                    oOtpInput.setValueStateText("Please enter the OTP.");
                    sap.m.MessageToast.show("Please enter the OTP.");
                    return;
                }

                // Validate OTP: It should be exactly 6 digits
                var otpRegex = /^\d{6}$/;
                if (!otpRegex.test(sEnteredOtp)) {
                    oOtpInput.setValueState(sap.ui.core.ValueState.Error);
                    oOtpInput.setValueStateText("Please enter a valid 6-digit OTP.");
                    sap.m.MessageToast.show("Please enter a valid 6-digit OTP.");
                    return;
                }

                // Prepare the Twilio Verify Check API details

                const accountSid = 'AC2fb46ec1c11689b5cecea6361105c723'; // Replace with your Twilio Account SID
                const authToken = 'f1ae977a8f46265e4078d48e6bbfa5b4'; // Replace with your Twilio Auth Token
                const serviceSid = 'VAdfa3a7c4613f48b5722f611bb2ef3b5d';

                const url = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`;
                const payload = {
                    To: this._storedPhoneNumber,
                    Code: sEnteredOtp
                };

                // Make the AJAX request to Twilio to verify the OTP
                $.ajax({
                    url: url,
                    type: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param(payload),
                    success: function (data) {
                        if (data.status === "approved") {
                            sap.m.MessageToast.show("OTP verified successfully!");
                            oOtpInput.setValueState(sap.ui.core.ValueState.Success);
                            oMobileinput.setValueState(sap.ui.core.ValueState.Success);
                            oMobileinput.setEditable(false);
                            oVerfied.setVisible(true);
                            oGetotp.setVisible(false);

                            // Reset the ValueState to None upon successful verification
                            oOtpInput.setValueStateText("OTP verified successfully");
                            this.bOtpVerified = true;

                            // Proceed with further actions
                        } else {
                            oOtpInput.setValueState(sap.ui.core.ValueState.Error);
                            oOtpInput.setValueStateText("Invalid OTP. Please try again.");
                            sap.m.MessageToast.show("Invalid OTP. Please try again.");
                            oMobileinput.setValueState(sap.ui.core.ValueState.Error);
                            oMobileinput.setValueStateText("Recheck your Mobile Number");
                        }
                    }.bind(this),
                    error: function (xhr, status, error) {
                        console.error('Error verifying OTP:', error);
                        sap.m.MessageToast.show('Failed to verify OTP: ' + error);
                    }
                });
            },
            onSubmitPress: function () {
                var oUserView = this.getView();
                var oProcessType = this.byId("idResouceType").getSelectedKey();
                var bValid = true;
                var bAllFieldsFilled = true; // Flag to track if all required fields are filled

                // Fetch values from input fields
                var oResourceId = oUserView.byId("idResourceIdInput").getValue();
                var oUsername = oUserView.byId("idUserNameInput").getValue();
                var oEmail = oUserView.byId("idInputEmail").getValue();
                var oPhone = oUserView.byId("idInputPhoneNumber").getValue();

                // Check if resource is selected
                if (!oProcessType) {
                    oUserView.byId("idResouceType").setValueState("Error");
                    oUserView.byId("idResouceType").setValueStateText("Select a valid Area");
                    bValid = false;
                    bAllFieldsFilled = false;

                } else {
                    oUserView.byId("idResouceType").setValueState("None");
                }


                // Validate Resource ID
                if (!oResourceId) {
                    oUserView.byId("idResourceIdInput").setValueState("Error");
                    oUserView.byId("idResourceIdInput").setValueStateText("Resource ID is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (!/^\d{6}$/.test(oResourceId)) {
                    oUserView.byId("idResourceIdInput").setValueState("Error");
                    oUserView.byId("idResourceIdInput").setValueStateText("Resource ID must be a 6-digit numeric value");
                    bValid = false;
                } else {
                    oUserView.byId("idResourceIdInput").setValueState("None");
                }

                // Validate Username
                if (!oUsername) {
                    oUserView.byId("idUserNameInput").setValueState("Error");
                    oUserView.byId("idUserNameInput").setValueStateText("Username is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oUserView.byId("idUserNameInput").setValueState("None");
                }

                if (!(oUserView.byId("idInputEmail").getValue())) {

                }
                else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(oEmail)) {
                    oUserView.byId("idInputEmail").setValueState("Error");
                    oUserView.byId("idInputEmail").setValueStateText("Please enter a valid email address");
                    bValid = false;
                }

                // Validate Phone Number
                if (!oPhone) {
                    oUserView.byId("idInputPhoneNumber").setValueState("Error");
                    oUserView.byId("idInputPhoneNumber").setValueStateText("Phone number is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (oPhone.length !== 10 || !/^\d+$/.test(oPhone)) {
                    oUserView.byId("idInputPhoneNumber").setValueState("Error");
                    oUserView.byId("idInputPhoneNumber").setValueStateText("Mobile number must be a 10-digit numeric value");
                    bValid = false;

                } else {
                    oUserView.byId("idInputPhoneNumber").setValueState("None");
                    if (!this.bOtpVerified) {
                        sap.m.MessageToast.show("Please verify your phone number with the OTP before submitting.");
                        return;
                    }
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

                // Create the resource
                var oModel = this.getView().getModel();
                var that = this;
                oModel.read("/RESOURCESSet('" + oResourceId + "')", {
                    success: function (oData) {
                        MessageToast.show("Resource exist");

                    }.bind(this),
                    error: function () {
                        oModel.create("/RESOURCESSet", {
                            Resourceid: oResourceId,
                            Resourcetype: oProcessType,
                            Validity: false,
                            Resourcename: oUsername,
                            Email: oEmail,
                            Phonenumber: oPhone,

                        }, {
                            success: function () {
                                sap.m.MessageToast.show("Success");
                                that.onCloseRegisterSubmitDialog();


                            },
                            error: function (oError) {
                                var oResponse = JSON.parse(oError.responseText);
                                MessageBox.error(oResponse.error.message.value || "Error occurred while creating resource");
                            }
                        });
                    }
                });

            },
            /*Clearing Values in the form */
            onClearRegisterSubmitDialog: function () {
                var oView = this.getView();

                // Clear the value of each input field
                oView.byId("idResourceIdInput").setValue("");
                oView.byId("idUserNameInput").setValue("");
                oView.byId("idInputEmail").setValue("");
                oView.byId("idInputPhoneNumber").setValue("");
                oView.byId("idInputPhoneNumber").setEditable(true);
                oView.byId("VerifyButton").setVisible(true);
                oView.byId("verficationId").setVisible(false);
                oView.byId("idOtpInput").setVisible(false);
                oView.byId("idOtpInput").setValue("");
                this.bOtpVerified = false;
                // Clear the value of each ComboBox
                oView.byId("idResouceType").setSelectedKey("");
            },

            sample: async function () {
                this.oResetDialog ??= await this.loadFragment({
                    name: "com.app.rfapp.fragments.Resetpassword"
                })
                this.oResetDialog.open();
            },
            formatDate: function (oDate) {
                var sYear = oDate.getFullYear();
                var sMonth = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var sDay = ("0" + oDate.getDate()).slice(-2);

                return `${sYear}-${sMonth}-${sDay}`;
            },
            onSavePress: async function () {
                var oView = this.getView();

                // Retrieve the new password and confirm password from the dialog input fields
                var sNewPassword = oView.byId("idResetNewPassword").getValue();
                var sConfirmPassword = oView.byId("idresetConfirmPassword").getValue();

                // Validate password length
                if (sConfirmPassword.length !== 8 || sNewPassword.length !== 8) {
                    MessageBox.error("Your Password length should be 8 characters.");
                    return;
                }

                // Check if the passwords match
                if (sNewPassword !== sConfirmPassword) {
                    sap.m.MessageToast.show("Passwords do not match. Please try again.");
                    return;
                }

                // Retrieve the resource ID from the login view
                var sResourceId = oView.byId("idUserIDInput").getValue();

                // Prepare the data to update
                var oDataUpdate = {
                    Loginfirst: false,  // Indicates the user has logged in before
                    Password: sNewPassword
                };

                // Get the model from the component
                var oModel = this.getOwnerComponent().getModel();

                // Update the user's password in the backend
                try {
                    await oModel.update(`/RESOURCESSet('${sResourceId}')`, oDataUpdate, {
                        success: function () {
                            sap.m.MessageToast.show("Password updated successfully!");

                            // Clear input fields after success
                            oView.byId("idResetNewPassword").setValue("");
                            oView.byId("idresetConfirmPassword").setValue("");
                            this.oResetDialog.close();
                            oView.byId("idUserIDInput").setValue("");
                            oView.byId("idPasswordInput").setValue("");
                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show("Error updating user login status.");
                        }
                    });
                } catch (error) {
                    sap.m.MessageToast.show("An error occurred while updating the password.");
                }
            },
            onCancelPress: function () {
                this.oResetDialog.close();
            },

            onPressConnectButton: function () {
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        var ouser = oData.Users.toLowerCase()
                        if (ouser === "supervisor" || ouser === "manager") {

                            this.getOwnerComponent().getRouter().navTo("Supervisor", { id: this.ID },Animation)
                        }
                        else {
                            this.getOwnerComponent().getRouter().navTo("RouteResourcePage", { id: this.ID },Animation)
                        }

                    }.bind(this),
                    error: function () {
                        MessageToast.show("User doesn't exist")
                    }
                });
            },

            oncreatesingupPress: function () {
                var oView = this.getView();

                // Retrieve values from input fields
                var sFirstName = oView.byId("idFirstnameInput").getValue();
                var sLastName = oView.byId("idLastnameInput").getValue();
                var sEmployeeNo = oView.byId("idEmployeenoInput").getValue();
                var sMobileNo = oView.byId("idMobilenoInput").getValue();
                var sEmailID = oView.byId("idEmailIDInput").getValue();
                var sResourceType = this.getSelectedResourceType(); // Method to get selected resource type

                // Validate input fields
                if (!sFirstName || !sLastName || !sEmployeeNo || !sMobileNo || !sResourceType) {
                    MessageToast.show("Please fill all fields");
                    return;
                }

                // Validate mobile number
                if (!/^\d{10}$/.test(sMobileNo)) {
                    MessageToast.show("Mobile number must be exactly 10 digits.");
                    return;
                }
                if (!this.validateEmail(sEmailID)) {
                    MessageToast.show("Please enter a valid email address. Example: example@domain.com");
                    return;
                }

                // Get the OData model
                var oModel = this.getView().getModel();

                // Check if Employee No already exists
                oModel.read("/RESOURCESSet", {
                    filters: [new sap.ui.model.Filter("Resourceid", sap.ui.model.FilterOperator.EQ, sEmployeeNo)],
                    success: function (oData) {
                        // Check if any results were returned
                        if (oData.results.length > 0) {
                            MessageToast.show("Employee No already exists. Please use a different Employee No.");
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
                                    oView.byId("dialog").close();
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
            },
            validateEmail: function (email) {
                // Regular expression for validating an email address
                var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
                return re.test(email);  // Returns true if valid, false otherwise
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
            onBackBtnInHomePage: function (){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("InitialScreen", { id: this.ID });
             
            },
            onLogoutPressedInHomePage: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("InitialScreen", { id: this.ID });
 
            },
           onHomePageAvatarPressed: function (oEvent) {
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.ProfileDialog", this);
                this.getView().addDependent(this._oPopover);
                this.getView().byId("idTileViewButton").setVisible(false);
            }
            // Open popover near the avatar
            this._oPopover.openBy(oEvent.getSource());
           
        },

        onCloseDialogInHomePage: function () {
            this._pProfileDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onSignoutPressed: function (){
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("InitialScreen", { id: this.ID });
         
        },
        });
    });

