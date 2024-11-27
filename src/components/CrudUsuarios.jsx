import React, { useEffect, useState } from 'react'
import axios from "axios";
import { FaPencil, FaTrashCan } from 'react-icons/fa6';




export default function CrudUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [operacao, setOperacao] = useState("");


   // const url = "http://localhost:9082/usuarios/"; para testar na maquina pessoal
   const url = "https://backend-blond-one-49.vercel.app/usuarios/";

    useEffect(() => {
        fetch(url)
            .then((respFetch) => respFetch.json())
            .then((respJson) => setUsuarios(respJson))
            .catch((err) => console.log(err));
    }, [url]);

    function novosDados() {
        setOperacao("criarRegistro");
    }
    function limparDados() {
        setId("");
        setNome("");
        setEmail("");
        setAltura("");
        setPeso("");
        setOperacao("");
    }


    function editarDados(cod) {
        let usuario = usuarios.find((item) => item.id === cod);
        const { id, nome, email, altura, peso } = usuario;
        setOperacao("editarRegistro");
        setId(id);
        setNome(nome);
        setEmail(email);
        setAltura(altura);
        setPeso(peso);
    }


    function apagarDados(cod) {
        axios.delete(url + cod)
            .then(() => setUsuarios(usuarios.filter(item =>
                item.id !== cod)))
            .catch((erro) => alert("Ocorreu um erro", erro));
    }

    function gravarDados() {
        if (nome !== "" && email !== "") {
            if (operacao === "criarRegistro") {//o usuario clicou em novo
                axios
                    .post(url, {
                        nome: nome,
                        email: email,
                        altura: (altura ? altura : null),
                        peso: (peso ? peso : null),
                    })
                    .then((response) => atualizaListaComNovoUsuario(response))
                    .catch((err) => alert("ocorreu um erro ao criar novo usuario", err));
            } else if (operacao === "editarRegistro") {
                axios
                    .put(url + id, {
                        id: id,
                        nome: nome,
                        email: email,
                        altura: (altura ? altura : null),//int,float nunca e vazio
                        peso: (peso ? peso : null),
                    })
                    .then((response) => atualizaListaUsuarioEditado(response))
                    .catch((err) => alert("ocorreu um erro ao editar o usuario", err));
            }
        } else {
            console.log("Preencha os campos");
        }
    }

    function atualizaListaUsuarioEditado(response) {
        if (response.status == 202) {
            //encontra o indice do usuario a ser atualizado pelo id
            const index = usuarios.findIndex(item => item.id == id);
            //faz uma copia do array de usuarios
            let users = usuarios;
            //na copia, atualiza o usuario editado
            users[index].nome = nome;
            users[index].email = email;
            users[index].altura = altura;
            users[index].peso = peso;
            //seta os usuarios com o array editado
            setUsuarios(users);
            limparDados("");
        } else {
            console.log("Problema com edição: ", response.status);
        }
    }
    function atualizaListaComNovoUsuario(response) {
      
        let { id, nome, email, altura, peso } = response.data;
        let obj = {
            "id": id, "nome": nome, "email": email,
            "altura": altura, "peso": peso
        };
        let users = usuarios;
        users.push(obj);
        setUsuarios(users);
        limparDados("");
    }
    return (
        <div id="containerGeral">
            <button type="button" onClick={() => { novosDados() }}>Novo</button>
            <input
                type="text"
                name="txtNome"
                value={nome}
                onChange={(e) => { setNome(e.target.value); }}
            />
            <input
                type="text"
                name="txtEmail"
                value={email}
                onChange={(e) => { setEmail(e.target.value); }}
            />
            <input
                type="number"
                name="txtAltura"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
            />
            <input
                type="number"
                name="txtPeso"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
            />
            <button type="button" onClick={() => { limparDados() }}>Cancelar</button>
            <button type="button" onClick={() => { gravarDados() }}>Gravar</button>
            {usuarios ? usuarios.map((item) => {
                return (
                    <div key={item.id}>
                        {item.id} - {item.nome}  - {item.email} - {item.altura} -
                        {item.peso} - {" "}
                        <FaPencil
                            onClick={(e) => editarDados(item.id)}
                        />
                        <FaTrashCan
                            onClick={(e) => apagarDados(item.id)}
                        />
                    </div>
                );
            })
                : false}
        </div>
    );
}
