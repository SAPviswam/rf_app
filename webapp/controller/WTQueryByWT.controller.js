sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.WTQueryByWT", {
        onInit: function() {
           
        },
        onWtQBWtfirstBackBtnPress:function(){
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Supervisor");
        },
        onWtQBWtWhLiveChange:function(){
           
                this.getView().byId("idWtQBWtFirstSC").setVisible(false);
                this.getView().byId("idWtQBWtWhSecondsc").setVisible(true);
                this.getView().byId("idWtQBWtfirstbackbtn").setVisible(false);
                this.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
            
        },
        onWtQBWtSecondBackBtnPress:function(){
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWtFirstSC").setVisible(true);
            this.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
            this.getView().byId("idWtQBWtfirstbackbtn").setVisible(true);
           
        },
        onWtQBWtDetailBtnPress:function(){
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWtWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
            this.getView().byId("idWtQBWtThirdbackbtn").setVisible(true);
           
        },
        onWtQBWtThirdBackBtnPress:function(){
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(true);
            this.getView().byId("idWtQBWtWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
            this.getView().byId("idWtQBWtThirdbackbtn").setVisible(false);
           
        },
    
 
      });
    }
  );
 
 