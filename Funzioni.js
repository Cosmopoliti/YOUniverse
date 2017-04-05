/**
 * Created by Mattia on 04/04/2017.
 */
window.onload = function(e) {
    var opened = false;
    console.log(opened);

    var menu = document.getElementById("menu");
    var bottone= document.getElementById("myverycoolbutton");
    var wrapper=document.getElementById("principale");
    document.getElementById("myverycoolbutton").onclick = openMenu;

    function openMenu() {
        console.log(opened);
        if(opened){
            menu.className = "";
            bottone.className="";
            wrapper.className="wrapper";
            opened = false;
        }
        else{
            menu.className = " menu";
            bottone.className = "bottone"
            wrapper.className="abbassa"
            opened = true;
            console.log(opened);
        }
    };

}