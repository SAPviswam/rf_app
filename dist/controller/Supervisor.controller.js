sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/Device","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/core/UIComponent","sap/ui/core/BusyIndicator"],function(e,t,s,a,r,o){"use strict";return e.extend("com.app.rfapp.controller.Supervisor",{onInit:function(){this.chekBoxName=[];this.bOtpVerified=true;this.bCreate=true;var e=new s(sap.ui.require.toUrl("com/app/rfapp/model/data1.json"));this.getView().setModel(e);var a=this.getOwnerComponent().getModel();this.getView().byId("pageContainer").setModel(a);const r=this.getOwnerComponent().getRouter();r.attachRoutePatternMatched(this.onSupervisorDetailsLoad,this);this._isThemeMode=false;this.Themecall=false;if(t.system.desktop){this.byId("idRequestedData").setWidth("1400px");this.byId("idUserDataTable").setWidth("2200px")}else if(t.system.tablet){this.byId("idRequestedData").setWidth("3500px");this.byId("idUserDataTable").setWidth("2200px")}else if(t.system.phone){this.byId("idRequestedData").setWidth("600px");this.byId("idUserDataTable").setWidth("3500px")}},onSupervisorDetailsLoad:async function(e){const{id:t}=e.getParameter("arguments");this.ID=t},onTilePress:function(e){var t=e.getSource();if(t instanceof sap.m.Button){e.stopPropagation()}else{this.onTilePressPutawayByWO(e)}},onPaletteIconPress:function(e){this._currentTileId=e.getSource().getParent().getParent().getId();this.byId("themeTileDialog").open();e.stopPropagation()},onAfterRendering:function(){var e=localStorage.getItem("themeColor");if(e){this.applyThemeColor(e)}var t=JSON.parse(localStorage.getItem("tileColors")||"{}");for(var s in t){var a=t[s];var r=this._extractLocalId(s);var o=this.byId(r);if(o){(function(e,t){e.addEventDelegate({onAfterRendering:function(){var s=e.getDomRef();if(s){s.style.backgroundColor=t}}})})(o,a)}else{console.warn("Tile with ID '"+r+"' not found.")}}},_extractLocalId:function(e){var t=e.split("--");return t.length>1?t[t.length-1]:e},onOpenThemeDialog:function(){this.byId("themeTileDialog").open()},onApplyColor:function(){var e=this.getView();var t=e.byId("colorPicker");var s=t.getColorString();var a=[];var r=this.byId("colorOptions").getItems();r.forEach(function(e){if(e instanceof sap.m.CheckBox&&e.getSelected()){var t=e.getCustomData()[0].getValue();a.push(t)}});if(a.length>0){if(a.length>1){sap.m.MessageToast.show("You can only select one color.");return}if(t.getVisible()){sap.m.MessageToast.show("Please deselect the checkbox before using the custom color picker.");return}var o=a[0];if(this._currentTileId){this.applyColorToTile(this._currentTileId,o);sap.m.MessageToast.show("Tile color applied successfully!");this._currentTileId=null}else{this.applyThemeColor(o);sap.m.MessageToast.show("Theme color applied successfully!")}}else if(this._isValidColor(s)){if(this._currentTileId){this.applyColorToTile(this._currentTileId,s);sap.m.MessageToast.show("Tile color applied successfully!");this._currentTileId=null}else{this.applyThemeColor(s);sap.m.MessageToast.show("Theme color applied successfully!")}}else{sap.m.MessageToast.show("Invalid color format. Please use a valid color code.")}this.resetDialogBox();this.byId("themeTileDialog").close()},onColorOptionSelect:function(e){var t=e.getSource();var s=this.byId("colorOptions").getItems();s.forEach(function(e){if(e instanceof sap.m.CheckBox&&e!==t){e.setSelected(false)}});this.byId("colorPicker").setVisible(!t.getSelected())},applyThemeColor:function(e){var t=[this.byId("idSideNavigation"),this.byId("idToolHeader"),this.byId("pageContainer")];var s="customThemeStyle";var a=document.getElementById(s);if(a){a.remove()}var r=document.createElement("style");r.id=s;r.textContent=".customTheme { background-color: "+e+" !important; }";document.head.appendChild(r);t.forEach(function(e){if(e){e.addStyleClass("customTheme")}});localStorage.setItem("themeColor",e)},applyColorToTile:function(e,t){var s=this.byId(e);if(!s)return;var a=s.getDomRef();if(a){a.style.backgroundColor="";a.style.backgroundColor=t;var r=JSON.parse(localStorage.getItem("tileColors")||"{}");r[e]=t;localStorage.setItem("tileColors",JSON.stringify(r))}},_isValidColor:function(e){var t=/^#([0-9A-Fa-f]{3}){1,2}$/;var s=/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/;return t.test(e)||s.test(e)},onCancelColorDialog:function(){this.byId("themeTileDialog").close();this.resetDialogBox()},resetDialogBox:function(){var e=this.getView();var t=e.byId("colorPicker");var s=this.byId("colorOptions").getItems();s.forEach(function(e){if(e instanceof sap.m.CheckBox){e.setSelected(false)}});t.setColorString("#FFFFFF");t.setVisible(true)},onPressLanguageChangeApp:function(){var e=this.byId("idLanguageSelectorComboBox");var t=e.getVisible();e.setVisible(!t)},onRefreshRequestedData:function(){this.onRequestedData();this.onUserData()},onRequestedData:function(){var e=this.byId("idRequestedData");if(e){var t=e.getBinding("items");if(t){t.refresh()}}},onUserData:function(){var e=this.byId("idUserDataTable");if(e){var t=e.getBinding("items");if(t){t.refresh()}}},onItemSelect:function(e){var t=e.getParameter("item");this.byId("pageContainer").to(this.getView().createId(t.getKey()));this.onSideNavButtonPress()},onSideNavButtonPress:function(){var e=this.byId("toolPage");var t=e.getSideExpanded();this._setToggleButtonTooltip(t);e.setSideExpanded(!e.getSideExpanded())},_setToggleButtonTooltip:function(e){var t=this.byId("sideNavigationToggleButton");if(e){t.setTooltip("Large Size Navigation")}else{t.setTooltip("Small Size Navigation")}},onApproveUserBtnPress:async function(){debugger;var e=this.byId("idRequestedData").getSelectedItem().mAggregations;var t=e.cells[5].mProperties.hasSelection;var s=e.cells[6].mProperties.hasSelection;var r=e.cells[7].mProperties.hasSelection;var o=e.cells[5].mProperties.selectedKeys;var i=e.cells[6].mProperties.selectedKeys;var l=e.cells[7].mProperties.selectedKeys;if(t&&s&&r){this.onApproveforTable(o,i,l);return}else if(t&&!s){e.cells[6].setValueState(sap.ui.core.ValueState.Error);e.cells[6].setValueStateText("Please Select Group");return}else if(t&&s&&!r){e.cells[7].setValueState(sap.ui.core.ValueState.Error);e.cells[7].setValueStateText("Please Select Queue");return}var u=this.getView();if(this.byId("idRequestedData").getSelectedItems().length<1){a.show("Please Select atleast one Resource");return}else if(this.byId("idRequestedData").getSelectedItems().length>1){a.show("Please Select only one Resource");return}var n=this.byId("idRequestedData").getSelectedItem().getBindingContext().getObject();console.log(n);this.oApproveForm??=await this.loadFragment({name:"com.app.rfapp.fragments.ApproveDetails"});this.oApproveForm.open();if(n.Email){u.byId("idEmailInputF").setText(n.Email)}else{u.byId("idEmailInputF").setVisible(false);u.byId("idEmployeeEmailLabelF").setVisible(false)}u.byId("idEmployeeIDInputF").setText(n.Resourceid);u.byId("idNameInputF").setText(n.Resourcename);u.byId("idEmailInputF").setText(n.Email);u.byId("idPhoneInputF").setText(n.Phonenumber);u.byId("idRoesurcetypeInputF").setText(n.Resourcetype);var c=this.getOwnerComponent().getModel();c.read("/ProcessAreaSet",{success:function(e){var t=e.results;var s=new Set;t.forEach(function(e){s.add(e.Processarea)});var a=Array.from(s).map(function(e){return{Processarea:e}});var r=new sap.ui.model.json.JSONModel({ProcessAreas:a});var o=this.byId("idAreaSelect");if(!o){o=sap.ui.core.Fragment.byId("fragmentId","idAreaSelect")}if(o){o.setModel(r);o.bindItems({path:"/ProcessAreas",template:new sap.ui.core.Item({key:"{Processarea}",text:"{Processarea}"})})}else{console.error("MultiComboBox with id 'idAreaSelect' not found.")}this.onRequestedData();this.onUserData()}.bind(this),error:function(e){console.error("Error reading AreaSet:",e)}})},onClose:function(){this.oApproveForm.close()},onApprove:function(){debugger;var e=this.byId("idEmployeeIDInputF").getText();var t=this.byId("idNameInputF");var s=this.byId("idEmailInputF");var a=this.byId("idPhoneInputF");var r=this.byId("idRoesurcetypeInputF");var o=this.byId("idAreaSelect");var i=this.byId("idGroupSelect");var l=this.byId("idQueueSelect");var u=t.getText();var n=s.getText();var c=a.getText();var d=r.getText();var p=o.getSelectedKeys().join(",");var h=i.getSelectedKeys().join(",");var f=l.getSelectedKeys().join(",");var m=true;if(!u){t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Name is required.");m=false}else{t.setValueState(sap.ui.core.ValueState.None);t.setValueStateText("")}if(n){var g=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!g.test(n)){s.setValueState(sap.ui.core.ValueState.Error);s.setValueStateText("Invalid email format.");m=false}else{s.setValueState(sap.ui.core.ValueState.None);s.setValueStateText("")}}else{s.setValueState(sap.ui.core.ValueState.None);s.setValueStateText("")}if(!c){a.setValueState(sap.ui.core.ValueState.Error);a.setValueStateText("Phone number is required.");m=false}else if(a.length!==10||!/^\d+$/.test(a)){a.setValueState(sap.ui.core.ValueState.Error);a.setValueStateText("Mobile number must be a 10-digit numeric value")}else{a.setValueState(sap.ui.core.ValueState.None);if(this.bOtpVerified){sap.m.MessageToast.show("Please verify your phone number with the OTP before submitting.");return}}if(!d){r.setValueState(sap.ui.core.ValueState.Error);r.setValueStateText("Resource type is required.");m=false}else{r.setValueState(sap.ui.core.ValueState.None);r.setValueStateText("")}if(p.length===0){o.setValueState(sap.ui.core.ValueState.Error);o.setValueStateText("At least one area must be selected.");m=false}else{o.setValueState(sap.ui.core.ValueState.None);o.setValueStateText("")}if(h.length===0){i.setValueState(sap.ui.core.ValueState.Error);i.setValueStateText("At least one group must be selected.");m=false}else{i.setValueState(sap.ui.core.ValueState.None);i.setValueStateText("")}if(f.length===0){l.setValueState(sap.ui.core.ValueState.Error);l.setValueStateText("At least one queue must be selected.");m=false}else{l.setValueState(sap.ui.core.ValueState.None);l.setValueStateText("")}if(!m){sap.m.MessageToast.show("Please correct the errors before proceeding.");return}function S(){const e=/[A-Za-z@!#$%&]/;const t=8;let s="";for(let a=0;a<t;a++){let t="";while(!t.match(e)){t=String.fromCharCode(Math.floor(Math.random()*94)+33)}s+=t}return s}var v=S();var I=new Date;if(d==="Permanent Employee"){I.setFullYear(I.getFullYear()+1)}else if(d==="Contract Employee"){I.setMonth(I.getMonth()+2)}var b=new Date;var y=this.formatDate(b);var V=this.formatDate(I);var T={Area:p,Email:n,Notification:"your request has been Approved",Phonenumber:c,Queue:f,Resourcegroup:h,Resourceid:e,Resourcename:u,Resourcetype:d,Approveddate:y,Expirydate:V,Password:v,Status:"true",Loginfirst:true};var P=this.getOwnerComponent().getModel();P.update(`/RESOURCESSet('${e}')`,T,{success:function(){sap.m.MessageToast.show("Password updated successfully!");this.resetForm();this.onRequestedData();this.onUserData()}.bind(this),error:function(){sap.m.MessageToast.show("Error updating user login status.")}})},onApproveforTable:function(e,t,s){debugger;var a=this.byId("idRequestedData").getSelectedItem().mAggregations;var r=a.cells[0].mProperties.text;var o=a.cells[1].mProperties.text;var i=a.cells[3].mProperties.text;var l=a.cells[2].mProperties.text;var u=a.cells[4].mProperties.text;var n=e.join(",");var c=t.join(",");var d=s.join(",");function p(){const e=/[A-Za-z@!#$%&]/;const t=8;let s="";for(let a=0;a<t;a++){let t="";while(!t.match(e)){t=String.fromCharCode(Math.floor(Math.random()*94)+33)}s+=t}return s}var h=p();var f=new Date;if(l==="Permanent Employee"){f.setFullYear(f.getFullYear()+1)}else if(l==="Contract Employee"){f.setMonth(f.getMonth()+2)}var m=new Date;var g=this.formatDate(m);var S=this.formatDate(f);var v={Area:n,Email:u,Notification:"your request has been Approved",Phonenumber:i,Queue:d,Resourcegroup:c,Resourceid:r,Resourcename:o,Resourcetype:l,Approveddate:g,Expirydate:S,Password:h,Status:"true",Loginfirst:true};var I=this.getOwnerComponent().getModel();I.update(`/RESOURCESSet('${r}')`,v,{success:function(){sap.m.MessageToast.show("Password updated successfully!");this.onRequestedData();this.onUserData();this.oApproveForm.close()}.bind(this),error:function(){sap.m.MessageToast.show("Error updating user login status.")}})},_updateComboBoxItems:function(){var e=this.byId("_IDGenComboBox1");var t=this.getView().getModel();var s=t.getProperty("/ProcessAreaSet");var a=[];var r=new Set;s.forEach(function(e){if(!r.has(e.Processarea)){r.add(e.Processarea);a.push(e)}});var o=new sap.ui.model.json.JSONModel({ProcessAreaSet:a});e.setModel(o)},_fetchUniqueProcessAreas:function(){var e=this.getOwnerComponent().getModel();e.read("/ProcessAreaSet",{success:function(e){var t=e.results;var s=new Set;t.forEach(function(e){s.add(e.Processarea)});var a=Array.from(s).map(function(e){return{Processarea:e}});var r=new sap.ui.model.json.JSONModel({ProcessAreas:a});var o=this.byId("AreaSelect");if(!o){o=sap.ui.core.Fragment.byId("fragmentId","AreaSelect")}if(o){o.setModel(r);o.bindItems({path:"/ProcessAreas",template:new sap.ui.core.Item({key:"{Processarea}",text:"{Processarea}"})})}else{console.error("MultiComboBox with id 'AreaSelect' not found.")}}.bind(this),error:function(e){console.error("Error reading AreaSet:",e)}})},onRejectUserBtnPress:function(){var e=this.getView();var t=this.byId("idRequestedData").getSelectedItems();if(t.length!==1){a.show("Please select exactly one Resource");return}var s=t[0].getBindingContext().getObject();var r=s.Resourceid;var o=this.getOwnerComponent().getModel();o.remove("/RESOURCESSet('"+r+"')",{method:"DELETE",success:function(){a.show("Resource deleted successfully")},error:function(e){a.show("Error deleting resource");console.error("Error deleting resource:",e)}})},onPressCreateArea:function(){this.getView().byId("page1").setVisible(false);this.getView().byId("_IDGenTswfd_able1").setVisible(true)},formatDate:function(e){var t=e.getFullYear();var s=("0"+(e.getMonth()+1)).slice(-2);var a=("0"+e.getDate()).slice(-2);return`${t}-${s}-${a}`},resetForm:function(){this.byId("idEmppInput").setValue("");this.byId("idNameInput").setValue("");this.byId("idEmailInput").setValue("");this.byId("idPhoneInput").setValue("");this.byId("idRoesurcetypeInput").setValue("");this.byId("verficationIdicon").setVisible(false);this.byId("getotpsv").setVisible(false);this.byId("_IDGenComboBox10").setVisible(false);this.byId("GroupSelect").setVisible(false);this.byId("AreaSelect").setSelectedKeys([]);this.byId("GroupSelect").setSelectedKeys([]);this.byId("_IDGenComboBox10").setSelectedKeys([]);this.byId("idNameInput").setValueState(sap.ui.core.ValueState.None);this.byId("idEmailInput").setValueState(sap.ui.core.ValueState.None);this.byId("idPhoneInput").setValueState(sap.ui.core.ValueState.None);this.byId("idRoesurcetypeInput").setValueState(sap.ui.core.ValueState.None);this.byId("AreaSelect").setValueState(sap.ui.core.ValueState.None);this.byId("GroupSelect").setValueState(sap.ui.core.ValueState.None);this.byId("_IDGenComboBox10").setValueState(sap.ui.core.ValueState.None);this._queueSelectError=null;this._groupSelectError=null},onSelectProcesAarea:function(){debugger;var e=this.byId("idAreaSelect");var t=this.byId("idGroupSelect");this.onSelectFilterArea(e,t)},onSelectFilterArea:function(e,t){debugger;var s=e.getSelectedItems();var a=[];s.forEach(function(e){var t=e.getText();a.push(new sap.ui.model.Filter("Processarea",sap.ui.model.FilterOperator.EQ,t))});var r=new sap.ui.model.Filter({filters:a,and:false});var o=this.getOwnerComponent().getModel();o.read("/ProcessAreaSet",{filters:[r],success:function(e){var s=[];var a={};e.results.forEach(function(e){var t=e.Processgroup;if(!a[t]){a[t]=true;s.push({key:t,text:t})}});t.removeAllItems();s.forEach(function(e){t.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});t.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onRowSelect:function(e){var t=e.mParameters.selected;var s=e.getParameter("listItem");var a=this.getOwnerComponent().getModel();if(this._oPreviousSelectedItem&&this._oPreviousSelectedItem!==s){this._oPreviousSelectedItem.mAggregations.cells[5].setVisible(false);this._oPreviousSelectedItem.mAggregations.cells[5].setValue("");this._oPreviousSelectedItem.mAggregations.cells[6].setVisible(false);this._oPreviousSelectedItem.mAggregations.cells[7].setVisible(false)}if(t){if(s){var r=s.getBindingContext();s.mAggregations.cells[5].setVisible(true);a.read("/ProcessAreaSet",{success:function(e){var t=e.results;var a=new Set;t.forEach(function(e){a.add(e.Processarea)});var r=Array.from(a).map(function(e){return{Processarea:e}});var o=new sap.ui.model.json.JSONModel({ProcessAreas:r});var i=s.mAggregations.cells[5];if(!i){i=sap.ui.core.byId("idProcessAreaValue")}if(i){i.setModel(o);i.bindItems({path:"/ProcessAreas",template:new sap.ui.core.Item({key:"{Processarea}",text:"{Processarea}"})})}this.onRequestedData();this.onUserData();this._oPreviousSelectedItem=s}.bind(this),error:function(e){console.error("Error reading AreaSet:",e)}})}}else{if(s){s.mAggregations.cells[5].setValue("");s.mAggregations.cells[5].setVisible(false);s.mAggregations.cells[6].setVisible(false);s.mAggregations.cells[7].setVisible(false)}this._oPreviousSelectedItem=null}},onSelectTableProcesAarea:function(e){debugger;var t=this.byId("idRequestedData");var s=t.getSelectedItems();var a=s[0].mAggregations.cells[5].mProperties.selectedKeys;this.onSelectFiltertableArea(a)},onSelectFiltertableArea:function(e){debugger;var t=this.byId("idRequestedData");var s=t.getSelectedItems();var a=s[0].getBindingContext();var r=s[0].mAggregations.cells[6];var o=[];e.forEach(function(e){var t=e;o.push(new sap.ui.model.Filter("Processarea",sap.ui.model.FilterOperator.EQ,t))});var i=new sap.ui.model.Filter({filters:o,and:false});var l=this.getOwnerComponent().getModel();l.read("/ProcessAreaSet",{filters:[i],success:function(e){var t=[];var s={};e.results.forEach(function(e){var a=e.Processgroup;if(!s[a]){s[a]=true;t.push({key:a,text:a})}});r.removeAllItems();t.forEach(function(e){r.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});r.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onSelectGroup:function(){var e=this.byId("idAreaSelect");var t=this.byId("idGroupSelect");var s=this.byId("idQueueSelect");this.OnFilterGroup(e,t,s)},OnFilterGroup:function(e,t,s){var a=e.getSelectedItems();var r=t.getSelectedItems();var o=[];r.forEach(function(e){var t=e.getText();o.push(new sap.ui.model.Filter("Processgroup",sap.ui.model.FilterOperator.EQ,t))});var i=new sap.ui.model.Filter({filters:o,and:false});var l=this.getOwnerComponent().getModel();l.read("/ProcessAreaSet",{filters:[i],success:function(e){var o=[];var i={};var l={};e.results.forEach(function(e){var t=e.Queue;var s=e.Processarea;var a=e.Processgroup;if(!l[s]){l[s]={}}if(!l[s][a]){l[s][a]=[]}l[s][a].push(t);if(!i[t]){i[t]=true;o.push({key:t,text:t})}});var u=true;a.forEach(function(e){var s=e.getText();var a=r.some(function(e){var t=e.getText();return l[s]&&l[s][t]});if(!a){u=false;t.setValueState("Error");t.setValueStateText("Please select at least one group related to the selected areas.");sap.m.MessageToast.show("Please select at least one group related to the selected areas.")}});if(!u){s.removeAllItems();return}t.setValueState("None");s.removeAllItems();o.forEach(function(e){s.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});s.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onSelectTableGroup:function(){debugger;var e=this.byId("idRequestedData");var t=e.getSelectedItems();var s=t[0].mAggregations.cells[5];var a=t[0].mAggregations.cells[5];var r=t[0].mAggregations.cells[6];var o=t[0].mAggregations.cells[7];this.OnFilterTableGroup(a,r,o)},OnFilterTableGroup:function(e,t,s){var a=e.mProperties.selectedKeys;var r=t.mProperties.selectedKeys;var o=[];r.forEach(function(e){var t=e;o.push(new sap.ui.model.Filter("Processgroup",sap.ui.model.FilterOperator.EQ,t))});var i=new sap.ui.model.Filter({filters:o,and:false});var l=this.getOwnerComponent().getModel();l.read("/ProcessAreaSet",{filters:[i],success:function(e){var o=[];var i={};var l={};e.results.forEach(function(e){var t=e.Queue;var s=e.Processarea;var a=e.Processgroup;if(!l[s]){l[s]={}}if(!l[s][a]){l[s][a]=[]}l[s][a].push(t);if(!i[t]){i[t]=true;o.push({key:t,text:t})}});var u=true;a.forEach(function(e){var s=e;var a=r.some(function(e){var t=e;return l[s]&&l[s][t]});if(!a){u=false;t.setValueState("Error");t.setValueStateText("Please select at least one group related to the selected areas.");sap.m.MessageToast.show("Please select at least one group related to the selected areas.")}});if(!u){s.removeAllItems();return}t.setValueState("None");s.removeAllItems();o.forEach(function(e){s.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});s.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onSelectQueue:function(){var e=this.byId("idGroupSelect");var t=this.byId("idQueueSelect");this.onFilterQueue(e,t)},onFilterQueue:function(e,t){var s=e.getSelectedItems();var a=t.getSelectedItems();var r=[];a.forEach(function(e){var t=e.getText();r.push(new sap.ui.model.Filter("Queue",sap.ui.model.FilterOperator.EQ,t))});var o=new sap.ui.model.Filter({filters:r,and:false});var i=this.getOwnerComponent().getModel();i.read("/ProcessAreaSet",{filters:[o],success:function(e){var r={};var o=true;e.results.forEach(function(e){var t=e.Processgroup;var s=e.Queue;if(!r[t]){r[t]=[]}r[t].push(s)});s.forEach(function(e){var s=e.getText();var i=a.some(function(e){var t=e.getText();return r[s]&&r[s].includes(t)});if(!i){o=false;t.setValueState("Error");t.setValueStateText("Please select at least one queue related to the selected groups.");sap.m.MessageToast.show("Please select at least one queue related to the selected groups.")}});if(!o){return}t.setValueState("None")},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onApprovePress:function(){var e=this.byId("idEmppInput").getValue();var t=true;if(!Name){oNameInput.setValueState(sap.ui.core.ValueState.Error);oNameInput.setValueStateText("Name is required.");t=false}else{oNameInput.setValueState(sap.ui.core.ValueState.None);oNameInput.setValueStateText("")}if(email){var s=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!s.test(email)){oEmailInput.setValueState(sap.ui.core.ValueState.Error);oEmailInput.setValueStateText("Invalid email format.");t=false}else{oEmailInput.setValueState(sap.ui.core.ValueState.None);oEmailInput.setValueStateText("")}}else{oEmailInput.setValueState(sap.ui.core.ValueState.None);oEmailInput.setValueStateText("")}if(!phone){oPhoneInput.setValueState(sap.ui.core.ValueState.Error);oPhoneInput.setValueStateText("Phone number is required.");t=false}else if(phone.length!==10||!/^\d+$/.test(phone)){oPhoneInput.setValueState(sap.ui.core.ValueState.None);oPhoneInput.setValueStateText("")}else{oPhoneInput.setValueState("None");if(!this.bOtpVerified){sap.m.MessageToast.show("Please verify your phone number with the OTP before submitting.");return}}if(!Resourcetype){oResourcetypeInput.setValueState(sap.ui.core.ValueState.Error);oResourcetypeInput.setValueStateText("Resource type is required.");t=false}else{oResourcetypeInput.setValueState(sap.ui.core.ValueState.None);oResourcetypeInput.setValueStateText("")}if(!Usertype){oUsertype.setValueState(sap.ui.core.ValueState.Error);oUsertype.setValueStateText("User type is required.");t=false}else{oUsertype.setValueState(sap.ui.core.ValueState.None);oUsertype.setValueStateText("")}if(Area.length===0){oAreaSelect.setValueState(sap.ui.core.ValueState.Error);oAreaSelect.setValueStateText("At least one area must be selected.");t=false}else{oAreaSelect.setValueState(sap.ui.core.ValueState.None);oAreaSelect.setValueStateText("")}if(Group.length===0){oGroupSelect.setValueState(sap.ui.core.ValueState.Error);oGroupSelect.setValueStateText("At least one group must be selected.");t=false}else{oGroupSelect.setValueState(sap.ui.core.ValueState.None);oGroupSelect.setValueStateText("")}if(Queue.length===0){oQueueSelect.setValueState(sap.ui.core.ValueState.Error);oQueueSelect.setValueStateText("At least one queue must be selected.");t=false}else{oQueueSelect.setValueState(sap.ui.core.ValueState.None);oQueueSelect.setValueStateText("")}if(!t){sap.m.MessageToast.show("Please correct the errors before proceeding.");return}function a(){const e=/[A-Za-z@!#$%&]/;const t=8;let s="";for(let a=0;a<t;a++){let t="";while(!t.match(e)){t=String.fromCharCode(Math.floor(Math.random()*94)+33)}s+=t}return s}var r=a();var o=new Date;if(Resourcetype==="PermanentEmployee"){o.setFullYear(o.getFullYear()+1)}else if(Resourcetype==="temporaryemployee"){o.setMonth(o.getMonth()+2)}var i=new Date;var l=this.formatDate(i);var u=this.formatDate(o);var n={Area:Area,Email:email,Notification:"your request has been Approved",Phonenumber:phone,Queue:Queue,Users:Usertype,Resourcegroup:Group,Resourceid:e,Resourcename:Name,Resourcetype:Resourcetype,Approveddate:l,Expirydate:u,Password:r,Status:"true",Loginfirst:true};var c=this.getOwnerComponent().getModel();if(!this.bCreate){c.update(`/RESOURCESSet('${e}')`,n,{success:function(){sap.m.MessageToast.show(`${e} request is Accpeted!`);this.resetForm();this.bCreate=true;this.onRequestedData();this.onUserData()}.bind(this),error:function(){sap.m.MessageToast.show("Error updating user login status.")}})}else{c.create("/RESOURCESSet",n,{success:function(){sap.m.MessageToast.show("successfully Created");this.resetForm();this.onRequestedData();this.onUserData();this.bCreate=true}.bind(this),error:function(){sap.m.MessageToast.show("Error updating user login status.")}})}},formatDate:function(e){var t=e.getFullYear();var s=("0"+(e.getMonth()+1)).slice(-2);var a=("0"+e.getDate()).slice(-2);return`${t}-${s}-${a}`},resetForm:function(){this.byId("idEmppInput").setValue("");this.byId("idNameInput").setValue("");this.byId("idEmailInput").setValue("");this.byId("idPhoneInput").setValue("");this.byId("idRoesurcetypeInput").setValue("");this.byId("verficationIdicon").setVisible(false);this.byId("getotpsv").setVisible(false);this.byId("_IDGenComboBox10").setVisible(false);this.byId("GroupSelect").setVisible(false);this.byId("AreaSelect").setSelectedKeys([]);this.byId("GroupSelect").setSelectedKeys([]);this.byId("_IDGenComboBox10").setSelectedKeys([]);this.byId("idNameInput").setValueState(sap.ui.core.ValueState.None);this.byId("idEmailInput").setValueState(sap.ui.core.ValueState.None);this.byId("idPhoneInput").setValueState(sap.ui.core.ValueState.None);this.byId("idRoesurcetypeInput").setValueState(sap.ui.core.ValueState.None);this.byId("AreaSelect").setValueState(sap.ui.core.ValueState.None);this.byId("GroupSelect").setValueState(sap.ui.core.ValueState.None);this.byId("_IDGenComboBox10").setValueState(sap.ui.core.ValueState.None);this._queueSelectError=null;this._groupSelectError=null},onEmployeeIdLiveChange:function(e){var t=e.getSource();var s=t.getValue();var a=this.getOwnerComponent().getModel();if(s.length!==6){t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Employee ID must be exactly 6 characters long.");this.byId("idNameInput").setEditable(true).setValue("");this.byId("idEmailInput").setEditable(true).setValue("");this.byId("idPhoneInput").setEditable(true).setValue("");this.byId("getotpsv").setVisible(true);this.bOtpVerified=false;this.byId("idRoesurcetypeInput").setEditable(true).setValue("");return}else{t.setValueState(sap.ui.core.ValueState.None);t.setValueStateText("")}var r=new sap.ui.model.Filter("Resourceid",sap.ui.model.FilterOperator.EQ,s);var o=this;a.read("/RESOURCESSet",{filters:[r],success:function(e){if(e.results.length>0){if(e.results[0].Area){t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Employee ID is already approved.");o.byId("idNameInput").setEditable(false).setValue(a);o.byId("idEmailInput").setEditable(false).setValue(s);o.byId("idPhoneInput").setEditable(false).setValue(r);o.byId("idRoesurcetypeInput").setEditable(false).setValue(i);o.byId("getotpsv").setVisible(false);o.byId("idOtpInputsv").setVisible(false)}else{t.setValueState(sap.ui.core.ValueState.Success);t.setValueStateText("Employee ID already exists.");o.bCreate=false;var s=e.results[0].Email;var a=e.results[0].Resourcename;var r=e.results[0].Phonenumber;var i=e.results[0].Resourcetype;o.byId("idNameInput").setEditable(false).setValue(a);o.byId("idEmailInput").setEditable(false).setValue(s);o.byId("idPhoneInput").setEditable(false).setValue(r);o.byId("idRoesurcetypeInput").setEditable(false).setValue(i);o.byId("getotpsv").setVisible(false);o.byId("idOtpInputsv").setVisible(false);o.bOtpVerified=true}}else{t.setValueState(sap.ui.core.ValueState.Success);t.setValueStateText("Employee ID is available.")}},error:function(e){t.setValueState(sap.ui.core.ValueState.None);sap.m.MessageToast.show("Error fetching data.");console.error("Error: ",e)}})},onSelectProcesAarea:function(){var e=this.byId("idAreaSelect");var t=this.byId("idGroupSelect");var s=e.getSelectedItems();var a=[];s.forEach(function(e){var t=e.getText();a.push(new sap.ui.model.Filter("Processarea",sap.ui.model.FilterOperator.EQ,t))});var r=new sap.ui.model.Filter({filters:a,and:false});var o=this.getOwnerComponent().getModel();o.read("/ProcessAreaSet",{filters:[r],success:function(e){var s=[];var a={};e.results.forEach(function(e){var t=e.Processgroup;if(!a[t]){a[t]=true;s.push({key:t,text:t})}});t.removeAllItems();s.forEach(function(e){t.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});t.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onSelectGroup:function(){var e=this.byId("idAreaSelect");var t=this.byId("idGroupSelect");var s=this.byId("idQueueSelect");var a=e.getSelectedItems();var r=t.getSelectedItems();var o=[];r.forEach(function(e){var t=e.getText();o.push(new sap.ui.model.Filter("Processgroup",sap.ui.model.FilterOperator.EQ,t))});var i=new sap.ui.model.Filter({filters:o,and:false});var l=this.getOwnerComponent().getModel();l.read("/ProcessAreaSet",{filters:[i],success:function(e){var o=[];var i={};var l={};e.results.forEach(function(e){var t=e.Queue;var s=e.Processarea;var a=e.Processgroup;if(!l[s]){l[s]={}}if(!l[s][a]){l[s][a]=[]}l[s][a].push(t);if(!i[t]){i[t]=true;o.push({key:t,text:t})}});var u=true;a.forEach(function(e){var s=e.getText();var a=r.some(function(e){var t=e.getText();return l[s]&&l[s][t]});if(!a){u=false;t.setValueState("Error");t.setValueStateText("Please select at least one group related to the selected areas.");sap.m.MessageToast.show("Please select at least one group related to the selected areas.")}});if(!u){s.removeAllItems();return}t.setValueState("None");s.removeAllItems();o.forEach(function(e){s.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});s.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onSelectQueue:function(){var e=this.byId("idGroupSelect");var t=this.byId("idQueueSelect");var s=e.getSelectedItems();var a=t.getSelectedItems();var r=[];a.forEach(function(e){var t=e.getText();r.push(new sap.ui.model.Filter("Queue",sap.ui.model.FilterOperator.EQ,t))});var o=new sap.ui.model.Filter({filters:r,and:false});var i=this.getOwnerComponent().getModel();i.read("/ProcessAreaSet",{filters:[o],success:function(e){var r={};var o=true;e.results.forEach(function(e){var t=e.Processgroup;var s=e.Queue;if(!r[t]){r[t]=[]}r[t].push(s)});s.forEach(function(e){var s=e.getText();var i=a.some(function(e){var t=e.getText();return r[s]&&r[s].includes(t)});if(!i){o=false;t.setValueState("Error");t.setValueStateText("Please select at least one queue related to the selected groups.");sap.m.MessageToast.show("Please select at least one queue related to the selected groups.")}});if(!o){return}t.setValueState("None")},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},OnPressStockBinQueryByBin:function(){var e=r.getRouterFor(this);e.navTo("StockBinQueryByBin",{id:this.ID})},onGetOTP:function(){var e=this.byId("idPhoneInput").getValue();if(!e){sap.m.MessageToast.show("Please enter a valid phone number.");return}var t="+91"+e;const s="AC21c2f98c918eae4d276ffd6268a75bcf";const a="b0825bb59321ebdf831fda7a8507dc45";const r="VA104b5a334e3f175333acbd45c5065910";const o=`https://verify.twilio.com/v2/Services/${r}/Verifications`;const i={To:t,Channel:"sms"};var l=this;$.ajax({url:o,type:"POST",headers:{Authorization:"Basic "+btoa(s+":"+a),"Content-Type":"application/x-www-form-urlencoded"},data:$.param(i),success:function(e){console.log("OTP sent successfully:",e);sap.m.MessageToast.show("OTP sent successfully! Please check your phone.");l.byId("idOtpInputsv").setVisible(true);this._storedPhoneNumber=t}.bind(this),error:function(e,t,s){console.error("Error sending OTP:",s);sap.m.MessageToast.show("Failed to send OTP: "+s)}})},OnPressWTQuerybyWO:function(){var e=r.getRouterFor(this);e.navTo("WTQueryByWO",{id:this.ID})},onChatbotButtonPress:function(){window.open("https://cai.tools.sap/api/connect/v1/webclient/standalone/53c7e531-9483-4c3e-b523-b0bdf59df4a4","_self")},OnPressStockOrBinQuerybyProduct:function(){var e=r.getRouterFor(this);e.navTo("StockBinQueryByProduct",{id:this.ID})},onMobileVal:async function(e){var t=e.getSource();var s=t.getValue();var a=/^[0-9]{10}$/;if(s.trim()===""){t.setValueState("None")}else if(s.match(a)){t.setValueState("Success")}else{t.setValueState("Error");if(sap.m.MessageToast){sap.m.MessageToast.show("Invalid Phone format")}else{console.error("MessageToast is not available.")}}},onSelectFieldsPress:function(){if(!this.oSelectFieldsDialog){this.oSelectFieldsDialog=sap.ui.xmlfragment("com.app.rfapp.fragments.SelectFields",this);this.getView().addDependent(this.oSelectFieldsDialog)}this.oSelectFieldsDialog.open()},onSelect:function(e){const t=e.getParameter("selected");var s=e.getSource();var a=s.getText();if(t){this.chekBoxName.push(a)}else{this.chekBoxName=this.chekBoxName.filter(e=>e!==a)}console.log(this.chekBoxName)},onSaveFieldsPress:function(e){var t=this.getView();var s=[];t.byId("idresourceid").setVisible(false);t.byId("idarea").setVisible(false);t.byId("idresourcename").setVisible(false);t.byId("idgroup").setVisible(false);t.byId("idresourcetype").setVisible(false);t.byId("idemail").setVisible(false);t.byId("idphonenumber").setVisible(false);var a=this;this.chekBoxName.forEach(function(e){let t=e.replace(/[^a-zA-Z0-9]/g,"");let r=t.toLowerCase();let o=a.getView().byId(`id${r}`);console.log(o.getWidth());o.setVisible(true);s.push(o.getWidth().replace("%",""))});const r=this.chekBoxName.length*350;t.byId("idUserDataTable").setWidth(`${r}px`);var o=t.byId("idUserDataTable");o.getBinding("items").refresh();console.log(this.getView().byId("idUserDataTable").getWidth());this.oSelectFieldsDialog.close()},onCancelInRequesteddataTablePress:function(){this.oSelectFieldsDialog.close()},onSearch:async function(e){var t=e.getParameter("newValue").trim().toLowerCase();var s=this.byId("idUserDataTable");try{var a=this.getOwnerComponent().getModel();var r="/RESOURCESSet";var o=await new Promise((e,t)=>{a.read(r,{success:function(t){e(t.results)},error:function(e){console.error("Failed to fetch all data:",e);t(e)}})});var i;if(t){i=o.filter(function(e){return e.Resourceid&&e.Resourceid.toLowerCase().includes(t)||e.Resourcetype&&e.Resourcetype.toLowerCase().includes(t)||e.Resourcename&&e.Resourcename.toLowerCase().includes(t)||e.Area&&e.Area.toLowerCase().includes(t)||e.Resourcegroup&&e.Resourcegroup.toLowerCase().includes(t)||e.Lname&&e.Lname.toLowerCase().includes(t)||e.Phonenumber&&e.Phonenumber.includes(t)||e.Queue&&e.Queue.toLowerCase().includes(t)})}else{i=o}var l=new sap.ui.model.json.JSONModel(i);s.setModel(l);s.bindItems({path:"/",template:s.getBindingInfo("items").template})}catch(e){console.error("Error fetching or filtering data:",e)}}})});
//# sourceMappingURL=Supervisor.controller.js.map