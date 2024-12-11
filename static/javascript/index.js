const form =document.getElementById('addrecipe');


if(form)
{
    form.onsubmit=async (e)=>{
        e.preventDefault();
        Validation()
        const fields=new FormData(e.target);
        const data=Object.fromEntries(fields.entries());
        const message=document.querySelector('.message');

        const response=await fetch('http://localhost:2001/createrecipe',{method:'POST',
            body:fields})

        if(response.ok)
            {
               const data= await response.json();
                message.innerText=data.message;
                return data;
            }    
          console.log("Response not ok!");  
    }
}

RecipesFetch();
async function RecipesFetch()
{
    const allrecipes=document.querySelector('.allrecipes');
    if(allrecipes)
    {
        const fetchRecipes=await fetch('http://localhost:2001/fetchrecipes',{method:'GET'});
        if(fetchRecipes.ok)
        {
            const data =await fetchRecipes.json();
            console.log(data)
            return data;
        }
        console.log("response issues");
    }
}

DeleteRecipe();
async function DeleteRecipe()
{
    const deleteBtn=document.querySelectorAll('.deleteicon');
    
    if(deleteBtn)
    {
        deleteBtn.forEach(e=>{
            e.onclick=async (e)=>{
                const id=document.getElementById("recipeid");
                const recipeid=id.getAttribute('data-id');
                const fetchRecipes=await fetch(`http://localhost:2001/${recipeid}/delete`,{method:'DELETE'});
                if(fetchRecipes.ok)
                {
                    const data =await fetchRecipes.json();
                    if(data.success)
                    {
                       window.location.reload();
                    }
                    return data;
                }
                console.log("response issues");
            }
        })
        
    }
} 

EditRecipe();
async function EditRecipe()
{
    const editRecipe=document.getElementById('editrecipe');
    
    const id=document.getElementById("recipeid");
    if(id)
        localStorage.setItem("recipeid",id.getAttribute('data-id'));


   
    if(editRecipe)
    { 
   
        editRecipe.onsubmit=async (e)=>{
            e.preventDefault();

            const fields=new FormData(e.target);
            fields.append("recipeid",localStorage.getItem("recipeid"));
            const data=Object.fromEntries(fields.entries());
            
            console.log(data);
            const fetchRecipes=await fetch(`http://localhost:2001/update`,{method:'PUT',body:fields});
            if(fetchRecipes.ok)
            {
                const data =await fetchRecipes.json();
                if(data.success)
                {
                   window.location.reload();
                }
                return data;
            }
            console.log("response issues");
        }
    }
} 

Search();
function Search()
{
    const search=document.querySelector('.search');


    if(search && window.location.pathname=="/")
    {
        search.addEventListener('input',async (e)=>{
            e.preventDefault();
        //     const response = await fetch(`http://localhost:2001/${e.target.value}`);
        //    const html = await response.text();
        //    console.log(html);
             window.location.href=`http://localhost:2001/${e.target.value}`
        })
       
    }
    if(search && window.location.pathname=="/deleterecipe")
        {
            search.addEventListener('input',async (e)=>{
                e.preventDefault();
            //     const response = await fetch(`http://localhost:2001/${e.target.value}`);
            //    const html = await response.text();
            //    console.log(html);
                 window.location.href=`http://localhost:2001/deleterecipe/${e.target.value}`
            })
           
        }
}

function Validation()
{
    const recipeName=document.querySelector('.recipename');
    const recipeIngredient=document.querySelector('.ingredient');
    const message=document.querySelector('.message');

    if(recipeName && !recipeName.value)
    {
        recipeName.placeholder="Write Name";
    }

    if(recipeIngredient && !recipeIngredient.value)
    {
        recipeIngredient.placeholder="Write Ingredient";
    }
    if(message)
    {
        message.innerText="Insert Image";
        return;
    }
}