 

db = openDatabase("ToDo", "0.1", "A list of to do items.", 200000);
    if(!db){alert("Failed to connect to database."); }
    
var storeName = "RSS";
    
function setData(title_, description_, image_){
	var i = 0;
	var arr = [];
	var FEED_URL = "http://www.3dnews.ru/news/rss/";
	
    db.transaction(function (tx){
tx.executeSql('CREATE TABLE IF NOT EXISTS' + storeName + '(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, image TEXT)', [],null, null);
    
    tx.executeSql('INSERT INTO' + storeName + '(title,description, image) VALUES (?,?,?)', [title_, description_, image_],null, function(e){
    	console.log('Error of insert');
    });   });
} 
    
function getFeed(){
	
	var width = screen.width;
	var i = 0;
	var arr = [];
	
	
	$(document).ready(function(){
		$.ajax({
			type: "GET",
			url: FEED_URL,
			dataType: "xml",
			
			error: getStorage(function(res){
				
				for (var field in res){
					for(var fieldValue in (value = res[field])){
					
						switch(fieldValue){
						case 'title':
							var title = value[fieldValue];
							break; 
						case 'description':
							var description = value[fieldValue];
							break;							
						case 'url_img':
							var url_img = value[fieldValue];
							break;
						}
					}
	 
					$("#rssContent").append('<div class="feed"> <div class="images"><img src=' +url_img +' width = ' + width + 'px /></div> <div class="title"><b>' +  title +  '</b></div><div class="description">'+ description + '</div></div>');
				}
			}),
			
			
			success: xmlParser
		});
		
	});
 
function xmlParser(xml){
	clearStorage(); 
	
	$(xml).find("item").each(function(){
		url: FEED_URL;
		var url_img = $(this).find("enclosure").attr('url');
		
		$("#rssContent").append('<div class="feed"> <div class="images"><img src=' +url_img +' width = ' + width + 'px /></div>  <div class="title"><b>' + $(this).find("title").text()+  '</b></div><div class="description">'+$(this).find("description").text()+ '</div></div>');
		
		arr[i]={
				url_img:$(this).find("enclosure").attr('url'),
				title:$(this).find("title").text(),
				description:$(this).find("description").text()
		};
		
		setData(arr[i].title, arr[i].description, arr[i].url_img);
		i++
	});
} 