/*
 *This file links the front-end events with the 
 *functions/ handlers that they're dealing with
 *
 *Zhexi Liu
 * */


var storage = window.localStorage;
var len = storage.length;
var obj;
var doc = "";
var txt= "";
var idGlobal;
var nameGlobal;


$(document).ready( function(){
	//Loop through the storage and display
	showStorage();   
	showLists();

	$(function() {
	  	 var list_name = $( "#list_name" ),
	     allFields = $( [] ).add( list_name ),
	     tips = $( ".validateTips" );
	  	 
	  	 	//Show warnings
		   function updateTips( t ) {
		     tips.text( t ).addClass( "ui-state-highlight" );
		     setTimeout(function() {
		       tips.removeClass( "ui-state-highlight", 1500 );
		     }, 500 );
		   }
		   
		   //Check if user iput is regular expression
		   function checkRegexp( o, regexp, n ) {
			      if ( !( regexp.test( o.val() ) ) ) {
			        o.addClass( "ui-state-error" );
			        updateTips( n );
			        return false;
			      } else {
			        return true;
			      }
			   }
		   
		   //Check user input length
		   function checkLength( o,min, max ) {
		     if ( o.val().length > max || o.val().length < min ) {
		       o.addClass( "ui-state-error" );
		       updateTips( "Length of title " + " must be between " +
		         min + " and " + max + "." );
		       return false;
		     } else {
		       return true;
		     }
		   }
	  
		 /*Dialog for add list
		  *  Referenced from http://jqueryui.com/dialog/#modal-form
		  */
	   $( "#dialog-form" ).dialog({ autoOpen: false, height: 280, modal: true,
	     buttons: {
	       "Create": function() {
		         var bValid = true;
		         allFields.removeClass( "ui-state-error" );
		         bValid = bValid && checkLength( list_name, 1, 50 );
		         bValid = bValid && checkRegexp( list_name, /^[a-z]([0-9a-z ])+$/i,"list Name may only contain 0-9,a-z" );
		         if ( bValid ) {
	       
		        	 var header_name = list_name.val();
			         var htmltext = "<div class='try' id = 'tmplist'><h3></h3><section>"+"<p title = 'delete this list' class='ui-icon ui-icon-trash delete_list'  style='float:right'><p title = 'new item' class='ui-icon ui-icon-plusthick add_event' style='float:right'></p>"+
		 				"</section></div>";
			         $( "#users-contain" ).before( htmltext );
			         $('h3:last').html(header_name);
	  
		             $('#tmplist').accordion({collapsible:true, heightStyle: "content"});
		             header_namee = header_name.replace(/ /g,"_");
		             $('#tmplist').attr('id', header_namee);
		           
		             $('.add_event').unbind();
		             $('.delete_list').unbind();
		             $('.delete_list').bind('click',delete_list_handler);
		             $('.add_event').bind('click',add_event_handler);
		           
		             $( this ).dialog( "close" );
		             addList(header_name);
	        
	         }
	       },
	       Cancel: function() {
	         $( this ).dialog( "close" );
	       }
	     },
	     close: function() {
	       allFields.val( "" ).removeClass( "ui-state-error" );
	     }
	   });
	 
	 });
	
	//------------
	
	$(function() {
	  	 var event_name = $( "#event_name" );
	  	 var datepicker = $('#datepicker');
	  	 var desc = $('#description');
	  	
	     allFields = $( [] ).add(event_name ).add(datepicker).add(desc),
	     tips = $( ".validateTips" );

	     function updateTips( t ) {
	     tips
	       .text( t )
	       .addClass( "ui-state-highlight" );
	     setTimeout(function() {
	       tips.removeClass( "ui-state-highlight", 1500 );
	     }, 500 );
	   }

	    function checkLength( o,min, max ) {
	     if ( o.val().length > max || o.val().length < min ) {
	       o.addClass( "ui-state-error" );
	       updateTips( "Length of title " + " must be between " +
	         min + " and " + max + "." );
	       return false;
	     } else {
	       return true;
	     }
	   }
	   
	    /*Dialog for add item
		  *  Referenced from http://jqueryui.com/dialog/#modal-form
		 */
	 $( "#dialog-form2" ).dialog({  autoOpen: false, height: 280, modal: true,
	     buttons: {
	    	 "Create": function() {
	         var bValid = true;
	         
	         allFields.removeClass( "ui-state-error" );
	         bValid = bValid && checkLength( event_name, 1, 50 );
	         if ( bValid ) {
	        	 var event_header = event_name.val();
	        	 var about = desc.val();
	         	 var date = datepicker.val();
	        	 
	        	 $( this ).dialog( "close" );
	        	
	        	 addEvent(event_header, date, about);
	        	
	        	 $('.delete_item').unbind();
	        	 $('.mark_as').unbind();
	        	 $('.delete_item').bind('click',delete_item_handler);
	        	 $('.mark_as').bind('click',mark_as_handler);
	        		
	         }
	       },
	       Cancel: function() {
	         $( this ).dialog( "close" );
	       }
	     },
	     close: function() {
	       allFields.val( "" ).removeClass( "ui-state-error" );
	     }
	   });
	});
	
	
	//Event hander for adding a list item
	var add_event_handler = function(){
		var idd = $(this).parent().parent().attr("id");
		iid=$('#'+idd);
		idGlobal=$('#'+idd+'>section');
		nameGlobal = idd;	
		$("#dialog-form2").dialog( "open" );
	};
	
	//Event handler for deleting a list
	var delete_list_handler = function()
	{
		var idd = $(this).parent().parent().attr("id");
		var del = window.confirm("All items and this list folder will be deleted, continue?");
		if (del == true)
		{
			removeList(idd);
			$('#'+idd).fadeOut('slow');
		}
	};

	//Event handler for deleting a list item
	var delete_item_handler = function(){
		var idd = $(this).parent().attr("id");
		var arr = idd.split('%');
		var listName = arr[0];
		var index = arr[1];
		var del = confirm("Delete this item? ");
		if(del)
		{
			removeItem(listName,index);
			$(this).parent().fadeOut('slow');
		}
	};
	
	//Event handler for mark an event as finished
	var mark_as_handler = function(){
		var idd = $(this).parent().attr("id");
		var arr = idd.split('%');
		var listName = arr[0];
		var index = arr[1];
		var line = $(this).parent().css( 'text-decoration' );
		if (line!='line-through')
			$(this).parent().css( 'text-decoration','line-through' );
		else
			$(this).parent().css('text-decoration','none');
		markItem(listName,index);
	};
	
	//Bind event handlers to buttons
	$('.add_event').bind('click',add_event_handler);
	$('.delete_item').bind( 'click',delete_item_handler);
	$('.mark_as').bind('click',mark_as_handler);
	$('.delete_list').bind('click',delete_list_handler);
	
	//Refresh the table of lists
	$('#op_refresh_list').click(function(){
		$( '#everything' ).fadeOut();
		showStorage();
		$( '#everything' ).fadeIn();
	});
	
	// sort alphabetically
	$('#op_sort_alp').click(function(){		
		var title =  $('#op_sort_alp>span').attr('title');	
		if (title == "ascending")
			{
				$('#op_sort_alp>span' ).attr('class','ui-icon ui-icon-circle-arrow-s');
				$('#op_sort_alp>span' ).attr('title', 'decending');
				sortByType( "alpha_desc" );
			}
		else
			{
				$( '#op_sort_alp>span' ).attr( 'class','ui-icon ui-icon-circle-arrow-n' );
				$( '#op_sort_alp>span' ).attr( 'title', 'ascending' );
				sortByType( "alpha_asc" );
			}	
		}
	);
	
	// Sort based on deadlines
	$('#op_sort_date').click(function(){		
		var title =  $('#op_sort_date>span').attr('title');	
		if (title == "ascending")
			{
				$( '#op_sort_date>span' ).attr( 'class','ui-icon ui-icon-circle-arrow-s' );
				$( '#op_sort_date>span' ).attr( 'title', 'decending' );
				sortByType( "date_desc" );
			}
		else
			{
				$( '#op_sort_date>span').attr( 'class','ui-icon ui-icon-circle-arrow-n' );
				$('#op_sort_date>span').attr( 'title', 'ascending');
				sortByType( "date_asc" );
			}	
		}
	);
	
	 //Button to trigger dialog
	  $( "#create_new_list" ).button().click( function() {
	       $( "#dialog-form" ).dialog( "open" );
	    });
	  
	  //Button for exporting to csv
	  $( '#export_table').click( function(){
		  readTable();
	  });
	  
	  //Button to delete all finsihed tasks
	  $( "#delete_finished" ).button().click(function() {
		  var del = window.confirm( "Delete all finished tasks?" );
		  if(del)
		  {
		      deleteFinished();
		      location.reload();
		 }
	    });
});


$(function() {
	
	//Attach selectors to jquery ui elements.
	$( "input[type=submit], a, button").button();
    $( '#content_all' ).accordion( {collapsible: true, heightStyle: "content" , active:"none"} );
    $( '#datepicker' ).datepicker();
    $( '.try' ).sortable( {containment: 'document', opacity: 0.85, tolerance:'pointer'} );
    $( document ).tooltip();  
});
