sap.ui.define([
    "./BaseController",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/m/GenericTile",
],
    function (Controller, Device, JSONModel, Popover, Button, library, MessageToast, UIComponent, Fragment, History, GenericTile) {

        "use strict";

        return Controller.extend("com.app.rfapp.controller.ResourcePage", {
            onInit: function () {



                this.genericTitleName = ''

                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoadResorcePage, this);


                // if (Device.system.phone) {
                //     this.getView().byId("IdTitle_ResourceView").addStyleClass("titleMobile_home");
                // }

                // Initialize JSON Model
                var oModel = new JSONModel();
                this.getView().setModel(oModel);

                // Load data asynchronously
                oModel.loadData(sap.ui.require.toUrl("com/app/rfapp/model/data.json"));
                oModel.attachRequestCompleted(function (oEvent) {
                    if (!oEvent.getParameter("success")) {
                        MessageToast.show("Failed to load data.");
                    }
                }.bind(this));
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoadResorcePage, this);

                this.Themecall = false;
                this.EditCall = false;
                this._currentTile = null;
                this._selectedTiles = [];
                //this.applyStoredProfileImage();
                this.byId("idBtnListViewResourcePage").setVisible(true);
                this.byId("idBtnGridViewResourcePage").setVisible(false);
            },
            // onResourceDetailsLoad: async function (oEvent1) {
            //     const { id } = oEvent1.getParameter("arguments");
            //     this.ID = id;
            // },

            onAfterRendering: function () {
                debugger
                // Apply stored background color
                // var sStoredBackgroundColor = localStorage.getItem("backgroundColor");
                // if (sStoredBackgroundColor) {
                //     this.applyBackgroundTheme(sStoredBackgroundColor, null);
                // }

                // // Apply stored background image
                // var sStoredBackgroundImage = localStorage.getItem("backgroundImage");
                // if (sStoredBackgroundImage) {
                //     this.applyBackgroundTheme(null, sStoredBackgroundImage);
                // }

                // Apply stored tile colors
                // var tileColors = JSON.parse(localStorage.getItem("tileColors") || "{}");
                // for (var sTileId in tileColors) {
                //     var sColor = tileColors[sTileId];
                //     var oTile = this.byId(this._extractLocalId(sTileId));

                //     if (oTile) {
                //         (function (oTile, sColor) {
                //             oTile.addEventDelegate({
                //                 onAfterRendering: function () {
                //                     var oTileDom = oTile.getDomRef();
                //                     if (oTileDom) oTileDom.style.backgroundColor = sColor;
                //                 }
                //             });
                //         })(oTile, sColor);
                //     }
                // }

                // // Apply stored tile images
                // var tileImages = JSON.parse(localStorage.getItem("tileImages") || "{}");
                // for (var sTileId in tileImages) {
                //     var sImageSrc = tileImages[sTileId];
                //     var oTile = this.byId(this._extractLocalId(sTileId));

                //     if (oTile) {
                //         (function (oTile, sImageSrc) {
                //             oTile.addEventDelegate({
                //                 onAfterRendering: function () {
                //                     var oTileDom = oTile.getDomRef();
                //                     if (oTileDom) {
                //                         oTileDom.style.backgroundImage = `url(${sImageSrc})`;
                //                         oTileDom.style.backgroundSize = "cover";
                //                         oTileDom.style.backgroundPosition = "center";
                //                         oTileDom.style.backgroundRepeat = "no-repeat";
                //                         oTileDom.style.backgroundAttachment = "fixed";
                //                     }
                //                 }
                //             });
                //         })(oTile, sImageSrc);
                //     }
                // }

                // Apply stored view setting
                // var sStoredView = localStorage.getItem("selectedView");
                // if (sStoredView) {
                //     var oTilesContainer = this.byId("idScrollContainer1");
                //     var aTiles = oTilesContainer.getContent();
                //     aTiles.forEach(function (oTile) {
                //         if (oTile.isA("sap.m.GenericTile")) {
                //             oTile.removeStyleClass("largeIcons");
                //             oTile.removeStyleClass("mediumIcons");
                //             oTile.removeStyleClass("smallIcons");

                //             switch (sStoredView) {
                //                 case "LargeIcons":
                //                     oTile.addStyleClass("largeIcons");
                //                     break;
                //                 case "MediumIcons":
                //                     oTile.addStyleClass("mediumIcons");
                //                     break;
                //                 case "SmallIcons":
                //                     oTile.addStyleClass("smallIcons");
                //                     break;
                //                 default:
                //                     break;
                //             }
                //         }
                //     });
                // }

                // Apply stored tile details (header and subheader)
                var tileIds = Object.keys(localStorage).filter(key => key.startsWith('tile_'));
                tileIds.forEach(function (tileKey) {
                    var tileId = tileKey.replace('tile_', '');
                    var storedTileData = JSON.parse(localStorage.getItem(tileKey));
                    var oTile = this.byId(this._extractLocalId(tileId));
                    if (oTile && storedTileData) {
                        oTile.setHeader(storedTileData.header || "");
                        oTile.setSubheader(storedTileData.subHeader || "");
                    }
                }.bind(this));
            },
            _extractLocalId: function (sTileId) {
                return sTileId.split("--").pop();
            },
            //This Function Calls from the Resource Details load function..(its taking little bit Time).
            handleUserDetailsBasedOnUserID: async function () {
                debugger;
                const userId = this.ID;
                const oModel = this.getOwnerComponent().getModel();
                const sEntityPath = `/RESOURCESSet('${userId}')`;
                const oMainContainer = this.byId("idScrollContainer1"); // Replace with your container ID
                const oMainContainerDom = oMainContainer ? oMainContainer.getDomRef() : null;

                try {
                    const userData = await new Promise((resolve, reject) => {
                        oModel.read(sEntityPath, {
                            success: resolve,
                            error: reject
                        });
                    });

                    // Destructure fields
                    const { Backgroundcolor, Backgroundimage, Tileviews, Multitilescolor } = userData;

                    // Apply background settings using ternary operator
                    if (oMainContainerDom) {
                        Backgroundimage
                            ? (oMainContainerDom.style.backgroundImage = `url(data:image/png;base64,${Backgroundimage})`,
                                oMainContainerDom.style.backgroundSize = "cover",
                                oMainContainerDom.style.backgroundPosition = "center",
                                oMainContainerDom.style.backgroundRepeat = "no-repeat",
                                oMainContainerDom.style.backgroundAttachment = "fixed")
                            : Backgroundcolor
                                ? (oMainContainerDom.style.backgroundColor = Backgroundcolor)
                                : null;
                    }

                    // Apply tile view settings
                    if (Tileviews) {
                        const oTilesContainer = this.byId("idScrollContainer1");
                        const aTiles = oTilesContainer.getContent();

                        aTiles.forEach((oTile) => {
                            if (oTile.isA("sap.m.GenericTile")) {
                                // Clear existing icon size classes
                                oTile.removeStyleClass("largeIcons");
                                oTile.removeStyleClass("mediumIcons");
                                oTile.removeStyleClass("smallIcons");

                                // Apply the relevant tile view class
                                switch (Tileviews) {
                                    case "LargeIcons":
                                        oTile.addStyleClass("largeIcons");
                                        break;
                                    case "MediumIcons":
                                        oTile.addStyleClass("mediumIcons");
                                        break;
                                    case "SmallIcons":
                                        oTile.addStyleClass("smallIcons");
                                        break;
                                    default:
                                        //sap.m.MessageToast.show("Unknown tile view setting.");
                                        break;
                                }
                            }
                        });
                    }
                    //Applying the saved colours for the Tiles...
                    if (Multitilescolor) {
                        const oTilesContainer = this.byId("idScrollContainer1");
                        const aTiles = oTilesContainer.getContent();
                        const tileColorArray = Multitilescolor.split(",").map((pair) => pair.split(":"));
                        aTiles.forEach((oTile) => {
                            oTile.addEventDelegate({
                                onAfterRendering: function () {
                                    const tileId = oTile.getId(); // Get the current tile's ID
                                    const oTileDomRef = oTile.getDomRef(); // Get the DOM reference of the tile
                                    // Find a match in tileColorArray
                                    tileColorArray.forEach(([id, color]) => {
                                        if (id === tileId) {
                                            oTileDomRef.style.backgroundColor = color; // Apply the matched color
                                        }
                                    });
                                }
                            });
                        });
                    }
                } catch (oError) {
                    //sap.m.MessageToast.show("Failed to retrieve user details.");
                    console.error("Error fetching user data:", oError);
                }
            },
            //CHATBOT
            onChatbotButtonPress: function () {
                window.open("https://cai.tools.sap/api/connect/v1/webclient/standalone/53c7e531-9483-4c3e-b523-b0bdf59df4a4", "_self");
            },
            //For Resetting the Default settings...
            onPressDefualtSettings: async function () {
                debugger
                const oModel = this.getOwnerComponent().getModel();
                const userId = this.ID;
                const sEntityPath = `/RESOURCESSet('${userId}')`;
                // const userData = await new Promise((resolve, reject) => {
                //     oModel.read(sEntityPath, {
                //         success: resolve,
                //         error: reject
                //     });
                // });
                sap.m.MessageBox.warning("Reset to default settings?", {
                    title: "Default Settings",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    onClose: async function (status) {
                        if (status === sap.m.MessageBox.Action.OK) {
                            try {
                                // Clear local storage
                                localStorage.clear();
                                // Prepare the payload to reset backend data
                                const oPayload = {
                                    Backgroundcolor: "",
                                    Backgroundimage: "",
                                    Tileviews: "",
                                    Profileimage: "",
                                    Multitilescolor: ""
                                };
                                // Update the backend with empty/default values
                                await new Promise((resolve, reject) => {
                                    oModel.update(sEntityPath, oPayload, {
                                        success: resolve,
                                        error: reject
                                    });
                                });
                                window.location.reload();
                                sap.m.MessageToast.show("Settings resetting to default, Please wait!");
                            } catch (oError) {
                                //sap.m.MessageToast.show("Failed to reset settings on the backend.");
                                console.error("Error resetting backend data:", oError);
                            }
                        } else {
                            sap.m.MessageToast.show("Reset to default settings cancelled.");
                        }
                    }
                });
            },
            onEditTileNamePress: function () {
                if (this.Themecall) {
                    sap.m.MessageBox.information("Please exit from theme mode first")
                    return;
                }
                this.EditCall = !this.EditCall; // Toggle the state
                if (this.EditCall) {
                    // Theme mode activated
                    this.byId("idCancelEditButtonResource").setVisible(true);
                    this.byId("idBtnListViewResourcePage").setVisible(false);
                    this.byId("idBtnGridViewResourcePage").setVisible(false);
                    sap.m.MessageToast.show("Edit mode activated.");
                } else {
                    // Theme mode deactivated
                    this.byId("idCancelEditButtonResource").setVisible(false);
                    this.byId("idBtnListViewResourcePage").setVisible(true);
                    this.byId("idBtnGridViewResourcePage").setVisible(false);
                    sap.m.MessageToast.show("Edit mode deactivated.");
                }
            },
            //Rename Dailog Box..
            onPressRenameTile: function () {
                debugger
                this.TileHeader = this._currentTile.getHeader();
                this.TileSubHeader = this._currentTile.getSubheader();
                this.getView().byId("IdEditTileDetailsDialogResource").open();
                this.byId("idInputTileHeaderResource").setValue(this.TileHeader);
                this.byId("idInputSubHeaderResource").setValue(this.TileSubHeader);
            },
            onPressSaveTileEditDetails: function () {
                debugger
                var sNewHeader = this.byId("idInputTileHeaderResource").getValue();
                var sNewSubHeader = this.byId("idInputSubHeaderResource").getValue();

                // Update the tile details
                if (this._currentTile) {
                    var tileId = this._currentTile.getId();
                    this._currentTile.setHeader(sNewHeader);
                    this._currentTile.setSubheader(sNewSubHeader);

                    var tileData = {
                        header: sNewHeader,
                        subHeader: sNewSubHeader // Store the new subheader
                    };
                    // Save the updated tile details in localStorage
                    localStorage.setItem(`tile_${tileId}`, JSON.stringify(tileData)); // Save tile data as a string in localStorage
                    this.byId("IdEditTileDetailsDialogResource").close();
                    sap.m.MessageToast.show("Tile details updated successfully!");
                }
                window.location.reload();
            },
            onCloseEditingTileDetailsDialog: function () {
                this.byId("IdEditTileDetailsDialogResource").close();
            },
            onCancelEditPress: function () {
                this.byId("idCancelEditButtonResource").setVisible(false);
                //this.byId("idBtnListView").setVisible(true);
                this.EditCall = false;
                sap.m.MessageToast.show("Edit mode Deactivated.");
            },
            // Theme press from profile 
            onPressThemesBtnFromProfilePopover: function (oEvent) {
                debugger
                // Check if the popover already exists, if not create it
                if (!this._oThemeSelectPopover) {
                    this._oThemeSelectPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.SelectToApplyTheme", this);
                    this.getView().addDependent(this._oThemeSelectPopover);
                }
                // Open popover near the language button
                this._oThemeSelectPopover.openBy(oEvent.getSource());
            },
            //Background theme select 
            onBackGroudThemeSelect: function () {
                if (this.EditCall) {
                    sap.m.MessageToast.show("Please exit Edit mode before selecting a theme.");
                    return;
                }
                if (this.Themecall) {
                    sap.m.MessageToast.show("Please exit Theme mode before selecting a theme.");
                    return;
                }
                this.resetDialogBox();
                this.byId("idthemeTileDialogResource").open();
            },
            //Closing Theme Dailog Box...
            onCancelColorDialog: function () {
                this.resetDialogBox();
                //this._selectedTiles = [];
                this.byId("idthemeTileDialogResource").close();
            },
            //Tile selcect btn from Profile Popover...
            onTileThemeSelect: function () {
                // Check if edit mode is active
                if (this.EditCall) {
                    sap.m.MessageBox.information("Please exit from edit mode first");
                    return;
                }
                // Toggle the Themecall state
                this.Themecall = !this.Themecall;

                if (this.Themecall) {
                    this.byId("idExitThemeModeResource").setVisible(true); // Show the Exit Theme button
                    this.byId("idTileThemesModeOpen").setVisible(true); // Show the Open Theme button
                    this.byId("idBtnListViewResourcePage").setVisible(false);
                    this.byId("idBtnGridViewResourcePage").setVisible(false);
                    sap.m.MessageToast.show("Theme mode activated.");
                } else {
                    // Theme mode deactivated
                    this.byId("idExitThemeModeResource").setVisible(false); // Hide the Exit Theme button
                    this.byId("idTileThemesModeOpen").setVisible(false); // Hide the Open Theme button
                    this.byId("idBtnListViewResourcePage").setVisible(true);
                    this.byId("idBtnGridViewResourcePage").setVisible(false);
                    sap.m.MessageToast.show("Theme mode deactivated.");
                }
            },
            //After Selecting Multiple Tiles opens theme dialog box to select colour...
            onPressTileThemesModeOpenDailog: function () {
                debugger
                var selectedTiles = this._selectedTiles || [];
                // Check if any tiles are selected
                if (selectedTiles.length === 0) {
                    sap.m.MessageToast.show("Please select at least one tile to apply the theme.");
                    return;
                }
                // Extract only the IDs from the selected tiles
                this._selectedTileIds = selectedTiles.map(function (tile) {
                    return tile.getId();
                });
                this.resetDialogBox();
                this.byId("idBrowseImgfileUploaderTilesBG").setVisible(false);
                this.byId("idthemeTileDialogResource").open();
            },
            //Exit from Theme Mode...
            onPressExitTileThemesMode: function () {
                this.Themecall = false; // Deactivate theme call
                // Deselect all tiles visually
                if (this._selectedTiles && this._selectedTiles.length > 0) {
                    this._selectedTiles.forEach(function (oTile) {
                        oTile.removeStyleClass("tileSelected");
                    });
                }
                // Clear the array of selected tiles
                this._selectedTiles = [];
                // Reset button visibility as needed
                this.byId("idBtnListViewResourcePage").setVisible(false);
                this.byId("idBtnGridViewResourcePage").setVisible(true);
                this.byId("idTileThemesModeOpen").setVisible(false);
                this.byId("idExitThemeModeResource").setVisible(false);
                // Optionally, close the theme dialog if it's open
                var oDialog = this.byId("idthemeTileDialogResource");
                if (oDialog && oDialog.isOpen()) {
                    oDialog.close();
                }
                this.resetDialogBox();
                sap.m.MessageToast.show("Theme mode Exited!");
            },
            //Apply btn ThemeDailog Box...
            onApplyColor: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("idcolorPickerResource");
                var sColorPickerValue = oColorPicker.getColorString();
                var aSelectedColors = [];
                var oColorOptions = this.byId("colorOptionsResource").getItems();

                // Collect selected colors from checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem.getSelected()) {
                        var sColorValue = oItem.getCustomData()[0].getValue(); // Get color from custom data
                        aSelectedColors.push(sColorValue);
                    }
                });

                // Determine which color or image to apply
                var sColor = null;
                if (aSelectedColors.length > 0) {
                    if (aSelectedColors.length > 1) {
                        sap.m.MessageToast.show("You can only select one color.");
                        return;
                    }
                    sColor = aSelectedColors[0];
                } else if (this._isValidColor(sColorPickerValue)) {
                    sColor = sColorPickerValue;
                }

                // Apply either the selected color or uploaded image
                if (this._uploadedImageSrc) {
                    this.applyTheme(null, this._uploadedImageSrc); // Apply image if uploaded
                } else if (sColor) {
                    this.applyTheme(sColor, null); // Apply color if valid
                } else {
                    sap.m.MessageToast.show("No valid color or image selected.");
                }
                this.resetDialogBox();
                this.byId("idthemeTileDialogResource").close();
            },
            applyTheme: function (sColor, sImageSrc) {
                if (this._selectedTiles && this._selectedTiles.length > 0) {
                    this.applyThemeToTiles(sColor, sImageSrc);
                } else {
                    this.applyBackgroundTheme(sColor, sImageSrc);
                }
            },
            //For Background Theme and Callback function from "onApplyColor"...
            applyThemeToTiles: async function (sColor) {
                debugger;
                if (!this._selectedTiles || this._selectedTiles.length === 0) {
                    sap.m.MessageToast.show("No tiles selected for theme application.");
                    return;
                }

                const userID = this.ID;
                const oModel = this.getOwnerComponent().getModel();
                const sEntityPath = `/RESOURCESSet('${userID}')`;

                // Fetch existing data
                let existingTileData = "";
                try {
                    const userData = await new Promise((resolve, reject) => {
                        oModel.read(sEntityPath, {
                            success: resolve,
                            error: reject
                        });
                    });

                    existingTileData = userData.Multitilescolor || ""; // Assuming Tileviews contains the comma-separated data
                } catch (oError) {
                    console.error("Error fetching existing tile data:", oError);
                    return; // Exit if there's an error
                }

                // Parse existing data into an object
                const existingTileMap = existingTileData.split(",").reduce((acc, item) => {
                    const [tileID, color] = item.split(":");
                    if (tileID && color) acc[tileID] = color;
                    return acc;
                }, {});

                // Update with the new selections
                this._selectedTiles.forEach(function (oTile) {
                    const oTileDomRef = oTile.getDomRef();
                    if (oTileDomRef) {
                        const tileId = oTile.getId();
                        oTileDomRef.style.backgroundColor = "";
                        // Apply the new color if provided
                        if (sColor) {
                            const hexColor = this._convertColorToHex(sColor); // Ensure color is in hex format
                            oTileDomRef.style.backgroundColor = hexColor;
                            // Update the tile ID with the new color in the map
                            existingTileMap[tileId] = hexColor;
                        }
                    }
                }.bind(this));

                // Convert the updated map back to a comma-separated string
                const updatedTileData = Object.entries(existingTileMap)
                    .map(([tileID, color]) => `${tileID}:${color}`)
                    .join(",");

                // Prepare payload
                const oPayload = {
                    Multitilescolor: updatedTileData
                };

                // Update the backend
                try {
                    await new Promise((resolve, reject) => {
                        oModel.update(sEntityPath, oPayload, {
                            success: resolve,
                            error: reject
                        });
                    });
                } catch (oError) {
                    console.error("Backend update error:", oError);
                }

                // Remove the 'tileSelected' style class and clear the selected tiles list
                this._selectedTiles.forEach(function (oTile) {
                    oTile.removeStyleClass("tileSelected");
                });
                this._selectedTiles = [];
                this.resetDialogBox();
            },
            applyBackgroundTheme: async function (sColor, sImageSrc) {
                debugger
                const userId = this.ID;
                const sEntityPath = `/RESOURCESSet('${userId}')`;
                const oModel = this.getOwnerComponent().getModel();

                try {
                    var oMainContainer = this.byId("idScrollContainer1");
                    if (oMainContainer) {
                        var oMainContainerDom = oMainContainer.getDomRef();

                        let oPayload = {
                            Backgroundcolor: null,
                            Backgroundimage: null
                        };
                        // var userData = await new Promise((resolve, reject) => {
                        //     oModel.read(sEntityPath, {
                        //         success: resolve,
                        //         error: reject
                        //     });
                        // });

                        if (sImageSrc) {
                            oMainContainerDom.style.backgroundColor = "";
                            oMainContainerDom.style.backgroundImage = `url(${sImageSrc})`;
                            oMainContainerDom.style.backgroundSize = "cover";
                            oMainContainerDom.style.backgroundPosition = "center";
                            oMainContainerDom.style.backgroundRepeat = "no-repeat";
                            oMainContainerDom.style.backgroundAttachment = "fixed";

                            sap.m.MessageToast.show("Background image applied successfully!");

                            // Prepare the payload for the backend
                            const base64ImageData = sImageSrc.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
                            oPayload.Backgroundimage = base64ImageData; // Store the base64 image
                            oPayload.Backgroundcolor = ""; // Ensure the color is null
                        } else if (sColor) {
                            oMainContainerDom.style.backgroundImage = "";
                            var hexColor = this._convertColorToHex(sColor); // Ensure the color is in hex format
                            oMainContainerDom.style.backgroundColor = hexColor;
                            sap.m.MessageToast.show("Background color applied successfully!");

                            // Prepare the payload for the backend
                            oPayload.Backgroundcolor = hexColor; // Store the color
                            oPayload.Backgroundimage = ""; // Ensure the image is null
                        } else {
                            sap.m.MessageToast.show("No input provided to apply.");
                            return;
                        }

                        // Update the backend with the new background settings
                        await new Promise((resolve, reject) => {
                            oModel.update(sEntityPath, oPayload, {
                                success: resolve,
                                error: reject
                            });
                        });
                        //sap.m.MessageToast.show("Background theme saved successfully in the backend.");
                    } else {
                        sap.m.MessageToast.show("Main container not found.");
                    }
                } catch (error) {
                    sap.m.MessageToast.show("Error applying background theme: " + error.message);
                    console.error("Error:", error);
                }
            },
            _convertColorToHex: function (color) {
                var hex;
                var ctx = document.createElement("canvas").getContext("2d");
                ctx.fillStyle = color;
                hex = ctx.fillStyle;
                return hex;
            },
            onFileUploadChange: function (oEvent) {
                var aFiles = oEvent.getParameter("files");
                if (aFiles.length > 0) {
                    var oFile = aFiles[0];
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        // Save the uploaded image source as base64 string
                        this._uploadedImageSrc = e.target.result;

                        // Hide color picker and color options after an image is selected
                        this.byId("idcolorPickerResource").setVisible(false);
                        this.byId("colorOptionsResource").setVisible(false);
                        MessageToast.show("Image selected. Now press 'Apply' to save!");
                    }.bind(this);

                    reader.readAsDataURL(oFile);
                } else {
                    this.byId("idcolorPickerResource").setVisible(true);
                    this.byId("colorOptionsResource").setVisible(true);
                    MessageToast.show("No image selected. Please choose an image.");
                }
            },
            onColorOptionSelect: function (oEvent) {
                var oSelectedCheckBox = oEvent.getSource();
                var oColorOptions = this.byId("colorOptionsResource").getItems();
                var isThemeModeActive = this.Themecall;

                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem !== oSelectedCheckBox) {
                        oItem.setSelected(false);
                    }
                });

                var isCheckBoxSelected = oSelectedCheckBox.getSelected();
                this.byId("idcolorPickerResource").setVisible(!isCheckBoxSelected);
                this.byId("idBrowseImgfileUploaderTilesBG").setVisible(!isCheckBoxSelected);
                this.byId("idBrowseImgfileUploaderTilesBG").setVisible(!isCheckBoxSelected && !isThemeModeActive);
            },
            resetDialogBox: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("idcolorPickerResource");
                var oColorOptions = this.byId("colorOptionsResource").getItems();
                var oImageUploader = this.byId("idBrowseImgfileUploader");

                // Deselect all checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox) {
                        oItem.setSelected(false);
                    }
                });

                // Reset the color picker to its default value (white)
                if (oColorPicker) {
                    oColorPicker.setColorString("#FFFFFF");
                    oColorPicker.setVisible(true);
                }
                // Clear any stored uploaded image source
                this._uploadedImageSrc = null;

                // Reset the file uploader (clear any selected files)
                if (oImageUploader) {
                    oImageUploader.clear();
                }
                this.byId("colorOptionsResource").setVisible(true);
                this.byId("idBrowseImgfileUploaderTilesBG").setVisible(true);
            },
            // Helper function to extract the local ID of a tile
            _extractLocalId: function (sTileId) {
                return sTileId.split("--").pop();
            },
            _isValidColor: function (sColor) {
                var hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
                var rgbRegex = /^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/;
                return hexRegex.test(sColor) || rgbRegex.test(sColor);
            },
            //Tile View setting When press on profile...
            onPressTileViewSettings: function (oEvent) {
                // Check if the popover already exists, if not create it
                if (!this.oTileViewSettings) {
                    this.oTileViewSettings = sap.ui.xmlfragment("com.app.rfapp.fragments.UserTileView", this);
                    this.getView().addDependent(this.oTileViewSettings);
                }
                // Open popover 
                this.oTileViewSettings.openBy(oEvent.getSource());
            },
            onPressTileViewLargeIcons: function () {
                this.onPressTileViewResizeIcons("LargeIcons");
            },
            onPressTileViewMediumIcons: function () {
                this.onPressTileViewResizeIcons("MediumIcons");
            },
            onPressTileViewSmallIcons: function () {
                this.onPressTileViewResizeIcons("SmallIcons");
            },
            //CallBack function every Tile view....
            onPressTileViewResizeIcons: async function (sSelectedKey) {
                debugger
                if (this.Themecall) {
                    sap.m.MessageToast.show("Please exit Theme mode.");
                    return;
                }
                if (this.EditCall) {
                    sap.m.MessageToast.show("Please exit Edit mode.");
                    return;
                }

                try {
                    const userId = this.ID;
                    const sEntityPath = `/RESOURCESSet('${userId}')`;
                    const oModel = this.getOwnerComponent().getModel();

                    var oTilesContainer = this.byId("idScrollContainer1");
                    var aTiles = oTilesContainer.getContent(); // Get all the tiles within the ScrollContainer

                    // Save the selected key to localStorage for persistence
                    //localStorage.setItem("selectedView", sSelectedKey);
                    aTiles.forEach(function (oTile) {
                        if (oTile.isA("sap.m.GenericTile")) {
                            // Remove any previous size-related CSS classes
                            oTile.removeStyleClass("largeIcons");
                            oTile.removeStyleClass("mediumIcons");
                            oTile.removeStyleClass("smallIcons");

                            // Apply the selected size class
                            switch (sSelectedKey) {
                                case "LargeIcons":
                                    oTile.addStyleClass("largeIcons");
                                    break;
                                case "MediumIcons":
                                    oTile.addStyleClass("mediumIcons");
                                    break;
                                case "SmallIcons":
                                    oTile.addStyleClass("smallIcons");
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    let oPayload = {
                        Tileviews: sSelectedKey
                    };

                    await new Promise((resolve, reject) => {
                        oModel.update(sEntityPath, oPayload, {
                            success: resolve,
                            error: reject
                        });
                    });
                } catch (error) {
                    sap.m.MessageToast.show("Error saving tile view: " + error.message);
                    console.error("Error:", error);
                }
            },
            //Grid and List Views...
            onPressGridViewsResource: function () {
                const oTilesContainer = this.byId("idScrollContainer1");
                const aTiles = oTilesContainer.getContent();
            
                // Disable the grid button to avoid multiple clicks during rendering
                const oListViewButton = this.byId("idBtnListViewResourcePage");
                const oGridViewButton = this.byId("idBtnGridViewResourcePage");
                oGridViewButton.setEnabled(false);
            
                // Retrieve the stored view for grid styling
                const sStoredView = localStorage.getItem("selectedView") || ""; // Default to an empty class if not set
            
                // Remove all content and re-add tiles in grid format
                oTilesContainer.removeAllContent();
                aTiles.forEach(oHBox => {
                    if (oHBox.isA("sap.m.HBox")) {
                        const tileObject = oHBox.getItems()[0]; // The tile object within the HBox
                        tileObject.removeStyleClass("listViewIcons");
                        tileObject.addStyleClass(sStoredView);
                        oTilesContainer.addContent(tileObject);
                    }
                });
                sap.ui.getCore().applyChanges();
                oGridViewButton.setVisible(false);
                oListViewButton.setVisible(true);
                oListViewButton.setEnabled(true);
            },            
            onPressListViewsResource: async function () {
                const oTilesContainer = this.byId("idScrollContainer1");
                const aTiles = oTilesContainer.getContent();
            
                // Disable the list button immediately to avoid multiple clicks
                const oListViewButton = this.byId("idBtnListViewResourcePage");
                const oGridViewButton = this.byId("idBtnGridViewResourcePage");
                oListViewButton.setEnabled(false);
            
                // Fetch headers asynchronously
                const headers = await this.getHeaders();
            
                // Extract and clean frontend tile IDs (filtering only GenericTiles)
                const genericTiles = aTiles.filter(oTile => oTile.isA("sap.m.GenericTile"));
                const frontEndTileIds = genericTiles.map(oTile => {
                    const sTileId = oTile.getId();
                    const localId = this._extractLocalId(sTileId);
                    return localId.replace("id_", "").toLowerCase();
                });
            
                // Fetch user tiles from the backend
                const oModel1 = this.getOwnerComponent().getModel();
                const userId = this.ID;
                let userTiles = [];
                await new Promise((resolve, reject) => {
                    oModel1.read(`/RESOURCESSet('${userId}')`, {
                        success: function (oData) {
                            const tiles = oData.Resourcegroup;
                            userTiles = tiles.split(',')
                                .map(item => item.trim().toLowerCase().replace(/\s+/g, '') + "_title");
                            resolve();
                        },
                        error: function () {
                            sap.m.MessageToast.show("Error loading user tiles");
                            reject();
                        }
                    });
                });
            
                // Match frontend tile IDs with backend queue tile names
                const matchedTiles = frontEndTileIds.map(frontEndTileId => {
                    const tileIndex = userTiles.indexOf(frontEndTileId);
                    if (tileIndex !== -1) {
                        return {
                            tileId: frontEndTileId,
                            tileObject: genericTiles.find(oTile => {
                                const sTileId = oTile.getId();
                                const localId = this._extractLocalId(sTileId);
                                return localId.replace("id_", "").toLowerCase() === frontEndTileId;
                            }),
                            headerText: headers[tileIndex]
                        };
                    }
                    return null;
                }).filter(item => item !== null); // Filter out null matches
            
                // Replace only the generic tiles with headers and keep other content intact
                genericTiles.forEach(oTile => oTilesContainer.removeContent(oTile)); // Remove only GenericTiles
                matchedTiles.forEach(({ tileObject, headerText }) => {
                    const oHBox = new sap.m.HBox({
                        items: [
                            tileObject.addStyleClass("listViewIcons"), 
                            new sap.m.Text({
                                text: headerText
                            }).addStyleClass("listViewHeader") 
                        ]
                    }).addStyleClass("tileContainer");  
                    oTilesContainer.addContent(oHBox); 
                });
            
                // Wait for rendering to complete before switching button visibility
                sap.ui.getCore().applyChanges(); // Ensure UI rendering is up-to-date
                oListViewButton.setVisible(false);
                oGridViewButton.setVisible(true);
                oGridViewButton.setEnabled(true);
            },            
            getHeaders: async function () {
                const oModel1 = this.getOwnerComponent().getModel();
                const userId = this.ID;
                let headers = [];
                // Use a Promise to handle the async operation
                await new Promise((resolve, reject) => {
                    oModel1.read(`/RESOURCESSet('${userId}')`, {
                        success: function (oData) {
                            const tiles = oData.Resourcegroup;
                            headers = tiles.split(',').map(item => item.trim());
                            resolve();
                        },
                        error: function () {
                            MessageToast.show("Error loading user tiles");
                            reject();  // Reject the promise on error
                        }
                    });
                });
                return headers;
            },
            onResourceDetailsLoadResorcePage: async function (oEvent1) {
                // const { id } = oEvent1.getParameter("arguments");
                // this.ID = id;
                // console.log(this.ID)
                // var oModel = this.getView().getModel();

                // var oModel1 = this.getOwnerComponent().getModel();

                // await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                //     success: function (oData) {
                //         var area = oData.Area;
                //         var group = oData.Resourcegroup;
                //         var resourceType = oData.Queue;
                //         var aNavigationData = oModel.getProperty("/navigation");

                //            // Define which process and item to show
                //         debugger
                //         var sProcessToShow =  area;
                //         var sItemToShow =   group;

                //         // Loop through navigation data
                //         aNavigationData.forEach(function (oProcess) {
                //             // Loop through items of each process
                //             oProcess.items.forEach(function (oItem) {
                //                 // Set visibility based on the matching process and item
                //                 if (oProcess.title === sProcessToShow && oItem.title === sItemToShow) {
                //                     oProcess.visible = true; 
                //                     oItem.visible = true;  // Set to true for matching item
                //                 } else {
                //                     oItem.visible = false; // Ensure all others are set to false
                //                 }
                //             });
                //         });

                //         // Update the model with modified visibility data
                //         oModel.setProperty("/navigation", aNavigationData);
                //         var aNavigationData = oModel.getProperty("/navigation");



                //         // You can perform further actions here, like navigating to the next view
                //     }.bind(this),
                //     error: function () {
                //         MessageToast.show("User does not exist");
                //     }
                // });
                //   const sToolPage = this. getView().byId("toolPage");
                //   sToolPage.bindElement(`/(${id})`);

                var that = this;
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
                console.log(this.ID);

                var oModel = this.getView().getModel();
                var oModel1 = this.getOwnerComponent().getModel();

                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        var area = oData.Area;
                        var areaArray = area.split(",").map(item => item.trim());
                        var ogroup = oData.Resourcegroup;
                        var groupArray = ogroup.split(",").map(item => item.trim());

                        groupArray.forEach(function (group) {

                            let oGroup = group.replace(/[^a-zA-Z0-9]/g, '');
                            let loGroup = oGroup.toLowerCase();
                            that.getView().byId(`id_${loGroup}_title`).setVisible(true)


                        })

                        var oresourceType = oData.Queue;
                        var oResourceArray = oresourceType.split(",").map(item => item.trim())
                        console.log(oResourceArray)
                        oResourceArray.forEach(function (queue) {

                            let oQueue = queue.replace(/[^a-zA-Z0-9]/g, '');
                            let lOQueue = oQueue.toLowerCase();
                            // that.getView().byId(`id_${lOQueue}`).setVisible(true)
                        })

                        var aNavigationData = oModel.getProperty("/navigation");

                        // Loop through navigation data
                        aNavigationData.forEach(function (oProcess) {
                            var processVisible = false;

                            // Loop through areaArray
                            areaArray.forEach(function (areaArray1) {
                                var Area = `${areaArray1} Process`;

                                // Check if the process title matches any in the formatted array
                                if (oProcess.title === Area) {
                                    oProcess.visible = true;
                                    processVisible = true; // Mark this process as visible
                                }
                            });

                            // If no area matched, set process to false
                            if (!processVisible) {
                                oProcess.visible = false;
                            }

                            // Loop through items of each process
                            oProcess.items.forEach(function (oItem) {
                                // Set visibility of items based on the matching group and the process visibility
                                if (groupArray.includes(oItem.title) && oProcess.visible) {
                                    oItem.visible = true;
                                } else {
                                    oItem.visible = false;
                                }
                            });
                        });

                        // Update the model with modified visibility data after all processing
                        oModel.setProperty("/navigation", aNavigationData);

                        // Further actions can be performed here, like navigating to the next view
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
                //For the Profile Pic loaded from backend service..
                this.applyStoredProfileImage();
                this.handleUserDetailsBasedOnUserID();
            },


            _onPopoverBeforeClose: function (oEvent) {
                // Logic before closing the popover, if necessary
                this.genericTitleName = ""
            },
            onGenericTilePress: async function (oEvent) {
                const oTile = oEvent.getSource();
                var oGenericTileName = oEvent.oSource.mProperties.header;
                var oQueueArray = []
                if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    const iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                    return;
                }
                if (this.genericTitleName === oGenericTileName) {
                    return
                }
                this.genericTitleName = oGenericTileName;
                if (!this._oPopoverGt) {
                    this._oPopoverGt = sap.ui.xmlfragment("com.app.rfapp.fragments.GenerictilePressPopOver", this);
                    this.getView().addDependent(this._oPopoverGt);
                }
                const aOptions = []
                this._oPopoverGt.setTitle(oGenericTileName)
                const oVBox = this._oPopoverGt.getContent()[0]; // Assuming the VBox is the first content
                oVBox.destroyItems(); // Clear existing items
                var oModel1 = this.getOwnerComponent().getModel();
                oModel1.read("/ProcessAreaSet", {
                    success: function (oData) {
                        oData.results.forEach(element => {
                            if (element.Processgroup.toUpperCase() === oGenericTileName.toUpperCase()) {
                                oQueueArray.push(element.Queue.toUpperCase())
                            }
                        });
                        oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                            success: function (oData) {
                                var oResourceArray = oData.Queue.split(",").map(item => item.trim());
                                oResourceArray.forEach(function (queue) {
                                    let oQueue = queue.replace(/[^a-zA-Z0-9]/g, '');
                                    let lOQueue = oQueue.toLowerCase();
                                    if (oQueueArray.includes(queue.toUpperCase())) {
                                        aOptions.push(queue)
                                    }
                                });
                                const aOptionSet = new Set(aOptions);
                                const oOptions = Array.from(aOptionSet)
                                console.log(oOptions)
                                oOptions.forEach((sOption) => {
                                    const oRadioButton = new sap.m.RadioButton({
                                        text: sOption,
                                        select: this.onRadioButtonSelect.bind(this)
                                    });
                                    oVBox.addItem(oRadioButton); // Add the radio button to the VBox
                                });
                            }
                                .bind(this),
                            error: function () {
                                MessageToast.show("User does not exist");
                            }
                        });
                    }
                        .bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
                console.log(oQueueArray);
                this._oPopoverGt.openBy(oEvent.getSource());
            },


            onRadioButtonSelect: function () {
                // Get the VBox that contains the radio buttons
                const oVBox = this._oPopoverGt.getContent()[0]; // Assuming the VBox is the first content
                const aItems = oVBox.getItems(); // Get all items in the VBox

                // Loop through the items to find the selected radio button
                let selectedText = '';
                aItems.forEach((oItem) => {
                    if (oItem.getSelected()) { // Check if the radio button is selected

                        selectedText = oItem.getText().replace(/[^a-zA-Z0-9]/g, '').toUpperCase(); // Get the text of the selected radio button
                    }
                });
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo(`${selectedText}`, { id: this.ID });
                if (selectedText) {
                    console.log("Selected:", selectedText);
                    // Add your logic based on the selected text here
                }
            },




            onItemSelect: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                this.byId("pageContainer1").to(this.getView().createId(oItem.getKey()));
            },

            handleUserNamePress: function (event) {
                var oPopover = new Popover({
                    showHeader: false,
                    placement: PlacementType.Bottom,
                    content: [
                        new Button({
                            text: 'Feedback',
                            type: ButtonType.Transparent
                        }),
                        new Button({
                            text: 'Help',
                            type: ButtonType.Transparent
                        }),
                        new Button({
                            text: 'Logout',
                            type: ButtonType.Transparent
                        })
                    ]
                }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

                oPopover.openBy(event.getSource());
            },

            onSideNavButtonPress: function () {
                var oToolPage = this.byId("toolPage");
                var bSideExpanded = oToolPage.getSideExpanded();

                this._setToggleButtonTooltip(bSideExpanded);

                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            },

            _setToggleButtonTooltip: function (bLarge) {
                var oToggleButton = this.byId('sideNavigationToggleButton');
                if (bLarge) {
                    oToggleButton.setTooltip('Large Size Navigation');
                } else {
                    oToggleButton.setTooltip('Small Size Navigation');
                }
            },
            onManuallyRepackHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ManuallyRepackHU", { id: this.ID });
                }
            },
            onManuallyRepackHUItemPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ManuallyRepackAllHUItems", { id: this.ID });
                }
            },
            onPutawayByHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePutawayByHU", { id: this.ID });
                }
            },
            onReceivingofHUbyConsignementOrderPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("Receivingofhubyco", { id: this.ID });

                }
            },
            onManuallyRepackHUItemPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteManuallyRepackingByHuItems", { id: this.ID });
                }
            },
            onWTQuerybyWOPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }


                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByWO", { id: this.ID });
                }
            },
            onReceivingofHUbyDeliveryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RecevingOfHUbyDelivery", { id: this.ID });
                }
            },
            onReceivingofHUbymanufacturingOrderPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RecevingOfHUbyManufacturingOrder", { id: this.ID });
                }
            },
            onRecevingofTUDoorTWPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RecevingOfHUbyTUorDoor", { id: this.ID });
                }
            },
            onReceivingofHUbyASNPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReceivingofHUbyASN", { id: this.ID });
                }
            },
            onReceivingofHUbyShipmentPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReceivingofHUbyShipment", { id: this.ID });
                }
            },
            onReceivingofHUbyTUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReceivingofHUbyTU", { id: this.ID });
                }
            },
            onUnloadingByDoorTilePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByDoor", { id: this.ID });
                }
            },
            onUnloadingByConsignmentOrderTilePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByConsignmentOrder", { id: this.ID });
                }
            },
            onChangeQueueTilePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ChangeQueue", { id: this.ID });
                }
            },
            onChangeResourceGroupTilePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ChangeResourceGroup", { id: this.ID });
                }
            },
            onUnloadingbyBillofLadingPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByBillofLading", { id: this.ID });
                }
            },
            onDeconsolidationAutomaticallyPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("DeconsolidationAutomatically", { id: this.ID });
                }
            },
            onDeconsolidateManuallyPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("DeconsolidationManually", { id: this.ID });
                }
            },
            onAdhocInventoryCreationPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AdhocInventoryCreation", { id: this.ID });
                }
            },
            onCreationOfSingleHUpress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreationOfSingleHU", { id: this.ID });
                }
            },
            onMaintainHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("MaintainHU", { id: this.ID });
                }
            },
            onReversalofConsumptionbyMOHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReversalofConsumptionbyMObyHU", { id: this.ID });
                }
            },
            onReversalofconsumptionbyMOBinPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteReversalofConsumptionbyMO_Bin", { id: this.ID });
                }
            },
            onUnloadingByShipmentPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByShipment", { id: this.ID });
                }
            },
            onUnloadingByTransportUnitPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByTU", { id: this.ID });
                }
            },

            //Avatar btn from Resource Page...
            onSBQPAvatarPressedResourcePage: function (oEvent) {
                debugger
                var oComponent = this.getOwnerComponent();
                // Destroy the existing popover if it exists
                if (oComponent.getPopover()) {
                    oComponent.getPopover().destroy();
                    oComponent.setPopover(null);
                }

                this.onPressAvatarPopOverBaseFunction(oEvent, {
                    showAccountDetails: true,
                    showEditTile: true,
                    showDefaultSettings: true,
                    showThemes: true,
                    showLanguage: true,
                    showTileView: true,
                    showHelp: true,
                    showSignOut: true
                });
                this.applyStoredProfileImage();
            },
            //Accout Deatils press function...
            onMyAccountPress: function () {
                sap.m.MessageToast.show("Navigating to My Account...");
            },

            onLogoutPress: function () {
                sap.m.MessageToast.show("Logging out...");
                // Add actual logout logic here
            },
            onRecevinngofHUbyBillofLadingPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteBillofLading", { id: this.ID });
                }
            },
            onCreateShippingHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreateShippingHU", { id: this.ID });
                }
            },
            onCreateShippingHUWOWCPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreateShippingHUWOWC", { id: this.ID });
                }
            },
            onPutawayByWOPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("PutawayByWO", { id: this.ID });
                }
            },
            onWTquerybyHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByHU", { id: this.ID });
                }
            },
            onSetReadyforWHprocessingbyCOPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("SetReadyforWHProcessingByCO", { id: this.ID });
                }
            },
            onAutomaticallyRepackHUItemPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AutomaticallyRepackHUItem", { id: this.ID });
                }
            },
            onAvailableHandlingunitsonbinqueryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }

                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AvailableHandlingUnitsOnBinQuery", { id: this.ID });
                }
            },

            onWTQueryByWTPress: function () {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }


                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByWT", { id: this.ID });
                }
            },
            onCreateandConfirmAdhocProductWTPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreateConfirmAdhocProduct", { id: this.ID });
                }
            },
            onSerialnumberLocationPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("SerialNumberLocation", { id: this.ID });
                }
            },
            onStockBinQuerybyProductPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("StockBinQueryByProduct", { id: this.ID });
                }
            },
            onCreateAdhocHUWTPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AdhocHuWt", { id: this.ID });
                }
            },
            onCreateAdhocProductWTPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AdhocProductWt", { id: this.ID });
                }
            },
            onReceivingofHUbyDoorPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReceivingOfHuByDoor", { id: this.ID });
                }
            },
            onStockBinQuerybyBinPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("StockBinQueryByBin", { id: this.ID });
                }
            },
            onHUQueryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("HuQuery", { id: this.ID });
                }
            },
            onUnloadingByDeliveryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    // Proceed with normal navigation
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadByDelivery", { id: this.ID });
                }
            },
            onUnloadingByASNPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteUnloadingASNDetails", { id: this.ID });
                }
            },
            onWTQuerybyQueuePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByQueue", { id: this.ID });
                }
            },
            onPickPointPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("PickPoint", { id: this.ID });
                }
            },
            onManuallyrepackallHUitemsPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ManuallyRepackAllHUItems", { id: this.ID });
                }
            },
            onHUStockOverviewQueryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("HUStockOverviewQuery", { id: this.ID });
                }
            },
            onConsumptionByManufacturingOrderPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ConsumptionByManufacturingOrder", { id: this.ID });
                }
            },
            onCreatePutawayHusforDeconsolidationPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreatePutawayHusforDeconsolidate", { id: this.ID });
                }
            },
            onCreatePutawayHusManuallyPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreatePutawayHusManually", { id: this.ID });
                }
            },
            onLoadByHUManPosAssigmentPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("LoadbyHUManPosAssiognment", { id: this.ID });
                }
            },
            onPutawayByHUClusteredPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePutawayHuClustered", { id: this.ID });
                }
            },
            onAutomaticallyRepackHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AutomaticallyRepackHu", { id: this.ID });
                }
            },
            onLoadByHUAutoPosAssignmentPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("LoadbyHUAutoPosAssiognment", { id: this.ID });
                }
            },

            onProductInspectionByHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ProductInspectionByHU", { id: this.ID });
                }
            },
            onProductInspectionByStorageBinPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ProductInspectionByStorageBin", { id: this.ID });
                }
            },

            onProductInspectionByStorageBinPress: function (oEvent) {
                if (this.EditCall) {
                    this._currentTile = oEvent.getSource();
                    this.onPressRenameTile()

                }
                else if (this.Themecall) {
                    // Get the ID of the pressed tile
                    this._currentTile = oEvent.getSource();
                    // Open the theme dialog for tile color selection
                    // this.onBackgroundTilePopOverThemeBtn();
                    this.onBackgroundTilePopOverThemeBtn()

                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ProductInspectionByStorageBin", { id: this.ID });
                }
            },
            onProfilePressed: function () {
                var oView = this.getView();
                if (!this.byId("idUserDetails")) {
                    // Load the fragment asynchronously
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.app.rfapp.fragments.UserDetails", // Adjust to your namespace
                        controller: this
                    }).then(function (oDialog) {
                        // Add the dialog to the view
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                }
                else {
                    // If the dialog already exists, just open it
                    this.byId("idUserDetails").open();
                }
            },

            onHUMaintenanceInDeconsolidation: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ProductInspectionByStorageBin", { id: this.ID });
                }
            },

            onProductInspectionByStorageBinPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ProductInspectionByStorageBin", { id: this.ID });
            },

            onCloseUSerDetailsDialog: function () {
                this.byId("idUserDetails").close();
            },

            onSignoutPressed: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("InitialScreen", { id: this.ID });

            },
        });
    });