sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

  ],
  function (Controller, ODataModel, Filter, FilterOperator) {

    "use strict";

    return Controller.extend("com.app.rfapp.controller.ConfigLogin", {
      onInit: async function () {
        // Loading of secrets
        const oConfigModel = this.getOwnerComponent().getModel("config");
        this.oTwilioConfig = oConfigModel.getProperty("/Twilio");
        this.oSMSConfig = oConfigModel.getProperty("/SMS");

        const OData = new sap.ui.model.json.JSONModel({
          appLoginData: {
            Userid: "",
            Firstname: "",
            Lastname: "",
            Email: "",
            Phonenumber: "",
            Password: ""
          }
        });
        this.getView().setModel(OData, "ODataModel");


        // Check credentials are saved
        await this.checkAutoLogin()


      },
      checkAutoLogin: function () {

        const savedData = localStorage.getItem('loginData');
        if (savedData) {
          const { userid, token, expiration } = JSON.parse(savedData);

          // Check if data is expired
          if (Date.now() > expiration) {
            console.log('Login data has expired');
            localStorage.removeItem('loginData');
            sap.m.MessageToast.show("Login expired")
            return null;
          }

          try {
            const oModel = this.getOwnerComponent().getModel()
            const fUser = new sap.ui.model.Filter("Userid", sap.ui.model.FilterOperator.EQ, userid),
              fPassword = new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, token),
              aFilters = new sap.ui.model.Filter({
                filters: [fUser, fPassword],
                and: true
              });
            const oResponse = this.readData(oModel, "/APP_LOGON_DETAILSSet", aFilters)
            if (oResponse.results.length === 1) {
              // Show success message
              sap.m.MessageToast.show("Welcome back");

              // Navigate to the Initial Screen
              const oRouter = this.getOwnerComponent().getRouter();
              oRouter.navTo("InitialScreen", { Userid: userid }, true);
              window.location.reload(true);

            }
          } catch (error) {
            sap.m.MessageToast.show("Oops something went wrong please refresh the page")
            console.error(error);
          }
        }

      },
      onAppLoginPress: async function () {
        debugger
        const oModel = this.getOwnerComponent().getModel(),
          oUserView = this.getView(),
          sPath = "/APP_LOGON_DETAILSSet",
          sUserEnteredUserID = this.getView().byId("idUserIDInpt_CL").getValue(),
          sUserEnteredPassword = this.getView().byId("idPasswordInpt_CL").getValue();


        // validations
        var flag = true;
        if (!sUserEnteredUserID) {
          oUserView.byId("idUserIDInpt_CL").setValueState("Warning");
          oUserView.byId("idUserIDInpt_CL").setValueStateText("Please enter registered user ID");
          flag = false;
        } else {
          oUserView.byId("idUserIDInpt_CL").setValueState("None");
        }
        if (!sUserEnteredPassword) {
          oUserView.byId("idPasswordInpt_CL").setValueState("Warning");
          oUserView.byId("idPasswordInpt_CL").setValueStateText("Enter your password");
          flag = false;
        } else {
          oUserView.byId("idPasswordInpt_CL").setValueState("None");
        }
        if (!flag) {
          sap.m.MessageToast.show("Please enter required credentials")
          // Close busy dialog
          this._oBusyDialog.close();
          return;
        }

        const fUser = new sap.ui.model.Filter("Userid", sap.ui.model.FilterOperator.EQ, sUserEnteredUserID),
          // fPassword = new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, sUserEnteredPassword),
          aFilters = new sap.ui.model.Filter({
            filters: [fUser],
            and: true // Change to false if you want OR logic
          });

        // create busy dialog
        if (!this._oBusyDialog) {
          this._oBusyDialog = new sap.m.BusyDialog({
            text: "Authenticating"
          });
        }
        try {
          // Open busy dialog
          this._oBusyDialog.open();

          // Simulate buffer using setTimeout
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Fetch data from the model
          const oResponse = await this.readData(oModel, sPath, aFilters);

          if (oResponse.results.length > 0) {
            const oResult = oResponse.results[0],
              sStoredUserId = oResult.Userid,
              sStoredPassword = oResult.Password;

            // Encrypt user-entered password with SHA256
            const sEncryptedPass = CryptoJS.SHA256(sUserEnteredPassword).toString();

            if (sUserEnteredUserID === sStoredUserId && sStoredPassword === sEncryptedPass) {
              // Auto Save 
              const oCheckbox = this.getView().byId("_IDGenCheckBox_CL");
              if (oCheckbox.getSelected()) {
                await this.onAutoSaveData(sUserEnteredUserID, sStoredPassword)
              }
              this._onLoginSuccess(sUserEnteredUserID);
            } else {
              this._onLoginFail("Authentication failed");
            }
          } else {
            this._onLoginFail("User ID not found");
          }
        } catch (error) {
          this._oBusyDialog.close();
          sap.m.MessageToast.show("Something went wrong. Please try again later.");
          console.error("Error Found:", error);
        } finally {
          // Close busy dialog
          this._oBusyDialog.close();
        }
      },
      _onLoginSuccess(sUserEnteredUserID) {
        // Clear input fields
        this.getView().byId("idUserIDInpt_CL").setValue("");
        this.getView().byId("idPasswordInpt_CL").setValue("");

        // Show success message
        sap.m.MessageToast.show("Login Successfull");

        // Navigate to the Initial Screen
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("InitialScreen", { Userid: sUserEnteredUserID }, true);
        window.location.reload(true);

      },
      _onLoginFail(sMessage) {
        // Show failure message
        sap.m.MessageToast.show(sMessage);
      },
      onAutoSaveData: function (CurrentUser, Token) {
        // Save credentials with an expiration time 

        const expirationTime = Date.now() + 2 * 60 * 1000; // Current time + expiration time in ms

        const loginData = {
          userid: CurrentUser,
          token: Token,
          expiration: expirationTime
        };

        // Save to local storage as a JSON string
        localStorage.setItem('loginData', JSON.stringify(loginData));

      },
      onForgotPasswordPress: async function () {
        if (!this.forgotPass) {
          this.forgotPass = await this.loadFragment("ForgotPassword");
        }
        this.forgotPass.open()
      },
      onCancelForgotPassword: async function () {
        if (this.forgotPass.isOpen()) {
          const oView = this.getView()
          await this.forgotPass.close()
          // value states
          oView.byId("idRegNumbInput_CL").setValueState("None");
          oView.byId("idUserIDInput_CL").setValueState("None");
          oView.byId("idPasswordInput_CL").setValueState("None");

          // clear fields
          oView.byId("idRegNumbInput_CL").setValue("");
          oView.byId("idUserIDInput_CL").setValue("");
          oView.byId("idPasswordInput_CL").setValue("");

        }
      },
      onUpdatePasswordPress: async function () {
        const oModel = this.getOwnerComponent().getModel(),
          oUserView = this.getView(),
          sPath = "/APP_LOGON_DETAILSSet",
          sUserEnteredUserID = this.getView().byId("idUserIDInput_CL").getValue(),
          sUserEnteredMobile = this.getView().byId("idRegNumbInput_CL").getValue(),
          sUserEnteredPass = this.getView().byId("idPasswordInput_CL").getValue();
        // validations
        var flag = true;
        if (!sUserEnteredUserID) {
          oUserView.byId("idUserIDInput_CL").setValueState("Error");
          oUserView.byId("idUserIDInput_CL").setValueStateText("Please enter registered user ID");
          flag = false;
        } else {
          oUserView.byId("idUserIDInput_CL").setValueState("None");
        }
        if (!sUserEnteredMobile || sUserEnteredMobile.length !== 10 || !/^\d+$/.test(sUserEnteredMobile)) {
          oUserView.byId("idRegNumbInput_CL").setValueState("Error");
          oUserView.byId("idRegNumbInput_CL").setValueStateText("Please enter 10 digit correct mobile number");
          flag = false;
        } else {
          oUserView.byId("idRegNumbInput_CL").setValueState("None");

        }
        if (!sUserEnteredPass || sUserEnteredPass.length < 8 || !sUserEnteredPass.length > 30) {
          oUserView.byId("idPasswordInput_CL").setValueState("Error");
          oUserView.byId("idPasswordInput_CL").setValueStateText("Password length must be minimum 8 characters (max 30 characters)");
          flag = false;
        } else {
          oUserView.byId("idPasswordInput_CL").setValueState("None");

        }
        if (!flag) {
          sap.m.MessageToast.show("Please enter correct data")
          return;
        }

        try {

          const aRegisteredUserID = new sap.ui.model.Filter("Userid", sap.ui.model.FilterOperator.EQ, sUserEnteredUserID);
          const aRegisteredMobile = new sap.ui.model.Filter("Phonenumber", sap.ui.model.FilterOperator.EQ, sUserEnteredMobile);

          // Combine the filters with AND
          const aFilters = new sap.ui.model.Filter({
            filters: [aRegisteredUserID, aRegisteredMobile],
            and: true // Change to false if you want OR logic
          });

          const oResponse = await this.readData(oModel, sPath, aFilters)
          if (oResponse.results.length > 0) {
            const sRegisteredUserID = oResponse.results[0].Userid,
              sRegisteredPhnNumber = oResponse.results[0].Phonenumber,
              sStoredPassword = oResponse.results[0].Password;

            if (sRegisteredUserID === sUserEnteredUserID && sRegisteredPhnNumber === sUserEnteredMobile) {

              // get the actual password
              const sNewPassword = this.getView().byId("idPasswordInput_CL").getValue();

              // Use SHA256 for hashing (CryptoJS)
              const sEncrytpedPass = CryptoJS.SHA256(sNewPassword).toString(); // encryption with CryptoJS
              if (sStoredPassword === sEncrytpedPass) {
                sap.m.MessageBox.information("New Password can not be same as previous password");
                return;
              }
              const oPayload = {
                Password: sEncrytpedPass
              }
              try {

                const sUpdatePath = `/APP_LOGON_DETAILSSet('${sUserEnteredUserID}')`
                // update call
                const oResponse = await this.updateData(oModel, sUpdatePath, oPayload);
                sap.m.MessageToast.show("Password Changed Successfully")
                const oUserView = this.getView();
                // after successfull  value states
                oUserView.byId("idRegNumbInput_CL").setValueState("None");
                oUserView.byId("idUserIDInput_CL").setValueState("None");
                oUserView.byId("idPasswordInput_CL").setValueState("None");

                // clear fields
                oUserView.byId("idRegNumbInput_CL").setValue("");
                oUserView.byId("idUserIDInput_CL").setValue("");
                oUserView.byId("idPasswordInput_CL").setValue("");
                // close the fragment
                this.forgotPass.close()

              } catch (error) {
                sap.m.MessageToast.show("Failed to reset password" + error)
              }
            } else {
              sap.m.MessageToast.show("ID and phone number mismatch")
            }
          } else {
            sap.m.MessageToast.show("ID and phone number mismatch")
          }

        } catch (error) {
          sap.m.MessageToast.show("Failed to read data " + error)
        }
      },

      onNavToSignUpPage: function () {

        this.getView().byId("idconnecttsosapDetailsForm_CP").setVisible(true)
        this.getView().byId("idPaddingBox_configPage").setVisible(false)

      },

      onSignupPress: async function () {

        const oPayload = this.getView().getModel("ODataModel").getProperty("/appLoginData"),
          sPath = "/APP_LOGON_DETAILSSet",
          oModel = this.getOwnerComponent().getModel(),
          oUserView = this.getView(),
          that = this;

        // Validations 
        var flag = true;
        if (!oPayload.Firstname || oPayload.Firstname.length < 3 || !/^[a-zA-Z]+$/.test(oPayload.Firstname)) {
          oUserView.byId("idFirstnameInput_CL").setValueState("Error");
          oUserView.byId("idFirstnameInput_CL").setValueStateText("first name must contain alphabet characters and 3 characters long");
          flag = false;
        } else {
          oUserView.byId("idFirstnameInput_CL").setValueState("None");
        }
        if (!oPayload.Lastname || oPayload.Lastname.length < 3 || !/^[a-zA-Z]+$/.test(oPayload.Lastname)) {
          oUserView.byId("idLName_Input_CL").setValueState("Error");
          oUserView.byId("idLName_Input_CL").setValueStateText("last name must contain alphabet characters and 3 characters long");
          flag = false;
        } else {
          oUserView.byId("idLName_Input_CL").setValueState("None");
        }
        if (oPayload.Email) {
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(oPayload.Email)) {
            oUserView.byId("idEmailAddInput_CL").setValueState("Error");
            oUserView.byId("idEmailAddInput_CL").setValueStateText("Enter Correct E-Mail address");
            flag = false;
          } else {
            oUserView.byId("idEmailAddInput_CL").setValueState("None");
          }
        } else {
          oUserView.byId("idEmailAddInput_CL").setValueState("None");
        }
        if (!oPayload.Phonenumber || oPayload.Phonenumber.length !== 10 || !/^\d+$/.test(oPayload.Phonenumber)) {
          oUserView.byId("idPhoneInput_CL").setValueState("Error");
          oUserView.byId("idPhoneInput_CL").setValueStateText("please enter 10 digit number");
          flag = false;
        } else {
          oUserView.byId("idPhoneInput_CL").setValueState("None");
        }
        if (!oPayload.Password || oPayload.Password.length < 8 || !oPayload.Password.length > 30) {
          oUserView.byId("idPassswordInput_CL").setValueState("Error");
          oUserView.byId("idPassswordInput_CL").setValueStateText("Password length must be minimum 8 characters (max 30 characters)");
          flag = false;
        } else {
          oUserView.byId("idPassswordInput_CL").setValueState("None");
        }
        if (!flag) {
          sap.m.MessageToast.show("Please enter correct data");
          return; // Prevent further execution

        }
        try {

          try {
            // keep the below line for future use
            const oResponse = await this.readData(oModel, sPath);

            // Accessing the data in the response
            const aResults = oResponse.results;
            if (aResults.length === 0) {
              oPayload.Userid = "ARTUSR0001"
            } else {
              const aSortedarray = aResults.sort((a, b) => b.Userid.localeCompare(a.Userid)), // descendign order to get the highest number user id
                currentMaxID = aSortedarray[0].Userid
              // generation of user ID
              function generateUniqueString(currentString) {
                // Extract the prefix (non-numeric part) and the number (numeric part)
                const prefix = currentString.match(/[^\d]+/g)[0]; // Extract non-numeric characters
                const number = parseInt(currentString.match(/\d+/g)[0], 10); // Extract numeric characters and convert to integer

                // Increment the numeric part by 1
                const newNumber = number + 1;

                // Format the new number with leading zeros to match the original length
                const formattedNumber = String(newNumber).padStart(currentString.length - prefix.length, '0');

                // Combine the prefix and the formatted number to get the new unique string
                return prefix + formattedNumber;
              }

              // call
              const newUserid = generateUniqueString(currentMaxID);
              oPayload.Userid = newUserid

            }

          } catch (error) {
            console.error("Failed to fetch data:", error);
            // Display error message
            sap.m.MessageToast.show("Failed to fetch data. Please try again.");
            return
          }
          // get the actual password
          const sActualPass = oPayload.Password
          // Use SHA256 for hashing (CryptoJS )
          const sEncrytpedPass = CryptoJS.SHA256(sActualPass).toString(); // encryption with CryptoJS
          oPayload.Password = sEncrytpedPass

          // Create a record with payload
          await this.createData(oModel, oPayload, "/APP_LOGON_DETAILSSet");
          sap.m.MessageToast.show("Record created successfully!");
          this.getView().byId("idPhoneInput_CL").setEditable(true)
          this.getView().byId("idSignUp_CL").setEnabled(false)
          // set the empty data after successful creation
          this.getView().getModel("ODataModel").setProperty("/appLoginData", {});
          // set the inputfield states to defult 
          await this.onDefaultStates();

          // Send the generated UserID to User
          // Send POST request to Twilio API using jQuery.ajax
          const accountSid = this.oSMSConfig.AccountSID,
            authToken = this.oSMSConfig.AuthToken,
            url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            fromNumber = '+15856485867';
          $.ajax({
            url: url,
            type: 'POST',
            async: true,
            headers: {
              'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
            },
            data: {
              To: `+91${oPayload.Phonenumber}`,
              From: fromNumber,
              Body: `Hi ${oPayload.Firstname} your login ID for RF app is ${oPayload.Userid} don't share with anyone. \nThank You,\nArtihcus Global.`
            },
            success: function (data) {
              sap.m.MessageBox.show('Login ID will be sent via SMS to your mobile number');
            },
            error: function (error) {
              sap.m.MessageBox.information(`Failed to send SMS.\nyour user ID is ${oPayload.Userid} please note this for future use`);
              console.error('Failed to send user ID' + error.message);
            }
          });
          // SMS END
        } catch (error) {
          sap.m.MessageToast.show("Something went wrong try again later....");
          console.error("Failed to create record. Please try again.", error.message || error.responseText || "Unknown error occurred.");
        }
      },
      onCancleSignup: async function () {
        const oView = this.getView();
        oView.getModel("ODataModel").setProperty("/appLoginData", {});
        oView.byId("idconnecttsosapDetailsForm_CP").setVisible(false)
        oView.byId("idPaddingBox_configPage").setVisible(true)

        // set the inputfield states to defult 
        await this.onDefaultStates(oView);

      },
      // set the inputfield states to defult 
      onDefaultStates: function () {
        const oView = this.getView();
        oView.byId("idFirstnameInput_CL").setValueState("None");
        oView.byId("idLName_Input_CL").setValueState("None");
        oView.byId("idEmailAddInput_CL").setValueState("None");
        oView.byId("idPassswordInput_CL").setValueState("None");
        oView.byId("idPhoneInput_CL").setValueState("None");
        oView.byId("idOTPInput_CL").setValueState("None");
      },
      onAfterNumberEnter: function () {
        const value = this.getView().byId("idPhoneInput_CL").getValue()
        if (!value) {
          this.getView().byId("idBtnOTP").setEnabled(false)
        } else {
          this.getView().byId("idBtnOTP").setEnabled(true)
        }
      },
      onGetOTPPress: function () {
        const oUserView = this.getView(),
          PhnNumber = oUserView.byId("idPhoneInput_CL").getValue()
        if (!PhnNumber || PhnNumber.length !== 10 || !/^[6-9]\d{9}$/.test(PhnNumber)) {
          oUserView.byId("idPhoneInput_CL").setValueState("Error");
          oUserView.byId("idPhoneInput_CL").setValueStateText("please enter 10 digit correct number");
          flag = false;
        } else {
          oUserView.byId("idPhoneInput_CL").setValueState("None");
        }

        const oMobileinput = this.byId("idPhoneInput_CL");
        // Get the phone number from the input field
        var sPhoneNumber = this.byId("idPhoneInput_CL").getValue();

        // Prepare the Twilio API details
        var formattedPhoneNumber = "+91" + sPhoneNumber; // Assuming country code for India
        const accountSid = this.oTwilioConfig.AccountSID;  // Constant.oAccountSID;
        const authToken = this.oTwilioConfig.AuthToken;   // Constant.oAuthToken;
        const serviceSid = this.oTwilioConfig.ServiceID;   // Constant.oServiceID;
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
            sap.m.MessageToast.show('OTP sent successfully!')

            // Store the phone number for later use in OTP verification
            that._storedPhoneNumber = formattedPhoneNumber;

            // Open the OTP dialog
            that.getView().byId("idOTPHBox").setVisible(true)

          }.bind(that),
          error: function (xhr, status, error) {
            oMobileinput.setValueState(sap.ui.core.ValueState.Error)
            oMobileinput.setValueStateText("check your Mobile Number")
            console.error('Error sending OTP:', error);
            sap.m.MessageToast.show('Failed to send OTP')
          }
        });

      },
      onValidate: function () {

        const that = this;
        // Create a Busy Dialog instance
        if (!this._oValidatingBusyDialog) {
          this._oValidatingBusyDialog = new sap.m.BusyDialog({
            text: "Please wait while validatiing OTP"
          });
        }
        // Open the Busy Dialog
        this._oValidatingBusyDialog.open();

        const oMobileinput = this.byId("idPhoneInput_CL"),
          oOtpInput = this.byId("idOTPInput_CL"),
          sEnteredOtp = oOtpInput.getValue();

        // Basic validation: Check if OTP is entered
        if (!sEnteredOtp) {
          oOtpInput.setValueState(sap.ui.core.ValueState.Error);
          oOtpInput.setValueStateText("Please enter OTP");
          sap.m.MessageToast.show("Please enter OTP")
          this._oValidatingBusyDialog.close();
          return;
        }

        // Validate OTP: It should be exactly 6 digits
        var otpRegex = /^\d{6}$/;
        if (!otpRegex.test(sEnteredOtp)) {
          oOtpInput.setValueState(sap.ui.core.ValueState.Error);
          oOtpInput.setValueStateText("Please enter a valid 6-digit OTP.");
          this._oValidatingBusyDialog.close();
          return;
        }

        // Prepare the Twilio Verify Check API details
        const accountSid = this.oTwilioConfig.AccountSID,
          authToken = this.oTwilioConfig.AuthToken,
          serviceSid = this.oTwilioConfig.ServiceID,
          url = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`,
          payload = {
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
              // close the busy dailog
              that._oValidatingBusyDialog.close();
              // hide the validattion elements
              that.getView().byId("idOTPHBox").setVisible(false)
              that.getView().byId("idOTPInput_CL").setValue("")
              oMobileinput.setValueState(sap.ui.core.ValueState.Success);
              that.getView().byId("idSignUp_CL").setEnabled(true)
              that.getView().byId("idBtnOTP").setEnabled(false)
              sap.m.MessageToast.show('OTP validation successfull...!');
              this.getView().byId("idPhoneInput_CL").setEditable(false)
              // set otp input value state to none 
              oOtpInput.setValueState("None");
              // Proceed with further actions
            } else {
              // close the busy dailog
              that._oValidatingBusyDialog.close();
              oOtpInput.setValueState(sap.ui.core.ValueState.Error);
              oOtpInput.setValueStateText("Invalid OTP");
              sap.m.MessageToast.show('Invalid OTP...!');
            }
          }.bind(that),
          error: function (xhr, status, error) {
            that._oValidatingBusyDialog.close();
            console.error('Error verifying OTP:', error);
            sap.m.MessageToast.show('Failed to verify OTP: ' + error);
          }
        });
      }
    });
  });


