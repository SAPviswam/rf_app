sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/library",
    "sap/m/MessageBox"
],
function (Controller,Device,JSONModel,Popover,Button,library,MessageBox) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.CreationOfSingleHU", {
        onInit: function () {
            
			
            const oRouter = this.getOwnerComponent().getRouter();

            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

        },
        onResourceDetailsLoad: async function (oEvent1) {

            const { id } = oEvent1.getParameter("arguments");

            this.ID = id;

        },
        Onpressback0: async function () {
            const oRouter = this.getOwnerComponent().getRouter();
     
            var oModel1 = this.getOwnerComponent().getModel();
     
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
     
              success: function (oData) {
                let oUser=oData.Users.toLowerCase()
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

            this.getView().byId("page1CreationOfSingleHU_SHU").setVisible(false);
            this.getView().byId("page2CreationOfSingleHU_SHU").setVisible(true);
           

        },
        Onpressback2:function(){
            
            this.getView().byId("page1CreationOfSingleHU_SHU").setVisible(true);
            this.getView().byId("page2CreationOfSingleHU_SHU").setVisible(false);
  
        },
       
        OnSavePress:function(){
            MessageBox.information("please enter all the data!!!")
           
  
        },
       
        
    });
});