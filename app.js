var searchInput = $("#search-gif-input");
var searchButton = $("#search-gif-btn");
var favoriteTags = $(".tag");

var disableTags = [];
var displayedGifs =[];

searchButton.click (function(event){
    var inputText = searchInput.val();
    $.getJSON({
        url: "https://api.giphy.com/v1/gifs/search?q=" + inputText  + "&api_key=Jspd9p0ZDKLfqQlI3kAlVqk0iCEqDOCY",
        success: function (res){
            var gifsData = res.data;
            var gifsWithCategory = gifsData.map(function(gif){
                var gifWithCategory = gif;
                gifWithCategory.category = inputText;
        
                return gifWithCategory;
            });
               displayedGifs = displayedGifs.concat(gifsWithCategory);
               updateGifsHtml();
               searchInput.val("");
                  
               var html = "";
               html += '<span class="tag is-success is-large favorite-category">';
               html += inputText;
               html += '<button class="delete is-small"></button>';
               html += '</span>';
               $('.tags').append(html);
        }
    })
});

$(document).ready(function() {
    $("#search-gif-input").keyup(function(event) {
        if (event.which === 13) {
            $("#search-gif-btn").click();
        }
    });
});


searchInput.click(function(event){

console.log(event.key);
});

$('body').on('click','.tag',function(event){
    
    $(this).toggleClass("is-success");
    $(this).toggleClass("is-danger");

    if($(this).hasClass("is-danger")){
        disableTags.push($(this).text().trim().toLowerCase())
    } else{
        disableTags = disableTags.filter(function(disableTag){
            return disableTag == $(this).text().trim().toLowerCase();
        });
    }
    hideDisabledGifs ();
       console.log(disableTags);
    });

 $('body').on('click', '.tag .delete',function(event){
    event.stopPropagation();
    var category = $(this).parent().text().trim().toLowerCase();
    console.log ( category);

    displayedGifs = displayedGifs.filter(function(gif){
       return gif.category != category; 
    });
    updateGifsHtml();
    $(this).parent().remove();
 });   

$.getJSON({
url: "https://api.giphy.com/v1/gifs/trending?api_key=Jspd9p0ZDKLfqQlI3kAlVqk0iCEqDOCY",
success: function(res){
    var gifsData = res.data;
    var gifsWithCategory = gifsData.map(function(gif){
        var gifWithCategory = gif;
        gifWithCategory.category = "trending";

        return gifWithCategory;
    });
       displayedGifs = displayedGifs.concat(gifsWithCategory);
       updateGifsHtml();
   }
});

function hideDisabledGifs (){
    displayedGifs.forEach(function(gif){
       if(disableTags.indexOf(gif.category) >= 0){
        $("#" + gif.id).hide();
       } else{
        $("#" + gif.id).show();
       }
    });
};

function updateGifsHtml(){
    var html = ""; 
    shuffle(displayedGifs).forEach(function(gif){
        var url = gif.images.downsized_medium.url;
        var width = gif.images.downsized_medium.width;
        var height = gif.images.downsized_medium.height;

        html += "<div class='column is-one-quarter' id="+ gif.id +">";
        html += "<img src="+ url + "width=" + width + "height=" + height +"/>";
        html += "</div>";    

    });
    $("#gifs-container").html(html); 
};


function shuffle (array){
    var currentIndex;
    var swapElement;
    var randomIndex;

    for(currentIndex = 0; currentIndex < array.length; currentIndex++){
        randomIndex = Math.floor(Math.random() * array.length);
        swapElement = array[currentIndex];
        array[currentIndex]= array[randomIndex];
        array[randomIndex] = swapElement;
    }
    return array;
}

