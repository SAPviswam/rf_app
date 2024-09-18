sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.ManuallyRepackAllHUItems", {
        onInit: function() {
        },
        onValueLiveChange:function(){
            this.getView().byId("idManuallyRepackHUFirstSC").setVisible(false);
            this.getView().byId("idManuallyRepackHUSecSC").setVisible(true);
            this.getView().byId("idManuallyRepackHUfirstbackbtn").setVisible(false);
            this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(true);

    },
    onManuallyRepackHUSecondBackBtnPress:function(){
        this.getView().byId("idManuallyRepackHUFirstSC").setVisible(true);
        this.getView().byId("idManuallyRepackHUSecSC").setVisible(false);
        this.getView().byId("idManuallyRepackHUfirstbackbtn").setVisible(true);
        this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(false);

},
      });
    }
  );