sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.UnloadingByConsignmentOrder", {
            onInit: function () {
                const oTable = this.getView().byId("_IDGenColumnListItem_UBYCONORDR");
                oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));
                
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;

            },
            onRowDoubleClick: function () {
                debugger
                var oSelected = this.byId("idDeliveryTabl_UBYCONORDR").getSelectedItem();
                // var ID = oSelected.getBindingContext().getObject()
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(true);
            },
            Onpresssubmit: function () {

                // this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                // this.getView().byId("icon2_UBYCONORDR").setVisible(true);
                this.getView().byId("idHuDetailAESRsasPanel").setVisible(true);
                this.getView().byId("_IDGenButton77_UBYCONORDR").setVisible(false);
                this.getView().byId("_IDGenInput1_UBYCONORDR").setEditable(false);
                this.getView().byId("_IDGenButtonEnble_UBYCONORDR").setVisible(true);
                this.getView().byId("sampleBarcodeScannerButton_UBYCONORDR").setVisible(false);
                this.getView().byId("_IDGenButton111_UBYCONORDR").setVisible(false);

            },
            onPressBackFromDlvrs: function () {
                this.getView().byId("idHuDetailAESRsasPanel").setVisible(false);
                this.getView().byId("_IDGenButton77_UBYCONORDR").setVisible(true);
                this.getView().byId("_IDGenButtonEnble_UBYCONORDR").setVisible(false);
                this.getView().byId("_IDGenInput1_UBYCONORDR").setEditable(true);
                this.getView().byId("sampleBarcodeScannerButton_UBYCONORDR").setVisible(true);
                this.getView().byId("_IDGenButton111_UBYCONORDR").setVisible(true);

            },
            Onpressback1: function () {
                this.getView().byId("icon1_UBYCONORDR").setVisible(true);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);

            },
            onHUListPress: function () {
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);
                this.getView().byId("icon3_UBYCONORDR").setVisible(true);
            },
            Onpressback2: function () {
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(true);
                this.getView().byId("icon3_UBYCONORDR").setVisible(false);
            },
            onNewHUPress: function () {
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);
                this.getView().byId("icon3_UBYCONORDR").setVisible(false);
                this.getView().byId("icon4_UBYCONORDR").setVisible(true);
                this.getView().byId("icon5_UBYCONORDR").setVisible(false);
            },
            Onpressback3: function () {
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(true);
                this.getView().byId("icon4_UBYCONORDR").setVisible(false);
            },
            onNextEnterpress: function () {
                this.getView().byId("icon5_UBYCONORDR").setVisible(true);
                this.getView().byId("icon4_UBYCONORDR").setVisible(false);
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);
            },
            Onpressback4: function () {
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon5_UBYCONORDR").setVisible(false);
                this.getView().byId("icon4_UBYCONORDR").setVisible(true);
                this.getView().byId("icon3_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);
            },
            onGRPress: function () {
                this.getView().byId("icon6_UBYCONORDR").setVisible(true);
                this.getView().byId("icon5_UBYCONORDR").setVisible(false);
                this.getView().byId("icon4_UBYCONORDR").setVisible(false);
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);
            },
            Onpressback5: function () {
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon5_UBYCONORDR").setVisible(true);
                this.getView().byId("icon6_UBYCONORDR").setVisible(false);
                this.getView().byId("icon4_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);
            },
            onUnloadPress: function () {
                this.getView().byId("icon6_UBYCONORDR").setVisible(false);
                this.getView().byId("icon5_UBYCONORDR").setVisible(false);
                this.getView().byId("icon4_UBYCONORDR").setVisible(false);
                this.getView().byId("icon7_UBYCONORDR").setVisible(true);
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);
            },
            Onpressback6: function () {
                this.getView().byId("icon1_UBYCONORDR").setVisible(false);
                this.getView().byId("icon5_UBYCONORDR").setVisible(true);
                this.getView().byId("icon7_UBYCONORDR").setVisible(false);
                this.getView().byId("icon6_UBYCONORDR").setVisible(false);
                this.getView().byId("icon3_UBYCONORDR").setVisible(false);
                this.getView().byId("icon4_UBYCONORDR").setVisible(false);
                this.getView().byId("icon2_UBYCONORDR").setVisible(false);
            },
            onPressBackToHome: async function () {
                var oRouter = this.getOwnerComponent().getRouter();
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

                        sap.m.MessageToast.show("User does not exist");

                    }

                });

            },

            // onUnloadingByConsignmentOrderTilePress:function () {
            //     var oRouter = this.getOwnerComponent().getRouter();
            //     oRouter.navTo("UnloadingByConsignmentOrder");

            // },

            // {
            //     "name": "UnloadingByConsignmentOrder",
            //     "pattern": "UnloadingByConsignmentOrder",
            //     "target": [
            //       "TargetUnloadingByConsignmentOrder"
            //     ]
            //   },

            // "TargetUnloadingByConsignmentOrder": {
            //   "viewType": "XML",
            //   "transition": "slide",
            //   "clearControlAggregation": false,
            //   "viewId": "UnloadingByConsignmentOrder",
            //   "viewName": "UnloadingByConsignmentOrder"
            // },

        });
    }
);
