const form =document.getElementById('addrecipe');


if(form)
{
    form.onsubmit=async (e)=>{
        e.preventDefault();
        const fields=new FormData(e.target);
        const data=Object.fromEntries(fields.entries());
        
        const response=await fetch('http://localhost:2001/createrecipe',{headers:{"Content-Type":"application/json"},method:'POST',
            body:data})
    }
}