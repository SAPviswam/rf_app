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
      onInit: function () {
        // Loading of secrets
        const oConfigModel = this.getOwnerComponent().getModel("config");
        this.oTwilioConfig = oConfigModel.getProperty("/Twilio");

        var oModel = new ODataModel("/sap/opu/odata/sap/ZEWM_RFUI_SRV_01/", {
          headers: {
            "Authorization": "Basic" + btoa("sreedhars:Sreedhar191729"),
            "sap-client": "100"
          }
        });
        this.getView().setModel(oModel);

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

      },

      onpresslogin: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("InitialScreen");
      },


      onForgotPasswordPress: async function () {
        if (!this.forgotPass) {
          this.forgotPass = await this.loadFragment("ForgotPassword");
        }
        this.forgotPass.open()
      },
      onForgotPasswordCancel: function () {
        if (this.forgotPass.isOpen()) {
          this.forgotPass.close()
        }
      },
      // test
      onUpdatePasswordPress: async function () {
        const oModel = this.getOwnerComponent().getModel(),
          sPath = "/APP_LOGON_DETAILSSet",
          sUserEnteredUserID = this.getView().byId("idUserIDInput_CL").getValue(),
          sUserEnteredMobile = this.getView().byId("idRegNumbInput_CL").getValue();
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
              sRegisteredPhnNumber = oResponse.results[0].Phonenumber;
              
            if (sRegisteredUserID === sUserEnteredUserID && sRegisteredPhnNumber === sUserEnteredMobile) {

              sap.m.MessageToast.show("Success User Authenticated")
              // get the actual password
              const sNewPassword = this.getView().byId("idPasswordInput_CL").getValue();

              // Use SHA256 for hashing (CryptoJS)
              const sEncrytpedPass = CryptoJS.SHA256(sNewPassword).toString(); // encryption with CryptoJS
              const oPayload = {
                Password: sEncrytpedPass
              }
              try {

                // last change here.... (working with update call)
                 
                const sUpdatePath = `/APP_LOGON_DETAILSSet('${sUserEnteredUserID}')`
                // update call
               const oResponse =  await this.updateData(oModel, sUpdatePath, oPayload);
                // success 
              sap.m.MessageToast.show("Success User Authenticated")

              } catch (error) {
                
              }
            } else {
              sap.m.MessageToast.show("Failed to Authenticate ID and phn number missmatch")
            }
          } else {
            sap.m.MessageToast.show("No records Found")
          }

        } catch (error) {
          sap.m.MessageToast.show("Failed to read data " + error)
        }



      },
      // test

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
        if (!oPayload.Firstname || oPayload.Firstname.length < 3) {
          oUserView.byId("idFirstnameInput_CL").setValueState("Error");
          oUserView.byId("idFirstnameInput_CL").setValueStateText("first name must contain 3 characters");
          flag = false;
        } else {
          oUserView.byId("idFirstnameInput_CL").setValueState("None");
        }
        if (!oPayload.Lastname || oPayload.Lastname.length < 3) {
          oUserView.byId("idLName_Input_CL").setValueState("Error");
          oUserView.byId("idLName_Input_CL").setValueStateText("last name must contain 3 characters");
          flag = false;
        } else {
          oUserView.byId("idLName_Input_CL").setValueState("None");
        }
        if (!oPayload.Email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(oPayload.Email)) {
          oUserView.byId("idEmailAddInput_CL").setValueState("Error");
          oUserView.byId("idEmailAddInput_CL").setValueStateText("Enter Correct E-Mail address");
          flag = false;
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
        if (!oPayload.Password || oPayload.Password.length < 8) {
          oUserView.byId("idPassswordInput_CL").setValueState("Error");
          oUserView.byId("idPassswordInput_CL").setValueStateText("Password length must be 8 characters");
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
            // const aSorters = [new sap.ui.model.Sorter("Userid", false)]; // sorting--> 'false' for ascending, 'true' for descending
            const oResponse = await this.readData(oModel, sPath);

            // Accessing the data in the response
            const aResults = oResponse.results,
              recordsLength = aResults.length,
              currentMaxID = aResults[recordsLength - 1].Userid

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
          that.getView().byId("idSignUp_CL").setEnabled(false)
          // set the empty data after successful creation
          that.getView().getModel("ODataModel").setProperty("/appLoginData", {});
          // set the inputfield states to defult 
          that.onDefaultStates();
        } catch (error) {
          sap.m.MessageToast.show("Failed to create record. Please try again.", error.message || error.responseText || "Unknown error occurred.");
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
        if (!this._oBusyDialog) {
          this._oBusyDialog = new sap.m.BusyDialog({
            text: "Please wait while validatiing OTP"
          });
        }
        // Open the Busy Dialog
        this._oBusyDialog.open();

        const oMobileinput = this.byId("idPhoneInput_CL"),
          oOtpInput = this.byId("idOTPInput_CL"),
          sEnteredOtp = oOtpInput.getValue();

        // Basic validation: Check if OTP is entered
        if (!sEnteredOtp) {
          oOtpInput.setValueState(sap.ui.core.ValueState.Error);
          oOtpInput.setValueStateText("Please enter OTP");
          sap.m.MessageToast.show("Please enter OTP")
          this._oBusyDialog.close();
          return;
        }

        // Validate OTP: It should be exactly 6 digits
        var otpRegex = /^\d{6}$/;
        if (!otpRegex.test(sEnteredOtp)) {
          oOtpInput.setValueState(sap.ui.core.ValueState.Error);
          oOtpInput.setValueStateText("Please enter a valid 6-digit OTP.");
          this._oBusyDialog.close();
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
              that._oBusyDialog.close();
              // hide the validattion elements
              that.getView().byId("idOTPHBox").setVisible(false)
              that.getView().byId("idOTPInput_CL").setValue("")
              oMobileinput.setValueState(sap.ui.core.ValueState.Success);
              that.getView().byId("idSignUp_CL").setEnabled(true)
              that.getView().byId("idBtnOTP").setEnabled(false)
              sap.m.MessageToast.show('OTP validation successfull...!');
              // set otp input value state to none 
              oOtpInput.setValueState("None");
              // Proceed with further actions
            } else {
              // close the busy dailog
              that._oBusyDialog.close();
              oOtpInput.setValueState(sap.ui.core.ValueState.Error);
              oOtpInput.setValueStateText("Invalid OTP");
              sap.m.MessageToast.show('Invalid OTP...!');
            }
          }.bind(that),
          error: function (xhr, status, error) {
            that._oBusyDialog.close();
            console.error('Error verifying OTP:', error);
            sap.m.MessageToast.show('Failed to verify OTP: ' + error);
          }
        });
      }
    });
  });


