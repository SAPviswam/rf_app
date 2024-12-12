sap.ui.define(
    [
        "./BaseController",
        "sap/ui/Device", // Base controller for UI5 controllers
        "sap/ui/core/UIComponent", // To access routing functionalities
        "sap/m/MessageToast"
    ],
    function (BaseController, Device, UIComponent, MessageToast) {
        "use strict";

       
        return BaseController.extend("com.app.rfapp.controller.WTQueryByWT", {
            // Controller initialization, called when the controller is instantiated
            onInit: function () {
                if (Device.system.phone) {
                    this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setWidth("150%");
                    this.getView().byId("idWtQBWtSF2_WTQueryByWT").setWidth("150%");
                    this.getView().byId("idWtQBWtWhThirdsc_WTQueryByWT").setWidth("140%");
                    this.getView().byId("idWtQBWtSF3_WTQueryByWT").setWidth("140%");
                    this.getView().byId("idTitle_WTQueryByWT").addStyleClass("titleMobile");
                }
                const oRouter = this.getOwnerComponent().getRouter(); // Get the router from the owner component
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this); // Attach route match event to handler
            },

            // Event handler for loading resource details when route pattern is matched
            onResourceDetailsLoad: async function (oEvent1) {
                const { id,idI } = oEvent1.getParameter("arguments"); // Extract the 'id' parameter from the route's arguments
                this.ID = id; // Store the 'id' for use in other methods
                this.IDI=idI;
                this.applyStoredProfileImage();
            },
            onAvatarPressed: function (oEvent) {     
                this.onPressAvatarEveryTileHelperFunction(oEvent); 
    
                },
                onSignoutPressed:function(){
                    var oRouter = this.getOwnerComponent().getRouter(this);
                    oRouter.navTo("InitialScreen",{Userid:this.IDI}); 
                },

            // Event handler for the first back button (navigation based on user type)
            onPressFirstBackButton: async function () {
                var oRouter = UIComponent.getRouterFor(this); // Get the router for the current controller
                var oModel1 = this.getOwnerComponent().getModel(); // Get the model from the owner component
                var that=this
                // Read data from the RESOURCESSet entity for the given ID
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser = oData.Users.toLowerCase(); // Get the user type (resource or supervisor)

                        // Navigate to different routes based on the user type
                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID ,idI:that.IDI}); // Route to Resource page
                        } else {
                            oRouter.navTo("Supervisor", { id: this.ID,idI:that.IDI }); // Route to Supervisor page
                        }
                    }.bind(this), // Bind the success handler to the controller context

                    error: function () {
                        MessageToast.show("User does not exist"); // Show error message if the user does not exist
                    }
                });
            },

            // Event handler for live change in the Warehouse Task (WT) input field (validates HU value)
            onWtQBWtWhLiveChange: function (oEvent) {
                if (oEvent === this.getView().byId("idWtQBWtWhInput_WTQueryByWT").getValue()) {
                    var oHuValue = oEvent
                }
                else {
                    var oInput = oEvent.getSource(); // Get the input field that triggered the event
                    var oHuValue = oInput.getValue().trim(); // Get the HU value from the input and trim any whitespace
                }
                if (oHuValue) { // Proceed if the HU value is not empty
                    var oModel = this.getOwnerComponent().getModel(); // Get the OData model for making requests
                    var that = this; // Preserve the controller context for the success handler

                    // Call OData service to validate if the HU exists in the system
                    setTimeout(function () {
                        oModel.read(`/WarehouseTaskNewSet('${oHuValue}')`, {
                            success: function (odata) {
                                if (odata.Tanum === oHuValue) {

                                    MessageToast.show("Succesfully Scanned");
                                    // If HU exists, toggle screens and populate input fields with the retrieved data
                                    that.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(false); // Hide the first screen
                                    that.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(true); // Show the second screen

                                    // Populate the fields with the data returned from the OData service
                                    that.getView().byId("idWtQBWtwtInput_WTQueryByWT").setValue(odata.Tanum);
                                    that.getView().byId("idWtQBWtWTitInput_WTQueryByWT").setValue(odata.Tapos);
                                    that.getView().byId("idWtQBWtwtsInput_WTQueryByWT").setValue(odata.Numwt);
                                    let smallToast=odata.Tostat.toLowerCase();
                                    let oStatus=smallToast===""?"Open":(smallToast==="a"?"Canceled":(smallToast==="b"?"Waiting":"Confirmed"))
                                    that.getView().byId("idWtQBWtStsInput_WTQueryByWT").setValue(oStatus);
                                    that.getView().byId("idWtQBWtPtypInput_WTQueryByWT").setValue(odata.Procty);
                                    that.getView().byId("idWtQBWtSproInput_WTQueryByWT").setValue(odata.Prces);
                                    that.getView().byId("idWtQBWtActyInput_WTQueryByWT").setValue(odata.ActType);
                                    that.getView().byId("idWtQBWtProInput_WTQueryByWT").setValue(odata.Matnr);
                                    that.getView().byId("idWtQBWtProEmpInput_WTQueryByWT").setValue(odata.HazmatInd);
                                    that.getView().byId("idWtQBWtSbinInput_WTQueryByWT").setValue(odata.Vlpla);
                                    that.getView().byId("idWtQBWtSbinEmpInput_WTQueryByWT").setValue(odata.Vlenr);
                                    that.getView().byId("idWtQBWtDbinInput_WTQueryByWT").setValue(odata.Nlpla);
                                    that.getView().byId("idWtQBWtDbinEmpInput_WTQueryByWT").setValue(odata.Nlenr);

                                    // Format and set the ConfD date
                                    let dateStr = odata.ConfD;
                                    let year = dateStr.slice(0, 4);
                                    let month = dateStr.slice(4, 6);
                                    let day = dateStr.slice(6, 8);
                                    let formattedDate = `${year}-${month}-${day}`;
                                    that.getView().byId("idWtQBWtCdatInput_WTQueryByWT").setValue(formattedDate);

                                    // Calculate and format the ConfT time (from milliseconds)
                                    let milliseconds = odata.ConfT.ms;
                                    let hours = Math.floor(milliseconds / (1000 * 60 * 60));
                                    let minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
                                    let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
                                    let timeFormatted = `${hours}:${minutes}:${seconds}`;
                                    that.getView().byId("idWtQBWtCdatnput_WTQueryByWT").setValue(timeFormatted);

                                    // Set the ConfBy user
                                    that.getView().byId("idWtQBWtCusrInput_WTQueryByWT").setValue(odata.ConfBy);
                                }
                                else {
                                     MessageToast.show("Please Enter correct Warehouse task Number");
                                    that.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(true);
                                    that.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false);
                                }
                            },
                            error: function (oError) {
                                // Handle error if HU not found
                                MessageToast.show("Please Enter correct Warehouse task Number")
                            }

                        });
                    }.bind(this), 2000);
                }

                // Toggle visibility of screens (no action if HU is empty)
                // this.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(false);
                // this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(true);
            },
            // onWtQBWtWhLiveChange: function (oEvent) {
            //     // Get the value from the input
            //     var oHuValue = oEvent.getSource().getValue().trim();
            
            //     if (oHuValue) { // Proceed if the HU value is not empty
            //         var oModel = this.getOwnerComponent().getModel(); // Get the OData model
            //         var that = this; // Preserve the controller context for the success handler
            
            //         // Clear previous timeout, if any
            //         if (this.inputTimeout) {
            //             clearTimeout(this.inputTimeout);
            //         }
            
            //         // Set a new timeout to trigger after 2 seconds of inactivity
            //         this.inputTimeout = setTimeout(function () {
            //             // Show the message toast after 2 seconds of inactivity
            //             // MessageToast.show("Naveen");
            
            //             // Make the OData call to validate if the HU exists in the system
            //             oModel.read(`/WarehouseTaskNewSet('${oHuValue}')`, {
            //                 success: function (odata) {
            //                     if (odata.Tanum === oHuValue) {
            //                         MessageToast.show("Succesfully Scanned");
            //                         // If HU exists, toggle screens and populate input fields with the retrieved data
            //                         that.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(false); // Hide first screen
            //                         that.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(true); // Show second screen
            
            //                         // Populate fields with data from OData response
            //                         that.getView().byId("idWtQBWtwtInput_WTQueryByWT").setValue(odata.Tanum);
            //                         that.getView().byId("idWtQBWtWTitInput_WTQueryByWT").setValue(odata.Tapos);
            //                         that.getView().byId("idWtQBWtwtsInput_WTQueryByWT").setValue(odata.Numwt);
            //                         that.getView().byId("idWtQBWtStsInput_WTQueryByWT").setValue(odata.Tostat);
            //                         that.getView().byId("idWtQBWtPtypInput_WTQueryByWT").setValue(odata.Procty);
            //                         that.getView().byId("idWtQBWtSproInput_WTQueryByWT").setValue(odata.Prces);
            //                         that.getView().byId("idWtQBWtActyInput_WTQueryByWT").setValue(odata.ActType);
            //                         that.getView().byId("idWtQBWtProInput_WTQueryByWT").setValue(odata.Matnr);
            //                         that.getView().byId("idWtQBWtProEmpInput_WTQueryByWT").setValue(odata.HazmatInd);
            //                         that.getView().byId("idWtQBWtSbinInput_WTQueryByWT").setValue(odata.Vlpla);
            //                         that.getView().byId("idWtQBWtSbinEmpInput_WTQueryByWT").setValue(odata.Vlenr);
            //                         that.getView().byId("idWtQBWtDbinInput_WTQueryByWT").setValue(odata.Nlpla);
            //                         that.getView().byId("idWtQBWtDbinEmpInput_WTQueryByWT").setValue(odata.Nlenr);
            
            //                         // Format and set ConfD date
            //                         let dateStr = odata.ConfD;
            //                         let year = dateStr.slice(0, 4);
            //                         let month = dateStr.slice(4, 6);
            //                         let day = dateStr.slice(6, 8);
            //                         let formattedDate = `${year}-${month}-${day}`;
            //                         that.getView().byId("idWtQBWtCdatInput_WTQueryByWT").setValue(formattedDate);
            
            //                         // Calculate and format ConfT time from milliseconds
            //                         let milliseconds = odata.ConfT.ms;
            //                         let hours = Math.floor(milliseconds / (1000 * 60 * 60));
            //                         let minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
            //                         let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
            //                         let timeFormatted = `${hours}:${minutes}:${seconds}`;
            //                         that.getView().byId("idWtQBWtCdatnput_WTQueryByWT").setValue(timeFormatted);
            
            //                         // Set ConfBy user
            //                         that.getView().byId("idWtQBWtCusrInput_WTQueryByWT").setValue(odata.ConfBy);
            //                     } else {
            //                         // Show message if the HU is incorrect
            //                         MessageToast.show("Please Enter correct Warehouse task Number");
            //                         that.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(true);
            //                         that.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false);
            //                     }
            //                 },
            //                 error: function (oError) {
            //                     // Handle error if HU not found
            //                     MessageToast.show("Please Enter correct Warehouse task Number");
            //                 }
            //             });
            //         }, 2000); // Trigger after 2 seconds of inactivity
            //     } else {
            //         // Hide second screen if input is empty
            //         this.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(true);
            //         this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false);
            //     }
            // },            

            // Event handler for the second back button (returns to the first screen)
            onPressSecondBackButton: function () {
                this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false); // Hide second screen
                this.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(true); // Show first screen
                this.clear();
            },

            // Event handler for the button to view more details of the warehouse task
            onWtQBWtDetailBtnPress: function () {
                var oHuValue = this.getView().byId("idWtQBWtwtInput_WTQueryByWT").getValue(); // Get HU value from input
                debugger
                if (oHuValue) { // Proceed if HU value is available
                    var oModel = this.getOwnerComponent().getModel(); // Get the OData model
                    var that = this; // Preserve controller context for success handler

                    // Call OData service to validate and retrieve data for the given HU
                    oModel.read(`/WarehouseTaskNewSet('${oHuValue}')`, {
                        success: function (odata) {
                            debugger
                            // If HU exists, toggle screens and populate fields with data
                            that.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false); // Hide second screen
                            that.getView().byId("idWtQBWtWhThirdsc_WTQueryByWT").setVisible(true); // Show third screen

                            // Populate the fields with detailed information from the OData response
                            that.getView().byId("idWtQBWtProductDiscriptioInput_WTQueryByWT").setValue(odata.Maktx);
                            that.getView().byId("idWtQBWtwoInput_WTQueryByWT").setValue(odata.Who);
                            that.getView().byId("idWtQBWtOwnerInput_WTQueryByWT").setValue(odata.Owner);
                            that.getView().byId("idWtQBWtPEntInput_WTQueryByWT").setValue(odata.Entitled);
                            that.getView().byId("idWtQBWtHTypeInput_WTQueryByWT").setValue(odata.Letyp);
                            that.getView().byId("idWtQBWtWhHuInput_WTQueryByWT").setValue(odata.Vlenr);
                            that.getView().byId("idWtQBWtEstpInput_WTQueryByWT").setValue(odata.Procs);
                            that.getView().byId("idWtQBWtSqtyInput_WTQueryByWT").setValue(odata.Vsola);
                            that.getView().byId("idWtQBWtPcInput_WTQueryByWT").setValue(odata.Altme);
                            that.getView().byId("idWtQBWtHuWtInput_WTQueryByWT").setValue(odata.Flghuto);
                            that.getView().byId("idWtQBWtBtchInput_WTQueryByWT").setValue(odata.Charg);
                        },
                        error: function (oError) {
                            // Handle error if HU not found
                        }
                    });
                }

                // Toggle visibility for screen navigation
                this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false);
                this.getView().byId("idWtQBWtWhThirdsc_WTQueryByWT").setVisible(true);
            },

            // Event handler for the third back button (returns to the second screen)
            onPressThirdBackButton: function () {
                this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(true); // Show second screen
                this.getView().byId("idWtQBWtWhThirdsc_WTQueryByWT").setVisible(false); // Hide third screen
            },

            // Handle successful scan events
            onScanSuccess: function (oEvent) {
                var sScannedProduct = oEvent.getParameter("text"); // Get the scanned product value
                this.getView().byId("idWtQBWtWhInput_WTQueryByWT").setValue(sScannedProduct); // Set the value in the input
                this.onWtQBWtWhLiveChange(sScannedProduct);
            },
            clear: function () {
                this.getView().byId("idWtQBWtWhInput_WTQueryByWT").setValue();
            },
        });
    }
);
