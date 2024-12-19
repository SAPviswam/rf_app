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

        return Controller.extend("com.app.rfapp.controller.UnloadingByBillofLading", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();

                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

            },
            onResourceDetailsLoad: async function (oEvent1) {

                const { id,idI } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI=idI

            },
            onSignoutPressed:function(){
                var oRouter = this.getOwnerComponent().getRouter(this);
                oRouter.navTo("InitialScreen",{Userid:this.IDI});
            },
            
            Onpressback0: async function () {
                const oRouter = this.getOwnerComponent().getRouter();
         
                var oModel1 = this.getOwnerComponent().getModel();
         var that=this;
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
         
                  success: function (oData) {
                    let oUser=oData.Users.toLowerCase()
                    if (oUser === "resource") {
         
                      oRouter.navTo("RouteResourcePage", { id: this.ID,idI:that.IDI });
         
                    }
         
                    else {
         
                      oRouter.navTo("Supervisor", { id: this.ID,idI:that.IDI });
                    }
         
                  }.bind(this),
         
                  error: function () {
         
                    sap.m.MessageToast.show("User does not exist");
         
                  }
                });
            },
            Onpresssubmit: function () {

                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page2billofLading_UOBL").setVisible(true);


            },
            Onpressback1: function () {

                this.getView().byId("page1billofLading_UOBL").setVisible(true);
                this.getView().byId("page2billofLading_UOBL").setVisible(false);





            },
            onHUListPress: function () {

                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page2billofLading_UOBL").setVisible(false);
                this.getView().byId("page3billofLading_UOBL").setVisible(true);


            },
            Onpressback2: function () {

                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page2billofLading_UOBL").setVisible(true);
                this.getView().byId("page3billofLading_UOBL").setVisible(false);



            },
            onNewHUPress: function () {
                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page2billofLading_UOBL").setVisible(false);
                this.getView().byId("page3billofLading_UOBL").setVisible(false);

                this.getView().byId("page4billofLading_UOBL").setVisible(true);
                this.getView().byId("page5billofLading_UOBL").setVisible(false);


            },
            Onpressback3: function () {
                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page2billofLading_UOBL").setVisible(true);
                this.getView().byId("page4billofLading_UOBL").setVisible(false);

            },
            onNextEnterpress: function () {
                this.getView().byId("page5billofLading_UOBL").setVisible(true);

                this.getView().byId("page4billofLading_UOBL").setVisible(false);

                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page2billofLading_UOBL").setVisible(false);


            },
            Onpressback4: function () {
                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page5billofLading_UOBL").setVisible(false);

                this.getView().byId("page4billofLading_UOBL").setVisible(true);
                this.getView().byId("page3billofLading_UOBL").setVisible(false);



                this.getView().byId("page2billofLading_UOBL").setVisible(false);


            },
            onGRPress: function () {
                this.getView().byId("page6billofLading_UOBL").setVisible(true);
                this.getView().byId("page5billofLading_UOBL").setVisible(false);
                this.getView().byId("page4billofLading_UOBL").setVisible(false);


                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page2billofLading_UOBL").setVisible(false);


            },
            Onpressback5: function () {
                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page5billofLading_UOBL").setVisible(true);
                this.getView().byId("page6billofLading_UOBL").setVisible(false);


                this.getView().byId("page4billofLading_UOBL").setVisible(false);



                this.getView().byId("page2billofLading_UOBL").setVisible(false);


            },
            onUnloadPress: function () {
                this.getView().byId("page6billofLading_UOBL").setVisible(false);
                this.getView().byId("page5billofLading_UOBL").setVisible(false);
                this.getView().byId("page4billofLading_UOBL").setVisible(false);
                this.getView().byId("page7billofLading_UOBL").setVisible(true);


                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page2billofLading_UOBL").setVisible(false);


            },


            // onUnloadPress1:function(){
            //     this.getView().byId("page6billofLading_UOBL").setVisible(false);
            //     this.getView().byId("page5billofLading_UOBL").setVisible(false);
            //     this.getView().byId("page4billofLading_UOBL").setVisible(false);
            //     this.getView().byId("page7billofLading_UOBL").setVisible(true);

            //     this.getView().byId("_IDGenButton4444").setVisible(false); 
            //     this.getView().byId("_IDGenButton2222").setVisible(false);
            //     this.getView().byId("_IDGenButton3333").setVisible(false);  
            //     this.getView().byId("_IDGenButton1111").setVisible(false);
            //     this.getView().byId("_IDGenButton5555").setVisible(false);
            //     this.getView().byId("_IDGenButton6666").setVisible(false);



            //     this.getView().byId("page1billofLading_UOBL").setVisible(false);
            //     this.getView().byId("page2billofLading_UOBL").setVisible(false);


            // },
            Onpressback6: function () {
                this.getView().byId("page1billofLading_UOBL").setVisible(false);
                this.getView().byId("page5billofLading_UOBL").setVisible(true);
                this.getView().byId("icon7").setVisible(false);
                this.getView().byId("page6billofLading_UOBL").setVisible(false);

                this.getView().byId("page3billofLading_UOBL").setVisible(false);

                this.getView().byId("page4billofLading_UOBL").setVisible(false);


                this.getView().byId("page2billofLading_UOBL").setVisible(false);


            },
            // Onpressback7:function(){
            //     this.getView().byId("page1billofLading_UOBL").setVisible(false);
            //     this.getView().byId("page5billofLading_UOBL").setVisible(true);
            //     this.getView().byId("page6billofLading_UOBL").setVisible(false);
            //     this.getView().byId("page7billofLading_UOBL").setVisible(false);


            //     this.getView().byId("page3billofLading_UOBL").setVisible(false);
            //     this.getView().byId("_IDGenButton4444").setVisible(false); 
            //     this.getView().byId("_IDGenButton2222").setVisible(false);
            //     this.getView().byId("_IDGenButton3333").setVisible(false);  
            //     this.getView().byId("_IDGenButton1111").setVisible(false);
            //     this.getView().byId("_IDGenButton5555").setVisible(false);
            //     this.getView().byId("_IDGenButton6666").setVisible(false);

            //     this.getView().byId("page4billofLading_UOBL").setVisible(false);


            //     this.getView().byId("page2billofLading_UOBL").setVisible(false);


            // },

        });
    });