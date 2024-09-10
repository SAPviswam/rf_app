sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.StockBinQueryByProduct", {
        onInit: function() {
        },
        onSBQPfirstBackBtnPress:function(){
           
        },

        onSBQProductLiveChange:function(){
            if(this.getView().byId("idSBQProductInput").getValue()=="800020"){
            this.getView().byId("idSBQPFirstSC").setVisible(false);
            this.getView().byId("idSBQPsecondSC").setVisible(true);
            this.getView().byId("onSBQPfirstBackBtnPress").setVisible(false);
            this.getView().byId("onSBQPSecondBackBtnPress").setVisible(true);
            }

        }
      });
    }
  );
  