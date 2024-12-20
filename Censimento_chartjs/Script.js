//Variabili Globali

var data = new Array();
var totRegione = new Array();
var totProvincia = new Array();
var totComune = new Array();
var i = 0;


//Variabili Grafico
var labels = new Array();
var chartdata = new Array();
var colors = new Array();
var r,g,b = 0;
var visibility = new Array();
var mobile_s = window.matchMedia("(max-width: 320px)");
var mobile_l = window.matchMedia("(max-width: 425px)"); //Telefono


//Classi 

class ObjRiga {

  constructor (Comune,Provincia,Regione,Eta,Femmine,Maschi,Totale) {
      this.Comune = Comune;
	  this.Provincia = Provincia;
	  this.Regione = Regione;
	  this.Eta = Eta;
	  this.Femmine = Femmine;
	  this.Maschi = Maschi;
	  this.Totale = Totale;	  
  }
}

class ObjRegione {

	constructor (Regione,Femmine,Maschi,Totale) {
		this.Regione = Regione;
		this.Femmine = Femmine;
		this.Maschi = Maschi;
		this.Totale = Totale;		
	}
}

class ObjProvincia {

	constructor (Provincia,Femmine,Maschi,Totale) {
		this.Provincia = Provincia;
		this.Femmine = Femmine;
		this.Maschi = Maschi;
		this.Totale = Totale;		
	}
}

class ObjComune {

	constructor (Comune,Femmine,Maschi,Totale) {
		this.Comune = Comune;
		this.Femmine = Femmine;
		this.Maschi = Maschi;
		this.Totale = Totale;		
	}
}

//-------------------------------------------------------------------------------------
//------------------------------------HTML ONLOAD--------------------------------------
//-------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function(event) { 

//Caricamento del CSV nell'array di oggetti 

toArray();

async function toArray(){
    var request = new XMLHttpRequest();  
	request.open("GET", "censimentoistat.csv", false);   
	request.send(null);  

	var csvData = new Array();
	var jsonObject = request.responseText.split(/\r?\n|\r/);
	for (var i = 0; i < jsonObject.length; i++) {
  	csvData.push(jsonObject[i].split(','));
	}
	csvData.forEach(row => {
	var Riga = row[0].split(";");
	var ObjRow = new ObjRiga(Riga[0],Riga[1],Riga[2],Riga[3],Riga[4],Riga[5],Riga[6]);
	data.push(ObjRow);	
});

}

//Preparazione tabella delle REGIONI + creazione della tabella

prepareTableReg();

async function prepareTableReg(){
	var objectR;
	var reg = new Array();

	//console.log(data[1].Regione);
	
	objectR = new ObjRegione(data[1].Regione, parseInt(data[1].Femmine), parseInt(data[1].Maschi), parseInt(data[1].Totale));
	reg.push(data[1].Regione);
	
	for(i=2; i<data.length; i++){
		if(objectR.Regione == data[i].Regione){
			
			if(data[i].Femmine != "")
			objectR.Femmine += parseInt(data[i].Femmine);
			
			if(data[i].Maschi != "")
			objectR.Maschi += parseInt(data[i].Maschi);

			if(data[i].Totale != "")
			objectR.Totale += parseInt(data[i].Totale);
			
		}else {
			
			totRegione.push(objectR);
			objectR = new ObjRegione(data[i].Regione, parseInt(data[i].Femmine), parseInt(data[i].Maschi), parseInt(data[i].Totale));
			reg.push(data[i].Regione);
		}
	}
	
	totRegione.push(objectR);
	toTableReg();
}

toTableReg();

async function toTableReg(){
	var table_data = '<table id="tab" class="table table-bordered table-striped">';
		table_data+= '<tr>';
		table_data += '<th>'+data[0].Regione+'</th>';
		table_data += '<th>'+data[0].Femmine+'</th>';
		table_data += '<th>'+data[0].Maschi+'</th>';
		table_data += '<th>'+data[0].Totale+'</th>';
		table_data+= '</tr>';
	for(i = 0;i < totRegione.length; i++){
		table_data+= '<tr>';		
        table_data+= '<td> <button class="btn btn-outline-secondary" onClick="selectReg.call(this)">' + totRegione[i].Regione + '</button> </td>'; 
        table_data+= '<td>' + totRegione[i].Femmine + '</td>';
		table_data+= '<td>' + totRegione[i].Maschi + '</td>';
		table_data+= '<td>' + totRegione[i].Totale + '</td>';
        table_data+= '</tr>';
		}
	table_data += '</table>';
	$('#population_table').html(table_data);
}

drawCanvasReg();

async function drawCanvasReg(){

	for(i=0; i<totRegione.length; i++){
		labels.push(totRegione[i].Regione);
		chartdata.push(totRegione[i].Totale);
		r = Math.floor(Math.random() * 255);
    	g = Math.floor(Math.random() * 255);
    	b = Math.floor(Math.random() * 255);
    	colors.push('rgba('+r+', '+g+', '+b+', 0.6)');
	}

	var ctx = document.getElementById('population_charts').getContext('2d');
		if(mobile_l.matches || mobile_s.matches){
			//console.log("Telefono");
			var ChartReg = new Chart(ctx, {
				type: 'pie',
				data: {
					labels: labels,
					datasets: [{
						data: chartdata,
						backgroundColor: colors,
						borderWidth: 1
					}]
				},
				options: {
					plugins: {
						subtitle: {
							display: true,
							text: 'Abitanti per Regione'
						}
					}
				}
			});
		}else{
			//console.log("Computer");
			var ChartReg = new Chart(ctx, {
				type: 'pie',
				data: {
					labels: labels,
					datasets: [{
						data: chartdata,
						backgroundColor: colors,
						borderWidth: 1
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						subtitle: {
							display: true,
							text: 'Abitanti per Regione'
						}
					}
				}
			});
		}


	labels = [];
	chartdata = [];
	colors = [];
	
}

modifyTitle();

async function modifyTitle(){	
	if (mobile_s.matches) { // If media query matches
		document.getElementById("title").textContent = "Censimento 2011";
	}
}


}); 
//-------------------------------------------------------------------------------------
//-------------------------------------HTML ONLOAD-------------------------------------
//-------------------------------------------------------------------------------------

function selectReg(){
	var selectedReg = this.textContent || this.innerText;
	document.getElementById("searchBar").placeholder = 'Inserisci la provincia da ricercare...';
	prepareTableProv(selectedReg);
}

//Preparazione tabella delle PROVINCE + creazione della tabella

function prepareTableProv(Regione){
	var objectP;
	
	var ArrayProvince =  data.filter(function(Provincia) {
    return Provincia.Regione == Regione;
	});
	
	objectP = new ObjProvincia(ArrayProvince[0].Provincia, parseInt(ArrayProvince[0].Femmine), parseInt(ArrayProvince[0].Maschi), parseInt(ArrayProvince[0].Totale));
	
	for(i=1; i<ArrayProvince.length; i++){
		if(objectP.Provincia == ArrayProvince[i].Provincia){
			
			if(ArrayProvince[i].Femmine != "")
			objectP.Femmine += parseInt(ArrayProvince[i].Femmine);
			
			if(ArrayProvince[i].Maschi != "")
			objectP.Maschi += parseInt(ArrayProvince[i].Maschi);

			if(ArrayProvince[i].Totale != "")
			objectP.Totale += parseInt(ArrayProvince[i].Totale);
			
		}else {
			
			totProvincia.push(objectP);
			objectP = new ObjProvincia(ArrayProvince[i].Provincia, parseInt(ArrayProvince[i].Femmine), parseInt(ArrayProvince[i].Maschi), parseInt(ArrayProvince[i].Totale));
		}
	}
	totProvincia.push(objectP);
	//console.log(totProvincia);
	$("#population_charts").html("");
	toFilteredTableProvincia();
	drawCanvasProv();
}
	

function toFilteredTableProvincia(){
	$('#tab').remove();
	i = 0;
	var table_data = '<table id="tab" class="table table-bordered table-striped">';
		table_data+= '<tr>';
		table_data += '<th>'+data[0].Provincia+'</th>';
		table_data += '<th>'+data[0].Femmine+'</th>';
		table_data += '<th>'+data[0].Maschi+'</th>';
		table_data += '<th>'+data[0].Totale+'</th>';
		table_data+= '</tr>';
	for(i = 0;i < totProvincia.length; i++){
		table_data+= '<tr>';		
        table_data+= '<td> <button class="btn btn-outline-secondary" onClick="selectProv.call(this)">' + totProvincia[i].Provincia + '</button> </td>'; 
        table_data+= '<td>' + totProvincia[i].Femmine + '</td>';
		table_data+= '<td>' + totProvincia[i].Maschi + '</td>';
		table_data+= '<td>' + totProvincia[i].Totale + '</td>';
        table_data+= '</tr>';
		}
	table_data += '</table>';
	$('#population_table').html(table_data);
}


function selectProv(){
	var selectedProv = this.textContent || this.innerText;
	document.getElementById("searchBar").placeholder = 'Inserisci il comune da ricercare...';
	prepareTableCom(selectedProv);
}

//Preparazione tabella dei COMUNI + creazione della tabella

function prepareTableCom(Provincia){
	var objectC;
	
	var ArrayComuni =  data.filter(function(Comune) {
    return Comune.Provincia == Provincia;
	});

	objectC = new ObjComune(ArrayComuni[0].Comune, parseInt(ArrayComuni[0].Femmine), parseInt(ArrayComuni[0].Maschi), parseInt(ArrayComuni[0].Totale));
	
	for(i=1; i<ArrayComuni.length; i++){
		if(objectC.Comune == ArrayComuni[i].Comune){
			
			if(ArrayComuni[i].Femmine != "")
			objectC.Femmine += parseInt(ArrayComuni[i].Femmine);
			
			if(ArrayComuni[i].Maschi != "")
			objectC.Maschi += parseInt(ArrayComuni[i].Maschi);

			if(ArrayComuni[i].Totale != "")
			objectC.Totale += parseInt(ArrayComuni[i].Totale);
			
		}else {
			
			totComune.push(objectC);
			objectC = new ObjComune(ArrayComuni[i].Comune, parseInt(ArrayComuni[i].Femmine), parseInt(ArrayComuni[i].Maschi), parseInt(ArrayComuni[i].Totale));
		}
	}
	totComune.push(objectC);
	//console.log(totComune);
	$("#population_charts").html("");
	toFilteredTableComune();
	drawCanvasCom();
}

function toFilteredTableComune(){
	$('#tab').remove();
 	i = 0;
 	var table_data = '<table id="tab" class="table table-bordered table-striped">';
		table_data+= '<tr>';
		table_data += '<th>'+data[0].Comune+'</th>';
		table_data += '<th>'+data[0].Femmine+'</th>';
		table_data += '<th>'+data[0].Maschi+'</th>';
		table_data += '<th>'+data[0].Totale+'</th>';
		table_data+= '</tr>';
	for(i = 0;i < totComune.length; i++){
		table_data+= '<tr>';		
        table_data+= '<td>' + totComune[i].Comune + '</td>'; 
        table_data+= '<td>' + totComune[i].Femmine + '</td>';
		table_data+= '<td>' + totComune[i].Maschi + '</td>';
		table_data+= '<td>' + totComune[i].Totale + '</td>';
        table_data+= '</tr>';
		}
	table_data += '</table>';
	$('#population_table').html(table_data);
 }

//Funzione di ricerca
 
function research(){
	var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    table = document.getElementById("population_table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
 
//Funzione dei bottoni (navbar)

function toggletab(){
	let table = document.getElementById('population_table');
	let charts = document.getElementById('population_charts');
	let search = document.getElementById('searchBar');
	if(table.hasAttribute("hidden")){
		charts.setAttribute("hidden",true);
    	table.removeAttribute("hidden");
		search.removeAttribute("hidden");
		document.getElementById('activateTable').className = "btn btn-primary";
		document.getElementById('activateChart').className = "btn btn-outline-primary";
	}

}

function togglechart(){
	let table = document.getElementById('population_table');
	let charts = document.getElementById('population_charts');
	let search = document.getElementById('searchBar');
	if(charts.hasAttribute("hidden")){
    	table.setAttribute("hidden",true);
		search.setAttribute("hidden",true);
    	charts.removeAttribute("hidden");
		document.getElementById('activateChart').className = "btn btn-primary";
		document.getElementById('activateTable').className = "btn btn-outline-primary";
  }

}

//-------------------------------------------------------------------------------------
//Grafico
function drawCanvasProv(){

	document.getElementById("population_charts").remove();
	var cvs = document.createElement('canvas');
    div = document.getElementById('chart_area');
    cvs.id = "population_charts";
	cvs.setAttribute("hidden",true);
    div.appendChild(cvs);

	for(i=0; i<totProvincia.length; i++){
		labels.push(totProvincia[i].Provincia);
		chartdata.push(totProvincia[i].Totale);
		r = Math.floor(Math.random() * 255);
    	g = Math.floor(Math.random() * 255);
    	b = Math.floor(Math.random() * 255);
    	colors.push('rgba('+r+', '+g+', '+b+', 0.6)');
	}

	const ctx = document.getElementById('population_charts').getContext('2d');

	if(mobile_l.matches || mobile_s.matches){
		const ChartProv = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: chartdata,
					backgroundColor: colors,
					borderWidth: 1
				}]
			},
			options: {
				plugins: {
					subtitle: {
						display: true,
						text: 'Abitanti per Provincia'
					}
				}
			}
		});
	}else{
		var ChartProv = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: chartdata,
					backgroundColor: colors,
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					subtitle: {
						display: true,
						text: 'Abitanti per Provincia'
					}
				}
			}
		});
	}

	labels = [];
	chartdata = [];
	colors = [];

}

function drawCanvasCom(){

	document.getElementById("population_charts").remove();
	var cvs = document.createElement('canvas');
    div = document.getElementById('chart_area');
    cvs.id = "population_charts";
	cvs.setAttribute("hidden",true);
    div.appendChild(cvs);

	var pop_max = 0;
	for(i=0; i<totComune.length; i++){
		if(totComune[i].Totale>pop_max)
		pop_max = totComune[i].Totale;
	}
	
	if(pop_max>500000)
	pop_max = pop_max/50;
	else if(pop_max>800000)
	pop_max = pop_max/80;
	else if(pop_max>2000000)
	pop_max = pop_max/500;
	else
	pop_max = pop_max/10;

	for(i=0; i<totComune.length; i++){
		if(totComune[i].Totale>pop_max){
		labels.push(totComune[i].Comune);
		chartdata.push(totComune[i].Totale);
		r = Math.floor(Math.random() * 255);
    	g = Math.floor(Math.random() * 255);
    	b = Math.floor(Math.random() * 255);
    	colors.push('rgba('+r+', '+g+', '+b+', 0.6)');
		}
	}

	const ctx = document.getElementById('population_charts').getContext('2d');

	if(mobile_l.matches || mobile_s.matches){
		const ChartCom = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: chartdata,
					backgroundColor: colors,
					borderWidth: 1
				}]
			},
			options: {
				plugins: {
					subtitle: {
						display: true,
						text: 'Abitanti dei più grandi Comuni'
					}
				}
			}
		});
	}else{
		const ChartCom = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: chartdata,
					backgroundColor: colors,
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					subtitle: {
						display: true,
						text: 'Abitanti dei più grandi Comuni'
					}
				}
			}
		});
	}

	labels = [];
	chartdata = [];
	colors = [];

}