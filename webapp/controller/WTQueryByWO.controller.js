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
            // Handler for Warehouse Order input change event
            onWtQBWoWhLiveChange: function () {
                // Get the input value from the input field
                var oView = this.getView();
                var sWarehouseorder = oView.byId("idWtQBWoWhInput").getValue();

                // Convert the warehouse order to uppercase and store it
                sWarehouseorder = sWarehouseorder.toUpperCase();
                this.sWarehouseorder = sWarehouseorder;

                // Check if the warehouse order is provided, if not show a message
                if (!sWarehouseorder) {
                    sap.m.MessageToast.show("Please enter a WarehouseOrder");
                    return;
                }

                // Fetch the warehouse order task details
                this.onFetchWarehouseOrderTaskDetails(sWarehouseorder);
            },

            // Function to fetch warehouse order task details from backend
            onFetchWarehouseOrderTaskDetails: function (sWarehouseOrder) {
                var oModel = this.getView().getModel(); // Get the model associated with the view
                var that = this;

                // Check if data for this warehouse order is already fetched to avoid multiple calls
                if (!this._oWarehouseOrderData || this._oWarehouseOrderData.sWarehouseOrder !== sWarehouseOrder) {
                    // Fetch data from backend for the warehouse order
                    oModel.read(`/WarehouseOrderSet('${sWarehouseOrder}')`, {
                        urlParameters: {
                            "$expand": "WarehouseOrdertoTask", // Expand related task data
                            "$format": "json" // Request the data in JSON format
                        },
                        success: function (odata) {
                            console.log(odata);
                            // If data is fetched and the warehouse order matches
                            if (odata.Who === sWarehouseOrder) {
                                // Set the warehouse order value in another input field
                                that.getView().byId("idWtQBWoWh2Input").setValue(sWarehouseOrder);
                                // Store the fetched data for future use
                                that._oWarehouseOrderData = {
                                    sWarehouseOrder: sWarehouseOrder,
                                    tasks: odata.WarehouseOrdertoTask.results
                                };
                                that._odata = odata;

                                // Filter and bind tasks to the table
                                that._filterAndBindWarehouseOrderTasks(that, sWarehouseOrder, "all", that._odata);
                            }
                        },
                        error: function () {
                            // Display an error message if fetching data fails
                            sap.m.MessageToast.show("Error fetching warehouse order tasks.");
                        }
                    });
                } else {
                    // If data already exists, directly apply the filter to avoid unnecessary calls
                    that._filterAndBindWarehouseOrderTasks(that, sWarehouseOrder, "all", that._odata);
                }
            },

            // Function to filter tasks based on status and bind them to the table
            _filterAndBindWarehouseOrderTasks: function (that, sWarehouseOrder, status, odata) {
                var filteredTasks;

                // Filter tasks based on the status
                if (status === "open") {
                    filteredTasks = this._oWarehouseOrderData.tasks.filter(task => task.Tostat === '');
                } else if (status === "confirmed") {
                    filteredTasks = this._oWarehouseOrderData.tasks.filter(task => task.Tostat === 'C');
                } else {
                    filteredTasks = this._oWarehouseOrderData.tasks; // For 'all', no filtering
                }

                // Map filtered tasks to a simpler format
                var aWarehouseOrderDetails = filteredTasks.map(function (task) {
                    return {
                        Tanum: task.Tanum, // Task number
                        Tostat: that.getStatusText(task.Tostat), // Status text based on task status
                        ConfBy: task.ConfBy // Task confirmation by
                    };
                });

                // Create a JSON model for the filtered tasks
                var oWarehouse = new sap.ui.model.json.JSONModel({ WarehouseOrder: aWarehouseOrderDetails });

                // Set and bind the model to the table
                that.byId("idWtQBWoWhTable").setModel(oWarehouse);
                that.byId("idWtQBWoWhTable").bindItems({
                    path: "/WarehouseOrder",
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{Tanum}" }),   // Display task number
                            new sap.m.Text({ text: "{Tostat}" }),  // Display task status
                            new sap.m.Text({ text: "{ConfBy}" })   // Display who confirmed the task
                        ],
                        type: "Navigation",   // Enable navigation on row click
                        press: [that.onSelectWarehouseOrderTask, that] // Event handler for row press
                    })
                });

                // Toggle visibility of UI components based on filtered data
                that.getView().byId("idWtQBWoFirstSC").setVisible(false);
                that.getView().byId("idWtQBWoWhSecondsc").setVisible(true);
                that.getView().byId("idWtQBWofirstbackbtn").setVisible(false);
                that.getView().byId("idWtQBWoSecondbackbtn").setVisible(true);
                that.getView().byId("idWtQBWoWhInput").setValue(""); // Clear input field
            },

            // Handler when a warehouse order task is selected
            onSelectWarehouseTask: function (oEvent) {
                var oView = this.getView();
                var oModel = this.getView().getModel(); // Get the model
                var that = this;

                // Fetch the warehouse order and task details again based on selected task
                oModel.read(`/WarehouseOrderSet('${this.sWarehouseorder}')`, {
                    urlParameters: {
                        "$expand": "WarehouseOrdertoTask", // Expand related task data
                        "$format": "json" // Request the data in JSON format
                    },

                    success: function (odata) {
                        console.log(odata);
                        var aWarehousetask = odata.WarehouseOrdertoTask.results;
                        var sSelectedWT = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Tanum"); // Get selected task number

                        var oSelectedWT = aWarehousetask.find(function (WarehouseTask) {
                            return WarehouseTask.Tanum === sSelectedWT;
                        });

                        // If task is found, update relevant input fields with task details
                        if (oSelectedWT) {
                            oView.byId("idWtQBWowtInput").setValue(oSelectedWT.Tanum);
                            oView.byId("idWtQBWoWTitInput").setValue(oSelectedWT.Tapos);
                            oView.byId("idWtQBWowtsInput").setValue(odata.Numwt);
                            oView.byId("idWtQBWoStsInput").setValue(oSelectedWT.Tostat);
                            oView.byId("idWtQBWoStypInput").setValue(oSelectedWT.Trart);
                            oView.byId("idWtQBWoPtypInput").setValue(oSelectedWT.Procty);
                            oView.byId("idWtQBWoSproInput").setValue(oSelectedWT.Prces);
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

                            // Convert and format milliseconds to HH:MM:SS format
                            function convertMillisecondsToTime(milliseconds) {
                                let totalSeconds = Math.floor(milliseconds / 1000);
                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                const seconds = totalSeconds % 60;
                                return (
                                    String(hours).padStart(2, '0') + ':' +
                                    String(minutes).padStart(2, '0') + ':' +
                                    String(seconds).padStart(2, '0')
                                );
                            }

                            // Set formatted time value in the input field
                            that.oSelectedWT = sSelectedWT;
                            const milliseconds = oSelectedWT.ConfT.ms;
                            oView.byId("idWtQBWoCdatnput").setValue(convertMillisecondsToTime(milliseconds));
                            oView.byId("idWtQBWoWTitAllInput").setValue(that.getStatusText(oSelectedWT.Tostat));
                        } else {
                            // Show a message if the selected task is not found
                            sap.m.MessageToast.show("WarehouseTask not found.");
                        }

                        // Toggle UI visibility for the third screen
                        oView.byId("idWtQBWoWhThirdsc").setVisible(true);
                        oView.byId("idWtQBWoWhSecondsc").setVisible(false);
                        oView.byId("idWtQBWoThirdbackbtn").setVisible(true);
                        oView.byId("idWtQBWoSecondbackbtn").setVisible(false);
                    },

                    // Show an error message if fetching the task details fails
                    error: function () {
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });
            },

            // Handler for the "Detail" button press to show further details for a warehouse order task
            onWtQBWoDetailBtnPress: function () {
                var oView = this.getView();
                var oModel = this.getView().getModel();
                var that = this;
                var oSelectedWTs = that.oSelectedWT;

                oModel.read(`/WarehouseOrderSet('${this.sWarehouseorder}')`, {
                    urlParameters: {
                        "$expand": "WarehouseOrdertoTask",
                        "$format": "json"
                    },

                    success: function (odata) {
                        console.log(odata);
                        var aWarehousetask = odata.WarehouseOrdertoTask.results;

                        var oSelectedWT = aWarehousetask.find(function (WarehouseTask) {
                            return WarehouseTask.Tanum === oSelectedWTs;
                        });

                        // Toggle UI for fourth screen
                        oView.byId("idWtQBWoWhThirdsc").setVisible(false);
                        oView.byId("idWtQBWoWhFourthsc").setVisible(true);
                        oView.byId("idWtQBWoThirdbackbtn").setVisible(false);
                        oView.byId("idWtQBWoFourthbackbtn").setVisible(true);

                        // Set details in the UI inputs
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

                    },

                    error: function () {
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });
            },

            // Handler for filtering open tasks in Warehouse Order
            onWtQBWoOpenBtnPress: function () {
                var oView = this.getView();
                var that = this;
                var sWarehouseOrder = oView.byId("idWtQBWoWh2Input").getValue(); // Get warehouse order value
                this._filterAndBindWarehouseOrderTasks(this, sWarehouseOrder, "open", that._odata); // Filter for open tasks
            },

            // Handler for filtering confirmed tasks in Warehouse Order
            onWtQBWoConfBtnPress: function () {
                var oView = this.getView();
                var that = this;
                var sWarehouseOrder = oView.byId("idWtQBWoWh2Input").getValue(); // Get warehouse order value
                that._filterAndBindWarehouseOrderTasks(that, sWarehouseOrder, "confirmed", that._odata); // Filter for confirmed tasks
            },

            // Handler to show all tasks (no filtering)
            onWtQBWoAllBtnPress: function () {
                var oView = this.getView();
                var that = this;
                var sWarehouseOrder = oView.byId("idWtQBWoWh2Input").getValue(); // Get warehouse order value
                that._filterAndBindWarehouseOrderTasks(that, sWarehouseOrder, "all", that._odata); // Show all tasks
            },

            // Function to get status text based on status code
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
                        return 'Open'; // Default to 'Open' if no status
                    default:
                        return statusCode; // Return original if no match found
                }
            }


        });
    }
);

