/*
 * Sort.js sort the the table entries (either dueDate or Alphabetical)
 * Zhexi Liu
 * */

//Push all lists into one big table of everything
function pullLists()
{
	var all = new Array();
	for(var i = 0; i < storage.length; i++ ){ 
		
		 var obj = JSON.parse( storage.getItem( storage.key(i) ));
		  
		 obj = obj.list;
		 if ( typeof obj != "undefined" )
		{
		  for ( var j = 0; j < obj.length; j++ )
			{
			  	var idk = obj[j];
			  	if( idk!= null )
			  		all.push(idk);
			}
		 }
	}
	 return all;
}

//Sort accordingly
function sortByType(type)
{
	var allItems = pullLists();
	
	if ( type == "alpha_asc" )
		allItems = allItems.sort( function( a, b ){ return( a.Name.toLowerCase() < b.Name.toLowerCase() )?-1:+1;} );
	else if ( type == "alpha_desc" )
		allItems = allItems.sort( function( a, b ){ return(a.Name.toLowerCase() < b.Name.toLowerCase())?+1:-1; } );
	else if ( type == "date_asc" )
		allItems = allItems.sort( function( a, b ){ return( a.dueDate<b.dueDate)?-1:+1; } );
	else if ( type == "date_desc" )
		allItems = allItems.sort( function( a, b ){ return(a.dueDate<b.dueDate)?+1:-1; } );
	
	var doc = "<table><th> Due Date</th><th>Item Name</th>";
	$.each( allItems, function ( index,value ){
		doc = doc + "<tr><td>"+value.dueDate+"</td><td>"+value.Name+"</td></tr>";
	});
	doc = doc + "<table>";
	$('#everything').html(doc);
}

