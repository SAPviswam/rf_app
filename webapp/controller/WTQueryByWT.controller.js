sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.WTQueryByWT", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onPressFirstBackButton:async function(){
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
        onWtQBWtWhLiveChange:function(oEvent){
            var oInput = oEvent.getSource();
            var oHuValue = oInput.getValue().trim();

            if (oHuValue) {
                // Call OData service to validate the HU value
                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                oModel.read(`/WarehouseTaskNewSet('${oHuValue}')`, {
                   
                    success: function (odata) {
                        // If HU exists, show icon2 and hide icon1
                        that.getView().byId("idWtQBWtFirstSC").setVisible(false);
                that.getView().byId("idWtQBWtWhSecondsc").setVisible(true);
                // that.getView().byId("idWtQBWtfirstbackbtn").setVisible(false);
                // that.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
                        // Optionally, you can also populate fields here based on the result
                        that.getView().byId("idWtQBWtwtInput").setValue(odata.Tanum);
                        that.getView().byId("idWtQBWtWTitInput").setValue(odata.Tapos);
                        that.getView().byId("idWtQBWtwtsInput").setValue(odata.Numwt);
                        that.getView().byId("idWtQBWtStsInput").setValue(odata.Tostat);
                        that.getView().byId("idWtQBWtPtypInput").setValue(odata.Procty);
                        that.getView().byId("idWtQBWtSproInput").setValue(odata.Prces);
                        that.getView().byId("idWtQBWtActyInput").setValue(odata.ActType);
                        that.getView().byId("idWtQBWtProInput").setValue(odata.Matnr);
                        that.getView().byId("idWtQBWtProEmpInput").setValue(odata.HazmatInd);
                        that.getView().byId("idWtQBWtSbinInput").setValue(odata.Vlpla);
                        that.getView().byId("idWtQBWtSbinEmpInput").setValue(odata.Vlenr);
                        that.getView().byId("idWtQBWtDbinInput").setValue(odata.Nlpla);
                        that.getView().byId("idWtQBWtDbinEmpInput").setValue(odata.Nlenr);
                        that.getView().byId("idWtQBWtCdatInput").setValue(odata.ConfD);
                        that.getView().byId("idWtQBWtCdatnput").setValue(odata.ConfT.ms);
                        that.getView().byId("idWtQBWtCusrInput").setValue(odata.ConfBy);
                        
                    },
                    error: function (oError) {
                        // Show error message if HU is not found 
                    }
                });
            } else {
                
                
            }
                this.getView().byId("idWtQBWtFirstSC").setVisible(false);
                this.getView().byId("idWtQBWtWhSecondsc").setVisible(true);
                // this.getView().byId("idWtQBWtfirstbackbtn").setVisible(false);
                // this.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
            
        },
        onPressSecondBackButton:function(){
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWtFirstSC").setVisible(true);
            // this.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
            // this.getView().byId("idWtQBWtfirstbackbtn").setVisible(true);
           
        },
        onWtQBWtDetailBtnPress:function(){
            
            var oHuValue = this.getView().byId("idWtQBWtwtInput").getValue()

            if (oHuValue) {
                // Call OData service to validate the HU value
                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                oModel.read(`/WarehouseTaskNewSet('${oHuValue}')`, {
                   
                    success: function (odata) {
                        // If HU exists, show icon2 and hide icon1
                        that.getView().byId("idWtQBWtWhSecondsc").setVisible(false);
                        that.getView().byId("idWtQBWtWhThirdsc").setVisible(true);
                        // that.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
                        // that.getView().byId("idWtQBWtThirdbackbtn").setVisible(true);
                        // Optionally, you can also populate fields here based on the result
                        that.getView().byId("idWtQBWtProductDiscriptioInput").setValue(odata.Maktx);
                        that.getView().byId("idWtQBWtwoInput").setValue(odata.Who);
                        that.getView().byId("idWtQBWtOwnerInput").setValue(odata.Owner);
                        that.getView().byId("idWtQBWtPEntInput").setValue(odata.Entitled);
                        that.getView().byId("idWtQBWtHTypeInput").setValue(odata.Letyp);
                        that.getView().byId("idWtQBWtWhHuInput").setValue(odata.Vlenr);
                        that.getView().byId("idWtQBWtEstpInput").setValue(odata.Procs);
                        that.getView().byId("idWtQBWtSqtyInput").setValue(odata.Vsola);
                        that.getView().byId("idWtQBWtPcInput").setValue(odata.Altme)
                        
                    },
                    error: function (oError) {
                        // Show error message if HU is not found 
                    }
                });
            } else {
                
                
            }
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWtWhThirdsc").setVisible(true);
            // this.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
            // this.getView().byId("idWtQBWtThirdbackbtn").setVisible(true);
           
        },
        onPressThirdBackButton:function(){
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(true);
            this.getView().byId("idWtQBWtWhThirdsc").setVisible(false);
            // this.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
            // this.getView().byId("idWtQBWtThirdbackbtn").setVisible(false);
           
        },
    
 
      });
    }
  );
 
 