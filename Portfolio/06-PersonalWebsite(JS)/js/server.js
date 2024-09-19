console.log("Running the script");

var forms= document.querySelector(".fagenda");
var table = document.getElementById("tagenda").getElementsByTagName("tbody")[0];

forms.addEventListener("submit", function(e) {
    e.preventDefault();

    var date = document.querySelector(".date").value;
    var tstart = document.querySelector(".timeS").value;
    var tend = document.querySelector(".timeE").value;
    var descr = document.querySelector(".activity").value;
    var place = document.querySelector(".place").value;
    var tipo = document.querySelector(".tipo").value;
    var note = document.querySelector(".notes").value;
    var colr= document.querySelector(".color").value;
    var fb = document.querySelector('input[name="free-busy"]:checked').value;

    var newrow = table.insertRow();
    var EspDate= newrow.insertCell(0);
    var EspTstart= newrow.insertCell(1);
    var EspTend= newrow.insertCell(2);
    var EspDesc= newrow.insertCell(3);
    var EspPlace= newrow.insertCell(4);
    var EspTipo= newrow.insertCell(5);
    var EspNote= newrow.insertCell(6);
    var EspColr= newrow.insertCell(7);
    var EspFb= newrow.insertCell(8);

    EspDate.textContent=date;
    EspTstart.textContent=tstart;
    EspTend.textContent=tend;
    EspDesc.textContent=descr;
    EspPlace.textContent=place;
    EspTipo.textContent=tipo;
    EspNote.textContent=note;
    EspColr.style.backgroundColor = colr;

    if(fb =="Free"){
        EspFb.innerHTML='<i class="fa-solid fa-dove"></i>';
    }else{
        EspFb.innerHTML='<i class="fa-solid fa-briefcase"></i>';
    }

    forms.reset();

});
