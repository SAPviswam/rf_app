sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function (BaseController, UIComponent) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.WTQueryByQueue", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },
            onWtQBQueuefirstBackBtnPress: async function () {
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
            onWtQBQueueWhLiveChange: function () {
                var oView = this.getView();
                var sWarehouseQueue = oView.byId("idWtQBQueueWhInput").getValue();

                sWarehouseQueue = sWarehouseQueue.toUpperCase();
                this.sWarehouseQueue = sWarehouseQueue;

                // Check if bin number is provided
                if (!sWarehouseQueue) {
                    sap.m.MessageToast.show("Please enter a WarehouseQueue");
                    return;
                }
                this.onFetchWareHouseTaskDetails(sWarehouseQueue);
            },

            // Fetch warehouse task details once and store in a model
            onFetchWareHouseTaskDetails: function (sWarehouseQueue) {
                var oModel = this.getView().getModel(); // Assuming you have a model set up
                var that = this;

                // Check if the data is already fetched to avoid multiple calls
                if (!this._oWarehouseData || this._oWarehouseData.sWarehouseQueue !== sWarehouseQueue) {
                    // Fetch data from backend
                    oModel.read(`/QueueSet('${sWarehouseQueue}')`, {
                        urlParameters: {
                            "$expand": "QueueNav",
                            "$format": "json"
                        },
                        success: function (odata) {
                            if (odata.Queue1 === sWarehouseQueue) {
                                that.getView().byId("idInput_Wt_WTQuerybyQueue").setValue(sWarehouseQueue);
                                // Store the fetched data in the controller to reuse
                                that._oWarehouseData = {
                                    sWarehouseQueue: sWarehouseQueue,
                                    tasks: odata.QueueNav.results
                                };

                                that._filterAndBindWarehouseTasks(that, sWarehouseQueue, "all");
                            }
                        },
                        error: function () {
                            sap.m.MessageToast.show("Error fetching warehouse tasks.");
                        }
                    });
                } else {
                    // Data already exists, directly apply the filter
                    that._filterAndBindWarehouseTasks(that, sWarehouseQueue, "all");
                }
            },

            // Reusable function to filter and bind warehouse tasks based on status
            _filterAndBindWarehouseTasks: function (that, sWarehouseQueue, status) {
                var filteredTasks;

                // Filter tasks based on the status
                if (status === "open") {
                    filteredTasks = this._oWarehouseData.tasks.filter(task => task.Tostat === '');
                } else if (status === "confirmed") {
                    filteredTasks = this._oWarehouseData.tasks.filter(task => task.Tostat === 'C');
                } else {
                    filteredTasks = this._oWarehouseData.tasks; // For 'all', no filtering
                }

                // Map filtered tasks to a simpler format
                var aWarehouseQueueDetails = filteredTasks.map(function (task) {
                    return {
                        Tanum: task.Tanum,
                        Tostat: that.getStatusText(task.Tostat),
                    };
                });

                // Create a JSON model for the filtered tasks
                var oWarehouse = new sap.ui.model.json.JSONModel({ WarehouseQueue: aWarehouseQueueDetails });

                // Set and bind the model to the table
                that.byId("idTableWTQuerybyQueue").setModel(oWarehouse);
                that.byId("idTableWTQuerybyQueue").bindItems({
                    path: "/WarehouseQueue",
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{Tanum}" }),
                            new sap.m.Text({ text: "{Tostat}" }),
                        ],
                        type: "Navigation",
                        press: [that.onSelectWarehouseTaskQueue, that]
                    })
                });

                // visibility of UI components based on filtered data
                that.getView().byId("idWtQBQueueFirstSC").setVisible(false);
                that.getView().byId("idWtQBQueueWhThirdsc").setVisible(true);
                that.getView().byId("idWtQBQueuefirstbackbtn").setVisible(false);
                that.getView().byId("IdButton_Back_WTQuerybyQueue").setVisible(true);
            },

            // Filter function for open tasks
            onOpenWTQuerybyQueue: function () {
                var oView = this.getView();
                var sWarehouseQueue = oView.byId("idInput_Wt_WTQuerybyQueue").getValue();
                this._filterAndBindWarehouseTasks(this, sWarehouseQueue, "open");
            },

            // Filter function for confirmed tasks
            onConfWTQuerybyQueue: function () {
                var oView = this.getView();
                var sWarehouseQueue = oView.byId("idInput_Wt_WTQuerybyQueue").getValue();
                this._filterAndBindWarehouseTasks(this, sWarehouseQueue, "confirmed");
            },

            // Display all tasks (no filtering)
            onAllWTQuerybyQueue: function () {
                var oView = this.getView();
                var sWarehouseQueue = oView.byId("idInput_Wt_WTQuerybyQueue").getValue();
                this._filterAndBindWarehouseTasks(this, sWarehouseQueue, "all");
            },

            // Helper method to convert status codes to human-readable text
            getStatusText: function (statusCode) {
                switch (statusCode) {
                    case 'C':
                        return 'Confirmed';
                    case 'A':
                        return 'Canceled';
                    case 'B':
                        return 'Locked';
                    case 'D':
                        return 'In Process';
                    case '':
                        return 'Open';
                    default:
                        return statusCode; // Return original status if no match found
                }
            },
            onSelectWarehouseTaskQueue: function (oEvent) {
                debugger
                var oView = this.getView();
                var oModel = this.getView().getModel();
                var that = this;
                //Read the data from the backend table.
                oModel.read(`/QueueSet('${this.sWarehouseQueue}')`, {
                    urlParameters: {
                        "$expand": "QueueNav",
                        "$format": "json"
                    },

                    success: function (odata) {
                        var aWarehousetask = odata.QueueNav.results;
                        var sSelectedWT = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Tanum");
                        var oSelectedWT = aWarehousetask.find(function (WarehouseTask) {
                            return WarehouseTask.Tanum === sSelectedWT;
                        });
                        if (oSelectedWT) {
                            debugger
                            oView.byId("idInput_WT_WTQuerybyQueue").setValue(oSelectedWT.Tanum);
                            oView.byId("idInput_WTit_WTQuerybyQueue").setValue(oSelectedWT.Tapos);
                            oView.byId("idInput_WTs_WTQuerybyQueue").setValue(odata.Numwt);
                            oView.byId("idInput_STs_WTQuerybyQueue").setValue(oSelectedWT.Tostat);
                            oView.byId("idInput_STyp_WTQuerybyQueue").setValue(oSelectedWT.Trart);
                            oView.byId("idInput_PTyp_WTQuerybyQueue").setValue(oSelectedWT.Procty);  // Selected material number
                            oView.byId("idInput_Spro_WTQuerybyQueue").setValue(oSelectedWT.Prces);  // Selected material quantity
                            oView.byId("idInput_Acty_WTQuerybyQueue").setValue(oSelectedWT.ActType);
                            oView.byId("idInput3_WTQuerybyQueue").setValue(oSelectedWT.Idplate);
                            oView.byId("idInput_Pro_WTQuerybyQueue").setValue(oSelectedWT.Matnr);
                            oView.byId("idInput4_WTQuerybyQueue").setValue(oSelectedWT.HazmatInd);
                            oView.byId("idInput_Sbin_WTQuerybyQueue").setValue(oSelectedWT.Vlpla);
                            oView.byId("idInput5_WTQuerybyQueue").setValue(oSelectedWT.Vlenr);
                            oView.byId("idInput__Dbin_WTQuerybyQueue").setValue(oSelectedWT.Nlpla);
                            oView.byId("idInput6_WTQuerybyQueue").setValue(oSelectedWT.Nlenr);

                            var rawDate = oSelectedWT.ConfD;

                            // Check if the rawDate is null or empty
                            if (!rawDate) {
                                // If the date is invalid (null or empty), set formattedDateString to an empty string or a default value
                                var formattedDateString = ""; // or "No date available", or any placeholder text
                            } else {
                                var year = rawDate.substring(0, 4);
                                // Month is zero-indexed in JavaScript
                                var month = rawDate.substring(4, 6) - 1;
                                var day = rawDate.substring(6, 8);

                                var formattedDate = new Date(year, month, day);

                                // Manually extract the day, month, and year
                                var dayStr = ("0" + formattedDate.getDate()).slice(-2);
                                var monthStr = ("0" + (formattedDate.getMonth() + 1)).slice(-2);
                                var yearStr = formattedDate.getFullYear();

                                // Format as "DD.MM.YYYY"
                                var formattedDateString = dayStr + '.' + monthStr + '.' + yearStr;
                            }

                            console.log(formattedDateString);


                            oView.byId("idInput_Cdat_WTQuerybyQueue").setValue(formattedDateString);
                            oView.byId("idInput_Cusr_WTQuerybyQueue").setValue(oSelectedWT.ConfBy);

                            var milliseconds = oSelectedWT.ConfT.ms;
                            var totalSeconds = Math.floor(milliseconds / 1000);
                            var hours = Math.floor(totalSeconds / 3600);
                            var minutes = Math.floor((totalSeconds % 3600) / 60);
                            var seconds = totalSeconds % 60;

                            hours = hours < 10 ? '0' + hours : hours;
                            minutes = minutes < 10 ? '0' + minutes : minutes;
                            seconds = seconds < 10 ? '0' + seconds : seconds;

                            var formattedTime = hours + ':' + minutes + ':' + seconds;
                            oView.byId("idInput7_WTQuerybyQueue").setValue(formattedTime);

                            oView.byId("idInput_WTQuerybyQueue").setValue(that.getStatusText(oSelectedWT.Tostat));
                            that.oSelectedWT = sSelectedWT;
                        } else {
                            sap.m.MessageToast.show("WarehouseTask not found.");
                        }
                        oView.byId("idWtQBQueueWhFourthsc").setVisible(true);
                        oView.byId("idWtQBQueueThirdbackbtn").setVisible(true);
                        oView.byId("idWtQBQueueWhThirdsc").setVisible(false);
                        oView.byId("IdButton_Back_WTQuerybyQueue").setVisible(false);
                    }, error: function () {
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });

            },
            //Second Back Button.
            onBackWTQuerybyQueue: function () {
                this.getView().byId("idWtQBQueueFirstSC").setVisible(true);
                this.getView().byId("idWtQBQueueWhThirdsc").setVisible(false);
                this.getView().byId("idWtQBQueuefirstbackbtn").setVisible(true);
                this.getView().byId("IdButton_Back_WTQuerybyQueue").setVisible(false);
            },
            //Third Back Button
            onWtQBQueueSecondBackBtnPress: function () {
                this.getView().byId("idWtQBQueueWhThirdsc").setVisible(true);
                this.getView().byId("IdButton_Back_WTQuerybyQueue").setVisible(true);
                this.getView().byId("idWtQBQueueWhFourthsc").setVisible(false);
                this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(false)
            },
            //Product Details Function
            onWtQBWoDetailBtnPress: function () {
                var oView = this.getView();
                var oModel = this.getView().getModel();
                var that = this
                var oSelectedWTs = that.oSelectedWT;
                oModel.read(`/QueueSet('${this.sWarehouseQueue}')`, {
                    urlParameters: {
                        "$expand": "QueueNav",
                        "$format": "json"
                    },
                    success: function (odata) {
                        var aWarehousetask = odata.QueueNav.results;
                        var oSelectedWT = aWarehousetask.find(function (WarehouseTask) {
                            return WarehouseTask.Tanum === oSelectedWTs;
                        });

                        //Removing the Preceding Zeros
                        var oRdocid = oSelectedWT.Rdocid.trimStart();
                        oRdocid = oRdocid.replace(/^0+/, '');

                        var Ritmid = oSelectedWT.Ritmid.trimStart();
                        Ritmid = Ritmid.replace(/^0+/, '');

                        //Seting the Product Details for the Inputs
                        if (oSelectedWT) {
                            oView.byId("idInput_ProdDisc_WTQuerybyQueue").setValue(oSelectedWT.Maktx);
                            oView.byId("idInput_Wo_WTQuerybyQueue").setValue(oSelectedWT.Who);
                            oView.byId("idInput_ESTP_WTQuerybyQueue").setValue(oSelectedWT.Procs);
                            oView.byId("idInput_Sqty_WTQuerybyQueue").setValue(oSelectedWT.Vsola);
                            oView.byId("idInput21_WTQuerybyQueue").setValue(oSelectedWT.Altme);
                            oView.byId("idInput_Owner_WTQuerybyQueue").setValue(oSelectedWT.Owner);
                            oView.byId("idInput_PEnt_WTQuerybyQueue").setValue(oSelectedWT.Entitled);
                            oView.byId("idInput_HuWt_WTQuerybyQueue").setValue(oSelectedWT.Flghuto);
                            oView.byId("idInput_HType_WTQuerybyQueue").setValue(oSelectedWT.Letyp);
                            oView.byId("idInput_CR_WTQuerybyQueue").setValue(oSelectedWT.Coo);
                            oView.byId("IdInput_Btch_WTQuerybyQueue").setValue(oSelectedWT.Charg);
                            oView.byId("idInput_WhHu_WTQuerybyQueue").setValue(oSelectedWT.Homve);
                            oView.byId("IdInput_CGrp_WTQuerybyQueue").setValue(oSelectedWT.Dstgrp);
                            oView.byId("idInput_SLED_WTQuerybyQueue").setValue(oSelectedWT.Vfdat);
                            oView.byId("idInput_Qu_WTQuerybyQueue").setValue(oSelectedWT.Queue1);
                            oView.byId("idInput29_WTQuerybyQueue").setValue(oSelectedWT.Rdoccat);
                            oView.byId("idInput30_WTQuerybyQueue").setValue(oRdocid);
                            oView.byId("idInput31_WTQuerybyQueue").setValue(Ritmid)
                        }

                    }, error: function () {
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });
                oView.byId("idWtQBQueueWhFourthsc").setVisible(false);
                oView.byId("idWtQBQueueWhFifthsc").setVisible(true);
                oView.byId("idWtQBQueueThirdbackbtn").setVisible(false);
                oView.byId("idButton4_Back_WTQuerybyQueue").setVisible(true);
            },
            onPressBackWTQuerybyQueue: function () {
                this.getView().byId("idWtQBQueueWhFourthsc").setVisible(true);
                this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(true);
                this.getView().byId("idWtQBQueueWhFifthsc").setVisible(false);
                this.getView().byId("idButton4_Back_WTQuerybyQueue").setVisible(false);

            },

        });
    }
);

