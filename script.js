class Tarefa{
    constructor(dia, mes, ano, tipo, resumo, descricao){
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
        this.tipo = tipo;
        this.resumo = resumo;
        this.descricao = descricao;
        this.pendente = 1;

    }

    validarDados(){
        for(let x in this){
            if(this[x]==undefined || this[x] == null || this[x] == ''){
                return false;
            }
        }
        return true;   
    }


}



class Bd{
    constructor(){
        let id = localStorage.getItem('id');

        if(id === null){
            localStorage.setItem('id', 0);
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId)+1;
    }

    gravar(t){
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(t));
        localStorage.setItem('id',id);

    }

    recuperarRegistros(){
        let id = localStorage.getItem('id');
        let listaTarefas = Array();

        for(let x=1;x<=id;x++){
            let tarefa = JSON.parse(localStorage.getItem(x));
            if(tarefa == null){
                continue;
            }
            tarefa.id=x;
            listaTarefas.push(tarefa);
            
        }
        return listaTarefas;

    }

    remover(elemento){
        let id = elemento.id.replace("apagar", '');
        localStorage.removeItem(id);

        window.location.reload();
    }



    
}


let bd = new Bd;

function adicionarTarefa(){

    let dia = document.querySelector('#dia');
    let mes = document.querySelector('#mes');
    let ano = document.querySelector('#ano');
    let tipo = document.querySelector('#tipo');
    let resumo = document.querySelector('#resumo');
    let descricao = document.querySelector('#descricao');

    let tarefa = new Tarefa(dia.value, mes.value, ano.value, tipo.value, resumo.value, descricao.value);

    if(tarefa.validarDados()){
        bd.gravar(tarefa);
        window.location.reload();
    }
    else{
        alert("Preencha todos os campos.");
    }

}

function adicionarCelulas(tarefas, campo){

    let listaTarefas = campo;
    tarefas.forEach(function (t){

        let linha = listaTarefas.insertRow();
        linha.insertCell(0).innerHTML=`${t.dia}/${t.mes}/${t.ano}`;
        linha.insertCell(1).innerHTML=t.tipo;
        linha.insertCell(2).innerHTML=t.resumo;
        linha.insertCell(3).innerHTML= `<button class="btnModal" data-bs-toggle="modal" data-bs-target="#modalDetalhes" id="btnModal${t.id}"></button>`; 

        if(t.pendente==1){
            document.querySelector("#btnModal"+t.id).className = "btnModal p";
                 
        }else{
            document.getElementById("btnModal"+t.id).className = "btnModal conc";
           
        }

    });
    
    let btnModal = document.querySelectorAll(".btnModal");
    btnModal.forEach((b)=>{
        b.addEventListener('click', ()=>{
            let id = b.id.replace("btnModal", "");
            let tarefa = JSON.parse(localStorage.getItem(id));

            document.querySelector("#tituloModal").innerHTML = tarefa.resumo; 
            document.querySelector("#dataModal").innerHTML = `${tarefa.dia}/${tarefa.mes}/${tarefa.ano}`; 
            document.querySelector("#tipoModal").innerHTML = tarefa.tipo; 
            document.querySelector("#descricaoModal").innerHTML = tarefa.descricao; 

            if(tarefa.pendente == 1){
                document.querySelector("div#descricao").innerHTML = "<h5>Pendente...</h5>";
            }else if(tarefa.pendente == 0){
                document.querySelector("div#descricao").innerHTML = "<h5>Concluida!</h5>";
            }

            document.querySelector(".concluida").id = 'concluida'+id;
            document.querySelector(".apagar").id= 'apagar'+id;



        })

    })

}




function listarTodasTarefas(){
    let tarefas = bd.recuperarRegistros();
    adicionarCelulas(tarefas, document.querySelector("#listaTarefas"));

}

function tarefasRecentes(){
    let tarefas = [];
    const listaTarefas = bd.recuperarRegistros().reverse();

    for(let x of listaTarefas){
        if(tarefas.length<3){
            tarefas.push(x);
        }
    }
    adicionarCelulas(tarefas, document.querySelector("#tarefasRecentes"));
}

function tarefasConcluidasRecentes(){

    const listaTarefas = bd.recuperarRegistros().reverse();
    let tarefas = [];
    
    for(let x of listaTarefas){
        if(tarefas.length<3 && x.pendente==false){
            tarefas.push(x);
            
        }
    }
    adicionarCelulas(tarefas, document.querySelector("#concluidasRecentes"));
}

 function concluidas(element){

    let id=element.id.replace('concluida', '');
    let tarefa = JSON.parse(localStorage.getItem(id));
    tarefa.pendente = 0;

    localStorage.setItem(id, JSON.stringify(tarefa));
    document.getElementById("btnModal"+id).className = "btnModal conc";

    window.location.reload();

}







