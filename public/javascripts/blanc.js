

//const fetch = require('node-fetch');
//const fetch = require('node-fetch');
//import fetch from 'node-fetch';

var element = document.getElementById('getElementsResult');
//element.textContent = getDocumentElements();


async function getElements ()
{
let response = await fetch('/api/elements');
if (response.ok) { 
    let responseText = await response.text();
    console.log (responseText);
    return responseText;
  } else {
    alert("Ошибка HTTP: " + response.status);
    return response.status;
  }
};
      
element = getElements();


