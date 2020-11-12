var DatatableDataLocalDemo={init:function(){
	var e,a;
	e=JSON.parse('[{"RecordID":1,"OrderID":"54473-251","ShipCountry":"GT","ShipCity":"San Pedro Ayampuc","ShipName":"Sanford-Halvorson","ShipAddress":"897 Magdeline Park","CompanyEmail":"sgormally0@dot.gov","CompanyAgent":"Shandra Gormally","CompanyName":"Eichmann, Upton and Homenick","Currency":"GTQ","Notes":"sit amet cursus id turpis integer aliquet massa id lobortis convallis","Department":"Computers","Website":"house.gov","Latitude":"14.78667","Longitude":"-90.45111","ShipDate":"5/21/2016","TimeZone":"America/Guatemala","Status":1,"Type":2},{"RecordID":2,"OrderID":"54473-252","ShipCountry":"GT","ShipCity":"San Pedro Ayampuc","ShipName":"Sanford-Halvorson","ShipAddress":"897 Magdeline Park","CompanyEmail":"sgormally0@dot.gov","CompanyAgent":"Shandra Gormally","CompanyName":"Eichmann, Upton and Homenick","Currency":"GTQ","Notes":"sit amet cursus id turpis integer aliquet massa id lobortis convallis","Department":"Computers","Website":"house.gov","Latitude":"14.78667","Longitude":"-90.45111","ShipDate":"5/21/2016","TimeZone":"America/Guatemala","Status":2,"Type":2},{"RecordID":3,"OrderID":"54473-253","ShipCountry":"GT","ShipCity":"San Pedro Ayampuc","ShipName":"Sanford-Halvorson","ShipAddress":"897 Magdeline Park","CompanyEmail":"sgormally0@dot.gov","CompanyAgent":"Shandra Gormally","CompanyName":"Eichmann, Upton and Homenick","Currency":"GTQ","Notes":"sit amet cursus id turpis integer aliquet massa id lobortis convallis","Department":"Computers","Website":"house.gov","Latitude":"14.78667","Longitude":"-90.45111","ShipDate":"5/21/2016","TimeZone":"America/Guatemala","Status":3,"Type":2},{"RecordID":4,"OrderID":"54473-254","ShipCountry":"GT","ShipCity":"San Pedro Ayampuc","ShipName":"Sanford-Halvorson","ShipAddress":"897 Magdeline Park","CompanyEmail":"sgormally0@dot.gov","CompanyAgent":"Shandra Gormally","CompanyName":"Eichmann, Upton and Homenick","Currency":"GTQ","Notes":"sit amet cursus id turpis integer aliquet massa id lobortis convallis","Department":"Computers","Website":"house.gov","Latitude":"14.78667","Longitude":"-90.45111","ShipDate":"5/21/2016","TimeZone":"America/Guatemala","Status":4,"Type":2},{"RecordID":5,"OrderID":"54473-255","ShipCountry":"GT","ShipCity":"San Pedro Ayampuc","ShipName":"Sanford-Halvorson","ShipAddress":"897 Magdeline Park","CompanyEmail":"sgormally0@dot.gov","CompanyAgent":"Shandra Gormally","CompanyName":"Eichmann, Upton and Homenick","Currency":"GTQ","Notes":"sit amet cursus id turpis integer aliquet massa id lobortis convallis","Department":"Computers","Website":"house.gov","Latitude":"14.78667","Longitude":"-90.45111","ShipDate":"5/21/2016","TimeZone":"America/Guatemala","Status":5,"Type":2}]'),
	console.log(e);
	a=$(".m_datatable").mDatatable({data:{type:"local",source:e,pageSize:10},
		layout:{theme:"default",class:"",scroll:!1,footer:!1},
		sortable:!0,pagination:!0,
		search:{input:$("#generalSearch")},
		columns:[
		{field:"RecordID",title:"#",width:50,sortable:!1,textAlign:"center",selector:{class:"m-checkbox--solid m-checkbox--brand"}},
		{field:"OrderID",title:"Order ID"},
		{field:"ShipName",title:"Ship Name",responsive:{visible:"lg"}},
		{field:"Currency",title:"Currency",width:100},
		{field:"ShipAddress",title:"Ship Address",responsive:{visible:"lg"}},
		{field:"ShipDate",title:"Ship Date",type:"date",format:"MM/DD/YYYY"},
		{field:"Status",title:"Status",template:function(e){
			var a={
				1:{title:"Pending",class:"m-badge--brand"},
				2:{title:"Delivered",class:" m-badge--metal"},
				3:{title:"Canceled",class:" m-badge--primary"},
				4:{title:"Success",class:" m-badge--success"},
				5:{title:"Info",class:" m-badge--info"},
				6:{title:"Danger",class:" m-badge--danger"},
				7:{title:"Warning",class:" m-badge--warning"}
			};
			return'<span class="m-badge '+a[e.Status].class+' m-badge--wide">'+a[e.Status].title+"</span>"}
		},
		{field:"Type",title:"Type",template:function(e){
			var a={
				1:{title:"Online",state:"danger"},
				2:{title:"Retail",state:"primary"},
				3:{title:"Direct",state:"accent"}
			};
			return'<span class="m-badge m-badge--'+a[e.Type].state+' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-'+a[e.Type].state+'">'+a[e.Type].title+"</span>"}
		}
		]
	}),
	$("#m_form_status").on("change",function(){a.search($(this).val(),"Status")}),$("#m_form_type").on("change",function(){a.search($(this).val(),"Type")}),$("#m_form_status, #m_form_type").selectpicker()
	}
};
jQuery(document).ready(function(){
	DatatableDataLocalDemo.init()
});