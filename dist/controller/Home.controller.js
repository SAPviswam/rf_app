sap.ui.define(["./BaseController","sap/m/MessageBox","sap/m/MessageToast","sap/ui/core/BusyIndicator","sap/ui/Device","sap/ui/core/UIComponent","sap/m/Popover","sap/ui/core/Fragment"],function(e,t,s,a,i,r,o,n){"use strict";return e.extend("com.app.rfapp.controller.Home",{onInit:function(){this.applyStoredProfileImage();this.isIPhone=/iPhone/i.test(navigator.userAgent);this.isTablet=/iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent);console.log(this.isTablet);this.bOtpVerified=false;const e=localStorage.getItem("warehouseNo");const t=localStorage.getItem("resource");if(e){this.byId("idHUInput").setValue(e)}if(t){this.byId("idUserIDInput").setValue(t)}if(i.system.tablet){this.getView().byId("idVBoxGif_HomeViewTab").setVisible(true);this.getView().byId("idVBoxGif_HomeView").setVisible(false);this.getView().byId("idVboxRfLogin_HomeView").addStyleClass("TextVboxForTab")}else if(i.system.phone){this.getView().byId("Homescreentitle").addStyleClass("titleMobile_home")}else{this.getView().byId("idVBoxGif_HomeViewTab").setVisible(false);this.getView().byId("idVboxRfLogin_HomeView").addStyleClass("ConfigBtnsHbox")}const s=this.getOwnerComponent().getRouter();s.attachRoutePatternMatched(this.onInitialDetailsLoad,this)},onSelectCheckBox:function(e){const t=e.getParameter("selected");if(t){const e=this.byId("idHUInput").getValue();const t=this.byId("idUserIDInput").getValue();localStorage.setItem("warehouseNo",e);localStorage.setItem("resource",t);s.show("Auto Save enabled. Your details will be saved.")}else{localStorage.removeItem("warehouseNo");localStorage.removeItem("resource");s.show("Auto Save disabled. Your details will not be saved.")}},onInitialDetailsLoad:async function(e){const{id:t}=e.getParameter("arguments");this.ID=t;var s=this.getView().byId("idUserIDInput").setValue(this.ID);s.setEditable(false)},onLoginPress:async function(){var e=this.getView();var t=e.byId("idHUInput").getValue();var a=e.byId("idUserIDInput").getValue();var i=e.byId("idPasswordInput").getValue();var r=this.getView().byId("idButtonSignUpcheckbox").getSelected();if(r){localStorage.setItem("username",a);localStorage.setItem("password",i);localStorage.setItem("autoSave","true")}else{localStorage.removeItem("username");localStorage.removeItem("password");localStorage.removeItem("autoSave")}if(!t){s.show("Please enter the Warehouse Number.");return}if(!a){s.show("Please enter the Resource ID.");return}if(!i){s.show("Please enter the Password.");return}var o=this.getOwnerComponent().getModel();var n=this;try{await o.read("/RESOURCESSet('"+a+"')",{success:function(e){if(e.Resourceid===a&&e.Password===i){if(e.Loginfirst===true){sap.m.MessageToast.show("Welcome! It seems this is your first login.");n.sample()}else{sap.m.MessageToast.show("Welcome back!");let t=e.Users.toLowerCase();if(t==="supervisor"){n.getRouter().navTo("Supervisor",{id:a},true)}else{n.getRouter().navTo("RouteResourcePage",{id:a},true)}}}else{s.show("Invalid Resource ID or Password.")}}.bind(this),error:function(){s.show("User does not exist.")}})}catch(e){s.show("An error occurred while checking the user.")}},onClearPress:function(){var e=this.getView();e.byId("idUserIDInput").setValue("");e.byId("idPasswordInput").setValue("")},onPressSignupBtn:function(){this.getView().byId("idVBoxInputFields_HomeView").setVisible(false);this.getView().byId("createResourceVbox").setVisible(true)},oncancelsignupPress:function(){this.getView().byId("idVBoxInputFields_HomeView").setVisible(true);this.getView().byId("createResourceVbox").setVisible(false)},onVerify:function(){var e=this.byId("idInputPhoneNumber").getValue();if(!e){sap.m.MessageToast.show("Please enter a valid phone number.");return}this.OnGenereateOTP(e);this.byId("idOtpInput").setVisible(true)},handleEscape:function(){this.byId("idOtpDialog").close()},onSubmitOtp:function(){var e=this.byId("idInputPhoneNumber");var t=this.byId("idOtpInput");var s=this.byId("verficationId");var a=this.byId("VerifyButton");var i=t.getValue();t.setValueState(sap.ui.core.ValueState.None);t.setValueStateText("");if(!i){t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Please enter the OTP.");sap.m.MessageToast.show("Please enter the OTP.");return}var r=/^\d{6}$/;if(!r.test(i)){t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Please enter a valid 6-digit OTP.");sap.m.MessageToast.show("Please enter a valid 6-digit OTP.");return}const o="AC2fb46ec1c11689b5cecea6361105c723";const n="f1ae977a8f46265e4078d48e6bbfa5b4";const u="VAdfa3a7c4613f48b5722f611bb2ef3b5d";const l=`https://verify.twilio.com/v2/Services/${u}/VerificationCheck`;const d={To:this._storedPhoneNumber,Code:i};$.ajax({url:l,type:"POST",headers:{Authorization:"Basic "+btoa(o+":"+n),"Content-Type":"application/x-www-form-urlencoded"},data:$.param(d),success:function(i){if(i.status==="approved"){sap.m.MessageToast.show("OTP verified successfully!");t.setValueState(sap.ui.core.ValueState.Success);e.setValueState(sap.ui.core.ValueState.Success);e.setEditable(false);s.setVisible(true);a.setVisible(false);t.setValueStateText("OTP verified successfully");this.bOtpVerified=true}else{t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Invalid OTP. Please try again.");sap.m.MessageToast.show("Invalid OTP. Please try again.");e.setValueState(sap.ui.core.ValueState.Error);e.setValueStateText("Recheck your Mobile Number")}}.bind(this),error:function(e,t,s){console.error("Error verifying OTP:",s);sap.m.MessageToast.show("Failed to verify OTP: "+s)}})},onSubmitPress:function(){var e=this.getView();var a=this.byId("idResouceType").getSelectedKey();var i=true;var r=true;var o=e.byId("idResourceIdInput").getValue();var n=e.byId("idUserNameInput").getValue();var u=e.byId("idInputEmail").getValue();var l=e.byId("idInputPhoneNumber").getValue();if(!a){e.byId("idResouceType").setValueState("Error");e.byId("idResouceType").setValueStateText("Select a valid Area");i=false;r=false}else{e.byId("idResouceType").setValueState("None")}if(!o){e.byId("idResourceIdInput").setValueState("Error");e.byId("idResourceIdInput").setValueStateText("Resource ID is mandatory");i=false;r=false}else if(!/^\d{6}$/.test(o)){e.byId("idResourceIdInput").setValueState("Error");e.byId("idResourceIdInput").setValueStateText("Resource ID must be a 6-digit numeric value");i=false}else{e.byId("idResourceIdInput").setValueState("None")}if(!n){e.byId("idUserNameInput").setValueState("Error");e.byId("idUserNameInput").setValueStateText("Username is mandatory");i=false;r=false}else{e.byId("idUserNameInput").setValueState("None")}if(!e.byId("idInputEmail").getValue()){}else if(!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(u)){e.byId("idInputEmail").setValueState("Error");e.byId("idInputEmail").setValueStateText("Please enter a valid email address");i=false}if(!l){e.byId("idInputPhoneNumber").setValueState("Error");e.byId("idInputPhoneNumber").setValueStateText("Phone number is mandatory");i=false;r=false}else if(l.length!==10||!/^\d+$/.test(l)){e.byId("idInputPhoneNumber").setValueState("Error");e.byId("idInputPhoneNumber").setValueStateText("Mobile number must be a 10-digit numeric value");i=false}else{e.byId("idInputPhoneNumber").setValueState("None");if(!this.bOtpVerified){sap.m.MessageToast.show("Please verify your phone number with the OTP before submitting.");return}}if(!r){sap.m.MessageToast.show("Please fill all mandatory details");return}if(!i){sap.m.MessageToast.show("Please enter correct data");return}var d=this.getView().getModel();var c=this;d.read("/RESOURCESSet('"+o+"')",{success:function(e){s.show("Resource exist")}.bind(this),error:function(){d.create("/RESOURCESSet",{Resourceid:o,Resourcetype:a,Validity:false,Resourcename:n,Email:u,Phonenumber:l},{success:function(){sap.m.MessageToast.show("Success");c.onCloseRegisterSubmitDialog()},error:function(e){var s=JSON.parse(e.responseText);t.error(s.error.message.value||"Error occurred while creating resource")}})}})},onClearRegisterSubmitDialog:function(){var e=this.getView();e.byId("idResourceIdInput").setValue("");e.byId("idUserNameInput").setValue("");e.byId("idInputEmail").setValue("");e.byId("idInputPhoneNumber").setValue("");e.byId("idInputPhoneNumber").setEditable(true);e.byId("VerifyButton").setVisible(true);e.byId("verficationId").setVisible(false);e.byId("idOtpInput").setVisible(false);e.byId("idOtpInput").setValue("");this.bOtpVerified=false;e.byId("idResouceType").setSelectedKey("")},sample:async function(){this.oResetDialog??=await this.loadFragment({name:"com.app.rfapp.fragments.Resetpassword"});this.oResetDialog.open()},formatDate:function(e){var t=e.getFullYear();var s=("0"+(e.getMonth()+1)).slice(-2);var a=("0"+e.getDate()).slice(-2);return`${t}-${s}-${a}`},onSavePress:async function(){var e=this.getView();var s=e.byId("idResetNewPassword").getValue();var a=e.byId("idresetConfirmPassword").getValue();if(a.length!==8||s.length!==8){t.error("Your Password length should be 8 characters.");return}if(s!==a){sap.m.MessageToast.show("Passwords do not match. Please try again.");return}var i=e.byId("idUserIDInput").getValue();var r={Loginfirst:false,Password:s};var o=this.getOwnerComponent().getModel();try{await o.update(`/RESOURCESSet('${i}')`,r,{success:function(){sap.m.MessageToast.show("Password updated successfully!");e.byId("idResetNewPassword").setValue("");e.byId("idresetConfirmPassword").setValue("");this.oResetDialog.close();e.byId("idUserIDInput").setValue("");e.byId("idPasswordInput").setValue("")}.bind(this),error:function(){sap.m.MessageToast.show("Error updating user login status.")}})}catch(e){sap.m.MessageToast.show("An error occurred while updating the password.")}},onCancelPress:function(){this.oResetDialog.close()},onPressConnectButton:function(){var e=this.getOwnerComponent().getModel();this.getView().getModel().refresh();e.read("/RESOURCESSet('"+this.ID+"')",{success:function(e){var t=e.Users.toLowerCase();if(t==="supervisor"||t==="manager"){this.getOwnerComponent().getRouter().navTo("Supervisor",{id:this.ID},Animation)}else{this.getOwnerComponent().getRouter().navTo("RouteResourcePage",{id:this.ID},Animation)}}.bind(this),error:function(){s.show("User doesn't exist")}})},oncreatesingupPress:function(){var e=this.getView();var a=e.byId("idFirstnameInput").getValue();var i=e.byId("idLastnameInput").getValue();var r=e.byId("idEmployeenoInput").getValue();var o=e.byId("idMobilenoInput").getValue();var n=e.byId("idEmailIDInput").getValue();var u=this.getSelectedResourceType();if(!a||!i||!r||!o||!u){s.show("Please fill all fields");return}if(!/^\d{10}$/.test(o)){s.show("Mobile number must be exactly 10 digits.");return}if(!this.validateEmail(n)){s.show("Please enter a valid email address. Example: example@domain.com");return}var l=this.getView().getModel();l.read("/RESOURCESSet",{filters:[new sap.ui.model.Filter("Resourceid",sap.ui.model.FilterOperator.EQ,r)],success:function(d){if(d.results.length>0){s.show("Employee No already exists. Please use a different Employee No.")}else{var c={Resourcename:a,Lname:i,Resourceid:r,Phonenumber:o,Email:n,Resourcetype:u};l.create("/RESOURCESSet",c,{success:function(){t.success("Woohoo!\nYour Request Has Been Placed");e.byId("idFirstnameInput").setValue("");e.byId("idLastnameInput").setValue("");e.byId("idEmployeenoInput").setValue("");e.byId("idMobilenoInput").setValue("");e.byId("idEmailIDInput").setValue("");e.byId("idinternal").setSelected(false);e.byId("idexternal").setSelected(false);e.byId("idothers").setSelected(false);e.byId("dialog").close()},error:function(){s.show("Error creating user. Please try again.")}})}},error:function(){s.show("Error checking existing Employee No. Please try again.")}})},validateEmail:function(e){var t=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;return t.test(e)},getSelectedResourceType:function(){var e=this.getView();if(e.byId("idinternal").getSelected()){return"Internal"}else if(e.byId("idexternal").getSelected()){return"External"}else if(e.byId("idothers").getSelected()){return"Others"}},onLogoutPressedInHomePage:function(){var e=r.getRouterFor(this);e.navTo("InitialScreen",{id:this.ID})},onBackBtnInHomePage:function(){var e=r.getRouterFor(this);e.navTo("InitialScreen",{id:this.ID})},onSignoutPressedInHomePage:function(){var e=r.getRouterFor(this);e.navTo("InitialScreen",{id:this.ID},true)},onSignoutPressed:function(){var e=r.getRouterFor(this);e.navTo("InitialScreen",{id:this.ID})}})});
//# sourceMappingURL=Home.controller.js.map