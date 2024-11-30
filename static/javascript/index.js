const form =document.getElementById('addrecipe');


if(form)
{
    form.onsubmit=(e)=>{
        const fields=new FormData(e.target);
        const data=Object.fromEntries(fields.entries());

        console.log(data);
    }
}