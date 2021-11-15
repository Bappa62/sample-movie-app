const API_KEY='api_key=19a8c78d739d9b9d300281c3d876bd80';
const BASE_URL='https://api.themoviedb.org/3';
const API_URL=BASE_URL+'/discover/movie?sort_by=popularity.desc&'
+API_KEY;
const IMG_URL='https://image.tmdb.org/t/p/w500';

const SEARCH_URL=BASE_URL+'/search/movie?'+API_KEY;

const genres=  [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
] 

const main=document.getElementById('main');
const form=document.getElementById('form');
const search=document.getElementById('search');
const tagsEl=document.getElementById('tags');

const prev=document.getElementById('prev');
const next=document.getElementById('next');
const current=document.getElementById('current');

var currentpage=1;
var nextpage=2;
var prevpage=3;
var lastUrl='';
var totalpages=100; 


var selectedGenre = [];
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')));
            highlightsection();
        })
        tagsEl.append(t);
    })
}


function highlightsection() {
  
const tags=document.querySelectorAll('.tag');
tags.forEach(tag=>{
  tag.classList.remove('highlight');
})
   
  clrBtn();
  if(selectedGenre.length!=0)
    {
       selectedGenre.forEach(id=>{
         const highlightTag=document.getElementById(id);
         highlightTag.classList.add('highlight');
       })
    }
}

function clrBtn(){
  
   let But=document.getElementById('clear');
    if(But)
    {
       But.classList.add('highlight');
    }
    else
    {
     let clear=document.createElement('div');
     clear.classList.add('tag','highlight');
     clear.id='clear';
     clear.innerText='Clear All';
     clear.addEventListener('click',()=> {
       selectedGenre=[];
       setGenre();
       getMovies(API_URL);
     })
     tagsEl.append(clear);
    }

}

    getMovies(API_URL);
    function getMovies(url) {
      lastUrl=url;
    fetch(url).then(res => res.json()).then(data=>
        {
             console.log(data.results)
             if(data.results.length!=0)
             {
               showMovies(data.results);
               currentpage=data.page;
               nextpage=currentpage+1;
               prevpage=currentpage-1;
               totalpages=data.total_pages;
               current.innerText=currentpage;
               if(currentpage<=1)
               {
                 prev.classList.add('disabled');
                 next.classList.remove('disabled');
               }
               else if(currentpage>=totalpages){
                      prev.classList.remove('disabled');
                      next.classList.add('disabled');
               }
               else
               {
                   prev.classList.remove('disabled');
                   next.classList.remove('disabled');
               }

               tagsEl.scrollIntoView({behavior:"smooth"});  
             }
             else
             main.innerHTML='<h1 class="No">No Results Found</h1>'
        })
}

function showMovies(data){

    main.innerHTML=' ';
     data.forEach(movie=>
        {
             const {title,poster_path,vote_average,overview}= movie;
             const movieEl=document.createElement('div');
             movieEl.classList.add('movie');
             movieEl.innerHTML =`
             <img src="${poster_path ? IMG_URL+poster_path : "http://via.placeholder.com/1280x1680"}" alt="${title}">
             <div class="movie-info">
              <h3>${title}</h3>
              <span class="${getcolor(vote_average)}">${vote_average}</span>
              </div>
 
             <div class="overview">
                 <h3>Overview</h3>
                 ${overview}
                </div>
             `

             main.appendChild(movieEl);

        })

     
}

function getcolor(vote) {

    if(vote>=8){
    return "green"
    }
    else if(vote>=5){
    return "yellow"
    }
    else{
    return "red"
    }

    
}


form.addEventListener('submit' , (e)=>{

    e.preventDefault();

    const searchItem=search.value;
    selectedGenre=[];
    highlightsection();
    if(searchItem)
    {
         getMovies(SEARCH_URL+'&query='+searchItem)
    }
    else{
        getMovies(API_URL);   
    }
    
   // searchItem.classList.remove('clear');
})

prev.addEventListener('click',()=>{
  if(prevpage>0){
      pagecall(prevpage);
  }

})


next.addEventListener('click',()=>{
  if(nextpage<=totalpages){
      pagecall(nextpage);
  }

})

  function pagecall(page) {
  let urlsplit=lastUrl.split('?');
  let quaryparams=urlsplit[1].split('&');
  let key=quaryparams[quaryparams.length-1].split('=');
   if(key[0]!='page')
   {
      let url=lastUrl+'&page='+page;
      getMovies(url);
   }
   else{
     key[1]=page.toString();
     let a=key.join('=');
     quaryparams[quaryparams.length-1]=a;
     let b=quaryparams.join('&');
     let url=urlsplit[0]+'?'+b
     getMovies(url);
   }

}