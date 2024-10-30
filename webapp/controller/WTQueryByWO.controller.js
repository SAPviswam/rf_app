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
            onWtQBWoFourthBackBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                this.getView().byId("idWtQBWoWhFourthsc").setVisible(false);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoFourthbackbtn").setVisible(false);

            },
            onWtQBWoFifthBackBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                this.getView().byId("idWtQBWoWhFifthsc").setVisible(false);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoFifthbackbtn").setVisible(false)
            },
            onWtQBWoSixthBackBtnPress: function () {
                this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
                this.getView().byId("idWtQBWoWhSixthsc").setVisible(false);
                this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBWoSixththbackbtn").setVisible(false)
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
                    sap.m.MessageToast.show("Please enter a WarehouseOrder");
                    return;
                }
                this.onFetchWHTaskDetails(sWarehouseorder);
            },
            onFetchWHTaskDetails: function (sWarehouseorder) {
                // Call your backend service to fetch products for this bin
                var oModel = this.getView().getModel(); // Assuming you have a model set up
                var that = this;

                oModel.read(`/WarehouseOrderSet('${sWarehouseorder}')`, {
                    urlParameters: {
                        "$expand": "WarehouseOrdertoTask",
                        "$format": "json"
                    },

                    success: function (odata) {
                        if (odata.Who === sWarehouseorder) {
                            that.getView().byId("idWtQBWoWh2Input").setValue(sWarehouseorder);

                            // Get the product details from the response
                            let oDetails = odata.WarehouseOrdertoTask.results;

                            // Prepare an array for binding
                            var aWarehouseOrderDetails = [];

                            // Loop through the results and push them into the array
                            for (var i = 0; i < oDetails.length; i++) {

                      //  let statusText = that.getStatusText(oDetails[i].Status);

                                aWarehouseOrderDetails.push({
                                    Tanum: oDetails[i].Tanum,
                                    Tostat: that.getStatusText(odata.Status),
                                    ConfBy: odata.CreatedBy
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
                            that.getView().byId("idWtQBWoWhInput").setValue("");
                        }
                    },
                    error: function () {
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });
            },
            onSelectWarehouseTask: function (oEvent) {
                var oView = this.getView();
                var oModel = this.getView().getModel(); // Assuming you have a model set up
                var that = this;
                oModel.read(`/WarehouseOrderSet('${this.sWarehouseorder}')`, {
                    urlParameters: {
                        "$expand": "WarehouseOrdertoTask",
                        "$format": "json"
                    },

                    success: function (odata) {
                        console.log(odata)

                        var aWarehousetask = odata.WarehouseOrdertoTask.results;

                        var sSelectedWT = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Tanum");

                        var oSelectedWT = aWarehousetask.find(function (WarehouseTask) {

                            return WarehouseTask.Tanum === sSelectedWT;
                        });
                        if (oSelectedWT) {
                            oView.byId("idWtQBWowtInput").setValue(oSelectedWT.Tanum);
                            oView.byId("idWtQBWoWTitInput").setValue(oSelectedWT.Tapos);
                            oView.byId("idWtQBWowtsInput").setValue(odata.Numwt);
                            oView.byId("idWtQBWoStsInput").setValue(oSelectedWT.Tostat);
                            oView.byId("idWtQBWoStypInput").setValue(oSelectedWT.Trart);
                            oView.byId("idWtQBWoPtypInput").setValue(oSelectedWT.Procty);  // Selected material number
                            oView.byId("idWtQBWoSproInput").setValue(oSelectedWT.Prces);  // Selected material quantity
                            oView.byId("idWtQBWoActyInput").setValue(oSelectedWT.ActType);
                            oView.byId("idWtQBWoActyEmpInput").setValue(oSelectedWT.Idplate);
                            oView.byId("idWtQBWoProInput").setValue(oSelectedWT.Matnr);
                            oView.byId("idWtQBWoProEmpInput").setValue(oSelectedWT.HazmatInd);
                            oView.byId("idWtQBWoSbinInput").setValue(oSelectedWT.Vlpla);
                            oView.byId("idWtQBWoSbinEmpInput").setValue(oSelectedWT.Vlenr);
                            oView.byId("idWtQBWoDbinInput").setValue(oSelectedWT.Nlpla);
                            oView.byId("idWtQBWoDbinEmpInput").setValue(oSelectedWT.Nlenr);
                            oView.byId("idWtQBWoCdatInput").setValue(oSelectedWT.ConfD);
                            oView.byId("idWtQBWoCusrInput").setValue(oSelectedWT.ConfBy);

                            function convertMillisecondsToTime(milliseconds) {
                                // Calculate total seconds
                                let totalSeconds = Math.floor(milliseconds / 1000);

                                // Calculate hours, minutes, and seconds
                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                const seconds = totalSeconds % 60;

                                // Format as HH:MM:SS
                                return (
                                    String(hours).padStart(2, '0') + ':' +
                                    String(minutes).padStart(2, '0') + ':' +
                                    String(seconds).padStart(2, '0')
                                );
                            }
                            that.oSelectedWT = sSelectedWT;
                            const milliseconds = oSelectedWT.ConfT.ms;
                            oView.byId("idWtQBWoCdatnput").setValue(convertMillisecondsToTime(milliseconds));
                            oView.byId("idWtQBWoWTitAllInput").setValue(that.getStatusText(oSelectedWT.Tostat));
                        } else {
                            sap.m.MessageToast.show("WarehouseTask not found.");
                        }
                        oView.byId("idWtQBWoWhThirdsc").setVisible(true);
                        oView.byId("idWtQBWoWhSecondsc").setVisible(false);
                        oView.byId("idWtQBWoThirdbackbtn").setVisible(true);
                        oView.byId("idWtQBWoSecondbackbtn").setVisible(false);
                    }, error: function () {
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });
            },
            onWtQBWoDetailBtnPress: function () {
                var oView = this.getView();
                var oModel = this.getView().getModel();
                var that = this // Assuming you have a model set up
                var oSelectedWTs = that.oSelectedWT;
                oModel.read(`/WarehouseOrderSet('${this.sWarehouseorder}')`, {
                    urlParameters: {
                        "$expand": "WarehouseOrdertoTask",
                        "$format": "json"
                    },

                    success: function (odata) {
                        console.log(odata)
                        var aWarehousetask = odata.WarehouseOrdertoTask.results;

                        var oSelectedWT = aWarehousetask.find(function (WarehouseTask) {

                            return WarehouseTask.Tanum === oSelectedWTs;
                        });
                        oView.byId("idWtQBWoWhThirdsc").setVisible(false);
                        oView.byId("idWtQBWoWhFourthsc").setVisible(true);
                        oView.byId("idWtQBWoThirdbackbtn").setVisible(false);
                        oView.byId("idWtQBWoFourthbackbtn").setVisible(true);
                        if (oSelectedWT) {
                            oView.byId("idWtQBWOwoInput").setValue(odata.Who);
                            oView.byId("idWtQBWOEstpInput").setValue(oSelectedWT.Procs);
                            oView.byId("idWtQBWOSqtyInput").setValue(oSelectedWT.Vsola);
                            oView.byId("idWtQBWOPcInput").setValue(oSelectedWT.Altme);
                            oView.byId("idWtQBWOOwnerInput").setValue(oSelectedWT.Owner);
                            oView.byId("idWtQBWOPEntInput").setValue(oSelectedWT.Entitled);
                            oView.byId("idWtQBWOHuWtInput").setValue(oSelectedWT.Flghuto);
                            oView.byId("idWtQBWOHTypeInput").setValue(oSelectedWT.Letyp);
                        }

                    }, error: function () {
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });
            },
            onWtQBWoOpenBtnPress: function () {
                var oView = this.getView();
                var sWarehouseorder = oView.byId("idWtQBWoWh2Input").getValue();

                var oModel = this.getView().getModel();
                var that = this;

                // Fetch the warehouse order details
                oModel.read(`/WarehouseOrderSet('${sWarehouseorder}')`, {
                    urlParameters: {
                        "$expand": "WarehouseOrdertoTask",
                        "$format": "json"
                    },
                    success: function (odata) {
                        if (odata.Who === sWarehouseorder) {
                            let oDetails = odata.WarehouseOrdertoTask.results;

                            // Filter for open tasks
                            let aOpenTasks = oDetails.filter(task => task.Tostat === '');

                            // Create a JSON model with the filtered tasks
                            var oWarehouse = new sap.ui.model.json.JSONModel({ Warehouseorder: aOpenTasks });

                            // Set and bind the model to the table
                            that.byId("idWtQBWoWhTable").setModel(oWarehouse);
                            that.byId("idWtQBWoWhTable").bindItems({
                                path: "/Warehouseorder",
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{Tanum}" }),
                                        new sap.m.Text({ text: "Open" }),  // Set status text as 'Open'
                                        new sap.m.Text({ text: "{ConfBy}" })
                                    ]
                                })
                            });

                            // Show the relevant UI components
                            that.getView().byId("idWtQBWoWhSecondsc").setVisible(true);
                        }
                    },
                    error: function () {
                        sap.m.MessageToast.show("Error fetching open tasks.");
                    }
                });
            },
            onWtQBWoConfBtnPress: function () {
                var oView = this.getView();
                var sWarehouseorder = oView.byId("idWtQBWoWh2Input").getValue();
                var oModel = this.getView().getModel();
                var that = this;

                // Fetch the warehouse order details
                oModel.read(`/WarehouseOrderSet('${sWarehouseorder}')`, {
                    urlParameters: {
                        "$expand": "WarehouseOrdertoTask",
                        "$format": "json"
                    },
                    success: function (odata) {
                        if (odata.Who === sWarehouseorder) {
                            let oDetails = odata.WarehouseOrdertoTask.results;

                            // Filter for open tasks
                            let aOpenTasks = oDetails.filter(task => task.Tostat === 'C');

                            // Create a JSON model with the filtered tasks
                            var oWarehouse = new sap.ui.model.json.JSONModel({ Warehouseorder: aOpenTasks });

                            // Set and bind the model to the table
                            that.byId("idWtQBWoWhTable").setModel(oWarehouse);
                            that.byId("idWtQBWoWhTable").bindItems({
                                path: "/Warehouseorder",
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{Tanum}" }),
                                        new sap.m.Text({ text: "Confirmed" }),  // Set status text as 'Open'
                                        new sap.m.Text({ text: "{ConfBy}" })
                                    ]
                                })
                            });

                            // Show the relevant UI components
                            that.getView().byId("idWtQBWoWhSecondsc").setVisible(true);
                        }
                    },
                    error: function () {
                        sap.m.MessageToast.show("Error fetching open tasks.");
                    }
                });
            },
            onWtQBWoAllBtnPress: function () {
                var oView = this.getView();
                var sWarehouseorder = oView.byId("idWtQBWoWh2Input").getValue();
                this.onFetchWHTaskDetails(sWarehouseorder);
            },
            getStatusText: function (statusCode) {
                switch (statusCode) {
                    case 'C':
                        return 'Confirmed';
                    case 'A':
                        return 'Canceled';
                    case 'B':
                        return 'Locked';
                    case 'D':
                        return 'In process';
                    case '':
                        return 'Open';
                    default:
                        return statusCode; // Return original if no match found
                }
            }


        });
    }
);

