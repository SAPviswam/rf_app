sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device"
],
    function (Controller, Device) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.ReceivingofHUbyASN", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        
              },
              onResourceDetailsLoad: async function (oEvent1) {
        
                const { id } = oEvent1.getParameter("arguments");
        
                this.ID = id;
        
              },
            Onpressback0: async function () {
                var oRouter = this.getOwnerComponent().getRouter();
        
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
        
                    MessageToast.show("User does not exist");
        
                  }
        
                });
              },
            Onpresssubmit: function () {
    
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(true);
               
    
            },
            Onpressback1: function () {
    
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
              
    
    
                
    
            },
            onHUListPress:function () {
    
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(true);
               
             
            },
            Onpressback2:function(){
                
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
               
                
                
            },
            onNewHUPress:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
               
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
    
             
            },
            Onpressback3:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
               
            },
            onNextEnterpress:function(){
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(true);
               
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
               
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            },
            Onpressback4:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
               
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
    
             
            
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            },
            onGRPress:function(){
                this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
               
    
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
    
            },
            Onpressback5:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(false);
                
               
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
              
    
            
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            },
            onUnloadPress:function(){
                this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page7ReceiveHUbyASN_RHUASN").setVisible(true);
    
               
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
    
            },
    
            Onpressback6:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page7ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(false);
               
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
             
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
    
            
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            },
        });
    });
