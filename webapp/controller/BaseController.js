sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"

], function (Controller, Fragment) {
    'use strict';

    return Controller.extend("com.app.rfapp.controller.BaseController", {
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },
        onInit: function () {
           
        },
        applyStoredProfileImage: async function () {
            var oView = this.getView();
            const userId = this.ID; // Assuming this.ID holds the user ID
            var sEntityPath = `/RESOURCESSet('${userId}')`; // Entity path for user-specific data
            var oModel = this.getOwnerComponent().getModel();
        
            try {
                const userData = await new Promise((resolve, reject) => {
                    oModel.read(sEntityPath, {
                        success: (oData) => resolve(oData),
                        error: (oError) => reject(oError)
                    });
                });
        
                // Extract the profile image from the `Profileimage` field
                const storedImage = userData.Profileimage;
                // Add the Base64 prefix if missing
                const imageSrc = `data:image/png;base64,${storedImage}`;
        
                // Find all `sap.m.Avatar` controls in the view
                var allAvatars = oView.findElements(true, function (element) {
                    return element.isA("sap.m.Avatar");
                });
        
                // Apply the stored image to each avatar
                allAvatars.forEach(function (avatar) {
                    avatar.setSrc(imageSrc);
                });
        
                //sap.m.MessageToast.show("Profile image applied successfully.");
            } catch (error) {
                //sap.m.MessageToast.show("Failed to apply profile image.");
                console.error("Error fetching user data:", error);
            }
        },
            //  read call
            readData: function (oModel, sPath, aFilters, aSorters) {
                return new Promise((resolve, reject) => {
                    oModel.read(sPath, {
                        filters: [aFilters], // Apply any filters (optional)
                        sorters: [aSorters], // for sorting
                        success: function (oData) {
                            resolve(oData); // Resolve with the response
                        },
                        error: function (oError) {
                            reject(oError); // Reject with the error
                        }
                    });
                });
            },
            
        createData: function (oModel, oPayload, sPath) {
            return new Promise((resolve, reject) => {
                oModel.create(sPath, oPayload, {
                    refreshAfterChange: true,
                    success: function (oSuccessData) {
                        resolve(oSuccessData);
                    },
                    error: function (oErrorData) {
                        reject(oErrorData)
                    }
                })
            })
        },
        deleteData: function (oModel, sPath, ID) {
            return new Promise((resolve, reject) => {
                oModel.remove(`${sPath}/${ID}`, {
                    success: function (oSuccessData) {
                        resolve(oSuccessData);
                    },
                    error: function (oErrorData) {
                        reject(oErrorData)
                    }
                })
            })
        },
        loadFragment: async function (sFragmentName) {
            const oFragment = await Fragment.load({
                id: this.getView().getId(),
                name: `com.app.rfapp.fragments.${sFragmentName}`,
                controller: this
            });
            this.getView().addDependent(oFragment);
            return oFragment
        },
        onPressAvatarEveryTileHelperFunction: function (oEvent) {
            var oComponent = this.getOwnerComponent();

            // Destroy the existing popover if it exists
            if (oComponent.getPopover()) {
                oComponent.getPopover().destroy();
                oComponent.setPopover(null);
            }
            this.onPressAvatarPopOverBaseFunction(oEvent, {
                showAccountDetails: true,
                showSignOut: true
            });
            //Profile image updating(from BaseController)...
            this.applyStoredProfileImage();
        },
        //Base function for opening the Profile PopOver..
        onPressAvatarPopOverBaseFunction: function (oEvent, oPopoverContext) {
            debugger;
            var This = this;
            var oView = this.getView();
            var oModel1 = this.getOwnerComponent().getModel();
            var oComponent = this.getOwnerComponent();

            //Default popover visibility model
            var oPopoverVisibility = {
                showAccountDetails: oPopoverContext?.showAccountDetails || false,
                showEditTile: oPopoverContext?.showEditTile || false,
                showDefaultSettings: oPopoverContext?.showDefaultSettings || false,
                showThemes: oPopoverContext?.showThemes || false,
                // showLanguage: oPopoverContext?.showLanguage || false,
                showTileView: oPopoverContext?.showTileView || false,
                showHelp: oPopoverContext?.showHelp || false,
                showSignOut: oPopoverContext?.showSignOut || false
            };
            //Create a model for popover visibility
            var oPopoverVisibilityModel = new sap.ui.model.json.JSONModel(oPopoverVisibility);

            oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                success: function (oData) {
                    if (oData.Users.toLowerCase() === "resource") {
                        // Prepare the profile data
                        var oProfileData = {
                            Name: oData.Resourcename,
                            Number: oData.Phonenumber
                        };
                        var oProfileModel = new sap.ui.model.json.JSONModel(oProfileData);

                        if (This._oPopover) {
                            This._oPopover.destroy();
                            This._oPopover = null;
                        }

                        This._oPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.ProfileDialog", This);
                        oView.addDependent(This._oPopover);
                        This._oPopover.setModel(oProfileModel, "profile");
                        This._oPopover.setModel(oPopoverVisibilityModel, "popoverModel");

                        // Save the new popover instance in the component
                        oComponent.setPopover(This._oPopover);

                        // Open the popover near the avatar after the data is set
                        This._oPopover.openBy(oEvent.getSource());
                    } else {
                        sap.m.MessageToast.show("User is not a resource.");
                    }
                },
                error: function () {
                    sap.m.MessageToast.show("User does not exist");
                }
            });
            // Set the visibility model to the popover even before opening (if needed)
            if (This._oPopover) {
                This._oPopover.setModel(oPopoverVisibilityModel, "popoverModel");
            }
            //this.applyStoredProfileImage();
        },
        //Account Details press function from popover
        onPressAccountDetails: async function () {
            const oModel1 = this.getOwnerComponent().getModel();
            const userId = this.ID;

            // Fetch user details from the backend
            await new Promise((resolve, reject) => {
                oModel1.read(`/RESOURCESSet('${userId}')`, {
                    success: function (oData) {
                        const userDetails = oData; // Adjust this based on your data structure
                        // Set user data in a new model or update existing model
                        const oUserModel = new sap.ui.model.json.JSONModel(userDetails);
                        this.getView().setModel(oUserModel, "oUserModel"); // Set the model with name
                        resolve();
                    }.bind(this), // Bind this to ensure the context is correct
                    error: function () {
                        MessageToast.show("Error loading user tiles");
                        reject();
                    }
                });
            });

            if (!this.UserDetailsFragment) {
                this.UserDetailsFragment = await this.loadFragment("UserDetails"); // Load your fragment asynchronously
            }
            this.UserDetailsFragment.open();
            //Profile image updating(from BaseController)...
            this.applyStoredProfileImage();
        },
        onPressDeclineProfileDetailsDailog: function () {
            if (this.UserDetailsFragment) {
                this.UserDetailsFragment.close();
            }
            this.onPressCancelProfileDetails();
        },
        //Hover Effect btn function(from Popover)...
        onPressPopoverProfileImageAvatar: function () {
            var This = this;
            const oModel = This.getOwnerComponent().getModel();
            const userId = This.ID;
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
                        if (!selectedImageBase64) {
                            sap.m.MessageToast.show("Failed to read the selected image.");
                            return;
                        }
                        //localStorage.removeItem("userProfileImage");
                        //localStorage.setItem("userProfileImage", selectedImageBase64);
        
                        // Update all avatar images with the new base64 image
                        This.updateAllAvatarImages(selectedImageBase64);
        
                        // Clean the Base64 data for backend storage
                        const cleanBase64 = selectedImageBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                        const oPayload = {
                            Profileimage: cleanBase64
                        };
        
                        try {
                            await new Promise((resolve, reject) => {
                                oModel.update(`/RESOURCESSet('${userId}')`, oPayload, {
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
        //Upload btn from the dailog..
        onPressUploadProfilePic: async function () {
            var This = this;
            const oModel = This.getOwnerComponent().getModel();
            const userId = This.ID;
        
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
        
                        // Update all avatar images with the new base64 image
                        This.updateAllAvatarImages(selectedImageBase64);
                        //localStorage.setItem("userProfileImage", selectedImageBase64);
                        const cleanBase64 = selectedImageBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        
                        const oPayload = {
                            Profileimage: cleanBase64
                        };
                        await new Promise((resolve, reject) => {
                            oModel.update(`/RESOURCESSet('${userId}')`, oPayload, {
                                success: resolve,
                                error: reject
                            });
                        });
                    };
                    // Read the selected file as a Data URL (base64 string)
                    reader.readAsDataURL(selectedFile);
                } else {
                    sap.m.MessageToast.show("Please select an image to upload.");
                }
            });
            fileInput.click();
        },
        updateAllAvatarImages: function (imageBase64) {
            var This = this;
            var oView = This.getView();

            // Find all avatar controls by checking if they are instances of sap.m.Avatar
            var allAvatarImages = oView.findElements(true, function (element) {
                return element.isA("sap.m.Avatar");
            });

            // Loop through all found avatar controls and update their image source
            allAvatarImages.forEach(function (avatarControl) {
                avatarControl.setSrc(imageBase64);
            });
            //window.location.reload();
        },
        //Deleting the Profile Images...
        onPressDeleteProfilePic: async function () {
            const This = this;
            const oModel = This.getOwnerComponent().getModel();
            const userId = This.ID;
            try {
                const sEntityPath = `/RESOURCESSet('${userId}')`;
                const userData = await new Promise((resolve, reject) => {
                    oModel.read(sEntityPath, {
                        success: (oData) => resolve(oData),
                        error: (oError) => reject(oError)
                    });
                });
        
                if (userData.Profileimage) {
                    const oPayload = {
                        Profileimage: "" // Clear the field in the backend
                    };
        
                    await new Promise((resolve, reject) => {
                        oModel.update(sEntityPath, oPayload, {
                            success: resolve,
                            error: reject
                        });
                    });
        
                    // Clear the image from UI and local storage
                    This.clearAllAvatarImages();
                    //localStorage.removeItem("userProfileImage");
                    sap.m.MessageToast.show("Profile image removed successfully!");
                } else {
                    sap.m.MessageToast.show("No profile image found to delete.");
                }
            } catch (oError) {
                console.error("Error deleting profile image:", oError);
            }
        },
        clearAllAvatarImages: function () {
            var This = this;
            var oView = This.getView();

            var allAvatarImagesRemoving = oView.findElements(true, function (element) {
                return element.isA("sap.m.Avatar");
            });

            // Loop through all found avatar controls and update their image source
            allAvatarImagesRemoving.forEach(function (avatarControl) {
                avatarControl.setSrc("");
            });
            window.location.reload();
        },
        //Edit Btn for Profile details changing...
        onPressEditProfileDetails: function () {
            this._originalName = this.byId("idInputTextResouname_ResourcePage").getText();
            this._originalPhone = this.byId("idInputUserphone_ResourcePage").getText();
            this._originalEmail = this.byId("idInputEmailUserDetails_ResourcePage").getText();

            // Hide view-only fields and show editable input fields
            this.byId("idInputTextResouname_ResourcePage").setVisible(false);
            this.byId("idInputUserphone_ResourcePage").setVisible(false);
            this.byId("idInputEmailUserDetails_ResourcePage").setVisible(false);

            this.byId("idFrontandInputName_ResourcePage").setVisible(true).setValue(this._originalName);
            this.byId("idFrontandInputPhoneNumber_ResourcePage").setVisible(true).setValue(this._originalPhone);
            this.byId("idFrontandInputEmail_ResourcePage").setVisible(true).setValue(this._originalEmail);

            // Toggle button visibility
            this.byId("idBtnUploadImageforProfile").setVisible(false);
            this.byId("idBtnDeleteImageforProfile").setVisible(false);
            this.byId("idBtnEditDetailsforProfile").setVisible(false);
            this.byId("idBtnSaveProfileDetails").setVisible(true);
            this.byId("idBtnCancelProfileDetails").setVisible(true);
        },
        onPressSaveProfileDetails: async function () {
            debugger
            var userId = this.ID; // Assuming this is defined as the user ID for the current session
            var oModel = this.getOwnerComponent().getModel();

            // Get the input values
            var sName = this.byId("idFrontandInputName_ResourcePage").getValue();
            var sPhone = this.byId("idFrontandInputPhoneNumber_ResourcePage").getValue();
            var sEmail = this.byId("idFrontandInputEmail_ResourcePage").getValue();

            var bValid = true;

            // Check for empty or too-short values in Name field
            if (!sName || sName.length < 3) {
                this.byId("idFrontandInputName_ResourcePage").setValueState(sap.ui.core.ValueState.Error);
                this.byId("idFrontandInputName_ResourcePage").setValueStateText(sName ? "Name should be at least 3 letters!" : "Name is required!");
                bValid = false;
            } else {
                this.byId("idFrontandInputName_ResourcePage").setValueState(sap.ui.core.ValueState.None);
            }

            // Check for empty or too-short values in Phone field
            var phoneRegex = /^\d{10}$/;
            if (!sPhone || sPhone.length < 3 || !phoneRegex.test(sPhone)) {
                this.byId("idFrontandInputPhoneNumber_ResourcePage").setValueState(sap.ui.core.ValueState.Error);
                this.byId("idFrontandInputPhoneNumber_ResourcePage").setValueStateText(sPhone ? "Phone number should be 10 digits!" : "Phone number is required!");
                bValid = false;
            } else {
                this.byId("idFrontandInputPhoneNumber_ResourcePage").setValueState(sap.ui.core.ValueState.None);
            }

            // Check for empty or too-short values in Email field
            var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!sEmail || sEmail.length < 3 || !emailRegex.test(sEmail)) {
                this.byId("idFrontandInputEmail_ResourcePage").setValueState(sap.ui.core.ValueState.Error);
                this.byId("idFrontandInputEmail_ResourcePage").setValueStateText(sEmail ? "Invalid email format!" : "Email is required!");
                bValid = false;
            } else {
                this.byId("idFrontandInputEmail_ResourcePage").setValueState(sap.ui.core.ValueState.None);
            }

            // If any field is invalid, show an error message and return
            if (!bValid) {
                sap.m.MessageBox.error("Please correct the highlighted errors.");
                return;
            }


            // Retrieve all resources for validation
            var sEntityPath = `/RESOURCESSet('${userId}')`;
            try {
                const currentUserData = await new Promise((resolve, reject) => {
                    oModel.read(sEntityPath, {
                        success: (oData) => resolve(oData),
                        error: (oError) => reject(oError)
                    });
                });

                // Check if the phone number has been changed
                if (currentUserData.Phonenumber !== sPhone) {
                    const existingResources = await new Promise((resolve, reject) => {
                        oModel.read(`/RESOURCESSet`, {
                            success: (oData) => resolve(oData.results),
                            error: (oError) => reject(oError)
                        });
                    });

                    // Check if the new phone number is already used by another resource
                    if (existingResources.some(resource => resource.Phonenumber === sPhone && resource.Resourceid !== userId)) {
                        sap.m.MessageBox.error("Phone number is already used. Please enter a different phone number.");
                        return;
                    }
                }

                // Proceed with updating the resource details
                var sEntityPath = `/RESOURCESSet('${userId}')`;
                var oPayload = {
                    Resourcename: sName,
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
                this.byId("idBtnSaveProfileDetails").setVisible(false);
                this.byId("idBtnCancelProfileDetails").setVisible(false);
                this.byId("idBtnEditDetailsforProfile").setVisible(true);
                this.byId("idBtnUploadImageforProfile").setVisible(true);
                this.byId("idBtnDeleteImageforProfile").setVisible(true);
                this.byId("idFrontandInputName_ResourcePage").setVisible(false);
                this.byId("idFrontandInputPhoneNumber_ResourcePage").setVisible(false);
                this.byId("idFrontandInputEmail_ResourcePage").setVisible(false);
                this.byId("idInputTextResouname_ResourcePage").setVisible(true);
                this.byId("idInputUserphone_ResourcePage").setVisible(true);
                this.byId("idInputEmailUserDetails_ResourcePage").setVisible(true);
            } catch (error) {
                sap.m.MessageToast.show("Error updating profile or fetching data.");
            }
        },
        //Cancel the Profile Details Changing...
        onPressCancelProfileDetails: function () {
            this.byId("idInputTextResouname_ResourcePage").setText(this._originalName).setVisible(true);
            this.byId("idInputUserphone_ResourcePage").setText(this._originalPhone).setVisible(true);
            this.byId("idInputEmailUserDetails_ResourcePage").setText(this._originalEmail).setVisible(true);

            // Hide editable input fields
            this.byId("idFrontandInputName_ResourcePage").setVisible(false);
            this.byId("idFrontandInputPhoneNumber_ResourcePage").setVisible(false);
            this.byId("idFrontandInputEmail_ResourcePage").setVisible(false);

            // Restore button visibility
            this.byId("idBtnUploadImageforProfile").setVisible(true);
            this.byId("idBtnDeleteImageforProfile").setVisible(true);
            this.byId("idBtnEditDetailsforProfile").setVisible(true);
            this.byId("idBtnSaveProfileDetails").setVisible(false);
            this.byId("idBtnCancelProfileDetails").setVisible(false);
        },

    })

});