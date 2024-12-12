sap.ui.define(
  [
      "./BaseController",
      "sap/ui/core/UIComponent"
  ],
  function(BaseController,UIComponent) {
    "use strict";

    return BaseController.extend("com.app.rfapp.controller.ManuallyRepackAllHUItems", {
      onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
      },
      onResourceDetailsLoad: async function (oEvent1) {
          const { id,idI } = oEvent1.getParameter("arguments");
              this.ID = id;
              this.IDI = idI;
      },
      
      onAvatarPressed: function (oEvent) {     
        this.onPressAvatarEveryTileHelperFunction(oEvent); 
        },
    onSignoutPressed:function(){
            var oRouter = this.getOwnerComponent().getRouter(this);
            oRouter.navTo("InitialScreen", { Userid:this.IDI }); 
        }, 

      onManuallyRepackAllHUItemsfirstBackBtnPress:async function(){
          var oRouter = UIComponent.getRouterFor(this);
          var oModel1 = this.getOwnerComponent().getModel();
          var that=this;
          await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
              success: function (oData) {
                  let oUser=oData.Users.toLowerCase()
                  if(oUser ===  "resource"){
                      oRouter.navTo("RouteResourcePage",{id:this.ID,idI:that.IDI});
                  }
                  else{
                  oRouter.navTo("Supervisor",{id:this.ID,idI:that.IDI});
              }
              }.bind(this),
              error: function () {
                  MessageToast.show("User does not exist");
              }
          });
         
      },
      onValueLiveChange:function(){
              this.getView().byId("idManuallyRepackAllHUItemsFirstSC").setVisible(false);
              this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(true);
              this.getView().byId("idManuallyRepackAllHUItemsfirstbackbtn").setVisible(false);
              this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(true);

      },

      onManuallyRepackAllHUItemsSecondBackBtnPress:function(){
          this.getView().byId("idManuallyRepackAllHUItemsFirstSC").setVisible(true);
          this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(false);
          this.getView().byId("idManuallyRepackAllHUItemsfirstbackbtn").setVisible(true);
          this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(false);

  },
  onPressHuCreateInManuvallyRepackHUBtn: function () {
     
      this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(false);
      this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(false);
      this.getView().byId("idManuallyRepackAllHUItemsFirstSC").setVisible(true);
      this.getView().byId("idManuallyRepackAllHUItemsfirstbackbtn").setVisible(true);

  },
  onManuallyRepackAllHUItemsThirdBackBtnPress : function(){
 
      this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(true);
      this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(true);
      this.getView().byId("idManuallyRepackAllHUItemsThirdSC").setVisible(false);
      this.getView().byId("idManuallyRepackAllHUItemsThirdbackbtn").setVisible(false);

},
onPressHuOverviewBtnPress : function () {
  this.getView().byId("idManuallyRepackAllHUItemsFifthSC").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsFifthbackbtn").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(false);
},
onManuallyRepackAllHUItemsFourthBackBtnPress : function () {
  this.getView().byId("idManuallyRepackAllHUItemsThirdSC").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsThirdbackbtn").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsFourthSC").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsFourthbackbtn").setVisible(false);

},
onManuallyRepackAllHUItemsFifthBackBtnPress : function () {
  this.getView().byId("idManuallyRepackAllHUItemsFifthSC").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsFifthbackbtn").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(true);
},
onHuItemListBtnPress: function () {
  this.getView().byId("idManuallyRepackAllHUItemsSixthSC").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsSixththbackbtn").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(false);

},
onManuallyRepackAllHUItemsSixthBackBtnPress : function () {
  this.getView().byId("idManuallyRepackAllHUItemsSixthSC").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsSixththbackbtn").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(true);


},
onDestHUValueEnter : function () {
  this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsThirdSC").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsThirdbackbtn").setVisible(true);


},
onValueLiveChangeDestThird:function () {
  this.getView().byId("idManuallyRepackAllHUItemsThirdSC").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsThirdbackbtn").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsFourthSC").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsFourthbackbtn").setVisible(true);


},
onPressSaveInManuvallyRepackHUBtn:function () {
  this.getView().byId("idManuallyRepackAllHUItemsSecSC").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsSecondbackbtn").setVisible(true);
  this.getView().byId("idManuallyRepackAllHUItemsFourthSC").setVisible(false);
  this.getView().byId("idManuallyRepackAllHUItemsFourthbackbtn").setVisible(false);


},
    });
  
  }
);