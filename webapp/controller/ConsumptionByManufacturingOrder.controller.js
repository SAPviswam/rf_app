sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.ConsumptionByManufacturingOrder", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onConsumptionByManufacturingOrderfirstBackBtnPress:async function(){
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
        onLiveManuFordinConsumptionByManufacturingOrderValidation: function () {
            this.getView().byId("idConsumptionByManufacturingOrderFirstSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderSecondSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderfirstbackbtn").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderSecondbackbtn").setVisible(true);
        },
        onConsumptionByManufacturingOrderSecondBackBtnPress:function (){
            this.getView().byId("idConsumptionByManufacturingOrderFirstSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderSecondSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderfirstbackbtn").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderSecondbackbtn").setVisible(false);

        },
        onPressliveChangeHuBinInSecondinCBMO:function (){
            this.getView().byId("idConsumptionByManufacturingOrderThirdSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderSecondSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderThirdbackbtn").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderSecondbackbtn").setVisible(false);

        },
        onConsumptionByManufacturingOrderThirdBackBtnPress:function (){
            this.getView().byId("idConsumptionByManufacturingOrderThirdSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderSecondSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderThirdbackbtn").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderSecondbackbtn").setVisible(true);

        },
        onPressliveChangeProductThirdScinCBMO:function (){
            this.getView().byId("idConsumptionByManufacturingOrderThirdSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderFourthSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderThirdbackbtn").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderFourthbackbtn").setVisible(true);

        },
        onPressliveChangeBatchFourthScinCBMO:function (){
            this.getView().byId("idConsumptionByManufacturingOrderFifthSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFourthSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderFifthbackbtn").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFourthbackbtn").setVisible(false);

        },
        onConsumptionByManufacturingOrderFourthBackBtnPress:function (){
            this.getView().byId("idConsumptionByManufacturingOrderThirdSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFourthSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderThirdbackbtn").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFourthbackbtn").setVisible(false);

        },
        onPressliveChangeSetRemainingQtyFifthScinCBMO:function (){
            this.getView().byId("idConsumptionByManufacturingOrderSixthSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFifthSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderSixthbackbtn").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFifthbackbtn").setVisible(false);

        },
        onConsumptionByManufacturingOrderFifthBackBtnPress:function (){
            this.getView().byId("idConsumptionByManufacturingOrderFifthSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderFourthSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFourthbackbtn").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFifthbackbtn").setVisible(false);

        },
        onConsumptionByManufacturingOrderSixthBackBtnPress:function (){
            this.getView().byId("idConsumptionByManufacturingOrderSixthSC").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderFifthSC").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderSixthbackbtn").setVisible(false);
            this.getView().byId("idConsumptionByManufacturingOrderFifthbackbtn").setVisible(true);
            this.getView().byId("idConsumptionByManufacturingOrderFourthbackbtn").setVisible(false);

        },
        onPressliveChangeRemainingQtySixthScinCBMO:function (){ 
        this.getView().byId("idConsumptionByManufacturingOrderSixthSC").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderSeventhSC").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderSixthbackbtn").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderSeventhbackbtn").setVisible(true);
      

    },
    onPressliveChangeOperSeventhScinCBMO:function (){ 
        this.getView().byId("idConsumptionByManufacturingOrderEigthSC").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderSeventhSC").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderEigthbackbtn").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderSeventhbackbtn").setVisible(false);


    },
    onConsumptionByManufacturingOrderSeventhBackBtnPress:function () {
        this.getView().byId("idConsumptionByManufacturingOrderSixthSC").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderSeventhSC").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderSixthbackbtn").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderSeventhbackbtn").setVisible(false);

    },
    onPressliveChangeItemNoEigthScinCBMO:function (){ 
        this.getView().byId("idConsumptionByManufacturingOrderEigthSC").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderNigthSC").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderEigthbackbtn").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderNigthbackbtn").setVisible(true);
        //this.getView().byId("idConsumptionByManufacturingOrderFourthbackbtn").setVisible(false);

    },
    onConsumptionByManufacturingOrderEigthBackBtnPress:function (){ 
        this.getView().byId("idConsumptionByManufacturingOrderEigthSC").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderSeventhSC").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderEigthbackbtn").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderSeventhbackbtn").setVisible(true);

    },
    onPressliveChangeStocktypeNigthScinCBMO:function (){ 
        this.getView().byId("idConsumptionByManufacturingOrderTengthSC").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderNigthSC").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderTengthbackbtn").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderNigthbackbtn").setVisible(false);

    },
    onConsumptionByManufacturingOrderNigthBackBtnPress:function (){ 
        this.getView().byId("idConsumptionByManufacturingOrderEigthSC").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderNigthSC").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderEigthbackbtn").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderNigthbackbtn").setVisible(false);

    },
    onConsumptionByManufacturingOrderTengthBackBtnPress:function (){ 
        this.getView().byId("idConsumptionByManufacturingOrderTengthSC").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderNigthSC").setVisible(true);
        this.getView().byId("idConsumptionByManufacturingOrderTengthbackbtn").setVisible(false);
        this.getView().byId("idConsumptionByManufacturingOrderNigthbackbtn").setVisible(true);
    },
      });
    }
  );
 
 