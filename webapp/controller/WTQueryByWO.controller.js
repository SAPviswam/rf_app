sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function (BaseController, UIComponent) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.WTQueryByWO", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
                // const oTable = this.getView().byId("idWtQBWoWhTable");
                // oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },
            onWtQBWofirstBackBtnPress: async function () {
                var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {

                    success: function (oData) {

                        let oUser = oData.Users.toLowerCase()

                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID });
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID });
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },
            // onWtQBWoWhLiveChange: function () {
            //     this.getView().byId("idWtQBWoFirstSC").setVisible(false);
            //     this.getView().byId("idWtQBWoWhSecondsc").setVisible(true);
            //     var oWHO = this.getView().byId("idWtQBWoWhInput").getValue();
            //     this.getView().byId("idWtQBWoWh2Input").setValue(oWHO);
            //     this.getView().byId("idWtQBWoWh2Input").setEditable(false);
            // },

            onWtQBWoSecondBackBtnPress: function () {
                this.getView().byId("idWtQBWoFirstSC").setVisible(true);
                this.getView().byId("idWtQBWoWhSecondsc").setVisible(false);
                this.getView().byId("idWtQBWofirstbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoSecondbackbtn").setVisible(false);
            },
            onBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                this.getView().byId("idWtQBWoWhSecondsc").setVisible(false);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoSecondbackbtn").setVisible(false);
            },

            onWtQBWoThirdBackBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
                this.getView().byId("idWtQBWoWhSecondsc").setVisible(true);
                this.getView().byId("idWtQBWoSecondbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);

            },
            onWtQBWoDetailBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
                this.getView().byId("idWtQBWoWhFourthsc").setVisible(true);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
                this.getView().byId("idWtQBWoFourthbackbtn").setVisible(true);

            },
            onWtQBWoFourthBackBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                this.getView().byId("idWtQBWoWhFourthsc").setVisible(false);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoFourthbackbtn").setVisible(false);

            },
            onWtQBWoOpenBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
                this.getView().byId("idWtQBWoWhFifthsc").setVisible(true);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
                this.getView().byId("idWtQBWoFifthbackbtn").setVisible(true);
            },
            onWtQBWoFifthBackBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                this.getView().byId("idWtQBWoWhFifthsc").setVisible(false);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoFifthbackbtn").setVisible(false)
            },
            onWtQBWoConfBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
                this.getView().byId("idWtQBWoWhSixthsc").setVisible(true);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
                this.getView().byId("idWtQBWoSixththbackbtn").setVisible(true);
            },
            onWtQBWoSixthBackBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                this.getView().byId("idWtQBWoWhSixthsc").setVisible(false);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoSixththbackbtn").setVisible(false)
            },
            onSelectionChange: function (oEvent) {

                var oTable = this.getView().byId("idWtQBWoWhTable");
                var oSelectedItem = oTable.getSelectedItem();

                if (oSelectedItem) {
                    this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                    this.getView().byId("idWtQBWoWhSecondsc").setVisible(false);
                    this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                    this.getView().byId("idWtQBWoSecondbackbtn").setVisible(false);
                }
            },
            onWtQBWoAllBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
                this.getView().byId("idWtQBWoWhSeventhsc").setVisible(true);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
                this.getView().byId("idWtQBWoSevenththbackbtn").setVisible(true);
            },

            onWtQBWoSeventhBackBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                this.getView().byId("idWtQBWoWhSeventhsc").setVisible(false);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoSevenththbackbtn").setVisible(false);
            },
            onWtQBWoWhLiveChange: function () {
                // Get the input value from the input field
                var oView = this.getView();
                var sWarehouseorder = oView.byId("idWtQBWoWhInput").getValue();

                sWarehouseorder = sWarehouseorder.toUpperCase();
                this.sWarehouseorder = sWarehouseorder;

                // Check if bin number is provided
                if (!sWarehouseorder) {
                    sap.m.MessageToast.show("Please enter a bin number.");
                    return;
                }

                // Call your backend service to fetch products for this bin
                var oModel = this.getView().getModel(); // Assuming you have a model set up
                var that = this;

                oModel.read(`/WarehouseOrderSet('${sWarehouseorder}')`, {
                    urlParameters: {
                        "$expand": "WarehouseOrdertoTask",
                        "$format": "json"
                    },

                    success: function (odata) {
                        console.log(odata)
                        if (odata.Who === sWarehouseorder) {
                            that.getView().byId("idWtQBWoWh2Input").setValue(sWarehouseorder);

                            // Get the product details from the response
                            let oDetails = odata.WarehouseOrdertoTask.results;

                            // Prepare an array for binding
                            var aWarehouseOrderDetails = [];

                            // Loop through the results and push them into the array
                            for (var i = 0; i < oDetails.length; i++) {

                                // Determine status text based on Tostat value
                                let statusText;
                                switch (oDetails[i].Tostat) {
                                    case 'C':
                                        statusText = 'Confirmed';
                                        break;
                                    case 'A':
                                        statusText = 'Canceled';
                                        break;
                                    case 'B':
                                        statusText = 'Locked';
                                        break;
                                    case 'D':
                                        statusText = 'In process';
                                        break;
                                    case '':
                                        statusText = 'Open';
                                        break;
                                    default:
                                        statusText = oDetails[i].Tostat; // Keep original if not C or A
                                }

                                aWarehouseOrderDetails.push({
                                    Tanum: oDetails[i].Tanum,
                                    Tostat: statusText,
                                    ConfBy: oDetails[i].ConfBy
                                });
                            }
                            // Create a JSON model with the product details array
                            var oWarehouse = new sap.ui.model.json.JSONModel({ Warehouseorder: aWarehouseOrderDetails });

                            // Set the model to the table
                            that.byId("idWtQBWoWhTable").setModel(oWarehouse);

                            // Bind the items aggregation of the table to the products array in the model
                            that.byId("idWtQBWoWhTable").bindItems({
                                path: "/Warehouseorder",
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{Tanum}" }),   // Quantity
                                        new sap.m.Text({ text: "{Tostat}" }),
                                        new sap.m.Text({ text: "{ConfBy}" }) // UOM
                                    ],
                                    type: "Navigation",
                                    press: [that.onSelectWarehouseTask, that]
                                })
                            });
                            that.getView().byId("idWtQBWoFirstSC").setVisible(false);
                            that.getView().byId("idWtQBWoWhSecondsc").setVisible(true);
                            that.getView().byId("idWtQBWofirstbackbtn").setVisible(false);
                            that.getView().byId("idWtQBWoSecondbackbtn").setVisible(true);
                            oView.byId("idWtQBWoWhInput").setValue("");
                        } 
                        // else {
                        //     // If no matching bin number found, show a message
                        //     sap.m.MessageToast.show("No Warehousetasks found for the Warehouseorder.");
                        // }
                    },
                    error: function () {
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });
            },

        });
    }
);

