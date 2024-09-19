sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.WTQueryByQueue", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onWtQBQueuefirstBackBtnPress:async function(){
            var oRouter = UIComponent.getRouterFor(this);
            var oModel1 = this.getOwnerComponent().getModel();
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                success: function (oData) {
                    let oUser=oData.Users.toLowerCase()
                    if(oUser ===  "resource"){
                        oRouter.navTo("RouteResourcePage",{id:this.ID});
                    }
                    else{
                    oRouter.navTo("Supervisor",{id:this.ID});
                }
                }.bind(this),
                error: function () {
                    MessageToast.show("User does not exist");
                }
            });
        },
        onWtQBQueueWhLiveChange:function(){
           
                this.getView().byId("idWtQBQueueFirstSC").setVisible(false);
                this.getView().byId("idWtQBQueueWhThirdsc").setVisible(true);
                
                this.getView().byId("idWtQBQueuefirstbackbtn").setVisible(false);
                this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(true);
            
        },
 
       
 
        onWtQBQueueThirdBackBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBQueueFirstSC").setVisible(true);
            this.getView().byId("idWtQBQueuefirstbackbtn").setVisible(true);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(false);
             
        },
        onWtQBQueueDetailBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBQueueWhFourthsc").setVisible(true);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(false);
            this.getView().byId("idWtQBQueueFourthbackbtn").setVisible(true);
           
        },
        onWtQBQueueFourthBackBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBQueueWhFourthsc").setVisible(false);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBQueueFourthbackbtn").setVisible(false);
           
        },
        onWtQBQueueOpenBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBQueueWhFifthsc").setVisible(true);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(false);
            this.getView().byId("idWtQBQueueFifthbackbtn").setVisible(true);
        },
        onWtQBQueueFifthBackBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBQueueWhFifthsc").setVisible(false);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBQueueFifthbackbtn").setVisible(false)
        },
        onWtQBQueueConfBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBQueueWhSixthsc").setVisible(true);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(false);
            this.getView().byId("idWtQBQueueSixththbackbtn").setVisible(true);
        },
        onWtQBQueueSixthBackBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBQueueWhSixthsc").setVisible(false);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBQueueSixththbackbtn").setVisible(false)
        },
        onRowDoubleClick: function (oEvent) {
       
            var oTable = this.getView().byId("idWtQBQueueWhTable");
            var oSelectedItem = oTable.getSelectedItem();
           
            if (oSelectedItem) {
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBQueueWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBQueueSecondbackbtn").setVisible(false);
            }
        },
        onWtQBQueueAllBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBQueueWhSeventhsc").setVisible(true);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(false);
            this.getView().byId("idWtQBQueueSevenththbackbtn").setVisible(true);
        },
       
        onWtQBQueueSeventhBackBtnPress:function(){
            this.getView().byId("idWtQBQueueWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBQueueWhSeventhsc").setVisible(false);
            this.getView().byId("idWtQBQueueThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBQueueSevenththbackbtn").setVisible(false);
        }
 
      });
    }
  );
 
 