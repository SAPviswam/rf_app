sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"

], function (Controller, Fragment) {
    'use strict';

    return Controller.extend("com.app.rfapp.controller.BaseController", {
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
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

        //Base function for opening the Profile PopOver..
        onPressAvatarPopOverBaseFunction: function (oEvent, oPopoverContext) {
            debugger;
            var This = this;
            var oView = this.getView();
            var oModel1 = this.getOwnerComponent().getModel();

            // Default popover visibility model
            var oPopoverVisibility = {
                showAccountDetails: oPopoverContext?.showAccountDetails || false,
                showEditTile: oPopoverContext?.showEditTile || false,
                showDefaultSettings: oPopoverContext?.showDefaultSettings || false,
                showThemes: oPopoverContext?.showThemes || false,
                showLanguage: oPopoverContext?.showLanguage || false,
                showTileView: oPopoverContext?.showTileView || false,
                showHelp: oPopoverContext?.showHelp || false,
                showSignOut: oPopoverContext?.showSignOut || false
            };            
            // Create a model for popover visibility
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

                        if (!This._oPopover) {
                            This._oPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.ProfileDialog", This);
                            oView.addDependent(This._oPopover);
                        }
                        // Set both the profile and visibility models to the popover
                        This._oPopover.setModel(oProfileModel, "profile");
                        This._oPopover.setModel(oPopoverVisibilityModel, "popoverModel");

                        // Open the popover near the avatar after the data is set
                        This._oPopover.openBy(oEvent.getSource());

                        // // Apply the stored profile pic for the PopOver (if available)
                        // var sStoredProfileImage = localStorage.getItem("userProfileImage");
                        // if (sStoredProfileImage) {
                        //     var oProfilepicPopOverPerson = This._oPopover.getAggregation("content")[0].getItems()[0].getItems()[0];
                        //     if (oProfilepicPopOverPerson) {
                        //         oProfilepicPopOverPerson.setSrc(sStoredProfileImage);
                        //     }
                        // }
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
        },
        //from Popover click function...
        onPressPopoverProfileImageAvatar: function () {
            debugger
            var fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.style.display = "none";

            // Add event listener to handle the file selection
            fileInput.addEventListener("change", (event) => {
                var selectedFile = event.target.files[0];
                if (selectedFile) {
                    var oReader = new FileReader();
                    // Set up the onload event for FileReader
                    oReader.onload = (oEvent) => {
                        var sBase64Image = oEvent.target.result;
                        var oImageControl1 = this._oDialog.mAggregations.content[0].mAggregations.items[0];
                        var oImageControl2 = this._oPopover.mAggregations.content[0]._aElements[0].mAggregations.items[0].mAggregations.items[0];
                        var oImageControl3 = this.oView.mAggregations.content[0].mAggregations.pages[0].mAggregations.header.mAggregations.content[8];

                        // Set the image sources for the controls
                        oImageControl1.setSrc(sBase64Image);
                        oImageControl2.setSrc(sBase64Image);
                        oImageControl3.setSrc(sBase64Image);

                        // Store the image in localStorage
                        localStorage.setItem("userProfileImage", sBase64Image);
                        MessageToast.show("Profile image updated successfully!");
                    };
                    // Read the selected file as a Data URL (base64 string)
                    oReader.readAsDataURL(selectedFile);
                } else {
                    MessageToast.show("Please select an image to upload.");
                }
            });
            fileInput.click();
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
            // var sStoredProfileImage = localStorage.getItem("userProfileImage");
            // if (sStoredProfileImage) {
            //     var oProfileAvatarControl = this._oDialog.mAggregations.content[0].mAggregations.items[0];
            //     if (oProfileAvatarControl) {
            //         oProfileAvatarControl.setSrc(sStoredProfileImage);  // Set the stored image as the Avatar source
            //     }
            // }
        },
        onPressDeclineProfileDetailsDailog: function () {
            if (this.UserDetailsFragment) {
                this.UserDetailsFragment.close();
            }
        },
        //Dailog Changing the profile pic...
        onPressUploadProfilePic: function () {
            debugger;
            var This = this;
            var fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.style.display = "none";

            // Add an event listener to handle the file selection
            fileInput.addEventListener("change", (event) => {
                var selectedFile = event.target.files[0];
                if (selectedFile) {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        var selectedImageBase64 = e.target.result; // Get the base64 encoded image

                        //var oImageControl1 = this._oDialog.mAggregations.content[0].mAggregations.items[0];
                        //var oImageControl2 = this._oPopover.mAggregations.content[0]._aElements[0].mAggregations.items[0].mAggregations.items[0];
                        var oHomePageImageControl = this.byId("id_GenAvatar1PageHome");
                        var oResourcePageImageControl = this.byId("id_GenAvatar1P");
                        var oInitialScreenImageControl = this.byId("IDRAvatarInitialScreenView");

                        // Set the src for each image control
                        // if (oImageControl1) {
                        //     oImageControl1.setSrc(selectedImageBase64);
                        // }
                        // if (oImageControl2) {
                        //     oImageControl2.setSrc(selectedImageBase64);
                        // }
                        if (oHomePageImageControl) {
                            oHomePageImageControl.setSrc(selectedImageBase64);
                        }
                        if (oResourcePageImageControl) {
                            oResourcePageImageControl.setSrc(selectedImageBase64);
                        }
                        if (oInitialScreenImageControl) {
                            oInitialScreenImageControl.setSrc(selectedImageBase64);
                        }

                        // Store the image in localStorage
                        localStorage.setItem("userProfileImage", selectedImageBase64);
                        sap.m.MessageToast.show("Profile image updated successfully!");
                    };
                    reader.readAsDataURL(selectedFile);
                }
            });

            fileInput.click();
        },
        //Deleting the Profile Images...
        onPressDeleteProfilePic: function () {
            var oHomePageImageControl = this.byId("id_GenAvatar1PageHome");
            var oResourcePageImageControl = this.byId("id_GenAvatar1P");
            var oInitialScreenImageControl = this.byId("IDRAvatarInitialScreenView");
            oHomePageImageControl.setSrc("");
            oResourcePageImageControl.setSrc("");
            oInitialScreenImageControl.setSrc("");
            localStorage.removeItem("userProfileImage");
            sap.m.MessageToast.show("Profile image deleted successfully!");
        },

    })

});