var date = new Date();
var curDate = [date.getMonth(), date.getFullYear()];
var months = [{days: 31, month:"Janeiro"}, 
             {days: 28, month:"Fevereiro"}, 
             {days: 31, month:"Março"},
             {days: 30, month:"Abril"},
             {days: 31, month:"Maio"},
             {days: 30, month:"Junho"},
             {days: 31, month:"Julho"},
             {days: 31, month:"Agosto"},
             {days: 30, month:"Setembro"},
             {days: 31, month:"Outubro"},
             {days: 30, month:"Novembro"},
             {days: 31, month:"Dezembro"}];
var blocksInfo = [];
var calendarEvents = [];
var username;
for(var i = 0; i < 42; i++){
    blocksInfo[i] = {day: 0, month:0};
}

window.onload=function(){
    username = user.username;
    if(user.events[0] != null){
        calendarEvents = JSON.parse(user.events);
    }
    console.log(calendarEvents);
    var blockTr;
    var blocks = document.getElementsByClassName("day");
    var curDateSpan = document.getElementById("curMonth");
    var btPrev = document.getElementById("prevMonth");
    var btNext = document.getElementById("nextMonth");
    var btCalendar = document.getElementById("showCalendar");
    var btEventList = document.getElementById("showEvents");
    var btAddEvent = document.getElementById("addEvent");
    var btEditEvent = document.getElementById("editEvent");
    var btRemoveEvent = document.getElementById("removeEvent");
    var btSaveAdd;
    var btSaveEdit;
    var selectedEvent = null;

    initCalendar();
    setCalendar(curDateSpan);

    for(var i = 0; i < 42; i++){
        blocks[i].setAttribute("id", i)
        blocks[i].addEventListener("click", event => {
            if(event.target.classList.contains("day")){
                blockTr = event.target.id;
                $("#eventModal").modal();
            }
        });
    }
    
    btPrev.onclick=function(){
        prevMonth(curDateSpan)
    }

    btNext.onclick=function(){
        nextMonth(curDateSpan);
    }

    btCalendar.onclick=function(){
        $("#calendar").removeClass("d-none");
        $("#header").removeClass("d-none");
        $("#events").addClass("d-none");
        setCalendar(curDateSpan);
        selectedEvent = null;
    }

    btEventList.onclick=function(){
        $("#calendar").addClass("d-none");
        $("#header").addClass("d-none");
        $("#events").removeClass("d-none");
        showEvents();
        selectedEvent = null;
    }

    btAddEvent.onclick=function(){
        btSaveAdd = addEvent();
        btSaveAdd.onclick=function(){
            var dayValue = document.getElementById("day").value;
            var monthValue = document.getElementById("month").value;
            var yearValue = document.getElementById("year").value;
            var startValue = document.getElementById("start").value;
            var endValue = document.getElementById("end").value;
            var descriptionValue = document.getElementById("description").value;
            if(validadeEvent(dayValue, monthValue, yearValue, startValue, endValue)){
                var id = yearValue.concat(monthValue, dayValue, startValue, endValue);
                console.log(id);
                var index = calendarEvents.push({id:'', day:'', month:'', year:'', start:'', end:'', description:''});
                calendarEvents[index-1] = {id: id, 
                                            day: dayValue, 
                                            month: monthValue-1, 
                                            year: yearValue, 
                                            start: startValue, 
                                            end: endValue, 
                                            description: descriptionValue};
                calendarEvents.sort(function(a,b){
                    var x = parseInt(a.id.split(":")[0]);
                    var y = parseInt(b.id.split(":")[0]);
                    if(x > y) {
                        return 1;
                    }
                    if(x < y){
                        return -1;
                    }
                    return 0;
                })
                sendUpdate();
                selectedEvent = null;
            }
        }
    }

    btEditEvent.onclick=function(){
        console.log(selectedEvent);
        btSaveEdit = editEvent(selectedEvent);
        btSaveEdit.onclick=function(){
            var dayValue = document.getElementById("day").value;
            var monthValue = document.getElementById("month").value;
            var yearValue = document.getElementById("year").value;
            var startValue = document.getElementById("start").value;
            var endValue = document.getElementById("end").value;
            var descriptionValue = document.getElementById("description").value;
            if(validadeEvent(dayValue, monthValue, yearValue, startValue, endValue)){
                var id = yearValue.concat(monthValue, dayValue, startValue, endValue);
                console.log(id);
                for(var i = 0; i < calendarEvents.length; i++){
                    if(calendarEvents[i].id == selectedEvent){
                        calendarEvents[i] = {id: id, 
                                            day: dayValue, 
                                            month: monthValue-1, 
                                            year: yearValue, 
                                            start: startValue, 
                                            end: endValue, 
                                            description: descriptionValue};
                        break;
                    }
                }
                calendarEvents.sort(function(a,b){
                    var x = parseInt(a.id.split(":")[0]);
                    var y = parseInt(b.id.split(":")[0]);
                    if(x > y) {
                        return 1;
                    }
                    if(x < y){
                        return -1;
                    }
                    return 0;
                })
                sendUpdate();
                selectedEvent = null;
            }
        }
    }

    btRemoveEvent.onclick=function(){
        if(selectedEvent != null){
            for(var i = 0; i < calendarEvents.length; i++){
                if(calendarEvents[i].id == selectedEvent){
                    calendarEvents.splice(i, 1);
                    break;
                }
            }
            sendUpdate();
        }
    }

    $(document).on('click',".event-list",function(event){
        var id = event.target.id;
        $(".event-list").removeClass("selected-event");
        var select = document.getElementById(id)
        select.classList.add("selected-event");
        selectedEvent = id;
    });

    $("#eventModal").on('show.bs.modal', function() {
        var blockDay = {day: blocksInfo[blockTr].day, month: blocksInfo[blockTr].month};
        $("#modalHeader").text(blockDay.day+" de "+months[blockDay.month].month+" de "+curDate[1]);
        
        var dayEvents = getEvents(blockDay.day, blockDay.month, curDate[1]);
        $("#modalBody").html("");
        for(var j = 0; j < dayEvents.length; j++){
            $("#modalBody").append(dayEvents[j].start+"-"+dayEvents[j].end+": "+dayEvents[j].description+"<br>");
        }
    });
}

function initCalendar(){
    var curBlock = 0;
    while(1){
        if(curBlock%7 == date.getDay() && curBlock >= date.getDate()-1){
            break;
        }
        curBlock++;
    }
    var curDay = date.getDate();
    var aux = curDay;
    var month = date.getMonth();
    for(var i = curBlock; i < 42; i++, aux++){
        if(aux > months[curDate[0]].days){
            aux = 1;
            month = (month+1)%12;
        }
        blocksInfo[i].day = aux;
        blocksInfo[i].month = month;
    }
    if(curBlock > 0){
        aux = curDay;
        month = date.getMonth();
        for(var i = curBlock; i >= 0; i--, aux--){
            if(aux <= 0){
                if(curDate[0] > 0){
                    aux = months[curDate[0]-1].days;
                    month = curDate[0]-1;
                }
                else{
                    aux = months[11].days;
                    month = 11;
                }
            }
            blocksInfo[i].day = aux;
            blocksInfo[i].month = month;
        }
    }
}

function setCalendar(curDateSpan){
    var blocks = document.getElementsByClassName("day");
    for(var i = 0; i < 42; i++) {
        blocks[i].classList.remove('curDay')
        if(blocksInfo[i].month !== curDate[0]){
            blocks[i].classList.add('d-none','d-sm-inline-block','text-muted','bg-light');
        }
        else{
            blocks[i].classList.remove('d-none','d-sm-inline-block','text-muted','bg-light');
        }
        if(blocksInfo[i].day === date.getDate() && blocksInfo[i].month === date.getMonth()){
            blocks[i].classList.add('curDay')
        }
        blocks[i].innerHTML = `<h5 class="row align-items-center"> <span class="date col-1">${blocksInfo[i].day}</span></h5>`
        blocks[i].innerHTML += `<span id="info-${blocksInfo[i].day}-${blocksInfo[i].month}" class="overflow-auto info-day"></span>`
        var dayEvents = getEvents(blocksInfo[i].day, blocksInfo[i].month, curDate[1]);
        var id = "#info-"+blocksInfo[i].day+"-"+blocksInfo[i].month;
        //console.log(id);
        for(var j = 0; j < dayEvents.length; j++){
            $(id).append(dayEvents[j].start+"-"+dayEvents[j].end+": "+dayEvents[j].description+"<br>");
        }
    }
    curDateSpan.innerHTML = months[curDate[0]].month + " de " + curDate[1];
}

function nextMonth(curDateSpan){
    if(curDate[0] < 11) {
        curDate[0]++;
    }
    else {
        curDate[0] = 0;
        curDate[1]++;
    }
    var firstWeek = [];
    var beganMonth = false;
    var auxDay = {day:blocksInfo[28].day, month:blocksInfo[28].month};
    while(!beganMonth){
        for(var i = 0; i < 7; i++){
            firstWeek[i] = {day:0, month:0};
            if(auxDay.day > months[auxDay.month].days){
                auxDay.day = 1;
                if(auxDay.month === 11){
                    auxDay.month = 0;
                }
                else{
                    auxDay.month++;
                }
            }
            if(auxDay.day === 1){
                beganMonth = true;
            }
            firstWeek[i].day = auxDay.day;
            firstWeek[i].month = auxDay.month;
            auxDay.day++;
        }
    }
    auxDay = {day:firstWeek[6].day, month:firstWeek[6].month};
    for(var i = 0; i < 42; i++){
        if(i < 7){
            blocksInfo[i].day = firstWeek[i].day;
            blocksInfo[i].month = firstWeek[i].month;
        }
        else{
            auxDay.day++;
            if(auxDay.day > months[auxDay.month].days){
                auxDay.day = 1;
                if(auxDay.month == 11){
                    auxDay.month = 0;
                }
                else{
                    auxDay.month++;
                }
            }
            blocksInfo[i].day = auxDay.day;
            blocksInfo[i].month = auxDay.month;
        }
        console.log(blocksInfo[i]);
    }
    setCalendar(curDateSpan);
}

function prevMonth(curDateSpan){
    if(curDate[0] > 0) {
        curDate[0]--;
    }
    else {
        curDate[0] = 11;
        curDate[1]--;
    }
    var firstWeek = [];
    var beganMonth = false;
    var auxDay = {day:blocksInfo[6].day, month:blocksInfo[6].month};
    while(!beganMonth){
        for(var i = 6; i >= 0; i--){
            firstWeek[i] = {day:0, month:0};
            if(auxDay.day < 1){
                if(auxDay.month == 0){
                    auxDay.month = 11;
                }
                else{
                    auxDay.month--;
                }
                auxDay.day = months[auxDay.month].days;
            }
            if(auxDay.day === 1 && auxDay.month === curDate[0]){
                beganMonth = true;
            }
            firstWeek[i].day = auxDay.day;
            firstWeek[i].month = auxDay.month;
            auxDay.day--;
        }
    }
    auxDay = {day:firstWeek[6].day, month:firstWeek[6].month};
    for(var i = 0; i < 42; i++){
        if(i < 7){
            blocksInfo[i].day = firstWeek[i].day;
            blocksInfo[i].month = firstWeek[i].month;
        }
        else{
            auxDay.day++;
            if(auxDay.day > months[auxDay.month].days){
                auxDay.day = 1;
                if(auxDay.month == 11){
                    auxDay.month = 0;
                }
                else{
                    auxDay.month++;
                }
            }
            blocksInfo[i].day = auxDay.day;
            blocksInfo[i].month = auxDay.month;
        }
        console.log(blocksInfo[i]);
    }
    setCalendar(curDateSpan);
}

function showEvents(){
    $("#eventContainer").html("");
    for(var i = 0; i < calendarEvents.length; i++){
        console.log(calendarEvents[i]);
        var text = calendarEvents[i].day+
                   " de "+months[calendarEvents[i].month].month+
                   " de "+calendarEvents[i].year+
                   " - "+calendarEvents[i].start+
                   "-"+calendarEvents[i].end+
                   ": "+calendarEvents[i].description;
        $("#eventContainer").append("<h4 id="+calendarEvents[i].id+" class=\"event-list\">"+text+"</h4><br>");
    }
}

function addEvent(){
    var container = document.getElementById("eventContainer");
    container.innerHTML = "<label for=\"day\" class=\"sr-only display-inline \">Dia</label>";
    container.innerHTML += "<input id=\"day\" class=\"display-inline\" placeholder=\"Dia(1-30)\" required autofocus></input>";
    container.innerHTML += "<label for=\"month\" class=\"sr-only display-inline\">Mês</label>";
    container.innerHTML += "<input id=\"month\" class=\"display-inline\" placeholder=\"Mês(1-12)\" required autofocus></input>";
    container.innerHTML += "<label for=\"year\" class=\"sr-only display-inline\">Ano</label>";
    container.innerHTML += "<input id=\"year\" class=\"display-inline\" placeholder=\"Ano\" required autofocus></input>";
    container.innerHTML += "<label for=\"start\" class=\"sr-only display-inline\">Início</label>";
    container.innerHTML += "<input id=\"start\" class=\"display-inline\" placeholder=\"Início(hh:mm)\" required autofocus></input>";
    container.innerHTML += "<label for=\"end\" class=\"sr-only display-inline\">Fim</label>";
    container.innerHTML += "<input id=\"end\" class=\"display-inline\" placeholder=\"Fim(hh:mm)\" required autofocus></input>";
    container.innerHTML += "<input id=\"description\" class=\"form-control\" placeholder=\"Descrição\" required autofocus></input>"
    container.innerHTML += "<p id=\"addMessage\"></p>"
    container.innerHTML += "<button id=\"saveAdd\" class=\"btn btn-success\">Salvar</button>";
    return document.getElementById("saveAdd");
}

function editEvent(selectedEvent){
    var selected = getEventByID(selectedEvent);
    console.log(selected);
    if(selected != null){
        var text = selected.day+
                    " de "+months[selected.month].month+
                    " de "+selected.year+
                    " - "+selected.start+
                    "-"+selected.end+
                    ": "+selected.description;
        var container = document.getElementById("eventContainer");
        container.innerHTML = "<h4>"+text+"</h4><br>"
        container.innerHTML += "<label for=\"day\" class=\"sr-only display-inline \">Dia</label>";
        container.innerHTML += "<input id=\"day\" class=\"display-inline\" placeholder=\"Dia(1-30)\" required autofocus></input>";
        container.innerHTML += "<label for=\"month\" class=\"sr-only display-inline\">Mês</label>";
        container.innerHTML += "<input id=\"month\" class=\"display-inline\" placeholder=\"Mês(1-12)\" required autofocus></input>";
        container.innerHTML += "<label for=\"year\" class=\"sr-only display-inline\">Ano</label>";
        container.innerHTML += "<input id=\"year\" class=\"display-inline\" placeholder=\"Ano\" required autofocus></input>";
        container.innerHTML += "<label for=\"start\" class=\"sr-only display-inline\">Início</label>";
        container.innerHTML += "<input id=\"start\" class=\"display-inline\" placeholder=\"Início(hh:mm)\" required autofocus></input>";
        container.innerHTML += "<label for=\"end\" class=\"sr-only display-inline\">Fim</label>";
        container.innerHTML += "<input id=\"end\" class=\"display-inline\" placeholder=\"Fim(hh:mm)\" required autofocus></input>";
        container.innerHTML += "<input id=\"description\" class=\"form-control\" placeholder=\"Descrição\" required autofocus></input>"
        container.innerHTML += "<p id=\"addMessage\"></p>"
        container.innerHTML += "<button id=\"saveEdit\" class=\"btn btn-success\">Salvar</button>";
        console.log(document.getElementById("saveEdit"));
        return document.getElementById("saveEdit");
    }
    
}

function getEventByID(ID){
    console.log(ID);
    if(!ID){
        return null;
    }
    var aux = {id:'', day:'', month:'', year:'', start:'', end:'', description:''};
    for(var i = 0; i < calendarEvents.length; i++){
        if(calendarEvents[i].id == ID){
            aux = {id: ID, 
                   day: calendarEvents[i].day, 
                   month: calendarEvents[i].month, 
                   year: calendarEvents[i].year, 
                   start: calendarEvents[i].start, 
                   end: calendarEvents[i].end, 
                   description:calendarEvents[i]. description};
            return aux;
        }
    }
}

function validadeEvent(dayValue, monthValue, yearValue, startValue, endValue, descriptionValue){
    var message = document.getElementById("addMessage");
    if(dayValue == "" || monthValue == "" || yearValue == "" || startValue == "" || endValue == "" || descriptionValue == ""){
        message.innerHTML = "Campos vazios";
        return false;
    }
    else if(parseInt(dayValue) > 31 || parseInt(dayValue) < 1 || isNaN(parseInt(dayValue)) || !Number.isInteger(parseInt(dayValue))){
        message.innerHTML = "Data incorreta";
        return false;
    }
    else if(parseInt(monthValue) > 12 || parseInt(monthValue) < 1 || isNaN(parseInt(monthValue)) || !Number.isInteger(parseInt(monthValue))){
        message.innerHTML = "Mês incorreto";
        return false;
    } 
    else if(isNaN(parseInt(yearValue)) || !Number.isInteger(parseInt(yearValue))){
        message.innerHTML = "Ano incorreto";
        return false;
    }
    else if(startValue.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/) == null || endValue.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/) == null){
        message.innerHTML = "Horários incorretos";
        return false;
    }
    return true;   
}

function sendUpdate(){
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "/calendarUpdate", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var info = "username="+username+"&events="+JSON.stringify(calendarEvents);
    ajax.send(info);
}

function getEvents(day, month, year){
    var dayEvents = [];
    var index = 0;
    for(var i = 0; i < calendarEvents.length; i++){
        if(parseInt(calendarEvents[i].day) == day && parseInt(calendarEvents[i].month) == month && parseInt(calendarEvents[i].year) == year){
            dayEvents[index] = {start:calendarEvents[i].start, end:calendarEvents[i].end, description:calendarEvents[i].description};
            index++;
        }
    }
    return dayEvents;
}