sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
         "sap/ui/core/UIComponent"
    ],
    function(BaseController,MessageToast,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.CreateConfirmAdhocProduct", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad:function(oEvent1){
            var that = this;
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
            console.log(this.ID);
        },

        onProductLiveChange:function(){
        //   if(this.getView().byId("idProductInput").getValue()=="800020"){
           this.getView().byId("idInitialProductPage").setVisible(false)
           this.getView().byId("idsecondProductPage").setVisible(true)
           var ohu=this.getView().byId("idProductInput").getValue();
           this.getView().byId("idproductInput1").setValue(ohu)
           this.getView().byId("idproductInput1").setEditable(false);
           this.getView().byId("idProductfirstbackbtn").setVisible(true);
           this.getView().byId("idProdutSecondbackbtn").setVisible(false);
           this.getView().byId("idInitialAdhocProductbackbtn").setVisible(false);
           
        //   }
        //   else{
        //       MessageToast.show("please enter valid Product Number")
        //   }
      },
      onProductSrcLiveChange:function(){
        //   if(this.getView().byId("idProductsrcBinInput").getValue()=="12345"){
              this.getView().byId("idthirdProductPage").setVisible(true);
              this.getView().byId("idsecondProductPage").setVisible(false);
              var ohu=this.getView().byId("idProductInput").getValue();
              this.getView().byId("idProductInput2").setValue(ohu)
              this.getView().byId("idProductInput2").setEditable(false);
              var oSrcBin=this.getView().byId("idProductsrcBinInput").getValue();
              this.getView().byId("idProductSrcBinInput2").setValue(oSrcBin)
              this.getView().byId("idProductSrcBinInput2").setEditable(false);
              this.getView().byId("idProdutSecondbackbtn").setVisible(true);
              this.getView().byId("idProductfirstbackbtn").setVisible(false);
              this.getView().byId("idInitialAdhocProductbackbtn").setVisible(false);

        //   }
        //   else{
        //       MessageToast.show("please enter valid Source Bin number")
        //   }
      },
      onProductfirstBackBtnPress:function(){
          this.getView().byId("idInitialProductPage").setVisible(true);
          this.getView().byId("idsecondProductPage").setVisible(false);
          this.getView().byId("idProductfirstbackbtn").setVisible(false);
          this.getView().byId("idInitialAdhocProductbackbtn").setVisible(true);
      },
      onProductSecondBackBtnPress:function(){
          this.getView().byId("idsecondProductPage").setVisible(true);
          this.getView().byId("idthirdProductPage").setVisible(false); 
          this.getView().byId("idInitialProductPage").setVisible(false);
          this.getView().byId("idProductfirstbackbtn").setVisible(true);
          this.getView().byId("idProdutSecondbackbtn").setVisible(false)
      },
      onInitialAdhocProductBackBtnPress:async function(){
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
      
      });
    }
  );
  