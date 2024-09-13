sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/MessageToast",
     "sap/ui/core/UIComponent"
],
    function (Controller, Device, JSONModel, Popover, Button, library, MessageToast,UIComponent) {
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
                        var group = oData.Resourcegroup;
                        var groupArray = group.split(",").map(item => item.trim()); // Split and trim each group
                        var oresourceType = oData.Queue;
                        var oResourceArray = oresourceType.split(",").map(item => item.trim())
                        console.log(oResourceArray)
                        oResourceArray.forEach(function(queue){
        
                            let oQueue = queue.replace(/[^a-zA-Z0-9]/g,'');
                            that.getView().byId(`id_${oQueue}`).setVisible(true)
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
            onPutawayByHUPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RoutePutawayByHU");
            },



            OnPressHUQuery: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("HuQuery");
                var oInput = this.byId("_IDGenInput1");
                if (oInput) {
                    oInput.focus();
                }
            },
            OnPressStockBinQueryByBin: function () {
                debugger
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("StockBinQueryByBin");

            },
           onReceivingofHUbyASN: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ReceivingofHUbyASN");

            },

            /**Navigate to Unloading By ASN Page */
            onUnloadingBYASN: function () {
                this.getOwnerComponent().getRouter().navTo("RouteUnloadingASNDetails")

            },
 
            onReceivingofHUbyDoor: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ReceivingOfHuByDoor");
            },
            onPutawayByHU: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RoutePutawayByHU");
            },
            onReceivingofHUbyDelivery: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RecevingOfHUbyDelivery");
            },

            //Putaway By WO Tile..
            onTilePressPutawayByWO: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("PutawayByWO");
            },

            //AvailableHandlingunitsOnBinQuery Tile...
            OnPressAvailableHandlingUnitsOnBinQuery: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("AvailableHandlingUnitsOnBinQuery");
            },
            //WTQueryByHU Tile...
            OnPressWTquerybyHU: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("WTQueryByHU");
            },

            onReceivingofHUbyBillofLading: function () {
                var oRouter = UIComponent.getRouterFor(this);
                //  this.getOwnerComponent().getRouter().navTo("RouteBilloflading");
                oRouter.navTo("RouteBillofLading");
            },
            onUnloadingByDoorTilePress: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("UnloadingByDoor");

            },
            onUnloadingByConsignmentOrderTilePress: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("UnloadingByConsignmentOrder");

            },
            onUnloadingByBillofLadingPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("UnloadingByBillofLading");
 
            },
            onUnloadingByShipmentPress:function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("UnloadingByShipment");
 
            },
            onUnloadingByTUPress:function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("UnloadingByTU");
 
            },
            onPressCreateAdhocHUWTInAdhocWT: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("AdhocHuWt");
 
            },
            onPressCreateAdhocProductWTInAdhocWT: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("AdhocProductWt");
 
            },
            OnPressUnloadByDelivery: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("UnloadByDelivery");
 
            },
            OnPressCreateandConfirmAdhocHUWT:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("CreateConfirmAdhocHu");

            },
            onReceivingofHUbyConsignementOrder:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("Receivingofhubyco");

            },

            onReceivingofHUbyManufacturingOrder:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RecevingOfHUbyManufacturingOrder");

            },

            onCreateandConfirmAdhocProductWTPress:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("CreateConfirmAdhocProduct", { id: this.ID });

            },
            OnPressStockOrBinQuerybyProduct:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("StockBinQueryByProduct");
            },

            onReceivingofTUorDoor: function() {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RecevingOfHUbyTUorDoor");
            },


            onReceivingofHUbyShipment:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ReceivingofHUbyShipment");
            },
            OnPressWTQuerybyWO:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("WTQueryByWO");
            },

            OnPressSerialnumberLocation:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("SerialNumberLocation");
        },

            OnPressWTQuerybyWT:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("WTQueryByWT");

            },
            
            onReceivingofHUbyTU:function(){
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("ReceivingofHUbyTU");
            },


        });
    });


