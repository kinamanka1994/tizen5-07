webdb = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
webdb.transaction(function (tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS RSS4 (id integer primary key autoincrement, title text, description text, url_image text)', [], null, null);
});

function getFeed(){
    var FEED_URL = "http://www.3dnews.ru/news/rss/";
    var width = screen.width;
    
    
    

    
    $(document).ready(function(){
        $.ajax({
            type: "GET",
            url: FEED_URL,
            dataType: "xml",
            error: getStorage(function(res){
                for (var field in res){
                    for(var fieldValue in (value = res[field]))
                        {
                            switch(fieldValue){
                            case 'title':
                                var title = value[fieldValue];
                                break;
                            case 'description':
                                var description = value[fieldValue];
                                break;
                            case 'url_image':
                                var url_img = value[fiedlValue];
                                break;
                            }
                        }
                    
                    $('#rssContent').append('<div class="feed">' +
                            '<div class="images"><image src='+ url_img +' style="width: 100vw" > </image></div>' +
                            '<div class="title" style="font-weight: bold; "> '+ title + '</div>' +
                            '<div class="description" style="font-size:12px"> '+ description + '</div></div>');
                }
            }),
            success: xmlParser
          
             });
           
  
            
        
       
    });
    
    function xmlParser(xml){
        clearStorage();
        $(xml).find("item").each(function(){
            var i=0;
            var arr=[];
            var url_img = $(this).find("enclosure").attr('url');
            $('#rssContent').append('<div class="feed">' +
                    '<div class="images"><image src='+ url_img +' style="width: 100vw" > </image></div>' +
                    '<div class="title" style="font-weight: bold; "> '+ $(this).find("title").text() + '</div>' +
                    '<div class="description" style="font-size:12px"> '+ $(this).find("description").text() + '</div></div>');
            
            arr[i]= {url_img: $(this).find("enclosure").attr('url'), title: $(this).find("title").text(), description: $(this).find("description").text()};
            setData(arr[i]);
            
            var temporary_array_title = "";
            temporary_array_title =  arr[i].title;
            var temporary_array_url_image = "";
            temporary_array_url_image = arr[i].url_img;
            var temporary_array_description = "";
            temporary_array_description =  arr[i].description;
    
            webdb.transaction(function (tx) {          
                tx.executeSql('INSERT INTO RSS4 (title, description, url_image) VALUES (?,?,?)', [temporary_array_title, temporary_array_description, temporary_array_url_image], null, function(e){ 
                	webdb.transaction(function(tx) {
                    	 db.executeSql("SELECT * FROM mydb", [], function(tx, result) {
                    	for(var i = 0; i < result.rows.length; i++) {
                    	document.write('<b>' + result.rows.item(i)['title','description','url_img'] + '</b><br />');
                    	}}, null)});
                });
            });
            i++
        });
    }
}
 
function searchData(substring){
    webdb.transaction(function(tx){
            tx.executeSql('SELECT title FROM RSS4 WHERE title LIKE %substring%', [], function(tx, result){
                var tab = [];
                for(j = 0; j<result.length; j++){
                    tab.push(results.row.item(i).title)
                }
                $("#searchRes").append(i+ ") " + tab[i] +"<br>");
            }, function(e){
                console.log('Error of select');
            });
    });
};
 
//WebSQL
 
function prepareDatabase(ready, error) {
      return openDatabase('documents', '1.0', 'Offline document storage', 5*1024*1024, function (db) {
        db.changeVersion('', '1.0', function (t) {
          t.executeSql('CREATE TABLE docids (id, name)');
        }, error);
      });
    }
 
    function showDocCount(db, span) {
      db.readTransaction(function (t) {
        t.executeSql('SELECT COUNT(*) AS c FROM docids', [], function (t, r) {
          span.textContent = r.rows[0].c;
        }, function (t, e) {
          // couldn't read database
          span.textContent = '(unknown: ' + e.message + ')';
        });
      });
    }
 
    prepareDatabase(function(db) {
      // got database
      var span = document.getElementById('doc-count');
      showDocCount(db, span);
    }, function (e) {
      // error getting database
      alert(e.message);
    });
 
//IndexedDB    
    
var indexedDB       = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
baseName       = "filesBase",
storeName       = "filesStore";
 
 
function logerr(err){
    console.log(err);
}
 
function connectDB(f){
    var request = indexedDB.open(baseName, 1);
    request.onerror = logerr;
    request.onsuccess = function(){
        f(request.result);
    }
    request.onupgradeneeded = function(e){
        var objectStore = e.currentTarget.result.createObjectStore(storeName, { autoIncrement: true });
        connectDB(f);
    }
}
 
function getData(key, f){
    connectDB(function(db){
        var request = db.transaction([storeName], "readonly").objectStore(storeName).get(key);
        request.onerror = logerr;
        request.onsuccess = function(){
            f(request.result ? request.result : -1);
        }
    });
}
 
function getStorage(f){
    connectDB(function(db){
        var rows = [],
            store = db.transaction([storeName], "readonly").objectStore(storeName);
 
        if(store.mozGetAll)
            store.mozGetAll().onsuccess = function(e){
                f(e.target.result);
            };
        else
            store.openCursor().onsuccess = function(e) {
                var cursor = e.target.result;
                if(cursor){
                    rows.push(cursor.value);
                    cursor.continue();
                }
                else {
                    f(rows);
                }
            };
    });
}
 
 
 
 
 
 
 
 
 
 
function setData(obj){
    connectDB(function(db){
        var request = db.transaction([storeName], "readwrite").objectStore(storeName).add(obj);
        request.onerror = logerr;
        request.onsuccess = function(){
            return request.result;
        }
    });
}
 
function delData(key){
    connectDB(function(db){
        var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(key);
        request.onerror = logerr;
        request.onsuccess = function(){
            console.log("File delete from DB:", file);
        }
    });
}
 
function clearStorage(){
    connectDB(function(db){
        var request = db.transaction([storeName], "readwrite").objectStore(storeName).clear();;
        request.onerror = logerr;
        request.onsuccess = function(){
            console.log("Clear");
        }
    });
}
 