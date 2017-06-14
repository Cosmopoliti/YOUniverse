window.onload = function(e) {
// Get the modal
    var modal = document.getElementById("myModal");
    var modal2 = document.getElementById("modalLog");

// Get the button that opens the modal
    var btn = document.getElementById("Iscrizione");
    var btn3 = document.getElementById("Log");

// Get the <span> element that closes the modal
    var btn2 = document.getElementById("close");
    var btn4 = document.getElementById("close2");


// When the user clicks on the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    };
    btn3.onclick = function () {
        modal2.style.display = "block";
    };

// When the user clicks on cancel, close the modal
    btn2.onclick = function () {
        modal.style.display = "none";
    };
    btn4.onclick = function () {
        modal2.style.display = "none";
    };


};