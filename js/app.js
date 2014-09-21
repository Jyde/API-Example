// create a search Manager to handle user search request
var searchManager = {

	// totalPages:0,
	page:1,
	root:'http://it-ebooks-api.info/v1/',
	searchParameter:'search/',
	moreBooks: '&page=',
	searchBook:'book/',
	findEbook:null,
	searchEbook:null,
	warning: null,
	eBook:null,

	onReady: function(){
			searchManager.findEbook = $('#findEbook');
			searchManager.searchEbook = $('#searchEbook');
			searchManager.submitSearch();
			searchManager.warning = $('#warning');
			$('#bookShelf').on('click', 'li h3 a', searchManager.bookDetails);
			$('#bookDetails').hide();
			$('#loader').hide();
			$('#bookDetails').hide();
		},

		submitSearch:function(){
					searchManager.searchEbook.click(searchManager.validateInput);
		},
		validateInput: function(e){
				searchManager.eBook = searchManager.findEbook.val();
				searchManager.warning.text('');
				if(searchManager.eBook)
				{
					searchManager.eBook = searchManager.eBook.trim();
						if(searchManager.eBook.length>1){
							searchManager.searchEvent();
							$('#loader').fadeIn(100)
							return;
						}
				}
				searchManager.warning.text('You made an invalid input');
				e.preventDefault();
		},
		searchEvent: function(){
			// example of GET request : http://it-ebooks-api.info/v1/search/php&page=2 
			$.getJSON(searchManager.root+searchManager.searchParameter+searchManager.eBook+searchManager.moreBooks+searchManager.page, function(response){
					searchManager.loadBooks(response, '#bookShelf');
			});						
		},
		loadBooks: function(result, shelf) {
				
				console.log(result);
				$('#bookShelf').show();
				$('#bookDetails').hide();
				var bookCell = '';
				// Result shows basic search information of total items found,time taken number of items and the books general information
				$error = result.Error;				

				$totalBooks = result.Total;
				$timeTaken = result.Time;
				$page = result.Page;
				$error = result.Error;

				$('span.notice').text("Total items found: "+ $totalBooks+" in "+$timeTaken+"s" )

				// $(shelf).append(searchManager.$preloader);
				if ($error !== "0" || $totalBooks === "0"){
					
					$(shelf).html('<p id="errorImg"><img src="img/404-error.png"/></br> Sorry! Book was not found</p>');
					$('#loader').fadeIn(100);
					searchManager.warning.text('Book was not found! Try refining your search');
					$('#loader').fadeOut(100);					
				}
				else
				{
				
				$.each(result.Books, function(){
					var book = this;
				// create a list element to ontain related data from the found book
						$bookID = book.ID;
						$cell = '<li>';
						$img = '<p class="imgBook"><img src="'+book.Image+'"></p>';
						$title ='<h3><a id="'+$bookID+'" href="'+$bookID+'">'+book.Title+'</a></h3>';
						$Description = '<p class="bookDescription">'+book.Description+'</p>';
						$url = '<p class="bookUrl">'+searchManager.root+searchManager.searchBook+$bookID+'</p>';
						bookCell += $cell + $img + $title + $Description + $url + '</li>';
					} );
						$(shelf).empty();
						$(shelf).append(bookCell);
						$('#loader').hide();
						searchManager.paging()
			}
		},

		paging: function(){
			    $("#compact-pagination").pagination({
			    selectOnClick:true,
        		items: $totalBooks,
        		itemsOnPage: 10,
        		cssStyle: "compact-theme",
        		onPageClick: function($page){
        			searchManager.page = $page;
					searchManager.searchEvent();
        		}
    		});
		},

		bookDetails: function(event){
				event.preventDefault();
				$('#loader').show()
				$('#bookShelf').hide();
				$('#bookDetails').show();
				readInfo = $(this).attr('href');
				//bookDetails = null;
				$.getJSON(searchManager.root+searchManager.searchBook+readInfo, function(response){
					searchManager.bookInfo(response,'#bookDetails');
					// console.log(response)
			});

		},

		bookInfo :function(response, detailContainer){

			var	details = response;
				$heading ='<h2 class="Heading">'+details.Title+'</h2>';
				$img ='<p class="bookImg"><img src="'+details.Image+'" alt="E-book Image"></p>';
				$desc ='<p class="bookDescription"><h4>Book Description</h4>'+details.Description+'</p>';
				$bookDet = '<p><h4>Book Details</h4></p>'

				p = '<p class="subDetails">';
				label ='<p><label>';
				publisher= label+'Publisher: </label>'+details.Publisher+'</p>';
				by = label+'By: </label>'+details.Author+'</p>';
				year = label+'Year: </label>'+details.Year+'</p>';
				pages = label+'Pages: </label>'+details.Page+'</p>';
				language = label+'Language: </label>English</p>';
				format = label+'File Format: </label>PDF</p>';
				pClose = '</p>';

				download ='<a href="'+details.Download+'"><button class="pdf">Download</button></a>'

				$(detailContainer).empty();
				$(detailContainer).append($heading+$img+$desc+$bookDet+ p +publisher+by+year+pages+language+format+pClose+download);
				$('#loader').hide()
			},

}

$(document).ready(searchManager.onReady);