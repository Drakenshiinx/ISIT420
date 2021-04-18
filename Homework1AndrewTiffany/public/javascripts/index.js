
function PetItem(pTitle, ppetType, pprice, pamount) {
    this.title= pTitle;
    this.petType = ppetType;
    this.price = pprice;
    this.amount = pamount;
  }
  var ClientNotes = [];  // our local copy of the cloud data


document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tTitle = document.getElementById("title").value;
        var tpetType = document.getElementById("petType").value;
        var tprice = document.getElementById("price").value;
        var tamount = document.getElementById("amount").value;
        var onePetItem = new PetItem(tTitle, tpetType, tprice, tamount);

        $.ajax({
            url: '/NewPetItem' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(onePetItem),
            success: function (result) {
                console.log("added new note")
            }

        });
    });

    document.getElementById("get").addEventListener("click", function () {
        updateList()
    });
  


    document.getElementById("delete").addEventListener("click", function () {
        
        var whichPetItem = document.getElementById('deleteTitle').value;
        var idToDelete = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].title === whichPetItem) {
                idToDelete = ClientNotes[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({  
                    url: 'DeletePetItem/'+ idToDelete,
                    type: 'DELETE',  
                    contentType: 'application/json',  
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
        }
        else {
            console.log("no matching Subject");
        } 
    });



    document.getElementById("msubmit").addEventListener("click", function () {
        var tTitle = document.getElementById("mtitle").value;
        var tpetType = document.getElementById("mpetType").value;
        var tprice = document.getElementById("mprice").value;
        var tamount = document.getElementById("mamount").value;
        var onePetItem = new PetItem(tTitle, tpetType, tprice, tamount);
        onePetItem.amount =  document.getElementById("mcompleted").value;
        
            $.ajax({
                url: 'UpdatePetItem/'+idToFind,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(onePetItem),
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
            
       
    });


    
    var idToFind = ""; // using the same value from the find operation for the modify
    // find one to modify
    document.getElementById("find").addEventListener("click", function () {
        var tTitle = document.getElementById("modTitle").value;
         idToFind = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].title === tTitle) {
                idToFind = ClientNotes[i]._id;
           }
        }
        console.log(idToFind);
 
        $.get("/FindPetItem/"+ idToFind, function(data, status){ 
            console.log(data[0].title);
            document.getElementById("mtitle").value = data[0].title;
            document.getElementById("mpetType").value= data[0].petType;
            document.getElementById("mprice").value = data[0].price;
            document.getElementById("mamount").value = data[0].amount;
           

        });
    });

    // get the server data into the local array
    updateList();

});


function updateList() {
var ul = document.getElementById('listUl');
ul.innerHTML = "";  // clears existing list so we don't duplicate old ones

//var ul = document.createElement('ul')

$.get("/PetItems", function(data, status){  // AJAX get
    ClientNotes = data;  // put the returned server json data into our local array

    // sort array by one property
    ClientNotes.sort(compare);  // see compare method below
    console.log(data);
    //listDiv.appendChild(ul);
    ClientNotes.forEach(ProcessOnePetItem); // build one li for each item in array
    function ProcessOnePetItem(item, index) {
        var li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML=li.innerHTML + index + ": " + " Price: " + item.price + "  " + item.title + ":  " + item.petType + " Price: "+ item.amount;
    }
});
}

function compare(a,b) {
    if (a.amount == false && b.amount== true) {
        return -1;
    }
    if (a.amount == false && b.amount== true) {
        return 1;
    }
    return 0;
}
