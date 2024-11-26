sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",

  ],
  function (Controller, ODataModel, MessageBox, MessageToast) {

    "use strict";

    return Controller.extend("com.app.rfapp.controller.ConfigLogin", {
      onInit: function () {

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

      onpressSignup: function () {
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
        // 
        if (!oPayload.Phonenumber || oPayload.Phonenumber.length !== 10 || !/^\d+$/.test(oPayload.Phonenumber)) {
          oUserView.byId("idPhoneInput_CL").setValueState("Error");
          oUserView.byId("idPhoneInput_CL").setValueStateText("please enter 10 digit number");
          flag = false;
        } else {
          oUserView.byId("idPhoneInput_CL").setValueState("None");
        }
        if (!oPayload.Password || oPayload.Password.length !== 8) {
          oUserView.byId("idPassswordInput_CP").setValueState("Error");
          oUserView.byId("idPassswordInput_CP").setValueStateText("Password length must be 8 characters");
          flag = false;
        } else {
          oUserView.byId("idPassswordInput_CP").setValueState("None");
        }

        if (!flag) {
          MessageToast.error("Please enter correct data");
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
            MessageToast.error("Failed to fetch data. Please try again.");
            return
          }
          await this.createData(oModel, oPayload, "/APP_LOGON_DETAILSSet");
          MessageToast.success("Record created successfully!");
          that.getView().byId("idSignUp_CP").setEnabled(false)
          that.getView().getModel("ODataModel").setProperty("/appLoginData", {});
        } catch (error) {
          MessageToast.error("Failed to create record. Please try again.", error.message || error.responseText || "Unknown error occurred.");
        }
      },
      onCancleSignup: function () {
        this.getView().byId("idconnecttsosapDetailsForm_CP").setVisible(false)
        this.getView().byId("idPaddingBox_configPage").setVisible(true)
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
        const accountSid = 'ACd2aa0faa93339ceb8b1f3aad47fc1c80'; // Replace with your Twilio Account 
        const authToken = 'f1cf11fa75eefd1d2bc7640fc23639f3'; // Replace with your Twilio Auth Token
        const serviceSid = 'VA86b64328119f75c18392bdd98fd32546'; // Replace with your Twilio Verify Service SID
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
            sap.m.MessageToast.show('Its not you its me Failed to send OTP')
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
        const accountSid = 'ACd2aa0faa93339ceb8b1f3aad47fc1c80'; // Replace with your Twilio Account SID
        const authToken = 'f1cf11fa75eefd1d2bc7640fc23639f3'; // Replace with your Twilio Auth Token
        const serviceSid = 'VA86b64328119f75c18392bdd98fd32546'; // Replace with your Twilio Verify Service SID
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
              // close the busy dailog
              that._oBusyDialog.close();
              // hide the validattion elements
              that.getView().byId("idOTPHBox").setVisible(false)
              that.getView().byId("idOTPInput_CL").setValue("")
              oMobileinput.setValueState(sap.ui.core.ValueState.Success);
              that.getView().byId("idSignUp_CP").setEnabled(true)
              sap.m.MessageToast.show('OTP validation successfull...!');
              // set otp input value state to none 
              oOtpInput.setValueState("none");
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
            this._oBusyDialog.close();
            console.error('Error verifying OTP:', error);
            sap.m.MessageToast.show('Failed to verify OTP: ' + error);
          }
        });
      }
    });
  });


