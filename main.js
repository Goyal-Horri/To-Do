function update(){
    let tableBody=document.getElementById("tableBody");
    let str="";
    let itemJSONArrayStr=localStorage.getItem('itemsJson');
    let itemJSONArray=JSON.parse(itemJSONArrayStr);
    if(itemJSONArray!=null){
        itemJSONArray.forEach((x, index)=>{
            str+=`
                <tr>
                    <th scope="row">${index+1}</th>
                    <td>${x[0]}</td>
                    <td>${x[1]}</td>
                    <td><button class="btn btn-primary btn-sm" onclick="deleted(${index})">Delete</button></td>
                </tr>`;
        });
    }
    tableBody.innerHTML=str;
}
let add=document.getElementById("add");
add.addEventListener("click",function(){
    let tit=document.getElementById('title').value;
    let desc=document.getElementById('description').value;
    if(tit.trim().length){
        document.getElementById('description').value=null;
        document.getElementById('title').value=null;
        if(localStorage.getItem('itemsJson')==null){
            itemJSONArray=[];
            itemJSONArray.push([tit, desc]);
            localStorage.setItem('itemsJson', JSON.stringify(itemJSONArray));
        }
        else{
            itemJSONArrayStr=localStorage.getItem('itemsJson');
            itemJSONArray=JSON.parse(itemJSONArrayStr);
            itemJSONArray.push([tit, desc]);
            localStorage.setItem('itemsJson', JSON.stringify(itemJSONArray));
        }
        update();
    }
    else{
        alert("Enter a Title");
    }
});
let clearList=document.getElementById("clearList");
clearList.addEventListener("click",function(){
    if(confirm("Do you really wanna Clear?")){
        localStorage.clear();
        update();
    }
});
update();
function deleted(ind){
    itemJSONArrayStr=localStorage.getItem('itemsJson');
    itemJSONArray=JSON.parse(itemJSONArrayStr);
    itemJSONArray.splice(ind, 1);
    localStorage.setItem('itemsJson', JSON.stringify(itemJSONArray));
    update();
}

const getLoader=()=>{
    return `<div class="spinner-grow text-info" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`
}

const getQuote=async()=>{
    const response = await fetch("https://type.fit/api/quotes");
    if(response.status!=200){
        throw new Error(`Something went wrong, status code: ${response.status}`);
    }
    const quotes = await response.json();
    return quotes;
}

document.getElementById("todo").style.display="none";
document.getElementById("motivation").style.display="block";
document.addEventListener('DOMContentLoaded',async()=>{
    document.getElementById("textHere").innerHTML=getLoader();
    const quotes= await getQuote("country");
    let i=Math.floor(Math.random() * quotes.length)
    document.getElementById("textHere").innerText=quotes[i].text;
    document.getElementById("speakerName").innerText=quotes[i].author;
    startTime = new Date();
    var myInterval=setInterval(function(){
        // console.log("Hello");
        endTime = new Date();
        elaspedTime=(endTime-startTime);
        document.getElementById("progress").style.width=`${elaspedTime/50}%`;
        if(elaspedTime>5000) clearInterval(myInterval);
    },100);
    setTimeout(function(){
        document.getElementById("motivation").style.display="none";
        document.getElementById("todo").style.display="block";
       }, 6000);
});