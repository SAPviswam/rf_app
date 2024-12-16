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

    return Controller.extend("com.app.rfapp.controller.DeconsolidationManually", {
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
            var that = this;
     
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
     
              success: function (oData) {
                let oUser=oData.Users.toLowerCase()
                if (oUser === "resource") {
     
                  oRouter.navTo("RouteResourcePage", { id: this.ID,idI:that.IDI });
     
                }
     
                else {
     
                  oRouter.navTo("Supervisor", { id: this.ID ,idI:that.IDI});
                }
     
              }.bind(this),
     
              error: function () {
     
                sap.m.MessageToast.show("User does not exist");
     
              }
            });
        },
        Onpresssubmit: function () {

            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(true);
           

        },
        Onpresssubmit1: function () {

            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(true);
           

        },
        Onpressback2:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(true);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
  
        },
        OnpressWorkCenter: function () {

            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(true);
        },
        Onpressback3:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(true);
            this.getView().byId("page3DeconsolidationManually").setVisible(false);
  
        },
        onQueriesButtonPress:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(false);
            this.getView().byId("page4DeconsolidationManually").setVisible(true);
  
        },
        Onpressback4:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(true);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);

  
        },
        onHUovButtonPress:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(false);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(true);

  
        },
        Onpressback5:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(true);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);

        },
        onwtlisButtonPress:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(false);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);
            this.getView().byId("page6DeconsolidationManually").setVisible(true);


  
        },
        Onpressback6:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(true);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);
            this.getView().byId("page6DeconsolidationManually").setVisible(false);


        },
        onHUCrtvButtonPress:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(false);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);
            this.getView().byId("page6DeconsolidationManually").setVisible(false);
            this.getView().byId("page7DeconsolidationManually").setVisible(true);



  
        },
        Onpressback7:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(true);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);
            this.getView().byId("page6DeconsolidationManually").setVisible(false);
            this.getView().byId("page7DeconsolidationManually").setVisible(false);



        },
        Onpressenter:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(false);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);
            this.getView().byId("page6DeconsolidationManually").setVisible(false);
            this.getView().byId("page7DeconsolidationManually").setVisible(false);
            this.getView().byId("page8DeconsolidationManually").setVisible(true);


        },
        Onpressback8:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(false);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);
            this.getView().byId("page6DeconsolidationManually").setVisible(false);
            this.getView().byId("page7DeconsolidationManually").setVisible(true);
            this.getView().byId("page8DeconsolidationManually").setVisible(false);

        },
        navigatetopage9:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(false);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);
            this.getView().byId("page6DeconsolidationManually").setVisible(false);
            this.getView().byId("page7DeconsolidationManually").setVisible(false);
            this.getView().byId("page8DeconsolidationManually").setVisible(false);
            this.getView().byId("page9DeconsolidationManually").setVisible(true);


        },
        Onpressback9:function(){
            
            this.getView().byId("page1DeconsolidationManually").setVisible(false);
            this.getView().byId("page2DeconsolidationManually").setVisible(false);
            this.getView().byId("page3DeconsolidationManually").setVisible(true);
            this.getView().byId("page4DeconsolidationManually").setVisible(false);
            this.getView().byId("page5DeconsolidationManually").setVisible(false);
            this.getView().byId("page6DeconsolidationManually").setVisible(false);
            this.getView().byId("page7DeconsolidationManually").setVisible(false);
            this.getView().byId("page8DeconsolidationManually").setVisible(false);
            this.getView().byId("page9DeconsolidationManually").setVisible(false);

        },

    });
});