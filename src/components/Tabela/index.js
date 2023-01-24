import React from 'react'
import { useState } from 'react';


const users_ = [{ idmembros: 2, nome: 'Ana Lucia Luz Orosco', email: 'analu.luz@hotmail.com', endereco: 'rua Gupeva, 56 Vila Curuça', nasc: '1973-07-14', },
{ idmembros: 16, nome: 'Jaqueline Tavares de Souza', email: 'jaquelinesouza_2006@hotmail.com', endereco: 'rua Castanheira do Brejo, 136', nasc: '1981-09-20' },
{ idmembros: 17, nome: 'Laércio Carlos de Lima', email: 'laerciomkids@hotmail.com', endereco: 'Avenida Ipê Roxo 1339 Jardim Jaragua', nasc: '1956-02-02' },
{ idmembros: 18, nome: 'DANIEL MORSE', email: 'prdanielmorse@gmail.com', endereco: 'RUA ANTONIO JOÃO DE MEDEREIROS,465 BLOCO 3 APTO 23', nasc: '1969-06-16' },
{ idmembros: 20, nome: 'TARCILA DOS SANTOS FONSECA', email: 'TTARCILA.9FONSECA@HOTMAIL.COM', endereco: 'RUA CASTANHEIRO DO BREJO 322', nasc: '1983-12-09' },
{ idmembros: 21, nome: 'Martim Ramalho Vieira', email: 'martimramalhovieira@gmail.com', endereco: 'Rua : Folha Dourada ,92', nasc: '1980-12-28' },
{ idmembros: 22, nome: 'Shirley Viviane Vieira', email: 'shirley.viviane5@yahoo.com.br', endereco: 'Rua : Folha Dourada ,92', nasc: '1982-08-05' },
{ idmembros: 23, nome: 'Mirtes Barbosa da Silva ', email: 'Mirtesbs@hotmail.com', endereco: 'Avenida caraipe das águas, 1171', nasc: '1970-01-01' },
{ idmembros: 24, nome: 'Carine Reis Torres ', email: 'carine29.reis@hotmail.com', endereco: 'Palha brava 222', nasc: '1986-12-29' },
{ idmembros: 25, nome: 'Sandra louriene Marques da silva', email: '.lindinhas2@hotmail.com', endereco: 'Rua caminho quatro,306 bloco H ap 31 Guarulhos ', nasc: '1970-01-01' },
{ idmembros: 26, nome: 'EDNILSA DE ARAUJO GOMES', email: 'adm_progresso@hotmail.com', endereco: 'Rua Angelo Frazilio, 360', nasc: '1978-07-30' },
{ idmembros: 31, nome: 'BRUNO DO NASCIMENTO OROSCO', email: 'brunoorosco@gmail.com', endereco: 'RUA GUPEVA, 56 - VILA CURUÇA', nasc: '1987-03-29' }
]

export default function MembrosTable(props) {
    //console.log(props.children[1])
    //    const { membros } = props;
    const [users, setMembros] = useState(props.children[1])
  
    return (
        <>
            <table>
                <caption>Membros</caption>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, key) => (
                        <tr key={key}>
                            <td>{user.idmembros}</td>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </>
    );
}