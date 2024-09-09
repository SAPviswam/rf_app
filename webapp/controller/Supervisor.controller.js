sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/Device",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
         "sap/ui/core/UIComponent"
    ],
    function (BaseController, Device, JSONModel, MessageToast, UIComponent) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.Supervisor", {
            onInit: function () {
                this.bOtpVerified = true;
                var oModel = new JSONModel(sap.ui.require.toUrl("com/app/rfapp/model/data1.json"));
                this.getView().setModel(oModel);
                var oModelV2 = this.getOwnerComponent().getModel();
                this.getView().byId("pageContainer").setModel(oModelV2);
                //this._updateComboBoxItems();
                this._fetchUniqueProcessAreas();
                this.byId("idEmppInput").attachLiveChange(this.onEmployeeIdLiveChange, this);
                //stored colours applying...
                this.applyStoredColors();

            },
            onAfterRendering: function() {
                this.applyStoredColors();
            },
            applyStoredColors: function () {
                // Apply stored theme color
                var sStoredThemeColor = localStorage.getItem("themeColor");
                if (sStoredThemeColor) {
                    this.applyThemeColor(sStoredThemeColor);
                }
            
                // Apply stored tile colors
                var storedColors = localStorage.getItem("tileColors");
                if (storedColors) {
                    var tileColors = JSON.parse(storedColors);
                    for (var sTileId in tileColors) {
                        if (tileColors.hasOwnProperty(sTileId)) {
                            this._applyColorToTile(sTileId, tileColors[sTileId]);
                        }
                    }
                }
            },
            
            _applyColorToTile: function (sTileId, sColor) {
                var oTile = this.byId(sTileId);

                if (oTile) {
                    // Use setTimeout to ensure the DOM is ready before applying styles
                    setTimeout(function () {
                        var oTileDomRef = oTile.getDomRef();
                        if (oTileDomRef) {
                            oTileDomRef.style.backgroundColor = sColor;  // Apply the stored color
                        }
                    }, 0);  // Use a short delay
                }
            },
            // applyStoredColors: function () {
            //     // Apply stored theme color
            //     var sStoredThemeColor = localStorage.getItem("themeColor");
            //     if (sStoredThemeColor) {
            //         this.applyThemeColor(sStoredThemeColor);
            //     }
 
            //     // Apply stored tile colors
            //     var storedColors = localStorage.getItem("tileColors");
            //     if (storedColors) {
            //         var tileColors = JSON.parse(storedColors);
            //         for (var sTileId in tileColors) {
            //             if (tileColors.hasOwnProperty(sTileId)) {
            //                 this.applyColorToTile(sTileId, tileColors[sTileId]);
            //             }
            //         }
            //     }
            // },
            onOpenThemeDialog: function () {
                this.byId("themeTileDialog").open();
            },
 
            onPaletteIconBtnTilePress: function (oEvent) {
                this._currentTileId = oEvent.getSource().getParent().getParent().getId();
                this.byId("themeTileDialog").open();
            },
 
            onApplyColor: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("colorPicker");
                var sColorPickerValue = oColorPicker.getColorString();
                var aSelectedColors = [];
                var oColorOptions = this.byId("colorOptions").getItems();
 
                // Collect selected colors from checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem.getSelected()) {
                        var sColorValue = oItem.getCustomData()[0].getValue(); // Get the color from custom data
                        aSelectedColors.push(sColorValue);
                    }
                });
 
                // Handle cases where checkboxes are selected
                if (aSelectedColors.length > 0) {
                    if (aSelectedColors.length > 1) {
                        // If more than one checkbox is selected, raise an error
                        sap.m.MessageToast.show("You can only select one color.");
                        return; // Exit the function without applying the color
                    }
 
                    if (oColorPicker.getVisible()) {
                        // If the color picker is visible while a checkbox is selected, raise an error
                        sap.m.MessageToast.show("Please deselect the checkbox before using the custom color picker.");
                        return; // Exit the function without applying the color
                    }
 
                    var sSelectedColor = aSelectedColors[0]; // Only one color is allowed from checkboxes
                    if (this._currentTileId) {
                        this.applyColorToTile(this._currentTileId, sSelectedColor);
                        sap.m.MessageToast.show("Tile color applied successfully!");
                        this._currentTileId = null; // Clear the current tile ID
                    } else {
                        this.applyThemeColor(sSelectedColor);
                        sap.m.MessageToast.show("Theme color applied successfully!");
                    }
                } else if (this._isValidColor(sColorPickerValue)) {
                    // If no checkbox is selected, apply the color from the color picker
                    if (this._currentTileId) {
                        this.applyColorToTile(this._currentTileId, sColorPickerValue);
                        sap.m.MessageToast.show("Tile color applied successfully!");
                        this._currentTileId = null; // Clear the current tile ID
                    } else {
                        this.applyThemeColor(sColorPickerValue);
                        sap.m.MessageToast.show("Theme color applied successfully!");
                    }
                } else {
                    sap.m.MessageToast.show("Invalid color format. Please use a valid color code.");
                }
                //reset dailog and closed...
                this.resetDialogBox();
                this.byId("themeTileDialog").close();
 
            },
            //Options for selecting colours from top in dailog...(chnage="onColorOptionSelect")
            onColorOptionSelect: function (oEvent) {
                var oSelectedCheckBox = oEvent.getSource();
                var oColorOptions = this.byId("colorOptions").getItems();
 
                // Deselect all other checkboxes except the currently selected one
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem !== oSelectedCheckBox) {
                        oItem.setSelected(false);
                    }
                });
 
                // Show or hide the color picker based on the checkbox selection
                this.byId("colorPicker").setVisible(!oSelectedCheckBox.getSelected());
            },
            applyThemeColor: function (sColor) {
                var aElements = [
                    this.byId("toolPage"),
                    this.byId("idSideNavigation"),
                    this.byId("idtntToolHeader"),
                    this.byId("pageContainer")
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
 
                // Store the selected theme color in local storage
                localStorage.setItem("themeColor", sColor);
            },
            // applyColorToTile: function (sTileId, sColor) {
            //     var oTile = this.byId(sTileId);
 
            //     if (oTile) {
            //         var sTileColorClass = "tileColor_" + sTileId;
 
            //         // Remove the old color class if it exists
            //         oTile.removeStyleClass(sTileColorClass);
 
            //         // Create or update the style element
            //         var oStyleElement = document.getElementById(sTileColorClass);
            //         if (!oStyleElement) {
            //             oStyleElement = document.createElement("style");
            //             oStyleElement.id = sTileColorClass;
            //             document.head.appendChild(oStyleElement);
            //         }
            //         oStyleElement.textContent = "#" + sTileId + " { background-color: " + sColor + " !important; }";
 
            //         // Apply the new color class to the tile
            //         oTile.addStyleClass(sTileColorClass);
 
            //         // Retrieve and update the color storage
            //         var tileColors = {};
            //         try {
            //             var storedColors = localStorage.getItem("tileColors");
            //             if (storedColors) {
            //                 tileColors = JSON.parse(storedColors);
            //             }
            //         } catch (e) {
            //             console.error("Failed to parse tile colors from localStorage:", e);
            //         }
 
            //         // Update the tile color in localStorage
            //         tileColors[sTileId] = sColor;
            //         localStorage.setItem("tileColors", JSON.stringify(tileColors));
 
            //         // Clear the tile ID after applying the color
            //         this._currentTileId = null;
            //     }
            // },
            applyColorToTile: function (sTileId, sColor) {
                var oTile = this.byId(sTileId);
                
                if (oTile) {
                    // Get the DOM reference of the tile
                    var oTileDomRef = oTile.getDomRef();
            
                    if (oTileDomRef) {
                        // Directly apply the background color using the DOM reference
                        oTileDomRef.style.backgroundColor = sColor;
                    }
            
                    // Retrieve and update the color storage
                    var tileColors = {};
                    try {
                        var storedColors = localStorage.getItem("tileColors");
                        if (storedColors) {
                            tileColors = JSON.parse(storedColors);
                        }
                    } catch (e) {
                        console.error("Failed to parse tile colors from localStorage:", e);
                    }
            
                    // Update the tile color in localStorage
                    tileColors[sTileId] = sColor;
                    localStorage.setItem("tileColors", JSON.stringify(tileColors));
            
                    // Clear the tile ID after applying the color
                    this._currentTileId = null;
                }
            },
            
            _isValidColor: function (sColor) {
                var hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
                var rgbRegex = /^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/;
                return hexRegex.test(sColor) || rgbRegex.test(sColor);
            },
            onCancelColorDialog: function () {
                this.byId("themeTileDialog").close();
                this.resetDialogBox();
            },
            //Reset DialogBox and clearing all Checkboxs it opens freshly...
            resetDialogBox: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("colorPicker");
                var oColorOptions = this.byId("colorOptions").getItems();
 
                // Deselect all checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox) {
                        oItem.setSelected(false);
                    }
                });
                // Reset the color picker to its default value
                oColorPicker.setColorString("#FFFFFF"); // Set to white or any default color
                oColorPicker.setVisible(true);
            },
 
            
            onRefreshRequestedData:function(){
                this.onRequestedData();
                this.onUserData();
            },
            onRequestedData: function () {
                var oTable = this.byId("idRequestedData");
                if (oTable) {
                    var oBinding = oTable.getBinding("items");
                    if (oBinding) {
                        oBinding.refresh(); // Refresh the binding to reload data
                    }
                }
            },
            onUserData: function () {
                var oTable = this.byId("idUserDataTable");
                if (oTable) {
                    var oBinding = oTable.getBinding("items");
                    if (oBinding) {
                        oBinding.refresh(); // Refresh the binding to reload data
                    }
                }
            },
            onItemSelect: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
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
            onApproveUserBtnPress: async function () {
                debugger
                var oView = this.getView();
                if (this.byId("idRequestedData").getSelectedItems().length < 1) {
                    MessageToast.show("Please Select atleast one Resource");
                    return
                }
                else if (this.byId("idRequestedData").getSelectedItems().length > 1) {
                    MessageToast.show("Please Select only one Resource");
                    return
                }
                var oSelectedResource = this.byId("idRequestedData").getSelectedItem().getBindingContext().getObject();
                console.log(oSelectedResource)

                this.oApproveForm ??= await this.loadFragment({
                    name: "com.app.rfapp.fragments.ApproveDetails"
                })
                this.oApproveForm.open();
                if (oSelectedResource.Email) {
                    oView.byId("idEmailInputF").setText(oSelectedResource.Email)
                }
                else {
                    oView.byId("idEmailInputF").setVisible(false)
                    oView.byId("idEmployeeEmailLabelF").setVisible(false)
                }
                oView.byId("idEmployeeIDInputF").setText(oSelectedResource.Resourceid)
                oView.byId("idNameInputF").setText(oSelectedResource.Resourcename)
                oView.byId("idEmailInputF").setText(oSelectedResource.Email)
                oView.byId("idPhoneInputF").setText(oSelectedResource.Phonenumber)
                oView.byId("idRoesurcetypeInputF").setText(oSelectedResource.Resourcetype)


                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/ProcessAreaSet", {
                    success: function (oData) {
                        var aProcessAreas = oData.results;
                        var uniqueProcessAreasSet = new Set();

                        // Add unique Processarea values to the Set
                        aProcessAreas.forEach(function (item) {
                            uniqueProcessAreasSet.add(item.Processarea);
                        });

                        // Convert the Set back to an array for the JSON model
                        var aUniqueProcessAreas = Array.from(uniqueProcessAreasSet).map(function (area) {
                            return { Processarea: area };
                        });

                        var oUniqueModel = new sap.ui.model.json.JSONModel({
                            ProcessAreas: aUniqueProcessAreas
                        });

                        var oMultiComboBox = this.byId("idAreaSelect");
                        if (!oMultiComboBox) {
                            // If it's inside a fragment, use Fragment.byId
                            oMultiComboBox = sap.ui.core.Fragment.byId("fragmentId", "idAreaSelect");
                        }
                        if (oMultiComboBox) {
                            oMultiComboBox.setModel(oUniqueModel);
                            oMultiComboBox.bindItems({
                                path: "/ProcessAreas",
                                template: new sap.ui.core.Item({
                                    key: "{Processarea}",
                                    text: "{Processarea}"
                                })
                            });
                        } else {
                            console.error("MultiComboBox with id 'idAreaSelect' not found.");
                        }
                         // Add the two functions here after the success
                        this.onRequestedData();
                        this.onUserData();
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error reading AreaSet:", oError);
                    }
                });

            },
            onClose: function () {
                this.oApproveForm.close();
            },
            onApprove: function () {
                var Empid = this.byId("idEmployeeIDInputF").getText();

                var oNameInput = this.byId("idNameInputF");
                var oEmailInput = this.byId("idEmailInputF");
                var oPhoneInput = this.byId("idPhoneInputF");
                var oResourcetypeInput = this.byId("idRoesurcetypeInputF");
                var oAreaSelect = this.byId("idAreaSelect");
                var oGroupSelect = this.byId("idGroupSelect");
                var oQueueSelect = this.byId("idQueueSelect");

                var Name = oNameInput.getText();
                var email = oEmailInput.getText();
                var phone = oPhoneInput.getText();
                var Resourcetype = oResourcetypeInput.getText();
                var Area = oAreaSelect.getSelectedKeys().join(",");
                var Group = oGroupSelect.getSelectedKeys().join(",");
                var Queue = oQueueSelect.getSelectedKeys().join(",");

                var isValid = true;

                // // Validate Name
                // if (!Name) {
                //     oNameInput.setValueState(sap.ui.core.ValueState.Error);
                //     oNameInput.setValueStateText("Name is required.");
                //     isValid = false;
                // } else {
                //     oNameInput.setValueState(sap.ui.core.ValueState.None);
                //     oNameInput.setValueStateText("");
                // }

                // // Validate Email (optional)
                // if (email) {
                //     var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                //     if (!emailRegex.test(email)) {
                //         oEmailInput.setValueState(sap.ui.core.ValueState.Error);
                //         oEmailInput.setValueStateText("Invalid email format.");
                //         isValid = false;
                //     } else {
                //         oEmailInput.setValueState(sap.ui.core.ValueState.None);
                //         oEmailInput.setValueStateText("");
                //     }
                // } else {
                //     oEmailInput.setValueState(sap.ui.core.ValueState.None);
                //     oEmailInput.setValueStateText("");
                // }

                // // Validate Phone
                // if (!phone) {
                //     oPhoneInput.setValueState(sap.ui.core.ValueState.Error);
                //     oPhoneInput.setValueStateText("Phone number is required.");
                //     isValid = false;
                // } else {
                //     oPhoneInput.setValueState(sap.ui.core.ValueState.None);
                //     oPhoneInput.setValueStateText("");
                // }

                // // Validate Resourcetype
                // if (!Resourcetype) {
                //     oResourcetypeInput.setValueState(sap.ui.core.ValueState.Error);
                //     oResourcetypeInput.setValueStateText("Resource type is required.");
                //     isValid = false;
                // } else {
                //     oResourcetypeInput.setValueState(sap.ui.core.ValueState.None);
                //     oResourcetypeInput.setValueStateText("");
                // }

                // Validate Area
                if (Area.length === 0) {
                    oAreaSelect.setValueState(sap.ui.core.ValueState.Error);
                    oAreaSelect.setValueStateText("At least one area must be selected.");
                    isValid = false;
                } else {
                    oAreaSelect.setValueState(sap.ui.core.ValueState.None);
                    oAreaSelect.setValueStateText("");
                }

                // Validate Group
                if (Group.length === 0) {
                    oGroupSelect.setValueState(sap.ui.core.ValueState.Error);
                    oGroupSelect.setValueStateText("At least one group must be selected.");
                    isValid = false;
                } else {
                    oGroupSelect.setValueState(sap.ui.core.ValueState.None);
                    oGroupSelect.setValueStateText("");
                }

                // Validate Queue
                if (Queue.length === 0) {
                    oQueueSelect.setValueState(sap.ui.core.ValueState.Error);
                    oQueueSelect.setValueStateText("At least one queue must be selected.");
                    isValid = false;
                } else {
                    oQueueSelect.setValueState(sap.ui.core.ValueState.None);
                    oQueueSelect.setValueStateText("");
                }

                // Final check
                if (!isValid) {
                    sap.m.MessageToast.show("Please correct the errors before proceeding.");
                    return;
                }

                function generatePassword() {
                    const regex = /[A-Za-z@!#$%&]/;
                    const passwordLength = 8;
                    let password = "";

                    for (let i = 0; i < passwordLength; i++) {
                        let char = '';
                        while (!char.match(regex)) {
                            char = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
                        }
                        password += char;
                    }

                    return password;
                }
                var oPassword = generatePassword();

                var oExpiryDate = new Date();
                // Set the expiry date based on the resource type
                if (Resourcetype === "Permanent Employee") {
                    oExpiryDate.setFullYear(oExpiryDate.getFullYear() + 1); // 1 year for permanent employees
                } else if (Resourcetype === "Contract Employee") {
                    oExpiryDate.setMonth(oExpiryDate.getMonth() + 2); // 2 months for temporary employees
                }

                var oCurrentDateTime = new Date();
                var sFormattedCurrentDateTime = this.formatDate(oCurrentDateTime);
                var sFormattedExpiryDate = this.formatDate(oExpiryDate);

                var oData = {
                    Area: Area,
                    Email: email,
                    Notification: "your request has been Approved",
                    Phonenumber: phone,
                    Queue: Queue,
                    Resourcegroup: Group,
                    Resourceid: Empid,
                    Resourcename: Name,
                    Resourcetype: Resourcetype,
                    Approveddate: sFormattedCurrentDateTime,
                    Expirydate: sFormattedExpiryDate,
                    Password: oPassword,
                    Status: "true",
                    Loginfirst: true
                };
                var oModel = this.getOwnerComponent().getModel();
                oModel.update(`/RESOURCESSet('${Empid}')`, oData, {
                    success: function () {
                        sap.m.MessageToast.show("Password updated successfully!");
                        this.resetForm();

                        // Navigate to the user menu after successful password update
                        this.onRequestedData();
                        this.onUserData();
                        this.oApproveForm.close();
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error updating user login status.");
                    }
                });

            },
            _updateComboBoxItems: function () {
                var oComboBox = this.byId("_IDGenComboBox1");
                var oModel = this.getView().getModel();
                var aItems = oModel.getProperty("/ProcessAreaSet");

                // Create a set to track unique keys
                var aUniqueItems = [];
                var aKeys = new Set();

                // Filter out duplicates
                aItems.forEach(function (oItem) {
                    if (!aKeys.has(oItem.Processarea)) {
                        aKeys.add(oItem.Processarea);
                        aUniqueItems.push(oItem);
                    }
                });

                // Create a new model with unique items
                var oUniqueModel = new sap.ui.model.json.JSONModel({
                    ProcessAreaSet: aUniqueItems
                });

                // Set the filtered model to the ComboBox
                oComboBox.setModel(oUniqueModel);
            },

            _fetchUniqueProcessAreas: function () {
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/ProcessAreaSet", {
                    success: function (oData) {
                        var aProcessAreas = oData.results;
                        var uniqueProcessAreasSet = new Set();

                        // Add unique Processarea values to the Set
                        aProcessAreas.forEach(function (item) {
                            uniqueProcessAreasSet.add(item.Processarea);
                        });

                        // Convert the Set back to an array for the JSON model
                        var aUniqueProcessAreas = Array.from(uniqueProcessAreasSet).map(function (area) {
                            return { Processarea: area };
                        });

                        var oUniqueModel = new sap.ui.model.json.JSONModel({
                            ProcessAreas: aUniqueProcessAreas
                        });

                        var oMultiComboBox = this.byId("AreaSelect");
                        if (!oMultiComboBox) {
                            // If it's inside a fragment, use Fragment.byId
                            oMultiComboBox = sap.ui.core.Fragment.byId("fragmentId", "AreaSelect");
                        }
                        if (oMultiComboBox) {
                            oMultiComboBox.setModel(oUniqueModel);
                            oMultiComboBox.bindItems({
                                path: "/ProcessAreas",
                                template: new sap.ui.core.Item({
                                    key: "{Processarea}",
                                    text: "{Processarea}"
                                })
                            });
                        } else {
                            console.error("MultiComboBox with id 'AreaSelect' not found.");
                        }
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error reading AreaSet:", oError);
                    }
                });
            },

            onCheckBoxSelect: function () {
                debugger
                // Get the MultiComboBox instance for the Process Area
                var oMultiComboBox = this.byId("AreaSelect");

                // Retrieve the selected items
                var aSelectedItems = oMultiComboBox.getSelectedItems();

                // Initialize an array to hold the filters
                var aFilters = [];

                // Iterate over the selected items to add corresponding filters
                aSelectedItems.forEach(function (oItem) {
                    var sKey = oItem.getText(); // Get the key (e.g., "Inbound", "Outbound", "Internal")

                    // Add filter for the selected process area
                    aFilters.push(new sap.ui.model.Filter("Processarea", sap.ui.model.FilterOperator.EQ, sKey));
                });

                // Combine the filters with an OR condition
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // This specifies the OR condition
                });

                // Get the Group MultiComboBox and apply the filters
                var oGroupMultiComboBox = this.byId("GroupSelect");
                // Fetch data from the model with applied filters
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/ProcessAreaSet", {
                    filters: [oCombinedFilter],
                    success: function (oData) {
                        // Process data to remove duplicates
                        var aUniqueItems = [];
                        var oProcessGroups = {};

                        // Iterate over fetched data
                        oData.results.forEach(function (oItem) {
                            var sGroup = oItem.Processgroup;

                            // Add to unique items if not already present
                            if (!oProcessGroups[sGroup]) {
                                oProcessGroups[sGroup] = true;
                                aUniqueItems.push({
                                    key: sGroup,
                                    text: sGroup
                                });
                            }
                        });


                        // Clear existing items in the MultiComboBox
                        oGroupMultiComboBox.removeAllItems();

                        // Add the unique items to the MultiComboBox
                        aUniqueItems.forEach(function (oItem) {
                            oGroupMultiComboBox.addItem(new sap.ui.core.Item({
                                key: oItem.key,
                                text: oItem.text
                            }));
                        });

                        // Make sure the Group MultiComboBox is visible
                        oGroupMultiComboBox.setVisible(true);
                    },
                    error: function (oError) {
                        // Handle error if necessary
                        sap.m.MessageToast.show("Failed to fetch data.");
                    }
                });
            },
            onRejectUserBtnPress: function () {
                var oView = this.getView();
                var oSelectedItems = this.byId("idRequestedData").getSelectedItems();
            
                // Validate the number of selected items
                if (oSelectedItems.length !== 1) {
                    MessageToast.show("Please select exactly one Resource");
                    return;
                }
            
                // Get the selected resource object
                var oSelectedResource = oSelectedItems[0].getBindingContext().getObject();
                var sResourceId = oSelectedResource.Resourceid; // Assuming Resourceid is the key
            
                // Get the OData model
                var oModel = this.getOwnerComponent().getModel();
            
                // Delete the selected record
                oModel.remove("/RESOURCESSet('" + sResourceId + "')", {
                    method: "DELETE",
                    success: function () {
                        // Show success message
                        MessageToast.show("Resource deleted successfully");
                        // Optionally, refresh the table or handle UI updates here
                    },
                    error: function (oError) {
                        // Show error message
                        MessageToast.show("Error deleting resource");
                        console.error("Error deleting resource:", oError);
                    }
                });
            },
            
            onPressCreateArea: function () {
                this.getView().byId("page1").setVisible(false);
                this.getView().byId("_IDGenTswfd_able1").setVisible(true);
            },
            onCheckBoxSelectGroup: function () {
                debugger;

                // Get the MultiComboBox instances for Area and Group
                var oAreaMultiComboBox = this.byId("AreaSelect");
                var oGroupMultiComboBox = this.byId("GroupSelect");
                var oQueueMultiComboBox = this.byId("_IDGenComboBox10");

                // Retrieve the selected items
                var aSelectedAreas = oAreaMultiComboBox.getSelectedItems();
                var aSelectedGroups = oGroupMultiComboBox.getSelectedItems();

                // Initialize an array to hold the filters
                var aFilters = [];

                // Iterate over the selected groups to add corresponding filters
                aSelectedGroups.forEach(function (oItem) {
                    var sGroupKey = oItem.getText(); // Get the key (e.g., "Inbound", "Outbound", "Internal")

                    // Add filter for the selected process group
                    aFilters.push(new sap.ui.model.Filter("Processgroup", sap.ui.model.FilterOperator.EQ, sGroupKey));
                });

                // Combine the filters with an OR condition
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // This specifies the OR condition
                });

                // Fetch data from the model with applied filters
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/ProcessAreaSet", {
                    filters: [oCombinedFilter],
                    success: function (oData) {
                        // Process data to remove duplicates and ensure matching with selected areas
                        var aUniqueItems = [];
                        var oQueues = {};
                        var oAreaGroupMap = {};

                        // Iterate over fetched data
                        oData.results.forEach(function (oItem) {
                            var sQueue = oItem.Queue;
                            var sArea = oItem.Processarea;
                            var sGroup = oItem.Processgroup;

                            // Build a map of area-group-queue relations
                            if (!oAreaGroupMap[sArea]) {
                                oAreaGroupMap[sArea] = {};
                            }
                            if (!oAreaGroupMap[sArea][sGroup]) {
                                oAreaGroupMap[sArea][sGroup] = [];
                            }
                            oAreaGroupMap[sArea][sGroup].push(sQueue);

                            // Add to unique items if not already present
                            if (!oQueues[sQueue]) {
                                oQueues[sQueue] = true;
                                aUniqueItems.push({
                                    key: sQueue,
                                    text: sQueue
                                });
                            }
                        });

                        // Validate that the Group selection matches the Area selections
                        var isValid = true;
                        aSelectedAreas.forEach(function (oAreaItem) {
                            var sAreaKey = oAreaItem.getText();
                            var bGroupMatched = aSelectedGroups.some(function (oGroupItem) {
                                var sGroupKey = oGroupItem.getText();
                                return oAreaGroupMap[sAreaKey] && oAreaGroupMap[sAreaKey][sGroupKey];
                            });

                            if (!bGroupMatched) {
                                isValid = false;

                                // Set the value state to Error for Group MultiComboBox
                                oGroupMultiComboBox.setValueState("Error");
                                oGroupMultiComboBox.setValueStateText("Please select at least one group related to the selected areas.");

                                // Show error message
                                sap.m.MessageToast.show("Please select at least one group related to the selected areas.");
                            }
                        });

                        if (!isValid) {
                            oQueueMultiComboBox.removeAllItems(); // Clear Queue items if validation fails
                            return;
                        }

                        // Reset value state to None if validation is successful
                        oGroupMultiComboBox.setValueState("None");

                        // Clear existing items in the Queue MultiComboBox
                        oQueueMultiComboBox.removeAllItems();

                        // Add the unique items to the Queue MultiComboBox
                        aUniqueItems.forEach(function (oItem) {
                            oQueueMultiComboBox.addItem(new sap.ui.core.Item({
                                key: oItem.key,
                                text: oItem.text
                            }));
                        });

                        // Make sure the Queue MultiComboBox is visible
                        oQueueMultiComboBox.setVisible(true);
                    },
                    error: function (oError) {
                        // Handle error if necessary
                        sap.m.MessageToast.show("Failed to fetch data.");
                    }
                });
            },
            onCheckBoxSelectQueue: function () {
                debugger;

                // Get the MultiComboBox instances for Group and Queue
                var oGroupMultiComboBox = this.byId("GroupSelect");
                var oQueueMultiComboBox = this.byId("_IDGenComboBox10");

                // Retrieve the selected items
                var aSelectedGroups = oGroupMultiComboBox.getSelectedItems();
                var aSelectedQueues = oQueueMultiComboBox.getSelectedItems();

                // Initialize an array to hold the filters
                var aFilters = [];

                // Iterate over the selected queues to add corresponding filters
                aSelectedQueues.forEach(function (oItem) {
                    var sQueueKey = oItem.getText(); // Get the key (e.g., "Queue1", "Queue2", etc.)

                    // Add filter for the selected process queue
                    aFilters.push(new sap.ui.model.Filter("Queue", sap.ui.model.FilterOperator.EQ, sQueueKey));
                });

                // Combine the filters with an OR condition
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // This specifies the OR condition
                });

                // Fetch data from the model with applied filters
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/ProcessAreaSet", {
                    filters: [oCombinedFilter],
                    success: function (oData) {
                        // Process data to ensure matching with selected groups
                        var oGroupQueueMap = {};
                        var isValid = true;

                        // Build a map of group-queue relations
                        oData.results.forEach(function (oItem) {
                            var sGroup = oItem.Processgroup;
                            var sQueue = oItem.Queue;

                            if (!oGroupQueueMap[sGroup]) {
                                oGroupQueueMap[sGroup] = [];
                            }
                            oGroupQueueMap[sGroup].push(sQueue);
                        });

                        // Validate that the Queue selection matches the Group selections
                        aSelectedGroups.forEach(function (oGroupItem) {
                            var sGroupKey = oGroupItem.getText();
                            var bQueueMatched = aSelectedQueues.some(function (oQueueItem) {
                                var sQueueKey = oQueueItem.getText();
                                return oGroupQueueMap[sGroupKey] && oGroupQueueMap[sGroupKey].includes(sQueueKey);
                            });

                            if (!bQueueMatched) {
                                isValid = false;

                                // Set the value state to Error for Queue MultiComboBox
                                oQueueMultiComboBox.setValueState("Error");
                                oQueueMultiComboBox.setValueStateText("Please select at least one queue related to the selected groups.");

                                // Show error message
                                sap.m.MessageToast.show("Please select at least one queue related to the selected groups.");
                            }
                        });

                        if (!isValid) {
                            return;
                        }

                        // Reset value state to None if validation is successful
                        oQueueMultiComboBox.setValueState("None");

                    },
                    error: function (oError) {
                        // Handle error if necessary
                        sap.m.MessageToast.show("Failed to fetch data.");
                    }
                });
            },


            onApprovePress: function () {
                debugger
                var Empid = this.byId("idEmppInput").getValue();

                var oNameInput = this.byId("idNameInput");
                var oEmailInput = this.byId("idEmailInput");
                var oPhoneInput = this.byId("idPhoneInput");
                var oResourcetypeInput = this.byId("idRoesurcetypeInput");
                var oAreaSelect = this.byId("AreaSelect");
                var oGroupSelect = this.byId("GroupSelect");
                var oQueueSelect = this.byId("_IDGenComboBox10");

                var Name = oNameInput.getValue();
                var email = oEmailInput.getValue();
                var phone = oPhoneInput.getValue();
                var Resourcetype = oResourcetypeInput.getValue();
                var Area = oAreaSelect.getSelectedKeys().join(",");
                var Group = oGroupSelect.getSelectedKeys().join(",");
                var Queue = oQueueSelect.getSelectedKeys().join(",");

                var isValid = true;

                // Validate Name
                if (!Name) {
                    oNameInput.setValueState(sap.ui.core.ValueState.Error);
                    oNameInput.setValueStateText("Name is required.");
                    isValid = false;
                } else {
                    oNameInput.setValueState(sap.ui.core.ValueState.None);
                    oNameInput.setValueStateText("");
                }

                // Validate Email (optional)
                if (email) {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        oEmailInput.setValueState(sap.ui.core.ValueState.Error);
                        oEmailInput.setValueStateText("Invalid email format.");
                        isValid = false;
                    } else {
                        oEmailInput.setValueState(sap.ui.core.ValueState.None);
                        oEmailInput.setValueStateText("");
                    }
                } else {
                    oEmailInput.setValueState(sap.ui.core.ValueState.None);
                    oEmailInput.setValueStateText("");
                }
                debugger
                // Validate Phone
                if (!phone) {
                    oPhoneInput.setValueState(sap.ui.core.ValueState.Error);
                    oPhoneInput.setValueStateText("Phone number is required.");
                    isValid = false;
                } else if (phone.length !== 10 || !/^\d+$/.test(phone)) {
                    oPhoneInput.setValueState(sap.ui.core.ValueState.None);
                    oPhoneInput.setValueStateText("");
                }
                else {
                    oPhoneInput.setValueState("None");
                    if (!this.bOtpVerified) {
                        sap.m.MessageToast.show("Please verify your phone number with the OTP before submitting.");
                        return;
                    }
                }

                // Validate Resourcetype
                if (!Resourcetype) {
                    oResourcetypeInput.setValueState(sap.ui.core.ValueState.Error);
                    oResourcetypeInput.setValueStateText("Resource type is required.");
                    isValid = false;
                } else {
                    oResourcetypeInput.setValueState(sap.ui.core.ValueState.None);
                    oResourcetypeInput.setValueStateText("");
                }

                // Validate Area
                if (Area.length === 0) {
                    oAreaSelect.setValueState(sap.ui.core.ValueState.Error);
                    oAreaSelect.setValueStateText("At least one area must be selected.");
                    isValid = false;
                } else {
                    oAreaSelect.setValueState(sap.ui.core.ValueState.None);
                    oAreaSelect.setValueStateText("");
                }

                // Validate Group
                if (Group.length === 0) {
                    oGroupSelect.setValueState(sap.ui.core.ValueState.Error);
                    oGroupSelect.setValueStateText("At least one group must be selected.");
                    isValid = false;
                } else {
                    oGroupSelect.setValueState(sap.ui.core.ValueState.None);
                    oGroupSelect.setValueStateText("");
                }

                // Validate Queue
                if (Queue.length === 0) {
                    oQueueSelect.setValueState(sap.ui.core.ValueState.Error);
                    oQueueSelect.setValueStateText("At least one queue must be selected.");
                    isValid = false;
                } else {
                    oQueueSelect.setValueState(sap.ui.core.ValueState.None);
                    oQueueSelect.setValueStateText("");
                }

                // Final check
                if (!isValid) {
                    sap.m.MessageToast.show("Please correct the errors before proceeding.");
                    return;
                }

                function generatePassword() {
                    const regex = /[A-Za-z@!#$%&]/;
                    const passwordLength = 8;
                    let password = "";

                    for (let i = 0; i < passwordLength; i++) {
                        let char = '';
                        while (!char.match(regex)) {
                            char = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
                        }
                        password += char;
                    }

                    return password;
                }
                var oPassword = generatePassword();

                var oExpiryDate = new Date();
                // Set the expiry date based on the resource type
                if (Resourcetype === "PermanentEmployee") {
                    oExpiryDate.setFullYear(oExpiryDate.getFullYear() + 1); // 1 year for permanent employees
                } else if (Resourcetype === "temporaryemployee") {
                    oExpiryDate.setMonth(oExpiryDate.getMonth() + 2); // 2 months for temporary employees
                }

                var oCurrentDateTime = new Date();
                var sFormattedCurrentDateTime = this.formatDate(oCurrentDateTime);
                var sFormattedExpiryDate = this.formatDate(oExpiryDate);

                var oData = {
                    Area: Area,
                    Email: email,
                    Notification: "your request has been Approved",
                    Phonenumber: phone,
                    Queue: Queue,
                    Resourcegroup: Group,
                    Resourceid: Empid,
                    Resourcename: Name,
                    Resourcetype: Resourcetype,
                    Approveddate: sFormattedCurrentDateTime,
                    Expirydate: sFormattedExpiryDate,
                    Password: oPassword,
                    Status: "true",
                    Loginfirst: true
                };
                var oModel = this.getOwnerComponent().getModel();
                oModel.update(`/RESOURCESSet('${Empid}')`, oData, {
                    success: function () {
                        sap.m.MessageToast.show("Password updated successfully!");
                        this.resetForm();

                        // Navigate to the user menu after successful password update
                        this.onRequestedData();
                        this.onUserData();
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error updating user login status.");
                    }
                });

            },
            formatDate: function (oDate) {
                var sYear = oDate.getFullYear();
                var sMonth = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var sDay = ("0" + oDate.getDate()).slice(-2);

                return `${sYear}-${sMonth}-${sDay}`;
            }, resetForm: function () {
                // Reset input fields
                this.byId("idEmppInput").setValue("");
                this.byId("idNameInput").setValue("");
                this.byId("idEmailInput").setValue("");
                this.byId("idPhoneInput").setValue("");
                this.byId("idRoesurcetypeInput").setValue("");

                // Reset select fields
                this.byId("AreaSelect").setSelectedKeys([]);
                this.byId("GroupSelect").setSelectedKeys([]);
                this.byId("_IDGenComboBox10").setSelectedKeys([]);

                // Clear error states
                this.byId("idNameInput").setValueState(sap.ui.core.ValueState.None);
                this.byId("idEmailInput").setValueState(sap.ui.core.ValueState.None);
                this.byId("idPhoneInput").setValueState(sap.ui.core.ValueState.None);
                this.byId("idRoesurcetypeInput").setValueState(sap.ui.core.ValueState.None);
                this.byId("AreaSelect").setValueState(sap.ui.core.ValueState.None);
                this.byId("GroupSelect").setValueState(sap.ui.core.ValueState.None);
                this.byId("_IDGenComboBox10").setValueState(sap.ui.core.ValueState.None);

                // Clear any stored errors
                this._queueSelectError = null;
                this._groupSelectError = null;
            },


            onEmployeeIdLiveChange: function (oEvent) {
                debugger
                var oInput = oEvent.getSource();
                var Empid = oInput.getValue();
                var oModel = this.getOwnerComponent().getModel();  // Assumes you have set the model to your view

                // Check if the Employee ID is exactly 6 characters long
                if (Empid.length !== 6) {
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Employee ID must be exactly 6 characters long.");
                    this.byId("idNameInput").setEditable(true).setValue("");
                    this.byId("idEmailInput").setEditable(true).setValue("");
                    this.byId("idPhoneInput").setEditable(true).setValue("");
                    this.byId("getotpsv").setVisible(true);
                    this.bOtpVerified = false;

                    this.byId("idRoesurcetypeInput").setEditable(true).setValue("");
                    return;  // Exit early if validation fails
                } else {
                    oInput.setValueState(sap.ui.core.ValueState.None);  // Clear any previous value state
                    oInput.setValueStateText("");
                }

                // Create a filter to check if Employee ID exists
                var oFilter = new sap.ui.model.Filter("Resourceid", sap.ui.model.FilterOperator.EQ, Empid);
                var This = this;
                // Read from the OData service
                oModel.read("/RESOURCESSet", {
                    filters: [oFilter],
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            // Check if the Area property has a value
                            if (oData.results[0].Area) {
                                oInput.setValueState(sap.ui.core.ValueState.Error);
                                oInput.setValueStateText("Employee ID is already approved.");
                            } else {
                                // Employee ID exists but is not approved
                                oInput.setValueState(sap.ui.core.ValueState.Success);
                                oInput.setValueStateText("Employee ID already exists.");
                                var email = oData.results[0].Email;
                                var name = oData.results[0].Resourcename;
                                var Phonenumber = oData.results[0].Phonenumber;
                                var RT = oData.results[0].Resourcetype;

                                This.byId("idNameInput").setEditable(false).setValue(name);
                                This.byId("idEmailInput").setEditable(false).setValue(email);
                                This.byId("idPhoneInput").setEditable(false).setValue(Phonenumber);
                                This.byId("idRoesurcetypeInput").setEditable(false).setValue(RT);
                                This.byId("getotpsv").setVisible(false);
                                This.bOtpVerified = true;



                            }
                        } else {
                            // Employee ID does not exist
                            oInput.setValueState(sap.ui.core.ValueState.Success);
                            oInput.setValueStateText("Employee ID is available.");
                        }
                    },
                    error: function (oError) {
                        oInput.setValueState(sap.ui.core.ValueState.None);
                        sap.m.MessageToast.show("Error fetching data.");
                        console.error("Error: ", oError);
                    }
                });
            },
            onSelectProcesAarea: function () {
                // Get the MultiComboBox instance for the Process Area
                var oMultiComboBox = this.byId("idAreaSelect");

                // Retrieve the selected items
                var aSelectedItems = oMultiComboBox.getSelectedItems();

                // Initialize an array to hold the filters
                var aFilters = [];

                // Iterate over the selected items to add corresponding filters
                aSelectedItems.forEach(function (oItem) {
                    var sKey = oItem.getText(); // Get the key (e.g., "Inbound", "Outbound", "Internal")

                    // Add filter for the selected process area
                    aFilters.push(new sap.ui.model.Filter("Processarea", sap.ui.model.FilterOperator.EQ, sKey));
                });

                // Combine the filters with an OR condition
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // This specifies the OR condition
                });

                // Get the Group MultiComboBox and apply the filters
                var oGroupMultiComboBox = this.byId("idGroupSelect");
                // Fetch data from the model with applied filters
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/ProcessAreaSet", {
                    filters: [oCombinedFilter],
                    success: function (oData) {
                        // Process data to remove duplicates
                        var aUniqueItems = [];
                        var oProcessGroups = {};

                        // Iterate over fetched data
                        oData.results.forEach(function (oItem) {
                            var sGroup = oItem.Processgroup;

                            // Add to unique items if not already present
                            if (!oProcessGroups[sGroup]) {
                                oProcessGroups[sGroup] = true;
                                aUniqueItems.push({
                                    key: sGroup,
                                    text: sGroup
                                });
                            }
                        });


                        // Clear existing items in the MultiComboBox
                        oGroupMultiComboBox.removeAllItems();

                        // Add the unique items to the MultiComboBox
                        aUniqueItems.forEach(function (oItem) {
                            oGroupMultiComboBox.addItem(new sap.ui.core.Item({
                                key: oItem.key,
                                text: oItem.text
                            }));
                        });

                        // Make sure the Group MultiComboBox is visible
                        oGroupMultiComboBox.setVisible(true);
                    },
                    error: function (oError) {
                        // Handle error if necessary
                        sap.m.MessageToast.show("Failed to fetch data.");
                    }
                });
            },
            onSelectGroup: function () {
                // Get the MultiComboBox instances for Area and Group
                var oAreaMultiComboBox = this.byId("idAreaSelect");
                var oGroupMultiComboBox = this.byId("idGroupSelect");
                var oQueueMultiComboBox = this.byId("idQueueSelect");

                // Retrieve the selected items
                var aSelectedAreas = oAreaMultiComboBox.getSelectedItems();
                var aSelectedGroups = oGroupMultiComboBox.getSelectedItems();

                // Initialize an array to hold the filters
                var aFilters = [];

                // Iterate over the selected groups to add corresponding filters
                aSelectedGroups.forEach(function (oItem) {
                    var sGroupKey = oItem.getText(); // Get the key (e.g., "Inbound", "Outbound", "Internal")

                    // Add filter for the selected process group
                    aFilters.push(new sap.ui.model.Filter("Processgroup", sap.ui.model.FilterOperator.EQ, sGroupKey));
                });

                // Combine the filters with an OR condition
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // This specifies the OR condition
                });

                // Fetch data from the model with applied filters
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/ProcessAreaSet", {
                    filters: [oCombinedFilter],
                    success: function (oData) {
                        // Process data to remove duplicates and ensure matching with selected areas
                        var aUniqueItems = [];
                        var oQueues = {};
                        var oAreaGroupMap = {};

                        // Iterate over fetched data
                        oData.results.forEach(function (oItem) {
                            var sQueue = oItem.Queue;
                            var sArea = oItem.Processarea;
                            var sGroup = oItem.Processgroup;

                            // Build a map of area-group-queue relations
                            if (!oAreaGroupMap[sArea]) {
                                oAreaGroupMap[sArea] = {};
                            }
                            if (!oAreaGroupMap[sArea][sGroup]) {
                                oAreaGroupMap[sArea][sGroup] = [];
                            }
                            oAreaGroupMap[sArea][sGroup].push(sQueue);

                            // Add to unique items if not already present
                            if (!oQueues[sQueue]) {
                                oQueues[sQueue] = true;
                                aUniqueItems.push({
                                    key: sQueue,
                                    text: sQueue
                                });
                            }
                        });

                        // Validate that the Group selection matches the Area selections
                        var isValid = true;
                        aSelectedAreas.forEach(function (oAreaItem) {
                            var sAreaKey = oAreaItem.getText();
                            var bGroupMatched = aSelectedGroups.some(function (oGroupItem) {
                                var sGroupKey = oGroupItem.getText();
                                return oAreaGroupMap[sAreaKey] && oAreaGroupMap[sAreaKey][sGroupKey];
                            });

                            if (!bGroupMatched) {
                                isValid = false;

                                // Set the value state to Error for Group MultiComboBox
                                oGroupMultiComboBox.setValueState("Error");
                                oGroupMultiComboBox.setValueStateText("Please select at least one group related to the selected areas.");

                                // Show error message
                                sap.m.MessageToast.show("Please select at least one group related to the selected areas.");
                            }
                        });

                        if (!isValid) {
                            oQueueMultiComboBox.removeAllItems(); // Clear Queue items if validation fails
                            return;
                        }

                        // Reset value state to None if validation is successful
                        oGroupMultiComboBox.setValueState("None");

                        // Clear existing items in the Queue MultiComboBox
                        oQueueMultiComboBox.removeAllItems();

                        // Add the unique items to the Queue MultiComboBox
                        aUniqueItems.forEach(function (oItem) {
                            oQueueMultiComboBox.addItem(new sap.ui.core.Item({
                                key: oItem.key,
                                text: oItem.text
                            }));
                        });

                        // Make sure the Queue MultiComboBox is visible
                        oQueueMultiComboBox.setVisible(true);
                    },
                    error: function (oError) {
                        // Handle error if necessary
                        sap.m.MessageToast.show("Failed to fetch data.");
                    }
                });
            },
            onSelectQueue:function(){
                 // Get the MultiComboBox instances for Group and Queue
                 var oGroupMultiComboBox = this.byId("idGroupSelect");
                 var oQueueMultiComboBox = this.byId("idQueueSelect");
 
                 // Retrieve the selected items
                 var aSelectedGroups = oGroupMultiComboBox.getSelectedItems();
                 var aSelectedQueues = oQueueMultiComboBox.getSelectedItems();
 
                 // Initialize an array to hold the filters
                 var aFilters = [];
 
                 // Iterate over the selected queues to add corresponding filters
                 aSelectedQueues.forEach(function (oItem) {
                     var sQueueKey = oItem.getText(); // Get the key (e.g., "Queue1", "Queue2", etc.)
 
                     // Add filter for the selected process queue
                     aFilters.push(new sap.ui.model.Filter("Queue", sap.ui.model.FilterOperator.EQ, sQueueKey));
                 });
 
                 // Combine the filters with an OR condition
                 var oCombinedFilter = new sap.ui.model.Filter({
                     filters: aFilters,
                     and: false // This specifies the OR condition
                 });
 
                 // Fetch data from the model with applied filters
                 var oModel = this.getOwnerComponent().getModel();
                 oModel.read("/ProcessAreaSet", {
                     filters: [oCombinedFilter],
                     success: function (oData) {
                         // Process data to ensure matching with selected groups
                         var oGroupQueueMap = {};
                         var isValid = true;
 
                         // Build a map of group-queue relations
                         oData.results.forEach(function (oItem) {
                             var sGroup = oItem.Processgroup;
                             var sQueue = oItem.Queue;
 
                             if (!oGroupQueueMap[sGroup]) {
                                 oGroupQueueMap[sGroup] = [];
                             }
                             oGroupQueueMap[sGroup].push(sQueue);
                         });
 
                         // Validate that the Queue selection matches the Group selections
                         aSelectedGroups.forEach(function (oGroupItem) {
                             var sGroupKey = oGroupItem.getText();
                             var bQueueMatched = aSelectedQueues.some(function (oQueueItem) {
                                 var sQueueKey = oQueueItem.getText();
                                 return oGroupQueueMap[sGroupKey] && oGroupQueueMap[sGroupKey].includes(sQueueKey);
                             });
 
                             if (!bQueueMatched) {
                                 isValid = false;
 
                                 // Set the value state to Error for Queue MultiComboBox
                                 oQueueMultiComboBox.setValueState("Error");
                                 oQueueMultiComboBox.setValueStateText("Please select at least one queue related to the selected groups.");
 
                                 // Show error message
                                 sap.m.MessageToast.show("Please select at least one queue related to the selected groups.");
                             }
                         });
 
                         if (!isValid) {
                             return;
                         }
 
                         // Reset value state to None if validation is successful
                         oQueueMultiComboBox.setValueState("None");
 
                     },
                     error: function (oError) {
                         // Handle error if necessary
                         sap.m.MessageToast.show("Failed to fetch data.");
                     }
                 });
            },
            OnPressHUQuery: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("HuQuery");

            },
            OnPressStockBinQueryByBin: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("StockBinQueryByBin");

            },
            onGetOTP: function () {
                // Get the phone number from the input field
                var sPhoneNumber = this.byId("idPhoneInput").getValue();
 
 
 
                // Basic validation to ensure the phone number is entered
                if (!sPhoneNumber) {
                    sap.m.MessageToast.show("Please enter a valid phone number.");
                    return;
                }
 
                // Prepare the Twilio API details
                var formattedPhoneNumber = "+91" + sPhoneNumber; // Assuming country code for India
                const accountSid = 'AC21c2f98c918eae4d276ffd6268a75bcf'; // Replace with your Twilio Account SID
                const authToken = '2c166df5d7a8bafe2308d0e2a5bd788c'; // Replace with your Twilio Auth Token
                const serviceSid = 'VA104b5a334e3f175333acbd45c5065910'; // Replace with your Twilio Verify Service SID
                const url = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;
 
                // Prepare the data for the request
                const payload = {
                    To: formattedPhoneNumber,
                    Channel: 'sms'
                };
 
                var This = this;
 
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
                        This.byId("idOtpInputsv").setVisible(true);
 
                        // Store the phone number for later use in OTP verification
                        this._storedPhoneNumber = formattedPhoneNumber;
 
                        // Open the OTP dialog
 
                    }.bind(this),
                    error: function (xhr, status, error) {
                        console.error('Error sending OTP:', error);
                        sap.m.MessageToast.show('Failed to send OTP: ' + error);
                    }
                });
            },

            onSubmitOtp: function () {
                var oMobileinput = this.byId("idPhoneInput")
                var oOtpInput = this.byId("idOtpInputsv");
                var oVerfied = this.byId("verficationIdicon");
                var oGetotp = this.byId("onGetOTP");
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
                const accountSid = 'AC21c2f98c918eae4d276ffd6268a75bcf'; // Replace with your Twilio Account SID
                const authToken = '2c166df5d7a8bafe2308d0e2a5bd788c'; // Replace with your Twilio Auth Token
                const serviceSid = 'VA104b5a334e3f175333acbd45c5065910'; // Replace with your Twilio Verify Service SID
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
                            
                            this.bOtpVerified = true;

 
 
 
                            // Reset the ValueState to None upon successful verification
 
                            oOtpInput.setValueStateText("OTP verified successfully");
                            
 
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
            onPutawayByHU: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RoutePutawayByHU");
            },

        });
    }
);
