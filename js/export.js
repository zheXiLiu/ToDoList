/*
 * This file contains the functions to export the table into csv format
 * Code referenced from: http://debozden.webs.com/apps/blog/show/9708273
 * */

//Put all lists in one big table ( to be exported )
function pullTable(){
	
	doc = "<table id = 'hidden_content'>";
	 var storage = window.localStorage;
	 for( var i=0;i<storage.length;i++ ){ 
		var obj = JSON.parse( storage.getItem( storage.key(i) ));
		 var list = obj.list;
	    var j = 0;
	    
	    if ( typeof list != "undefined" && obj.Type=='list' )
	    {
		    for ( j = 0; j<list.length; j++ )
			{
			  	var idk = list[j];	  	
			  	if ( idk!=null )
			  	doc = doc+ "<tr><td>"+storage.key(i)+"</td><td>"+ idk['Name']+"</td><td>"+idk['dueDate']+"</td><td>"+idk['Description']+"</td></tr>";
			}
	    }
	 }
	 doc = doc+"</table>";
	
	 $('#hidden_table').append(doc);
};


function trimTail(str){
    var tail = str.substring( 0,str.length-1 );  return tail;
}

function readTable(){
	pullTable();
    var table = document.getElementById( 'hidden_content' );
    var rowLength = table.rows.length;
    var colLength = table.rows[0].cells.length;
    var header = "";
    var body = "";                
    for(var i=0;i<colLength;i++){
        header = header+table.rows[0].cells[i].innerHTML+",";
    }
    header = trimTail(header);                
    for( var j=1;j<rowLength;j++ ){
        for( var k=0;k<colLength;k++ ){// reading content of each column
            body = body+table.rows[j].cells[k].innerHTML+",";
        }                    
        body = trimTail(body)+'\r\n';
    }                
    body = header+ '\r\n'+body;
    saveFile(body);
}
/**
*saving option as per browser
*/
function saveFile(str){
     if ( navigator.appName != 'Microsoft Internet Explorer' ){
        window.open( 'data:text/csv;charset=utf-8,' + escape( str ));
    }  else{
        var popup = window.open( '','csv','' );
        popup.document.body.innerHTML = '<pre>' + str + '</pre>';
    }
}