sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.ManuallyRepackHU", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onManuallyRepackHUfirstBackBtnPress:async function(){
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
    onPressHuCreateInManuvallyRepackHUBtn: function () {
       
        this.getView().byId("idManuallyRepackHUSecSC").setVisible(false);
        this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(false);
        this.getView().byId("idManuallyRepackHUFirstSC").setVisible(true);
        this.getView().byId("idManuallyRepackHUfirstbackbtn").setVisible(true);

    },
    onManuallyRepackHUThirdBackBtnPress : function(){
   
        this.getView().byId("idManuallyRepackHUSecSC").setVisible(true);
        this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(true);
        this.getView().byId("idManuallyRepackHUThirdSC").setVisible(false);
        this.getView().byId("idManuallyRepackHUThirdbackbtn").setVisible(false);

},
onPressHuOverviewBtnPress : function () {
    this.getView().byId("idManuallyRepackHUFifthSC").setVisible(true);
    this.getView().byId("idManuallyRepackHUFifthbackbtn").setVisible(true);
    this.getView().byId("idManuallyRepackHUSecSC").setVisible(false);
    this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(false);
},
onManuallyRepackHUFourthBackBtnPress : function () {
    this.getView().byId("idManuallyRepackHUThirdSC").setVisible(true);
    this.getView().byId("idManuallyRepackHUThirdbackbtn").setVisible(true);
    this.getView().byId("idManuallyRepackHUFourthSC").setVisible(false);
    this.getView().byId("idManuallyRepackHUFourthbackbtn").setVisible(false);

},
onManuallyRepackHUFifthBackBtnPress : function () {
    this.getView().byId("idManuallyRepackHUFifthSC").setVisible(false);
    this.getView().byId("idManuallyRepackHUFifthbackbtn").setVisible(false);
    this.getView().byId("idManuallyRepackHUSecSC").setVisible(true);
    this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(true);
},
onHuItemListBtnPress: function () {
    this.getView().byId("idManuallyRepackHUSixthSC").setVisible(true);
    this.getView().byId("idManuallyRepackHUSixththbackbtn").setVisible(true);
    this.getView().byId("idManuallyRepackHUSecSC").setVisible(false);
    this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(false);

},
onManuallyRepackHUSixthBackBtnPress : function () {
    this.getView().byId("idManuallyRepackHUSixthSC").setVisible(false);
    this.getView().byId("idManuallyRepackHUSixththbackbtn").setVisible(false);
    this.getView().byId("idManuallyRepackHUSecSC").setVisible(true);
    this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(true);


},
onDestHUValueEnter : function () {
    this.getView().byId("idManuallyRepackHUSecSC").setVisible(false);
    this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(false);
    this.getView().byId("idManuallyRepackHUThirdSC").setVisible(true);
    this.getView().byId("idManuallyRepackHUThirdbackbtn").setVisible(true);


},
onValueLiveChangeDestThird:function () {
    this.getView().byId("idManuallyRepackHUThirdSC").setVisible(false);
    this.getView().byId("idManuallyRepackHUThirdbackbtn").setVisible(false);
    this.getView().byId("idManuallyRepackHUFourthSC").setVisible(true);
    this.getView().byId("idManuallyRepackHUFourthbackbtn").setVisible(true);


},
onPressSaveInManuvallyRepackHUBtn:function () {
    this.getView().byId("idManuallyRepackHUSecSC").setVisible(true);
    this.getView().byId("idManuallyRepackHUSecondbackbtn").setVisible(true);
    this.getView().byId("idManuallyRepackHUFourthSC").setVisible(false);
    this.getView().byId("idManuallyRepackHUFourthbackbtn").setVisible(false);


},
      });
    
    }
  );