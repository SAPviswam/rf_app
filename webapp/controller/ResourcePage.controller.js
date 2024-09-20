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
    function (Controller, Device, JSONModel, Popover, Button, library, MessageToast,UIComponent,Fragment) {

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


                debugger;
                var that = this;
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
                console.log(this.ID);

                var oModel = this.getView().getModel();
                var oModel1 = this.getOwnerComponent().getModel();

                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        var area = oData.Area;
                        var areaArray = area.split(",").map(item => item.trim()); // Split and trim each area
                        var ogroup = oData.Resourcegroup;
                        var groupArray = ogroup.split(",").map(item => item.trim()); // Split and trim each group

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
                            that.getView().byId(`id_${lOQueue}`).setVisible(true)
                        })

                        var aNavigationData = oModel.getProperty("/navigation");

                        // Loop through navigation data
                        aNavigationData.forEach(function (oProcess) {
                            var processVisible = false; // Flag to track visibility for each process

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
            onManuallyRepackHUPress : function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ManuallyRepackHU",{id:this.ID});
            
            },
            onManuallyRepackHUItemPress : function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ManuallyRepackAllHUItems",{id:this.ID});
            },

            onWTQuerybyWOPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("WTQueryByWO", { id: this.ID });
            },

            onReceivingofHUbyDeliveryPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RecevingOfHUbyDelivery",{id:this.ID});
            },
            onReceivingofHUbymanufacturingOrderPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RecevingOfHUbyManufacturingOrder",{id:this.ID});
            },
            onRecevingofTUDoorTWPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RecevingOfHUbyTUorDoor",{id:this.ID});
            },
            onReceivingofHUbyASNPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ReceivingofHUbyASN",{id:this.ID});
            },
            onReceivingofHUbyShipmentPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ReceivingofHUbyShipment",{id:this.ID});
            },
            onReceivingofHUbyTUPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ReceivingofHUbyTU",{id:this.ID});
            },

            onUnloadingByDoorTilePress: function () {
                // BusyIndicator.show(3);
                // setTimeout(function () {
                //     // Navigate to another page (user page)
                //     var oRouter = this.getOwnerComponent().getRouter();
                //     oRouter.navTo("UnloadingByDoor");
                //     BusyIndicator.hide();
                //   }.bind(this), 2000); 
                var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("UnloadingByDoor",{id:this.ID});

            },
            onUnloadingByConsignmentOrderTilePress: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("UnloadingByConsignmentOrder",{id:this.ID});

            },
            onChangeQueueTilePress: function () {
                debugger
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("ChangeQueue",{id:this.ID});

            },
            onChangeResourceGroupTilePress:function(){
                const oRoute =this.getOwnerComponent().getRouter()
                oRoute.navTo("ChangeResourceGroup",{id:this.ID})
            },
            onUnloadingbyBillofLadingPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("UnloadingByBillofLading",{id:this.ID});
            },
            onDeconsolidationAutomaticallyPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("DeconsolidationAutomatically",{id:this.ID});
            },
            onDeconsolidateManuallyPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("DeconsolidationManually",{id:this.ID});
            },
            onAdhocInventoryCreationPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("AdhocInventoryCreation",{id:this.ID});
            },
            onCreationOfSingleHUpress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("CreationOfSingleHU",{id:this.ID});
            },
            onMaintainHUPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("MaintainHU",{id:this.ID});
            },
            onUnloadingByShipmentPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("UnloadingByShipment",{id:this.ID});
            },
            onUnloadingByTransportUnitPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("UnloadingByTU",{id:this.ID});
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
            onSBQPAvatarPressed: function(oEvent) {
                
              
                
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
            
            onRecevinngofHUbyBillofLadingPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteBillofLading",{id:this.ID});
            },
            onCreateShippingHUPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("CreateShippingHU",{id:this.ID});
            },
            onCreateShippingHUWOWCPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("CreateShippingHUWOWC",{id:this.ID});
            },


            //Putaway By WO Tile..
            onPutawayByWOPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("PutawayByWO", { id: this.ID });
            },
            //AvailableHandlingunitsOnBinQuery Tile...
            onAvailableHandlingunitsonbinqueryPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("AvailableHandlingUnitsOnBinQuery", { id: this.ID });
            },
            //WTQueryByHU Tile...
            onWTquerybyHUPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("WTQueryByHU", { id: this.ID });
            },


            onWTQueryByWTPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("WTQueryByWT",{id:this.ID});
            },
            onCreateandConfirmAdhocHUWTPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("CreateConfirmAdhocHu",{id:this.ID});
            },
            onCreateandConfirmAdhocProductWTPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("CreateConfirmAdhocProduct",{id:this.ID});
            },
            onSerialnumberLocationPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("SerialNumberLocation",{id:this.ID});
            },
            onStockBinQuerybyProductPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("StockBinQueryByProduct",{id:this.ID});
            },
            onCreateAdhocHUWTPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("AdhocHuWt",{id:this.ID});
            },
            onCreateAdhocProductWTPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("AdhocProductWt",{id:this.ID});
            },
            onReceivingofHUbyDoorPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ReceivingOfHuByDoor",{id:this.ID});
            },
            onStockBinQuerybyBinPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("StockBinQueryByBin",{id:this.ID});
            },
            onHUQueryPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("HuQuery",{id:this.ID});
            },

            onUnloadingByDeliveryPress:function(){ 
                debugger
                var oRouter = UIComponent.getRouterFor(this); 
                oRouter.navTo("UnloadByDelivery",{id:this.ID});                 
            }, 
          
            onWTQuerybyQueuePress:function(){ 
                debugger
                var oRouter = UIComponent.getRouterFor(this); 
                oRouter.navTo("WTQueryByQueue",{id:this.ID});                 
            }, 

            onManuallyrepackallHUitemsPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ManuallyRepackAllHUItems",{id:this.ID});
            },

            onCreatePutawayHusforDeconsolidationPress: function(){
                debugger
                var oRouter = UIComponent.getRouterFor(this); 
                oRouter.navTo("CreatePutawayHusforDeconsolidate",{id:this.ID});        
            },
            onCreatePutawayHusManuallyPress: function() {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("CreatePutawayHusManually",{id:this.ID});

            },

        });
    });