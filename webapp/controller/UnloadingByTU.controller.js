sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library"
],
    function (Controller, Device, JSONModel, Popover, Button, library) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.UnloadingByTU", {
            onInit: function () {
                const oTable = this.getView().byId("idTable_UBYTU");
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
                var oSelected = this.byId("idTable_UBYTU").getSelectedItem();
                // var ID = oSelected.getBindingContext().getObject()
                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page2_UBYTU").setVisible(true);
            },

            Onpressback0: async function () {

                const oRouter = this.getOwnerComponent().getRouter();
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
            Onpresssubmit: function () {

                this.getView().byId("page1_UBYTU").setVisible(true);
                // this.getView().byId("page2Shipment_UBYTU").setVisible(true);
                this.getView().byId("page2_UBYTU").setVisible(false);
                //  this.getView().byId("idTable_UBYTU").setVisible(true);
                this.getView().byId("idPanel_UBYTU").setVisible(true);
                this.getView().byId("idNavBackButton0_UBYTU").setVisible(false);
                this.getView().byId("idNavBackButton0_1_UBYTU").setVisible(true);


            },
            OnpressbackToInput: function () {
                this.getView().byId("idPanel_UBYTU").setVisible(false);
                this.getView().byId("idNavBackButton0_1_UBYTU").setVisible(false);
                this.getView().byId("idNavBackButton0_UBYTU").setVisible(true);



            },

            Onpressback1: function () {

                this.getView().byId("page1_UBYTU").setVisible(true);
                this.getView().byId("page2_UBYTU").setVisible(false);





            },
            onHUListPress: function () {

                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page2_UBYTU").setVisible(false);
                this.getView().byId("page3_UBYTU").setVisible(true);


            },
            Onpressback2: function () {

                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page2_UBYTU").setVisible(true);
                this.getView().byId("page3_UBYTU").setVisible(false);



            },
            onNewHUPress: function () {
                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page2_UBYTU").setVisible(false);
                this.getView().byId("page3_UBYTU").setVisible(false);

                this.getView().byId("page4_UBYTU").setVisible(true);
                this.getView().byId("page5_UBYTU").setVisible(false);


            },
            Onpressback3: function () {
                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page2_UBYTU").setVisible(true);
                this.getView().byId("page4_UBYTU").setVisible(false);

            },
            onNextEnterpress: function () {
                this.getView().byId("page5_UBYTU").setVisible(true);

                this.getView().byId("page4_UBYTU").setVisible(false);

                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page2_UBYTU").setVisible(false);


            },
            Onpressback4: function () {
                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page5_UBYTU").setVisible(false);

                this.getView().byId("page4_UBYTU").setVisible(true);
                this.getView().byId("page3_UBYTU").setVisible(false);



                this.getView().byId("page2_UBYTU").setVisible(false);


            },
            onGRPress: function () {
                this.getView().byId("page6_UBYTU").setVisible(true);
                this.getView().byId("page5_UBYTU").setVisible(false);
                this.getView().byId("page4_UBYTU").setVisible(false);


                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page2_UBYTU").setVisible(false);


            },
            Onpressback5: function () {
                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page5_UBYTU").setVisible(true);
                this.getView().byId("page6_UBYTU").setVisible(false);


                this.getView().byId("page4_UBYTU").setVisible(false);



                this.getView().byId("page2_UBYTU").setVisible(false);


            },
            onUnloadPress: function () {
                this.getView().byId("page6_UBYTU").setVisible(false);
                this.getView().byId("page5_UBYTU").setVisible(false);
                this.getView().byId("page4_UBYTU").setVisible(false);
                this.getView().byId("page7_UBYTU").setVisible(true);


                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page2_UBYTU").setVisible(false);


            },


            // onUnloadPress1:function(){
            //     this.getView().byId("page6_UBYTU").setVisible(false);
            //     this.getView().byId("page5_UBYTU").setVisible(false);
            //     this.getView().byId("page4_UBYTU").setVisible(false);
            //     this.getView().byId("page7_UBYTU").setVisible(true);

            //     this.getView().byId("_IDGenButton4444").setVisible(false); 
            //     this.getView().byId("_IDGenButton2222").setVisible(false);
            //     this.getView().byId("_IDGenButton3333").setVisible(false);  
            //     this.getView().byId("_IDGenButton1111").setVisible(false);
            //     this.getView().byId("_IDGenButton5555").setVisible(false);
            //     this.getView().byId("_IDGenButton6666").setVisible(false);



            //     this.getView().byId("page1_UBYTU").setVisible(false);
            //     this.getView().byId("page2_UBYTU").setVisible(false);


            // },
            Onpressback6: function () {
                this.getView().byId("page1_UBYTU").setVisible(false);
                this.getView().byId("page5_UBYTU").setVisible(true);
                this.getView().byId("icon7").setVisible(false);
                this.getView().byId("page6_UBYTU").setVisible(false);

                this.getView().byId("page3_UBYTU").setVisible(false);

                this.getView().byId("page4_UBYTU").setVisible(false);


                this.getView().byId("page2_UBYTU").setVisible(false);


            },
            // Onpressback7:function(){
            //     this.getView().byId("page1_UBYTU").setVisible(false);
            //     this.getView().byId("page5_UBYTU").setVisible(true);
            //     this.getView().byId("page6_UBYTU").setVisible(false);
            //     this.getView().byId("page7_UBYTU").setVisible(false);


            //     this.getView().byId("page3_UBYTU").setVisible(false);
            //     this.getView().byId("_IDGenButton4444").setVisible(false); 
            //     this.getView().byId("_IDGenButton2222").setVisible(false);
            //     this.getView().byId("_IDGenButton3333").setVisible(false);  
            //     this.getView().byId("_IDGenButton1111").setVisible(false);
            //     this.getView().byId("_IDGenButton5555").setVisible(false);
            //     this.getView().byId("_IDGenButton6666").setVisible(false);

            //     this.getView().byId("page4_UBYTU").setVisible(false);


            //     this.getView().byId("page2_UBYTU").setVisible(false);


            // },

        });
    });