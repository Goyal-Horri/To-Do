//Select Elements in DOM
document.getElementById("todo").style.display="none";
document.getElementById("motivation").style.display="block";
const form=document.querySelector("#itemForm");
const inputItem=document.querySelector("#inputItem");
const itemsList=document.querySelector("#itemsList");
const filters=document.querySelectorAll(".nav-item");
const alertDiv=document.querySelector("#message");
let tabValue="all";
let index=-1;

//Create an empty items list
let todoItems=[];

//Function returning HTML of loader
const getLoader=()=>{
    return `<div class="spinner-grow text-info" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`
}

//Function return quote objects(Fetch API)
const getQuote=async()=>{
    const response = await fetch("https://type.fit/api/quotes");
    if(response.status!=200){
        throw new Error(`Something went wrong, status code: ${response.status}`);
    }
    const quotes = await response.json();
    return quotes;
}

//On loading page
document.addEventListener('DOMContentLoaded',async()=>{
    document.getElementById("textHere").innerHTML=getLoader();//Inserting loader till quote loads
    const quotes= await getQuote("country");//Getting quotes 

    //Generating random quote
    let i=Math.floor(Math.random() * quotes.length)
    document.getElementById("textHere").innerText=quotes[i].text;
    document.getElementById("speakerName").innerText=(quotes[i].author===null?"Unknown":quotes[i].author);
    startTime = new Date();

    //Loading Progress
    var myInterval=setInterval(function(){
        endTime = new Date();
        elaspedTime=(endTime-startTime);
        document.getElementById("progress").style.width=`${elaspedTime/50}%`;
        if(elaspedTime>5000) clearInterval(myInterval);
    },100);

    //Changing page after 5 seconds(Quote to To-Do)
    setTimeout(function(){
        document.getElementById("motivation").style.display="none";
        document.getElementById("todo").style.display="block";
       }, 6000);

    form.addEventListener('submit',e=>{
        e.preventDefault();//To prevent from doing default work
        const itemName=inputItem.value.trim();
        inputItem.value="";
        if(itemName.length==0){
            alertMessage("Please Enter Something", "alert-danger");
        }
        else{
            if(index!=-1){
                //Update
                updateItem(index, itemName);
                index=-1;
                alertMessage("Item has been edited succesfully", "alert-success");
            }
            else{
                const itemObj={
                    name:itemName,
                    isDone: false,
                    addedAt: new Date().getTime(),
                };
                todoItems.push(itemObj);
                alertMessage("New item has been added succesfully", "alert-success");
            }
            setLocalStorage(todoItems);
            getList(todoItems);
        }
    });

    //Filter tabs
    filters.forEach(tab=>{
        tab.addEventListener('click', function(e){
            e.preventDefault();
            const tabType=this.getAttribute("data-type");
            document.querySelectorAll('.nav-link').forEach(nav=>{
                nav.classList.remove("active");
            })
            this.firstElementChild.classList.add("active");
            getItemsFilter(tabType);
            tabValue=tabType;
        })
    })

    //At first, load items from local Storage
    getLocalStorage();
});

const alertMessage=function(message, className){
    alertDiv.innerHTML=message;
    alertDiv.classList.add(className, "show");
    alertDiv.classList.remove("hide");
    setTimeout(() => {
        alertDiv.classList.remove("show", className);
        alertDiv.classList.add("hide");
    }, 1000);
}

const handleItem=function(itemData){
    const items= document.querySelectorAll(".list-group-item");
    items.forEach(item=>{
        if(item.querySelector(".title").getAttribute('data-time')==itemData.addedAt){
            //task is done
            item.querySelector('[data-done]').addEventListener('click', function(e){
                e.preventDefault();
                const currentClass=(itemData.isDone)?"bi-check-circle-fill":"bi-check-circle";
                itemData.isDone=(itemData.isDone)?false:true; 
                setLocalStorage(todoItems);
                const newClass=(itemData.isDone)?"bi-check-circle-fill":"bi-check-circle";
                this.firstElementChild.classList.replace(currentClass, newClass);
                getItemsFilter(tabValue);
            })

            //Edit task
            item.querySelector('[data-edit]').addEventListener('click', function(e){
                e.preventDefault();
                inputItem.value=itemData.name;
                index=todoItems.indexOf(itemData);
            }) 

            //Delete
            item.querySelector('[data-delete]').addEventListener('click', function(e){
                e.preventDefault();
                if(confirm("Are you sure to delete this task?")){
                    itemsList.removeChild(item);
                    let removeIndex=todoItems.indexOf(itemData);
                    todoItems.splice(removeIndex, 1);
                    setLocalStorage(todoItems);
                    alertMessage("Item has been deleted succesfully", "alert-success");
                }
            })
        }
    })
}
//Listing the items
const getList=function(todoItems){
    itemsList.innerHTML="";
    if(todoItems.length>0){
        todoItems.forEach(item => {
            const iconClass=item.isDone?"bi-check-circle-fill":"bi-check-circle";
            itemsList.insertAdjacentHTML("beforeend",`<li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="title" data-time="${item.addedAt}">${item.name}</span>
            <span>
                <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
                <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
                <a href="#" data-delete><i class="bi bi-trash icon-red red"></i></a>
            </span>
        </li>`);
        handleItem(item);
        });
    }
    else{
        itemsList.insertAdjacentHTML("beforeend",`<li class="list-group-item d-flex justify-content-between align-items-center">
            <span>No records found</span>
        </li>`);
    }
}

//get localStorage
const getLocalStorage=function(){
    const todoStorage=localStorage.getItem("todoItems");
    if(todoStorage===undefined || todoStorage===null){
        todoItems=[];
    }
    else{
        todoItems=JSON.parse(todoStorage);
    }
    getList(todoItems);
}

//set in local storage
const setLocalStorage=function(todoItems){
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

//filter items
const getItemsFilter=function(type){
    let  filterItems=[];
    switch(type){
        case "todo":
            filterItems=todoItems.filter(item=>(!item.isDone));
            break;
        case "done":
            filterItems=todoItems.filter(item=>(item.isDone));
            break;
        default:
            filterItems=todoItems;
    }
    getList(filterItems)
}

//Update item
const updateItem=function(index, value){
    const newItem=todoItems[index];
    newItem.name=value;
    todoItems.splice(index, 1, newItem);
}

// document.addEventListener('DOMContentLoaded', ()=>{
    
// });

