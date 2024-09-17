sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.WTQueryByWO", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            const oTable = this.getView().byId("idWtQBWoWhTable");
            oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));  
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onWtQBWofirstBackBtnPress:async function(){
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
        onWtQBWoWhLiveChange:function(){
           
                this.getView().byId("idWtQBWoFirstSC").setVisible(false);
                this.getView().byId("idWtQBWoWhSecondsc").setVisible(true);
                var oWHO=this.getView().byId("idWtQBWoWhInput").getValue();
                this.getView().byId("idWtQBWoWh2Input").setValue(oWHO);
                this.getView().byId("idWtQBWoWh2Input").setEditable(false);
                this.getView().byId("idWtQBWofirstbackbtn").setVisible(false);
                this.getView().byId("idWtQBWoSecondbackbtn").setVisible(true);
            
        },
 
        onWtQBWoSecondBackBtnPress:function(){
            this.getView().byId("idWtQBWoFirstSC").setVisible(true);
            this.getView().byId("idWtQBWoWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWofirstbackbtn").setVisible(true);
            this.getView().byId("idWtQBWoSecondbackbtn").setVisible(false);
        },
        onBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBWoWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBWoSecondbackbtn").setVisible(false);
        },
 
        onWtQBWoThirdBackBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBWoWhSecondsc").setVisible(true);
            this.getView().byId("idWtQBWoSecondbackbtn").setVisible(true);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
             
        },
        onWtQBWoDetailBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBWoWhFourthsc").setVisible(true);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
            this.getView().byId("idWtQBWoFourthbackbtn").setVisible(true);
           
        },
        onWtQBWoFourthBackBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBWoWhFourthsc").setVisible(false);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBWoFourthbackbtn").setVisible(false);
           
        },
        onWtQBWoOpenBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBWoWhFifthsc").setVisible(true);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
            this.getView().byId("idWtQBWoFifthbackbtn").setVisible(true);
        },
        onWtQBWoFifthBackBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBWoWhFifthsc").setVisible(false);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBWoFifthbackbtn").setVisible(false)
        },
        onWtQBWoConfBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBWoWhSixthsc").setVisible(true);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
            this.getView().byId("idWtQBWoSixththbackbtn").setVisible(true);
        },
        onWtQBWoSixthBackBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBWoWhSixthsc").setVisible(false);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBWoSixththbackbtn").setVisible(false)
        },
        onRowDoubleClick: function (oEvent) {
       
            var oTable = this.getView().byId("idWtQBWoWhTable");
            var oSelectedItem = oTable.getSelectedItem();
           
            if (oSelectedItem) {
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBWoWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBWoSecondbackbtn").setVisible(false);
            }
        },
        onWtQBWoAllBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBWoWhSeventhsc").setVisible(true);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(false);
            this.getView().byId("idWtQBWoSevenththbackbtn").setVisible(true);
        },
       
        onWtQBWoSeventhBackBtnPress:function(){
            this.getView().byId("idWtQBWoWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBWoWhSeventhsc").setVisible(false);
            this.getView().byId("idWtQBWoThirdbackbtn").setVisible(true);
            this.getView().byId("idWtQBWoSevenththbackbtn").setVisible(false);
        }
 
      });
    }
  );
 
 