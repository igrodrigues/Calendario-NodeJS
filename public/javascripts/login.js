//const db = require("../db");

window.onload=function(){
    var loginForm = document.getElementById("loginForm");
    var backDiv = document.getElementById("back-div");
    var btnCreate = document.getElementById("btn-create");
    var btnEnter = document.getElementById("btn-enter");
    //console.log(btnEnter);
    var btnLogin;
    var btnBack;

    btnEnter.onclick=function(){
        loginForm.innerHTML = '<label for="input-email-login" class="sr-only">Usuário</label>';
        loginForm.innerHTML += '<input id="input-email-login" class="form-control" placeholder="Usuário" required autofocus>';
        loginForm.innerHTML += '<label for="input-password-login" class="sr-only">Senha</label>';
        loginForm.innerHTML += '<input type="password" id="input-password-login" class="form-control" placeholder="Senha" required>';
        loginForm.innerHTML += '<button id="btn-login" class="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>';
        //loginForm.innerHTML += '<button id="btn-back" class="btn btn-primary" type="submit">Voltar</button>';
        btnLogin = document.getElementById("btn-login");
        btnBack = document.getElementById("btn-back");
        console.log(btnLogin);
    }

    btnCreate.onclick=function(){
        loginForm.innerHTML = '<label for="input-email-create" class="sr-only">Usuário</label>';
        loginForm.innerHTML += '<input id="input-email-create" class="form-control" placeholder="Usuário" autofocus>';
        loginForm.innerHTML += '<label for="input-password-create" class="sr-only">Senha</label>';
        loginForm.innerHTML += '<input type="password" id="input-password-create" class="form-control" placeholder="Senha">';
        loginForm.innerHTML += '<label for="input-password-create-check" class="sr-only">Confirme a Senha</label>';
        loginForm.innerHTML += '<input type="password" id="input-password-create-check" class="form-control" placeholder="Confirme a Senha">';
        loginForm.innerHTML += '<button id="btn-login" class="btn btn-lg btn-primary btn-block" >Entrar</button>';
        btnLogin = document.getElementById("btn-login");
        console.log(btnLogin);
    }

    $("#btn-login").onclick=function(){
        console.log("Click");
        //window.location="/calendar";
        //return res.redirect('/calendar');
    }
}