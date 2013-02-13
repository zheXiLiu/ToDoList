/*
 * Parse.js is responsible for all storage related operations.
 * Including list addition, deletion, item addition, deletion, mark as done..
 * 
 * Zhexi Liu
 * */


//Put all lists together into one table
function showStorage(){
	doc = "<table>";
	 var storage = window.localStorage;
	 for(var i=0;i<storage.length;i++){ 
		var obj = JSON.parse(storage.getItem( storage.key(i) ));
		 var list = obj.list;
	    var j = 0;
	    
	    if (typeof list != "undefined" && obj.Type=='list')
	    {
		    for ( j = 0; j<list.length; j++)
			{
			  	var idk = list[j];	  	
			  	if (idk!=null)
			  	doc = doc+ "<tr><td>"+idk['dueDate']+"</td><td>"+ idk['Name']+"</td></tr>";
			}
	    }
	 }
	 doc = doc+"</table>";
	
	 $('#everything').html(doc);
};

//Display each individual list
function showLists()
{
	 for(var i = 0; i < storage.length; i++ ){ 
		
		 var header_name = storage.key(i);
		  obj = JSON.parse( storage.getItem( storage.key(i) ));
		  obj = obj.list;
		  header = header_name.replace( / /g,"_" );
		 
		  txt = "<div  id = '"+header +"'><h3>"+header_name+" </h3>" +
		  		"<section><p title = 'delete this list' class='ui-icon ui-icon-trash delete_list'  style='float:right'><p title = 'new item' class='ui-icon ui-icon-plusthick add_event'  style='float:right'></p>"; 
		
		 if (typeof obj != "undefined" )
		 {
			 for (var j = 0; j < obj.length; j++ )
			 {
				  	var idk = obj[j];
				  	
				  	if ( idk != null )
				  	{
					  	var idkv = header+"%"+j;
					  	var done = idk['Status'];
					  	var boxStatus = (done == true)?"<input type = 'checkbox' class = 'mark_as' checked title = 'mark as done'/>":"<input type = 'checkbox' class = 'mark_as' title='mark as done'/>";
					  	var line = (done == true) ? "line-through" : "none";
					  	txt = txt + "<p style='text-decoration:"+line+"' id = '" +idkv +"' title = '"+idk['Description']+"'>"+ boxStatus;
					  	txt = txt+idk['dueDate']+" - "+ idk['Name']+ "  <span class='ui-icon ui-icon-closethick delete_item' title='delete item' style='float:left'/> </p> ";
					  	txt = txt+"<div style = 'clear:both'></div>";
				  	}
			}
		 }
		
		txt= txt+"</section></div>";
		$('#storage_list').append( txt );
		$('#storage_list>div').accordion( { collapsible:true, heightStyle: "content" , active:'none' });
	 }
	
}

//Lists removal
function removeList( listName )
{
	 var storage = window.localStorage;
	listName = listName.replace( /_/g,' ' );
	storage.removeItem( listName );
}

//Items removal
function removeItem( listName, index )
{
	 var storage = window.localStorage;
	 listName = listName.replace( /_/g,' ' );
	 obj = JSON.parse( storage.getItem( listName ));
	 delete obj.list[index];
	 storage.setItem( listName,JSON.stringify( obj ));
}

//Remove all finished tasks
function deleteFinished()
{
	for(var i=0; i<storage.length; i++){ 
		
		 var header_name = storage.key(i);
		 obj = JSON.parse( storage.getItem( storage.key(i) ));
		  
		 if (typeof obj.list != "undefined" )
		 {
			 for (var j = 0; j < obj.list.length; j++)
			 {
				  	var idk = obj.list[j];
				  	if ( idk!= null && idk['Status'] == true)
				  	{
					  	delete obj.list[j];
				  	}
			}
		 }
		 storage.setItem(header_name,JSON.stringify(obj) );
	 }
}

//Mark item as done
function markItem( listName,index )
{
	 var storage = window.localStorage;
	 listName = listName.replace( /_/g,' ' );
	 obj = JSON.parse( storage.getItem( listName ) );
	 var status = obj.list[index]['Status'];
	 obj.list[index]['Status'] = !status;
	 storage.setItem( listName,JSON.stringify( obj ) );
}

//Add a new event
function addEvent(header, date ,about)
{
	var dupName = nameGlobal.replace( /_/g," " );
	
	var storage = window.localStorage;
	var item = {Status:false, Name:header,dueDate:date, Description:about};
	var obj = JSON.parse(storage.getItem(dupName));
	if (typeof obj != "undefined" )
		obj.list.push(item);
	var len = obj.list.length-1;
	storage.setItem(dupName,JSON.stringify( obj ));
	var id = nameGlobal+'%'+len;
	idGlobal.append( "<p id = '"+id+"' title='"+ about+"'> <input type = 'checkbox' class= 'mark_as'>"+date+" - "+ header +" <span class='ui-icon ui-icon-closethick delete_item' title='delete item' style='float:left'/> </p>" );
	idGlobal.append( "<div style = 'clear:both'></div>" );
}

//Add a new list
function addList(list_name)
{
	var storage = window.localStorage;
	var nameInStorage = list_name;
	var obj = { Type:"list",list:[] };
	storage.setItem(nameInStorage,JSON.stringify( obj ));
}




