const form =document.getElementById('addrecipe');


if(form)
{
    form.onsubmit=async (e)=>{
        e.preventDefault();
        const fields=new FormData(e.target);
        const data=Object.fromEntries(fields.entries());
        
        const response=await fetch('http://localhost:2001/createrecipe',{method:'POST',
            body:fields})

        if(response.ok)
            {
               const data= await response.json();
                console.log(data);
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
    const deleteBtn=document.querySelector('.deleteicon');
    
    if(deleteBtn)
    {
        deleteBtn.onclick=async (e)=>{
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
