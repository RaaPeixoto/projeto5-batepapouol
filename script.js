//criar um array para renderizar as mensagens
let arrayMensagens =[];
let arrayContatos= [];
const telaMenu = document.querySelector('.tela-menu-contato');
const sidebar = document.querySelector('.menu-contato');
const contatos = document.querySelector ('.contatos')
const telaEntrar = document.querySelector(".tela-entrar")
const telaMensagens = document.querySelector (".conteudo-pagina")
const elementoNome= document.querySelector('.escolha-nome');
let nomeUsuario;
let nomeDestinatario = document.querySelector(".contato-escolhido p");

//promessa para entrar na sala
function entrarNaSala () {
    const novoContato = {
        name:elementoNome.value
    }; 
    nomeUsuario = elementoNome.value;
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', novoContato); 
    promessa.then( entradaDisponivel ); // se der certo
    promessa.catch( contatoNaoRecebido); // se der erro
}

function contatoNaoRecebido (erro) {
    console.log(erro);
 alert ("Não foi possível conectar a sala! Por favor utilize outro nome de usuário.")
}
//entrada com sucesso
function entradaDisponivel (){
    telaEntrar.style.display="none";
    telaMensagens.style.display="flex";
    pegarDadosMensagens()
}

function manterConexao(){
    const conectado = {
        name: nomeUsuario
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',conectado);
    promessa.then( pegarDadosMensagens);
}

setInterval (manterConexao, 5000);


//pegar dados do servidor de mensagens enviadas 
function pegarDadosMensagens(){ 

    // etapa 2: preciso pegar as mensagens no servidor ( enviar a cartinha ) 
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then( dadosRecebidos); // agenda a execucao de uma funcao quando a resposta chegar
    
}



//  receber dados do servidor
function dadosRecebidos(resposta){ 
    
    // etapa 4: processar a resposta e mostrar na tela ( renderizar ) as receitas
    arrayMensagens= resposta.data;

    renderizarMensagens();
}



function renderizarMensagens(){
    const ul = document.querySelector('.container-mensagens');
    ul.innerHTML = '';
    for(let i = 0; i < arrayMensagens.length; i++){ 

        if (arrayMensagens[i].type === "message") {
        ul.innerHTML = ul.innerHTML + `
            <li class="mensagem-publica">
            <p class="mensagem">
                <span class="hora">${arrayMensagens[i].time} </span>
                <span class="remetente">${arrayMensagens[i].from}</span> para <span class="destinatario">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}
            </p>
            </li>
             `;}

        if(arrayMensagens[i].type === "status") {
            ul.innerHTML = ul.innerHTML + `
            <li class="mensagem-entrar-sair">
            <p class="mensagem">
                <span class="hora">${arrayMensagens[i].time})</span>
                <span class="remetente">${arrayMensagens[i].from}</span>  ${arrayMensagens[i].text}
            </p>
            </li>
            `;}

        if (arrayMensagens[i].type === "private_message") { 
            if (nomeUsuario === arrayMensagens[i].to || nomeUsuario === arrayMensagens[i].from){
                ul.innerHTML = ul.innerHTML + `
                <li class="mensagem-privada">
                <p class="mensagem">
                    <span class="hora">${arrayMensagens[i].time} </span>
                    <span class="remetente">${arrayMensagens[i].from}</span> reservadamente para <span class="destinatario">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}
                </p>
                </li>
                `; 
            }
           }
    }
    scrollUltima();
}


setInterval (pegarDadosMensagens, 3000);

function scrollUltima(){
const ultimaMensagem = document.querySelector('.container-mensagens >:last-child ');
console.log(ultimaMensagem)
ultimaMensagem.scrollIntoView();
}




function mostrarSidebar() {
    telaMenu.style.display = "flex";
    sidebar.style.display = "flex";
    pegarDadosContatos();
}

function ocultarSidebar() {
    telaMenu.style.display = "none";
    sidebar.style.display = "none";
}


function pegarDadosContatos(){ 
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then( dadosContatosRecebidos); 
    
}




function dadosContatosRecebidos(contatosOnline){ 
    arrayContatos = contatosOnline.data;
    renderizarContatos();
}



function renderizarContatos () {
    contatos.innerHTML = ` <div class = "contato contato-escolhido" onclick="escolherDestinatario(this)"> 
    <div><ion-icon name="people"  class = "contato-icone"></ion-icon> 
    <p class = "contato-nome">Todos </p> </div>
    <ion-icon name="checkmark-sharp" class = "check"></ion-icon>
</div>`
;
    for(let i = 0; i < arrayContatos.length; i++){ 
        contatos.innerHTML = contatos.innerHTML + `
        <div class = "contato" onclick="escolherDestinatario(this)"> 
        <div><ion-icon name="person-circle-sharp"  class = "contato-icone"></ion-icon>
         <p class = "contato-nome">${arrayContatos[i].name}</p> </div>
         <ion-icon name="checkmark-sharp" class = "escondido"></ion-icon> 
        </div>
            `; 
    }

}


let contatoEscolhido;
function escolherDestinatario(contatoClicado){
    contatoEscolhido = document.querySelector(".contato-escolhido");
    if ( contatoEscolhido!== null){
        const checkAtivo= contatoEscolhido.querySelector(".check");
        console.log(checkAtivo);
        contatoEscolhido.classList.remove("contato-escolhido");
        checkAtivo.classList.add ("escondido")
        checkAtivo.classList.remove("check")
    }
    
    contatoClicado.classList.add ('contato-escolhido')
    console.log(contatoClicado)
    const check = contatoClicado.querySelector(".escondido")
    check.classList.remove ("escondido")
    check.classList.add("check")
    nomeDestinatario = document.querySelector(".contato-escolhido p");
    layoutEnvio();
}


let tipoVisibilidade = document.querySelector(".visibilidade-escolhida p")
function escolherVisibilidade (visibilidadeEscolhida){
    
    const escolhido = document.querySelector(".visibilidade-escolhida")
    if ( escolhido !== null){
        const checkAtivo= escolhido.querySelector(".check")
        console.log(checkAtivo);
        escolhido.classList.remove("visibilidade-escolhida");
        checkAtivo.classList.add ("escondido")
        checkAtivo.classList.remove("check")
    }
    
    visibilidadeEscolhida.classList.add ('visibilidade-escolhida')
    console.log(visibilidadeEscolhida)
    const check = visibilidadeEscolhida.querySelector(".escondido")
    check.classList.remove ("escondido")
    check.classList.add("check")
    tipoVisibilidade = document.querySelector(".visibilidade-escolhida p")
    layoutEnvio();
}

function layoutEnvio() {
    contatoEscolhido = document.querySelector(".contato-escolhido");
    const contatoNome = contatoEscolhido.querySelector("p").innerHTML;
    console.log(contatoNome)
   const visibilidade = document.querySelector(".visibilidade-escolhida p")
    console.log(contatoNome);
    const mensagem = document.querySelector (".enviar-mensagem p")


    if (contatoNome === "Todos " ){
        mensagem.innerHTML = `Enviando mensagem para ${contatoNome}`
    }


    if (contatoNome !== "Todos " && visibilidade.innerHTML =="Reservadamente"){
       
             mensagem.innerHTML = `Enviando mensagem para ${contatoNome} (reservadamente)`
        
    }

    if (contatoNome !== "Todos " && visibilidade.innerHTML =="Público"){
            mensagem.innerHTML = `Enviando mensagem para ${contatoNome} (publicamente)`
        //}
        
       
    }
}


//função para enviar as mensagens
function enviarMensagem(){
    
    
    // pegar os dado preenchido no enviar mensagem
    const elementoMensagem = document.querySelector('.enviar-mensagem .envio-mensagem');
    let novaMensagem = []


if (tipoVisibilidade.innerHTML === "Reservadamente" && nomeDestinatario.innerHTML ==="Todos "){
    alert("Opa! Algo está errado. Impossivel enviar mensagem para todos reservadamente")
}
//mensagem publica
if (tipoVisibilidade.innerHTML === "Público")
{
    novaMensagem = {
        from: nomeUsuario,
        to: nomeDestinatario.innerHTML,
        text: elementoMensagem.value,
        type: "message"  
    }; 
}

//mensagem privada 

if (tipoVisibilidade.innerHTML === "Reservadamente" && nomeDestinatario.innerHTML !=="Todos "){

    novaMensagem = {
        from: nomeUsuario,
        to: nomeDestinatario.innerHTML,
        text: elementoMensagem.value,
        type: "private_message"
    }; 

}

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem); 
    promessa.then(pegarDadosMensagens); // se der certo
   promessa.catch(mensagemNaoEnviada); // se der erro

    renderizarMensagens();
    elementoMensagem.value = "";
    
}

function mensagemNaoEnviada (erro){
    console.log(erro);
    alert ("A mensagem não pode ser enviada, tente novamente.")
}