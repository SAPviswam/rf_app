sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "com/app/rfapp/utils/Constant"
],
    function (Controller, MessageBox, MessageToast, BusyIndicator,Constant) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.Home", {
            onInit: function () {
                this.bOtpVerified = false;
            },
            onLoginPress: async function () {
                var oView = this.getView();

                // Retrieve values from input fields
                var sWarehouseNumber = oView.byId("idHUInput").getValue();
                var sResourceId = oView.byId("idUserIDInput").getValue();
                var sPassword = oView.byId("idPasswordInput").getValue();

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
                                    if(oUser ==="supervisor"){

                                        that.getRouter().navTo("Supervisor", { id: sResourceId });
                                    }
                                    else{
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
            onCloseRegisterSubmitDialog: function () {
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
            OnGenereateOTP: function (sPhoneNumber) {
                // Prepare the Twilio API details
                var formattedPhoneNumber = "+91" + sPhoneNumber; // Assuming country code for India

                const accountSid = Constant.oAccountSID; // Replace with your Twilio Account SID
                const authToken = Constant.oAuthToken; // Replace with your Twilio Auth Token
                const serviceSid = Constant.oServiceID ;// Replace with your Twilio Verify Service SID

                const url = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;

                // Prepare the data for the request
                const payload = {
                    To: formattedPhoneNumber,
                    Channel: 'sms'
                };

                var that = this;

                // Make the AJAX request to Twilio to send the OTP
                $.ajax({
                    url: url,
                    type: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param(payload),
                    success: function (data) {
                        console.log('OTP sent successfully:', data);
                        sap.m.MessageToast.show('OTP sent successfully! Please check your phone.');

                        // Store the phone number for later use in OTP verification
                        that._storedPhoneNumber = formattedPhoneNumber;

                        // Open the OTP dialog

                    }.bind(that),
                    error: function (xhr, status, error) {
                        console.error('Error sending OTP:', error);
                        sap.m.MessageToast.show('Failed to send OTP: ' + error);
                    }
                });
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

                const accountSid = Constant.oAccountSID; // Replace with your Twilio Account SID
                const authToken = Constant.oAuthToken; // Replace with your Twilio Auth Token
                const serviceSid = Constant.oServiceID ;// Replace with your Twilio Verify Service SID

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

                                that.onClearRegisterSubmitDialog();


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

            onForgotPassword: async function () {
                var oView = this.getView();
                var sResourceId = oView.byId("idUserIDInput").getValue();
                if (!sResourceId) {
                    MessageBox.error("Plesase enter resource ID")
                    return;
                }
                this.oforgotDialog ??= await this.loadFragment({
                    name: "com.app.rfapp.fragments.Forgotpassword"
                })
                this.oforgotDialog.open();
            },
            onCloseFP: function () {
                this.oforgotDialog.close();
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
            onSelectGetCode: function () {
                var mobileNo = this.byId("idEnterMobileNo").getValue();

                // Validate mobile number
                if (!mobileNo) {
                    sap.m.MessageToast.show("Please enter your mobile number.");
                    return;
                }
                var oModel = this.getOwnerComponent().getModel();
                // Call the OData service to check if the record exists
                oModel.read("/RESOURCESSet?$filter=Phonenumber eq '" + mobileNo + "'", {
                    success: function (data) {
                        if (data.results.length > 0) {
                            this.OnGenereateOTP(mobileNo)
                        } else {
                            MessageToast.show("No record found for this mobile number.");
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("Error fetching data. Please try again.");
                    }
                });
            },
            OnVerifyforgetOTP: function () {
                var oMobileinput = this.byId("idEnterMobileNo")
                var oOtpInput = this.byId("idEnterConformationCode");
                var sEnteredOtp = oOtpInput.getValue();
                var oVerfied = this.byId("verficationId1");
                var that=this

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

                const accountSid = Constant.oAccountSID; // Replace with your Twilio Account SID
                const authToken = Constant.oAuthToken; // Replace with your Twilio Auth Token
                const serviceSid = Constant.oServiceID ;// Replace with your Twilio Verify Service SID
                const url = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`;
                const payload = {
                    To: that._storedPhoneNumber,
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
                            oVerfied.setVisible(true);

                            // Reset the ValueState to None upon successful verification

                            oOtpInput.setValueStateText("OTP verified successfully");
                            that.bOtpVerified = true;

                            // Proceed with further actions
                        } else {
                            oOtpInput.setValueState(sap.ui.core.ValueState.Error);
                            oOtpInput.setValueStateText("Invalid OTP. Please try again.");
                            sap.m.MessageToast.show("Invalid OTP. Please try again.");
                            oMobileinput.setValueState(sap.ui.core.ValueState.Error);
                            oMobileinput.setValueStateText("Recheck your Mobile Number");
                        }
                    }.bind(that),
                    error: function (xhr, status, error) {
                        console.error('Error verifying OTP:', error);
                        sap.m.MessageToast.show('Failed to verify OTP: ' + error);
                    }
                });
            },
            onforgotpassword: async function () {
                var oView = this.getView();

                // Retrieve the new password and confirm password from the dialog input fields
                var sResourceId = oView.byId("idUserIDInput").getValue();
                var sNewPassword = oView.byId("idEnterNewPassword").getValue();
                var sotp = oView.byId("idEnterConformationCode").getValue();
                var sConfirmPassword = oView.byId("idConfirmPassword").getValue();
                var sMobno = oView.byId("idEnterMobileNo").getValue();



                if (sMobno.length !== 10 || !/^\d+$/.test(sMobno)) {
                    oView.byId("idEnterMobileNo").setValueState("Error");
                    oView.byId("idEnterMobileNo").setValueStateText("Mobile number must be a 10-digit numeric value");
                    bValid = false;


                    
                } else {
                    oView.byId("idEnterMobileNo").setValueState("None");
                    if (!this.bOtpVerified) {
                        sap.m.MessageToast.show("Please verify your phone number with the OTP before submitting.");
                        return;
                    }
                }
                if (!sotp || !sNewPassword || !sConfirmPassword || !sMobno) {
                    sap.m.MessageToast.show("Please fill all details.");
                    return;
                }

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
                // Get the model from the component
                var oModel = this.getOwnerComponent().getModel();

                var oDataUpdate = {
                    Password: sNewPassword
                };

                // Update the user's password in the backend
                try {
                    await oModel.update(`/RESOURCESSet('${sResourceId}')`, oDataUpdate, {
                        success: function () {
                            sap.m.MessageToast.show("Password updated successfully!");
                            this.byId("verficationId1").setVisible(false);

                            // Clear input fields after success
                            oView.byId("idEnterNewPassword").setValue("");
                            oView.byId("idConfirmPassword").setValue("");
                            oView.byId("idEnterMobileNo").setValue("");
                            oView.byId("idEnterConformationCode").setValue("");
                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show("Error updating user login status.");
                        }
                    });
                } catch (error) {
                    sap.m.MessageToast.show("An error occurred while updating the password.");
                }
            },

        });
    });
