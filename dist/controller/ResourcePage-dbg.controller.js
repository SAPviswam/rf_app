sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment"
],
    function (Controller, Device, JSONModel, Popover, Button, library, MessageToast, UIComponent, Fragment) {

        "use strict";

        return Controller.extend("com.app.rfapp.controller.ResourcePage", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();


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

                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
                this.Themecall = false; // Initialize theme call flag
                this.EditCall = false;
                this._currentTileId = null;
            },
            onAfterRendering: function () {
                // Apply stored theme color
                var sStoredThemeColor = localStorage.getItem("themeColor");
                if (sStoredThemeColor) this.applyThemeColor(sStoredThemeColor);

                // Apply stored tile colors
                var tileColors = JSON.parse(localStorage.getItem("tileColors") || "{}");
                for (var sTileId in tileColors) {
                    var sColor = tileColors[sTileId];
                    var oTile = this.byId(this._extractLocalId(sTileId));

                    if (oTile) {
                        (function (oTile, sColor) {
                            oTile.addEventDelegate({
                                onAfterRendering: function () {
                                    var oTileDom = oTile.getDomRef();
                                    if (oTileDom) oTileDom.style.backgroundColor = sColor;
                                }
                            });
                        })(oTile, sColor);
                    }
                }
                // Apply stored view setting
                var sStoredView = localStorage.getItem("selectedView");
                if (sStoredView) {
                    // Get the ScrollContainer and its content
                    var oTilesContainer = this.byId("idScrollContainer1");
                    var aTiles = oTilesContainer.getContent(); // Get all the tiles within the ScrollContainer
                    aTiles.forEach(function (oTile) {
                        // Check if the content is a GenericTile before proceeding
                        if (oTile.isA("sap.m.GenericTile")) {
                            // Remove any previous size-related CSS classes
                            oTile.removeStyleClass("largeIcons");
                            oTile.removeStyleClass("mediumIcons");
                            oTile.removeStyleClass("smallIcons");

                            // Apply the stored size class
                            switch (sStoredView) {
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
                    oTilesContainer.rerender();
                }
                // Apply stored tile details (header and subheader)
                var tileIds = Object.keys(localStorage).filter(key => key.startsWith('tile_'));
                tileIds.forEach(function (tileKey) {
                    // Extract the tile ID from the key
                    var tileId = tileKey.replace('tile_', '');
                    var storedTileData = JSON.parse(localStorage.getItem(tileKey));
                    // Retrieve the tile by ID
                    var oTile = this.byId(this._extractLocalId(tileId));
                    // Apply the stored data to the tile if the tile exists
                    if (oTile && storedTileData) {
                        oTile.setHeader(storedTileData.header || "");
                        oTile.setSubheader(storedTileData.subHeader || "");
                    }
                }.bind(this));
            },
            //Themes Btn from Profile click... 
            // test old theme button
            onPressThemesResourceE: function () {
                this.Themecall = !this.Themecall; // Toggle the state
                if (this.Themecall) {
                    // Theme mode activated
                    this.byId("idCancelButtonResource").setVisible(true);
                    this.byId("idthemeBackGroundButton").setVisible(true);
                    sap.m.MessageToast.show("Theme mode activated.");
                } else {
                    // Theme mode deactivated
                    this.byId("idCancelButtonResource").setVisible(false);
                    this.byId("idthemeBackGroundButton").setVisible(false);
                    sap.m.MessageToast.show("Theme mode deactivated.");
                }
            },
            onChatbotButtonPress: function () {
                window.open("https://cai.tools.sap/api/connect/v1/webclient/standalone/f05493db-d9e4-4bb4-8c10-7d4d681e7823", "_self");
            },
            onEditTileNamePress: function () {
                if(this.Themecall){
                    sap.m.MessageBox.information("Please exit from theme mode first")
                    return;
                }
                this.EditCall = !this.EditCall; // Toggle the state
                if (this.EditCall) {
                    // Theme mode activated
                    this.byId("idCancelEditButtonResource").setVisible(true);
                    sap.m.MessageToast.show("Edit mode activated.");
                } else {
                    // Theme mode deactivated
                    this.byId("idCancelEditButtonResource").setVisible(false);
                    sap.m.MessageToast.show("Edit mode deactivated.");
                }
            },
            //Main Background Btn...
            onBackgroundThemeBtn: function () {
                this.byId("idthemeTileDialogResource").open();
            },
            onCancelPressThemeMode: function () {
                //this.byId("idMainthemeBtn").setVisible(true);
                this.byId("idCancelButtonResource").setVisible(false);
                this.byId("idthemeBackGroundButton").setVisible(false);
                this.Themecall = false;
                sap.m.MessageToast.show("Theme mode Deactivated.");
            },
            onCancelEditPress: function () {
                this.byId("idCancelEditButtonResource").setVisible(false);
                this.EditCall = false;
                sap.m.MessageToast.show("Edit mode Deactivated.");
            },
            //closing theme dialog when press on tile...
            onCancelColorDialog: function () {
                this.byId("idthemeTileDialogResource").close();
                this.resetDialogBox();
            },
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
                // Handle cases where checkboxes are selected
                if (aSelectedColors.length > 0) {
                    if (aSelectedColors.length > 1) {
                        sap.m.MessageToast.show("You can only select one color.");
                        return;
                    }
                    if (oColorPicker.getVisible()) {
                        sap.m.MessageToast.show("Please deselect the checkbox before using the custom color picker.");
                        return;
                    }
                    var sSelectedColor = aSelectedColors[0]; // Get the selected color from checkbox
                    if (this._currentTileId) {
                        this.applyColorToTile(this._currentTileId, sSelectedColor);
                        sap.m.MessageToast.show("Tile color applied successfully!");
                        this._currentTileId = null;
                    } else {
                        this.applyThemeColor(sSelectedColor);
                        sap.m.MessageToast.show("Theme color applied successfully!");
                    }
                } else if (this._isValidColor(sColorPickerValue)) {
                    // If no checkbox is selected, apply the color from the color picker
                    if (this._currentTileId) {
                        this.applyColorToTile(this._currentTileId, sColorPickerValue);
                        sap.m.MessageToast.show("Tile color applied successfully!");
                        this._currentTileId = null;
                    } else {
                        this.applyThemeColor(sColorPickerValue);
                        sap.m.MessageToast.show("Theme color applied successfully!");
                    }
                } else {
                    sap.m.MessageToast.show("Invalid color format. Please use a valid color code.");
                }
                // Deactivate any flag and reset dialog
                //this.Themecall = false; // Deactivate the flag after applying
                this.resetDialogBox();

                // Close the dialog and reset background and cancel buttons
                this.byId("idthemeTileDialogResource").close();
                //this.byId("themeButton").setVisible(false);
                //this.byId("CancelButton").setVisible(false);
                //this.byId("themeButton3").setVisible(true);
            },
            applyColorToTile: function (sTileId, sColor) {
                var oTile = this.byId(sTileId);
                if (!oTile) return;

                var oTileDomRef = oTile.getDomRef();
                if (oTileDomRef) {
                    oTileDomRef.style.backgroundColor = sColor;

                    // Update localStorage with tile color
                    var tileColors = JSON.parse(localStorage.getItem("tileColors") || "{}");
                    tileColors[sTileId] = sColor;
                    localStorage.setItem("tileColors", JSON.stringify(tileColors));
                }
            },
            applyThemeColor: function (sColor) {
                debugger
                var aElements = [
                    this.byId("idScrollContainer1"),
                ];

                // Remove any existing style element for the theme
                var sStyleId = "customThemeStyle";
                var oOldStyle = document.getElementById(sStyleId);
                if (oOldStyle) {
                    oOldStyle.remove();
                }

                // Create a new style element and apply the color
                var oStyle = document.createElement("style");
                oStyle.id = sStyleId;
                oStyle.textContent = ".customTheme { background-color: " + sColor + " !important; }";
                document.head.appendChild(oStyle);

                // Add the custom theme class to the elements
                aElements.forEach(function (oElement) {
                    if (oElement) {
                        oElement.addStyleClass("customTheme");
                    }
                });
                localStorage.setItem("themeColor", sColor);
            },
            onColorOptionSelect: function (oEvent) {
                var oSelectedCheckBox = oEvent.getSource();
                var oColorOptions = this.byId("colorOptionsResource").getItems();
                // Deselect all other checkboxes except the currently selected one
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem !== oSelectedCheckBox) {
                        oItem.setSelected(false);
                    }
                });
                // Hide the color picker if a checkbox is selected, show if deselected
                var isCheckBoxSelected = oSelectedCheckBox.getSelected();
                this.byId("idcolorPickerResource").setVisible(!isCheckBoxSelected);
            },
            // Reset the dialog box when canceled or after applying the color
            resetDialogBox: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("idcolorPickerResource");
                var oColorOptions = this.byId("colorOptionsResource").getItems();

                // Deselect all checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox) {
                        oItem.setSelected(false);
                    }
                });
                // Reset the color picker to its default value
                oColorPicker.setColorString("#FFFFFF");
                oColorPicker.setVisible(true);
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
            //opens theme dialog when click on tile...
            onBackgroundTilePopOverThemeBtn: function () {
                this._currentTileId = this._currentTile.getId();
                this.byId("idthemeTileDialogResource").open();
            },
            _openTilePopover: function () {
                debugger
                if (!this._tilePopover) {
                    this._tilePopover = new sap.m.Popover({
                        title: "Tile Options",
                        content: [
                            new sap.m.Button({
                                icon: "sap-icon://edit",
                                type: "Transparent",
                                text: "Rename",
                                press: this.onPressRenameTile.bind(this) // Bind the context
                            }),
                            new sap.m.Button({
                                icon: "sap-icon://palette",
                                type: "Transparent",
                                text: "Theme",
                                press: this.onBackgroundTilePopOverThemeBtn.bind(this) // Bind the context for the theme button
                            })
                        ],
                        placement: sap.m.PlacementType.Right,
                        //afterOpen: this._onPopoverAfterOpen.bind(this)
                    });
                }
                this._tilePopover.openBy(this._currentTile);
                this.TileHeader = this._currentTile.getHeader();
                this.TileSubHeader = this._currentTile.mProperties.subheader;
            },
            onPressRenameTile: async function () {
                debugger
                this.TileHeader = this._currentTile.getHeader();
                this.TileSubHeader = this._currentTile.mProperties.subheader;
                await this.getView().byId("IdEditTileDetailsDialogResource").open();
                this.byId("idInputTileHeaderResorce").setValue(this.TileHeader);
                this.byId("idInputSubHeaderResource").setValue(this.TileSubHeader);
                // Open the rename dialog
            },
            onPressSaveTileEditDeatils: function () {
                debugger
                var sNewHeader = this.byId("idInputTileHeaderResorce").getValue();
                var sNewSubHeader = this.byId("idInputSubHeaderResource").getValue();

                // Update the tile details
                if (this._currentTile) {
                    var tileId = this._currentTile.getId();
                    this._currentTile.setHeader(sNewHeader);
                    this._currentTile.setSubheader(sNewSubHeader);

                    // Create an object to store the updated tile data
                    var tileData = {
                        header: sNewHeader,
                        subHeader: sNewSubHeader // Store the new subheader
                    };
                    // Save the updated tile details in localStorage
                    localStorage.setItem(`tile_${tileId}`, JSON.stringify(tileData)); // Save tile data as a string in localStorage
                    this.byId("IdEditTileDetailsDialogResource").close();
                    sap.m.MessageToast.show("Tile details updated successfully!");
                }
            },
            onCloseEditingTileDetailsDialog: function () {
                this.byId("IdEditTileDetailsDialogResource").close();
            },
            //Tile View setting When press on profile...
            onPressTileViewSettings: function (oEvent) {
                // Check if the popover already exists, if not create it
                if (!this.oTileViewSettings) {
                    this.oTileViewSettings = sap.ui.xmlfragment("com.app.rfapp.fragments.UserTileView", this);
                    this.getView().addDependent(this.oTileViewSettings);
                }
                // Open popover near the language button
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
            onPressTileViewResizeIcons: function (sSelectedKey) {
                var oTilesContainer = this.byId("idScrollContainer1");
                var aTiles = oTilesContainer.getContent(); // Get all the tiles within the ScrollContainer
                // Save the selected key to localStorage
                localStorage.setItem("selectedView", sSelectedKey);
                // Loop through each tile and apply the appropriate style class based on the selected view
                aTiles.forEach(function (oTile) {
                    // Check if the content is a GenericTile before proceeding
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
                oTilesContainer.rerender();
            },
            //Language Transulation PopOver Profile...
            onPressLanguageTranslation: function (oEvent) {
                // Check if the popover already exists, if not create it
                if (!this._oLanguagePopover) {
                    this._oLanguagePopover = sap.ui.xmlfragment("com.app.rfapp.fragments.LanguageTransulations", this);
                    this.getView().addDependent(this._oLanguagePopover);
                }
                // Open popover near the language button
                this._oLanguagePopover.openBy(oEvent.getSource());
            },
            onLanguageSelect: function (oEvent) {
                // Get the selected button text
                var sLanguage = oEvent.getSource().getText();
            
                // Define the message based on the selected language
                var sSpeechText = "";
                
                switch (sLanguage) {
                    case "English":
                        sSpeechText = "You have chosen English language.";
                        break;
                    case "Hindi":
                        sSpeechText = "आपने हिंदी भाषा चुनी है।"; // Speech for Hindi
                        break;
                    case "Spanish":
                        sSpeechText = "Has elegido el idioma español."; // Speech for Spanish
                        break;
                    case "French":
                        sSpeechText = "Vous avez choisi la langue française."; // Speech for French
                        break;
                    default:
                        sSpeechText = "Language selection failed.";
                }
                
                // Use Web Speech API to make the sound announcement
                this._announceLanguageSelection(sSpeechText);
            
                // Close the popover after selection
                this._oPopover.close();
            },
            
            // Function to handle sound announcements
            _announceLanguageSelection: function(speechText) {
                if ('speechSynthesis' in window) {
                    var speech = new SpeechSynthesisUtterance(speechText);
                    
                    // Optional: Set the language of the speech
                    if (speechText.includes("हिंदी")) {
                        speech.lang = 'hi-IN'; // Hindi language setting
                    } else if (speechText.includes("español")) {
                        speech.lang = 'es-ES'; // Spanish language setting
                    } else if (speechText.includes("française")) {
                        speech.lang = 'fr-FR'; // French language setting
                    } else {
                        speech.lang = 'en-US'; // English as default
                    }
                    
                    window.speechSynthesis.speak(speech);
                } else {
                    console.log("Speech Synthesis not supported in this browser.");
                }
            },
            

            // Theme press from profile 

            onPressThemesResource: function (oEvent) {
                // Check if the popover already exists, if not create it
                if (!this._oThemeSelectPopover) {
                    this._oThemeSelectPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.SelectToApplyTheme", this);
                    this.getView().addDependent(this._oThemeSelectPopover);
                }
                // Open popover near the language button
                this._oThemeSelectPopover.openBy(oEvent.getSource());
            },

            // on Background theme select 

            onBackGroudThemeSelect: function () {
                this.byId("idthemeTileDialogResource").open();
            },
            // on Background theme select 

            onBackGroudThemeSelect: function () {
                this.byId("idthemeTileDialogResource").open();
            },
            // on Tile theme select 

            onTileThemeSelect: function () {
                if(this.EditCall){
                    sap.m.MessageBox.information("Please exit from edit mode first")
                    return;
                }
                this.Themecall = !this.Themecall; // Toggle the state
                if (this.Themecall) {
                    // Theme mode activated
                    this.byId("idCancelButtonResource").setVisible(true);
                    // this.byId("idthemeBackGroundButton").setVisible(true);
                    sap.m.MessageToast.show("Theme mode activated.");
                } else {
                    // Theme mode deactivated
                    this.byId("idCancelButtonResource").setVisible(false);
                    // this.byId("idthemeBackGroundButton").setVisible(false);
                    sap.m.MessageToast.show("Theme mode deactivated.");
                }
            },

            onResourceDetailsLoad: async function (oEvent1) {

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

                        // groupArray.forEach(function (group) {

                        //     let oGroup = group.replace(/[^a-zA-Z0-9]/g, '');
                        //     let loGroup = oGroup.toLowerCase();
                        //     that.getView().byId(`id_${loGroup}_title`).setVisible(true)
                        // })

                        var oresourceType = oData.Queue;
                        var oResourceArray = oresourceType.split(",").map(item => item.trim())
                        console.log(oResourceArray)
                        oResourceArray.forEach(function (queue) {

                            let oQueue = queue.replace(/[^a-zA-Z0-9]/g, '');
                            let lOQueue = oQueue.toLowerCase();
                            that.getView().byId(`id_${lOQueue}`).setVisible(true)
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
                    oRouter.navTo("ManuallyRepackHU", { id: this.ID });
                }
            },
            onManuallyRepackHUItemPress: function (oEvent) {
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
                    oRouter.navTo("ManuallyRepackAllHUItems", { id: this.ID });
                }
            },
            onPutawayByHUPress: function (oEvent) {
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
                    oRouter.navTo("RoutePutawayByHU", { id: this.ID });
                }
            },
            onReceivingofHUbyConsignementOrderPress: function (oEvent) {
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
                    oRouter.navTo("Receivingofhubyco", { id: this.ID });
                    
                }
            },
            onManuallyRepackHUItemPress: function (oEvent) {
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
                    oRouter.navTo("RouteManuallyRepackingByHuItems", { id: this.ID });
                }
            },
            onWTQuerybyWOPress: function (oEvent) {
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
                    oRouter.navTo("WTQueryByWO", { id: this.ID });
                }
            },
            onReceivingofHUbyDeliveryPress: function (oEvent) {
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
                    oRouter.navTo("RecevingOfHUbyDelivery", { id: this.ID });
                }
            },
            onReceivingofHUbymanufacturingOrderPress: function (oEvent) {
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
                    oRouter.navTo("RecevingOfHUbyManufacturingOrder", { id: this.ID });
                }
            },
            onRecevingofTUDoorTWPress: function (oEvent) {
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
                    oRouter.navTo("RecevingOfHUbyTUorDoor", { id: this.ID });
                }
            },
            onReceivingofHUbyASNPress: function (oEvent) {
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
                    oRouter.navTo("ReceivingofHUbyASN", { id: this.ID });
                }
            },
            onReceivingofHUbyShipmentPress: function (oEvent) {
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
                    oRouter.navTo("ReceivingofHUbyShipment", { id: this.ID });
                }
            },
            onReceivingofHUbyTUPress: function (oEvent) {
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
                    oRouter.navTo("ReceivingofHUbyTU", { id: this.ID });
                }
            },
            onUnloadingByDoorTilePress: function (oEvent) {
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
                    oRouter.navTo("UnloadingByDoor", { id: this.ID });
                }
            },
            onUnloadingByConsignmentOrderTilePress: function (oEvent) {
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
                    oRouter.navTo("UnloadingByConsignmentOrder", { id: this.ID });
                }
            },
            onChangeQueueTilePress: function (oEvent) {
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
                    oRouter.navTo("ChangeQueue", { id: this.ID });
                }
            },
            onChangeResourceGroupTilePress: function (oEvent) {
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
                    oRouter.navTo("ChangeResourceGroup", { id: this.ID });
                }
            },
            onUnloadingbyBillofLadingPress: function (oEvent) {
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
                    oRouter.navTo("UnloadingByBillofLading", { id: this.ID });
                }
            },
            onDeconsolidationAutomaticallyPress: function (oEvent) {
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
                    oRouter.navTo("DeconsolidationAutomatically", { id: this.ID });
                }
            },
            onDeconsolidateManuallyPress: function (oEvent) {
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
                    oRouter.navTo("DeconsolidationManually", { id: this.ID });
                }
            },
            onAdhocInventoryCreationPress: function (oEvent) {
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
                    oRouter.navTo("AdhocInventoryCreation", { id: this.ID });
                }
            },
            onCreationOfSingleHUpress: function (oEvent) {
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
                    oRouter.navTo("CreationOfSingleHU", { id: this.ID });
                }
            },
            onMaintainHUPress: function (oEvent) {
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
                    oRouter.navTo("MaintainHU", { id: this.ID });
                }
            },
            onReversalofConsumptionbyMOHUPress: function (oEvent) {
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
                    oRouter.navTo("ReversalofConsumptionbyMObyHU", { id: this.ID });
                }
            },
            onUnloadingByShipmentPress: function (oEvent) {
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
                    oRouter.navTo("UnloadingByShipment", { id: this.ID });
                }
            },
            onUnloadingByTransportUnitPress: function (oEvent) {
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
                    oRouter.navTo("UnloadingByTU", { id: this.ID });
                }
            },

            // onSBQPAvatarPressed: function () {
            //     var oView = this.getView();

            //     // Create the dialog lazily
            //     if (!this._pProfileDialog) {
            //         this._pProfileDialog = Fragment.load({
            //             id: oView.getId(),
            //             name: "com.app.rfapp.fragments.ProfileDialog",
            //             controller: this
            //         }).then(function (oDialog) {
            //             oView.addDependent(oDialog);
            //             return oDialog;
            //         });
            //     }

            //     this._pProfileDialog.then(function (oDialog) {
            //         oDialog.open();
            //     });
            // },
            onSBQPAvatarPressed: function (oEvent) {
                if (!this._oPopover) {
                    this._oPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.ProfileDialog", this);
                    this.getView().addDependent(this._oPopover);
                }
                // Open popover near the avatar
                this._oPopover.openBy(oEvent.getSource());
            },

            onCloseDialog: function () {
                this._pProfileDialog.then(function (oDialog) {
                    oDialog.close();
                });
            },

            onMyAccountPress: function () {
                sap.m.MessageToast.show("Navigating to My Account...");
            },

            onLogoutPress: function () {
                sap.m.MessageToast.show("Logging out...");
                // Add actual logout logic here
            },
            onRecevinngofHUbyBillofLadingPress: function (oEvent) {
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
                    oRouter.navTo("RouteBillofLading", { id: this.ID });
                }
            },
            onCreateShippingHUPress: function (oEvent) {
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
                    oRouter.navTo("CreateShippingHU", { id: this.ID });
                }
            },
            onCreateShippingHUWOWCPress: function (oEvent) {
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
                    oRouter.navTo("CreateShippingHUWOWC", { id: this.ID });
                }
            },
            onPutawayByWOPress: function (oEvent) {
                if (this.Themecall) {
                    // Get the ID of the pressed tile
                    this._currentTile = oEvent.getSource();
                    this.onBackgroundTilePopOverThemeBtn();
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("PutawayByWO", { id: this.ID });
                }
            },
            onAvailableHandlingunitsonbinqueryPress: function (oEvent) {
                if (this.Themecall) {
                    // Get the ID of the pressed tile
                    this._currentTile = oEvent.getSource();
                    this.onBackgroundTilePopOverThemeBtn();
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AvailableHandlingUnitsOnBinQuery", { id: this.ID });
                }
            },
            onAutomaticallyRepackHUItemPress: function (oEvent) {
                if (this.Themecall) {
                    // Get the ID of the pressed tile
                    this._currentTile = oEvent.getSource();
                    this.onBackgroundTilePopOverThemeBtn();
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AutomaticallyRepackHUItem", { id: this.ID });
                }
            },
            onSetReadyforWHprocessingbyCOPress: function (oEvent) {
                if (this.Themecall) {
                    // Get the ID of the pressed tile
                    this._currentTile = oEvent.getSource();
                    this.onBackgroundTilePopOverThemeBtn();
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("SetReadyforWHProcessingByCO", { id: this.ID });
                }
            },
            onWTquerybyHUPress: function (oEvent) {
                if (this.Themecall) {
                    // Get the ID of the pressed tile
                    this._currentTile = oEvent.getSource();
                    this.onBackgroundTilePopOverThemeBtn();
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByHU", { id: this.ID });
                }
            },
            onWTQueryByWTPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("WTQueryByWT", { id: this.ID });
            },
            onCreateandConfirmAdhocProductWTPress: function (oEvent) {
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
                    oRouter.navTo("CreateConfirmAdhocProduct", { id: this.ID });
                }
            },
            onSerialnumberLocationPress: function (oEvent) {
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
                    oRouter.navTo("SerialNumberLocation", { id: this.ID });
                }
            },
            onStockBinQuerybyProductPress: function (oEvent) {
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
                    oRouter.navTo("StockBinQueryByProduct", { id: this.ID });
                }
            },
            onCreateAdhocHUWTPress: function (oEvent) {
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
                    oRouter.navTo("AdhocHuWt", { id: this.ID });
                }
            },
            onCreateAdhocProductWTPress: function (oEvent) {
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
                    oRouter.navTo("AdhocProductWt", { id: this.ID });
                }
            },
            onReceivingofHUbyDoorPress: function (oEvent) {
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
                    oRouter.navTo("ReceivingOfHuByDoor", { id: this.ID });
                }
            },
            onStockBinQuerybyBinPress: function (oEvent) {
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
                    oRouter.navTo("StockBinQueryByBin", { id: this.ID });
                }
            },
            onHUQueryPress: function (oEvent) {
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
                    oRouter.navTo("HuQuery", { id: this.ID });
                }
            },
            onUnloadingByDeliveryPress: function (oEvent) {
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
                    // Proceed with normal navigation
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadByDelivery", { id: this.ID });
                }
            },
            onUnloadingByASNPress: function (oEvent) {
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
                    oRouter.navTo("RouteUnloadingASNDetails", { id: this.ID });
                }
            },
            onWTQuerybyQueuePress: function (oEvent) {
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
                    oRouter.navTo("WTQueryByQueue", { id: this.ID });
                }
            },
            onPickPointPress: function (oEvent) {
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
                    oRouter.navTo("PickPoint", { id: this.ID });
                }
            },
            onManuallyrepackallHUitemsPress: function (oEvent) {
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
                    oRouter.navTo("ManuallyRepackAllHUItems", { id: this.ID });
                }
            },
            onHUStockOverviewQueryPress: function (oEvent) {
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
                    oRouter.navTo("HUStockOverviewQuery", { id: this.ID });
                }
            },
            onConsumptionByManufacturingOrderPress: function (oEvent) {
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
                    oRouter.navTo("ConsumptionByManufacturingOrder", { id: this.ID });
                }
            },
            onCreatePutawayHusforDeconsolidationPress: function (oEvent) {
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
                    oRouter.navTo("CreatePutawayHusforDeconsolidate", { id: this.ID });
                }
            },
            onCreatePutawayHusManuallyPress: function (oEvent) {
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
                    oRouter.navTo("CreatePutawayHusManually", { id: this.ID });
                }
            },
            onLoadByHUManPosAssigmentPress: function (oEvent) {
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
                    oRouter.navTo("LoadbyHUManPosAssiognment", { id: this.ID });
                }
            },
            onPutawayByHUClusteredPress: function (oEvent) {
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
                    oRouter.navTo("RoutePutawayHuClustered", { id: this.ID });
                }
            },
            onAutomaticallyRepackHUPress: function (oEvent) {
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
                    oRouter.navTo("AutomaticallyRepackHu", { id: this.ID });
                }
            },
            onLoadByHUAutoPosAssignmentPress: function (oEvent) {
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
                    oRouter.navTo("LoadbyHUAutoPosAssiognment", { id: this.ID });
                }
            },

            onProductInspectionByHUPress: function (oEvent) {
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
                    oRouter.navTo("ProductInspectionByHU", { id: this.ID });
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

            onProductInspectionByStorageBinPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ProductInspectionByStorageBin", { id: this.ID });
            },
                        onProfilePressed: function () {
                var oView = this.getView();
 
                // Check if the dialog already exists
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
                } else {
                    // If the dialog already exists, just open it
                    this.byId("idUserDetails").open();
                }
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