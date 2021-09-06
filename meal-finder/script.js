const search=document.getElementById('search');
const submit=document.getElementById('submit');
const random=document.getElementById('random');
const mealEl=document.getElementById('meals');
const resultHeading=document.getElementById('result-heading');
const single_meal=document.getElementById('single-meal');

//searchMeal
function searchMeal(e){
    e.preventDefault();
    //clear single meal
    single_meal.innerHTML="";

    //get search Meal
    const term=search.value;

    //check for empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`).then(res=>res.json())
        .then((data)=>
        {
            resultHeading.innerHTML=`<h2>Search Result for ${term} </h2>`;
            if(data.meals==null){
                resultHeading.innerHTML=`<h2>There are no Results for ${term} </h2>`
                mealEl.innerHTML="";
            }
            else{
                mealEl.innerHTML=data.meals.map(
                    (meal)=>`
                    <div class="meal">
                    <img src="${meal.strMealThumb}" alt ="${meal.strMeal}">
                    <div class="meal-info" data-mealId="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                    </div>
                    </div>
                    `
                )
                .join("");
            }
        });
    }
    else{
        alert('please insert a value in Search');
    }
}
//fetch meal by id
function getMealById(mealId){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res=>res.json()).then(data=>{
       
        const meal=data.meals[0];
        addMealToDOM(meal);
    });
}
//randomMeal
function randomMeal(){
    mealEl.innerHTML="";
    resultHeading.innerHTML="";
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res=>res.json()).then(data=>{
        const meal=data.meals[0];
        addMealToDOM(meal);
    })
}
//addMealToDOM
function addMealToDOM(meal){
const ingredients=[];
for(let i=1;i<=20;i++){
    if(meal[`strIngredient${i}`]){
        ingredients.push(`
        ${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}
        `);
    }
    else{
        break;
    }
}
single_meal.innerHTML=`
<div class="single-meal">
<h1>${meal.strMeal}</h1>
<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
<div class="single-meal-info">
${meal.strCategory ? `<p>${meal.strCategory}</p>`:''}
${meal.strArea ? `<p>${meal.strArea}</p>`:''}
</div>
<div class="main">
<h2>Ingredients</h2>
<ul>
${ingredients.map(ing=>`<li>${ing}</li>`).join('')}
</ul>
<p>${meal.strInstructions}</p>

</div>
</div>
`
}

//event listeners

submit.addEventListener('submit',searchMeal);
random.addEventListener('click',randomMeal);
mealEl.addEventListener('click',e=>{
    const mealInfo=e.path.find((item)=>{
        console.log(item);
        if(item.classList){
            
            return item.classList.contains("meal-info");
        }
        else{
            return false;
        }
    });
    if(mealInfo){
        const mealId=mealInfo.getAttribute("data-mealid");
        getMealById(mealId);
    }
})