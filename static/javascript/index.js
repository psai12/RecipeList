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