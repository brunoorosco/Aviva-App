-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 03/07/2020 às 19:23
-- Versão do servidor: 10.4.13-MariaDB
-- Versão do PHP: 7.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `u737598762_igr`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aceita_jesus`
--

CREATE TABLE `aceita_jesus` (
  `id` int(10) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `endereco` varchar(50) DEFAULT NULL,
  `telefone` varchar(15) DEFAULT NULL,
  `aceit_reconc` varchar(12) NOT NULL,
  `cadastro` datetime DEFAULT current_timestamp(),
  `batizado` varchar(5) DEFAULT NULL,
  `cem` varchar(25) DEFAULT NULL,
  `idade` varchar(5) DEFAULT '0',
  `fixo` varchar(15) DEFAULT NULL,
  `cargo` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Despejando dados para a tabela `aceita_jesus`
--

INSERT INTO `aceita_jesus` (`id`, `nome`, `endereco`, `telefone`, `aceit_reconc`, `cadastro`, `batizado`, `cem`, `idade`, `fixo`, `cargo`) VALUES
(1, 'Elieser Cezário da Silva Jr.', 'Rua Francicsco Martinho 182 - Suzano', '948947271', 'reconciliou', '2018-12-01 00:00:00', 'sim', 'Sup.Silvani', NULL, NULL, NULL),
(2, 'Cleison Melo', 'estrada dos Indios 285 - Itaqua ', '964044194', 'reconciliou', '2018-12-07 00:00:00', 'não', 'Sup.Geovana', NULL, NULL, NULL),
(3, 'Cintia Albuquerque Lorasque', 'Rua Apiranga 04 - jd.Ipe', '41725896', 'reconciliou', '2018-12-09 00:00:00', 'sim', 'Sup.Valdirene', NULL, NULL, NULL),
(4, 'Cleberson Alberto de Jesus', 'Rua Carana Branca 201 - J.Helena', '999662157', 'reconciliou', '2018-12-09 00:00:00', 'sim', '', NULL, NULL, NULL),
(5, 'Andre Aziago dos Santos', 'Rua Anajatuba 19A - Itaim Pta', '985762711', 'reconciliou', '2018-12-09 00:00:00', 'sim', 'Pr.Joel', NULL, NULL, NULL),
(6, 'Samuel Mendes', 'Rua Francisco Antonio Meira - Vl.Mara', '986559951', 'reconciliou', '2018-12-09 00:00:00', 'não', '', NULL, NULL, NULL),
(7, 'Rogerio Soares da Silva', 'Rua Castanheira do Brejo 295 - J.Ipe', '970690241', 'aceitou', '2018-12-09 00:00:00', 'não', 'Sup.Luizinho', NULL, NULL, NULL),
(8, 'Felipe Cesar Rodrigues', 'Rua Rosa Musgo 475 - J.Miragaia', '970211055', 'reconciliou', '2018-12-09 00:00:00', 'sim', 'Pra.Wanda', NULL, NULL, NULL),
(9, 'Rinaldo Lorasque Filho', 'Rua Apiranga 04 - J.Ipe', '27292218', 'reconciliou', '2018-12-09 00:00:00', 'sim', 'Sup.Valdirene', NULL, NULL, NULL),
(10, 'Edmar Gomes da Silva', 'Rua Sebastiao Aves - camargo Novo', '964402320', 'aceitou', '2018-12-09 00:00:00', 'não', 'Sup.Geovana', NULL, NULL, NULL),
(11, 'Valeria Fernandes dos Santos ', 'Rua piranema - J.Campos', '940874019', 'reconciliou', '2018-12-09 00:00:00', 'sim', '', NULL, NULL, NULL),
(12, 'Jair Jose Luis', 'Rua Erva do Fogo 110 - J.Ipe', '964383005', 'reconciliou', '2018-12-09 00:00:00', 'sim', 'Sup.Valdirene', NULL, NULL, NULL),
(13, 'Eunice Nunes  Magaldi ', 'Rua Gravata de Pedra 16 - J.Ipe', '973456393', 'aceitou', '2018-12-09 00:00:00', 'não', '', NULL, NULL, NULL),
(14, 'Sivaldo Souza ', 'Rua Agua Vermelha 17 casa 3', '959455437', 'reconciliou', '2018-12-09 00:00:00', 'sim', '', NULL, NULL, NULL),
(15, 'Joao Vitor Lopes da Silva', 'Rua Gravata de Pedra 19 - J.Ipe', '951496802', 'reconciliou', '2018-12-21 00:00:00', 'sim', 'Sup.Lika', NULL, NULL, NULL),
(16, 'Ana Paula Rodrigues', 'Rua Cotia 114 - J.Campos', '', 'reconciliou', '2018-12-21 00:00:00', 'sim', 'Sup.Sandra', NULL, NULL, NULL),
(17, 'Antonio Leite da Silva Filho', 'Rua Gesiaba 17 - J.Campos', '951496802', 'reconciliou', '2018-12-21 00:00:00', 'sim', 'Sup.Lika', NULL, NULL, NULL),
(18, 'Cristiane Viana de Jesus', 'Rua Jose Martins Lisboa 2204 - Pantanal', '987079288', 'aceitou', '2018-12-23 00:00:00', 'não', '', NULL, NULL, NULL),
(19, 'Lucimar Alves da Silva', 'Baleeira Branca 366 - J.Ipe', '996839001', 'reconciliou', '2018-12-23 00:00:00', 'sim', 'Sup.Lika', NULL, NULL, NULL),
(20, 'Jussara Domingues Pimentel', 'Rua Obai 25 - J.Nazare', '977535724', 'reconciliou', '2018-12-23 00:00:00', 'sim', 'Pra.Bete', NULL, NULL, NULL),
(21, 'Richard Marques Gomes', 'Rua Gherardt Holts 7B - J.Silva Teles', '984430359', 'aceitou', '2018-12-23 00:00:00', 'não', 'Sup.Mirtes', NULL, NULL, NULL),
(22, 'Beatriz Pimentel Nunes Gonsalves', 'Rua Melchiades Nunes de Campos 452 - pq.sta Rita', '', 'reconciliou', '2018-12-23 00:00:00', 'não', 'Sup.Lika', NULL, NULL, NULL),
(23, 'Elza Bento Bezerra ', 'Rua Melchiades Nunes de Campos 452 - pq.sta Rita', '38082046', 'reconciliou', '2018-12-23 00:00:00', 'sim', 'Sup.Lika', NULL, NULL, NULL),
(24, 'Kaua Henrique Ramos Oliveira', 'Rua Ipe Roxo 1704 - Itaim Pta', '940761125', 'aceitou', '2019-01-04 00:00:00', 'não', 'Sup. Zô', NULL, NULL, NULL),
(25, 'Gabriela Queiroz da Silva ', 'Rua Virginia Ferne 88 - Cohab 2', '949235284', 'reconciliou', '2019-01-13 00:00:00', 'sim', '', NULL, NULL, NULL),
(26, 'Vitor Gratao ', 'Rua Palmeira das Bermudas 658 - Jd.Ipe', '996406714', 'reconciliou', '2019-01-13 00:00:00', 'sim', '', NULL, NULL, NULL),
(27, 'Larissa Rodrigues Santos', 'Francisca Marrique Guerra 103 A - Jd.Ipe', '94944332', 'aceitou', '2019-01-18 00:00:00', 'não', 'Sup.Valdirene', NULL, NULL, NULL),
(28, 'Renan david', 'Rua Castanheiro do Brejo 55 - Jd.Ipe', '940097687', 'aceitou', '2019-01-18 00:00:00', 'não', '', NULL, NULL, NULL),
(29, 'Andressa Mayumuihod Yamath', 'Rua Namesio Candido Gomes 151 - Vl.Zeferina', '979712378', 'aceitou', '2019-01-18 00:00:00', 'não', '', NULL, NULL, NULL),
(30, 'Natalia Viana', 'Av.dos Ipes - Jd.Ipe', '957936180', 'reconciliou', '2019-01-20 00:00:00', 'não', '', NULL, NULL, NULL),
(31, 'Jonathan da Silva', 'Rua Machiche 35 - Jd.Eloisa', '981754649', 'reconciliou', '2019-01-20 00:00:00', 'não', '', NULL, NULL, NULL),
(32, 'Edson Bispo dos Santos', 'R.S.Pedro de Jequitinhonha 78 - J.S.Carlos', '977258045', 'reconciliou', '2019-01-20 00:00:00', 'sim', 'Sup. Martim', NULL, NULL, NULL),
(33, 'Jenifer Silva Demortoli', 'R.S.Pedro de Jequitinhonha 78 - J.S Carlos', '981538915', 'reconciliou', '2019-01-20 00:00:00', 'sim', 'Sup. Martim', NULL, NULL, NULL),
(34, 'Maria Celia Patricio', 'Av.dos Igarapes - Jd.Ipe', '993611632', 'reconciliou', '2019-01-25 00:00:00', 'sim', 'Sup.Valdirene', NULL, NULL, NULL),
(35, 'Alexsandro Alve de Araujo', 'Rua Adriano Seabra 60 - Pq.Paulistano', '42115281', 'aceitou', '2019-01-25 00:00:00', 'não', '', NULL, NULL, NULL),
(36, 'Renata lima', 'Rua Mendanha 32 - Jd.Carolina', '29630294', 'aceitou', '2019-01-27 00:00:00', 'não', 'Sup.Martim', NULL, NULL, NULL),
(37, 'Jean Sales Santos', 'Rua lagoa Cajuba 101 - Jd.Campos', '962604750', 'reconciliou', '2019-01-27 00:00:00', 'não', 'Sup.Martim', NULL, NULL, NULL),
(38, 'Marisa Lopes Vicente', 'Rua |Gravata de Pedra 19 - Jd. Ipe', '951496802', 'reconciliou', '2019-01-27 00:00:00', 'sim', 'Pr. Joel/Regiane', NULL, NULL, NULL),
(39, 'Jose Silva Nogueira', 'Glochonias 110 A - Cidade Nova S.Miguel', '', 'aceitou', '2019-01-27 00:00:00', 'não', 'Pr. Joel/Regiane', NULL, NULL, NULL),
(40, 'Leonardo Bezerra Omena', 'Rua Betula Negra - Jd.Nelia', '982518015', 'reconciliou', '2019-01-27 00:00:00', 'sim', 'Sup. Aldo/Silvani', NULL, NULL, NULL),
(41, 'Jean Michel dos Santos', 'Rua Massato Sakai 180 - Ferraz', '940326399', 'reconciliou', '2019-01-27 00:00:00', 'sim', 'Sup.Jaqueline', NULL, NULL, NULL),
(42, 'Amanda Laurentino dos Sabntos', 'Rua Lourenco Paganucci 593 - Ferraz', '9836838991', 'reconciliou', '2019-01-27 00:00:00', 'sim', 'Sup. Zô/Fátima', NULL, NULL, NULL),
(43, 'Eliane Lourenco', 'Rua Porto do Bezerra 660 - Guaianases', '981805166', 'aceitou', '2019-02-10 00:00:00', 'sim', 'Sup. Clarice/Luiz', NULL, NULL, NULL),
(44, 'Tatiana Macedo Dunda', 'Rua Igarapes 980 - Jd dos ipes', '965826114', 'aceitou', '2019-02-17 00:00:00', 'não', 'Pr. Laercio/Vera', NULL, NULL, NULL),
(45, 'Juliana Silveiro dos Santos', 'Rio Itapicu Mirim N?95 - Camargo Novo', '983612420', 'aceitou', '2019-02-17 00:00:00', 'sim', '', NULL, NULL, NULL),
(46, 'Gabriel Martins de Souza', 'Dr. Gil Martins 96 - Itaim', '96652702', 'reconciliou', '2019-02-17 00:00:00', 'não', 'Sup. Valdirene', NULL, NULL, NULL),
(47, 'Bruno Rodrigues', 'Rua: Jacaranda Rosa 307 - Jd. Noemia', '(11) 95107-6652', 'reconciliou', '2019-02-22 00:00:00', 'sim', 'Sup. Valdirene', NULL, NULL, NULL),
(48, 'Joselito Da Silva Oliveira', 'Av. Carrego Tijuco Preto 188 - Jd. Oliveira', '', 'reconciliou', '2019-02-24 00:00:00', 'não', 'Sup. Giovanna', NULL, NULL, NULL),
(49, 'Carlos Alberto Ribeiro', 'Rua Macauba Mirim 231 - Jd dos ipes', '983874818', 'reconciliou', '2019-02-24 00:00:00', 'sim', 'Rita Obreira', NULL, NULL, NULL),
(50, 'Amanda Cristina Soares', 'Pedro Ferraz Lopes 370 - Jd Campos ', '22648683', 'reconciliou', '2019-02-24 00:00:00', 'sim', 'Sup. Valdirene', NULL, NULL, NULL),
(51, 'Matheus Ferreira Calado', 'Rua Alpercata 19', '959775150', 'reconciliou', '2019-02-24 00:00:00', 'não', '', NULL, NULL, NULL),
(52, 'Thayane de Souza Carvalho', 'Rua Dolores de Aquino 28 - Jundiapeba', '932304606', 'reconciliou', '2019-02-24 00:00:00', 'não', '', NULL, NULL, NULL),
(53, 'Robson Viana de Jesus', 'Av.Jose Martim Lisboa 2168 - jd.S.Martinho Helena', '', 'aceitou', '2019-02-26 00:00:00', 'não', 'Sup.Lika', NULL, NULL, NULL),
(54, 'Rosangela de Oliveira Santos', 'R. Gal.Dalton Teixeira 133 - vl.Mara', '', 'reconciliou', '2019-03-01 00:00:00', 'sim', '', NULL, NULL, NULL),
(55, 'Leticia Vitoria Santos', 'R.Mateus Barbosa Resende 287 A - pq.sta Rita', '958792952', 'reconciliou', '2019-03-03 00:00:00', 'não', '', NULL, NULL, NULL),
(56, 'Vitoria nascimeto Neves Conceicao', 'Av. dos Ipes 1060 - Jd,Ipe', '954404968', 'reconciliou', '2019-03-03 00:00:00', 'não', '', NULL, NULL, NULL),
(57, 'Rayane Vitoria Alves dos Santos', 'R. Padre Eduardo Roberto 127 - S.miguel', '951461358', 'reconciliou', '2019-03-03 00:00:00', 'não', 'Sup.Valdirene', NULL, NULL, NULL),
(58, 'Leandro Jose da Slva', 'R.Francisca Manrique Guerra 9C - Jd.Ipe', '952720453', 'reconciliou', '2019-03-03 00:00:00', 'sim', 'Sup.Valdirene', NULL, NULL, NULL),
(59, 'Roberto Borges Bonfim', 'Rua Gequirame de Goias 515 apto 2 - Vila Curuca', '987992995', 'reconciliou', '2019-03-03 00:00:00', 'sim', 'Sup.Lika', NULL, NULL, NULL),
(60, 'Patricia Gomes P. Guedes', 'Rua Gequirame de Goias 515 apto 2 - Vila Curuca', '987992885', 'reconciliou', '2019-03-03 00:00:00', 'sim', 'Sup.Lika', NULL, NULL, NULL),
(61, 'Marivan Ferreira Barros', 'Sabiá Laranjeira 113 - Vila Mara', '25857006', 'aceitou', '2019-03-05 00:00:00', 'não', 'Pr.Joel', NULL, NULL, NULL),
(62, 'Juliana de ALmeida S.', 'Av.dos Ipes 1294 - Jd. Ipe', '954119720', 'reconciliou', '2019-03-05 00:00:00', 'sim', 'Sup.Valdirene', NULL, NULL, NULL),
(63, 'Joao Carlos Ribeiro de Amorim', 'Rua Gravata de pedra 535 - Jd.Ipe', '975893150', 'reconciliou', '2019-03-05 00:00:00', 'não', 'Sup. Fabio/Sandra', NULL, NULL, NULL),
(64, 'Normalicia Ferreira ', 'Rua Sabia Laranjeira 113 - Vl. Mara', '', 'aceitou', '2019-03-05 00:00:00', 'não', 'Pr.Joel', NULL, NULL, NULL),
(65, 'Livia Michele dos Santos Matos', 'Rua Cipó do Reino 119 - Jd.ipe', '', 'aceitou', '2019-03-05 00:00:00', 'sim', 'Sup.Valdirene', NULL, NULL, NULL),
(66, 'Ana Paula Novaes de Jesus', 'Rua Cio da Terra 11 - Itaim Pta', '', 'reconciliou', '2019-03-05 00:00:00', 'sim', '', NULL, NULL, NULL),
(67, 'Rafaela Cardoso Gonsalves', 'Av.Joao Batista Santiago 455 - Jd.Robrú', '', 'aceitou', '2019-03-05 00:00:00', 'não', '', NULL, NULL, NULL),
(68, 'Milena Gomes Fernandes', 'Rua Pedro Rodrigues 86 - pq.sta Rita', '991241930', 'reconciliou', '2019-03-17 00:00:00', 'sim', 'Pr.Claudio/Edi', NULL, NULL, NULL),
(69, 'Marcela Gomes Fernandes', 'Rua Pedro Rdrigues 86 - Pq.Sta Rita', '991692312', 'reconciliou', '2019-03-17 00:00:00', 'sim', 'Pr.Claudio/Edi', NULL, NULL, NULL),
(70, 'Romero Kopps Junior', 'Rua Aricanga 974 - Jd.Silva Teles', '954646486', 'aceitou', '2019-03-17 00:00:00', 'não', 'Sup.Lika', NULL, NULL, NULL),
(71, 'Fernanda Cristina de Farias', 'Rua Aricanga 974 - Jd.Silva Teles', '941472010', 'aceitou', '2019-03-17 00:00:00', 'não', 'Sup.Lika', NULL, NULL, NULL),
(72, 'Daniela Santos de Jesus ', 'Rua das Gaivotas 06 - Vale da Brisas', '950383374', 'aceitou', '2019-03-22 00:00:00', 'não', 'Pr.Wagner', NULL, NULL, NULL),
(73, 'Julia Matos', 'Rua Jangaba 03 - Itaim Pta', '986687952', 'aceitou', '2019-03-22 00:00:00', 'não', '', NULL, NULL, NULL),
(74, 'Fabio Falcão ', 'Rua Pedro de Castilho 1012 - Jacana', '977916442', 'reconciliou', '2019-03-22 00:00:00', 'sim', '', NULL, NULL, NULL),
(75, 'Edvaldo Gomes de Lima', 'Rua Paulo Arnes 46 - Cid.Nova S.Miguel', '20359880', 'reconciliou', '2019-03-22 00:00:00', 'sim', '', NULL, NULL, NULL),
(76, 'Wanderclayson O. da Cruz', 'Rua Julia 25 - Vl.Esperenca', '', 'reconciliou', '2019-03-22 00:00:00', 'não', 'Sup. Fabio/Sandra', NULL, NULL, NULL),
(77, 'Fabiano da Cruz Feliz', 'Av.dos Ipes - Jd.Ipe\",\"25621081', '', 'reconciliou', '2019-03-24 00:00:00', 'não', 'Sup. Fabio/Sandra', NULL, NULL, NULL),
(78, 'Erika Souza Santos', 'Rua Macauba Mirim264 - Jd.Ipe', '999866513', 'aceitou', '2019-03-24 00:00:00', 'não', 'Sup.Waguerson', NULL, NULL, NULL),
(79, 'Genilson Elias Oliveira', 'Rua Corrego do Tijuco Preto 190 A - Itaim Pta', '954673090', 'aceitou', '2019-03-24 00:00:00', 'não', '', NULL, NULL, NULL),
(80, 'Adriana Salalori de Souza', 'Rua Carlos Coco 72 - JD.SilvaTeles', '36783687', 'reconciliou', '2019-03-24 00:00:00', 'sim', 'Sup.Zô', NULL, NULL, NULL),
(81, 'Solange de Assis', 'R. Prof.Assis Veloso 458 fundos - Vila Rosalia', '997756320', 'reconciliou', '2019-03-24 00:00:00', 'sim', 'Sup.Valdirene', NULL, NULL, NULL),
(82, 'Cristina Rolim de Lima', 'Rua Andre Martins 60 - Freguesia do ó', '979733565', 'reconciliou', '2019-03-24 00:00:00', 'sim', '', NULL, NULL, NULL),
(83, 'Diego Alves', 'Rua Peroba rosa 169 - Miragaia', '947459699', 'reconciliou', '2019-03-24 00:00:00', 'sim', 'Sup.Waguerson', NULL, NULL, NULL),
(84, 'Edmilson Freitas de Oliveira', 'Rua Vianopolis 237 - Vl.Maria Alta', '9567709020', 'reconciliou', '2019-03-26 00:00:00', 'sim', '', NULL, NULL, NULL),
(87, 'Tatiana Vitoria Melo Silva', 'Rua Domingues Vidigal Jd Jaraguá', '', 'Aceitou', '2019-05-05 00:00:00', 'não', 'Pr. Laércio/Vera', '11', '', NULL),
(88, 'Thiago dos Santos Damasceno ', 'Rua Caraipe das Aguas,566 Jd Ipe', '', 'Reconciliou', '2019-05-05 00:00:00', 'sim', '', '33', '(25) 1291-85', NULL),
(89, 'Kathleen Yasmin Alves da Silva', 'Rua Higino Messa 100,Vl Curuçá', '(11) 94179-3170', 'Reconciliou', '2019-05-05 00:00:00', 'não', '', '19', '', NULL),
(90, 'Maria Mercedes Mareri', 'Rua Pimenta D\'agua 18, Itaim', '(11) 96207-7212', 'Aceitou', '2019-05-05 00:00:00', 'não', 'Lika', '30', '', NULL),
(91, 'Fabiana Coutinho Muniz', 'Rua Louro Tinga,196 Vl Progresso', '(11) 98252-1090', 'Reconciliou', '2019-05-05 00:00:00', 'não', 'Lika', '37', '', NULL),
(92, 'Marcia Moura ', 'Rua Fridolino Chimango,11 Jd Silva Teles', '', 'Aceitou', '2019-05-05 00:00:00', 'não', 'WAGUERSON', '42', '(11) 2561-8448', NULL),
(93, 'Tatiane Nascimento Katawatis', 'Rua rio D\'ouro, 26 Jd Jaraguá', '(11) 98270-6076', 'Reconciliou', '2019-05-05 00:00:00', 'sim', 'Pr. Laércio/Vera', '30', '', NULL),
(94, 'Gabriel Fernandes Souza Martins', 'Rua Guaivira 21 SP', '(11) 96258-8075', 'Aceitou', '2019-05-05 00:00:00', 'não', 'Lika', '15', '', NULL),
(95, 'Joâo Vitor Braga Alves', 'Rua Sabiá Laranjeira,268 Jd Helena', '', 'Aceitou', '2019-05-05 00:00:00', 'não', 'Jd. Helena', '18', '', NULL),
(96, 'Eduardo Arcanjo Alves Silva', 'Rua Palmeira das Bermudas, 71 Jd Ipe', '(11) 95928-1448', 'Reconciliou', '2019-05-05 00:00:00', 'não', 'Novo Tempo', '22', '', NULL),
(97, 'Carolina Chagas Alves', 'Rua Carana Branca 15 A', '(11) 96967-0438', 'Reconciliou', '2019-05-05 00:00:00', 'não', '', '13', '', NULL),
(98, 'RONALDO ALVEZ PEREIRA', 'RUA GERHARDT HOLTZ, 226, JARDIM SILVA ', '(11) 98429-1725', 'Reconciliou', '2019-05-05 00:00:00', 'não', '', '32', '', NULL),
(99, 'ANA VITÓRIA ANDRADE', 'RUA GRAVATÁ DA PEDRA, 37', '', 'Aceitou', '2019-05-05 00:00:00', 'não', '', '10', '', NULL),
(100, 'RODRIGO ARRAZ DOS SANTOS', 'RUA ARNALDO MAMED JUNIOR, 17', '', 'Reconciliou', '2019-05-05 00:00:00', 'sim', '', '34', '', NULL),
(101, 'FILIPE DE AQUINO PONTES', 'RUA ALMEIDA DOS REIS, 54, BLOCO D, AP 42', '(11) 98702-1082', 'Reconciliou', '2019-05-05 00:00:00', 'sim', '', '27', '', NULL),
(102, 'ALISSON ROBERTO ', 'AVENIDA JULIO TUPI, 59', '(11) 94758-2774', 'Reconciliou', '2019-05-05 00:00:00', 'sim', 'WAGUERSON', '28', '', NULL),
(103, 'VINICIOS DE SOUZA RODRIGUES', 'RUA RIO D\'OURO, 44A', '', 'Aceitou', '2019-05-05 00:00:00', 'sim', 'Todas', '9', '(11) 2561-2114', NULL),
(104, 'ADRIELE PIRES', 'RUA ROSA MUSGO, 103', '(11) 97805-9763', 'Reconciliou', '2019-05-17 00:00:00', 'sim', 'Pr. Laércio/Vera', '15', '', NULL),
(105, 'ANDRESSA SOUZA DE OLIVEIRA', 'RUA MACAÚBA MIRIM, 234', '', 'Reconciliou', '2019-05-17 00:00:00', 'sim', '', '34', '(11) 3678-1884', NULL),
(106, 'MATEUS DAS NEVES SILVA', 'RUA RIO DO OURO, 92', '(11) 98463-8891', 'Aceitou', '2019-05-17 00:00:00', 'não', 'Pr. Laércio/Vera', '11', '', NULL),
(107, 'CAMILA FERREIRA DA SILVA', 'RUA ERVA DO SERENO, 506, JARDIM PANTANAL', '(11) 94885-9444', 'Reconciliou', '2019-05-19 00:00:00', 'não', 'Novo Tempo', '24', '', NULL),
(108, 'BIANCA LIMA SOIER', 'RUA PIMENTA D\'ÁGUA, 80', '(11) 96601-5149', 'Reconciliou', '2019-05-19 00:00:00', 'não', '', '24', '', NULL),
(109, 'ANA JULIA VIEIRA PIMENTA', 'RUA TERRA SEM MALES, 32', '(11) 98534-3436', 'Reconciliou', '2019-05-19 00:00:00', 'não', 'Todas', '11', '', NULL),
(110, 'ALEXSANDER JULIO DAMASCENO DOS SANTOS', 'RUA CASTANHEIRO DO BREJO, 90', '(11) 93207-9329', 'Aceitou', '2019-05-19 00:00:00', 'não', 'WAGUERSON', '17', '', NULL),
(111, 'JULIA SIQUEIRA', 'RUA BALIEIRA BRANCA, 211', '(11) 98146-7736', 'Aceitou', '2019-05-19 00:00:00', 'não', 'WAGUERSON', '10', '', NULL),
(112, 'CAMILA ALVES DOS SANTOS', 'RUA VITORIO CAPILANO', '(11) 97707-9080', 'Reconciliou', '2019-05-19 00:00:00', 'não', 'Novo Tempo', '30', '', NULL),
(113, 'ESTEFANE FERREIRA ALVES', 'RUA TRAVESSA EUGENIO MELARA, 173, VILA PROGRESSO', '(11) 98177-8298', 'Reconciliou', '2019-05-19 00:00:00', 'sim', 'Carapicuiba', '37', '', NULL),
(114, 'Alécio Pereira Alencar', 'Rua Flor Boreal,114 Jd Ipe', '', 'Aceitou', '2019-05-24 00:00:00', 'não', 'Pr. Laércio/Vera', '20', '', NULL),
(115, 'Gerson Laurindo de Almeida', 'Rua Rio Sao Francisco do Mogiano,215 Vl Progresso', '(11) 98327-1492', 'Reconciliou', '2019-05-24 00:00:00', 'sim', 'Zô', '27', '', NULL),
(116, 'Luiz Carlos Pereira da Silva', 'Rua Cipó do Reino,85 Jd Ipe', '(11) 97806-6024', 'Aceitou', '1970-01-01 00:00:00', 'não', 'Martim/Shirley', '51', '', NULL),
(117, 'Nilson Angelo da Silva Mendes', 'Rua das Andorinhas,99 Vale das Brisas', '(11) 94302-3206', 'Reconciliou', '2019-05-24 00:00:00', 'não', 'Itu', '14', '', NULL),
(118, 'Ana Flávia Ramos da Silva', 'Rua das Andorinhas,99 Vale das Brisas', '(11) 93024-2262', 'Reconciliou', '2019-05-24 00:00:00', 'não', 'Itu', '17', '', NULL),
(119, 'Ana Carolina Ramos', 'Rua das Andorinhas,99 Vale das Brisas', '(11) 93024-2262', '', '2019-05-24 00:00:00', 'não', 'Itu', '12', '', NULL),
(120, 'Dayane Aparecida de Jesus', 'Rua das Gaivotas', '(11) 95322-5288', 'Reconciliou', '2019-05-24 00:00:00', 'não', 'Itu', '17', '', NULL),
(125, 'Diego Alves Damasceno', 'Rua Rio D\'ouro,56 Jd Jaraguá', '', 'Reconciliou', '2019-05-24 00:00:00', 'não', 'Pr. Laércio/Vera', '', '(11) 2566-8900', 'Membro'),
(126, 'William Alves de Souza Silva', 'Rua Manima,470', '(11) 95949-7145', 'Reconciliou', '2019-05-24 00:00:00', 'sim', 'Valdirene', '', '', 'Membro'),
(127, 'Yara Soares da Silva', 'Rua das Gaivotas,23A', '(11) 94112-1735', 'Reconciliou', '2019-05-24 00:00:00', 'não', 'Itu', '', '', 'Membro'),
(128, 'Dener Gerelado Piola', 'Rua Congonhas do Sertão,378 Jd Ipe', '(11) 96445-5439', 'Reconciliou', '2019-05-24 00:00:00', 'não', 'Pr. Joel/Regiane', '', '', 'Membro'),
(129, 'Sophia Souza Gratão', 'Rua Macaúba Mirim,234 Jd Ipe', '(11) 94106-2910', 'Reconciliou', '2019-05-24 00:00:00', 'não', 'Pr. Laércio/Vera', '', '', 'Membro'),
(130, 'Alécio Pereira Alencar da Silva', 'Rua Flor Boreal,141 Jd Ipe', '', 'Aceitou', '2019-05-24 00:00:00', 'não', 'Pr. Laércio/Vera', '', '', 'Membro'),
(131, 'Gerson Laurindo de Oliveira', 'Rua São Francisco do Mogiano,215 Vl Progresso', '(11) 98327-1492', 'Reconciliou', '2019-05-24 00:00:00', 'sim', 'Zô', '27', '', 'Membro'),
(132, 'Livia Maria Lima Queiroz', 'Rua Amaporã,143 Jd Campos', '(11) 98271-5821', 'Reconciliou', '2019-05-26 00:00:00', 'sim', 'Todas', '32', '', 'Visitante'),
(133, 'Wellington Nascimento da Silva', 'Rua Sebastião Alves,7A Pq.Sta Rita', '(11) 97051-5181', 'Aceitou', '2019-05-26 00:00:00', 'não', 'Casais', '23', '', 'Membro'),
(134, 'Thayná Fernanda de Oliveira Silva', 'Rua Sebastião Alves,7A Pq Sta Rita', '(11) 95251-0837', 'Reconciliou', '2019-05-26 00:00:00', 'sim', 'Casais', '22', '', 'Membro'),
(135, 'Welder Alves', 'Rua Congonhas do Sertão,52 Jd Ipe', '(11) 94233-5332', 'Reconciliou', '2019-05-26 00:00:00', 'sim', 'Pr. Joel/Regiane', '', '', 'Membro'),
(136, 'Hilary dos Santos', 'Rua Leonildes da Conceição Diniz,69 Miragaia', '(11) 99435-4582', 'Reconciliou', '2019-05-31 00:00:00', 'não', 'Pr. Joel/Regiane', '13', '', 'Membro'),
(137, 'Vitoria Nascimento', 'Av.dos Ipes,1060 Jd.Ipe', '(11) 95440-4968', 'Reconciliou', '2019-05-31 00:00:00', 'não', 'Pr. Joel/Regiane', '13', '', 'Membro'),
(138, 'Nicolly C.L.de Oliveira', 'Rua Guarapariba,434 Jd Lageado', '(11) 94004-2968', 'Reconciliou', '2019-05-31 00:00:00', 'não', 'Martim/Shirley', '14', '', 'Membro'),
(139, 'Leandro da Silva', 'Rua Registro Velho,328 Jd Campos', '(11) 95403-9653', 'Reconciliou', '2019-06-01 00:00:00', 'sim', '', '36', '', 'Visitante'),
(140, 'Wellington Patrick Rapace Alves', 'Rua Lactancio,147 Vl Curuçá', '(11) 97767-9514', 'Reconciliou', '2019-06-01 00:00:00', 'não', 'Valdirene', '22', '', 'Membro'),
(141, 'Marcone Carlos Castro', 'Rua  Noturno Mineiro,13 Jd Miragaia', '(11) 95194-1404', 'Reconciliou', '2019-06-02 00:00:00', 'não', 'WAGUERSON', '11', '', 'Membro'),
(142, 'Fernando de Souza', 'Rua Manoel Rodrigues da Rocha,347 Sta Rita', '(11) 98473-7039', 'Reconciliou', '2019-06-07 00:00:00', 'sim', 'Pr. Bete/Julio', '31', '', 'Membro'),
(143, 'Mailson Novaes', 'Rua Arvore do Dragão,284 Jd Ipe', '(11) 98444-5254', 'Reconciliou', '1970-01-01 00:00:00', 'sim', 'Valdirene', '31', '', 'Membro'),
(144, 'Reinaldo Rodrigues ', 'Rua Palmeira das Bermudas,27B Jd Ipe', '(11) 99212-9409', 'Reconciliou', '2019-06-09 00:00:00', 'sim', 'Pr. Bete/Julio', '40', '', 'Membro'),
(145, 'Renata Jose Santana ', 'Rua Erva do Sereno,532 Jd Maia', '(11) 95289-3223', 'Reconciliou', '2019-06-09 00:00:00', 'sim', 'Valdirene', '41', '', 'Membro'),
(146, 'Gabriela Nathalia Silva', 'Rua Manajoz,26 Jd Romano', '(11) 93185-706', 'Reconciliou', '2019-06-09 00:00:00', 'sim', 'Lika', '19', '', 'Membro'),
(147, 'Igor M.A.M Junior', 'Rua Apiranga,229 Jd Ipe', '(11) 96347-6451', 'Aceitou', '2019-06-09 00:00:00', 'não', 'Valdirene', '23', '', 'Membro'),
(148, 'Caue Lucio da Rocha', 'Rua Jose Alves Irmâo,200 Itaim', '(11) 92061-2531', 'Aceitou', '2019-06-23 00:00:00', 'não', 'Todas', '21', '', 'Membro'),
(149, 'Jociele Rosa Rodrigues', 'Rua Nicanor Nogueira,208 Jd das Oliveiras', '(11) 93004-2301', 'Reconciliou', '2019-06-23 00:00:00', 'sim', 'Pr. Bete/Julio', '45', '', 'Membro'),
(150, 'Janaina Alves Pereira', 'Rua Pedro Rosa de Abreu,26 Itaim Pta', '(11) 94833-0848', 'Aceitou', '1970-01-01 00:00:00', 'não', 'Valdirene', '', '', 'Membro'),
(151, 'Sophie de Souza Ferraz', 'Rua Cruzeiro', '(11) 97666-9407', 'Aceitou', '2019-06-23 00:00:00', 'não', 'Fabio/Sandra', '11', '', 'Membro'),
(152, 'Leticia dos Santos', 'Rua Canarana do Amazonas,220 Jd Noemia', '(11) 96352-3546', 'Aceitou', '2019-06-23 00:00:00', 'não', 'Todas', '15', '', 'Membro'),
(154, 'Tifanny Fernandes ALLino', 'Rua Terra sem Males,84A Silva Teles', '(11) 95124-6834', 'Reconciliou', '2019-06-23 00:00:00', 'sim', 'Pr. Laércio/Vera', '15', '', 'Membro'),
(155, 'Sabrina da Silva Barbosa', 'Rua Carmo de Minas,2 Pq Paulistano', '(11) 94703-5702', 'Reconciliou', '2019-06-23 00:00:00', 'sim', 'Martim/Shirley', '22', '', 'Membro'),
(156, 'Israel dos Santos Oliveira', 'Rua Rio Pardo,257 Jd Jaci Guarulhos', '(11) 94766-6090', 'Aceitou', '2019-06-23 00:00:00', 'não', 'Martim/Shirley', '26', '', 'Membro'),
(157, 'Monaliza Marciano da Silva', 'Rua Kampala,57 Jd America Penha', '', 'Reconciliou', '2019-06-23 00:00:00', 'sim', 'Zô', '33', '(11) 2038-0294', 'Membro'),
(158, 'Francisco Marciano da Silva ', 'Rua Kampala,57 Jd America Penha', '', 'Reconciliou', '2019-06-23 00:00:00', 'sim', 'Zô', '28', '(11) 2038-0294', 'Membro'),
(159, 'Kawã Nascimento', '', '(11) 95156-5804', 'Reconciliou', '2019-06-23 00:00:00', 'não', 'Todas', '15', '', 'Visitante'),
(160, 'Josefa da Silva Santos Paiva', '', '', 'Reconciliou', '2019-06-23 00:00:00', 'sim', 'Lika', '58', '', 'Membro'),
(161, 'Lourival da Silva Junior', 'Rua Gil Martins,20 A Itaim', '(11) 95966-9531', 'Aceitou', '2019-06-23 00:00:00', 'não', 'Valdirene', '44', '', 'Membro'),
(163, 'Marilene P. de Carvalho', 'Rua Uberaba,388', '(11) 98574-4495', 'Reconciliou', '2019-06-28 00:00:00', 'sim', 'Fabio/Sandra', '48', '', 'Membro'),
(164, 'Yara Aparecida Madalena da Silva', 'Rua Pimenta D\'agua,19', '(11) 97801-7869', 'Aceitou', '2019-06-28 00:00:00', 'não', 'Todas', '18', '', 'Membro'),
(165, 'Lisandra Monteiro', 'Rua Melchiades Neres de Campos', '', 'Reconciliou', '2019-06-28 00:00:00', 'sim', 'Lika', '15', '', 'Membro'),
(166, 'Darcio da Silva Pinto', 'Rua Francisco Portinarel,81 Jd.Jaragua', '(11) 98634-6836', 'Reconciliou', '2019-06-30 00:00:00', 'sim', 'Lika', '31', '', 'Membro'),
(167, 'Helen Bela Orsi', 'Rua Andre Ermelino Ribeiro,129', '(11) 98157-4038', 'Reconciliou', '2019-06-30 00:00:00', 'não', 'Lika', '17', '', 'Membro'),
(168, 'Adelson Oliveira da Silva', 'Av.Carlos Carneiro de Souza,34 Jd.Indaia', '(11) 95148-4733', 'Reconciliou', '2019-07-05 00:00:00', 'não', 'Valdirene', '30', '', 'Membro'),
(170, 'Marcia Bela dos Santos', 'Rua Andre Ermelino Ribeiro,129', '', 'Reconciliou', '2019-06-30 00:00:00', 'sim', 'Lika', '43', '(11) 2567-7253', 'Membro'),
(171, 'Alana Thays da SILVA SOUZA', 'Rua Jose Martins Lisboa,2224 Jd Helena', '(11) 94966-1214', 'Reconciliou', '2019-07-07 00:00:00', 'sim', 'Todas', '23', '', 'Visitante'),
(172, 'Fabio Roberto Paulino', 'Rua Banda,316 São Bernardo do Campo', '', 'Reconciliou', '2019-07-07 00:00:00', 'sim', 'Mirtes', '42', '(11) 4123-3710', 'Visitante'),
(173, 'Thiago Alves de Santana', 'Rua Erva Botão,274 Jd Ipe', '(11) 94959-5999', 'Aceitou', '2019-07-06 00:00:00', 'não', 'WAGUERSON', '21', '', 'Membro'),
(174, 'Ytalo Ferreira de Oliveira', 'Rua Congonhas do Sertao,139 Jd.Ipe', '', 'Aceitou', '2019-07-06 00:00:00', 'não', 'WAGUERSON', '18', '', 'Membro'),
(175, 'Nicole Carneiro Alves dos Santos', 'viela Vitorio Capelaro Jd Miragaia', '(11) 97707-9080', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Valdirene', '12', '', 'Membro'),
(176, 'Jessica Rocha Rodrigues', 'Rua Pitangueiras,256 Jd Sta Brigida Carapicuiba', '(11) 94628-0067', 'Reconciliou', '2019-07-06 00:00:00', 'sim', 'Luizinho/Clarice', '28', '', 'Membro'),
(177, 'Benet Kevin Carvalho dos Reis', 'Rua Pedro ROdrigues', '(11) 95961-2586', 'Reconciliou', '2019-07-06 00:00:00', 'não', 'Valdirene', '15', '', 'Membro'),
(178, 'Ariane Carolina Xavier', 'Rua João Franco dos Reis,26 Carapicuiba', '', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Luizinho/Clarice', '10', '', 'Membro'),
(179, 'Eliane Alves de Oliveira', 'Rua Erva da Saracura,36 Vl Curuçá', '', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Valdirene', '50', '(11) 2511-9729', 'Membro'),
(180, 'Sophie de Souza ', 'Rua Cruzeiro,284 Vl Gepina Itaqua', '(11) 96440-5068', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Fabio/Sandra', '11', '', 'Membro'),
(181, 'Marcelo dos Santos Oliveira', 'Rua Itacaré,164 Vl Esperança Itaqua', '(11) 95157-5153', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Fabio/Sandra', '25', '', 'Membro'),
(182, 'Rosemeire de Oliveira', 'Rua Cruzeiro,282 Vl Gepina Itaqua', '(11) 98568-0588', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Fabio/Sandra', '51', '', 'Membro'),
(183, 'Valeria do Carmo Gonçalves de Lima', 'Rua Julia,37 Itaqua', '(11) 98589-4187', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Fabio/Sandra', '49', '', 'Membro'),
(184, 'Rosangela Rabelo dos Santos', 'Rua Guiraró,331 Curuçá Velha', '(11) 95138-8108', 'Aceitou', '2019-07-14 00:00:00', 'não', 'WAGUERSON', '40', '', 'Membro'),
(185, 'Mauro Bernadino da Silva', 'Rua Guiraró,331 Curuçá Velha', '(11) 95138-8108', 'Aceitou', '2019-07-14 00:00:00', 'não', 'WAGUERSON', '44', '', 'Membro'),
(186, 'Nathaya Barbosa Raimundo', 'Rua Otacilio Dias Fernandes,201', '(11) 94812-5637', 'Reconciliou', '2019-07-14 00:00:00', 'não', 'Lika', '14', '', 'Membro'),
(187, 'Etelvina Maria Melo Bezerra', 'Rua Guaira,81 Itaqua', '(11) 96833-3374', 'Reconciliou', '2019-07-14 00:00:00', 'sim', 'Fabio/Sandra', '39', '', 'Membro'),
(188, 'Jose Roberto da Silva', 'Rua Guiraro,31 Vl Curuça Velha', '(11) 95203-4981', 'Aceitou', '2019-07-14 00:00:00', 'não', 'WAGUERSON', '46', '', 'Membro'),
(190, 'Edson Reis', 'Rua Igaruça,151 Tatuapé', '(11) 99573-4972', 'Aceitou', '2019-07-14 00:00:00', 'não', 'WAGUERSON', '48', '', 'Membro'),
(192, 'Fabiana Reis', 'Rua Igaruça,151 Tatuapé', '(11) 97465-4063', 'Aceitou', '2019-07-14 00:00:00', 'não', 'WAGUERSON', '41', '', 'Membro'),
(193, 'Manuela Reis', 'Rua Igaruça,151 Tatuapé', '(11) 98724-3328', 'Aceitou', '2019-07-14 00:00:00', 'não', 'WAGUERSON', '15', '', 'Membro'),
(194, 'Reinaldo Barbosa dos Santos', 'Rua Guiraró,173 apto 1 bloco A Vl Curuçá Velha', '(11) 97370-0036', 'Aceitou', '2019-07-14 00:00:00', 'não', 'WAGUERSON', '51', '', 'Membro'),
(195, 'Mauricio Antonio de Oliveira', 'Rua Jose Freire Junior,87 Jd Jaragua', '(11) 94785-1691', 'Reconciliou', '2019-07-14 00:00:00', 'sim', 'Martim/Shirley', '41', '', 'Membro'),
(196, 'Gabriel Borges ', 'Rua Manoel Rodrigues,32 A Sta Rita', '(11) 94190-9524', 'Aceitou', '2019-07-14 00:00:00', 'não', 'Martim/Shirley', '15', '', 'Membro'),
(197, 'Milena Stefani Silva', 'Rua Carlos Oscar Egidio Araujo,89', '(11) 93147-7547', 'Aceitou', '2019-07-14 00:00:00', 'não', 'Pr. Bete/Julio', '15', '', 'Membro'),
(198, 'Thatiana Lopes Pereira', 'Rua Tacu,19 Jd Campos', '(11) 95232-6865', 'Reconciliou', '2019-07-14 00:00:00', 'sim', 'Martim/Shirley', '33', '', 'Membro'),
(199, 'Thatiana Batista da Costa', 'Rua Tacaca,94 Jd Campos', '(11) 98678-7453', 'Reconciliou', '2019-07-14 00:00:00', 'sim', 'Martim/Shirley', '35', '', 'Membro'),
(200, 'Michele Dantas Silva', 'Rua Manoel de Linhares,86 Jd Campos', '(11) 95899-0701', 'Reconciliou', '2019-07-21 00:00:00', 'sim', 'Todas', '14', '', 'Membro'),
(201, 'Luis Carlos de Miranda', 'Rua Palmeira das Bermudas 1052 Jd Ipe', '(11) 97429-4078', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Valdirene', '41', '', 'Membro'),
(202, 'Janete Gonçalves', 'Rua Palmeira das Bermudas 1052 Jd Ipe', '(11) 97429-4078', 'Aceitou', '2019-07-06 00:00:00', 'não', 'Valdirene', '50', '', 'Membro'),
(203, 'Davi Ribeiro de Jesus', 'Rua Olivia Coelho Martins,447 VL S.Martinho', '(11) 94739-9485', 'Reconciliou', '2019-07-14 00:00:00', 'sim', 'Valdirene', '26', '', 'Membro'),
(204, 'Jessica Regina Cardoso', 'Rua Alto Jurua 667', '(11) 98605-5513', 'Reconciliou', '1970-01-01 00:00:00', 'não', 'Jaqueline', '30', '', NULL),
(205, 'Moises Ferreira', 'Rua Vital Brasil 597 Itaqua', '', 'Reconciliou', '1970-01-01 00:00:00', 'não', 'Fabio/Sandra', '19', '(11) 4642-4839', NULL),
(206, 'Luciana Prado', 'Rua Palmeira das Bermudas 467', '(11) 98481-2660', 'Reconciliou', '1970-01-01 00:00:00', 'sim', '', '39', '', NULL),
(207, 'Andreza dos Santos Arruda', 'Rua Mendes Pinto 237 Pq.Buturussu', '(11) 98539-4560', 'Aceitou', '1970-01-01 00:00:00', 'não', 'Zô', '19', '', NULL),
(208, 'Marcio Farnochia', 'Rua Batista Malio 01 Jd Nazaré', '', 'Aceitou', '2019-09-08 00:00:00', 'não', 'Lika', '45', '(11) 2963-0538', NULL),
(209, 'Tatiane Carvalho da Silva', 'Rua João Batista Malio 01 Jd Nazaré', '', 'Reconciliou', '2019-09-08 00:00:00', 'não', 'Lika', '42', '(11) 2963-0538', NULL),
(210, 'Elizangela Lima Silva', 'Rua Luiza Rosa Paes Landim', '', 'Reconciliou', '2019-09-06 00:00:00', 'sim', 'Todas', '42', '(11) 2513-2156', NULL),
(211, 'Max Rodrigues', 'Rua Domingues Vidigal, 48 Jd Jaraguá', '(11) 95839-8432', 'Reconciliou', '2019-09-06 00:00:00', 'sim', 'Valdirene', '23', '', NULL),
(212, 'Gilseane Quitéria dos Anjos', 'Rua Alexandre Dias Nogueira,369 Curuçá Velha', '', 'Reconciliou', '2019-09-06 00:00:00', 'não', 'Zô', '28', '(11) 2153-1568', NULL),
(213, 'Nelson dos Anjos', 'Rua Alexandre Dias Nogueira', '', 'Aceitou', '2019-09-06 00:00:00', 'não', 'Zô', '53', '(11) 2153-1568', NULL),
(214, 'Lucélia Borges de Almeida', 'Rau Manoel Barbalho de lima,79', '(11) 98290-1524', 'Reconciliou', '2019-09-06 00:00:00', 'não', 'Casais', '41', '', NULL),
(215, 'Giovana Lucena', 'Rua Parreira Brava,315 bloco 2', '(11) 95869-5947', 'Reconciliou', '2019-09-06 00:00:00', 'sim', 'Pr. Laércio/Vera', '17', '', NULL),
(216, 'Eliana Moreira Santiago', 'Rua André Ermelino Ribeiro 137', '', 'Aceitou', '1970-01-01 00:00:00', 'não', 'Lika', '47', '(11) 2561-1195', NULL),
(217, 'Renata Alves dos Santos', 'Rua Erva de Saracura,36  24C', '(11) 98654-5760', 'Reconciliou', '2019-09-22 00:00:00', 'não', 'Todas', '23', '', NULL),
(218, 'José Martins da Cunha Neto', 'Rua Julio Bala,25 Apto 22A Itaquera', '(11) 99571-2142', 'Reconciliou', '2019-09-22 00:00:00', 'sim', 'Zô', '41', '', NULL),
(219, 'Dayane Marques Custodio', 'Rua Muriti,175 Miragaia', '(11) 98260-8205', 'Reconciliou', '2019-09-22 00:00:00', 'sim', 'Lika', '37', '', NULL),
(220, 'Katia Garcia', 'Rua Jardim das Margaridas,272 Vl Buenos Aires', '(11) 93335-5452', 'Reconciliou', '2019-09-27 00:00:00', 'sim', 'Zô', '24', '', NULL),
(221, 'Michele Rodrigues Luz da Silva', 'Rua Vital Brasil,597 Itaqua', '(11) 93279-2754', 'Aceitou', '2019-10-06 00:00:00', 'sim', 'Fabio/Sandra', '23', '', NULL),
(222, 'Igor Cassiano Aragão', 'Rua Imburana,131 Vl Progresso', '(11) 95156-5804', 'Reconciliou', '2019-10-06 00:00:00', 'sim', 'Martim/Shirley', '22', '', NULL),
(223, 'Rone Pau Ferro', 'Rua Doutor Francisco Tancredi,893 Pq Paulistano', '(11) 94894-1788', 'Reconciliou', '2019-10-06 00:00:00', 'sim', 'Casais', '37', '', NULL),
(224, 'Evelyn Souza de Melo', 'Rua Jason Xavier de Barros,12 Jd das Oliveiras', '(11) 98111-0402', 'Reconciliou', '2019-10-06 00:00:00', 'sim', 'Todas', '29', '', NULL),
(225, 'Israel Leite Ferreira', 'Rua Congonhas do Sertão,333 Jd Ipe', '', 'Aceitou', '2019-10-13 00:00:00', 'não', 'Valdirene', '28', '', NULL),
(226, 'Ana Claudia da Silva', 'Av. Caraipe das Aguas 1171', '', 'Reconciliou', '2019-10-20 00:00:00', 'sim', 'Todas', '28', '', NULL),
(227, 'Gustavo Fernandes Feitosa', 'Av. dos Ipes', '', 'Aceitou', '2019-10-20 00:00:00', 'não', 'Todas', '25', '', NULL),
(228, 'Flavia Ramos dos Santos', 'Rua Renascer,66 Pantanal', '(11) 98067-9271', 'Reconciliou', '2019-10-20 00:00:00', 'sim', 'Valdirene', '33', '', NULL),
(229, 'Joel Teles de Souza', 'Rua Calamo Aromático,56', '(11) 98532-8542', 'Reconciliou', '2019-10-25 00:00:00', 'não', 'Jaqueline', '29', '', NULL),
(230, 'Elias Ferreira Costa', 'Rua Uruçuca,40 Vl Esperença', '(11) 98731-0198', 'Reconciliou', '2019-10-25 00:00:00', 'não', 'Fabio/Sandra', '32', '', NULL),
(231, 'Adriana S. dos Reis', 'Rua Monte Cambarela', '(11) 98573-7885', 'Aceitou', '2019-10-25 00:00:00', 'não', 'Jaqueline', '21', '', NULL),
(232, 'Adriano Silva dos Reis', 'Rua Monte Cambarela,190', '', 'Reconciliou', '2019-10-27 00:00:00', 'sim', 'Jaqueline', '25', '', NULL),
(233, 'Maria Lurdes Alves da Silva', 'Rua Adelino Polesse,07 Vl Verde', '(11) 95135-4831', 'Reconciliou', '2019-08-04 00:00:00', 'não', 'Todas', '59', '', NULL),
(234, 'Caio da Silva Costa', 'Rua Tres Pinheiros,182 Jd Laura', '(11) 98185-3486', 'Aceitou', '2019-08-04 00:00:00', 'não', 'Casais', '22', '', NULL),
(235, 'Gean Carlos dos Santos', 'Rua Corrego Tijuco Preto,18 Jd das Oliveiras', '(11) 95908-6859', 'Aceitou', '2019-08-04 00:00:00', 'não', 'Casais', '23', '', NULL),
(236, 'Daniele Vieira de Sales', 'Rua Corrego Tijuco Preto,18 Jd das Oliveiras', '(11) 98305-7260', 'Reconciliou', '2019-08-04 00:00:00', 'sim', 'Casais', '23', '', NULL),
(237, 'Marcia Amaral da Silva', 'Rua Andre Ermelino Ribeiro,129 A Jd Silva Teles', '', 'Aceitou', '2019-08-11 00:00:00', 'não', 'Todas', '39', '', NULL),
(238, 'Cynthia Bernardes da Silva', 'Rua Izabel Morales de O. Miragaia,50 Jd Miragaia', '', 'Aceitou', '2019-08-13 00:00:00', 'não', 'Todas', '17', '(11) 2514-9803', NULL),
(239, 'Augusto Silva Lucas', 'Rua Izabel Morales de O. Miragaia,50 Jd Miragaia', '', 'Aceitou', '2019-08-13 00:00:00', 'não', 'Todas', '19', '(11) 2514-9803', NULL),
(240, 'Maria Cristina Pereira Dias', 'Rua Palmeira das Bermudas 1559 Jd Ipe', '', 'Reconciliou', '2019-08-13 00:00:00', 'sim', 'Zô', '42', '(11) 3433-8550', NULL),
(241, 'Francisca Nunes Barbosa', 'Rua Rosa Musgo,69 Jd Ipe', '(11) 96288-1745', 'Reconciliou', '2019-08-13 00:00:00', 'sim', 'Lika', '58', '', NULL),
(242, 'Elisabete de Oliveira', 'Rua Alexandre Dias Nogueira,369 Vl Curuça', '(11) 98626-9269', 'Aceitou', '2019-08-16 00:00:00', 'não', 'Zô', '24', '', NULL),
(243, 'Matheus Henrique Silva', 'Folha Dourada C2,08 Itaim', '(11) 98293-8663', 'Reconciliou', '2019-08-16 00:00:00', 'sim', 'Todas', '16', '', NULL),
(244, 'David Adriano dos Anjos', 'Rua Alexandre Dias Nogueira Vl Curuça', '(11) 98626-9269', 'Aceitou', '2019-08-16 00:00:00', 'não', 'Zô', '25', '', NULL),
(245, 'Valdinei Fernandes dos Santos', 'Rua Piracema 13A Jd Campos', '(11) 98372-2378', 'Reconciliou', '2019-08-18 00:00:00', 'sim', 'WAGUERSON', '37', '', NULL),
(246, 'Alexandre William dos Santos', 'Rua 15 de Novembro,500 J Europa', '(11) 93358-7221', 'Reconciliou', '1970-01-01 00:00:00', 'sim', 'Todas', '35', '', NULL),
(247, 'Cleison Willian Almeida', 'Rua Manoel Barbalho de Lima,62 Silva Teles', '(11) 94793-1704', 'Reconciliou', '2019-08-18 00:00:00', 'não', 'Casais', '42', '', NULL),
(248, 'Emily Cibele dos Anjos', 'Rua Alexandre Dias Nogueira,369 Vl Curuça', '(11) 97765-4605', 'Aceitou', '2019-08-18 00:00:00', 'não', 'Zô', '14', '', NULL),
(249, 'Caroline Saletti da Silva', 'Rua Palmeira das Bermudas 1052 Jd Ipe', '(11) 95374-7309', 'Aceitou', '2019-08-23 00:00:00', 'não', 'Valdirene', '17', '', NULL),
(250, 'Cleber Wesley Meira da Silva', 'Rua Padre Renato,30 Vl Mara', '(11) 94508-4131', 'Reconciliou', '2019-08-23 00:00:00', 'sim', 'WAGUERSON', '22', '', NULL),
(251, 'Guilherme Pereira de Souza', 'Rua Mututi,130 Itaim', '(11) 95280-2162', 'Aceitou', '2019-08-30 00:00:00', 'não', 'Todas', '14', '', NULL),
(252, 'Raul Bonifacio da Silva Venancio', 'Rua Alexandre Machado Pereira Jd Helena', '', 'Aceitou', '2019-09-01 00:00:00', 'não', 'WAGUERSON', '27', '(11) 2561-8217', NULL),
(253, 'Cicera Quiteria de Lurdes', 'Rua Alexandre Dias Nogueira,369 Vl Curuça', '', 'Aceitou', '2019-09-01 00:00:00', 'não', '', '56', '(', NULL),
(254, 'Guilherme Alves', 'Rua Tomas dos Reis,19 Vl Barbosa', '(11) 94169-1410', 'Aceitou', '2019-09-01 00:00:00', 'não', 'Todas', '14', '(', NULL),
(255, 'Rosangela Oliveira', 'Rua General Dalton Teixeira,133 Pq Paulistan', '', 'Reconciliou', '2019-11-01 00:00:00', 'sim', 'Zô', '43', '(', NULL),
(256, 'Kelly Cristina Alvaro', 'Rua Pimenteira,05 casa 2 Curuça Velha', '(11) 98706-6226', 'Aceitou', '2019-11-01 00:00:00', 'não', 'WAGUERSON', '38', '(', NULL),
(257, 'Matheus Vinicius da Silva', 'Rua Izabel Morales de O. Miragaia', '(11) 95959-4624', 'Aceitou', '2019-11-03 00:00:00', 'não', 'Todas', '15', '(', NULL),
(258, 'Ruan Marcos Chagas da Silva', 'Rua Jorge Rodrigues Nizar,102 Jd Miliumas', '(11) 94981-0992', 'Aceitou', '2019-11-03 00:00:00', 'não', 'Lika', '12', '(', NULL),
(259, 'Jessica Gorete Monteiro', 'Rua Jorge Rodrigues Niza,102 Cid.Kemel', '(11) 98734-1176', 'Reconciliou', '2019-11-03 00:00:00', 'sim', 'Lika', '12', '(', NULL),
(260, 'Noemi Regina Gomes', 'Rua João Francil dos Reis 26', '(11) 94107-0834', 'Reconciliou', '2029-09-19 00:00:00', 'não', 'Luizinho/Clarice', '29', '', NULL),
(261, 'Luana Barbosa de Souza', 'Rua Calamo Aromatico 52', '(11) 94842-1346', 'Aceitou', '2005-11-19 00:00:00', 'não', 'Pr. Joel/Regiane', '', '', NULL),
(262, 'Pablo da Cunha Lima', 'Rua Caimbé 03 Jd Ipe', '(11) 94920-3062', 'Aceitou', '2005-11-19 00:00:00', 'não', 'WAGUERSON', '', '', NULL),
(263, 'Wendell Alves de Jesus', 'Via de pedestre Minotauro 127', '', 'Reconciliou', '2010-11-19 00:00:00', 'sim', 'Valdirene', '18', '', NULL),
(264, 'Jean Cezar do Carmo Nunes', 'Rua Genario Alves Pereira', '(11) 94889-4223', 'Aceitou', '2017-11-19 00:00:00', 'não', 'WAGUERSON', '27', '', NULL),
(265, 'André Monteiro Dias', 'Rua Rosa Musgo 81', '(11) 98389-6444', 'Aceitou', '2019-11-19 00:00:00', 'não', 'Prs. Bete/Julho', '16', '', NULL),
(266, 'Regiane Spitaletti Barros', 'Rua Faveira Pequena 371', '', 'Reconciliou', '2019-11-19 00:00:00', 'sim', 'Todas', '32', '(11) 2512-6912', NULL),
(268, 'Vitoria Oliveira Cavalcanti', 'Rua Guaraicica 94, Vl Curuçá', '(11) 95215-5985', 'Reconciliou', '2019-11-19 00:00:00', 'sim', 'Pr. Joel/Regiane', '14', '', NULL),
(269, 'Ana Silva de Souza', 'Rua Juramento 09,Jd Bartira', '(11) 98764-0827', 'Reconciliou', '2017-11-19 00:00:00', 'sim', 'WAGUERSON', '36', '', NULL),
(270, 'Kevin Khel da Silva Gomes', 'Rua Rosa Musgo 96', '', 'Reconciliou', '2019-11-19 00:00:00', 'sim', 'Prs. Bete/Julho', '36', '(11) 3012-3932', NULL),
(271, 'Ester dos Santos Cruz', 'Rua Arvore de Umbrella 323', '', 'Aceitou', '2019-11-19 00:00:00', 'não', 'Zô', '13', '', NULL),
(272, 'Luana Barbosa Machado', 'Av.estrada de Sta Izabel 5838 Bairro do Unna', '(11) 98401-1420', 'Reconciliou', '2019-11-19 00:00:00', 'sim', 'Fabio/Sandra', '19', '', NULL),
(273, 'Gabriel Henrique Nascimento Alves', 'Rua Gabiroba de Minas 17,Jd Etelvina', '', 'Reconciliou', '2019-11-19 00:00:00', 'não', 'Martim/Shirley', '10', '', NULL),
(274, 'Reyel Silva Araujo', 'Rua Vistosa da Madre de Deus 587,Jd Maia', '(11) 96091-5025', 'Aceitou', '2019-11-19 00:00:00', 'não', 'Todas', '15', '', NULL),
(275, 'Ana Carolina Vilarindo', 'Rua Cordão de São Francisco,1243 Itaim Pta', '(11) 96793-1825', 'Reconciliou', '2019-11-19 00:00:00', 'não', 'Todas', '26', '', NULL),
(276, 'José Ivaldo da Silva', 'Rua Leonilde da Conceição Diniz 216', '', 'Reconciliou', '2019-11-19 00:00:00', 'não', 'Valdirene', '43', '', NULL),
(277, 'Gabriel Miranda Ribeiro', 'Rua Paranacite 651,Jd Helena', '(11) 99724-2055', 'Reconciliou', '2019-11-19 00:00:00', 'sim', 'Quatro Seres', '15', '', NULL),
(278, 'Denilson Joseph da Silva', 'Rua Imperial ,Vl Buenos Aires', '', 'Reconciliou', '2019-11-19 00:00:00', 'não', 'Zô', '17', '(11) 2038-0294', NULL),
(279, 'Suellen Cristina Souza Justini', 'Rua Adamus Dedori 28 Jd Vilma', '(11) 96673-3951', 'Reconciliou', '2019-12-19 00:00:00', 'sim', 'Todas', '31', '', NULL),
(280, 'Mirella Souza', 'Rua Adamus Dedori 28', '(11) 96673-3951', 'Aceitou', '2019-12-19 00:00:00', 'não', 'Todas', '09', '', NULL),
(281, 'Maria Aparecida Vieira ', 'Rua Baleeira Branca,13', '', 'Aceitou', '2019-12-19 00:00:00', 'não', 'Todas', '', '', NULL),
(282, 'Gabriela Thainá Santiago', 'Rua Piranema 10 Jd Campos', '(11) 98262-4962', 'Reconciliou', '2020-01-03 00:00:00', 'sim', 'Valdirene', '22', '', NULL),
(283, 'Thaiane de Souza Carvalho', 'Rua Isabel Morales 456', '(11) 93230-4606', 'Reconciliou', '2020-12-06 00:00:00', 'não', 'Zô', '13', '', NULL),
(284, 'Karolina Ferreira dos Santos', 'Rua Isabel Morales 108', '(11) 96501-9464', 'Reconciliou', '2020-01-06 00:00:00', 'sim', 'Zô', '13', '', NULL),
(285, 'Gabriela Thayná Santiago', 'Rua Piranema 10 J. Campos', '(11) 98262-4962', 'Reconciliou', '2020-01-03 00:00:00', 'sim', 'Valdirene', '22', '', NULL),
(286, 'Ermenia Gomes da Silva', 'Rua Luiz Amorim Costa 179 S Miguel Pta', '(11) 99397-8241', 'Reconciliou', '2020-01-10 00:00:00', 'não', 'Zô', '67', '', NULL),
(287, 'Wesley Estanislau de Oliveira', 'Rua Palmeira das Bermudas 1223', '', 'Reconciliou', '2020-01-10 00:00:00', 'não', 'Prs. Bete/Julho', '31', '(11) 2528-9781', NULL),
(288, 'Kemily Fereira Almeida', 'Rua Vitória do Espirito Santo 501,bloco 2A,apto 41', '(11) 99382-4399', 'Reconciliou', '2020-01-12 00:00:00', 'não', 'Casais', '23', '(11) 2528-9781', NULL),
(289, 'Adelucia Maria O.da Silva', 'Rua Botao de Prata 9 Vl Curuçá', '(11) 94815-2504', 'Aceitou', '2020-01-12 00:00:00', 'não', 'WAGUERSON', '56', '', NULL),
(290, 'Edineia Ferreira Calado da Silva', 'Rua Alpercata,18 J Robrú', '(11) 98231-5177', 'Aceitou', '2020-01-12 00:00:00', 'não', 'Lika', '48', '', NULL),
(291, 'Everton José dos Santos', 'Rua Aricanga 1252 Sta Rita', '', 'Reconciliou', '1969-12-31 00:00:00', 'não', 'Lika', '38', '(11) 2511-7142', NULL),
(292, 'Gabriel Santos Xavier Dias ', 'Rua Alto dos Oitis 372 Vl Mara', '(11) 97622-3479', 'Reconciliou', '2020-01-17 00:00:00', 'sim', 'Martim/Shirley', '20', '', NULL),
(293, 'Diego Costa do Nascimento', 'Av.Corrego Tijuco Preto 113 Camargo Novo', '(11) 96072-8219', 'Reconciliou', '2020-01-17 00:00:00', 'não', 'Todas', '31', '', NULL),
(294, 'Luigi Augusto de Paula Santos', 'Rua 12,491 Jd.Maria Antonia Sumaré', '(11) 98773-5065', 'Reconciliou', '2020-01-19 00:00:00', 'não', 'Martim/Shirley', '17', '', NULL),
(295, 'Douglas Andrade', 'Rua Silvio Balbino 632 José Bonifácio', '(11) 98833-6144', 'Reconciliou', '2020-01-19 00:00:00', 'sim', 'Todas', '35', '', NULL),
(296, 'Roberto Akira Alves Yamauti', 'Rua Vicente de Oliveira Leme 05 Jd Nélia', '', 'Aceitou', '2020-01-19 00:00:00', 'não', 'Casais', '28', '(11) 2561-5736', NULL),
(297, 'Debora Angel Alves Yamauti', 'Rua Vicente de Oliveira Leme 05', '', 'Reconciliou', '2020-01-19 00:00:00', 'sim', 'Casais', '', '(11) 2561-5736', NULL),
(298, 'Vitoria Gabriela Saga Nascimento', 'Rua Francisco Portinari 97 Jd Jaraguá', '(11) 99005-3176', 'Aceitou', '2020-01-19 00:00:00', 'não', 'Todas', '15', '', NULL),
(299, 'Diego Alves Damasceno', 'Rua Domingues Vidigal,481  Jd Jaraguá', '(11) 96030-5102', 'Reconciliou', '2020-01-26 00:00:00', 'não', 'Pr. Laércio/Vera', '25', '', NULL),
(300, 'Suellen Pereira  de Andrade ', 'Rua Mongaguá 137,Jd Vista Alegre Embú das Artes', '(11) 98179-9427', 'Reconciliou', '2020-02-21 00:00:00', 'sim', 'Lika', '22', '', NULL),
(301, 'Vitoria Pereira Braga', 'Rua Caraipe das Aguas 638 Jd Ipe', '(11) 97352-2302', 'Reconciliou', '2020-02-14 00:00:00', 'não', 'Lika', '17', '', NULL),
(302, 'Maria Claudia Braga', 'Rua Caraipe das Aguas 638 Jd Ipe', '(11) 97955-8029', '', '2020-02-14 00:00:00', 'não', 'Lika', '44', '', NULL),
(303, 'Decileide Medeiros Santos', 'Rua Caraipe das Aguas 223 Jd Ipe', '', 'Aceitou', '2020-02-14 00:00:00', 'não', 'WAGUERSON', '52', '', NULL),
(304, 'Sandra Regina Alves de Lima', 'Rua Dr. Gil Martins 20 Itaim Pta', '(11) 97504-3683', 'Reconciliou', '2020-02-23 00:00:00', 'sim', 'Valdirene', '52', '', NULL),
(305, 'Pamela Marcondes', 'Rua Pedro Micaiu 256 Pq Paulistano', '(11) 94816-3137', 'Reconciliou', '2020-02-16 00:00:00', 'sim', 'Valdirene', '21', '', NULL),
(306, 'Fernanda Vismala Raimundo', 'Rua Otacilio Dias Fernandes 201 Pq Sat Rita', '(11) 94729-4111', 'Reconciliou', '2020-02-16 00:00:00', 'sim', 'Zô', '38', '', NULL),
(307, 'Gabriela Correia', 'Rua Dr.Oscar Egidio de Araujo 83 Itaim Pta', '(11) 98521-4220', 'Reconciliou', '2020-02-16 00:00:00', 'não', 'Todas', '17', '', NULL),
(308, 'Valdelice Sena Cruz', 'Rua Manoel Lemes da Silva', '(11) 98561-3848', 'Aceitou', '1969-12-31 00:00:00', 'não', 'Todas', '17', '', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `acessoNEW`
--

CREATE TABLE `acessoNEW` (
  `id` int(10) NOT NULL,
  `username` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `password` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `ativo` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nivel_acesso` int(5) DEFAULT NULL,
  `userID` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `acessoNEW`
--

INSERT INTO `acessoNEW` (`id`, `username`, `password`, `ativo`, `nivel_acesso`, `userID`) VALUES
(13, 'analu.luz@hotmail.com', '830f5842c3a36664a1c92cfe473274120817e958', 's', 1, NULL),
(27, 'jaquelinesouza_2006@hotmail.com', '80ae81b3610ea2db3c8b30d5750577a0224de38b', 's', 2, NULL),
(28, 'laerciomkids@hotmail.com', '98ebdd68274088177654f2979b95577296575011', 's', 6, NULL),
(29, 'prdanielmorse@gmail.com', 'f50dd7eb93c36128aa3c7f318827667ae1e8a92d', 's', 1, NULL),
(32, 'brunoorosco@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 's', 1, NULL),
(35, 'TTARCILA.9FONSECA@HOTMAIL.COM', '7676b94aeab20ec701ef44a668b47a4bdabe331e', 's', 4, NULL),
(36, 'martimramalhovieira@gmail.com', '3cdd69a233b86c23df73155c4efffd42ecca1e00', 's', 2, NULL),
(37, 'shirley.viviane5@yahoo.com.br', '1ea1e86d64176f4088cddb018b1e72714ddaface', 's', 2, NULL),
(38, 'Mirtesbs@hotmail.com', 'df484203d40c3a7d4a9cac1daea496f4ba2049b0', 's', 2, NULL),
(39, 'adm_progresso@hotmail.com', 'a5170d4af145f8ac82eb5c1bc6ef964cc8976fec', 's', 3, NULL),
(52, 'ericass_30santos@hotmail.com', '64b31cb7cb4435925d71a39505f101753a8f8075', 's', 2, NULL),
(53, 'fabinhoduipe@hotmail.com', 'cc4bb6ddcaffcfe5be44364056f0cb2418975029', 's', 2, NULL),
(54, 'waguerson.oliveira@gmail.com', '24b918668f5ee471f92a0ff6b6ec90136fc12fd7', 's', 2, NULL),
(81, 'elianalikapequeno@gmail.com', '3b6f4f36cf8530873f6d77413623a371e881f8cf', 's', 2, NULL),
(82, 'bia.clarice@yahoo.com.br', '9045554175b585337357e659bcedfef40c784475', 's', 2, NULL),
(84, 'marcus_otto@hotmail.com', '079773a6cb61ac1b0c49ce4584a1b175709637a9', 's', NULL, NULL),
(85, 'rafa_gomes19@yahoo.com.br', '7905fb13dbc9084bb7701a9a1d2e8d6e2725f08b', 's', NULL, NULL),
(86, 'valdireneclamor@yahoo.com.br', '5eb19632c1fad1708878b239484820baf2982cf3', 's', 5, NULL),
(87, 'franciscofabio705@hotmail.com', 'bac2f02cb89079ca3374cf41f710c3eb6be19ada', 's', 2, NULL),
(88, 'sandradantassiqueirafrancisco0@gmail.com', 'a3e6acab7b6799a099fd62f38991bf266d9a2447', 's', 2, NULL),
(89, 'lucasorsi95@gmail.com', '34144872dbc2b34710db769939d524bd6f4dbb3b', 's', NULL, NULL),
(90, 'francildo68f@gmail.com', '6ec0e63341d4cf2a05f598730147ca99189b2058', 's', 2, NULL),
(91, 'willian.uei@hotmail.com', '30a5fc48dba1d932dace384bd8a0bab16dba9af7', 's', 2, NULL),
(92, 'sumariacunha@hotmail.com', '0155f33ae9d85f83367171b54bcdc2e4b3e78c08', 's', 2, NULL),
(93, 'eliane.filo@bol.com.br', '589036d84393ee556f51c419a3fa78429c55a57b', 's', 3, NULL),
(94, 'kakocunha48@gmail.com', '34e253fa05ab09a5f058f8da103df0cd01f4a409', 's', 3, NULL),
(95, 'anderson.alves777@gmail.com', '2da9acf0e7cea34a8514052367cc1817e5593996', 's', 3, NULL),
(96, 'magna_osilva@yahoo.com.br', 'c0780b96f199a83286bd728138b9f59640f6b33c', 's', 2, NULL),
(97, 'aguia.bilhares@yahoo.com.br', '63b8e61e450f08bf24865dc1c50652fbb77155e1', 's', 3, NULL),
(98, 'aguia.bilhares@yahoo.com.br', '1d4e65029a6773675a5fd60991d99a1a434341e4', 's', 3, NULL),
(99, 'RI.AVIVAC@HOTMAIL.COM', '7be3f962ae1af47b68d2955ae53be02aefb5b6a4', 's', 2, NULL),
(101, 'kelly.naoesquecerasenha@gmail.com', '5397de72d45232230342f0f7c490fb8a172b23c9', 's', 2, NULL),
(103, 'gisellygihrf@gmail.com', '6c8d8decd731208b5e28fc46a1d547c37c0f2f1f', 's', NULL, NULL),
(153, 'supervisor@supervisor', '7c4a8d09ca3762af61e59520943dc26494f8941b', 's', 2, NULL),
(159, 'thauane.melissa@gmail.com', '666d35bdcd8fa8cc9e83a2ab83dc1556bd03b072', 's', NULL, NULL),
(160, 'joel.santos@novelis.com ', '7c4a8d09ca3762af61e59520943dc26494f8941b', 's', 3, NULL),
(161, '953225288dayane@gmail.com', 'e489ce51ff945c85699acb6705d284ec3bc7d5c9', 's', 2, 273),
(163, 'GLEIDSON@DECARINHO.COM.BR', 'a77bc3372919bb8853e5677d8cfa36c3ddec3349', 's', 2, 403),
(164, 'VANESSA@DECARINHO.COM.BR', '60d7b273225583de28d885eb4e25fe8817ffde8a', 's', 2, 404),
(165, 'gih.neres19@gmail.com', 'f75e37165e1fe7971f605bd0d970bfe85c961c36', 's', 2, 405),
(166, 'giovannamorseoliveira@hotmail.com', 'e4050b861543a0ef9bf889d674f2fe3692137781', 's', 2, 369);

-- --------------------------------------------------------

--
-- Estrutura para tabela `batizando`
--

CREATE TABLE `batizando` (
  `id` int(10) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `aniversario` date DEFAULT NULL,
  `cem` int(10) DEFAULT NULL,
  `batismo` int(10) NOT NULL,
  `sexo` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cem`
--

CREATE TABLE `cem` (
  `id` int(10) NOT NULL,
  `responsavel` int(10) NOT NULL,
  `endereco` varchar(50) NOT NULL,
  `nome_cem` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `cem`
--

INSERT INTO `cem` (`id`, `responsavel`, `endereco`, `nome_cem`) VALUES
(1, 85, '', 'Zô/Fátima'),
(2, 76, '', 'Lika'),
(3, 46, '', 'Wargueson'),
(4, 26, '', 'Casais'),
(5, 200, '', 'Joel/Regiane'),
(6, 17, '', 'Laércio/Vera'),
(7, 21, '', 'Martim/Shirley'),
(8, 77, '', 'Luiz/Clarice'),
(9, 86, '', 'William/Sumalia'),
(10, 81, '', 'Valdirene'),
(11, 89, '', 'Marcos/Eliane'),
(12, 95, '', 'kids'),
(13, 92, '', 'Wagner/Rosana');

-- --------------------------------------------------------

--
-- Estrutura para tabela `config_sistem`
--

CREATE TABLE `config_sistem` (
  `id` int(10) NOT NULL,
  `funcao` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `_status` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'n'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `config_sistem`
--

INSERT INTO `config_sistem` (`id`, `funcao`, `_status`) VALUES
(1, 'todos_membros', 's'),
(2, 'filtro_membros', '2');

-- --------------------------------------------------------

--
-- Estrutura para tabela `courseName`
--

CREATE TABLE `courseName` (
  `id` int(10) NOT NULL,
  `Course` varchar(30) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Despejando dados para a tabela `courseName`
--

INSERT INTO `courseName` (`id`, `Course`) VALUES
(1, 'Angelologia'),
(2, 'Honra'),
(3, 'Geografia Bíblica'),
(4, 'Escatologia'),
(5, 'Simbologia e Tipologia'),
(6, 'Teologia'),
(7, 'Os Pecados Capitais');

-- --------------------------------------------------------

--
-- Estrutura para tabela `curso`
--

CREATE TABLE `curso` (
  `idCursos` int(10) NOT NULL,
  `nomeAluno` varchar(50) NOT NULL,
  `chamada` tinyint(1) NOT NULL,
  `dataAula` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `encontrista`
--

CREATE TABLE `encontrista` (
  `idEncontrista` int(10) NOT NULL,
  `nomeEnc` varchar(45) NOT NULL,
  `telEnc` varchar(15) DEFAULT NULL,
  `endEnc` varchar(50) DEFAULT NULL,
  `sexoEnc` varchar(10) DEFAULT NULL,
  `CEM` varchar(25) DEFAULT NULL,
  `observacao` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Despejando dados para a tabela `encontrista`
--

INSERT INTO `encontrista` (`idEncontrista`, `nomeEnc`, `telEnc`, `endEnc`, `sexoEnc`, `CEM`, `observacao`) VALUES
(5, 'ALINE VAZ MACHADO SILVA', '(11) 95374-1617', 'RUA: IGARAPE AGUA AZUL ', 'Feminino', 'WAGUERSON', ''),
(6, 'FRANCISCO CLEBE DA SILVA ', '(11) 98387-7057', 'RUA: JOÃO DE MESQUITA 33', 'Masculino', 'WAGUERSON', ''),
(7, 'FRANCIELE PLOVEIRA DE LIMA ', '(11) 95211-0945', 'RUA PEROBA ROSA 181', 'Feminino', 'WAGUERSON', ''),
(8, 'MARCELY TALITA DA SILVA ', '(11) 97581-6578', 'RUA CONGONHAS DO SERTÃO 328', 'Feminino', 'WAGUERSON', ''),
(9, 'LEANDRO RAMALHO NEIVA', '(11) 94811-6495', 'RUA OSORIO FRANCO VILHENA ', 'Masculino', 'WAGUERSON', ''),
(10, 'DIEGO ALVES ', '(11) 94745-9699', 'RUA PEROBA ROSA 169', 'Masculino', 'WAGUERSON', ''),
(11, 'ALEX SANTOS SALES', '', '', 'Masculino', 'WAGUERSON', ''),
(12, 'GIOVANNA DIAS GALARTE', '(11) 99233-8082', 'AV MARECHAL TITO 823', 'Feminino', 'WAGUERSON', ''),
(13, 'KATHELEEN CRISTINA DA S. RODRIGUES', '(11) 94953-7194', 'RUA DA TABOA 34', 'Feminino', 'WAGUERSON', ''),
(14, 'JULIANA SILVERIO DOS SANTOS', '(11) 98196-0779', 'RUA RIO ITAPICU MIRIM 34', 'Feminino', 'WAGUERSON', ''),
(15, 'ERICA SOUZA SANTOS ', '(11) 99986-6513', '', 'Feminino', 'WAGUERSON', ''),
(16, 'KELLY VIEIRA SOBRAL', '(11) 95398-6539', 'RUA ODETE AMARAL 58', 'Feminino', 'Jaqueline', ''),
(17, 'CARLOS EDUARDO DE AGUIAR', '(11) 94685-8511', 'RUA JOSE JUNQUEIRA 12', 'Masculino', 'Jaqueline', ''),
(18, 'EDILAINE SOARES', '', 'RUA CARAIPE DAS AGUAS 210', 'Feminino', 'Jaqueline', ''),
(19, 'GUILHERME AUGUSTO RODRIGUES NASCIMENTO', '(11) 97747-2283', '', 'Masculino', 'Jaqueline', ''),
(20, 'SULLEN DE JESUS SILVA', '(11) 99391-8515', 'RUA JOÃO BATISTA SANTIAGO 523', 'Feminino', 'Jaqueline', ''),
(21, 'JORDAM SANTOS ', '', '', 'Masculino', 'Jaqueline', ''),
(22, 'GABRIEL BEZERRA', '', '', 'Masculino', 'Jaqueline', ''),
(23, 'LUIS FERNANDO', '', '', 'Masculino', 'Carapicuiba', ''),
(24, 'ROBSON PATRICK SILVA ', '', '', 'Masculino', 'Carapicuiba', ''),
(25, 'ROGERIO SOARES DA SILVA ', '(11) 97069-0241', 'RUA CASTANHEIRO DO BREJO 84', 'Masculino', 'Carapicuiba', ''),
(26, 'CAUÃ LIMA MARTINS', '(11) 98617-0775', 'RUA GIL MARTINS ', 'Masculino', 'Valdirene', ''),
(27, 'FABIO DA MAIA', '(11) 97375-9520', 'RUA ANTONIO GOMES 22', 'Masculino', 'Valdirene', ''),
(28, 'ANDRE RODRIGUES', '(11) 95109-0248', 'RUA NICANOR NOGUEIRA 208', 'Masculino', 'Valdirene', ''),
(29, 'TAMIRES INARA DA COSTA BATISTA ', '(11) 97957-0508', 'RUA MANOEL BARBALHO DE LIMA 11', 'Feminino', 'Valdirene', ''),
(30, 'MARINEIDE DA SILVA ', '(11) 98459-5846', 'AV MARIA SANTANA 943', 'Feminino', 'Valdirene', ''),
(31, 'VINICIUS DE ASSIS SOUZA', '(11) 95148-8145', '', 'Masculino', 'Valdirene', ''),
(32, 'SUELEN ALMEIDA SANTOS ', '(11) 94875-5101', '', 'Feminino', 'Valdirene', ''),
(33, 'SUSICLEI DE ALMEIDA', '(11) 25843-520', '', 'Feminino', 'Valdirene', ''),
(34, 'STEFANE FERREIRA DA SILVA ', '(11) 94872-1555', '', 'Feminino', 'Pr. Joel', ''),
(35, 'NORMALUCIA F. BARROS', '(11) 94116-0601', '', 'Feminino', 'Pr. Joel', ''),
(36, 'CAMILY FERREIRA PASSARELLI', '', '', 'Feminino', 'Pr. Joel', ''),
(37, 'JULIA APARECIDA', '(11) 98260-3540', '', 'Feminino', 'Pr. Joel', ''),
(38, 'RENATA MARIA LIMA BETTIN', '(11) 95386-9819', '', 'Feminino', 'Martim/Shirley', ''),
(40, 'LUCAS CARDOSO DE OLIVEIRA', '(11) 93152-6625', '', 'Masculino', 'Martim/Shirley', ''),
(41, 'ELAINE GOMES DE OLIVEIRA', '(11) 98282-9874', '', 'Feminino', 'Martim/Shirley', ''),
(42, 'DANIELA SANTOS DE JESUS', '', '', 'Feminino', 'Itu', ''),
(43, 'MATEUS RIBEIRO SILVA DE MENDEIROS', '', '', 'Masculino', 'Itu', ''),
(44, 'JOÃO CARLOS AMORIM', '', '', 'Masculino', 'Itaqua', ''),
(45, 'ARHUR ALEIXO', '', '', 'Masculino', 'Itaqua', ''),
(46, 'WANDERGLEISON O. CRUZ', '', '', 'Masculino', 'Itaqua', ''),
(47, 'VANESSA SOARES DE ALMEIDA ', '', '', 'Feminino', 'Itaqua', ''),
(48, 'KAROLINE O. DA SILVA ', '', '', 'Feminino', 'Casais', ''),
(49, 'KEMILY FERREIRA DE ALMEIDA ', '', '', 'Feminino', 'Casais', ''),
(50, 'ALEXANDRE DE SOUZA JUNIOR ', '', '', 'Masculino', 'Casais', ''),
(51, 'MATHEUS DIAS DE OLIVEIRA', '', '', 'Masculino', 'Casais', ''),
(52, 'CELMA MARTINS SANTOS ', '', '', 'Feminino', 'Casais', ''),
(53, 'AGATHA MARTINS CRUZ', '', '', 'Feminino', 'Casais', ''),
(54, 'DANIELE DE ALMEIDA COSTA ', '', '', 'Feminino', 'Mirtes', ''),
(55, 'THIAGO NASCIMENTO LIMA ', '', '', 'Masculino', 'Mirtes', ''),
(56, 'SERGIO MOREIRA DOS SANTOS ', '', '', 'Masculino', 'Mirtes', ''),
(57, 'ANDREIA FELIX PEIXOTO', '', '', 'Feminino', 'Pr.Laercio/Pra.Vera', ''),
(58, 'GABRIEL RODRIGUES SANTANA', '', '', 'Masculino', 'Pr.Laercio/Pra.Vera', ''),
(59, 'BIANCA SODRE FELIX SANTANA', '', '', 'Feminino', 'Pr.Laercio/Pra.Vera', ''),
(60, 'LAUANE DO N. BONFIM', '', '', 'Feminino', 'Pr.Laercio/Pra.Vera', ''),
(61, 'RAIANY JULIA M. NASCIMENTO ', '', '', 'Feminino', 'Pr.Laercio/Pra.Vera', ''),
(62, 'DANIEL SILVA MATIAS DOS SANTOS ', '', '', 'Masculino', 'Aldo', ''),
(63, 'JAMILLE RODRIGUES CABRAL', '', '', 'Feminino', 'Aldo', ''),
(64, 'ALINE MOREIRA MEDEIROS', '', '', 'Feminino', 'Aldo', ''),
(65, 'ICARO SILVA BATATINO', '', '', 'Masculino', 'Aldo', ''),
(66, 'SANDRO RICARDO DE SOUZA', '', '', 'Masculino', 'Gledson/Vanessa', ''),
(67, 'EDNILSON BRUNO ', '', '', 'Masculino', 'Gledson/Vanessa', ''),
(68, 'SEVERINO JOÃO DE SOUZA ', '', '', 'Masculino', 'Gledson/Vanessa', ''),
(69, 'CLEISON MELO', '', '', 'Masculino', 'Gledson/Vanessa', ''),
(70, 'PRISCILA REHENE MACEDO', '', '', 'Feminino', 'Zô', ''),
(71, 'ADINA CORREIA DA SILVA ', '', '', 'Feminino', 'Zô', ''),
(72, 'EVELIN DA CRUZ MEDINA ', '', '', 'Feminino', 'Zô', ''),
(73, 'FABIANA ', '', '', 'Feminino', 'Zô', ''),
(74, 'FABIO ANTÃO', '', '', 'Masculino', 'Zô', ''),
(75, 'EDVALDO GOMES LIMA ', '', '', 'Masculino', 'Zô', ''),
(76, 'GLEDSON DE JESUS CORREIA', '', '', 'Masculino', 'Zô', ''),
(77, 'MAGDA MORAIS LEITE ', '', '', 'Masculino', 'Zô', ''),
(79, 'LUIZ CARLOS VERAS', '', '', 'Masculino', 'Zô', ''),
(80, 'ROBERTO BORGES BONFIM', '', '', 'Masculino', 'Lika', ''),
(81, 'PATRICIA GOMES PEDRINA ', '', '', 'Feminino', 'Lika', ''),
(82, 'VINICIUS CORDEIRO ', '(11) 98799-2995', '', 'Masculino', 'Lika', ''),
(83, 'VITORIA VIEIRA SOUSA FELIX', '(11) 95384-2344', '', 'Feminino', 'Lika', ''),
(84, 'LUIS FERNANDO SANTOS LUZ', '(11) 97334-0996', '', 'Masculino', 'Lika', ''),
(85, 'RITA DE CASSIA FERREIRA SANTOS ', '(11) 95836-0704', '', 'Feminino', 'Lika', ''),
(87, 'MATHEUS F. CALADO DA SILVA ', '', '', 'Masculino', 'Lika', ''),
(88, 'JANICLEIA SAMPAIO DE SOUZA ', '', '', 'Feminino', 'Lika', ''),
(89, 'JONATHAN DE PAULA SANTOS', '', '', 'Masculino', 'Lika', ''),
(90, 'KAUAN WILLIAM BEZERRA', '', '', 'Masculino', 'Lika', ''),
(91, 'BRUNA ALBUQUERQUE DE LIMA ', '', '', 'Feminino', 'Lika', ''),
(92, 'AGNALDO CARDEAL DE BONFIM', '', '', 'Masculino', 'Lika', ''),
(93, 'MICHEL DO CARMO DE LIMA ', '', '', 'Masculino', 'Lika', ''),
(94, 'IRISANDRA H. M. DA SILVA ', '', '', 'Feminino', 'Lika', ''),
(99, 'NICOLE CAMARA DO AMOR', '', '', 'Feminino', 'Pr. Joel', ''),
(100, 'CLEITON SILVA SOUZA', '', '', 'Masculino', 'Lika', ''),
(101, 'COSME DE JESUS ', '', '', 'Masculino', 'Lika', ''),
(103, 'ALEX BRUNO SALES', '', '', 'Masculino', 'Lika', ''),
(104, 'ISAIAS APARECIDO DOS SANTOS ', '', '', 'Masculino', 'Lika', ''),
(105, 'EUCLIDES BORGES', '', '', 'Masculino', 'Lika', ''),
(107, 'LARISSA SANTOS DE CARVALHO', '', '', 'Feminino', 'Lika', ''),
(108, 'CLAUDIA DOS SANTOS SILVA ', '', '', 'Feminino', 'Lika', ''),
(109, 'CARLOS ROBERTO SANTOS DE OLIVEIRA', '', '', 'Masculino', 'Lika', ''),
(110, 'GABRIELA THAYNA SANTIAGO MACHADO', '', '', 'Feminino', 'Lika', ''),
(111, 'GABRIELE VICTORIA BONFIM', '', '', 'Feminino', 'Lika', ''),
(112, 'LARISSA OLIVEIRA SANTOS ', '', '', 'Feminino', 'Lika', ''),
(113, 'JOSENILTON ARAUJO DA SILVA ', '', '', 'Masculino', 'Lika', ''),
(114, 'GISELE SILVA SANTANA ', '', '', 'Feminino', 'Lika', ''),
(115, 'JENIFER DE BORTOLE', '', '', 'Feminino', 'Martim/Shirley', ''),
(116, 'TATIANE DOS SANTOS FRANCA', '', '', 'Feminino', 'Martim/Shirley', ''),
(117, 'MISLENE G. DE OLIVEIRA', '', '', 'Masculino', 'Martim/Shirley', ''),
(118, 'ELLEN CRISTINA BEZERRA', '', '', 'Feminino', 'Martim/Shirley', ''),
(119, 'ANA LUIZA SALES SANTOS', '', '', 'Feminino', 'Martim/Shirley', ''),
(120, 'ELIZABETH DA CONCEIÇÃO', '', '', 'Feminino', 'Martim/Shirley', ''),
(121, 'JULICIDE NOBRE DA SILVA ', '', '', 'Feminino', 'Martim/Shirley', ''),
(122, 'KAREN SUELEN DA SILVA', '', '', 'Feminino', 'Martim/Shirley', ''),
(123, 'RONALDO LUIZ JUNIOR ', '', '', 'Masculino', 'Martim/Shirley', ''),
(124, 'MACIEL DE SOUZA NOBRE', '', '', 'Masculino', 'Martim/Shirley', ''),
(125, 'LEANDRO FERNANDES MACEDO', '', '', 'Masculino', 'Martim/Shirley', ''),
(126, 'ADALBERTO ANTONIO DE OLIVEIRA', '', '', 'Masculino', 'Martim/Shirley', ''),
(127, 'MARCOS FERREIRA DOS SANTOS ', '', '', 'Masculino', 'Martim/Shirley', ''),
(128, 'ANA VITORIA ANDRADE', '', '', 'Feminino', 'Pr. Joel', ''),
(129, 'MARINA', '', '', 'Feminino', 'Pr. Joel', ''),
(130, 'MOACIR MOREIRA', '', '', 'Masculino', 'Pr. Joel', ''),
(131, 'LUIZ CARLOS PEREIRA', '', '', 'Masculino', 'Pr. Joel', ''),
(132, 'EDILSON FREITAS DA SILVA ', '', '', 'Masculino', 'Pr. Joel', ''),
(133, 'ELTON PEREIRA DA SILVA ', '', '', 'Masculino', 'Pr. Joel', ''),
(134, 'MARIA DAS DORES BARBOSA', '', '', 'Feminino', 'Pr. Joel', ''),
(135, 'MARCIA REGINA MACHADO', '', '', 'Feminino', 'Pr. Joel', ''),
(136, 'LUANA LIMA SANTOS ', '', '', 'Feminino', 'Pr. Joel', ''),
(137, 'ELENILDA OLIVEIRA DAMACENO', '', '', 'Feminino', 'Pr. Joel', ''),
(138, 'CELIA DE OLIVEIRA', '', '', 'Feminino', 'Pr. Joel', ''),
(139, 'ANDRESSA MAYUI YAMADA', '', '', 'Feminino', 'WAGUERSON', ''),
(140, 'MARIA DAS GRAÇAS RODRIGO', '', '', 'Feminino', 'WAGUERSON', ''),
(141, 'SAMARA DOS SANTOS SILVA ', '', '', 'Feminino', 'WAGUERSON', ''),
(142, 'MARIA DAS DORES SANTOS ', '', '', 'Feminino', 'WAGUERSON', ''),
(143, 'SONIA MARIA OLIVEIRA', '', '', 'Feminino', 'WAGUERSON', ''),
(144, 'ELIANA DOS SANTOS FONSECA', '', '', 'Feminino', 'WAGUERSON', ''),
(145, 'ELIZABETE FERREIRA DOS SANTOS ', '', '', 'Feminino', 'WAGUERSON', ''),
(146, 'ERIKA SOUZA SANTOS', '', '', 'Feminino', 'WAGUERSON', ''),
(147, 'ERICA GOMES DOS SANTOS ', '', '', 'Feminino', 'WAGUERSON', ''),
(148, 'ROMERO KAPPS JUNIOR ', '', '', 'Masculino', 'WAGUERSON', ''),
(149, 'CHESTER CARLOS DA SILVA ', '', '', 'Masculino', 'WAGUERSON', ''),
(150, 'NATANAEL GOMES ARAUJO', '', '', 'Masculino', 'WAGUERSON', ''),
(151, 'AILTON DA SILVA MUNIZ', '', '', 'Masculino', 'Jaqueline', ''),
(152, 'DAVID DA COSTA', '', '', 'Masculino', 'Jaqueline', ''),
(153, 'MARIA MARGARIDA MANZANI', '', '', 'Feminino', 'Jaqueline', ''),
(154, 'ESTER', '', '', 'Feminino', 'Jaqueline', ''),
(155, 'FABIANA COUTINHO MUNIZ', '', '', 'Feminino', 'Jaqueline', ''),
(156, 'IVAN JOSE DA SILVA JUNIOR', '', '', 'Masculino', 'Casais', ''),
(157, 'WELLINGTON NASCIMENTO', '', '', 'Masculino', 'Casais', ''),
(158, 'THAYNA FERNANDA DE OLIVEIRA', '', '', 'Feminino', 'Casais', ''),
(159, 'KESLY KAROLLYN DA SILVA ', '', '', 'Feminino', 'Casais', ''),
(160, 'THIAGO NUNES DA COSTA ', '', '', 'Masculino', 'Casais', ''),
(161, 'REBECA DANIELE DA SILVA ', '', '', 'Feminino', 'Valdirene', ''),
(162, 'NILSON RYAN DE JESUS', '', '', 'Masculino', 'Valdirene', ''),
(163, 'RAYANE VITORIA', '', '', 'Feminino', 'Valdirene', ''),
(164, 'PATRICIA DE JESUS FERREIRA', '', '', 'Feminino', 'Valdirene', ''),
(165, 'CAMILA ALVES DOS SANTOS ', '', '', 'Feminino', 'Valdirene', ''),
(166, 'DANIELE GUIMARÃES', '', '', 'Feminino', 'Gledson/Vanessa', ''),
(167, 'THIAGO ANTONIO NEVES ', '', '', 'Masculino', 'Aldo', ''),
(168, 'ULICES RICARDO PINTO ', '', '', 'Masculino', 'Aldo', ''),
(169, 'RICARDO PINTO DE ABREU', '', '', 'Masculino', 'Aldo', ''),
(170, 'GABRIEL ALVES FEITOZA', '', '', 'Masculino', 'Martim/Shirley', ''),
(171, 'MARIA APARECIDA ALVES', '', '', 'Feminino', 'Martim/Shirley', ''),
(172, 'TATIANA MACEDO DUNDA', '', '', 'Feminino', 'Pr.Laercio/Vera', ''),
(173, 'MACIEL SANTANA DOS SANTOS ', '', '', 'Masculino', 'Pr.Laercio/Vera', ''),
(174, 'JULIO CESAR DOS SANTOS', '', '', 'Masculino', 'Pr.Laercio/Vera', ''),
(175, 'ALECIO PEREIRA ALENCAR', '', '', 'Masculino', 'Pr.Laercio/Vera', ''),
(176, 'DIEGO ALVES DAMASCENO', '', '', 'Masculino', 'Pr.Laercio/Vera', ''),
(177, 'MANOEL MARCOS BEZERRA', '', '', 'Masculino', 'Carapicuiba', ''),
(178, 'CAROLINE ADOLFO KOVALINKINAS', '', '', 'Feminino', 'Carapicuiba', ''),
(179, 'GERSON LUIZ MELO', '', '', 'Masculino', 'Zô', ''),
(180, 'ROSANGELO CUNHA MOREIRA', '', '', 'Masculino', 'Zô', ''),
(181, 'CAIO CEZAR ALMEIDA', '', '', 'Masculino', 'Zô', ''),
(182, 'KAROLINA FERREIRA SANTOS', '', '', 'Feminino', 'Zô', ''),
(183, 'JENIFFER CASTRO SANTOS', '', '', 'Feminino', 'Zô', ''),
(184, 'JULIANA QUITERIA DOS ANJOS ', '', '', 'Feminino', 'Zô', ''),
(185, 'RENATO MIGUEL', '', '', 'Masculino', 'Zô', ''),
(186, 'DANIELA PEREIRA ALVES ', '', '', 'Feminino', 'Zô', ''),
(187, 'EMERSON ALVES OLIVEIRA', '', '', 'Feminino', 'Zô', ''),
(188, 'SAMYRA ALVES', '', '', 'Feminino', 'Zô', ''),
(189, 'ROSIMEIRE DE OLIVEIRA', '', '', 'Feminino', 'Itaqua', ''),
(190, 'GABRIELLE CONCEIÇÃO', '', '', 'Feminino', 'Itaqua', ''),
(191, 'VALERIA DE LIMA ', '', '', 'Feminino', 'Itaqua', ''),
(192, 'ALAN ASSIS DUARTE', '', '', 'Masculino', 'WAGUERSON', ''),
(193, 'NILTON HENRIQUE ', '', '', 'Masculino', 'Itu', ''),
(194, 'YARA', '', '', 'Feminino', 'Itu', ''),
(195, 'NILSON ANGELO DA SILVA ', '', '', 'Masculino', 'Itu', ''),
(196, 'ANA FLAVIA RAMOS', '', '', 'Feminino', 'Itu', ''),
(197, 'ANA CAROLINA DA SILVA ', '', '', 'Feminino', 'Itu', ''),
(198, 'MARIA AMELIA GOMES', '', '', 'Feminino', 'Itu', ''),
(199, 'DAYANE ', '', '', 'Feminino', 'Itu', ''),
(200, 'ELAINE BATISTA DA CUNHA ', '', '', 'Feminino', 'Eliseu /Marlene', ''),
(201, 'JONAS QUIRINO DA CUNHA ', '', '', 'Masculino', 'Eliseu /Marlene', ''),
(202, 'DAVI CUNHA QUIRINO', '', '', 'Masculino', 'Eliseu /Marlene', ''),
(203, 'HENRIQUE JOSE CAMPOS', '', '', 'Masculino', 'Eliseu /Marlene', ''),
(204, 'SONIA MARIA BATISTA', '', '', 'Feminino', 'Eliseu /Marlene', ''),
(205, 'SONIA MARIA VALDEMAR', '', '', 'Feminino', 'Gledson/Vanessa', ''),
(206, 'EDSON BISPO DOS SANTOS ', '', '', 'Masculino', 'Martim/Shirley', ''),
(208, 'ELIZABETH C. DA CONCEIÇÃO', '(11) 92733-079', 'RUA GUARAPARIBA 434', 'Feminino', 'Martim/Shirley', ''),
(209, 'ELLEN CRISTINA BEZERRA', '(11) 97802-4445', 'RUA:LAGOA CAJULA 116', 'Feminino', 'Martim/Shirley', ''),
(210, 'ELAINE NOGUEIRA DE OLIVEIRA', '(11) 94444-7558', 'RUA: CARCANI 31', 'Feminino', 'Martim/Shirley', ''),
(211, 'GUILHERME RAMALHO VILAÇA', '(11) 98082-7581', 'RUA:CARAIPE DAS AGUAS 509', 'Masculino', 'Martim/Shirley', ''),
(212, 'RENATA MARIA LIMA BITTEM ', '(11) 95386-9819', 'RUA: MENDANHA ', 'Feminino', 'Martim/Shirley', ''),
(213, 'ELAINE CARDOSO DE OLIVEIRA', '(11) 98031-2261', 'RUA: LAGOA CAJUBA 101', 'Feminino', 'Martim/Shirley', ''),
(214, 'LEANDRO FERNANDES MACEDO', '(11) 94986-3722', 'RUA: LAGOA CAJUBA 116', 'Masculino', 'Martim/Shirley', ''),
(215, 'ELAINE CARDOSO DOS SANTOS ', '(11) 94810-4505', 'RUA: LAGOA CAJUBA 116', 'Feminino', 'Martim/Shirley', ''),
(216, 'ANA LUIZA SALES SANTOS ', '(11) 96812-5934', 'RUA LAGOA CAJUBA 101', 'Feminino', 'Martim/Shirley', ''),
(218, 'ADALBERTO ANTONIO DE OLIVEIRA', '(11) 94088-4181', 'RUA: GUARAPARIBA 434', 'Masculino', 'Martim/Shirley', ''),
(219, 'ELAINE GOMES DE OLIVEIRA SANTOS ', '(11) 94728-6824', 'RUA:GUARAPARIBA 434', 'Feminino', 'Martim/Shirley', ''),
(220, 'JOYCE GABRIELA C. RIBEIRO', '(11) 94680-6729', 'RUA:PALMEIRA DAS BERMUDAS 826', 'Feminino', 'Valdirene', ''),
(221, 'CAMILA ALVES DOS SANTOS ', '', 'RUA:VITORIO CAPELORO ', 'Feminino', 'Valdirene', ''),
(222, 'MARINEIDE DA SILVA ', '', 'RUA:PALMEIRA DAS BERMUDAS 863', 'Feminino', 'Valdirene', ''),
(223, 'KAROLINE ALVES DE OLIVEIRA SILVA ', '(11) 98594-1162', 'RUA:PALMEIRA DAS BERMUDAS 863', 'Feminino', 'Valdirene', ''),
(224, 'GUSTAVO HENRIQUE C. RIBEIRO ', '(11) 94680-6729', 'RUA: PALMEIRA DAS BERMUDAS 826', 'Masculino', 'Valdirene', ''),
(225, 'SUSICLER LEME DE ALMEIDA ', '(11) 94036-9116', 'RUA:BORBOLETA AMARELA ', 'Feminino', 'Valdirene', ''),
(226, 'SUELEN ALMEIDA SANTOS ', '(11) 94875-5105', 'RUA:BORBOLETA AMARELA 210', 'Feminino', 'Valdirene', ''),
(227, 'RAYANE VITORIA ', '(11) 95966-5531', 'RUA:DR. GIL MARTINS ', 'Feminino', 'Valdirene', ''),
(228, 'CAUÃ DE LIMA MARTINS', '(11) 25856-186', 'RUA: CORDILHEIRA DO ARARIPE ', 'Masculino', 'Valdirene', ''),
(229, 'VINICIUS DE ASSIS SOUZA', '', 'RUA: PROF ASSIS VELOSO ', 'Masculino', 'Valdirene', ''),
(230, 'NILSON RYAN ALVES DE JESUS', '(11) 43061-043', 'RUA: DR GILMAR MARTINS', 'Masculino', 'Valdirene', ''),
(232, 'THALITA LILIANE', '(11) 96760-6651', 'RUA:DOS IGARAPES 282', 'Feminino', 'Lika', ''),
(233, 'ALEX BRUNO J. SALES ', '(11) 99336-3512', 'AV:DOS IPÊS 282', 'Masculino', 'Lika', ''),
(234, 'GABRIEL FERNANDES DE SOUZA ', '(11) 96258-8075', 'RUA: GUAUIVA', 'Masculino', 'Lika', ''),
(235, 'MATHEUS FERNANDES', '(11) 96258-8075', 'RUA: GUAIUREIRA 121', 'Masculino', 'Lika', ''),
(236, 'CLEITON DA SILVA SOUSA', '(11) 98281-4037', 'AV:FREDERICO MARTINS DA COSTA CARVALHO 469', 'Masculino', 'Lika', ''),
(237, 'PATRICIA GOMES ', '(11) 98799-2995', 'RUA:LEQUIRANA DE GOIAS 515 APTO 1', 'Feminino', 'Lika', ''),
(238, 'ROBERTO BORGES BONFIM', '(11) 98799-2995', 'RUA:JEQUIRANA DE GOIAS 515 APTO 1', 'Masculino', 'Lika', ''),
(239, 'FELIPE CESAR R. DE SOUZA', '(11) 98494-1710', 'RUA: ROSA MUSGO 475', 'Masculino', 'WAGUERSON', ''),
(240, 'SAMUEL DOS SANTOS CARVALHO', '(11) 94984-5811', 'RUA:CARMO DE MINA 32', 'Masculino', 'Itaqua', ''),
(241, 'WANDERGLEISON O. CRUZ', '', 'RUA: CRUZEIRO 282', 'Masculino', 'Itaqua', ''),
(242, 'RAQUEL MARIA FERRAZ', '(11) 96440-5068', 'RUA:CRUZEIRO 284', 'Feminino', 'Itaqua', ''),
(243, 'ROSEMEIRE OLIVEIRA ', '(11) 98568-0588', 'RUA:CRUZEIRO 282', 'Feminino', 'Itaqua', ''),
(244, 'CHESTER CARLOS DA SILVA ', '(11) 95194-1404', 'RUA:NOTURNO MINEIRO 13', 'Masculino', 'WAGUERSON', ''),
(245, 'SAMARA DOS SANTOS ', '(11) 95934-9945', 'RUA:ERVA BOTÃO', 'Feminino', 'WAGUERSON', ''),
(246, 'ANDRESSA MAYUMI R. YAMADA', '', '', 'Feminino', 'WAGUERSON', ''),
(247, 'ROMERO KAPPS JUNIOR ', '', 'RUA:ARICANGA 974', 'Masculino', 'WAGUERSON', ''),
(248, 'ALISSON ROBERTO FRAGA', '', '', 'Masculino', 'WAGUERSON', ''),
(249, 'LILIAN BRITO GOMES DOS SANTOS ', '(11) 95431-5963', 'RUA:JACAREANA 9', 'Feminino', 'WAGUERSON', ''),
(250, 'ERIKA BRITO GOMES DOS SANTOS ', '', '', 'Feminino', 'WAGUERSON', ''),
(251, 'ROSELI BRITO DOS SANTOS ', '', 'RUA:JACAREANA 9', 'Feminino', 'WAGUERSON', ''),
(252, 'DANIELA SANTOS DE JESUS ', '(11) 95038-3374', 'RUA:DAS GAIVOTAS ', 'Feminino', 'Itu', ''),
(253, 'DAYANE APARECIDA JESUS', '(11) 95322-5288', 'RUA:DAS GAIVOTAS ', 'Feminino', 'Itu', ''),
(254, 'NILTON HENRIQUE LIMA JUNIOR ', '(11) 94211-8878', 'RUA:DAS GAIVOTAS ', 'Masculino', 'Itu', ''),
(255, 'LUIZ FERNANDO BILLER JAQUES ', '(11) 97247-2633', 'RUA:DOS COLIBRIS 6.173', 'Masculino', 'Itu', ''),
(256, 'MARIA DE FATIMA SANTOS DA SILVA ', '(11) 93144-3215', 'RUA:LOURO LINGA 16 A ', 'Feminino', 'Jaqueline', ''),
(257, 'SUELLEN DE JESUS SILVA ', '(11) 99391-8515', 'AV:JOÃO BATISTA SANTIAGO 523', 'Feminino', 'Jaqueline', ''),
(258, 'AILTON ROSA MUNIZ ', '', 'RUA:LOUROTINGA ', 'Masculino', 'Jaqueline', ''),
(259, 'KELLY VIEIRA SOBRAL', '(11) 95398-6539', 'RUA:ODETE AMARAL', 'Feminino', 'Jaqueline', ''),
(260, 'GUILHERME AUGUSTO', '(11) 97747-2233', '', 'Masculino', 'Jaqueline', ''),
(261, 'ESTER FERREIRA ALVES ', '(11) 98177-8298', 'TRAVESSA EUGENIO MILARA 173', 'Feminino', 'Jaqueline', ''),
(262, 'CLAUDIANE ROSEMERE DE OLIVEIRA', '(11) 94029-1684', 'RUA:MATASO SAKAI 180', 'Feminino', 'Jaqueline', ''),
(263, 'RENATO MIGUEL ', '(16) 98150-0589', 'RUA:ANTONIO ALVES FERREIRA 371', 'Masculino', 'Zô', ''),
(264, 'DANIELA P. ALVES ', '(11) 97372-4827', 'RUA:SÃO GONÇALO DO RIO DAS PEDRAS 972', 'Feminino', 'Zô', ''),
(265, 'JENIFFER CASTRO DOS SANTOS ', '(11', 'RUA: CAMPALA 30', 'Feminino', 'Zô', ''),
(266, 'CAIO CEZAR ALMEIDA DOS SANTOS ', '(11) 99915-7117', 'RUA:CABO DAS TORMENTAS 254', 'Masculino', 'Zô', ''),
(267, 'JULIANA QUITERIA DOS ANJOS ALMEIDA ', '(11) 99915-5998', '', 'Feminino', 'Zô', ''),
(268, 'CAROLINE ADOLFO KOVALINKINAS', '(11) 95405-260', 'RUA:MONTE AZUL PAULISTA 346', 'Feminino', 'Luizinho/Clarice', ''),
(269, 'ROGERIO SOARES DA SILVA ', '(11) 97069-0241', 'RUA: CASTANHEIRO DO BREJO 295', 'Masculino', 'Luizinho/Clarice', ''),
(270, 'NILDA ', '', 'RUA:SABIA LARANJEIRA', 'Feminino', 'Pr. Joel', ''),
(271, 'ALEXSANDER BRAGA ALVES ', '(11) 96806-6437', 'RUA:SABIA LARANJEIRA268', 'Masculino', 'Pr. Joel', ''),
(272, 'REGINALDO TADEU', '(11) 94746-2771', 'RUA:GITIRANA 75', 'Masculino', 'Pr. Joel', ''),
(273, 'TATIANA MACEDO DUNDA ', '(11) 96581-6114', 'RUA:IGARAPES 980', 'Feminino', 'Prs.Laércio/Vera', ''),
(274, 'THIAGO ANTONIO NUNES ', '(11) 95377-1749', 'RUA: SALVADOR PIRES MONTEIRO 4', 'Masculino', 'Willian/Sumalia', ''),
(275, 'JULIA APARECIDA DIAS', '(11) 98260-3540', 'AV:DOS IPES 571', 'Feminino', 'Prs.Bete/ Julio', ''),
(276, 'ANA VITORIA ANDRADE', '(11) 94617-6543', 'RUA:GRAVATA DA PEDRA 37', 'Feminino', 'Prs.Bete/ Julio', ''),
(277, 'ANDRE RODRIGUES ', '(11) 95109-0248', 'RUA:NICANOR NOGUEIRA ', 'Masculino', 'Prs.Bete/ Julio', ''),
(278, 'GEOVANNA TAVARES DA SILVA ', '(11) 98694-7297', 'RUA:PALMEIRA REAL 92', 'Feminino', 'Prs.Bete/ Julio', ''),
(279, 'DANIEL WILLIAM BORGES DE ALMEIDA ', '(11) 98220-1524', 'RUA:MANUEL BARBALHA DE LIMA ', 'Masculino', 'Prs.Bete/ Julio', ''),
(280, 'IVAN ', '', '', 'Masculino', 'Casais', ''),
(281, 'MICHELLY RIBEIRO LUZ ', '(94) 79387-10', 'RUA:MATEUS BARBOSA DE RESENDE 85', 'Feminino', 'Casais', ''),
(282, 'DENER SANTOS LUZ ', '(11) 94796-7754', 'RUA:MATEUS BARBOSA RESENDE 85', 'Masculino', 'Casais', ''),
(284, 'THAYNA FERNANDA DE OLIVEIRA SILVA ', '(11) 95251-8837', '', 'Feminino', 'Casais', ''),
(285, 'WELLINGTON NASCIMENTO DA SILVA ', '(11) 97051-5181', 'RUA:SEBASTIÃO ALVES 7 A ', 'Masculino', 'Casais', ''),
(297, 'DANIELI DE OLIVEIRA COSTA', '(11) 98381-0217', 'RUA: PADRE VIRGILIO CAMPELO ', 'Feminino', 'Prs.Laércio/Vera', ''),
(298, 'MACIEL SANTANA DOS SANTOS ', '(11) 93924-3903', '', 'Masculino', 'Prs.Laércio/Vera', ''),
(299, 'JOÃO CARLOS R. AMORIM ', '(11) 97589-3150', 'RUA:GRAVATA DE PEDRA 353', 'Masculino', 'Itaqua', ''),
(300, 'PATRICIA DE JESUS FERREIRA ', '(11) 94944-8177', 'AV ROSARIA ', 'Feminino', 'Valdirene', ''),
(302, 'DANIELE GUIMARÃES', '', 'RUA ANTONIO VIANA ', 'Feminino', 'Gledson/Vanessa', ''),
(303, 'LARISSA OLIVEIRA SANTOS ', '', 'RUA APIRANGA', 'Feminino', 'Lika', ''),
(304, 'DOUGLAS BATISTA DOS SANTOS ', '(11) 94930-7714', 'RUA APIRANGA ', 'Masculino', 'Lika', ''),
(305, 'JANICLECIA SAMPAIO DE SOUZA ', '(11) 96979-3527', 'RUA PEDRO RODRIGUES ', 'Feminino', 'Lika', ''),
(306, 'RAFAEL CAVALCANTE DA SILVA ', '(11) 25746-308', 'RUA OSORIO FRANCO VILHENA 953', 'Masculino', 'Zô', ''),
(307, 'PEDRO HENRIQUE LUZ', '', '', 'Masculino', 'Casais', ''),
(308, 'EMERSON ALVES OLIVEIRA', '(11) 97717-3180', 'TRAVESSA ANTONIO PIATEZI 14', 'Masculino', 'Zô', ''),
(309, 'RONALDO LUIZ JUNIOR ', '(11) 96834-7951', 'VIELA ZUBELITA 122', 'Masculino', 'Martim/Shirley', ''),
(310, 'TATIANE DOS SANTOS FRANÇA', '(11) 95410-7697', 'VIELA ZUBELITA 122', 'Feminino', 'Martim/Shirley', ''),
(311, 'HENRIQUE JOSÉ CAMPOS ', '(11) 93026-8916', 'RUA ANTONIO TATSUKIKO 129', 'Masculino', 'Eliseu /Marlene', ''),
(312, 'JONAS QUIRINO ', '(11) 98342-2020', 'RUA PASTOR ORIAS XAVIER E MENDONÇA 75', 'Masculino', 'Eliseu /Marlene', ''),
(313, 'DAVID RIBEIRO DE JESUS', '(11) 94739-9485', 'RUA OLIVIA COELHO DE JESUS 447', 'Masculino', 'Valdirene', ''),
(314, 'MARIA GIRDERLANDIA DA SILVA ', '(11) 94962-4326', 'RUA OLIVIA COELHO DE JESUS 447', 'Feminino', 'Valdirene', ''),
(315, 'LUIS CARLOS DE MIRANDA MARCOLINO ', '', 'RUA PALMEIRAS DAS BERMUDAS 1.052', 'Masculino', 'Valdirene', ''),
(316, 'JANETE JOSÉ GONÇALVES MARCOLINO', '', 'RUA PALMEIRA DAS BERMUDAS 1.052', 'Feminino', 'Valdirene', ''),
(317, 'MARIA RAIMUNDA ALVES ', '(11) 98617-0175', 'RUA DR. GIL MARTINS ', 'Feminino', 'Valdirene', ''),
(318, 'NICOLE CARNEIRO ALVES ', '(11) 93305-5825', 'RUA JOÃO DE MESQUITA ', 'Feminino', 'Valdirene', ''),
(319, 'CAIQUE MARQUES DE JESUS', '(11) 95271-1716', 'RUA APIU QUIRIBO', 'Masculino', 'Valdirene', ''),
(320, 'FELIPE ZWIR', '(11) 96258-8075', 'RUA GUAIUVIA 121', 'Masculino', 'Lika', ''),
(321, 'THAYSA DA SILVA BORGES ', '(11) 95986-9437', 'RUA ANTONIO CACÃO 52', 'Feminino', 'Lika', ''),
(322, 'NICOLAS GOSHOMOTO', '(11) 95986-9437', 'RUA ANTONIO CACÃO 58', 'Masculino', 'Lika', ''),
(323, 'JULIA NUNES OLIVEIRA', '(11) 94203-5945', 'RUA CARAIPE DA S AGUAS 649', 'Feminino', 'Lika', ''),
(324, 'JOÃO PEDRO FRNOCHIA', '(11) 96071-2229', 'RUA JOÃO BATISTA MALIO', 'Masculino', 'Lika', ''),
(325, 'PAULO FARNOCHIA', '(11) 96206-3085', 'RUA JOÃO BATISTA MALIO', 'Masculino', 'Lika', ''),
(326, 'DANIELY VIEIRA DA SILVA ', '(11) 98305-7260', 'AV CORREGO TIJUCO PRETO 18', 'Feminino', 'Casais', ''),
(327, 'GEAN CARLOS DA SILVA ', '(11) 97701-4207', 'AV CORREGO TIJUCO PRETO 18', 'Masculino', 'Casais', ''),
(331, 'JOSEFA SANTOS DA SILVA ', '', 'RUA IMPERIAL ', 'Feminino', 'Zô', ''),
(332, 'MONALIZA MONIKY', '(11) 20380-294', 'RUA KAMPALA 57', 'Feminino', 'Zô', ''),
(333, 'FRANCISCO MARCIANO', '(11) 98256-3144', 'RUA KAMPALA 57', 'Masculino', 'Zô', ''),
(334, 'EMELI CASTRO DOS SANTOS ', '(11) 96325-4232', 'RUA KAMPALA 55', 'Feminino', 'Zô', ''),
(335, 'DAVID ADRIANO DOS ANJOS ', '(11) 98543-7611', 'RUA ALEXANDRE DIAS NOGUEIRA 369', 'Masculino', 'Zô', ''),
(336, 'ELIZABETH', '(11) 98626-9269', 'RUA ALEXANDRE DIAS NOGUEIRA 369', 'Feminino', 'Zô', ''),
(337, 'JOCELI RODRIGUES ', '(11) 93004-2301', 'RUA NICANOR NOGUEIRA 208', 'Feminino', 'Prs.Bete/ Julio', ''),
(338, 'TATIANA BEZERRA', '(', '', 'Feminino', 'Prs.Bete/ Julio', ''),
(339, 'CLEISON WILLIAN DE ALMEIDA', '(11) 94793-1704', 'RUA MANOEL BARBALHO DE LIMA 62', 'Masculino', 'Prs.Bete/ Julio', ''),
(340, 'BIANCA LIMA SOIER', '(11) 98107-2470', 'RUA PIMENTA D\'AGUA 80', 'Feminino', 'Prs.Bete/ Julio', ''),
(341, 'RUTE DA COSTA ', '(11) 98297-2531', 'ESTRADA DOM JOÃO NERY 1.210', 'Feminino', 'Prs.Bete/ Julio', ''),
(342, 'MAURICIO ANTONIO DE OLIVEIRA', '(11) 94765-1691', 'RUA JOSE FRAINE JULIO 87', 'Masculino', 'Martim/Shirley', ''),
(343, 'ROSIMEIRE CRISTINA OLIVEIRA', '(11) 99136-5232', 'RUA JOSE FREIRE JULIO 87', 'Feminino', 'Martim/Shirley', ''),
(344, 'VALERIA FLOZINHO DA COSTA ', '(11) 98502-2892', '', 'Feminino', 'Martim/Shirley', ''),
(345, 'MARCOS ANTONIO CARVALHO', '(11) 98502-2892', 'RUA MARCION 503', 'Masculino', 'Martim/Shirley', ''),
(346, 'BETANIA M. DA CONCEIÇÃO ARAUJO', '', 'TRAVESSA FRANCISCO JOSE BRIRAL ', 'Feminino', 'Martim/Shirley', ''),
(347, 'CLAUDIO ESTEVAM DE SOUZA', '(11) 98911-0526', 'ESTRADA DOM JOÃO NERY 3.555', 'Masculino', 'Martim/Shirley', ''),
(348, 'MARIA DE LOURDES', '(11) 95135-4831', 'RUA ADELINO POLESI 7', 'Feminino', 'Martim/Shirley', ''),
(349, 'CAROLINE ALVES DE PAULA', '(11) 94455-0456', 'RUA ADELINO POLESI 7', 'Feminino', 'Martim/Shirley', ''),
(350, 'VITORIA C. DE ARAUJO', '', 'TRAVESSA FRANCISCO JOSE BIRAL', 'Feminino', 'Martim/Shirley', ''),
(351, 'MATEUS DA CONCEIÇÃO ', '(11) 96670-3485', 'TRAVESSA FRANCISCO JOSE BIRAL', 'Masculino', 'Martim/Shirley', ''),
(354, 'GUILHERME EUGENIO VIEIRA ', '(15) 98184-2903', 'RUA ARARAQUARA 233', 'Masculino', 'Itu', ''),
(355, 'ANTONIETA VIEIRA DE OLIVEIRA ', '(11) 25663-602', 'RUA PARATINGA 55 A ', 'Feminino', 'WAGUERSON', ''),
(356, 'KATHELEEN YASMIN ALVES DA SILVA ', '(11) 94179-3170', 'RUA HIGINO MESSA 100', 'Feminino', 'WAGUERSON', ''),
(357, 'FERNANDA DE FARIA KAPPS', '(11) 94147-2010', 'RUA ARICANGA 974', 'Feminino', 'WAGUERSON', ''),
(358, 'DACIO DA SILVA ', '(11) 98634-6836', 'RUA FRANCISCO PORTINARIO 8', 'Masculino', 'WAGUERSON', ''),
(359, 'THIAGO ALVES DE SANTANA ', '(11) 94959-5999', 'RUA ERVA DO BOTÃO 33', 'Masculino', 'WAGUERSON', ''),
(360, 'MARIA APARECIDA SANTOS NUNES ', '(11) 96307-5443', 'AV DOS IPES 52', 'Feminino', 'Pr. Joel', ''),
(361, 'THAYNARA VITORIA M. DA SILVA ', '(11) 96899-5302', 'RUA DOINGUES VIDIGAL ', 'Feminino', 'Prs.Laércio/Vera', ''),
(362, 'DIEGO ALVES DAMASCENO ', '(11) 96899-5302', 'RUA DOMINGUES VIDIGAL 481', 'Masculino', 'Prs.Laércio/Vera', ''),
(363, 'DANIELA DE MELO PACIFICO ', '(11) 96899-5302', 'RUA DOMINGUES VIDIGAL 481', 'Feminino', 'Prs.Laércio/Vera', ''),
(365, 'JOSÉ GILMAR FERREIRA DA SILVA ', '', 'RUA SETE ESTRELAS ', 'Masculino', 'Prs.Laércio/Vera', ''),
(366, 'MARCELA LEITE DE A. JUNIOR ', '(11) 25143-371', 'AV DAMA ENTRE VERDES ', 'Feminino', 'Prs.Laércio/Vera', ''),
(367, 'ZORAIDE BISPO DE SOUZA MENDONÇA', '(11) 98606-4991', 'AV ANTONIO CARLOS QUADROS 1 A ', 'Feminino', 'Itaqua', ''),
(368, 'TELMA SOUZA FERREIRA', '(11) 97580-6050', 'RUA DAS GAIVOTAS', 'Feminino', 'Itu', ''),
(369, 'DYANE VIEIRA DE SALES ', '(11) 25622-695', 'AV CORREGO TIJUCO PRETO ', 'Feminino', 'Casais', ''),
(370, 'JACKSON DOS SANTOS ', '(11) 98356-2019', 'RUA ESPREMAS 40 A ', 'Masculino', 'Casais', ''),
(371, 'CAIO DA SILVA COSTA ', '(11) 98189-3486', 'RUA TRES PINHEIROS 182', 'Masculino', 'Casais', ''),
(372, 'WELLINGTON RIBEIRO AMORIM ', '(11) 98261-9638', '', 'Masculino', 'Pr. Joel', ''),
(373, 'MARIA DA GRAÇA', '(11) 95356-1656', 'RUA ISABEL MORALES ', 'Feminino', 'WAGUERSON', ''),
(374, 'DENILSON LOPES DA SILVA ', '(11) 93299-3203', 'RUA IMPERIAL ', 'Masculino', 'Jaqueline', ''),
(375, 'GABRIEL NUNES OLIVEIRA', '(11) 97275-2197', 'RUA OSORIO FRANCO VILHENA', 'Masculino', 'Lika', ''),
(376, 'KEVYN WYLLY ALMEIDA', '(11) 95289-3700', 'RU EUGENIO GRIECCO 34', 'Masculino', 'WAGUERSON', ''),
(377, 'RAFAELA DAYANA ', '(11) 95465-3876', 'RUA PEDRO GIL ENCOSTA NORTE 14', 'Feminino', 'Valdirene', ''),
(378, 'LARISSA AMERICO DA SILVA RAMOS', '(11) 96731-7156', 'RUA GRAÇA AZUL 31', 'Feminino', 'Zô', ''),
(379, 'EVERTON JOSE DOS SANTOS ', '(11) 96653-7820', 'RUA ARICANGA 1.252', 'Masculino', 'Lika', ''),
(380, 'ANGELICA PRISCO DE MOURA', '(11) 98785-8140', 'RUA EUDORACOBRIENE 109', 'Feminino', 'Lika', ''),
(381, 'LEANDRO SANTOS DE SOUZA ', '(11) 95722-6373', 'RUA CASSIMIRO DE ABREU 25', 'Masculino', 'Itaqua', ''),
(382, 'VALDINEI FERNANDES DOS SANTOS ', '(11) 98372-2378', 'RUA PIRANEMA 13 A', 'Masculino', 'Lika', ''),
(383, 'FRANCISCA NUNES BARBOSA', '(11) 96298-1745', 'RUA ROSA MUSGO 96', 'Feminino', 'Lika', ''),
(384, 'AUGUSTO DA SILVA LUCAS', '(11) 09300-7185', 'RUA ISABEL MORALES ', 'Masculino', 'Lika', ''),
(385, 'GABRIELE NATALINA DA SILVA ', '(11) 94047-0357', 'RUA MANAJOS 26', 'Feminino', 'Itaqua', ''),
(386, 'VALERIO CAVALCANTE ', '(11) 95176-9248', 'RUA PORTO DO BEZERRA 631', 'Masculino', 'Eliseu /Marlene', ''),
(387, 'VITORIA FERREIRA BRANDÃO', '(11) 93221-1854', 'RUA ROSA MUSGO ', 'Feminino', 'Valdirene', ''),
(389, 'WELLINGTON BUENO', '(11) 95164-8845', 'RUA JOSE FREIRE JUNIOR 417', 'Masculino', 'Martim/Shirley', ''),
(390, 'ULISSES RICARDO PINTO', '(11) 98434-2852', 'AV MILENE ELIAS 338', 'Masculino', 'Willian/Sumalia', ''),
(391, 'JONATHAN GUEDES DA SILVA FERREIRA ', '', '', 'Masculino', 'Valdirene', ''),
(392, 'JOSUE FERREIRA DO AMARAL EDUARDO', '', '', 'Masculino', 'Valdirene', ''),
(395, 'MONIQUE CAMILO BRITO DOS SANTOS', '(11) 95862-3888', 'RUA ARVORE DO DRAGÃO 347', 'Feminino', 'Prs.Laércio/Vera', ''),
(396, 'BRUNA SABRINA DA ROSA ', '', '', 'Feminino', 'Prs.Laércio/Vera', ''),
(397, 'CAMILA BATISTA AMORIM', '', 'RUA CLAUDIO PTOLOMEU 575', 'Feminino', 'Prs.Bete/ Julio', ''),
(398, 'WILSON VALERIO CAVALCANTE ', '(11) 95176-9248', 'RUA PORTO DO BEZERRA 631', 'Masculino', 'Eliseu /Marlene', ''),
(399, 'SAMUEL SILVA DE ALMEIDA ', '(11) 97183-2079', '', 'Masculino', 'Itaqua', ''),
(401, 'GEISA CAROLINE FERREIRA DE SOUZA', '', 'RUA URUÇUCA 40', 'Feminino', 'Itaqua', ''),
(402, 'PATRICIA FERNANDES DA SILVA ', '(11) 96258-8075', 'RUA GUAIUVIRA 121', 'Feminino', '', ''),
(403, 'FELIPE ZWIR ', '(11) 96258-8075', 'RUA GUAIUVIRA 121', 'Masculino', '', ''),
(404, 'FLAVIA CRISTINA SANTOS ', '(11) 96081-2623', 'AV DOS IPES ', 'Feminino', '', ''),
(405, 'ILDELI SOUZA BEZERRA', '(11) 96081-2623', 'AV DOS IPES', 'Masculino', '', ''),
(406, 'ANDRE LUIZ SILVA DOS REIS ', '(11) 94847-6524', 'AV JOSE MELO SILVA DOS REIS 2.179', 'Masculino', '', ''),
(407, 'ALDENIZE MELO SILVA DOS REIS ', '(11) 94847-6524', 'AV JOSE MARTINS LISBOA 2.179', 'Feminino', '', ''),
(408, 'ANDERSON JOSE DA SILVA FERSANI', '(11) 97682-9149', 'AV IPÊ ROXO ', 'Masculino', '', ''),
(409, 'VANESSA FERRARI DA SILVA ', '(11) 97682-9149', 'AV IPE ROXO ', 'Feminino', '', ''),
(410, 'HENRIQUE MIGUEL OLIVEIRA ', '(11) 97717-6396', 'RUA ITA 55', 'Masculino', '', ''),
(411, 'ALINE MEIRE SILVA OLIVEIRA ', '(11) 97717-6396', 'RUA ITA 55', 'Feminino', '', ''),
(412, 'AIDA OLIVEIRA ', '', '', 'Feminino', '', ''),
(413, 'CLEBER OLIVEIRA ', '', '', 'Masculino', '', ''),
(414, 'FRANCILDO OLIVEIRA ', '(11) 97961-2622', 'AV IPE ROXO 1.704', 'Masculino', '', ''),
(415, 'MARIA DE FATIMA OLIVEIRA ', '(11) 97961-2622', 'AV IPE ROXO 1.704', 'Feminino', '', ''),
(416, 'BRUNO PEREIRA OLIVEIRA ', '(11) 94948-0663', 'RUA PEROBA ROSA 303', 'Masculino', '', ''),
(417, 'ELISANGELA OLIVEIRA', '(11) 94948-0663', 'RUA PEROBA ROSA 303', 'Feminino', '', ''),
(418, 'ALLAN SANTOS LUZ ', '(11) 99784-1373', 'RUA TARDE DE MAIO 20', 'Masculino', '', ''),
(419, 'DENISE MICHELE DOS SANTOS PIRES LUZ ', '(11) 97841-373', 'RUA TARDE DE MAIO 20', 'Feminino', '', ''),
(420, 'EVELIN SILVA LEITE ', '(11) 98544-3484', 'RUA DA FELICIDADE 192', 'Feminino', '', ''),
(421, 'ALISON ALEX PEREIRA MORENO', '(11) 98544-3484', 'RUA DA FELICIDADE 192', 'Masculino', '', ''),
(422, 'BRUNO OROSCO', '(11) 99835-5651', 'RUA GUPUVA 56', 'Masculino', '', ''),
(423, 'ANA OROSCO', '(11) 99835-5651', 'RUA GUPUVA 56', 'Feminino', '', ''),
(424, 'TARCILA DOS SANTOS FONSECA', '(11) 98510-0508', 'RUA CASTANHEIRO DO BREJO 322', 'Feminino', '', ''),
(425, 'RICARDO P. DE MORAES', '(11) 98510-0508', 'RUA CASTANHEIRO DO BREJO 322', 'Masculino', '', ''),
(426, 'JANETE JOSE GONÇALVES MARCOLINO', '(11) 95374-7309', 'RUA PALMEIRA DAS BERMUDAS ', 'Feminino', '', ''),
(427, 'LUIZ CARLOS MARCOLINO ', '(11) 95374-7309', 'RUA PALMEIRA DAS BERMUDAS ', 'Masculino', '', ''),
(428, 'LEONARDO MAURIZ DE OLIVEIRA ', '(11) 99289-1969', 'RUA GUIRANO 173', 'Masculino', '', ''),
(429, 'LUANA DIAS BEZERRA', '(11) 99289-1969', 'RUA GUIRARO 173', 'Feminino', '', ''),
(430, 'THAYANA FERNANDA SILVA ', '(11) 95851-0837', 'RUA SEBASTIÃO ALVES ', 'Feminino', '', ''),
(431, 'WELLINGTON NASCIMENTO DA SILVA ', '(11) 95251-0837', 'RUA SÃO SEBASTIÃO ', 'Masculino', '', ''),
(433, 'JACKSON DOS SANTOS ', '(11) 98356-2010', '', 'Masculino', '', ''),
(434, 'DYANE VIEIRA DE SALES ', '(11) 98356-1197', '', 'Feminino', '', ''),
(435, 'DANYELE VIEIRA DE SALES ', '(11) 95908-6859', 'AV CORREGO TIJUCO PRETO 18', 'Feminino', '', ''),
(436, 'GEAN CARLOS DOS SANTOS ', '(11) 95908-6859', 'AV CORREGO TIJUCO PRETO 18', 'Masculino', '', ''),
(437, 'CLEISON WILLIAN DE ALMEIDA ', '(11) 98290-1524', 'RUA MANOEL BARBALHO DE LIMA 79', 'Masculino', '', ''),
(438, 'LUCELIA BORGES DE ALMEIDA ', '(11) 98290-1524', 'RUA MANOEL BARBALHO DE LIMA 79', 'Feminino', '', ''),
(439, 'BERENICE COSTA BARRETO DE SOUZA ', '(11) 93002-2440', 'RUA PALMEIRA DAS BERMUDAS 1.223', 'Feminino', '', ''),
(440, 'ANTONIO LOPES DE SOUZA ', '(11) 93002-2440', 'RUA PALMEIRA DAS BERMUDAS 1.223', 'Masculino', '', ''),
(441, 'PALOMA OLIVEIRA ', '', '', 'Feminino', '', ''),
(442, 'REINALDO DENIZ OLIVEIRA ', '', '', 'Masculino', '', ''),
(443, 'ELISANGELA COSTA SOUZA ', '', '', 'Feminino', '', ''),
(444, 'EDMAR APARECIDO SOUZA ', '', '', 'Masculino', '', ''),
(445, 'GUILHERME ALVES DOS SANTOS ', '', '', 'Masculino', 'Pr.Bete/ Julio', ''),
(447, 'JONATHAN ALISSON ALVES DA SILVA ', '(11) 99854-7647', 'RUA DAS GAIVOTAS 80', 'Masculino', 'Itu', ''),
(448, 'CRISTHIANE FERREIRA SANTOS ', '(33) 99086-675', 'RUA DAS GAIVOTAS 80', 'Feminino', 'Itu', ''),
(449, 'ANDRE MARIANO LUZ ', '(11) 99381-8417', 'AV JOÃO BATISTA SANTIAGO 127 A ', 'Masculino', 'Casais', ''),
(450, 'CLEONICE SILVA LUZ ', '(11) 99270-3016', 'AV JOAO BATISTA SANTIAGO 127 A', 'Feminino', 'Casais', ''),
(451, 'WESLEY FERREIRA DE ALMEIDA ', '(11) 95439-1927', 'RUA VITORIA ESPIRITO SANTO 501 ', 'Masculino', 'Casais', ''),
(452, 'MARLENE MARIA DE OLIVEIRA ', '(11) 96839-1643', 'AV ITABERABA 1.852', 'Feminino', 'Pr.Laercio/ Vera', ''),
(453, 'LUCIA IRACI', '(11) 98984-1923', 'AV ITABERABA 1.852', 'Feminino', 'Pr.Laercio/ Vera', ''),
(455, 'YARA APARECIDA MADALENA DA SILVA ', '(11) 97801-7869', 'RUA PIMENTA D\'AGUA 19', 'Feminino', 'Jaqueline', ''),
(456, 'MISLENE APARECIDA DOS SANTOS ', '(11) 94995-4811', 'RUA IBISCUMA 2 ', 'Feminino', 'Jaqueline', ''),
(458, 'FLAVIO CARLOS PEREIRA DOS SANTOS ', '(11) 95404-7376', 'RUA GERALDO VIETRE 10', 'Masculino', 'Pr. Joel/ Regiane', ''),
(459, 'CLAUDIA VIARA A. DOS SANTOS ', '(11) 96095-2381', 'RUA GERALDO VIETRE 10', 'Feminino', 'Pr. Joel/ Regiane', ''),
(460, 'YASMIN CRISTIANE PEREIRA DOS SANTOS ', '(11) 95477-7583', 'RUA ROLA-CABLOCLA 63', 'Feminino', 'Pr. Joel/ Regiane', ''),
(461, 'FABIO RODRIGUES COELHO', '(11) 97031-8051', 'RUA ROLA-CABLOCA 63', 'Masculino', 'Pr. Joel/ Regiane', ''),
(463, 'MATHEUS SERAFIM THOMAZ DE RESENDE ', '(11) 98595-4056', 'RUA AREIAS 131', 'Masculino', 'Lika', ''),
(464, 'TATIANE CARVALHO DA SILVA', '(11) 96206-3085', 'RUA JOÃO BATISTA MATIO 1', 'Feminino', 'Lika', ''),
(465, 'MARCIO FARNOCHIA', '(11) 96206-3085', 'RUA JOÃO BATISTA MALIO 1', 'Masculino', 'Lika', ''),
(466, 'RUAN MARCOS DA SILVA ', '', 'RUA JORGE RODRIGUES DE NIZA ', 'Masculino', 'Lika', ''),
(467, 'LETICIA VICTORIA SANTOS DE MORAES', '(11) 95879-2952', 'RUA MATHEUS BARBOSA DE REZENDE ', 'Feminino', 'Zô', ''),
(468, 'GEOVANNA ALVES CUSTODIO DOS SANTOS ', '(11) 94948-6624', 'RUA IGARAPES 220', 'Feminino', 'Zô', ''),
(469, 'CICERA QUITERIA DE LOURDES', '', 'RUA ALEXANDRE DIAS NOGUEIRA 369', 'Feminino', 'Zô', ''),
(470, 'GILSIANE QUITERIO DOS ANJOS', '', 'RUA ALEXANDRE DIAS NOGUEIRA 369', 'Feminino', 'Zô', ''),
(471, 'EMILLY CIBELY DOS ANJOS', '', 'RUA ALEXANDRE DIAS NOGUEIRA 369', 'Feminino', 'Zô', ''),
(472, 'ADRIANA FERNANDA DA SILVA ', '(11) 95143-6559', 'RUA MATILDE MARCHESI 21', 'Feminino', 'Martins/Shirley', ''),
(473, 'WILSON ALEX SILVA SANTOS ', '(11) 98175-8948', 'RUA MARIA ANTONIETA DE CAMPOS ARRUDA 42', 'Masculino', 'Martins/Shirley', ''),
(474, 'DAYANE CLAUDIA SILVA BUENO', '(11) 97025-3559', 'RUA JOSE FREIRE JUNIOR 417', 'Feminino', 'Martins/Shirley', ''),
(475, 'ANDRE LOPES DA SILVA ', '(11) 94865-3597', 'RUA CARANA BRANCA 18', 'Masculino', 'Martins/Shirley', ''),
(476, 'BRENDA DALILA SOUZA LOPES ', '(11) 95806-1191', 'RUA CARANA BRANCA 18', 'Feminino', 'Martins/Shirley', ''),
(477, 'NILCELIA RODRIGUES SOUZA ', '(11) 98796-8807', 'RUA DESEMBARGADOR CICERO DE TOLEDO PIZA 66', 'Feminino', 'Martins/Shirley', ''),
(478, 'PATRICIO OLIVEIRA DA SILVA COSTA', '', 'RUA PEDRO FLOR 42', 'Masculino', 'Martins/Shirley', ''),
(479, 'NICOLLY CRISTINA LEITE DE OLIVEIRA ', '(11) 94004-2968', 'RUA JOSE FREIRE JUNIOR 87', 'Feminino', 'Martins/Shirley', ''),
(480, 'DIELHARDIO MOTA NASCIMENTO', '(11) 93230-9488', 'RUA COROA DE FRALDE 102', 'Masculino', 'Martins/Shirley', ''),
(481, 'IGOR TASSIANO ARAGÃO ', '', 'RUA IBURANA 131', 'Masculino', 'Martins/Shirley', ''),
(482, 'KAWÃ NASCIMENTO OLIVEIRA ', '', 'RUA COROA DE FRALDE 102', 'Masculino', 'Martins/Shirley', ''),
(483, 'ILDELI SOUZA', '', '', 'Feminino', 'Martins/Shirley', ''),
(484, 'BIANCA N. DE OLIVEIRA', '', '', 'Feminino', 'Martins/Shirley', ''),
(487, 'JAQUELINE BERÇA ', '', 'RUA FRANCISCA MANRIQUE GUERRA', 'Feminino', 'Zô', ''),
(488, 'MARIA NOELIA FERREIRA LIMA ', '(11) 95116-3697', 'RUA URUCUCA 40', 'Feminino', 'Itaqua', ''),
(489, 'RAIANE FERREIRA DE MOURA', '(11) 07056-3805', '', 'Feminino', 'Itaqua', ''),
(491, 'SOPHIE DE SOUZA FERRAZ', '(11) 96440-5068', 'RUA CRUZEIRO 284', 'Feminino', 'Itaqua', ''),
(492, 'IASMIN CAMILA GARCIA', '(11) 97421-3509', 'RUA URUCUCA 40', 'Feminino', 'Itaqua', ''),
(493, 'MICHELLE RODRIGUES LUZ ', '(11) 98092-4839', 'RUA URUCUCA 40', 'Feminino', 'Itaqua', ''),
(494, 'FELIPE JERONIMO DA SILVA ', '', 'RUA APIRANGA 5', 'Masculino', 'Itaqua', ''),
(496, 'IVONEIDE VIEIRA LIMA ', '(11) 98797-5910', 'RUA MARIA BOMBONATTI 411', 'Feminino', 'Carapicuiba', ''),
(497, 'KAUNE VICTORIA VIEIRA LIMA ', '(11) 98797-5910', 'RUA MARIA BOMBONATTI 411', 'Feminino', 'Carapicuiba', ''),
(498, 'WENDER ROBERT MORAIS DE MENEZES', '(11) 94031-6337', 'RUA JOÃO FRANCO DOS REIS ', 'Masculino', 'Carapicuiba', ''),
(499, 'GABRIELA XAVIER ', '(11) 97762-3295', 'RUA FAVEIRA PEQUENA 414', 'Feminino', 'Carapicuiba', ''),
(500, 'ADRIANA SILVA DOS REIS ', '(11) 98573-7885', 'RUA MONTE CAMBARELA 190', 'Feminino', 'Jaqueline', ''),
(501, 'NATALY BARBOSA RAIMUNDO', '(11) 94812-5637', 'RUA OTASSLIO RIOS FERNANDES', 'Feminino', 'Jaqueline', ''),
(502, 'NELSON DOS ANJOS', '', 'RUA ALEXANDRE DIAS NOGUEIRA 368', 'Masculino', 'Zô', ''),
(504, 'IANA LICIA SANTOS GOMES DE ALMEIDA ', '(11) 96839-1649', '', 'Feminino', 'Pr.Laercio/ Vera', ''),
(506, 'MAIARA ALVES DE LIMA ', '(11) 95776-2300', 'RUA DR° GIL MARTINS 20', 'Feminino', 'Novo Tempo(Valdirene)', ''),
(507, 'FLAVIA RAMOS DOS SANTOS ', '(11) 99867-9271', 'RUA RENASCER 66', 'Feminino', 'Novo Tempo(Valdirene)', ''),
(508, 'WESLLEY SOUZA LIMA ', '(11) 93372-9959', 'RUA DR° GIL MARTINS 20', 'Masculino', 'Novo Tempo(Valdirene)', ''),
(509, 'GUILHERME AZEVEDO SANTOS ', '(11) 98695-2443', 'RUA BATALHA DE CATALÃO 90', 'Masculino', 'Novo Tempo(Valdirene)', ''),
(510, 'JOSE DE OLIVEIRA FRANCILINO', '', 'RUA GRAVATA DE PEDRA 338', 'Masculino', 'Novo Tempo(Valdirene)', ''),
(511, 'MATHEUS HENRIQUE SILVA ', '(11) 98293-8663', 'RUA ROSA MUSGO ', 'Masculino', 'WAGUERSON', ''),
(512, 'LUIZA MOURA VILAS BOAS ', '(11) 94879-2783', 'RUA FAVA DE CALABAR 130', 'Feminino', 'WAGUERSON', ''),
(513, 'ANA SILVA DE SOUZA ', '(11) 98700-4827', 'RUA JURAMENTO 9', 'Feminino', 'WAGUERSON', ''),
(515, 'MYLLENA REGINA LEITE GONÇALVES ', '', 'RUA FRANCISCA LUZ PEREIRA 106', 'Feminino', 'WAGUERSON', ''),
(517, 'ISRAEL LEITE FERREIRA ', '', 'RUA CONGONHAS DO SERTÃO 333', 'Masculino', 'Novo Tempo(Valdirene)', ''),
(518, 'ANDERSON BASTOS MARQUES ', '(11) 98796-8807', 'RUA DESEMBARGADOR CICERO DE TOLEDO PIZA 66', 'Masculino', 'Martins/Shirley', ''),
(519, 'JOSE NILDO DA SILVA ', '(11) 94341-227', 'RUA DOMINGUES VIDIGAL 465 ', 'Masculino', 'Pr.Laercio/ Vera', ''),
(520, 'JOEL TELES DE SOUZA ', '(11) 98532-8542', 'RUA CALAMO AROMATICO 56', 'Masculino', 'Jaqueline', ''),
(521, 'CARLOS DANIEL PENELA ', '(11) 94898-2394', 'RUA MANOEL ALVARES PIMENTEL 1.150', 'Masculino', 'Jaqueline', ''),
(522, 'CLAUDIA DANTAS SÃO LEÃO ', '(11) 95669-799', 'RUA BIJUCO 26', 'Masculino', 'Eliseu /Marlene', ''),
(523, 'EDSON LUIZ DOS SANTOS MORAIS ', '', 'RUA ANTONIO DE ARRUDA DANTAS 30', 'Masculino', 'Lika', ''),
(524, 'ENEAS SOUZA CALDEIRA ', '(11) 99811-5524', 'RUA CAFE DO BRASIL 98 A ', 'Masculino', 'Aldo', ''),
(525, 'ROGERIO SÃO LEÃO ', '(11) 97551-2810', 'RUA BIJUCO 26', 'Masculino', 'Eliseu /Marlene', ''),
(526, 'BRUNA MARQUES CUSTODIO', '(11) 82608-205', 'RUA MUTUI 171', 'Feminino', 'Lika', ''),
(527, 'JAQUELINE ADRIANO CORREA', '', 'RUA DARIO FERREIRA MARTINS 4', 'Feminino', 'Lika', ''),
(528, 'EVILIN GOMES SOUZA NOVAES ', '', 'RUA PALMEIRA DAS BERMUDAS 401', 'Feminino', 'Lika', ''),
(529, 'CARLOS ALBERTO DE JESUS PEDRA', '', 'RUA PALMEIRAS DAS BERMUDAS 401', 'Masculino', 'Lika', ''),
(530, 'LETICIA DE JESUS ', '(11) 97961-2622', 'RUA ISABEL MORALES DE OLIVEIRA MIRAGAIA 519', 'Feminino', 'Lika', ''),
(531, 'MARLENE MARIA GOMES JARDIM ', '(11) 98799-8414', 'AV NORDESTINA 512', 'Feminino', 'Lika', ''),
(533, 'MICHELE DE OLIVEIRA PINHO FERREIRA', '(11) 98586-9494', 'RUA TARDE DE MAIO 62', 'Feminino', 'Lika', ''),
(535, 'ARNALDO PEREIRA DOS SANTOS', '(11) 98837-5064', 'RUA EVA PERON 910', 'Masculino', 'Pr. Joel/ Regiane', ''),
(536, 'GABRIELA DUARTE CAVALCANTE ', '', 'RUA IBIXUMA 6', 'Feminino', 'Jaqueline', ''),
(537, 'ANTONIO SOUSA NOVAIS ', '', 'RUA CASTANHEIRO DO BREJO 325', 'Masculino', 'Novo Tempo(Valdirene)', ''),
(540, 'NILSON SANTOS MENDES ', '', '', 'Masculino', 'Itu', ''),
(541, 'ELIAS FERREIRA COSTA', '', '', 'Masculino', 'Itaqua', ''),
(542, 'PEDRO NUNES FERREIRA ', '(11) 96307-5413', '', 'Masculino', 'Lika', ''),
(543, 'ALINE KEITY DE A. MOURA LOPES ', '', '', 'Feminino', 'WAGUERSON', ''),
(544, 'SERGIO LUIZ LOPES ', '', '', 'Masculino', 'WAGUERSON', ''),
(545, 'ROSEMARY APARECIDA VERISSIMO', '', '', 'Feminino', 'Zô', ''),
(546, 'ANA AMELIA AMORIM DE CARVALHO', '', ' ', 'Feminino', 'Zô', ''),
(548, 'DENISE RAGES DA COSTA ', '', '', 'Feminino', 'Jaqueline', ''),
(549, 'ERIKA VIEIRA ', '', '', 'Feminino', 'Itu', ''),
(550, 'MARIA EDUARDA DA COSTA MONTEIRO', '', '', 'Feminino', 'Carapicuiba', ''),
(551, 'CAMILA', '', '', 'Feminino', 'Pr. Joel/ Regiane', ''),
(552, 'TALITA ', '', '', 'Feminino', 'Pr. Joel/ Regiane', ''),
(553, 'VITOR', '', '', 'Masculino', 'Pr. Joel/ Regiane', ''),
(554, 'NATALIA BARBOSA RAIMUNDA', '', '', 'Feminino', 'Zô', ''),
(555, 'GIOAVANNA ALVES CUSTODIO', '', '', 'Feminino', 'Zô', ''),
(556, 'RAFAELY CARDOSO GONÇALVES ', '', '', 'Feminino', 'Zô', ''),
(557, 'EMILI CASTRO', '', '', 'Feminino', 'Zô', ''),
(558, 'ERICA VIEIRA', '(12) 98243-7465', 'RUA RISCALA 301', 'Feminino', 'Itu', ''),
(559, 'JONATHAN ALVES DA SILVA ', '(11) 99857-4094', 'RUA DAS ANDORINHAS ', 'Masculino', 'Itu', ''),
(560, 'FLAVIA ', '(11) 93024-2262', 'RUA DAS ANDORINHAS ', 'Feminino', 'Itu', ''),
(561, 'RAFAELA DAYANA DA SILVA ', '(11) 95465-3876', 'RUA PEDRO GIL 14', 'Feminino', 'Novo Tempo(Valdirene)', ''),
(562, 'GUILHERME AZEVEDO SANTOS ', '(11) 98695-2443', 'RUA BATALHA DE CATALÃO 90', 'Masculino', 'Novo Tempo(Valdirene)', ''),
(563, 'MARIA RAIMUNDA ALVES ', '(11) 98617-0175', 'RUA DRº GIL MARTINS ', 'Feminino', 'Novo Tempo(Valdirene)', ''),
(564, 'ISRAEL LEITE FERREIRA', '(', 'RUA CONGONHAS DO SERTÃO 333', 'Masculino', 'Novo Tempo(Valdirene)', ''),
(565, 'PRISCILA LIMA SANTOS ', '(11) 95276-1591', 'RUA ARROIO CHUI 156', 'Feminino', 'Mirtes', ''),
(566, 'SAMUEL MENDES BASTOS ', '', '', 'Masculino', 'Gledson /Vanessa', ''),
(567, 'DANIELA DE MELO PACIFICO', '', 'RUA DOMINGUES VIDIGAL 481', 'Feminino', 'Pr.Laercio/ Vera', ''),
(568, 'DIEGO ALVES DAMASCENO', '', 'RUA DOMINGUES VIDIGAL 481', 'Masculino', 'Pr.Laercio/ Vera', ''),
(569, 'ALEXANDRE OLIVEIRA SILVA ', '(11) 95914-5601', 'RUA PARATINGA 55', 'Masculino', 'WAGUERSON', ''),
(570, 'WESLEY FERREIRA DE ALMEIA ', '(11) 95439-1927', 'RUA VITORIA DO ESPIRITO SANTOS 501', 'Masculino', 'WAGUERSON', ''),
(571, 'RODRIGO HERCULANO DA SILVA ', '', '', 'Masculino', 'WAGUERSON', ''),
(572, 'RAIANE FERREIRA DE MOURA ', '(11) 97056-3805', 'RUA NOSSA SENHORA DAJUDA ', 'Feminino', 'Itaqua', ''),
(573, 'MARIA NOELIA FERREIRA LIMA', '(11) 95116-3697', 'RUA URUCUÇU 40', 'Feminino', 'Itaqua', ''),
(574, 'SOPHIE DE SOUZA FERRAZ', '(11) 96440-5068', 'RUA CRUZEIRO 284', 'Feminino', 'Itaqua', ''),
(575, 'GEISA NOELIA FERREIRA LIMA', '(11) 97721-8246', 'RUA URUCUÇU 40', 'Feminino', 'Itaqua', ''),
(576, 'CLEISON WILLIAN DE ALMEIDA ', '', 'RUA MANOEL BARBALHO DE LIMA 62', 'Masculino', 'Casais', ''),
(577, 'ARNALDO PEREIRA DOS SANTOS ', '(11) 98837-5064', 'RUA EVA PERON', 'Masculino', 'Pr. Joel/ Regiane', ''),
(578, 'LUIZ HENRIQUE ', '(11) 95357-7482', 'RUA PAINEIRA BRAVA 315', 'Masculino', 'Jaqueline', ''),
(579, 'GABRIELA BATISTA DE NAZARETH', '(11) 98594-0479', 'RUA SAVIRA PEQUENA 414', 'Feminino', 'Carapicuiba', ''),
(580, 'FERNANDO DE JESUS GAMA ', '', '', 'Masculino', 'Zô', ''),
(581, 'LUANA APARECIDA DAMASCENO', '', '', 'Feminino', 'Zô', ''),
(582, 'FRANCISCO MARCIANO DA SILVA ', '', '', 'Masculino', 'Zô', ''),
(583, 'LETICIA', '', '', 'Feminino', 'Zô', ''),
(584, 'MANUEL MARCOS BEZERRA AMERICO', '', '', 'Masculino', 'Carapicuiba', ''),
(585, 'BIANCA LIMA SOIER ', '(11) 95810-7058', 'RUA PIMENTA D´AGUA 80', 'Feminino', 'Pr.Bete/ Julio', ''),
(586, 'MATHEUS SILVA', '(11) 98293-8663', 'RUA ROSA MUSGO ', 'Masculino', 'Pr.Bete/ Julio', ''),
(587, 'ANA CLAUDIA LINS COELHO', '(11) 95159-1760', 'RUA CARAIPE DAS AGUAS 1.171', 'Feminino', 'Pr.Bete/ Julio', ''),
(588, 'CAMILA BATISTA AMORIM ', '', '', 'Feminino', 'Pr.Bete/ Julio', ''),
(589, 'ADRIANA SILVA DOS REIS ', '', '', 'Feminino', 'Jaqueline', ''),
(590, 'DENNER CRUZ', '(11) 98971-5922', 'RUA MANUEL BORBOLHO DE CIMA 22 A ', 'Masculino', 'Pr.Bete/ Julio', ''),
(591, 'KATHELLEN YASMIN ALVES DA SILVA ', '(11) 94483-8638', 'RUA HIGINO MESSA 100', 'Feminino', 'WAGUERSON', ''),
(592, 'ENEAS SOUZA CALDEIRA', '', '', 'Masculino', 'Zô', ''),
(593, 'MISLENE GOMES OLIVEIRA', '', '', 'Feminino', 'Martins/Shirley', ''),
(594, 'ROSIMEIRE CRISTINA OLIVEIRA', '', '', 'Feminino', 'Martins/Shirley', ''),
(595, 'JEAN SALLES SANTOS ', '', '', 'Masculino', 'Martins/Shirley', ''),
(596, 'NICE LUZ ', '(11) 9', 'RUA MATHEUS BARBOSA DE REZENDE 85', 'Feminino', 'Casais', ''),
(597, 'LUIS FERNANDO SANTOS LUZ ', '(11) 99771-1235', 'RUA JAROLIDE DE MAIO 70', 'Masculino', 'Lika', ''),
(598, 'MATEUS SERAFIM THOMAS DE REZENDE ', '(11) 96072-2229', 'RUA JOÃO MALIO 1', 'Masculino', 'Lika', ''),
(599, 'THAYSA DA SILVA SILVA BORGES', '(11) 95986-9937', 'RUA ANTONIO ADÃO 58', 'Feminino', 'Lika', ''),
(600, 'MATHEUS F. DA SILVA ', '(11) 98578-3130', 'RUA ALPETA 18', 'Masculino', 'Lika', ''),
(601, 'JULIA NUNES OLIVEIRA', '(11) 94203-3945', 'RUA CARAIPE DAS AGUAS 649', 'Feminino', 'Lika', ''),
(602, 'MARIA DAS DORES SILVA ', '(11) 96833-7169', 'RUA PALMEIRA DAS BERMUDAS 128', 'Feminino', 'Lika', ''),
(603, 'RODRIGO SILVA SANTANA', '(11) 96833-7169', 'RUA PALMEIRA DAS BERMUDAS 128', 'Masculino', 'Lika', ''),
(604, 'RUAN MARCOS CHAGAS ', '', 'RUA JORGE RODRIGUES DE NIZE ', 'Masculino', 'Lika', ''),
(605, 'BRUNA MARQUES CUSTODIO ', '(11) 98260-8205', 'RUA MATUTI 171', 'Feminino', 'Lika', ''),
(606, 'TATIANE CARVALHO DA SILVA ', '(11) 62063-0855', 'RUA JOÃO BATISTA MALIO 1', 'Feminino', 'Lika', ''),
(607, 'PAULO FARNOCHIA ', '(11) 96206-3085', 'RUA JOÃO BATISTA MALIO 1', 'Masculino', 'Lika', ''),
(608, 'JOÃO PEDRO FARNOCHIA', '(11) 96072-2229', 'RUA JOÃO BATISTA MALIO 1', 'Masculino', 'Lika', ''),
(609, 'MARCIO FARNOCHIA', '(11) 96206-3085', 'RUA JOÃO MALIO 1', 'Masculino', 'Lika', ''),
(610, 'NICOLAS DA SILVA GOSHOMOTO', '(11) 98779-4722', 'RUA ANTONIO CACÃO 58', 'Masculino', 'Lika', ''),
(611, 'HENRIQUE MIGUEL DA SILVA OLIVEIRA', '', '', 'Masculino', 'Martins/Shirley', ''),
(612, 'ALINE MEIRE SILVA OLIVEIRA', '', '', 'Feminino', 'Martins/Shirley', ''),
(613, 'ROSANGELO CUNHA', '', '', 'Masculino', 'Zô', ''),
(614, 'VITORIA BEATRIZ', '', '', 'Feminino', 'Pr.Bete/ Julio', '');

-- --------------------------------------------------------

--
-- Estrutura para tabela `encontro`
--

CREATE TABLE `encontro` (
  `id_encontro` int(10) NOT NULL,
  `n_encontro` int(10) NOT NULL,
  `encontrista` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `encontro`
--

INSERT INTO `encontro` (`id_encontro`, `n_encontro`, `encontrista`) VALUES
(2, 130, 5),
(3, 130, 6),
(4, 130, 7),
(5, 130, 8),
(6, 130, 9),
(7, 130, 10),
(8, 130, 11),
(9, 130, 12),
(10, 130, 13),
(11, 130, 14),
(12, 130, 15),
(13, 130, 16),
(14, 130, 17),
(15, 130, 18),
(16, 130, 19),
(17, 130, 20),
(18, 130, 21),
(19, 130, 22),
(20, 130, 23),
(21, 130, 24),
(22, 130, 25),
(23, 130, 26),
(24, 130, 27),
(25, 130, 28),
(26, 130, 29),
(27, 130, 30),
(28, 130, 31),
(29, 130, 32),
(30, 130, 33),
(31, 130, 34),
(32, 130, 35),
(33, 130, 36),
(34, 130, 37),
(35, 130, 38),
(37, 130, 40),
(38, 130, 41),
(39, 130, 42),
(40, 130, 43),
(41, 130, 44),
(42, 130, 45),
(43, 130, 46),
(44, 130, 47),
(45, 130, 48),
(46, 130, 49),
(47, 130, 50),
(48, 130, 51),
(49, 130, 52),
(50, 130, 53),
(51, 130, 54),
(52, 130, 55),
(53, 130, 56),
(54, 130, 57),
(55, 130, 58),
(56, 130, 59),
(57, 130, 60),
(58, 130, 61),
(59, 130, 62),
(60, 130, 63),
(61, 130, 64),
(62, 130, 65),
(63, 130, 66),
(64, 130, 67),
(65, 130, 68),
(66, 130, 69),
(67, 130, 70),
(68, 130, 71),
(69, 130, 72),
(70, 130, 73),
(71, 130, 74),
(72, 130, 75),
(73, 130, 76),
(74, 130, 77),
(76, 130, 79),
(77, 130, 80),
(78, 130, 81),
(79, 130, 82),
(80, 130, 83),
(81, 130, 84),
(82, 130, 85),
(84, 130, 87),
(85, 130, 88),
(86, 130, 89),
(87, 130, 90),
(88, 130, 91),
(89, 130, 92),
(90, 130, 93),
(91, 130, 94),
(109, 134, 99),
(110, 134, 100),
(111, 134, 101),
(113, 134, 103),
(114, 134, 104),
(115, 134, 105),
(117, 134, 107),
(118, 134, 108),
(119, 134, 109),
(120, 134, 110),
(121, 134, 111),
(122, 134, 112),
(123, 134, 113),
(124, 134, 114),
(125, 134, 115),
(126, 134, 116),
(127, 134, 117),
(128, 134, 118),
(129, 134, 119),
(130, 134, 120),
(131, 134, 121),
(132, 134, 122),
(133, 134, 123),
(134, 134, 124),
(135, 134, 125),
(136, 134, 126),
(137, 134, 127),
(138, 134, 128),
(139, 134, 129),
(140, 134, 130),
(141, 134, 131),
(142, 134, 132),
(143, 134, 133),
(144, 134, 134),
(145, 134, 135),
(146, 134, 136),
(147, 134, 137),
(148, 134, 138),
(149, 134, 139),
(150, 134, 140),
(151, 134, 141),
(152, 134, 142),
(153, 134, 143),
(154, 134, 144),
(155, 134, 145),
(156, 134, 146),
(157, 134, 147),
(158, 134, 148),
(159, 134, 149),
(160, 134, 150),
(161, 134, 151),
(162, 134, 152),
(163, 134, 153),
(164, 134, 154),
(165, 134, 155),
(166, 134, 156),
(167, 134, 157),
(168, 134, 158),
(169, 134, 159),
(170, 134, 160),
(171, 134, 161),
(172, 134, 162),
(173, 134, 163),
(174, 134, 164),
(175, 134, 165),
(176, 134, 166),
(177, 134, 167),
(178, 134, 168),
(179, 134, 169),
(180, 134, 170),
(181, 134, 171),
(182, 134, 172),
(183, 134, 173),
(184, 134, 174),
(185, 134, 175),
(186, 134, 176),
(187, 134, 177),
(188, 134, 178),
(189, 134, 179),
(190, 134, 180),
(191, 134, 181),
(192, 134, 182),
(193, 134, 183),
(194, 134, 184),
(195, 134, 185),
(196, 134, 186),
(197, 134, 187),
(198, 134, 188),
(199, 134, 189),
(200, 134, 190),
(201, 134, 191),
(202, 134, 192),
(203, 134, 193),
(204, 134, 194),
(205, 134, 195),
(206, 134, 196),
(207, 134, 197),
(208, 134, 198),
(209, 134, 199),
(210, 134, 200),
(211, 134, 201),
(212, 134, 202),
(213, 134, 203),
(214, 134, 204),
(215, 134, 205),
(216, 134, 206),
(218, 42, 208),
(219, 42, 209),
(220, 42, 210),
(221, 42, 211),
(222, 42, 212),
(223, 42, 213),
(224, 42, 214),
(225, 42, 215),
(226, 42, 216),
(228, 42, 218),
(229, 42, 219),
(230, 42, 220),
(231, 42, 221),
(232, 42, 222),
(233, 42, 223),
(234, 42, 224),
(235, 42, 225),
(236, 42, 226),
(237, 42, 227),
(238, 42, 228),
(239, 42, 229),
(240, 42, 230),
(242, 42, 232),
(243, 42, 233),
(244, 42, 234),
(245, 42, 235),
(246, 42, 236),
(247, 42, 237),
(248, 42, 238),
(249, 42, 239),
(250, 42, 240),
(251, 42, 241),
(252, 42, 242),
(253, 42, 243),
(254, 42, 244),
(255, 42, 245),
(256, 42, 246),
(257, 42, 247),
(258, 42, 248),
(259, 42, 249),
(260, 42, 250),
(261, 42, 251),
(262, 42, 252),
(263, 42, 253),
(264, 42, 254),
(265, 42, 255),
(266, 42, 256),
(267, 42, 257),
(268, 42, 258),
(269, 42, 259),
(270, 42, 260),
(271, 42, 261),
(272, 42, 262),
(273, 42, 263),
(274, 42, 264),
(275, 42, 265),
(276, 42, 266),
(277, 42, 267),
(278, 42, 268),
(279, 42, 269),
(280, 42, 270),
(281, 42, 271),
(282, 42, 272),
(283, 42, 273),
(284, 42, 274),
(285, 42, 275),
(286, 42, 276),
(287, 42, 277),
(288, 42, 278),
(289, 42, 279),
(290, 42, 280),
(291, 42, 281),
(292, 42, 282),
(294, 42, 284),
(295, 42, 285),
(307, 42, 297),
(308, 42, 298),
(309, 42, 299),
(310, 42, 300),
(312, 42, 302),
(313, 42, 303),
(314, 42, 304),
(315, 42, 305),
(316, 42, 306),
(317, 42, 307),
(318, 42, 308),
(319, 42, 309),
(320, 42, 310),
(321, 42, 311),
(322, 42, 312),
(323, 138, 313),
(324, 138, 314),
(325, 138, 315),
(326, 138, 316),
(327, 138, 317),
(328, 138, 318),
(329, 138, 319),
(330, 138, 320),
(331, 138, 321),
(332, 138, 322),
(333, 138, 323),
(334, 138, 324),
(335, 138, 325),
(336, 138, 326),
(337, 138, 327),
(341, 138, 331),
(342, 138, 332),
(343, 138, 333),
(344, 138, 334),
(345, 138, 335),
(346, 138, 336),
(347, 138, 337),
(348, 138, 338),
(349, 138, 339),
(350, 138, 340),
(351, 138, 341),
(352, 138, 342),
(353, 138, 343),
(354, 138, 344),
(355, 138, 345),
(356, 138, 346),
(357, 138, 347),
(358, 138, 348),
(359, 138, 349),
(360, 138, 350),
(361, 138, 351),
(364, 138, 354),
(365, 138, 355),
(366, 138, 356),
(367, 138, 357),
(368, 138, 358),
(369, 138, 359),
(370, 138, 360),
(371, 138, 361),
(372, 138, 362),
(373, 138, 363),
(375, 138, 365),
(376, 138, 366),
(377, 138, 367),
(378, 138, 368),
(379, 138, 369),
(380, 138, 370),
(381, 138, 371),
(382, 138, 372),
(383, 138, 373),
(384, 138, 374),
(385, 138, 375),
(386, 138, 376),
(387, 138, 377),
(388, 138, 378),
(389, 138, 379),
(390, 138, 380),
(391, 138, 381),
(392, 138, 382),
(393, 138, 383),
(394, 138, 384),
(395, 138, 385),
(396, 138, 386),
(397, 138, 387),
(399, 138, 389),
(400, 138, 390),
(401, 138, 391),
(402, 138, 392),
(405, 138, 395),
(406, 138, 396),
(407, 138, 397),
(408, 138, 398),
(409, 138, 399),
(411, 138, 401),
(412, 2, 402),
(413, 2, 403),
(414, 2, 404),
(415, 2, 405),
(416, 2, 406),
(417, 2, 407),
(418, 2, 408),
(419, 2, 409),
(420, 2, 410),
(421, 2, 411),
(422, 2, 412),
(423, 2, 413),
(424, 2, 414),
(425, 2, 415),
(426, 2, 416),
(427, 2, 417),
(428, 2, 418),
(429, 2, 419),
(430, 2, 420),
(431, 2, 421),
(432, 2, 422),
(433, 2, 423),
(434, 2, 424),
(435, 2, 425),
(436, 2, 426),
(437, 2, 427),
(438, 2, 428),
(439, 2, 429),
(440, 2, 430),
(441, 2, 431),
(443, 2, 433),
(444, 2, 434),
(445, 2, 435),
(446, 2, 436),
(447, 2, 437),
(448, 2, 438),
(449, 2, 439),
(450, 2, 440),
(451, 2, 441),
(452, 2, 442),
(453, 2, 443),
(454, 2, 444),
(455, 143, 445),
(457, 143, 447),
(458, 143, 448),
(459, 143, 449),
(460, 143, 450),
(461, 143, 451),
(462, 143, 452),
(463, 143, 453),
(465, 143, 455),
(466, 143, 456),
(468, 143, 458),
(469, 143, 459),
(470, 143, 460),
(471, 143, 461),
(473, 143, 463),
(474, 143, 464),
(475, 143, 465),
(476, 143, 466),
(477, 143, 467),
(478, 143, 468),
(479, 143, 469),
(480, 143, 470),
(481, 143, 471),
(482, 143, 472),
(483, 143, 473),
(484, 143, 474),
(485, 143, 475),
(486, 143, 476),
(487, 143, 477),
(488, 143, 478),
(489, 143, 479),
(490, 143, 480),
(491, 143, 481),
(492, 143, 482),
(493, 143, 483),
(494, 143, 484),
(497, 143, 487),
(498, 143, 488),
(499, 143, 489),
(501, 143, 491),
(502, 143, 492),
(503, 143, 493),
(504, 143, 494),
(506, 143, 496),
(507, 143, 497),
(508, 143, 498),
(509, 143, 499),
(510, 143, 500),
(511, 143, 501),
(512, 143, 502),
(514, 143, 504),
(516, 143, 506),
(517, 143, 507),
(518, 143, 508),
(519, 143, 509),
(520, 143, 510),
(521, 143, 511),
(522, 143, 512),
(523, 143, 513),
(525, 143, 515),
(527, 143, 517),
(528, 143, 518),
(529, 143, 519),
(530, 143, 520),
(531, 143, 521),
(532, 143, 522),
(533, 143, 523),
(534, 143, 524),
(535, 143, 525),
(536, 143, 526),
(537, 143, 527),
(538, 143, 528),
(539, 143, 529),
(540, 143, 530),
(541, 143, 531),
(543, 143, 533),
(545, 143, 535),
(546, 143, 536),
(547, 143, 537),
(550, 143, 540),
(551, 143, 541),
(552, 143, 542),
(553, 143, 543),
(554, 143, 544),
(555, 143, 545),
(556, 143, 546),
(558, 143, 548),
(559, 143, 549),
(560, 143, 550),
(561, 143, 551),
(562, 44, 552),
(563, 44, 553),
(564, 44, 554),
(565, 44, 555),
(566, 44, 556),
(567, 44, 557),
(568, 44, 558),
(569, 44, 559),
(570, 44, 560),
(571, 44, 561),
(572, 44, 562),
(573, 44, 563),
(574, 44, 564),
(575, 44, 565),
(576, 44, 566),
(577, 44, 567),
(578, 44, 568),
(579, 44, 569),
(580, 44, 570),
(581, 44, 571),
(582, 44, 572),
(583, 44, 573),
(584, 44, 574),
(585, 44, 575),
(586, 44, 576),
(587, 44, 577),
(588, 44, 578),
(589, 44, 579),
(590, 44, 580),
(591, 44, 581),
(592, 44, 582),
(593, 44, 583),
(594, 44, 584),
(595, 44, 585),
(596, 44, 586),
(597, 44, 587),
(598, 44, 588),
(599, 44, 589),
(600, 44, 590),
(601, 44, 591),
(602, 44, 592),
(603, 44, 593),
(604, 44, 594),
(605, 44, 595),
(606, 44, 596),
(607, 44, 597),
(608, 44, 598),
(609, 44, 599),
(610, 44, 600),
(611, 44, 601),
(612, 44, 602),
(613, 44, 603),
(614, 44, 604),
(615, 44, 605),
(616, 44, 606),
(617, 44, 607),
(618, 44, 608),
(619, 44, 609),
(620, 44, 610),
(621, 44, 611),
(622, 44, 612),
(623, 44, 613),
(624, 44, 614);

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipe`
--

CREATE TABLE `equipe` (
  `id` int(10) NOT NULL,
  `membro` int(10) NOT NULL,
  `encontro` int(10) NOT NULL,
  `tarefaEnc` int(10) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Despejando dados para a tabela `equipe`
--

INSERT INTO `equipe` (`id`, `membro`, `encontro`, `tarefaEnc`) VALUES
(1, 141, 4, 1),
(2, 145, 4, 1),
(3, 151, 4, 1),
(4, 40, 4, 1),
(5, 41, 4, 1),
(6, 37, 4, 1),
(9, 20, 4, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `eventos`
--

CREATE TABLE `eventos` (
  `id` int(10) NOT NULL,
  `titulo` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `inicioevento` datetime NOT NULL,
  `terminoevento` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `eventos`
--

INSERT INTO `eventos` (`id`, `titulo`, `color`, `inicioevento`, `terminoevento`) VALUES
(1, 'Encontro nº 130', '#999999', '2019-03-22 20:00:00', '2019-03-24 20:30:00'),
(2, 'Encontro nº 134', '#F7D358', '2019-05-24 20:00:00', '2019-05-26 20:30:00'),
(3, 'Encontro nº 138', '#642EFE', '2019-08-23 20:00:00', '2019-08-25 20:30:00'),
(4, 'Aniversário de 20 Anos da Comunidade', '#FF4500', '2019-05-04 20:00:00', '2019-05-04 22:00:00'),
(5, 'Santa Ceia', '#228B22', '2019-05-05 18:30:00', '2019-05-05 20:30:00'),
(6, 'Reencontro com Deus nº42', '#8B4513', '2019-06-21 20:00:00', '2019-06-23 20:30:00'),
(12, 'Conferência EU +1', '#FF4500', '2019-07-06 14:00:00', '2019-07-06 22:00:00'),
(13, 'Mulheres em Ação', '#FF1493', '2019-06-08 19:00:00', '2019-06-08 21:00:00'),
(14, 'Vigília', '#8B0000', '2019-06-08 23:00:00', '2019-06-09 04:00:00'),
(15, 'Culto do Amigo', '#0071c5', '2019-07-21 18:30:00', '2019-07-21 20:30:00'),
(16, 'Batizado', '#228B22', '2019-07-28 18:30:00', '2019-07-28 20:30:00'),
(17, 'Culto Aviva Jovem', '#A020F0', '2019-07-13 19:00:00', '2019-07-13 21:00:00'),
(18, 'Culto da Família', '#FFD700', '2019-07-14 18:30:00', '2019-07-14 20:30:00'),
(19, 'Celebração da Santa Ceia', '#8B0000', '2019-07-07 18:30:00', '2019-07-07 21:00:00'),
(20, 'Reunião da Conexão', '', '2019-08-03 19:00:00', '2019-08-03 22:00:00'),
(21, 'Celebração da Santa Ceia', '#8B0000', '2019-08-04 18:30:00', '2019-08-04 21:00:00'),
(22, 'Retorno dos cultos de terça', '#228B22', '2019-08-06 20:00:00', '2019-08-06 21:30:00'),
(23, 'Início da escola de Profetas', '#436EEE', '2019-08-12 20:00:00', '2019-08-12 22:00:00'),
(24, 'Batizado', '#0071c5', '2019-12-01 18:30:00', '2019-12-01 20:30:00'),
(25, 'Reunião da Conexão', '#FF4500', '2019-09-05 20:00:00', '2019-09-05 22:30:00'),
(26, 'Celebração  da Santa Ceia', '#0071c5', '2019-09-08 18:30:00', '2019-09-08 20:30:00'),
(27, 'Inauguração Núcleo Itaqua 2', '#0071c5', '2019-09-28 19:30:00', '2019-09-28 21:30:00'),
(28, 'Reunião da Conexão', '#8B4513', '2019-10-03 20:00:00', '2019-10-03 22:00:00'),
(29, 'Culto da Fé', '#FFD700', '2019-10-04 20:00:00', '2019-10-04 22:00:00'),
(30, 'Mulheres em Ação', '#FF1493', '2019-10-19 19:30:00', '2019-10-19 21:30:00'),
(31, 'Inauguração Igreja Carapicuíba', '#FF4500', '2019-11-02 19:30:00', '2019-11-03 22:00:00'),
(32, 'Conferência  Revavil', '#436EEE', '2019-12-07 14:00:00', '2019-12-07 22:00:00'),
(33, 'Consagração da Liderança', '#8B0000', '2019-12-08 09:00:00', '2019-12-08 14:00:00'),
(34, 'Culto de Natal', '#40E0D0', '2019-12-22 18:30:00', '2019-12-22 20:30:00'),
(35, 'Conferência  Aviva Move', '#0071c5', '2019-11-30 14:00:00', '2019-11-30 22:00:00'),
(37, 'Culto da Fé - 1º Dia Profético', '#0071c5', '2020-01-03 20:00:00', '2020-01-03 22:00:00'),
(38, 'Celebração Santa Ceia - 2º Dia Profético', '#0071c5', '2020-01-05 18:30:00', '2020-01-05 20:30:00'),
(39, 'Culto de Avivamento - 3º Dia Profético', '#0071c5', '2020-01-07 20:00:00', '2020-01-07 22:00:00'),
(40, 'Culto da Fé - 4º Dia Profético', '#0071c5', '2020-01-10 20:00:00', '2020-01-10 22:00:00'),
(41, 'Culto da Família - 5º Dia Profético', '#0071c5', '2020-01-12 18:30:00', '2020-01-12 20:30:00'),
(42, 'Culto de Avivamento - 6º Dia Profético', '#0071c5', '2020-01-14 20:00:00', '2020-01-14 22:00:00'),
(43, 'Culto da Fé - 7º Dia Profético', '#0071c5', '2020-01-17 20:00:00', '2020-01-17 22:00:00'),
(44, 'Culto da Família - 8º Dia Profético', '#0071c5', '2020-01-19 18:30:00', '2020-01-19 20:30:00'),
(45, 'Culto de Avivamento - 9º Dia Profético', '#0071c5', '2020-01-21 20:00:00', '2020-01-21 22:00:00'),
(46, 'Culto da Fé - 10º Dia Profético', '#0071c5', '2020-01-24 20:00:00', '2020-01-24 22:00:00'),
(47, 'Summer Camp Aviva Jovem', '#FF4500', '2020-01-24 20:00:00', '2020-01-26 20:00:00'),
(48, 'Reinauguração Ig. Guarulhos', '#A020F0', '2020-01-25 20:00:00', '2020-01-25 22:00:00'),
(49, 'Culto da Família - 11º Dia Profético', '#0071c5', '2020-01-26 18:30:00', '2020-01-26 20:30:00'),
(50, 'Culto de Avivamento - 12º Dia Profético', '#0071c5', '2020-01-28 20:00:00', '2020-01-28 22:00:00'),
(51, 'Culto da Fé', '#0071c5', '2020-01-31 20:00:00', '2020-01-31 22:00:00'),
(52, 'Encerramento dos 12 Cultos Proféticos', '#0071c5', '2020-01-31 20:00:00', '2020-02-01 22:00:00'),
(53, 'Batizado', '#efefef', '2019-04-28 18:30:00', '2019-04-28 20:30:00'),
(54, 'Início da escola de Profetas', '#FF4500', '2020-03-02 20:00:00', '2020-03-02 22:00:00'),
(55, 'Discipulado', '#0071c5', '2020-03-02 20:00:00', '2020-03-02 22:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico`
--

CREATE TABLE `historico` (
  `idHist` int(10) NOT NULL,
  `nome` varchar(50) DEFAULT NULL,
  `status_` varchar(10) DEFAULT NULL,
  `membroCad` int(10) DEFAULT NULL,
  `curso` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `historico`
--

INSERT INTO `historico` (`idHist`, `nome`, `status_`, `membroCad`, `curso`) VALUES
(1, 'ANDERSON ALVES DOS SANTOS', 'REPROVADO', NULL, 2),
(2, 'ANDERSON ALVES DOS SANTOS', 'APROVADO', NULL, 5),
(3, 'ANDERSON ALVES DOS SANTOS', 'APROVADO', NULL, 6),
(4, 'ANDERSON ALVES DOS SANTOS', 'APROVADO', NULL, 8),
(5, 'ANDERSON ALVES DOS SANTOS', 'APROVADO', NULL, 9),
(6, 'ANDERSON ALVES DOS SANTOS', 'REPROVADO', NULL, 10),
(7, 'ANDERSON ALVES DOS SANTOS', 'REPROVADO', NULL, 11),
(8, 'ANDERSON ALVES DOS SANTOS', 'APROVADO', NULL, 13),
(9, 'ANDERSON ALVES DOS SANTOS', 'APROVADO', NULL, 14),
(10, 'ANDERSON ALVES DOS SANTOS', 'APROVADO', NULL, 15),
(11, 'CLÁUDIO DA SILVA GOMES', 'APROVADO', NULL, 1),
(12, 'CLÁUDIO DA SILVA GOMES', 'REPROVADO', NULL, 3),
(13, 'CLÁUDIO DA SILVA GOMES', 'APROVADO', NULL, 5),
(14, 'CLÁUDIO DA SILVA GOMES', 'APROVADO', NULL, 6),
(15, 'CLÁUDIO DA SILVA GOMES', 'APROVADO', NULL, 8),
(16, 'CLÁUDIO DA SILVA GOMES', 'APROVADO', NULL, 10),
(17, 'CLÁUDIO DA SILVA GOMES', 'APROVADO', NULL, 12),
(18, 'CLÁUDIO DA SILVA GOMES', 'REPROVADO', NULL, 13),
(19, 'CLÁUDIO DA SILVA GOMES', 'APROVADO', NULL, 14),
(20, 'EDNILSA DE ARAUJO GOMES', 'APROVADO', NULL, 3),
(21, 'EDNILSA DE ARAUJO GOMES', 'APROVADO', NULL, 4),
(22, 'EDNILSA DE ARAUJO GOMES', 'APROVADO', NULL, 5),
(23, 'EDNILSA DE ARAUJO GOMES', 'APROVADO', NULL, 8),
(24, 'EDNILSA DE ARAUJO GOMES', 'APROVADO', NULL, 10),
(25, 'EDNILSA DE ARAUJO GOMES', 'APROVADO', NULL, 12),
(26, 'EDNILSA DE ARAUJO GOMES', 'REPROVADO', NULL, 13),
(27, 'EDNILSA DE ARAUJO GOMES', 'APROVADO', NULL, 16),
(28, 'ELISABETE OLIVEIRA SANTOS MOTA', 'REPROVADO', NULL, 3),
(29, 'ELISABETE OLIVEIRA SANTOS MOTA', 'APROVADO', NULL, 4),
(30, 'ELISABETE OLIVEIRA SANTOS MOTA', 'APROVADO', NULL, 6),
(31, 'ELISABETE OLIVEIRA SANTOS MOTA', 'APROVADO', NULL, 7),
(32, 'ELISABETE OLIVEIRA SANTOS MOTA', 'APROVADO', NULL, 8),
(33, 'ELISABETE OLIVEIRA SANTOS MOTA', 'APROVADO', NULL, 9),
(34, 'ELISABETE OLIVEIRA SANTOS MOTA', 'APROVADO', NULL, 10),
(35, 'ELISABETE OLIVEIRA SANTOS MOTA', 'APROVADO', NULL, 12),
(36, 'ELISABETE OLIVEIRA SANTOS MOTA', 'REPROVADO', NULL, 13),
(37, 'ELISABETE OLIVEIRA SANTOS MOTA', 'APROVADO', NULL, 16),
(38, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 1),
(39, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 3),
(40, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 4),
(41, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 5),
(42, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 6),
(43, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 7),
(44, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 8),
(45, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 9),
(46, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 11),
(47, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 12),
(48, 'FELISMIRNA LOPES DOS SANTOS', 'REPROVADO', NULL, 13),
(49, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 14),
(50, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 15),
(51, 'FELISMIRNA LOPES DOS SANTOS', 'APROVADO', NULL, 16),
(52, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 1),
(53, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 4),
(54, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 5),
(55, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 6),
(56, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 7),
(57, 'IVONE BARBOSA DA SILVA', 'REPROVADO', NULL, 10),
(58, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 11),
(59, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 12),
(60, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 13),
(61, 'IVONE BARBOSA DA SILVA', 'REPROVADO', NULL, 14),
(62, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 15),
(63, 'IVONE BARBOSA DA SILVA', 'APROVADO', NULL, 16),
(64, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 1),
(65, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 3),
(66, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 4),
(67, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 7),
(68, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 8),
(69, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 9),
(70, 'JOEL DE OLIVEIRA SANTOS', 'REPROVADO', NULL, 11),
(71, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 12),
(72, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 13),
(73, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 15),
(74, 'JOEL DE OLIVEIRA SANTOS', 'APROVADO', NULL, 16),
(75, 'JULIO CESAR MOTA', 'APROVADO', NULL, 1),
(76, 'JULIO CESAR MOTA', 'REPROVADO', NULL, 2),
(77, 'JULIO CESAR MOTA', 'APROVADO', NULL, 3),
(78, 'JULIO CESAR MOTA', 'APROVADO', NULL, 4),
(79, 'JULIO CESAR MOTA', 'APROVADO', NULL, 6),
(80, 'JULIO CESAR MOTA', 'APROVADO', NULL, 7),
(81, 'JULIO CESAR MOTA', 'APROVADO', NULL, 8),
(82, 'JULIO CESAR MOTA', 'APROVADO', NULL, 9),
(83, 'JULIO CESAR MOTA', 'REPROVADO', NULL, 10),
(84, 'JULIO CESAR MOTA', 'APROVADO', NULL, 12),
(85, 'JULIO CESAR MOTA', 'APROVADO', NULL, 13),
(86, 'JULIO CESAR MOTA', 'APROVADO', NULL, 16),
(87, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 1),
(88, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 2),
(89, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 3),
(90, 'LAÉRCIO CARLOS DE LIMA', 'REPROVADO', NULL, 4),
(91, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 5),
(92, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 6),
(93, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 7),
(94, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 8),
(95, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 9),
(96, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 10),
(97, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 11),
(98, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 12),
(99, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 13),
(100, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 14),
(101, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 15),
(102, 'LAÉRCIO CARLOS DE LIMA', 'APROVADO', NULL, 16),
(103, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 1),
(104, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 3),
(105, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 4),
(106, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 5),
(107, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 6),
(108, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 7),
(109, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 8),
(110, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 9),
(111, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'REPROVADO', NULL, 10),
(112, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 12),
(113, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'REPROVADO', NULL, 13),
(114, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 15),
(115, 'REGIANE MARIA C. DE OLIVEIRA SANTOS ', 'APROVADO', NULL, 16),
(116, 'ROSANA MIRANDA DA SILVA MATOS', 'REPROVADO', NULL, 3),
(117, 'ROSANA MIRANDA DA SILVA MATOS', 'APROVADO', NULL, 4),
(118, 'ROSANA MIRANDA DA SILVA MATOS', 'APROVADO', NULL, 7),
(119, 'ROSANA MIRANDA DA SILVA MATOS', 'REPROVADO', NULL, 13),
(120, 'ROSANA MIRANDA DA SILVA MATOS', 'APROVADO', NULL, 15),
(121, 'ROSANA MIRANDA DA SILVA MATOS', 'APROVADO', NULL, 16),
(122, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 1),
(123, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 3),
(124, 'VERA LUCIA NASCIMENTO DE LIMA', 'REPROVADO', NULL, 4),
(125, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 6),
(126, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 7),
(127, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 8),
(128, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 9),
(129, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 12),
(130, 'VERA LUCIA NASCIMENTO DE LIMA', 'REPROVADO', NULL, 13),
(131, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 14),
(132, 'VERA LUCIA NASCIMENTO DE LIMA', 'APROVADO', NULL, 16),
(133, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 1),
(134, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 2),
(135, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 3),
(136, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 4),
(137, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 5),
(138, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 6),
(139, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 7),
(140, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 8),
(141, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 9),
(142, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 10),
(143, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 11),
(144, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 12),
(145, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 13),
(146, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 15),
(147, 'WAGNER WILLIAM ANDRADE DE MATOS', 'APROVADO', NULL, 16),
(148, 'ANDERSON ALVES DOS SANTOS', 'APROVADO', NULL, 1),
(149, 'ALDO ALVES DIAS', 'APROVADO', NULL, 1),
(150, 'ALDO ALVES DIAS', 'REPROVADO', NULL, 2),
(151, 'ALDO ALVES DIAS', 'APROVADO', NULL, 3),
(152, 'ALDO ALVES DIAS', 'APROVADO', NULL, 5),
(153, 'ALDO ALVES DIAS', 'APROVADO', NULL, 6),
(154, 'ALDO ALVES DIAS', 'APROVADO', NULL, 7),
(155, 'ALDO ALVES DIAS', 'APROVADO', NULL, 8),
(156, 'ALDO ALVES DIAS', 'REPROVADO', NULL, 12),
(157, 'ALDO ALVES DIAS', 'APROVADO', NULL, 14),
(158, 'ALDO ALVES DIAS', 'APROVADO', NULL, 15),
(159, 'CLARICE REGINA SANTOS PEQUENO', 'APROVADO', NULL, 1),
(160, 'CLARICE REGINA SANTOS PEQUENO', 'APROVADO', NULL, 4),
(161, 'CLARICE REGINA SANTOS PEQUENO', 'APROVADO', NULL, 7),
(162, 'CLARICE REGINA SANTOS PEQUENO', 'REPROVADO', NULL, 12),
(163, 'DANIEL LOPES DOS SANTOS', 'APROVADO', NULL, 1),
(164, 'DANIEL LOPES DOS SANTOS', 'APROVADO', NULL, 2),
(165, 'DANIEL LOPES DOS SANTOS', 'APROVADO', NULL, 3),
(166, 'DANIEL LOPES DOS SANTOS', 'APROVADO', NULL, 5),
(167, 'DANIEL LOPES DOS SANTOS', 'APROVADO', NULL, 6),
(168, 'DANIEL LOPES DOS SANTOS', 'REPROVADO', NULL, 7),
(169, 'DANIEL LOPES DOS SANTOS', 'REPROVADO', NULL, 9),
(170, 'DANIEL LOPES DOS SANTOS', 'REPROVADO', NULL, 12),
(171, 'DANIEL LOPES DOS SANTOS', 'APROVADO', NULL, 14),
(172, 'DANIEL LOPES DOS SANTOS', 'APROVADO', NULL, 15),
(173, 'FABIO ALEXANDRE SILVA SANTOS', 'APROVADO', NULL, 1),
(174, 'FABIO ALEXANDRE SILVA SANTOS', 'APROVADO', NULL, 6),
(175, 'FABIO ALEXANDRE SILVA SANTOS', 'APROVADO', NULL, 15),
(176, 'FABIO FRANCISCO', 'APROVADO', NULL, 1),
(177, 'FABIO FRANCISCO', 'REPROVADO', NULL, 2),
(178, 'FABIO FRANCISCO', 'APROVADO', NULL, 3),
(179, 'FABIO FRANCISCO', 'APROVADO', NULL, 6),
(180, 'FABIO FRANCISCO', 'APROVADO', NULL, 7),
(181, 'FABIO FRANCISCO', 'APROVADO', NULL, 8),
(182, 'FABIO FRANCISCO', 'APROVADO', NULL, 12),
(183, 'FABIO FRANCISCO', 'APROVADO', NULL, 14),
(184, 'FABIO FRANCISCO', 'APROVADO', NULL, 15),
(185, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 1),
(186, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 2),
(187, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 3),
(188, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 5),
(189, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 6),
(190, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 7),
(191, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 8),
(192, 'FERNANDA CEZAR GOMES', 'REPROVADO', NULL, 9),
(193, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 10),
(194, 'FERNANDA CEZAR GOMES', 'APROVADO', NULL, 14),
(195, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 1),
(196, 'FRANCILDO S. OLIVEIRA', 'REPROVADO', NULL, 2),
(197, 'FRANCILDO S. OLIVEIRA', 'REPROVADO', NULL, 3),
(198, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 4),
(199, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 5),
(200, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 6),
(201, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 7),
(202, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 8),
(203, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 9),
(204, 'FRANCILDO S. OLIVEIRA', 'REPROVADO', NULL, 10),
(205, 'FRANCILDO S. OLIVEIRA', 'REPROVADO', NULL, 12),
(206, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 14),
(207, 'FRANCILDO S. OLIVEIRA', 'APROVADO', NULL, 15),
(208, 'FRANCILDO S. OLIVEIRA', 'REPROVADO', NULL, 16),
(209, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 1),
(210, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 2),
(211, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 3),
(212, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 4),
(213, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 7),
(214, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 9),
(215, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 10),
(216, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 11),
(217, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 14),
(218, 'GIOVANNA OLIVEIRA CARLOS DA SILVA', 'APROVADO', NULL, 16),
(219, 'JAQUELINE TAVARES DE SOUZA', 'APROVADO', NULL, 1),
(220, 'JAQUELINE TAVARES DE SOUZA', 'REPROVADO', NULL, 3),
(221, 'JAQUELINE TAVARES DE SOUZA', 'APROVADO', NULL, 5),
(222, 'JAQUELINE TAVARES DE SOUZA', 'APROVADO', NULL, 6),
(223, 'JAQUELINE TAVARES DE SOUZA', 'REPROVADO', NULL, 7),
(224, 'JAQUELINE TAVARES DE SOUZA', 'APROVADO', NULL, 8),
(225, 'JAQUELINE TAVARES DE SOUZA', 'REPROVADO', NULL, 10),
(226, 'JAQUELINE TAVARES DE SOUZA', 'APROVADO', NULL, 14),
(227, 'JAQUELINE TAVARES DE SOUZA', 'APROVADO', NULL, 15),
(228, 'JULIANA OLIVEIRA CARLOS LOPES', 'APROVADO', NULL, 1),
(229, 'JULIANA OLIVEIRA CARLOS LOPES', 'APROVADO', NULL, 2),
(230, 'JULIANA OLIVEIRA CARLOS LOPES', 'APROVADO', NULL, 3),
(231, 'JULIANA OLIVEIRA CARLOS LOPES', 'APROVADO', NULL, 5),
(232, 'JULIANA OLIVEIRA CARLOS LOPES', 'APROVADO', NULL, 6),
(233, 'JULIANA OLIVEIRA CARLOS LOPES', 'REPROVADO', NULL, 7),
(234, 'JULIANA OLIVEIRA CARLOS LOPES', 'REPROVADO', NULL, 9),
(235, 'JULIANA OLIVEIRA CARLOS LOPES', 'REPROVADO', NULL, 12),
(236, 'JULIANA OLIVEIRA CARLOS LOPES', 'APROVADO', NULL, 14),
(237, 'JULIANA OLIVEIRA CARLOS LOPES', 'APROVADO', NULL, 15),
(238, 'JULIANA OLIVEIRA CARLOS LOPES', 'APROVADO', NULL, 16),
(239, 'KELLY CRISTINA LEOPOLDINA KAMUYA', 'REPROVADO', NULL, 2),
(240, 'KELLY CRISTINA LEOPOLDINA KAMUYA', 'REPROVADO', NULL, 3),
(241, 'KELLY CRISTINA LEOPOLDINA KAMUYA', 'REPROVADO', NULL, 4),
(242, 'KELLY CRISTINA LEOPOLDINA KAMUYA', 'APROVADO', NULL, 5),
(243, 'KELLY CRISTINA LEOPOLDINA KAMUYA', 'REPROVADO', NULL, 6),
(244, 'KELLY CRISTINA LEOPOLDINA KAMUYA', 'APROVADO', NULL, 15),
(245, 'KELLY CRISTINA LEOPOLDINA KAMUYA', 'APROVADO', NULL, 16),
(246, 'LUIS ALVES PEQUENO', 'APROVADO', NULL, 1),
(247, 'LUIS ALVES PEQUENO', 'APROVADO', NULL, 2),
(248, 'LUIS ALVES PEQUENO', 'APROVADO', NULL, 3),
(249, 'LUIS ALVES PEQUENO', 'APROVADO', NULL, 5),
(250, 'LUIS ALVES PEQUENO', 'APROVADO', NULL, 7),
(251, 'LUIS ALVES PEQUENO', 'APROVADO', NULL, 14),
(252, 'LUIS ALVES PEQUENO', 'REPROVADO', NULL, 15),
(253, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 1),
(254, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 2),
(255, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 3),
(256, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 6),
(257, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 7),
(258, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 8),
(259, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 9),
(260, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 13),
(261, 'MAGNA DE OLIVEIRA SILVA ALVES', 'APROVADO', NULL, 15),
(262, 'MARIA DE FATIMA P. OLIVEIRA', 'APROVADO', NULL, 1),
(263, 'MARIA DE FATIMA P. OLIVEIRA', 'REPROVADO', NULL, 3),
(264, 'MARIA DE FATIMA P. OLIVEIRA', 'APROVADO', NULL, 6),
(265, 'MARIA DE FATIMA P. OLIVEIRA', 'APROVADO', NULL, 8),
(266, 'MARIA DE FATIMA P. OLIVEIRA', 'APROVADO', NULL, 14),
(267, 'MARTIM RAMALHO VIEIRA', 'APROVADO', NULL, 5),
(268, 'MARTIM RAMALHO VIEIRA', 'REPROVADO', NULL, 6),
(269, 'MARTIM RAMALHO VIEIRA', 'APROVADO', NULL, 7),
(270, 'MARTIM RAMALHO VIEIRA', 'APROVADO', NULL, 8),
(271, 'MARTIM RAMALHO VIEIRA', 'APROVADO', NULL, 10),
(272, 'MARTIM RAMALHO VIEIRA', 'APROVADO', NULL, 11),
(273, 'MARTIM RAMALHO VIEIRA', 'APROVADO', NULL, 12),
(274, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'APROVADO', NULL, 1),
(275, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'REPROVADO', NULL, 2),
(276, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'APROVADO', NULL, 3),
(277, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'REPROVADO', NULL, 4),
(278, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'APROVADO', NULL, 6),
(279, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'APROVADO', NULL, 7),
(280, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'APROVADO', NULL, 8),
(281, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'APROVADO', NULL, 14),
(282, 'SANDRA DANTAS SIQUEIRA FRANCISCO', 'APROVADO', NULL, 15),
(283, 'SHIRLEY VIVIANE SOUZA VIEIRA', 'REPROVADO', NULL, 6),
(284, 'SHIRLEY VIVIANE SOUZA VIEIRA', 'APROVADO', NULL, 7),
(285, 'SHIRLEY VIVIANE SOUZA VIEIRA', 'APROVADO', NULL, 8),
(286, 'SHIRLEY VIVIANE SOUZA VIEIRA', 'APROVADO', NULL, 9),
(287, 'SHIRLEY VIVIANE SOUZA VIEIRA', 'REPROVADO', NULL, 12),
(288, 'SILVANI DA SILVA BRAZ', 'APROVADO', NULL, 1),
(289, 'SILVANI DA SILVA BRAZ', 'APROVADO', NULL, 3),
(290, 'SILVANI DA SILVA BRAZ', 'APROVADO', NULL, 4),
(291, 'SILVANI DA SILVA BRAZ', 'APROVADO', NULL, 5),
(292, 'SILVANI DA SILVA BRAZ', 'APROVADO', NULL, 6),
(293, 'SILVANI DA SILVA BRAZ', 'APROVADO', NULL, 7),
(294, 'SILVANI DA SILVA BRAZ', 'APROVADO', NULL, 8),
(295, 'SILVANI DA SILVA BRAZ', 'APROVADO', NULL, 12),
(296, 'SILVANI DA SILVA BRAZ', 'REPROVADO', NULL, 13),
(297, 'SILVANI DA SILVA BRAZ', 'REPROVADO', NULL, 15),
(298, 'SUMÁRIA ALMEIDA LEÃO', 'REPROVADO', NULL, 6),
(299, 'SUMÁRIA ALMEIDA LEÃO', 'APROVADO', NULL, 8),
(300, 'SUMÁRIA ALMEIDA LEÃO', 'APROVADO', NULL, 9),
(301, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 1),
(302, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 2),
(303, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 3),
(304, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 4),
(305, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 5),
(306, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 6),
(307, 'THIAGO DA SILVA GOMES ', 'REPROVADO', NULL, 7),
(308, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 8),
(309, 'THIAGO DA SILVA GOMES ', 'REPROVADO', NULL, 9),
(310, 'THIAGO DA SILVA GOMES ', 'REPROVADO', NULL, 12),
(311, 'THIAGO DA SILVA GOMES ', 'REPROVADO', NULL, 13),
(312, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 14),
(313, 'THIAGO DA SILVA GOMES ', 'APROVADO', NULL, 15),
(314, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 1),
(315, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 3),
(316, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 4),
(317, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 5),
(318, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 6),
(319, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 8),
(320, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 10),
(321, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'REPROVADO', NULL, 12),
(322, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'REPROVADO', NULL, 13),
(323, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 15),
(324, 'VALDIRENE OLIVEIRA BISPO DOS SANTOS', 'APROVADO', NULL, 16),
(325, 'WAGUERSON DE OLIVEIRA', 'REPROVADO', NULL, 2),
(326, 'WAGUERSON DE OLIVEIRA', 'APROVADO', NULL, 5),
(327, 'WAGUERSON DE OLIVEIRA', 'APROVADO', NULL, 7),
(328, 'WAGUERSON DE OLIVEIRA', 'APROVADO', NULL, 12),
(329, 'WAGUERSON DE OLIVEIRA', 'APROVADO', NULL, 15),
(330, 'WILLIAN DA CUNHA LEÃO', 'REPROVADO', NULL, 2),
(331, 'WILLIAN DA CUNHA LEÃO', 'APROVADO', NULL, 5),
(332, 'WILLIAN DA CUNHA LEÃO', 'REPROVADO', NULL, 6),
(333, 'WILLIAN DA CUNHA LEÃO', 'APROVADO', NULL, 9),
(334, 'CARMEM LUCIA', 'APROVADO', NULL, 2),
(335, 'CARMEM LUCIA', 'APROVADO', NULL, 3),
(336, 'CARMEM LUCIA', 'APROVADO', NULL, 6),
(337, 'CARMEM LUCIA', 'APROVADO', NULL, 8),
(338, 'CARMEM LUCIA', 'APROVADO', NULL, 12),
(339, 'CARMEM LUCIA', 'APROVADO', NULL, 13),
(340, 'CARMEM LUCIA', 'APROVADO', NULL, 15),
(341, 'CARMEM LUCIA', 'APROVADO', NULL, 16),
(342, 'CAROLINE SILVA DE LIMA', 'REPROVADO', NULL, 6),
(343, 'CLÉCIO MARCIO FRANCISCO DA SILVA', 'APROVADO', NULL, 5),
(344, 'CLÉCIO MARCIO FRANCISCO DA SILVA', 'REPROVADO', NULL, 7),
(345, 'CRISTIANE APARECIDA LIMA DA SILVA', 'APROVADO', NULL, 6),
(346, 'DANIELLY A. FRANÇA', 'REPROVADO', NULL, 6),
(347, 'DANIELLY A. FRANÇA', 'APROVADO', NULL, 15),
(348, 'DAVID DE JESUS SILVA', 'APROVADO', NULL, 2),
(349, 'DAVID DE JESUS SILVA', 'APROVADO', NULL, 7),
(350, 'DAVID DE JESUS SILVA', 'APROVADO', NULL, 8),
(351, 'DAVID DE JESUS SILVA', 'APROVADO', NULL, 15),
(352, 'DAVID RAMALHO DOS SANTOS', 'APROVADO', NULL, 2),
(357, 'DENISE RIBEIRO DE JESUS LEITE', 'APROVADO', NULL, 1),
(358, 'DENISE RIBEIRO DE JESUS LEITE', 'APROVADO', NULL, 15),
(359, 'DIOGO JUAN RAMALHO SANTOS', 'APROVADO', NULL, 2),
(360, 'DORIVAL PEREIRA SANTOS', 'APROVADO', NULL, 2),
(361, 'DORIVAL PEREIRA SANTOS', 'APROVADO', NULL, 6),
(362, 'DORIVAL PEREIRA SANTOS', 'APROVADO', NULL, 7),
(363, 'DORIVAL PEREIRA SANTOS', 'APROVADO', NULL, 12),
(364, 'EDILENE COSTA', 'APROVADO', NULL, 1),
(365, 'EDILENE COSTA', 'APROVADO', NULL, 2),
(366, 'EDILENE COSTA', 'REPROVADO', NULL, 12),
(367, 'EDILENE COSTA', 'APROVADO', NULL, 14),
(368, 'EDILENE COSTA', 'APROVADO', NULL, 15),
(369, 'ELAINE CRISTINA DE NEGREIROS OLIVEIRA', 'APROVADO', NULL, 3),
(370, 'ELAINE CRISTINA DE NEGREIROS OLIVEIRA', 'APROVADO', NULL, 5),
(371, 'ELAINE CRISTINA DE NEGREIROS OLIVEIRA', 'APROVADO', NULL, 6),
(372, 'ELAINE CRISTINA DE NEGREIROS OLIVEIRA', 'REPROVADO', NULL, 12),
(373, 'ELAINE CRISTINA DE NEGREIROS OLIVEIRA', 'APROVADO', NULL, 16),
(374, 'ELIS OLIVEIRA CALHEIRA', 'APROVADO', NULL, 12),
(375, 'ELTON CARVALHO DE BARROS', 'APROVADO', NULL, 3),
(376, 'ELTON CARVALHO DE BARROS', 'APROVADO', NULL, 8),
(377, 'ELTON CARVALHO DE BARROS', 'APROVADO', NULL, 9),
(378, 'ELTON CARVALHO DE BARROS', 'APROVADO', NULL, 10),
(379, 'ELTON CARVALHO DE BARROS', 'APROVADO', NULL, 11),
(380, 'ELTON CARVALHO DE BARROS', 'REPROVADO', NULL, 15),
(381, 'FELIPE SALUSTIANO SOARES', 'REPROVADO', NULL, 2),
(382, 'FELIPE SALUSTIANO SOARES', 'REPROVADO', NULL, 5),
(383, 'FELIPE SALUSTIANO SOARES', 'APROVADO', NULL, 15),
(384, 'ALEX PEREIRA DE OLIVEIRA', 'REPROVADO', NULL, 3),
(385, 'ALEX PEREIRA DE OLIVEIRA', 'REPROVADO', NULL, 15),
(386, 'ALEXSANDRO DA SILVA GOMES', 'APROVADO', NULL, 1),
(387, 'ALEXSANDRO DA SILVA GOMES', 'APROVADO', NULL, 2),
(388, 'ALEXSANDRO DA SILVA GOMES', 'APROVADO', NULL, 3),
(389, 'ALEXSANDRO DA SILVA GOMES', 'APROVADO', NULL, 8),
(390, 'ALEXSANDRO DA SILVA GOMES', 'APROVADO', NULL, 13),
(391, 'ALEXSANDRO DA SILVA GOMES', 'APROVADO', NULL, 16),
(392, 'AMANDA DA SILVA FARIAS', 'APROVADO', NULL, 1),
(393, 'AMANDA DA SILVA FARIAS', 'REPROVADO', NULL, 3),
(394, 'AMANDA DA SILVA FARIAS', 'REPROVADO', NULL, 7),
(395, 'AMANDA DA SILVA FARIAS', 'APROVADO', NULL, 11),
(396, 'AMANDA DA SILVA FARIAS', 'APROVADO', NULL, 14),
(397, 'AMANDA DA SILVA FARIAS', 'APROVADO', NULL, 16),
(398, 'ANA LUCIA LUZ OROSCO', 'APROVADO', NULL, 1),
(399, 'ANA LUCIA LUZ OROSCO', 'APROVADO', NULL, 2),
(400, 'ANA LUCIA LUZ OROSCO', 'APROVADO', NULL, 3),
(401, 'ANA LUCIA LUZ OROSCO', 'APROVADO', NULL, 5),
(402, 'ANA LUCIA LUZ OROSCO', 'APROVADO', NULL, 14),
(403, 'ANA LUCIA LUZ OROSCO', 'APROVADO', NULL, 15),
(404, 'ANDERSON JOSE DA SILVA FERRARI', 'APROVADO', NULL, 2),
(405, 'ANDERSON JOSE DA SILVA FERRARI', 'APROVADO', NULL, 5),
(406, 'ANDERSON JOSE DA SILVA FERRARI', 'APROVADO', NULL, 15),
(407, 'ANDERSON OLIVEIRA B. DOS SANTOS', 'APROVADO', NULL, 14),
(408, 'ANTONIO LOPES DE SOUZA', 'APROVADO', NULL, 1),
(409, 'ANTONIO LOPES DE SOUZA', 'APROVADO', NULL, 6),
(410, 'ANTONIO LOPES DE SOUZA', 'APROVADO', NULL, 12),
(411, 'ANTONIO LOPES DE SOUZA', 'APROVADO', NULL, 15),
(412, 'BEATRIZ DOS SANTOS CARVALHO', 'REPROVADO', NULL, 3),
(413, 'BERENICE COSTA BARRETO SOUZA', 'APROVADO', NULL, 1),
(414, 'BERENICE COSTA BARRETO SOUZA', 'REPROVADO', NULL, 3),
(415, 'BERENICE COSTA BARRETO SOUZA', 'APROVADO', NULL, 6),
(416, 'BERENICE COSTA BARRETO SOUZA', 'REPROVADO', NULL, 7),
(417, 'BERENICE COSTA BARRETO SOUZA', 'APROVADO', NULL, 8),
(418, 'BERENICE COSTA BARRETO SOUZA', 'APROVADO', NULL, 14),
(419, 'BERENICE COSTA BARRETO SOUZA', 'REPROVADO', NULL, 15),
(420, 'BRUNA CAROLINY DE SOUZA', 'APROVADO', NULL, 5),
(421, 'BRUNO DO NASCIMENTO OROSCO', 'APROVADO', NULL, 1),
(422, 'BRUNO DO NASCIMENTO OROSCO', 'APROVADO', NULL, 2),
(423, 'BRUNO DO NASCIMENTO OROSCO', 'APROVADO', NULL, 5),
(425, 'BRUNO DO NASCIMENTO OROSCO', 'APROVADO', NULL, 14),
(426, 'BRUNO DO NASCIMENTO OROSCO', 'APROVADO', NULL, 15),
(427, 'BRUNO MARIO DE A. SILVA', 'APROVADO', NULL, 1),
(428, 'BRUNO MARIO DE A. SILVA', 'REPROVADO', NULL, 2),
(429, 'BRUNO MARIO DE A. SILVA', 'REPROVADO', NULL, 3),
(430, 'BRUNO MARIO DE A. SILVA', 'APROVADO', NULL, 8),
(431, 'BRUNO MARIO DE A. SILVA', 'APROVADO', NULL, 9),
(432, 'BRUNO MARIO DE A. SILVA', 'APROVADO', NULL, 10),
(433, 'BRUNO MARIO DE A. SILVA', 'APROVADO', NULL, 11),
(434, 'BRUNO MARIO DE A. SILVA', 'APROVADO', NULL, 14),
(435, 'CAIQUE BARBOSA FRANÇA', 'APROVADO', NULL, 5),
(436, 'FERNANDA LIMA GODOI', 'APROVADO', NULL, 1),
(437, 'FERNANDA LIMA GODOI', 'APROVADO', NULL, 14),
(438, 'FERNANDA LIMA GODOI', 'APROVADO', NULL, 15),
(439, 'GERSON BISPO DOS SANTOS FILHO', 'REPROVADO', NULL, 5),
(440, 'GISELLY RAMOS FERREIRA', 'REPROVADO', NULL, 3),
(441, 'GUILHERME DA SILVA NASCIMENTO', 'APROVADO', NULL, 1),
(442, 'GUILHERME DA SILVA NASCIMENTO', 'APROVADO', NULL, 3),
(443, 'GUILHERME DA SILVA NASCIMENTO', 'APROVADO', NULL, 6),
(444, 'GUILHERME DA SILVA NASCIMENTO', 'APROVADO', NULL, 7),
(445, 'GUILHERME DA SILVA NASCIMENTO', 'APROVADO', NULL, 14),
(446, 'GUILHERME DA SILVA NASCIMENTO', 'APROVADO', NULL, 15),
(447, 'GUSTAVO DA SILVA LIBERATO', 'APROVADO', NULL, 5),
(448, 'HELDER LIMA DE OLIVEIRA', 'REPROVADO', NULL, 14),
(449, 'HIAGO MACEDO MIRANDA', 'APROVADO', NULL, 1),
(450, 'HIAGO MACEDO MIRANDA', 'APROVADO', NULL, 2),
(451, 'HIAGO MACEDO MIRANDA', 'REPROVADO', NULL, 3),
(452, 'HIAGO MACEDO MIRANDA', 'REPROVADO', NULL, 5),
(453, 'HIAGO MACEDO MIRANDA', 'APROVADO', NULL, 6),
(454, 'HIAGO MACEDO MIRANDA', 'APROVADO', NULL, 15),
(455, 'IRANI DIAS DE AQUINO', 'APROVADO', NULL, 9),
(456, 'JANAINA TAVARES DE SOUZA MANZANI', 'APROVADO', NULL, 5),
(457, 'JANAINA TAVARES DE SOUZA MANZANI', 'REPROVADO', NULL, 6),
(458, 'JANAINA TAVARES DE SOUZA MANZANI', 'APROVADO', NULL, 9),
(459, 'JESSICA SANTOS DE OLIVEIRA', 'APROVADO', NULL, 1),
(460, 'JESSICA SANTOS DE OLIVEIRA', 'REPROVADO', NULL, 2),
(461, 'JESSICA SANTOS DE OLIVEIRA', 'APROVADO', NULL, 5),
(462, 'JESSICA SANTOS DE OLIVEIRA', 'APROVADO', NULL, 7),
(463, 'JESSICA SANTOS DE OLIVEIRA', 'APROVADO', NULL, 8),
(464, 'JESSICA SANTOS DE OLIVEIRA', 'APROVADO', NULL, 14),
(465, 'JESSICA SANTOS DE OLIVEIRA', 'APROVADO', NULL, 16),
(466, 'JOSE ANDRE DA SILVA ROCHA', 'REPROVADO', NULL, 3),
(467, 'JOSE ANDRE DA SILVA ROCHA', 'REPROVADO', NULL, 7),
(468, 'JOSE ANDRE DA SILVA ROCHA', 'REPROVADO', NULL, 14),
(469, 'JOSE ANDRE DA SILVA ROCHA', 'APROVADO', NULL, 15),
(470, 'JOSE MARCOS', 'APROVADO', NULL, 2),
(471, 'JOSE MARCOS', 'APROVADO', NULL, 3),
(472, 'JOSE MARCOS', 'REPROVADO', NULL, 6),
(473, 'JOSE MARCOS', 'APROVADO', NULL, 12),
(474, 'JOSE MARCOS', 'APROVADO', NULL, 13),
(475, 'JOSE MARCOS', 'APROVADO', NULL, 15),
(476, 'JOSE MARCOS', 'APROVADO', NULL, 16),
(477, 'JOYCE SOARES DOS SANTOS SILVA', 'APROVADO', NULL, 5),
(478, 'JOYCE SOARES DOS SANTOS SILVA', 'REPROVADO', NULL, 6),
(479, 'JOYCE SOARES DOS SANTOS SILVA', 'APROVADO', NULL, 8),
(480, 'JOYCE SOARES DOS SANTOS SILVA', 'APROVADO', NULL, 10),
(481, 'JOYCE SOARES DOS SANTOS SILVA', 'APROVADO', NULL, 14),
(482, 'JULIO CESAR MOTA JR.', 'REPROVADO', NULL, 2),
(483, 'JULIO CESAR MOTA JR.', 'REPROVADO', NULL, 3),
(484, 'JULIO CESAR MOTA JR.', 'APROVADO', NULL, 5),
(485, 'JULIO CESAR MOTA JR.', 'APROVADO', NULL, 15),
(486, 'KAREN MACIEL ROCHA DA SILVA', 'REPROVADO', NULL, 3),
(487, 'KAREN MACIEL ROCHA DA SILVA', 'REPROVADO', NULL, 14),
(488, 'KAREN MACIEL ROCHA DA SILVA', 'APROVADO', NULL, 15),
(489, 'KELLY CRISTINA BRITO', 'REPROVADO', NULL, 6),
(490, 'KELLY CRISTINA BRITO', 'APROVADO', NULL, 14),
(491, 'LEANDRO DE ALMEIDA BEZERRA', 'APROVADO', NULL, 1),
(492, 'LEANDRO DE ALMEIDA BEZERRA', 'REPROVADO', NULL, 2),
(493, 'LEANDRO DE ALMEIDA BEZERRA', 'APROVADO', NULL, 5),
(494, 'LEANDRO DE ALMEIDA BEZERRA', 'APROVADO', NULL, 6),
(495, 'LEANDRO DE ALMEIDA BEZERRA', 'APROVADO', NULL, 7),
(496, 'LEANDRO DE ALMEIDA BEZERRA', 'APROVADO', NULL, 14),
(497, 'LEANDRO DE ALMEIDA BEZERRA', 'APROVADO', NULL, 15),
(498, 'LEONARDO AQUINO FERNANDES BARBOSA', 'APROVADO', NULL, 1),
(499, 'LEONARDO AQUINO FERNANDES BARBOSA', 'APROVADO', NULL, 3),
(500, 'LEONARDO AQUINO FERNANDES BARBOSA', 'REPROVADO', NULL, 6),
(501, 'LEONARDO AQUINO FERNANDES BARBOSA', 'APROVADO', NULL, 14),
(502, 'LEONARDO AQUINO FERNANDES BARBOSA', 'APROVADO', NULL, 15),
(503, 'LETICIA MONTEIRO DA SILVA', 'APROVADO', NULL, 1),
(504, 'LETICIA MONTEIRO DA SILVA', 'APROVADO', NULL, 13),
(505, 'LETICIA MONTEIRO DA SILVA', 'APROVADO', NULL, 14),
(506, 'LUANA KELLY SOUZA LOPES', 'APROVADO', NULL, 15),
(507, 'LUCAS VINICIUS ORSI', 'APROVADO', NULL, 1),
(508, 'LUCAS VINICIUS ORSI', 'APROVADO', NULL, 2),
(509, 'LUCAS VINICIUS ORSI', 'APROVADO', NULL, 3),
(510, 'LUCAS VINICIUS ORSI', 'APROVADO', NULL, 5),
(511, 'LUCAS VINICIUS ORSI', 'APROVADO', NULL, 14),
(512, 'LUCAS VINICIUS ORSI', 'APROVADO', NULL, 15),
(513, 'LUCIANA DA SILVA BRAZ', 'APROVADO', NULL, 1),
(514, 'LUCIANA DA SILVA BRAZ', 'APROVADO', NULL, 3),
(515, 'LUCIANA DA SILVA BRAZ', 'APROVADO', NULL, 4),
(516, 'LUCIANA DA SILVA BRAZ', 'APROVADO', NULL, 7),
(517, 'LUCIANA DA SILVA BRAZ', 'APROVADO', NULL, 12),
(518, 'LUCIANA DA SILVA BRAZ', 'APROVADO', NULL, 13),
(519, 'LUCIANA DA SILVA BRAZ', 'APROVADO', NULL, 14),
(520, 'LUCIANA DA SILVA BRAZ', 'APROVADO', NULL, 16),
(521, 'LUCIMAR LOURDES DE MORAES ', 'APROVADO', NULL, 1),
(522, 'LUCIMAR LOURDES DE MORAES ', 'APROVADO', NULL, 3),
(523, 'LUCIMAR LOURDES DE MORAES ', 'APROVADO', NULL, 5),
(524, 'LUCIMAR LOURDES DE MORAES ', 'APROVADO', NULL, 14),
(525, 'MAGDA RAMALHO VILHAÇA', 'REPROVADO', NULL, 2),
(526, 'MAGDA RAMALHO VILHAÇA', 'REPROVADO', NULL, 12),
(527, 'MARCIA MARCELINO DA SILVA', 'APROVADO', NULL, 2),
(528, 'MARCIA RAMALHO V. SANTOS', 'APROVADO', NULL, 2),
(529, 'MARCOS VINICIUS XAVIER DOS SANTOS', 'REPROVADO', NULL, 2),
(530, 'MARCUS VINICIUS OTONI DE MORAES', 'APROVADO', NULL, 1),
(531, 'MARCUS VINICIUS OTONI DE MORAES', 'APROVADO', NULL, 2),
(532, 'MARCUS VINICIUS OTONI DE MORAES', 'APROVADO', NULL, 3),
(533, 'MARCUS VINICIUS OTONI DE MORAES', 'APROVADO', NULL, 12),
(534, 'MARCUS VINICIUS OTONI DE MORAES', 'APROVADO', NULL, 14),
(535, 'MARCUS VINICIUS OTONI DE MORAES', 'APROVADO', NULL, 15),
(536, 'MARIAH EDUARDA F. GOMES ', 'APROVADO', NULL, 1),
(537, 'MARIANE ADALIDA F. L. GOMES', 'APROVADO', NULL, 1),
(538, 'MARIANE ADALIDA F. L. GOMES', 'APROVADO', NULL, 2),
(539, 'MARIANE ADALIDA F. L. GOMES', 'APROVADO', NULL, 14),
(540, 'MARIANE ADALIDA F. L. GOMES', 'APROVADO', NULL, 15),
(541, 'PATRICIA CARLOS SILVA', 'APROVADO', NULL, 1),
(542, 'PATRICIA CARLOS SILVA', 'APROVADO', NULL, 2),
(543, 'PATRICIA CARLOS SILVA', 'APROVADO', NULL, 3),
(544, 'PATRICIA CARLOS SILVA', 'REPROVADO', NULL, 12),
(545, 'PATRICIA CARLOS SILVA', 'REPROVADO', NULL, 13),
(546, 'PATRICIA CARLOS SILVA', 'APROVADO', NULL, 14),
(547, 'PATRICIA CARLOS SILVA', 'APROVADO', NULL, 15),
(548, 'PATRICIA CARLOS SILVA', 'APROVADO', NULL, 16),
(549, 'RENATA GABRIELA DA SILVA RAMALHO', 'REPROVADO', NULL, 2),
(550, 'RICARDO PINTO DE MORAES', 'APROVADO', NULL, 15),
(551, 'RINALDO LORASQUE', 'APROVADO', NULL, 1),
(552, 'RINALDO LORASQUE', 'APROVADO', NULL, 3),
(553, 'RINALDO LORASQUE', 'APROVADO', NULL, 14),
(554, 'RODRIGO DOS SANTOS GODOI', 'APROVADO', NULL, 1),
(555, 'RODRIGO DOS SANTOS GODOI', 'APROVADO', NULL, 15),
(556, 'ROGERIO O. DOS SANTOS', 'APROVADO', NULL, 1),
(557, 'ROGERIO O. DOS SANTOS', 'APROVADO', NULL, 14),
(558, 'ROSANGELA MARIA PEREIRA DIAS ', 'APROVADO', NULL, 1),
(559, 'ROSANGELA MARIA PEREIRA DIAS ', 'APROVADO', NULL, 2),
(560, 'ROSANGELA MARIA PEREIRA DIAS ', 'REPROVADO', NULL, 3),
(561, 'ROSANGELA MARIA PEREIRA DIAS ', 'APROVADO', NULL, 14),
(562, 'ROSANGELA MARIA PEREIRA DIAS ', 'APROVADO', NULL, 15),
(563, 'ROSANGELA S. SANTOS', 'REPROVADO', NULL, 2),
(564, 'SABRINA SOUZA DE OLIVEIRA', 'APROVADO', NULL, 1),
(565, 'TARCILA DOS SANTOS FONSECA', 'APROVADO', NULL, 14),
(566, 'THAIS SILVA SANTOS', 'APROVADO', NULL, 1),
(567, 'THAIS SILVA SANTOS', 'APROVADO', NULL, 14),
(568, 'THAUANE MELISSA COSTA MOREIRA', 'APROVADO', NULL, 1),
(569, 'THAUANE MELISSA COSTA MOREIRA', 'APROVADO', NULL, 2),
(570, 'THAUANE MELISSA COSTA MOREIRA', 'APROVADO', NULL, 14),
(571, 'THAUANE MELISSA COSTA MOREIRA', 'APROVADO', NULL, 15),
(572, 'THAYNA LETICIA COSTA MOREIRA', 'APROVADO', NULL, 1),
(573, 'THAYNA LETICIA COSTA MOREIRA', 'APROVADO', NULL, 2),
(574, 'THAYNA LETICIA COSTA MOREIRA', 'APROVADO', NULL, 14),
(575, 'THAYNA LETICIA COSTA MOREIRA', 'APROVADO', NULL, 15),
(576, 'VANDER LUIZ FRAN?A', 'APROVADO', NULL, 15),
(577, 'VANESSA FERRARI DA SILVA', 'APROVADO', NULL, 2),
(578, 'VANESSA FERRARI DA SILVA', 'APROVADO', NULL, 15),
(579, 'VEREDIANA C. FRAN?A DOS SANTOS', 'APROVADO', NULL, 15),
(580, 'VICTOR DE SIQUEIRA MOREIRA', 'APROVADO', NULL, 2),
(581, 'VICTOR DE SIQUEIRA MOREIRA', 'APROVADO', NULL, 15),
(582, 'WAGNER CARDOSO', 'APROVADO', NULL, 14),
(583, 'WALLACE CHRISTIAN', 'REPROVADO', NULL, 14),
(584, 'WALLACE CHRISTIAN', 'APROVADO', NULL, 15),
(585, 'WELDER ALVES DE ALMEIDA', 'APROVADO', NULL, 1),
(586, 'WELDER ALVES DE ALMEIDA', 'REPROVADO', NULL, 3),
(587, 'WELDER ALVES DE ALMEIDA', 'APROVADO', NULL, 14),
(588, 'WELDER ALVES DE ALMEIDA', 'APROVADO', NULL, 15);

-- --------------------------------------------------------

--
-- Estrutura para tabela `igrejas`
--

CREATE TABLE `igrejas` (
  `id` int(10) NOT NULL,
  `endereco` varchar(50) DEFAULT NULL,
  `igreja` varchar(50) DEFAULT NULL,
  `responsavel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `igrejas`
--

INSERT INTO `igrejas` (`id`, `endereco`, `igreja`, `responsavel`) VALUES
(1, 'Av. dos Ipês', 'SEDE', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `infocursos`
--

CREATE TABLE `infocursos` (
  `idCursos` int(10) NOT NULL,
  `nomeCursos` varchar(50) DEFAULT NULL,
  `tema` varchar(50) DEFAULT NULL,
  `data_` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Despejando dados para a tabela `infocursos`
--

INSERT INTO `infocursos` (`idCursos`, `nomeCursos`, `tema`, `data_`) VALUES
(1, 'ESCOLA DE PROFETA', 'HONRA', '2016-10-01'),
(2, 'ESCOLA DE PROFETA', 'GEOGRAFIA BÍBLICA', '2018-07-01'),
(3, 'ESCOLA DE PROFETA', 'SIMBOLOGIA E TIPOLOGIA', '2017-09-01'),
(4, 'ESCOLA DE PROFETA', 'MANUAL DE LIBERTAÇÃO', '2007-10-01'),
(5, 'ESCOLA DE PROFETA', 'TEOLOGIA', '2019-03-11'),
(6, 'ESCOLA DE PROFETA', 'O PREÇO DA LIDERANÇA', '2017-01-01'),
(7, 'ESCOLA DE PROFETA', 'PREGADOR EFICAZ', '2016-01-01'),
(8, 'ESCOLA DE PROFETA', 'HERESIOLOGIA', '2012-06-01'),
(9, 'ESCOLA DE PROFETA', 'LEALDADE E DESLEALDADE', '2011-09-01'),
(10, 'ESCOLA DE PROFETA', 'TRÊS CAMPOS DA BATALHA', '2011-04-01'),
(11, 'ESCOLA DE PROFETA', 'HISTÓRIA DA IGREJA', '2010-09-01'),
(12, 'ESCOLA DE PROFETA', 'HISTÓRIA DOS HEBREUS', '2013-04-01'),
(13, 'ESCOLA DE PROFETA', 'MÉTODOS DE ESTUDOS BÍBLICOS ', '2010-02-01'),
(14, 'ESCOLA DE PROFETA', 'OS SETES PECADOS AS SETE VIRTUDES ', '2017-03-01'),
(15, 'ESCOLA DE PROFETA', 'ESCATOLOGIA', '2018-03-01'),
(16, 'ESCOLA DE PROFETA', 'ANGELOLOGIA', '2009-01-01'),
(17, 'Escola de Profeta', 'As Cartas Paulinas', '2020-03-02');

-- --------------------------------------------------------

--
-- Estrutura para tabela `info_encontro`
--

CREATE TABLE `info_encontro` (
  `id` int(10) NOT NULL,
  `n_encontro` int(10) NOT NULL,
  `data_inicial` date NOT NULL,
  `tipo` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `info_encontro`
--

INSERT INTO `info_encontro` (`id`, `n_encontro`, `data_inicial`, `tipo`) VALUES
(1, 130, '2019-03-22', 'Encontro'),
(2, 134, '2019-05-24', 'Encontro'),
(3, 42, '2019-06-21', 'Reencontro'),
(4, 138, '2019-08-23', 'Encontro'),
(5, 2, '2019-09-21', 'Encontro de Casais'),
(6, 143, '2019-10-25', 'Encontro'),
(7, 44, '2019-11-22', 'Reencontro');

-- --------------------------------------------------------

--
-- Estrutura para tabela `info_reencontro`
--

CREATE TABLE `info_reencontro` (
  `id` int(10) NOT NULL,
  `n_reencontro` int(5) NOT NULL,
  `data_inicial` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `membros`
--

CREATE TABLE `membros` (
  `idmembros` int(10) NOT NULL,
  `nome` varchar(50) CHARACTER SET utf8 NOT NULL,
  `nasc` date DEFAULT NULL,
  `endereco` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `telefone` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `supervisao` varchar(25) CHARACTER SET utf8 DEFAULT NULL,
  `cargo` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `igreja` int(10) NOT NULL DEFAULT 1,
  `status` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `membros`
--

INSERT INTO `membros` (`idmembros`, `nome`, `nasc`, `endereco`, `telefone`, `supervisao`, `cargo`, `email`, `cadastro`, `igreja`, `status`) VALUES
(2, 'Ana Lucia Luz Orosco', '1973-07-14', 'rua Gupeva, 56 Vila Curuça', '(11) 98355-5651', 'Lika', 'Líder', 'analu.luz@hotmail.com', '2019-02-02 21:47:10', 1, 'ativo'),
(16, 'Jaqueline Tavares de Souza', '1981-09-20', 'rua Castanheira do Brejo, 136', '(11) 94829-7524', 'Jaqueline', 'Supervisor', 'jaquelinesouza_2006@hotmail.com', '2019-03-02 21:19:40', 1, 'ativo'),
(17, 'Laércio Carlos de Lima', '1956-02-02', 'Avenida Ipê Roxo 1339 Jardim Jaragua', '(11) 94179-4640', 'Pr. Laércio/Vera', 'Pastor', 'laerciomkids@hotmail.com', '2019-03-02 21:22:20', 1, 'ativo'),
(18, 'DANIEL MORSE', '1969-06-16', 'RUA ANTONIO JOÃO DE MEDEREIROS,465 BLOCO 3 APTO 23', '(11) 97203-2556', 'Todas', 'Bispo', 'prdanielmorse@gmail.com', '2019-03-02 21:23:51', 1, 'ativo'),
(20, 'TARCILA DOS SANTOS FONSECA', '1983-12-09', 'RUA CASTANHEIRO DO BREJO 322', '(11) 98510-0508', 'WAGUERSON', 'Líder', 'TTARCILA.9FONSECA@HOTMAIL.COM', '2019-03-11 12:13:18', 1, 'ativo'),
(21, 'Martim Ramalho Vieira', '1980-12-28', 'Rua : Folha Dourada ,92', '(11) 95984-9430', 'Martim/Shirley', 'Supervisor', 'martimramalhovieira@gmail.com', '2019-03-15 16:00:54', 1, 'ativo'),
(22, 'Shirley Viviane Vieira', '1982-08-05', 'Rua : Folha Dourada ,92', '(11) 98261-1344', 'Martim/Shirley', 'Supervisor', 'shirley.viviane5@yahoo.com.br', '2019-03-15 16:26:21', 1, 'ativo'),
(23, 'Mirtes Barbosa da Silva ', '1970-01-01', 'Avenida caraipe das águas, 1171', '(11) 95159-176', 'Mirtes', 'Supervisor', 'Mirtesbs@hotmail.com', '2019-03-15 18:14:25', 1, 'ativo'),
(24, 'Carine Reis Torres ', '1986-12-29', 'Palha brava 222', '(11) 98255-1613', 'Mirtes', 'Líder', 'carine29.reis@hotmail.com', '2019-03-15 20:29:53', 1, 'ativo'),
(25, 'Sandra louriene Marques da silva', '1970-01-01', 'Rua caminho quatro,306 bloco H ap 31 Guarulhos ', '(11) 98443-0359', 'Mirtes ', 'Anfitrião', '.lindinhas2@hotmail.com', '2019-03-15 21:07:19', 1, 'ativo'),
(26, 'EDNILSA DE ARAUJO GOMES', '1978-07-30', 'Rua Angelo Frazilio, 360', '(11) 97370-2874', 'Casais', 'Pastor', 'adm_progresso@hotmail.com', '2019-03-19 17:28:51', 1, 'ativo'),
(31, 'BRUNO DO NASCIMENTO OROSCO', '1987-03-29', 'RUA GUPEVA, 56 - VILA CURUÇA', '(11) 94071-4391', 'Lika', 'Líder', 'brunoorosco@gmail.com', '2019-03-19 23:37:30', 1, 'ativo'),
(32, 'Leonardo Mauriz de Oliveira', '1980-02-28', 'Rua Guiraro, 173 - Ap 04 Bl A', '(11) 99289-1969', 'Casais', 'Auxiliar', 'newcar@autocenternewcar.com.br', '2019-03-20 13:10:20', 1, 'ativo'),
(33, 'Luana Dias Bezerra', '1983-08-08', 'Rua Guiraro 173 - Apto 04 Bl A', '(11) 98809-1166', 'Casais', 'Auxiliar', 'luanadiasguma@yahoo.com', '2019-03-20 13:11:24', 1, 'ativo'),
(34, 'Renata Gabriela da Silva Ramalho', '1994-09-26', 'Rua Eurides Fernandes do Nascimento, 504', '(11) 95483-7305', 'Casais', 'Auxiliar', 'renatta.gabii@gmail.com', '2019-03-20 13:12:45', 1, 'ativo'),
(35, 'Diogo Juan Ramalho Santos', '1988-07-16', 'Rua Eurides Fernandes do Nascimento, 504', '(11) 95873-2032', 'Casais', 'Líder', 'diogo.juan2@gmail.com', '2019-03-20 13:14:07', 1, 'ativo'),
(36, 'Jessica Santos de Oliveira', '1989-10-14', 'Rua Francisca Marinque Guerra, 72', '(11) 94893-0021', 'Casais', 'Líder', 'jessica.santos.oliv@gmail.com', '2019-03-20 13:15:04', 1, 'ativo'),
(37, 'Felipe Salustiano Soares', '1991-05-23', 'Rua Francisca Mairinque Guerra, 72', '(11) 94862-3271', 'Casais', 'Líder', 'felipe_salustiano@hotmail.com', '2019-03-20 13:16:06', 1, 'ativo'),
(38, 'Priscila Graziele dos Santos Magalhaes', '1986-01-30', 'Rua Antonio Joao de Medeiros, 758 Bl E Apt 52', '(11) 95916-1667', 'Casais', 'Auxiliar', 'priscilgraziele3@gmail.com', '2019-03-20 13:17:19', 1, 'ativo'),
(39, 'Marco Antonio Claro de Souza', '1984-11-14', 'Rua Joao Antonio de Medeiros, 758 Bl E Ap 52', '(11) 96649-8779', 'Casais', 'Líder', 'marco@agenciaskn.com.br', '2019-03-20 13:18:45', 1, 'ativo'),
(40, 'Dener Santos Luz', '1981-07-22', 'Rua Matheus Barbosa de Resende, 85 B', '(11) 94796-7754', 'Casais', 'Auxiliar', 'denerluz22@gmail.com', '2019-03-20 13:19:42', 1, 'ativo'),
(41, 'Michelly Ribeiro Luz', '1990-04-20', 'Rua Matheus Barbosa de Resende, 85 B', '(11) 94796-8710', 'Casais', 'Auxiliar', 'michellyribeiroluz@gmail.com', '2019-03-20 13:20:38', 1, 'ativo'),
(42, 'Alexsandro da Silva Gomes', '1974-02-26', 'Rua Joao Antonio de Medeiros, 65 Bl 4 Ap 13', '(11) 98796-2870', 'Casais', 'Líder', 'alx10@live.com', '2019-03-20 13:21:32', 1, 'ativo'),
(43, 'Edivania Ferreira Gomes', '1968-11-27', 'Rua Joao Antonio de Medeiros, 465 Bl 4 Ap 13', '(11) 95282-2404', 'Casais', 'Auxiliar', 'vaninha.fgomes@gmail.com', '2019-03-20 13:23:03', 1, 'ativo'),
(44, 'Erica Silva Santos', '1983-05-21', 'Rua Caraipe das Aguas, 207', '(11) 96155-2509', 'Casais', 'Supervisor', 'ericass_30santos@hotmail.com', '2019-03-20 13:24:34', 1, 'ativo'),
(45, 'Fabio Alexandre Silva Santos', '1979-05-19', 'Rua Caraipe das Aguas, 207', '(11) 96559-4424', 'Casais', 'Supervisor', 'fabinhoduipe@hotmail.com', '2019-03-20 13:25:26', 1, 'ativo'),
(46, 'WAGUERSON DE OLIVEIRA', '1971-12-14', 'RUA ENGENHO VELHO 238', '(11) 97490-0408', 'WAGUERSON', 'Supervisor', 'waguerson.oliveira@gmail.com', '2019-03-29 15:30:47', 1, 'ativo'),
(47, 'LILIAN BRITO GOMES DOS SANTOS', '2000-11-15', 'RUA JACAREANA 9', '(11) 95431-5963', 'WAGUERSON', 'Auxiliar', 'LILIAN18H@OUTLOOK.COM', '2019-03-29 15:53:32', 1, 'ativo'),
(48, 'FERNANDA ANDREIA DE LIMA GODOI', '1980-08-01', 'AV GUABA 98 B', '(11) 98732-1006', 'WAGUERSON', 'Líder', 'FERNANDA.LIMAGODOY01@GMAIL.COM', '2019-03-29 16:17:45', 1, 'ativo'),
(49, 'RODRIGO DOS SANTOS GODOI', '1981-01-04', 'AV GUABA 98 B', '(11) 98732-1006', 'WAGUERSON', 'Líder', 'RODRIGO.GODOY04@GMAIL.COM', '2019-03-29 16:18:57', 1, 'ativo'),
(50, 'VICTOR DE SIQUEIRA MOREIRA', '2000-02-02', 'RUA BALEEIRA BRANCA 12', '(11) 98390-7496', 'WAGUERSON', 'Líder', 'VICTORMOREIRA6055@GMAIL.COM', '2019-03-29 16:24:30', 1, 'ativo'),
(51, 'DANIELA DOS SANTOS TARDIOLLE', '1999-07-06', 'RUA PALMEIRA DAS BERMUDAS 1.374', '(11) 98390-7496', 'WAGUERSON', 'Auxiliar', 'PEDANIMA@GMAIL.COM', '2019-03-29 17:28:53', 1, 'ativo'),
(52, 'APARECIDA MARIA LUCIANO', '1970-01-01', 'RUA CAFE DO BRASIL 98', '(11) 98673-1380', 'WAGUERSON', 'Auxiliar', 'CIDA.LUCIANO59@HOTMAIL.COM', '2019-03-30 18:58:16', 1, 'ativo'),
(53, 'CARLA CRISTINA DOS SANTOS', '1970-01-01', 'RUA ANTENAS 52', '(11) 98286-5042', 'WAGUERSON', 'Auxiliar', 'CARLA_CRISTINASB@HOTMAIL.COM', '2019-03-30 18:59:48', 1, 'ativo'),
(54, 'ROSINEIDE TEREZINHA DE ANDRADE ', '1971-07-10', 'RUA JOÃO MESQUITA 33', '(11) 95983-6811', 'WAGUERSON', 'Auxiliar', 'ROSINEIDETEREZINHA10@GMAIL.COM', '2019-03-30 19:04:07', 1, 'ativo'),
(55, 'DAVID NUNES DOS SANTOS ', '1972-01-25', 'RUA JOÃO MESQUITA 33', '(11) 95983-6811', 'WAGUERSON', 'Auxiliar', 'DAVIDNUNESRDS@GMAIL.COM', '2019-03-30 19:05:15', 1, 'ativo'),
(56, 'JESSICA RODRIGUES DA SILVA ', '1970-01-01', 'RUA PALMEIRA DAS BERMUDAS 605', '(11) 97968-7888', 'WAGUERSON', 'Líder', 'JE.RODRIGUES.SILVA@HOTMAIL.COM', '2019-03-30 19:09:27', 1, 'ativo'),
(57, 'WALLACE CHRISTIAN M. DA SILVA ALVES ', '1998-08-01', 'RUA MÃE D\'AGUA 66', '(11) 97954-7741', 'WAGUERSON', 'Líder', 'WALLACECHRISTIAN35@GMAIL.COM', '2019-03-30 19:12:28', 1, 'ativo'),
(58, 'JAQUELINE DOS SANTOS OLIVEIRA', '1985-04-13', 'RUA MARIO MASINE 238', '(11) 95457-8026', 'WAGUERSON', 'Auxiliar', 'JAQUE1385@GMAIL.COM', '2019-03-30 19:17:00', 1, 'ativo'),
(59, 'LEANDRO RAMALHO NEIVA', '1987-12-26', 'RUA OSORIO FRANCO VILHENA 984', '(11) 95457-8026', 'WAGUERSON', 'Auxiliar', 'LEANDRORAMALHO8726@GMAIL.COM', '2019-03-30 19:19:12', 1, 'ativo'),
(60, 'RICARDO PINTO DE MORAES', '1976-12-26', 'RUA CASTANHEIRO DO BREJO 322', '(11) 98510-0508', 'WAGUERSON', 'Líder', 'RICARDOKAIKEKAUE@GMAIL.COM', '2019-03-30 19:34:33', 1, 'ativo'),
(61, 'ANA PAULA APARECIDA DA SILVA GODOI', '1988-06-09', 'RUA GUIRARO 331', '(11) 94958-5014', 'WAGUERSON', 'Auxiliar', 'ANAPAULA1_LINDA_GATINHA@HOTMAIL.COM', '2019-03-30 19:36:52', 1, 'ativo'),
(62, 'BRUNA CAROLINY DE SOUZA ', '1994-06-17', 'RUA DARCI MANO 213', '(11) 96070-9329', 'WAGUERSON', 'Líder', 'BCAROLINY1994@HOTMAIL.COM', '2019-03-30 19:48:17', 1, 'ativo'),
(63, 'MARIA LUIZA SABINO ', '1997-04-17', 'RUA MORRO DA BABILONIA 91', '(11) 96337-4497', 'WAGUERSON', 'Líder', 'MARIALUIZASABINO05@GMAIL.COM', '2019-03-30 19:54:34', 1, 'ativo'),
(64, 'KEVIN LEOPOLDINO KAMIA', '1996-08-01', 'RUA MORRO DA BABILONIA 91', '(11) 96337-4497', 'WAGUERSON', 'Auxiliar', 'KEVINHO_KLK@GMAIL.COM', '2019-03-30 19:56:18', 1, 'ativo'),
(65, 'DANIELA BATISTA LIRA', '1985-07-15', 'RUA CANTIDIANO GUIMARÃES 13', '(11) 96217-1001', 'WAGUERSON', 'Auxiliar', 'DANIELABATISTALIRA@GMAIL.COM', '2019-03-30 19:59:27', 1, 'ativo'),
(66, 'LETICIA MONTEIRO DA SILVA ', '1982-08-25', 'RUA BALEEIRA BRANCA 116', '(11) 98837-9936', 'WAGUERSON', 'Líder', 'S2LETICIA.SILVAS2@GMAIL.COM', '2019-04-01 16:20:58', 1, 'ativo'),
(67, 'SIMONE MARIANO DA SILVA ', '1973-06-28', 'RUA MÃE D´AGUA 66', '(11) 94960-8941', 'WAGUERSON', 'Líder', 'MARIANOSSIMONE@GMAIL.COM', '2019-04-01 16:23:46', 1, 'ativo'),
(68, 'MARIAH EDUARDA FERREIRA GOMES ', '2001-06-19', 'RUA ANTONIO JOÃO DE MEDEIROS 465', '(11) 94895-7737', 'WAGUERSON', 'Líder', 'MARIAH.EFGOMES@GMAIL.COM', '2019-04-01 16:28:40', 1, 'ativo'),
(69, 'GABRIEL BARUCH FERREIRA GOMES ', '2003-12-26', 'RUA ANTONIO JOÃO DE MEDEIROS 465', '(11) 94895-7737', 'WAGUERSON', 'Auxiliar', 'BARUCH.FERREIRA@GMAIL.COM', '2019-04-01 16:29:35', 1, 'ativo'),
(70, 'GUILHERME DA SILVA NASCIEMNTO', '2003-05-20', 'RUA BALIEIRA BRANCA 116', '(11) 99233-8082', 'WAGUERSON', 'Líder', 'GUILHERME29051996@GMAIL.COM', '2019-04-01 18:09:52', 1, 'ativo'),
(71, 'JOÃO SEVERINO DE SOUZA ', '1965-08-20', 'AV ALVARO DOS SANTOS MATOS 157', '(11) 97968-9629', 'WAGUERSON', 'Líder', 'JOAOSBOY@YAHOO.COM.BR', '2019-04-01 18:36:37', 1, 'ativo'),
(72, 'ADRIANA A. DE LIMA SOUZA', '1972-10-16', 'AV ALVARO DOS SANTOS MATOS 157', '(11) 97968-9629', 'WAGUERSON', 'Auxiliar', 'LIMA.DRI@YAHOO.COM.BR', '2019-04-01 18:49:21', 1, 'ativo'),
(76, 'ELIANA ALVES PEQUENO', '1968-07-07', 'R. Caraipes das Águas, 1816', '(11) 97381-9825', 'Lika', 'Supervisor', 'elianalikapequeno@gmail.com', '2019-04-04 23:20:20', 1, 'ativo'),
(77, 'Supervisão Teste', '1981-12-09', 'Rua sem nome', '(11) 98989-8998', 'Luizinho/Clarice', 'Supervisor', 'bia.clarice@yahoo.com.br', '2019-04-04 23:35:32', 1, 'ativo'),
(79, 'Marcus Vinicius Otoni de Morais', '1993-09-22', 'rua do pombo correio n 290', '(11) 98528-0170', 'Valdirene', 'Líder', 'marcus_otto@hotmail.com', '2019-04-04 23:43:31', 1, 'ativo'),
(80, 'CLÁUDIO DA SILVA GOMES', '1975-07-19', 'Rua Ângelo Frazilio 360', '(11) 99710-9359', 'Casais', 'Pastor', 'rafa_gomes19@yahoo.com.br', '2019-04-04 23:46:21', 1, 'ativo'),
(81, 'Valdirene Oliveira Bispo dos Santos', '1969-02-25', 'rua faveira do igapo 274 fds', '(11) 97961-6246', 'Valdirene', 'Supervisor', 'valdireneclamor@yahoo.com.br', '2019-04-04 23:47:21', 1, 'ativo'),
(82, 'FABIO FRANCISCO', '1970-01-01', 'Rua Congonha do Sertao n 52', '(11) 99299-8995', 'Fabio/Sandra', 'Supervisor', 'franciscofabio705@hotmail.com', '2019-04-04 23:54:26', 1, 'ativo'),
(83, 'SANDRA  DANTAS SIQUEIRA FRANCISCO', '1971-10-03', 'Rua Congonha do Sertao n 52', '(11) 95861-8250', 'Fabio/Sandra', 'Supervisor', 'sandradantassiqueirafrancisco0@gmail.com', '2019-04-04 23:57:42', 1, 'ativo'),
(84, 'LUCAS ORSI', '1994-07-27', 'R. Caraipes das Águas, 1816', '(11) 98655-5716', 'Lika', 'Líder', 'lucasorsi95@gmail.com', '2019-04-05 00:05:20', 1, 'ativo'),
(85, 'Francildo Silva de Oliveira', '1968-02-23', 'av ipe roxo 1704', '(11) 97961-2622', 'Zô', 'Supervisor', 'francildo68f@gmail.com', '2019-04-05 00:10:37', 1, 'ativo'),
(86, 'Willian da Cunha Leao', '1984-02-28', 'rua ilha dos ratones 35', '(11) 94243-8311', 'Willian/Sumaria', 'Supervisor', 'willian.uei@hotmail.com', '2019-04-05 00:15:44', 1, 'ativo'),
(87, 'SUMARIA ALMEIDA LEAO', '1981-02-10', 'rua ilha dos ratones 35', '(11) 99332-1325', 'Willian/Sumaria', 'Supervisor', 'sumariacunha@hotmail.com', '2019-04-05 00:19:16', 1, 'ativo'),
(88, 'Eliane de Oliveira Cunha', '1979-07-06', 'Rua Agrimensor Sugaya 551 Ap 33 Bl-B', '(11) 97256-0467', 'Pr. Marcos/Eliane', 'Pastor', 'eliane.filo@bol.com.br', '2019-04-05 00:22:56', 1, 'ativo'),
(89, 'Marcos Silva da Cunha', '1974-12-20', 'Rua Agrimensor Sugaya 551 AP 33 BL -B', '(11) 97256-0467', 'Pr. Marcos/Eliane', 'Pastor', 'kakocunha48@gmail.com', '2019-04-05 00:25:30', 1, 'ativo'),
(90, 'ANDERSON ALVES DOS SANTOS', '1984-01-27', 'Rua Arnaldo Cintra, 190', '(11) 99887-9336', 'Pr. Anderson', 'Pastor', 'anderson.alves777@gmail.com', '2019-04-05 00:31:03', 1, 'ativo'),
(92, 'WAGNER WILLIAM ANDRADE DE MATOS', '1977-03-07', 'r. arvore de umbela, n. 143', '(11) 96393-6297', 'Prs Wagner/Rosana', 'Pastor', 'aguia.bilhares@yahoo.com.br', '2019-04-05 00:36:17', 1, 'ativo'),
(93, 'ROSANA MIRANDA DA SILVA MATOS', '1967-05-28', 'r. arvore de umbela, n. 143', '(11) 96393-6297', 'Prs Wagner/Rosana', 'Pastor', 'aguia.bilhares@yahoo.com.br', '2019-04-05 00:38:21', 1, 'ativo'),
(94, 'RITA DE CASSIA RIBEIRO', '1966-09-19', 'R MACAUBA MIRIM 233 ', '(11) 98225-8516', 'RITA', 'Supervisor', 'RI.AVIVAC@HOTMAIL.COM', '2019-04-05 00:49:41', 1, 'ativo'),
(95, 'Kelly Cristina Leopoldino kamiya', '1976-05-15', 'Rua morro da Babilônia 91', '(11) 91371-684', 'Kids', 'Supervisor', 'kelly.naoesquecerasenha@gmail.com', '2019-04-06 00:58:55', 1, 'ativo'),
(97, 'GISELLY RAMOS FERREIRA', '1993-08-03', 'RUA PROFESSOR ANTONIO DE CASTRO LOPES,517', '(11) 95488-0862', 'Zô', 'Líder', 'gisellygihrf@gmail.com', '2019-04-18 14:58:48', 1, 'ativo'),
(98, 'ALEX PEREIRA DE OLIVEIRA', '1988-10-03', 'RUA PROFESSOR ANTONIO DE CASTRO LOPES,517', '(11) 97754-7616', 'Zô', 'Líder', 'alexpereiradeoliveira88@hotmail.com', '2019-04-18 15:00:22', 1, 'ativo'),
(99, 'KAUE HENRIQUE RAMOS DE OLIVEIRA', '2010-06-08', 'RUA PROFESSOR ANTONIO DE CASTRO LOPES,517', '(11) 95488-0862', 'Zô', 'Membro', 'kauehrdeoliveira@gmail.com', '2019-04-18 15:06:08', 1, 'ativo'),
(100, 'ELIANE CRISTINA DE NEGREIROS OLIVEIRA ', '1979-11-09', 'RUA ITAJUIBE,2447 BLOCO D APTO 42', '(11) 99139-2889', 'Zô', 'Membro', 'eliane_negreiros@hotmail.com', '2019-04-18 16:44:47', 1, 'ativo'),
(101, 'ROSANGELA MARIA PEREIRA DIAS', '1982-05-03', 'RUA POMBO CORREIO,11', '(11) 95998-2396', 'Zô', 'Líder', 'rosangelamaria-03@hotmail.com', '2019-04-18 17:10:59', 1, 'ativo'),
(102, 'RUBENS SOUZA MAIA ', '1978-05-29', 'RUA DO POMBO CORREIO,11', '(11) 95497-3126', 'Zô', 'Líder', 'rosariaequipamentos@hotmail.com', '2019-04-18 17:13:37', 1, 'ativo'),
(103, 'WILSON PEREIRA DE OLIVEIRA ', '1986-06-25', 'RUA JOSE ALEXANDRE MACHADO,552', '(11) 98309-7687', 'Zô', 'Líder', 'wil.son25@hotmail.com', '2019-04-18 17:15:33', 1, 'ativo'),
(104, 'ESTER PEREIRA DE SOUZA DIAS', '2011-01-25', 'RUA DO POMBO CORREIO,11', '(11) 95998-2396', 'Zô', 'Membro', 'bekinha2029@gmail.com', '2019-04-18 17:17:46', 1, 'ativo'),
(105, 'RAFAELA PEREIRA DE OLIVEIRA ', '2015-06-25', 'RUA JOSE ALEXANDRE MACHADO 552', '(11) 98309-7687', 'Zô', 'Membro', 'rfamodel@gmail.com', '2019-04-18 17:19:40', 1, 'ativo'),
(106, 'GRACE KELLY LEILA DE OLIVEIRA', '1989-06-12', 'RUA JOSE ALEXANDRE MACHADO,552', '(11) 98330-6371', 'Zô', 'Líder', 'gklo1225@gmail.com', '2019-04-18 17:22:01', 1, 'ativo'),
(107, 'DENISE RIBEIRO DE JESUS LEITE', '1988-06-08', 'RUA FRANCISCA MANRIQUE GUERRA,394', '(11) 95985-9404', 'Zô', 'Líder', 'deniseribeiro88@gmail.com', '2019-04-18 17:24:26', 1, 'ativo'),
(108, 'SUELI RIBEIRO GARCIA', '1978-10-16', 'RUA CARAIPE DAS AGUAS ,872', '(11) 99913-3626', 'Zô', 'Líder', 'suelirs.garcia@gmail.com', '2019-04-18 17:26:31', 1, 'ativo'),
(109, 'GUSTAVO RIKELMY RIBEIRO VIEIRA ', '2003-09-01', 'RUA CARAIPE DAS AGUAS ,872', '(11) 99913-3626', 'Zô', 'Auxiliar', 'gu.rikelmy@hotmail.com', '2019-04-18 17:28:23', 1, 'ativo'),
(110, 'ELISÂNGELA SANTOS DE OLIVEIRA ', '1989-12-14', 'RUA PEROBA ROSA,303', '(11) 95114-0756', 'Zô', 'Líder', 'elisangelaso@gmail.com', '2019-04-18 17:31:01', 1, 'ativo'),
(111, 'SIMONE RIBEIRO DA SILVA ', '1977-09-17', 'RUA CARAIPE DAS AGUAS ,887', '(11) 95844-5785', 'Zô', 'Auxiliar', 'somoneribeiro@gmail.com', '2019-04-18 17:32:32', 1, 'ativo'),
(112, 'STEPHANIE RODRIGUES SANTOS RAMALHO', '1992-12-07', 'RUA CAFE BRASIL,71', '(11) 95954-6723', 'Zô', 'Líder', 'teca_ag@hotmail.com', '2019-04-18 17:35:16', 1, 'ativo'),
(113, 'ROGERIO OLIVEIRA DOS SANTOS', '1977-08-17', 'RUA ISABEL MORALES DE OLIVEIRA,476', '(11) 98544-5758', 'Zô', 'Auxiliar', 'rogerio.oliveirasantos@hotmail.com', '2019-04-18 17:37:29', 1, 'ativo'),
(114, 'ANDREIA PEREIRA FLORINDO', '1972-06-04', 'RUA LOURENÇO DA VEIGA,161', '(11) 98475-5875', 'Zô', 'Líder', 'andreia.florindo234@hotmail.com', '2019-04-18 17:39:25', 1, 'ativo'),
(115, 'TAYNA RIBEIRO DE OLIVEIRA ', '2002-09-17', 'RUA CARAIPE DAS AGUAS ,887', '(11) 95876-2548', 'Zô', 'Membro', 'taynaribeiro234@gmail.com', '2019-04-18 17:41:16', 1, 'ativo'),
(116, 'ALEDXSSANDER DE OLIVEIRA ', '1979-01-17', 'RUA BELISARIO BENITEZ, 276', '(11) 96986-5874', 'Zô', 'Líder', 'alexssanderabencoado@hotmail.com', '2019-04-18 17:44:30', 1, 'ativo'),
(117, 'LAIS ALVEZ ', '1986-11-14', 'AVENIDA PAPA JOAO PAULO1,4020', '(11) 95875-4862', 'Zô', 'Membro', 'lais.mayumi1@gmail.com', '2019-04-18 17:46:09', 1, 'ativo'),
(118, 'MARIA CRISTINA RIBEIRO DE OLIVEIRA', '1973-07-13', 'RUA BELISARIO BENITEZ, 276', '(11) 94578-5265', 'Zô', 'Líder', 'mcristinaoliveira@hotmail.com', '2019-04-18 17:47:19', 1, 'ativo'),
(119, 'JULIA RIBEIRO SOUZA ', '2005-09-12', 'RUA BELISARIO BENITEZ, 276', '(11) 95428-6808', 'Zô', 'Auxiliar', 'juliaju1209@hotmail.com', '2019-04-18 18:20:48', 1, 'ativo'),
(120, 'PAULO SANTOS DE OLIVEIRA', '2013-07-08', 'RUA PEROBA ROSA,303', '(11) 95848-7528', 'Zô', 'Membro', 'paulosantos@gmail.com', '2019-04-18 18:21:57', 1, 'ativo'),
(121, 'PEDRO SANTOS DE OLIVEIRA ', '2013-07-08', 'RUA PEROBA ROSA,303', '(11) 98548-7512', 'Zô', 'Membro', 'pedrosantos@gmail.com', '2019-04-18 18:22:48', 1, 'ativo'),
(122, 'GLAIDE SANTOS PONTE SALVATO', '1982-01-26', 'RUA JOSIMAR CERQUEIRA,22', '(11) 96582-4587', 'Zô', 'Auxiliar', 'gsps@gmail.com', '2019-04-18 18:25:36', 1, 'ativo'),
(123, 'MAGAIVER LEITE RIBEIRO', '1986-11-27', 'RUA FRANCISCA MARINQUE GUERRA, 594', '(11) 99958-6485', 'Zô', 'Auxiliar', 'magaiverleite1770@gmail.com', '2019-04-18 18:27:39', 1, 'ativo'),
(124, 'ELAINE CRISTINA DE NEGREIROS OLIVEIRA ', '1979-11-09', 'RUA ITAJUIBE,2447 BLOCO D APTO 42', '(11) 99139-2889', 'Zô', 'Membro', 'elaine_negreiros@hotmail.com', '2019-04-18 18:28:18', 1, 'ativo'),
(125, 'ELIANE SOARES DOS SANTOS ', '1969-04-26', 'RUA KAMPALA PENHA,55', '(11) 98548-7548', 'Zô', 'Líder', 'eliane.soares@hotmail.com', '2019-04-18 18:30:55', 1, 'ativo'),
(126, 'JENIFFER CASTRO DOS SANTOS', '2005-05-17', 'RUA KAMPALA PENHA,55', '(11) 96585-4852', 'Zô', 'Membro', 'jenicastro@gmail.com', '2019-04-18 18:32:49', 1, 'ativo'),
(127, 'EMILI CASTRO DOS SANTOS ', '2005-05-17', 'RUA KAMPALA PENHA,55', '(11) 95845-7552', 'Zô', 'Membro', 'EMICASTRO@GMAIL.COM', '2019-04-18 18:34:32', 1, 'ativo'),
(128, 'ELENILSON SANTOS', '1995-12-02', 'RUA KAMPALA,55', '(11) 98854-8752', 'Zô', 'Membro', 'ELENILSOONST@HOTMAIL.COM', '2019-04-18 18:35:50', 1, 'ativo'),
(129, 'ELIELSOM SANTOS', '1995-12-25', 'RUA KAMPALA,55', '(11) 98852-5457', 'Zô', 'Membro', 'ELISANTOS@HOTMAIL.COM', '2019-04-18 18:37:30', 1, 'ativo'),
(130, 'FERNANDO FELIS DA SILVA', '1978-02-03', 'RUA OSORIO FRANCO VILHEMA,953', '(11) 95625-8754', 'Zô', 'Auxiliar', 'FERNANDOFELIS38@GMAL.COM', '2019-04-18 18:39:40', 1, 'ativo'),
(131, 'ANA DINA SANTOS DE NEGREIROS', '1953-02-21', 'RUA JOSE ELEUTERIO DOS SANTOS ,252', '(11) 98548-7224', 'Zô', 'Líder', 'ANADINANEGREIROS@GMAIL.COM', '2019-04-18 18:41:19', 1, 'ativo'),
(132, 'KATY GARCIA ', '1995-01-21', 'RUA JARDIM DAS MARGARIDAS,272', '(11) 98623-5478', 'Zô', 'Auxiliar', 'KATY-MARGARIDA@HOTMAIL.COM', '2019-04-18 18:42:56', 1, 'ativo'),
(133, 'AGATHA RODRIGUES SILVA', '2006-02-03', 'RUA CAFE BRASIL,71', '(11) 95648-8802', 'Zô', 'Membro', 'agathas@gmail.com', '2019-04-18 18:44:43', 1, 'ativo'),
(134, 'GUILHERME HENRIQUE RODRIGUES SILVA', '2009-09-12', 'RUA CAFE BRASIL ,71', '(11) 95458-2457', 'Zô', 'Membro', 'gui.henrique@gmil.com', '2019-04-18 18:46:24', 1, 'ativo'),
(135, 'MARIO LUIZ DOS SANTOS RAMALHO RODRIGUES', '1988-10-31', 'RUA CAFE BRASIL.71', '(11) 98956-2873', 'Zô', 'Líder', 'marioramalho@icloud.com', '2019-04-18 18:47:45', 1, 'ativo'),
(136, 'PAMELA APARECIDA PIARETI DE NEGREIROS', '1989-12-05', 'RUA JOSE ELEUTERIO DOS SANTOS,252', '(11) 97754-8254', 'Zô', 'Líder', 'piaretipamela@gmail.com', '2019-04-18 18:49:54', 1, 'ativo'),
(137, 'RODRIGO HENRIQUE DE NEGREIROS ', '1986-01-29', 'RUA JOSE ELEUTERIO DOS SANTOS,252', '(11) 95482-6574', 'Zô', 'Líder', 'rodrigohnegreiros@yahoo.com.br', '2019-04-18 18:51:42', 1, 'ativo'),
(138, 'SUÉLEN ALMEIDA SANTOS', '1993-11-25', 'RUA BORBOLETA AMARELA,210 JD HELENA', '(11) 94875-5105', 'Valdirene', 'Membro', 'suelen.25.santos@gmail.com', '2019-04-20 01:50:51', 1, 'ativo'),
(139, 'VINICIUS DE ASSIS SOUZA', '2003-08-01', 'RUA PROFESSOR ASSIS VELOSO,SÃO MIGUEL', '(11) 95148-8145', 'Valdirene', 'Membro', 'vini.souza.2014@hotmail.com', '2019-04-20 02:15:13', 1, 'ativo'),
(140, 'DIEGO AUGUSTO DE SOUZA', '1992-02-26', 'RUA AMORA,JD IPE', '(11) 98867-3248', 'Valdirene', 'Membro', 'diegoaugustosouza18@gmail.com', '2019-04-20 02:31:01', 1, 'ativo'),
(141, 'ANDREONE FELIPE FONSECA', '1994-05-17', 'RUA CRESCENTE,295 JD BARTIRA', '(11) 95444-6656', 'Valdirene', 'Membro', 'andreonefonseca@outlook.com', '2019-04-20 02:33:24', 1, 'ativo'),
(142, 'LUCIMAR LOURDES DE MORAIS', '1959-09-02', 'RUA DO POMBO CORREIO,290 JD IPE', '(11) 95913-5582', 'Valdirene', 'Líder', 'lucmarl.morais@hotmail.com', '2019-04-20 02:51:15', 1, 'ativo'),
(143, 'SABRINA SOUZA DE OLIVEIRA', '1999-12-17', 'RUA DUILIO LERNADUZZI,448 VL PARANAGUÁ', '(11) 95068-4703', 'Valdirene', 'Líder', 'sabrina.souza00@outlook.com', '2019-04-20 02:53:53', 1, 'ativo'),
(144, 'ANDERSON OLIVEIRA BISPO DOS SANTOS', '1999-03-21', 'RUA FAVEIRA DO IGAPO 274 JD IPE', '(11) 95454-4210', 'Valdirene', 'Líder', 'aobs_2010@hotmail.com', '2019-04-20 02:56:19', 1, 'ativo'),
(145, 'CLÉCIOMARCIO FRANCISCO DA SILVA', '1998-08-02', 'RUA OLIVIA COELHO MARTINS,447 JD MAIA', '(11) 95253-0407', 'Valdirene', 'Líder', 'cleciomarcio.junior@outlook.com', '2019-04-20 03:00:25', 1, 'ativo'),
(146, 'JOYCE GABRIELA CARVALHO RIBEIRO', '2007-02-02', 'PALMEIRA DAS BERMUDAS JD IPE', '(11) 96874-4101', 'Valdirene', 'Auxiliar', 'lucianaribeiroosilva@gmail.com', '2019-04-20 03:12:50', 1, 'ativo'),
(147, 'LUSIMAR MARIA SILVA', '1957-10-15', 'RUA PALMEIRA DAS BERMUDAS 826,JD IPE', '(11) 94680-6729', 'Valdirene', 'Auxiliar', 'lusimarmaria1957@hotmail.com', '2019-04-20 03:16:26', 1, 'ativo'),
(148, 'GUSTAVO  HENRIQUE CARVALHO RIBEIRO', '2007-02-02', 'RUA PALMEIRA DAS BERMUDAS 826 JD IPE', '(11) 94680-6729', 'Valdirene', 'Auxiliar', 'lucianaribeiroosilva@gmail', '2019-04-20 03:20:04', 1, 'ativo'),
(149, 'GABRIELE OLIVEIRA BISPO DOS SANTOS', '2004-03-17', 'RUA FAVEIRA DO IGAPO 274 JD IPE', '(11) 98535-0217', 'Valdirene', 'Auxiliar', 'gabirene2004@gmail.com', '2019-04-20 03:23:28', 1, 'ativo'),
(151, 'GELSON BISPO DOS SANTOS', '1993-04-10', 'AV.MARECHAL TITO 3097 ITAIM PTA', '(11) 95968-5362', 'Valdirene', 'Líder', '', '2019-04-23 15:05:56', 1, 'ativo'),
(152, 'RINALDO LORASQUE ', '1968-04-07', 'AV IGARAPES 1285 JD IPE', '(11) 98240-2702', 'Valdirene', 'Líder', 'Rinaldolorasque@bendsteel.com.br', '2019-04-24 02:29:19', 1, 'ativo'),
(153, 'teste edicao', '1970-01-01', 'teste teste', '(11)12344-4444', 'Lika', 'Supervisor', 'supervisor@supervisor', '2019-05-02 15:49:26', 1, 'ativo'),
(154, 'THAUANE MELISSA COSTA MOREIRA', '1995-03-28', 'SERAFINA D \'ABRIL,61', '(11) 98700-2145', 'Quatro Seres', 'Líder', 'thauane.melissa@gmail.com', '2019-05-11 00:51:39', 1, 'ativo'),
(155, 'COSME DE JESUS JUNIOR', '1993-01-20', 'Jose Martins Lisboa 2168', '(11) 96463-8498', 'Lika', 'Membro', 'cosmedejesusjunior93@gmail.com', '2019-05-14 02:00:20', 1, 'ativo'),
(156, 'CLEICE ALVES DA SILVA ', '1980-03-02', 'AV. DOS IPÊS 1376', '(11) 98450-2913', 'Lika', 'Líder', 'cleicealsilvaped@hotmail.com', '2019-05-14 02:21:39', 1, 'ativo'),
(157, 'ALBENIZE MELO', '1974-02-19', 'AV JOSÉ MARTINS LISBOA 2179', '(11) 96545-0812', 'Lika', 'Auxiliar', 'Melo.albenize@hotmail.com', '2019-05-14 02:29:58', 1, 'ativo'),
(158, 'ROBERTO BORGES BONFIM ', '1981-05-05', 'Jequirana de goias 515  ', '(11) 96452-2132', 'Lika', 'Membro', 'Robertbborges@81.com.br', '2019-05-14 02:55:03', 1, 'ativo'),
(159, 'ROQUE THOME DE OLIVEIRA', '1960-03-08', 'RUA ARICANGA 1252', '(11) 96693-4040', 'Lika', 'Auxiliar', 'lucasorsi@live.com', '2019-05-14 02:58:25', 1, 'ativo'),
(160, 'IVANILDE SILVA SANTOS DE OLIVEIRA', '1964-08-03', 'RUA ARICANGA 1252', '(11) 97778-6674', 'Lika', 'Auxiliar', 'lucasorsi1@live.com', '2019-05-14 03:00:29', 1, 'ativo'),
(161, 'GABRIELA EDUARDA GOMES DE SOUZA', '1993-09-01', 'RUA ROSA MUSGO, 25 A', '(11) 98151-4877', 'Lika', 'Auxiliar', 'gabriela.gsbio@gmail.com', '2019-05-14 03:33:18', 1, 'ativo'),
(162, 'ÂNGELA MUZEL DA SILVA   ', '1961-12-22', 'Antônio cação 58 ', '(11) 94893-3703', 'Lika', 'Auxiliar', 'lucasorsi2@live.com', '2019-05-14 03:37:27', 1, 'ativo'),
(163, 'MARIELE CHAGAS DA SILVA', '1986-09-02', 'MELCHIADES NERES DE CAMPOS 120', '(11) 94981-0992', 'Lika', 'Líder', 'marielichagasdasilvabela@gmil.com', '2019-05-14 03:41:55', 1, 'ativo'),
(164, 'Marcos Antônio da Silva', '1981-04-29', 'Melchiades Neres de Campos 120', '(11) 96149-6037', 'Lika', 'Líder', 'marielichagasdasilvabela2@gmil.com', '2019-05-14 03:46:10', 1, 'ativo'),
(165, 'Camily Janaina Chagas da Silva', '2003-07-15', 'Melchiades Neres de Campos 120', '(11) 96973-7840', 'Lika', 'Auxiliar', 'marielichagasdasilvabela3@gmil.com', '2019-05-14 03:49:52', 1, 'ativo'),
(166, 'VANESSA CRISTINA DA SILVA ', '1970-01-01', 'RUA ANTÔNIO CAÇÃO 85', '(11) 95467-8626', 'Lika', 'Membro', 'NESSA.PITTY68@GMAIL.COM', '2019-05-14 14:06:26', 1, 'ativo'),
(167, 'ADRIANA ALBUQUERQUE DE LIMA', '1978-03-31', 'Rua', '(11) 98543-2751', 'Lika', 'Auxiliar', 'dribruna@hotmail.com', '2019-05-14 14:08:28', 1, 'ativo'),
(168, 'SHEILA DA SILVA HENRIQUE', '1981-05-18', 'RUA ANTÔNIO CAÇÃO 85', '(11) 95986-9437', 'Lika', 'Auxiliar', 'Sheila.henrique@atento.com.br', '2019-05-14 14:10:14', 1, 'ativo'),
(169, 'LEANDRO BATISTA DA SILVA', '1983-09-07', 'Palmeira das bermudas 128 ', '(11) 98153-3432', 'Lika', 'Líder', NULL, '2019-05-14 14:38:29', 1, 'ativo'),
(172, 'TAMAR PEREIRA DANTAS DE LIMA', '1985-09-22', 'Rua Folha Dourada 62', '(11) 98736-2088', 'Lika', 'Líder', 'tamar.pereira@yahoo.com.br', '2019-05-14 15:12:50', 1, 'ativo'),
(173, 'FELIPE ZWIR', '1988-01-08', 'RUA GUAIUVIRA 121', '(11) 96258-8075', 'Lika', 'Membro', 'felipezwir@hotmail.com', '2019-05-14 16:39:00', 1, 'ativo'),
(174, 'BRUNA RODRIGUES DOS SANTOS', '1992-03-05', 'RUA PARAITINGA 336', '(11) 95828-6450', 'Valdirene', 'Líder', 'BRUNABILLY_@HOTMAIL.COM', '2019-05-14 16:41:14', 1, 'ativo'),
(175, 'CHRISTOPHER BATISTA DOS SANTOS ', '1992-03-19', 'RUA PARAITINGA 336', '(11) 98632-6089', 'Valdirene', 'Líder', 'lucasorsi1@gmail.com', '2019-05-14 16:43:43', 1, 'ativo'),
(176, 'TATIANE OLIVEIRA SILVA ', '1981-04-18', 'RUA NOTURNO MINEIRO 22', '(11) 97211-3352', 'Lika', 'Líder', 'TATIA_NENE@HOTMAIL.COM', '2019-05-14 16:46:41', 1, 'ativo'),
(177, 'CARLOS EDUARDO RODRIGUES XAVIER ', '1987-07-14', 'RUA NOTURNO MINEIRO 22', '(11) 99981-1767', 'Lika', 'Membro', 'CEDUARDU@HOTMAIL.COM', '2019-05-14 16:53:00', 1, 'ativo'),
(178, 'CARMEM LUCIA S. FARIAS', '1964-04-19', 'DIAS DE ÁVILA 10', '(11) 98987-6612', 'Prs. Bete/Julho', 'Líder', 'carmem.s.farias@hotmail.com', '2019-05-14 19:08:24', 1, 'ativo'),
(179, 'JOSÉ  MARCOS DE OLIVEIRA FARIAS', '1964-01-25', 'DIAS DE ÁVILA 10', '(11) 98160-9159', 'Prs. Bete/Julho', 'Líder', 'j.marcos64@Outlook.com', '2019-05-14 19:10:29', 1, 'ativo'),
(180, 'MARIA DAS DORES SILVA ', '1976-07-22', 'PALMEIRAS DAS BERMUDAS 128', '(11) 97803-3550', 'Lika', 'Membro', 'naotememail@gmail.com', '2019-05-14 19:18:04', 1, 'ativo'),
(181, 'RODRIGO SILVA SANTANA ', '2001-10-28', 'PALMEIRAS DAS BERMUDAS 128', '(11) 96833-7169', 'Lika', 'Membro', 'naotem.email@gmail.com', '2019-05-14 19:19:34', 1, 'ativo'),
(182, 'LÍDIA CANDIDO B. SILVA ', '1985-01-16', 'PALMEIRAS DAS BERMUDAS 128', '(11) 98153-3432', 'Lika', 'Auxiliar', 'nao.tem.email@gmail.com', '2019-05-14 19:21:11', 1, 'ativo'),
(183, 'MATEUS FERNANDES ', '2008-04-12', 'GUAIUVIRA 121', '(11) 96258-8075', 'Lika', 'Auxiliar', 'naotememail1@gmail.com', '2019-05-14 19:23:02', 1, 'ativo'),
(184, 'PATRICIA FERNANDES ', '1977-03-20', 'GUAIUVIRA 121', '(11) 96258-8075', 'Lika', 'Líder', 'naotem.email2@gmail.com', '2019-05-14 19:24:22', 1, 'ativo'),
(185, 'NICOLAS DA SILVA CRISTIA', '2005-10-30', 'RUA ANTÔNIO CAÇÃO 85', '(11) 95986-9437', 'Lika', 'Membro', 'naotememail3@gmail.com', '2019-05-14 19:26:58', 1, 'ativo'),
(186, 'JORGE SILVA FILHO', '1973-11-06', 'BERNADINO SILVA 6', '(11) 96736-1007', 'Lika', 'Líder', 'naotememail4@hotmail.com', '2019-05-14 19:35:02', 1, 'ativo'),
(187, 'AGATHA CHRISTYE DE LIMA SOUZA', '1999-02-18', 'AV.ALVARO DOS SANTOS MATTOS,157, PQ SANTA RITA ', '(11) 99444-4345', 'Quatro Seres', 'Auxiliar', 'AGATHALIMASOUZA@GMAIL.COM', '2019-05-14 19:42:01', 1, 'ativo'),
(188, 'GISLAINE RIBEIRO ', '1995-05-10', 'RUA MACAUBA MIRIM,233- JARDIM DOS PES ', '(11) 95439-7967', 'Quatro Seres', 'Membro', 'GIH.NERES19@HOTMAIL.COM', '2019-05-14 20:10:07', 1, 'ativo'),
(189, 'WELDER ALVES DE ALMEIDA', '1998-02-17', 'RUA CONGONHA DO SERTÃO,52-JARDIM DOS YPES', '(11) 94233-5332', 'Quatro Seres', 'Membro', 'welderalves.bass@gmail.com', '2019-05-14 20:22:37', 1, 'ativo'),
(190, 'CAMILA ALVES DE CASTRO', '1970-01-01', 'RUA DOUTOR FRANCISCO TANCREDI,789- PQ PAULISTANO', '(11) 94971-5323', 'Quatro Seres', 'Membro', 'camila_silvaesilva@hotmail.com', '2019-05-14 20:36:37', 1, 'ativo'),
(192, 'GABRIEL PEREIRA CAXIAS ', '1994-08-09', 'RUA ASCENSO FERNANDES, 297- PQ PAULISTANO', '(11) 95202-8871', 'Quatro Seres', 'Membro', 'gabs.caxias7@gmail.com', '2019-05-14 20:39:45', 1, 'ativo'),
(193, 'LUIS CLAUDIO BORGES DA SILVA', '1994-04-16', 'RUA COQUEIRO CARANDÁ,352- JARDIM DOS YPES', '(11) 96591-8021', 'Quatro Seres', 'Membro', 'luis_zinho@live.com', '2019-05-14 20:44:54', 1, 'ativo'),
(194, 'THIAGO DA SILVA GOMES', '1986-03-24', 'AV.ALVARO DOS SANTOS MATTOS,151, PQ SANTA RITA ', '(11) 98393-7839', 'Quatro Seres', 'Supervisor', 'tgmesnre@gmail.com', '2019-05-14 20:47:47', 1, 'ativo'),
(195, 'EDSON MOREIRA COSTA', '1969-12-12', 'AV FERNANDO FIGUEIREDO LINS 38', '(11) 98565-0736', 'Lika', 'Líder', 'edymc33@hotmail.com', '2019-05-15 00:30:31', 1, 'ativo'),
(196, 'ELLEN MAYARA FEITOSA DA COSTA', '2003-07-13', 'AV FERNANDO FIGUEIREDO LINS 38', '(11) 96777-8015', 'Lika', 'Auxiliar', 'ellencosta1203@gmail.com', '2019-05-15 00:33:37', 1, 'ativo'),
(197, 'SÔNIA CLOTILDE FEITOSA DA COSTA', '1964-04-17', 'AV FERNANDO FIGUEIREDO LINS 38', '(11) 96686-4621', 'Lika', 'Auxiliar', 'soniafc174@gmail.com', '2019-05-15 00:36:47', 1, 'ativo'),
(200, 'JOEL DE OLIVEIRA SANTOS', '1980-04-30', 'Rua. Cairapes das Aguas', '(11) 97101-7977', 'Pr. Joel/Regiane', 'Pastor', 'joel.santos@novelis.com ', '2019-05-21 14:50:47', 1, 'ativo'),
(201, 'MAGNA DE OLIVEIRA SILVA ALVES', '1984-08-18', 'RUA ARNALDO CINTRA, 190', '(11) 99507-1196', 'Pr. Anderson', 'Supervisor', 'magna_osilva@yahoo.com.br', '2019-06-01 23:00:48', 1, 'ativo'),
(202, 'CLARICE REGINA SANTOS PEQUENO', '1981-12-09', 'RUA CONGONHAS DO SERTAO, 3', '(11) 95924-8133', 'Luizinho/Clarice', 'Supervisor', 'bia.clarice@yahoo.com.br', '2019-06-01 23:03:32', 1, 'ativo'),
(205, 'ADNA MELO', '1999-11-04', 'AV: JOSÉ MARTINS LISBOA', '(11) 94898-2394', 'Jaqueline', 'Auxiliar', '', '2019-06-02 00:57:01', 1, 'ativo'),
(206, 'SUELLEN  DE JESUS SILVA', '1998-08-27', 'AV: JOÃO BATISTA SANTIAGO,523', '(11) 99391-8515', 'Jaqueline', 'Membro', 'suellen383@gmail.com', '2019-06-02 01:02:15', 1, 'ativo'),
(207, 'ISABELE REGINA DE FRANÇA', '2007-09-22', 'RUA CONGONHAS DO SERTAO, 3', '(11) 95924-8133', 'Luizinho/Clarice', 'Membro', 'isabele.regina.f@hotmail.com', '2019-06-02 01:03:26', 1, 'ativo'),
(208, 'MATEUS LIMA MARTINS', '2000-06-26', 'RUA MORRO DA BABILONIA,27', '(11) 94933-3861', 'Jaqueline', 'Líder', 'limamartinsff@gmail.com', '2019-06-02 01:04:10', 1, 'ativo'),
(210, 'AMANDA MELO', '2000-12-24', 'RUA SARGENTO BASÍLIO M. DE SANTANA', '(11) 95967-8937', 'Jaqueline', 'Auxiliar', 'amandapereira349@gmail.com', '2019-06-02 01:09:10', 1, 'ativo'),
(214, 'ANDRÉ LUIZ', '1992-08-29', 'AV: JOSÉ MARTINS LISBOA', '(11) 95972-1857', 'Jaqueline', 'Líder', '', '2019-06-02 01:14:45', 1, 'ativo'),
(215, 'ALDENIZE MELO', '1994-09-07', 'AV: JOSÉ MARTINS LISBOA,2179 A', '(11) 96524-1415', 'Jaqueline', 'Líder', '', '2019-06-02 01:16:16', 1, 'ativo'),
(216, 'CLAUDIANE ROSEMERE DE OLIVEIRA', '1988-08-15', 'RUA MASATO SAKAI,180', '(11) 94029-1684', 'Jaqueline', 'Auxiliar', '', '2019-06-02 01:17:47', 1, 'ativo'),
(217, 'CLAYZER DOS SANTOS', '1980-04-24', 'RUA MANAJÓS,26', '(11) 95401-6690', 'Jaqueline', 'Líder', '', '2019-06-02 01:19:25', 1, 'ativo'),
(218, 'DAVID DE JESUS SILVA ', '1994-10-19', 'AV: JOÃO BATISTA SANTIAGO,523', '(11) 98666-3630', 'Jaqueline', 'Líder', '', '2019-06-02 01:20:55', 1, 'ativo'),
(219, 'DIEGO OLIVEIRA DA SILVA', '1990-02-09', 'RUA BERLIN DE AZEVEDO VIEIRA,06', '(11) 99398-4414', 'Jaqueline', 'Líder', '', '2019-06-02 01:23:11', 1, 'ativo'),
(220, 'JANAINA TAVARES DE SOUZA', '1983-10-26', 'RUA ISABEL MORALES DE O.M.,696A', '(11) 95119-4336', 'Jaqueline', 'Líder', '', '2019-06-02 01:24:12', 1, 'ativo'),
(221, 'JEAN MICHEL', '1986-08-01', 'RUA MASATO SAKAI,180', '(11) 94032-6399', 'Jaqueline', 'Membro', '', '2019-06-02 01:25:51', 1, 'ativo'),
(222, 'JOYCE SOARES ', '1990-07-10', 'RUA JOÃO BATISTA SANTIAGO,523', '(11) 94819-2377', 'Jaqueline', 'Líder', '', '2019-06-02 01:27:31', 1, 'ativo'),
(223, 'LEILIANE OLIVEIRA DOS SANTOS', '1982-03-03', 'RUA MANAJÓS,26', '(11) 96216-6338', 'Jaqueline', 'Auxiliar', '', '2019-06-02 01:29:17', 1, 'ativo'),
(224, 'LIVIA FERNANDA SOUZA', '1991-05-26', 'RUA GUAPIRA,881', '(11) 95704-2429', 'Jaqueline', 'Líder', '', '2019-06-02 01:30:23', 1, 'ativo'),
(228, 'LUIZ FERNANDO MANZANI', '1986-02-19', 'RUA PIMENTA D\'ÁGUA,188', '(11) 94845-4104', 'Jaqueline', 'Líder', 'nandoavivanoiva@gmail.com', '2019-06-02 01:36:07', 1, 'ativo'),
(229, 'LUIS HENRIQUE LIMA GAIOT', '2003-07-02', 'RUA PARREIRA BRAVA,315', '(11) 95357-7482', 'Jaqueline', 'Membro', 'luish747474@gmail.com', '2019-06-02 01:39:18', 1, 'ativo'),
(230, 'MARIA DE FATIMA SANTOS DA SILVA', '1970-01-01', 'RUA LOURO TINGA,387', '(11) 93144-3215', 'Jaqueline', 'Membro', '', '2019-06-02 01:41:17', 1, 'ativo'),
(231, 'VIVIANE OLIVEIRA DA SILVA', '1982-08-29', 'RUA PEROBA ROSA,49', '(11) 99836-5125', 'Jaqueline', 'Membro', '', '2019-06-02 01:42:32', 1, 'ativo'),
(237, 'KLARICE OLIVEIRA DOS SANTOS', '2011-07-27', 'RUA MANAJÓS,26', '(11) 96216-6338', 'Jaqueline', 'Membro', '', '2019-06-02 02:19:41', 1, 'ativo'),
(238, 'JHONATAN OLIVEIRA DOS SANTOS', '2016-07-27', 'RUA MANAJÓS,26', '(11) 96216-6338', 'Jaqueline', 'Membro', '', '2019-06-02 02:20:31', 1, 'ativo'),
(239, 'SARA REGINA GOMES XAVIER', '1997-09-05', 'RUA JOAO FRANCO DOS REIS,26', '(11) 96552-0228', 'Luizinho/Clarice', 'Auxiliar', 'sara@tubelab.tv', '2019-06-02 02:43:38', 1, 'ativo'),
(240, 'SONIA REGINA GOMES XAVIER', '1964-07-31', 'RUA JOAO FRANCO DOS REIS,26', '(11) 96903-9850', 'Luizinho/Clarice', 'Auxiliar', 'sonia86202070@gmail.com', '2019-06-02 02:45:25', 1, 'ativo'),
(241, 'ROGERIO SOARES DA SILVA', '1968-07-28', 'RUA CASTANHEIRA DO BREJO, 84', '(11) 97069-0241', 'Luizinho/Clarice', 'Membro', 'juridicorogerio@ig.com.br', '2019-06-02 02:50:31', 1, 'ativo'),
(243, 'CAROLINE ADOLFO KOVALINKINAS', '1981-12-10', 'RUA MONTE AZUL PAULISTA, 120', '(11) 95405-2603', 'Luizinho/Clarice', 'Membro', '', '2019-06-02 02:56:37', 1, 'ativo'),
(247, 'MANOEL MARCOS BEZERRA AMERICO', '1994-03-17', 'RUA MONTE AZUL PAULISTA, 120', '(11) 98253-3099', 'Luizinho/Clarice', 'Membro', '', '2019-06-02 02:58:50', 1, 'ativo'),
(253, 'CAMILLA CRISTINA AMORIM CARVALHO', '1990-03-12', 'RUA : CARMO DE MINAS ,32', '(11) 94972-8550', 'Martim/Shirley', 'Líder', 'camilacarvalho750@gmail.com', '2019-06-04 20:31:30', 1, 'ativo'),
(254, 'SAMUEL SANTOS CARVALHO', '1982-10-24', 'RUA : CARMO DE MINAS ,32', '(11) 94984-5811', 'Martim/Shirley', 'Líder', 'samuelcarvalho750@gmail.com', '2019-06-04 20:34:45', 1, 'ativo'),
(255, 'EDIVALDO ANTÔNIO OLIVEIRA', '1981-11-09', 'RUA: CARNANI ,31', '(11) 94022-6092', 'Martim/Shirley', 'Anfitrião', '', '2019-06-04 21:13:08', 1, 'ativo'),
(256, 'ELAINE NOGUEIRA OLIVEIRA', '1981-08-07', 'RUA: CARNANI ,31', '(11) 94444-7558', 'Martim/Shirley', 'Anfitrião', '', '2019-06-04 21:14:56', 1, 'ativo'),
(257, 'BIANCA NOGUEIRA OLIVEIRA', '2002-04-01', 'RUA: CARNANI ,31', '(11) 98043-3674', 'Martim/Shirley', 'Anfitrião', '', '2019-06-04 21:16:31', 1, 'ativo'),
(258, 'ADALBERTO ANTÔNIO DE OLIVEIRA', '1974-08-24', 'RUA: GUARAPARIBA ,434', '(11) 94088-4181', 'Martim/Shirley', 'Anfitrião', 'elizabethvitoria.ecceo@gmail.com', '2019-06-04 21:58:49', 1, 'ativo'),
(259, 'ELISABETE CRISTINA CONCEIÇÃO', '1992-08-24', 'RUA: GUARAPARIBA ,434', '(11) 96273-3079', 'Martim/Shirley', 'Membro', 'elizabethvitoria.ecceo@gmail.com', '2019-06-04 22:01:12', 1, 'ativo'),
(260, 'MISLENE GOMES DE OLIVEIRA', '1987-04-05', 'RUA: GUARAPARIBA ,434', '(11) 97991-3310', 'Martim/Shirley', 'Anfitrião', 'mislenegomes28@gmail.com', '2019-06-04 22:03:49', 1, 'ativo'),
(261, 'ELAINE GOMES DE OLIVEIRA', '1981-11-09', 'RUA: GUARAPARIBA ,434', '(11) 94728-6824', 'Martim/Shirley', 'Anfitrião', 'Elaine20014@mail.com', '2019-06-04 22:15:01', 1, 'ativo'),
(263, 'MAGDA RAMALHO VILAÇA', '1976-11-05', 'RUA: CARAIPES DAS ÁGUAS , 509', '(11) 98082-7581', 'Martim/Shirley', 'Líder', '', '2019-06-05 04:19:32', 1, 'ativo'),
(264, 'JOÃO HALISSON OLIVEIRA', '1976-12-27', 'RUA: LAGOA CAJUBA ,101', '(11) 96742-5690', 'Martim/Shirley', 'Líder', 'halisson_3051@hotmail.com', '2019-06-05 04:22:49', 1, 'ativo'),
(265, 'ELAINE CARDOSO OLIVEIRA', '1980-03-25', 'RUA: LAGOA CAJUBA ,  101', '(11) 98031-2261', 'Martim/Shirley', 'Auxiliar', 'elaine.c.s2009@hotmail.com', '2019-06-05 04:26:14', 1, 'ativo'),
(266, 'ANDERSON JOSÉ DA SILVA FERRARI', '1979-05-25', 'AV.IPE ROXO,493 JD IPE', '(11) 97682-9149', 'Valdirene', 'Líder', 'andersilvaferrari@gmail.com', '2019-06-07 01:40:42', 1, 'ativo'),
(267, 'VANESSA FERRARI DA SILVA', '1979-11-21', 'AV.IPE ROXO,493 JD IPE', '(11) 96588-1295', 'Valdirene', 'Líder', 'vanesferrari@hotmail.com', '2019-06-07 01:42:32', 1, 'ativo'),
(268, 'MÁRCIA RAMALHO VIEIRA SANTOS', '1970-04-25', 'RUA: CIPÓ DO REINO ,85', '(11) 95106-6977', 'Martim/Shirley', 'Líder', 'maravisa10@bol.com.br', '2019-06-07 15:58:49', 1, 'ativo'),
(269, 'DORIVAL PEREIRA DOS SANTOS', '1957-08-09', 'RUA: CIPÓ DO REINO ,85', '(11) 97806-6024', 'Martim/Shirley', 'Líder', 'maravisa10@bol.com.br', '2019-06-07 16:03:09', 1, 'ativo'),
(271, 'ROSÂNGELA SALVADOR DOS SANTOS', '1985-01-16', 'RUA: CIPÓ DO REINO ,85', '(11) 94539-7316', 'Martim/Shirley', 'Líder', 'angelassgabriel160185@gmail.com', '2019-06-07 16:12:07', 1, 'ativo'),
(272, 'DAVID RAMALHO DOS SANTOS', '1991-11-02', 'RUA: CIPÓ DO REINO ,85', '(11) 94539-7316', 'Martim/Shirley', 'Líder', 'drscorintiano@bol.com.br', '2019-06-07 16:14:58', 1, 'ativo'),
(273, 'DAYANE APARECIDA DE JESUS', '2002-01-20', 'RUA DAS GAIVOTAS, 06 -  VALE DAS BRISAS', '(11) 95322-5288', 'Prs Wagner/Rosana', 'Membro', '953225288dayane@gmail.com', '2019-06-12 20:28:27', 1, 'ativo'),
(274, 'DANIELA SANTOS DE JESUS', '1984-12-06', 'VALE DAS BRISAS, RUA DAS GAIVOTAS N°06', '(11) 95038-3374', 'Prs Wagner/Rosana', 'Membro', '', '2019-06-12 20:56:32', 1, 'ativo'),
(275, 'NILTON HENRIQUE LIMA JUNIOR', '1983-02-08', 'VALE DAS BRISAS, RUA DAS GAIVOTAS N°06', '(11) 94211-8878', 'Prs Wagner/Rosana', 'Membro', '', '2019-06-12 20:57:56', 1, 'ativo'),
(276, 'DAYANE APARECIDA DE JESUS DA FONSECA', '2002-01-20', 'VALE DAS BRISAS, RUA DAS GAIVOTAS N°06', '(11) 95322-5288', 'Prs Wagner/Rosana', 'Membro', '953225288dayane@gmail.com', '2019-06-12 20:59:55', 1, 'ativo'),
(277, 'MARIA VITORIA JESUS DA FONSECA', '2005-09-26', 'VALE DAS BRISAS, RUA DAS GAIVOTAS N°06', '(11) 95038-3374', 'Prs Wagner/Rosana', 'Membro', '', '2019-06-12 21:01:01', 1, 'ativo'),
(278, 'ANA FLAVIA RAMOS DA SILVA', '2002-03-31', 'VALE DAS BRISAS, RUA DAS ANDORINHAS N°8585', '(11) 93024-2262', 'Prs Wagner/Rosana', 'Membro', 'ANAFLAVIARAMOS068@GMAIL.COM', '2019-06-12 21:07:06', 1, 'ativo'),
(279, 'ANA CAROLINA RAMOS DA SILVA', '2007-03-28', 'VALE DAS BRISAS, RUA DAS ANDORINHAS N°8585', '(11) 99481-4378', 'Prs Wagner/Rosana', '', '', '2019-06-12 21:11:14', 1, 'ativo'),
(280, 'ANA PAULA RAMOS DA SILVA FERREIRA', '1993-03-20', 'VALE DAS BRISAS, RUA DAS ANDORINHAS Nº83', '(11) 97351-8500', 'Prs Wagner/Rosana', 'Membro', '', '2019-06-12 21:17:15', 1, 'ativo'),
(281, 'ALEXANDRE APARECIDO FERREIRA', '1977-05-20', 'VALE DAS BRISAS, RUA DAS ANDORINHAS N°83', '(11) 97351-8500', 'Prs Wagner/Rosana', 'Membro', '', '2019-06-12 21:19:20', 1, 'ativo'),
(282, 'MARIA FERREIRA SAISA', '1951-11-05', 'VALE DAS BRISAS, RUA DAS GAIVOTAS ', '(11) 95029-7736', 'Prs Wagner/Rosana', 'Membro', '', '2019-06-12 21:23:53', 1, 'ativo'),
(283, 'MATHEUS RIBEIRO SILVA DE MEDEIROS', '2004-07-14', 'ENTRADA MUNICIPAL DA SERVIDÃO, Nº6854-9-VAREJÃO', '(11) 95308-2532', 'Prs Wagner/Rosana', 'Membro', 'MATHEUSRIBEIRO4002@GMAIL.COM', '2019-06-12 21:32:59', 1, 'ativo'),
(284, 'FRANCIELLE SILVA BORGES', '1988-11-15', 'ESTRADA DOM JOÃO NERY , 3555 ', '(11) 97966-2450', 'Martim/Shirley', 'Auxiliar', '', '2019-06-17 13:43:33', 1, 'ativo'),
(285, 'AFRÂNIO ANDERSON SANTOS NEVES', '1986-12-09', 'ESTRADA DOM JOÃO NERY , 3555 ', '(11) 98664-4982', 'Martim/Shirley', 'Auxiliar', '', '2019-06-17 13:45:29', 1, 'ativo'),
(286, 'CRISTIANE APARECIDA LIMA DA SILVA', '1971-03-03', 'ESTRADA DOM JOÃO NERY , 3555 ', '(11) 97646-4475', 'Martim/Shirley', 'Auxiliar', '', '2019-06-17 13:48:20', 1, 'ativo'),
(287, 'FRANKIN SILVA BORGES', '1984-12-02', 'ESTRADA DOM JOÃO NERY , 3555 ', '(11) 98549-3932', 'Martim/Shirley', 'Anfitrião', '', '2019-06-17 13:49:54', 1, 'ativo'),
(288, 'ANA CLÁUDIA PAIVA ESTEVÃO', '1988-09-10', 'ESTRADA DOM JOÃO NERY , 3555 ', '(11) 98533-7861', 'Martim/Shirley', 'Auxiliar', '', '2019-06-17 13:51:20', 1, 'ativo'),
(289, 'ANA LUÍZA SALES SANTOS', '2007-05-14', 'RUA : LAGOA CAJUBA , 101', '(11) 98885-0610', 'Martim/Shirley', 'Membro', '', '2019-06-17 13:58:26', 1, 'ativo'),
(290, 'BIANCA OLIVEIRA', '2002-04-01', 'RUA: CARNANI ,31', '(11) 98043-3674', 'Martim/Shirley', 'Anfitrião', '', '2019-06-17 14:00:40', 1, 'ativo'),
(291, 'ELLEN CRISTINA BEZERRA DE OLIVEIRA', '2003-10-23', 'RUA : LAGOA CAJUBA , 101', '(11) 97802-5545', 'Martim/Shirley', 'Anfitrião', '', '2019-06-17 14:05:13', 1, 'ativo'),
(292, 'JEAN SALES SANTOS ', '1999-07-26', 'RUA : LAGOA CAJUBA , 101', '(11) 96260-4750', 'Martim/Shirley', 'Anfitrião', '', '2019-06-17 14:13:15', 1, 'ativo'),
(293, 'LEANDRO FERNANDES', '2000-10-23', 'RUA : LAGOA CAJUBA , 101 ', '(11) 94986-3722', 'Martim/Shirley', 'Anfitrião', '', '2019-06-17 14:15:46', 1, 'ativo'),
(294, 'LUCAS CARDOSO OLIVEIRA', '2002-07-06', 'RUA : LAGOA CAJUBA , 101', '(11) 00000-0000', 'Martim/Shirley', 'Anfitrião', '', '2019-06-17 14:17:49', 1, 'ativo'),
(296, 'NICOLLE CRISTINA LEITE DE OLIVEIRA', '2005-03-04', 'RUA: GUARAPARIBA ,434', '(11) 94004-2968', 'Martim/Shirley', 'Anfitrião', '', '2019-06-17 14:19:59', 1, 'ativo'),
(297, 'RENATA MARIA LIMA BETIM', '2005-03-04', 'RUA : LAGOA CAJUBA , 101', '(11) 95386-9819', 'Martim/Shirley', 'Anfitrião', '', '2019-06-17 14:22:37', 1, 'ativo'),
(298, 'VALÉRIA DO CARMO  GONÇALVES DE LIMA', '1969-10-24', 'RUA JULIA,37', '(11) 98589-4187', 'Fabio/Sandra', 'Membro', 'valeriadocarmo9979@gmail.com', '2019-06-17 20:42:34', 1, 'ativo'),
(299, 'THIAGO DE MENDONÇA', '1986-05-24', 'RUA FLOR DA REDENÇAO.382', '(11) 96839-8006', 'Fabio/Sandra', 'Auxiliar', 'thiagomendonca.moraes32@gmail.com', '2019-06-17 20:46:35', 1, 'ativo'),
(300, 'BRUNO MARIO  DE ANDRADE  SILVA', '1991-03-12', 'RUA TRES PORTOS.29D', '(95) 49313-78', 'Fabio/Sandra', 'Líder', 'brunomario321@hotmail.com', '2019-06-17 21:03:26', 1, 'ativo'),
(301, 'DALVANIR PAIVA DO PRADO', '1978-10-11', 'RUA PALMEIRAS DA BERMUDAS,467', '(11) 94551-1609', 'Fabio/Sandra', 'Líder', 'dalvaprado49@gmail.com', '2019-06-17 23:12:27', 1, 'ativo'),
(302, 'WANDEGLEISON OLIVEIRA DA CRUZ', '1985-07-10', 'RUA CRUZEIRO.282', '(11) 98160-9149', 'Fabio/Sandra', 'Anfitrião', '', '2019-06-17 23:34:24', 1, 'ativo'),
(303, 'ROSIMEIRE OLIVEIRA ', '1968-11-16', 'RUA CRUZEIRO.282', '(11) 98568-0589', 'Fabio/Sandra', 'Membro', 'rosimeire0951@gmail.com', '2019-06-17 23:39:25', 1, 'ativo'),
(304, 'RAQUEL MARIA FERRAZ', '1989-03-04', 'RUA CRUZEIRO.284', '(11) 96440-5068', 'Fabio/Sandra', 'Membro', 'rachelferraz489@gmail.com', '2019-06-17 23:44:20', 1, 'ativo'),
(305, 'ITELVINA MARI MELO BEZERRA', '1970-01-01', 'RUA GUAIRA,81', '(11) 96833-337', 'Fabio/Sandra', 'Anfitrião', 'marioantony46@gmail.com', '2019-06-17 23:50:08', 1, 'ativo'),
(306, 'JOSE FIGUEREDO', '1970-01-01', 'RUA CONGONHAS DO SERTAO,42', '(11) 97963-2949', 'Fabio/Sandra', 'Membro', '', '2019-06-18 00:05:11', 1, 'ativo'),
(310, 'MARCELO DOS SANTOS', '1994-10-09', 'RUA ITACARÉ,164  VILA ESPERANÇA ITAQUA', '(11) 95157-5153', 'Fabio/Sandra', 'Membro', 'marcelosantos1700@gmail.com', '2019-07-08 19:18:50', 1, 'ativo'),
(311, 'SAMARA DOS SANTOS SILVA ', '1996-05-11', 'RUA ERVA BOTÃO 274', '(11) 95934-9945', 'WAGUERSON', 'Auxiliar', 'SANTOSSAMARA648@GMAIL.COM', '2019-07-30 13:03:01', 1, 'ativo'),
(312, 'THIAGO ALVES DE SANTANA ', '1997-09-04', 'RUA ERVA BOTÃO 274', '(11) 94959-5999', 'WAGUERSON', 'Auxiliar', 'THIAGOSANTANA.CHUBB@GMAIL.COM', '2019-07-30 13:03:48', 1, 'ativo'),
(313, 'ROMERO KAPPS JUNIOR ', '1974-11-21', 'RUA ARICANGA 974', '(11) 95464-6486', 'WAGUERSON', 'Auxiliar', 'JRKAPPS@GMAIL.COM', '2019-07-30 13:04:42', 1, 'ativo'),
(314, 'FERNANDA CRISTINA DE FARIA KAPPS', '1979-05-12', 'RUA ARICANGA 974', '(11) 94147-2010', 'WAGUERSON', 'Auxiliar', 'FERNANDAKAPPS@GMAIL.COM', '2019-07-30 13:05:40', 1, 'ativo'),
(315, 'LUIS FELIPE DE FARIA KAPPS', '2007-08-16', 'RUA ARICANGA 974', '(11) 95464-6486', 'WAGUERSON', 'Membro', 'LIPPEKAPPS@GMAIL.COM', '2019-07-30 13:06:27', 1, 'ativo'),
(316, 'THAYNA LETICIA COSTA MOREIRA', '1996-12-25', 'RUA SERAFINA D´ABRIL 61', '(11) 98700-2145', 'WAGUERSON', 'Líder', 'THAINALETICIA.COSTA@GMAIL.COM', '2019-07-30 13:08:03', 1, 'ativo'),
(317, 'EDILENE COSTA ', '1969-03-04', 'RUA SERAFINA D´ABRIL 61', '(11) 95140-2228', 'WAGUERSON', 'Líder', 'NEGRAZEIN0403@GMAIL.COM', '2019-07-30 17:44:34', 1, 'ativo'),
(318, 'ALISSON ROBERTO FRAGA', '1991-02-23', 'TRAVESSA JULIO TUPY 53', '(11) 96070-9329', 'WAGUERSON', 'Auxiliar', 'ALISSON.ROBERTO1991@GMAIL.COM', '2019-07-31 12:53:08', 1, 'ativo'),
(319, 'KATHLEEN YASMIN ALVES DA SILVA ', '1970-01-01', 'RUA HIGINO MESSA 100', '(11) 94179-3170', 'WAGUERSON', 'Auxiliar', 'KATHYALVS@GMAIL.COM', '2019-07-31 12:54:04', 1, 'ativo'),
(320, 'LUIS CARLOS DE MIRANDA ', '1977-08-03', 'RUA PALMEIRA DAS BERMUDAS 1052 JD IPE', '(11) 97429-4078', 'Valdirene', 'Membro', '', '2019-08-01 02:51:45', 1, 'ativo'),
(321, 'JANETE GONÇALVES', '1969-06-05', 'RUA PALMEIRA DAS BERMUDAS 1052 JD IPE', '(11) 97429-4078', 'Valdirene', 'Membro', '', '2019-08-01 02:52:50', 1, 'ativo'),
(322, 'MARIA APARECIDA DA SILVA', '1983-11-28', 'RUA LUIZA ROSA PAZ LANDIM,97 JD MIRAGAIA', '(11) 97429-4078', 'Valdirene', 'Membro', 'aparecida.silva83@yahoo.com.br', '2019-08-01 02:54:57', 1, 'ativo'),
(323, 'NAWANY SILVA OLIVEIRA', '2005-11-03', 'RUA LUIZA ROSA PAZ LANDIM,97 JD MIRAGAIA', '(11) 97429-4078', 'Valdirene', 'Membro', 'aparecidanawany@gmail', '2019-08-01 02:56:40', 1, 'ativo'),
(324, 'CAMILA ALVES DOS SANTOS', '1989-02-15', 'VIELA VITORIO CAPALARO JD MIRAGAIA', '(11) 97707-9080', 'Valdirene', 'Membro', '', '2019-08-01 02:58:29', 1, 'ativo'),
(325, 'NICOLE CARNEIRO ALVES DOS SANTOS', '2007-07-10', 'VIELA VITORIO CAPELARO JD MIRAGAIA', '(11) 97707-9080', 'Valdirene', 'Membro', '', '2019-08-01 03:00:21', 1, 'ativo'),
(326, 'NICOLE CARNEIRO ALVES DOS SANTOS', '2007-07-10', 'VIELA VITORIO CAPELARO JD MIRAGAIA', '(11) 97707-9080', 'Valdirene', 'Membro', '', '2019-08-01 03:00:22', 1, 'ativo'),
(327, 'DARLENY MORSE', '1972-11-27', 'RUA ANTONIO JOÃO DE MEDEREIROS,465 BLOCO 3 APTO 23', '(11) 97763-5904', 'TODAS', 'BISPA', NULL, '2019-08-24 15:38:32', 1, 'ativo'),
(328, 'TESTE ED', '1677-12-12', 'RUA TAL', '(11) 11111-1111', 'Lika', 'Líder', 'testeedi@testeedi', '2019-09-06 03:15:24', 1, 'ativo'),
(329, 'ALICE SILVA DAMASCENO', '2012-12-27', 'RUA RIO DO OURO 50', '(11) 94179-4640', 'Pr. Laércio/Vera', 'Membro', 'ROGERDOSKAMBI@HOTMAIL.COM', '2019-09-21 16:10:59', 1, 'ativo'),
(330, 'ALINE ALVES SCHINEIDER', '1970-01-01', 'RUA GUAIUVIRA 122', '(11) 98380-8164', 'Pr. Laércio/Vera', 'Membro', 'aline_contobil@hotmail.com', '2019-09-21 16:14:50', 1, 'ativo'),
(331, 'CINTIA SOUZA DE PAULA', '1970-01-01', 'TERRA SEM MALES 97 B', '(11) 95389-7171', 'Pr. Laércio/Vera', 'Líder', 'sifrossi@hotmail.com', '2019-09-21 16:19:00', 1, 'ativo'),
(332, 'DANIELA DE MELO PACIFICO', '1985-12-07', 'RUA DOMINGUES VIDIGAL 481', '(11) 96899-5302', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:21:04', 1, 'ativo'),
(333, 'DIEGO ALVES DAMASCENO', '1994-02-02', 'RUA DOMINGUES VIDIGAL 481', '(11) 96899-5302', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:22:51', 1, 'ativo'),
(334, 'ENZO MIGUEL DE ALMEIDA MORAES', '2016-01-14', 'RUA PALMEIRAS DAS BERMUDAS 86', '(11) 25746-892', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:25:13', 1, 'ativo'),
(335, 'ELIAS SAMUEL DE MELO PACIFICO', '2014-09-25', 'RUA DOMINGUES VIDIGAL', '(11) 96899-5302', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:26:49', 1, 'ativo'),
(336, 'IARA RAILA SILVA DAMASCENO', '2002-10-17', 'RUA RIO DO OURO 50', '(11) 94534-1841', 'Pr. Laércio/Vera', 'Auxiliar', 'rogerdaskombi@hotmail.com', '2019-09-21 16:29:33', 1, 'ativo'),
(337, 'IRINEIA FERREIRA DAMASCENO', '1983-10-05', 'RUA RIO DO OURO 56', '(11) 25668-900', 'Pr. Laércio/Vera', 'Líder', 'ROGERDASKAMBI@HOTMAIL.COM', '2019-09-21 16:31:19', 1, 'ativo'),
(338, 'IVONE BARBOSA DA SILVA', '1971-04-07', 'RUA FLOR BOREAL 40', '(11) 99490-7846', 'Pr. Laércio/Vera', 'Pastor', '', '2019-09-21 16:33:04', 1, 'ativo'),
(339, 'MICHELE DE ALMEIDA MILANE', '1985-07-29', 'PALMEIRAS DAS BERMUDAS', '(11) 25746-892', 'Pr. Laércio/Vera', 'Membro', 'milanemichele@gmail.com', '2019-09-21 16:37:06', 1, 'ativo');
INSERT INTO `membros` (`idmembros`, `nome`, `nasc`, `endereco`, `telefone`, `supervisao`, `cargo`, `email`, `cadastro`, `igreja`, `status`) VALUES
(340, 'MARIA APARECIDA S. RIBEIRO', '1969-04-07', 'MACAUBA MIRIM', '(11) 95475-0011', 'Pr. Laércio/Vera', 'Líder', 'neguinhaaparecida@gmail.com', '2019-09-21 16:40:00', 1, 'ativo'),
(341, 'MILENE ALVES MARCULINO', '2003-05-10', 'RUA RIO DO OURO 22', '(11) 96245-2720', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:41:48', 1, 'ativo'),
(342, 'NICOLI SOUZA DE PAULA', '2011-02-24', 'RUA TERRA SEM MALES 97 B', '(11) 94179-4640', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:44:13', 1, 'ativo'),
(343, 'PEDRO HENRIQUE DE ALMEIDA MORAIS', '2009-07-09', 'RUA PALMEIRA DAS BERMUDAS', '(11) 25746-892', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:45:58', 1, 'ativo'),
(344, 'RODRIGO MORAIS PAULINO', '1986-06-02', 'RUA PALMEIRA DAS BERMUDAS', '(11) 25746-892', 'Pr. Laércio/Vera', 'Membro', 'rodrigomoraisp@gmail.com', '2019-09-21 16:48:13', 1, 'ativo'),
(345, 'SEVERINO ROCHA', '1986-01-26', 'RUA TERRA SEM MALES 97B', '(11) 95389-7171', 'Pr. Laércio/Vera', 'Membro', 's.rocha@hotmail.com', '2019-09-21 16:50:33', 1, 'ativo'),
(346, 'THAYNARA VITORIA MELO DA SILVA', '2007-05-21', 'RUA DOMINGUES VIDIGAL 481', '(11) 96899-5302', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:52:22', 1, 'ativo'),
(347, 'THIAGO SOUZA PAULA', '2007-02-20', 'RUA TERRA SEM MALES 97 B', '(11) 94179-4640', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:53:45', 1, 'ativo'),
(348, 'VERA LUCIA ALVES DO NASCIMENTO', '1966-12-25', 'RUA RIO DO OURO 22', '(11) 25619-898', 'Pr. Laércio/Vera', 'Membro', 'veraluciaalves113@gmail.com', '2019-09-21 16:55:53', 1, 'ativo'),
(349, 'VITOR GABRIEL MELO DAMASCENO', '2012-03-28', 'RUA DOMINGUES VIDIGAL 481', '(11) 96899-5302', 'Pr. Laércio/Vera', 'Membro', '', '2019-09-21 16:57:27', 1, 'ativo'),
(350, 'MARIA NATALIA DA SILVA MENEZES', '1970-01-01', 'RUA OCIDENTE 353', '(11) 96810-7148', 'Willian/Sumaria', 'Membro', 'emenana1608@gmail.com', '2019-09-23 19:29:38', 1, 'ativo'),
(351, 'EMERSON MENEZES DA SILVA ', '1970-01-01', 'RUA OCIDENTE 353', '(11) 96225-4276', 'Willian/Sumaria', 'Membro', 'emsnana1608@gmail.com', '2019-09-23 19:31:28', 1, 'ativo'),
(352, 'EDUARDO FURLANTE DA CONCEIÇÃO', '1998-09-18', 'RUA PARTICULAR 144', '(11) 99174-7639', 'Willian/Sumaria', 'Auxiliar', 'dudufurlanette008@gmail.com', '2019-09-23 19:33:41', 1, 'ativo'),
(353, 'MARIA DO ROSARIO DOS SANTOS ', '1970-01-01', 'RUA FRANCISCO DE BARROS GARCEZ 166', '(11) 98698-0601', 'Willian/Sumaria', 'Membro', 'rosemaria_cms@hotmail.com', '2019-09-23 19:36:30', 1, 'ativo'),
(354, 'SAMARA VIERA DE FREITAS FRANÇA ', '1970-01-01', 'RUA MANOEL RODRUGUES DA ROCHA 294', '(11) 94971-1164', 'Willian/Sumaria', 'Líder', 'samara_j.c@hotmail.com', '2019-09-23 19:38:20', 1, 'ativo'),
(355, 'CAIQUE BARBOSA FRANÇA', '1970-01-01', 'RUA MANOEL RODRIGUES DA ROCHA 294', '(11) 95160-2274', 'Willian/Sumaria', 'Líder', 'caiquejlr_07@hotmail.com', '2019-09-23 19:40:13', 1, 'ativo'),
(356, 'JOSE ANDRE DA SILVA ROCHA', '1970-01-01', 'RUA ZEZÉ MACEDO 550 ', '(11) 95436-6611', 'Willian/Sumaria', 'Líder', 'jandredsilva86@gmail.com', '2019-09-23 20:21:41', 1, 'ativo'),
(357, 'KAREN MACIEL ROCHA DA SILVA ', '1970-01-01', 'RUA ZEZÉ MACEDO 550', '(11) 98556-2074', 'Willian/Sumaria', 'Líder', 'rocha17.karen@gmail.com', '2019-09-23 20:23:39', 1, 'ativo'),
(358, 'MARIA MAGNA NERES MATOS ', '1970-01-01', 'AV FLAMINGO 1035', '(11) 96419-3683', 'Willian/Sumaria', 'Auxiliar', 'm.magna.barbosa@bol.com.br', '2019-09-23 20:29:37', 1, 'ativo'),
(359, 'RODRIGO MATOS DE BRITO ', '1970-01-01', 'AV FLAMINGO 1035', '(11) 95057-7180', 'Willian/Sumaria', 'Auxiliar', 'rodribatera@hotmail.com', '2019-09-23 20:31:28', 1, 'ativo'),
(360, 'SUMARIA ALMEIDA LEAO ', '1970-01-01', 'RUA ILHA DOS RATONES 35', '(11) 99332-1325', 'Willian/Sumaria', 'Supervisor', 'sumariacunha@hotmail.com', '2019-09-23 20:45:54', 1, 'ativo'),
(361, 'LUCIANA DA SILVA BRAZ ', '1970-01-01', 'RUA DESEMBARGADOR THARSYBULO PINHEIRO DE ALBURQUER', '(11) 95468-5089', 'Willian/Sumaria', 'Líder', 'lucinabraz7@gmail.com', '2019-09-23 22:14:33', 1, 'ativo'),
(362, 'SILVANI DA SILVA BRAZ', '1970-01-01', 'RUA DESEMBARGADOR THARSYBULO PINHEIRO DE ALBURQUER', '(11) 96971-4354', 'Willian/Sumaria', 'Supervisor', 'sdasilvabras@gmail.com', '2019-09-24 13:46:00', 1, 'ativo'),
(363, 'JOSIENE DE PAULA DA SILVA ', '1970-01-01', 'RUA LOURO ROSA 37 B', '(11) 96890-9802', 'Willian/Sumaria', 'Auxiliar', 'josienepaula@com.br', '2019-09-24 13:51:23', 1, 'ativo'),
(364, 'EVANDRO CARVALHO DE BARROS', '1970-01-01', 'RUA LOURO ROSA 37 B', '(11) 25660-089', 'Willian/Sumaria', 'Auxiliar', 'evandrocarvalho0107@gmail.com', '2019-09-24 13:52:55', 1, 'ativo'),
(365, 'ALEXSANDRO DA SILVA GOMES', '1974-02-28', 'RUA: ANTONIO JOÃO DE MEDEIROS ,465- AP 13, BLOCO A', '(11) 98796-2870', 'Quatro Seres', 'Líder', 'ALX10@LIVE.COM', '2019-09-26 18:22:16', 1, 'ativo'),
(366, 'DANIEL LOPES DOS SANTOS', '1987-03-09', 'R.GAROUPA, 199 - AP 54, TORRE 2 - VILA CURUÇA', '(11) 97670-6959', 'Quatro Seres', 'Líder', 'daniel.santos@gmail.com', '2019-09-26 18:28:39', 1, 'ativo'),
(367, 'EDUARDO FURLANETTE', '1998-09-18', 'R.PARTICULAR B, 144 - JARDIM DAS OLIVEIRAS', '(11) 99174-7639', 'Quatro Seres', 'Auxiliar', 'dudufurlanette008@gmail.com', '2019-09-26 18:33:02', 1, 'ativo'),
(368, 'GABRIEL MIRANDA', '2004-10-17', 'RUA: PARANACIT, 651- PQ. PAULISTANO', '(11) 97242-0585', 'Quatro Seres', 'Membro', 'GABRIELMIRANDA@GMAIL.COM', '2019-09-26 18:35:12', 1, 'ativo'),
(369, 'GIOVANNA OLIVEIRA CARLOS MIRANDA', '1996-04-10', 'RUA ARICANGA, 1061 B', '(11) 94886-4728', 'Quatro Seres', 'Supervisor', 'giovannamorseoliveira@hotmail.com', '2019-09-26 18:36:28', 1, 'ativo'),
(370, 'HIAGO MACEDO MIRANDO ', '1997-03-28', 'R.AMORA PRETA, 250 - JARDIM DOS YPÊS', '(11) 97471-6629', 'Quatro Seres', 'Líder', 'hiagommiranda@gmail.com', '2019-09-26 18:39:41', 1, 'ativo'),
(371, 'JULIANA ALMEIDA BIZERRA ', '1996-06-01', 'R.DA RANCHEIRA, 94 - JARDIM SANTO ANTÔNIO ', '(11) 99460-2636', 'Quatro Seres', 'Auxiliar', 'juliana-almeida.a01@outlook.com', '2019-09-26 18:40:58', 1, 'ativo'),
(372, 'JULIO CESAR MOTA JUNIOR ', '1998-02-12', 'R.CARAÍPE DAS ÀGUAS,955 - JARDIM DOS YPÊS', '(11) 94984-2871', 'Quatro Seres', '', 'juliobatera10@gmail.com', '2019-09-26 18:42:47', 1, 'ativo'),
(373, 'LEANDRO DE ALMEIDA BEZERRA', '1983-07-01', 'AV.ALVARO DOS SANTOS MATTOS, 27A- PQ.SANTA RITA', '(11) 98427-5236', 'Quatro Seres', 'Líder', 'almeidaleandro@hotmail.com', '2019-09-26 18:46:15', 1, 'ativo'),
(374, 'LUCAS ANDRADE FREIRES', '1995-06-06', 'R.JAGUARABA, 314 - JARDIM MIRAGAIA', '(11) 98154-3560', 'Quatro Seres', 'Auxiliar', 'lucas.andrade.freires@gmail.com', '2019-09-26 18:47:59', 1, 'ativo'),
(375, 'MARCOS VINICIUS X. DOS SANTOS', '1996-05-05', 'R.FAVEIRA DO YGAPÓ, 233 JARDIM DOS YPÊS ', '(11) 94793-3254', 'Quatro Seres', 'Líder', 'marcosvinicius.remax@gmail.com', '2019-09-26 18:49:35', 1, 'ativo'),
(376, 'MARCUS VINICIUS O. DE MORAIS', '1993-09-22', 'R.DO POMBO CORREIO, 290 - JARDIM MIRAGAIA ', '(11) 98528-0170', 'Quatro Seres', 'Líder', 'marcus_otto@hotmail.com', '2019-09-26 18:51:00', 1, 'ativo'),
(377, 'RICARDO MIRANDA ', '2001-02-27', 'RUA: PARANACIT, 651- PQ. PAULISTANO', '(11) 96393-6298', 'Quatro Seres', 'Membro', 'RICARDOMIRANDA@GMAIL.COM', '2019-09-26 18:51:56', 1, 'ativo'),
(378, 'ROSÂNGELA MARIA P. DIAS', '1982-09-27', 'R. FAVEIRA DO IGAPÓ, 13B- JARDIM DOS YPES', '(11) 95998-2396', 'Quatro Seres', 'Líder', 'rosangelamaria_03@hotmail.com', '2019-09-26 18:59:36', 1, 'ativo'),
(379, 'STEPHANIE CAROLINE S. DA SILVA', '1999-09-27', 'R.CAFÉ DO BRASIL 263 - JARDIM DOS YPÊS', '(11) 94855-8211', 'Quatro Seres', 'Auxiliar', 'vinifany17@hotmail.com', '2019-09-26 19:01:56', 1, 'ativo'),
(380, 'VANESSA DA SILVA FARIAS', '1990-07-17', 'R.IGARAÇU, 295  - VILA SIMONE', '(11) 95970-5401', 'Quatro Seres', 'Auxiliar', 'vanessa.farias17@yahoo.com.br', '2019-09-26 19:03:54', 1, 'ativo'),
(381, 'VICENT MORSE O.CARLOS DA SILVA', '2006-10-20', 'R.ANTÔNIO JOÃO DE MEDEIROS, 465, AP 23 BL AZÉLIA -', '(11) 97763-5904', 'Quatro Seres', 'Auxiliar', 'vicent-morse@gmail.com', '2019-09-26 19:05:03', 1, 'ativo'),
(382, 'WILLIAN ISODORO BIZERRA', '1994-07-06', 'R.DA RANCHEIRA, 94 - JARDIM SANTO ANTÔNIO ', '(11) 99324-8522', 'Quatro Seres', 'Líder', 'willian.bizerra@outlook.com', '2019-09-26 19:07:52', 1, 'ativo'),
(383, 'MARIA SOCORRO MAIA ', '1970-01-01', 'RUA RIO SOBRADO 20 ', '(11) 97713-6118', 'Willian/Sumaria', 'Membro', 'msmaia29@hotmail.com', '2019-09-30 15:58:53', 1, 'ativo'),
(384, 'LUCAS TALLES SILVA PINTO', '1970-01-01', 'RUA DIAS DE AVILA 10A', '(11) 95995-7236', 'Willian/Sumaria', 'Líder', 'lucas.talles96@hotmail.com', '2019-09-30 16:02:30', 1, 'ativo'),
(385, 'ALECSANDRO DA SILVA ', '1975-03-04', 'RUA ILHA DE SÃO FRANCISCO 60', '(11) 98571-6252', 'Willian/Sumaria', 'Membro', 'alecsandro.silvana.silva@ccrr.com.br', '2019-09-30 16:11:13', 1, 'ativo'),
(386, 'THAÍS SILVA SANTOS ', '2018-02-03', 'RUA DESEMBARGADOR THARSYBULO PINHEIRO DE ALBURQUER', '(11) 94608-9012', 'Willian/Sumaria', 'Líder', 'thaissilvabras@gmail.com', '2019-10-02 02:13:08', 1, 'ativo'),
(387, 'BEATRIZ DOS SANTOS CARVALHO', '1970-01-01', 'RUA ZEZÉ MACEDO 550 BL 2 AP 23', '(11) 98754-3271', 'Willian/Sumaria', 'Líder', 'beatryz.santos04@gmail.com', '2019-10-02 02:15:58', 1, 'ativo'),
(388, 'ELTON CARVALHO DE BARROS', '1970-01-01', 'RUA ZEZÉ MACEDO 550 BL 2 AP 23', '(11) 96973-4190', 'Willian/Sumaria', 'Líder', 'elton07carvalho@gmail.com', '2019-10-02 02:17:38', 1, 'ativo'),
(389, 'LAEXANDRE OLIVEIRA SILVA ', '1973-02-10', 'RUA PARAITINGA 55 A ', '(11) 95914-5601', 'WAGUERSON', 'Auxiliar', 'RAFAELA265@HOTMAIL.COM', '2019-10-22 13:21:26', 1, 'ativo'),
(390, 'ANA PAULA APARECIDA DA SILVA GODOI', '1988-06-09', 'RUA GUIRARO 331', '(11) 94958-5014', 'WAGUERSON', '', '', '2019-10-22 13:33:08', 1, 'ativo'),
(391, 'WAGNER CARDOSO ALVES', '1975-08-20', 'RUA MÃE D´GUA 66', '(11) 94960-8941', 'WAGUERSON', 'Líder', '', '2019-10-22 13:34:48', 1, 'ativo'),
(392, 'ERIKA GOMES DOS SANTOS ', '1996-12-19', 'RUA JACAREANA 9', '(11) 95893-2541', 'WAGUERSON', 'Auxiliar', 'BRITOERIKA2019@GMAIL.COM', '2019-10-22 19:42:49', 1, 'ativo'),
(393, 'DYANE VIEIRA DE SALES', '1995-06-27', 'AVENIDA CORREGO TIJUCO PRETO, 18 JD OLIVEIRAS', '(11) 98356-1197', 'Casais', 'Membro', 'dyanesales27@hotmail.com', '2019-10-24 13:22:02', 1, 'ativo'),
(394, 'JACKSON DOS SANTOS', '1996-09-13', 'RUA ESPUMA, 40, JD CAMARGO NOVO', '(11) 98356-2019', 'Casais', 'Membro', 'jackson20102011@hotmail.com', '2019-10-24 13:23:37', 1, 'ativo'),
(395, 'DANYELE VIEIRA DE SALES', '1989-12-23', 'RUA TIJUCO PRETO, 18, JD DAS OLIVEIRAS', '(11) 98305-7260', 'Casais', 'Membro', 'danyvs1989@hotmail.com', '2019-10-24 13:31:55', 1, 'ativo'),
(396, 'GEAN CARLOS DOS SANTOS', '1996-02-16', 'RUA TIJUCO PRETO, 18, JD DAS OLIVEIRAS', '(11) 97701-4207', 'Casais', 'Membro', 'geancarlosdossantos21@gmail.com', '2019-10-24 13:32:53', 1, 'ativo'),
(397, 'CAIO DA SILVA COSTA', '1996-08-09', 'AVENIDA CORREGO TIJUCO PRETO, 18 JD OLIVEIRAS', '(11) 25612-803', 'Casais', 'Membro', 'caiosilva_costa@hotmail.com', '2019-10-24 13:33:54', 1, 'ativo'),
(398, 'JAQUELINE DOS SANTOS', '1994-10-17', 'AVENIDA CORREGO TIJUCO PRETO, 18 JD OLIVEIRAS', '(11) 96699-4092', 'Casais', 'Membro', 'jaquelinesantos-17@hotmail.com', '2019-10-24 13:35:13', 1, 'ativo'),
(399, 'CLEISON WILIAM DE ALMEIDA', '1976-10-04', 'RUA MANOEL BARBALHO DE LIMA 62 ITAIM PAULISTA', '(11) 94793-1704', 'Casais', 'Membro', '', '2019-10-24 13:36:33', 1, 'ativo'),
(400, 'LUCELIA BORGES DE ALMEIDA', '1978-01-17', 'RUA MANOEL BARBALHO DE LILMA 62 ITAIM PAULISTA', '(11) 98290-1524', 'Casais', 'Membro', '', '2019-10-24 13:37:21', 1, 'ativo'),
(401, 'KELLY VIEIRA SOBRAL', '1988-08-03', 'IIIIIIIIIIIIIIIIIIIII', '(11) 95398-6539', 'Jaqueline', 'Auxiliar', 'kellyvieira888@gmail.com', '2019-10-24 22:33:10', 1, 'ativo'),
(402, 'WESLEY FERREIRA DE ALMEIDA ', '1992-01-15', 'RUA VITORIA DO ESPIRITO SANTO Q 501 BL 2A AP 41B', '(11) 95439-1927', 'WAGUERSON', 'Membro', 'WESLEY.FERREIRA.DE.ALMEIDA@HOTMAIL.COM', '2019-10-29 16:59:58', 1, 'ativo'),
(403, 'GLEIDSON LOPES DE OLIVEIRA', '1990-07-08', 'RUA FRANCISCO LOPES DE OLIVEIRA, 661', '(11) 94833-2124', 'GLEIDSON/VANESSA', 'Lider', 'GLEIDSON@DECARINHO.COM.BR', '2019-10-31 21:38:59', 1, 'ativo'),
(404, 'VANESSA BASTOS LOPES', '1991-02-22', 'RUA FRANCISCO LOPES DE OLIVEIRA, 661', '(11) 94991-5474', 'GLEIDSON/VANESSA', 'Lider', 'VANESSA@DECARINHO.COM.BR', '2019-10-31 21:38:59', 1, 'ativo'),
(405, 'GISLAINE RIBEIRO NERES', '1955-05-10', 'rua macaúba mirim, 233 - Jd. dos Ipês', '(11) 96072-5785', 'Prs. Bete/Julho', 'LIDER', 'gih.neres19@gmail.com', '2019-11-14 17:36:22', 1, 'ativo'),
(407, 'DAYANE MARQUIS CUSTÓDIO', '1982-02-28', 'RUA MUTUTI - 171', '(11) 98260-8205', 'Lika', 'Membro', 'dayanebeg175@gmail.com', '2020-01-13 17:09:54', 1, 'ativo'),
(408, 'BRUNA MARQUIS CUSTÓDIO', '2000-07-09', 'RUA MUTUTI - 171', '(11) 97207-6552', 'Lika', 'Membro', 'bruumarquis09@gmail.com', '2020-01-13 17:11:15', 1, 'ativo'),
(409, 'RUAN MARCOS CHAGAS DA SILVA', '2007-09-08', 'RUA JORGE RODRIGUES DE NILZA 300', '(11) 00000-0000', 'Lika', 'Membro', 'naotememail10@hotmail.com', '2020-01-13 17:13:53', 1, 'ativo'),
(410, 'BEATRIZ ALVES MARIETTE  ', '1987-10-11', 'rua curicharas 263', '(11) 98256-4358', 'Lika', 'Membro', 'beatrizmarietterml@gmail.com', '2020-01-13 18:45:18', 1, 'ativo'),
(411, 'DENISE  MICHELE DOS SANTOS PIRES LUZ', '1981-07-13', 'Rua Tarde de Maio,  20', '(11) 99784-1373', 'Lika', 'Auxiliar', 'denise.allanluz@hotmail.com', '2020-01-13 18:49:51', 1, 'ativo'),
(412, 'ALLAN SANTOS LUZ', '1980-07-17', 'RUA TARDE DE MAIO 20', '(11) 98665-4524', 'Lika', 'Auxiliar', 'allan.luz@hotmail.com', '2020-01-13 18:51:45', 1, 'ativo'),
(413, 'EDUARDA SANTOS LUZ  ', '2000-03-29', 'RUA TARDE DE MAIO 20', '(11) 98672-9122', 'Lika', 'Membro', 'eduardaluz5_@hotmail.com', '2020-01-13 18:52:57', 1, 'ativo'),
(414, 'LUÍS FERNANDO SANTOS LUZ ', '2005-08-07', 'RUA TARDE DE MAIO', '(11) 99711-2392', 'Lika', 'Auxiliar', 'luisfernandosantosluz@gmail.com', '2020-01-13 19:18:43', 1, 'ativo'),
(415, 'THAYNA FERNANDADE O SILVA', '1996-08-16', 'ALVARO SANTOS MATOS 151', '(11) 95251-0837', 'Casais', 'Auxiliar', 'THAYNA16PEQUENA48@GMAIL.COM.BR', '2020-01-14 15:09:55', 1, 'ativo'),
(416, 'WELINGTON NASCIMENTOSILVA', '1969-12-31', 'RUA ALVARO SANTOS MATOS 151', '(11) 97051-5181', 'Casais', 'Auxiliar', 'WELLINGTONLIFE@HOTMAIL.COM', '2020-01-14 15:11:05', 1, 'ativo'),
(417, 'JULIA NUNES OLIVEIRA ', '2005-11-23', 'CARAIPÉ DAS AGUAS 649', '(11) 93205-1637', 'Lika', 'Auxiliar', 'juliavivagames@gmail.com', '2020-01-24 00:53:55', 1, 'ativo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `nivel_acesso`
--

CREATE TABLE `nivel_acesso` (
  `id` int(10) NOT NULL,
  `nivel` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Despejando dados para a tabela `nivel_acesso`
--

INSERT INTO `nivel_acesso` (`id`, `nivel`) VALUES
(1, 'Administrativo'),
(2, 'Supervisor'),
(3, 'Pastor'),
(4, 'secretariaEnc'),
(5, 'Apoio'),
(6, 'Curso');

-- --------------------------------------------------------

--
-- Estrutura para tabela `prontMembros`
--

CREATE TABLE `prontMembros` (
  `id` int(10) NOT NULL,
  `membro` int(10) NOT NULL,
  `course1` int(10) DEFAULT NULL,
  `course2` int(10) DEFAULT NULL,
  `course3` int(10) DEFAULT NULL,
  `course4` int(10) DEFAULT NULL,
  `course5` int(10) DEFAULT NULL,
  `course6` int(10) DEFAULT NULL,
  `course7` int(10) DEFAULT NULL,
  `course8` int(10) DEFAULT NULL,
  `course9` int(10) DEFAULT NULL,
  `course10` int(10) DEFAULT NULL,
  `course11` int(10) DEFAULT NULL,
  `course12` int(10) DEFAULT NULL,
  `course13` int(10) DEFAULT NULL,
  `course14` int(10) DEFAULT NULL,
  `course15` int(10) DEFAULT NULL,
  `course16` int(10) DEFAULT NULL,
  `course17` int(10) DEFAULT NULL,
  `course18` int(10) DEFAULT NULL,
  `course19` int(10) DEFAULT NULL,
  `course20` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Estrutura para tabela `reencontrista`
--

CREATE TABLE `reencontrista` (
  `idReencontrista` int(10) NOT NULL,
  `nomeEnc` varchar(45) NOT NULL,
  `telEnc` varchar(15) DEFAULT NULL,
  `observacao` varchar(150) DEFAULT NULL,
  `endEnc` varchar(50) DEFAULT NULL,
  `sexoEnc` varchar(10) DEFAULT NULL,
  `CEM` varchar(25) DEFAULT NULL,
  `cadastrado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `reencontro`
--

CREATE TABLE `reencontro` (
  `id` int(10) NOT NULL,
  `id_reencontrista` int(10) NOT NULL,
  `id_reencontro` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tarefas_equipe`
--

CREATE TABLE `tarefas_equipe` (
  `id` int(5) NOT NULL,
  `funcao_encontro` varchar(10) NOT NULL,
  `cor` varchar(7) DEFAULT '#ffffff'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Despejando dados para a tabela `tarefas_equipe`
--

INSERT INTO `tarefas_equipe` (`id`, `funcao_encontro`, `cor`) VALUES
(1, 'Equipe', '#ffffff');

-- --------------------------------------------------------

--
-- Estrutura para tabela `teste`
--

CREATE TABLE `teste` (
  `id` int(10) NOT NULL,
  `nome` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `turma`
--

CREATE TABLE `turma` (
  `id` int(11) NOT NULL,
  `alunos` int(10) NOT NULL,
  `curso` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `aceita_jesus`
--
ALTER TABLE `aceita_jesus`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `acessoNEW`
--
ALTER TABLE `acessoNEW`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nivel_acesso` (`nivel_acesso`),
  ADD KEY `username` (`username`),
  ADD KEY `userID` (`userID`);

--
-- Índices de tabela `batizando`
--
ALTER TABLE `batizando`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cem` (`cem`);

--
-- Índices de tabela `cem`
--
ALTER TABLE `cem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `responsavel` (`responsavel`);

--
-- Índices de tabela `config_sistem`
--
ALTER TABLE `config_sistem`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `courseName`
--
ALTER TABLE `courseName`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `encontrista`
--
ALTER TABLE `encontrista`
  ADD PRIMARY KEY (`idEncontrista`);

--
-- Índices de tabela `encontro`
--
ALTER TABLE `encontro`
  ADD PRIMARY KEY (`id_encontro`),
  ADD KEY `fk_encontro` (`n_encontro`),
  ADD KEY `fk_enco` (`encontrista`);

--
-- Índices de tabela `equipe`
--
ALTER TABLE `equipe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipe` (`membro`),
  ADD KEY `id` (`encontro`) USING BTREE,
  ADD KEY `tarefaEnc` (`tarefaEnc`);

--
-- Índices de tabela `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `historico`
--
ALTER TABLE `historico`
  ADD PRIMARY KEY (`idHist`),
  ADD KEY `membroCad` (`membroCad`),
  ADD KEY `FK_historico_infocursos` (`curso`);

--
-- Índices de tabela `igrejas`
--
ALTER TABLE `igrejas`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `infocursos`
--
ALTER TABLE `infocursos`
  ADD PRIMARY KEY (`idCursos`);

--
-- Índices de tabela `info_encontro`
--
ALTER TABLE `info_encontro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk` (`n_encontro`);

--
-- Índices de tabela `info_reencontro`
--
ALTER TABLE `info_reencontro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `n_reencontro` (`n_reencontro`);

--
-- Índices de tabela `membros`
--
ALTER TABLE `membros`
  ADD PRIMARY KEY (`idmembros`),
  ADD KEY `email_index` (`email`) USING BTREE,
  ADD KEY `igreja` (`igreja`);

--
-- Índices de tabela `nivel_acesso`
--
ALTER TABLE `nivel_acesso`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `prontMembros`
--
ALTER TABLE `prontMembros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `membro` (`membro`),
  ADD KEY `course2` (`course2`),
  ADD KEY `course3` (`course3`),
  ADD KEY `course4` (`course4`),
  ADD KEY `course1` (`course1`),
  ADD KEY `course5` (`course5`),
  ADD KEY `course6` (`course6`),
  ADD KEY `course7` (`course7`),
  ADD KEY `course8` (`course8`),
  ADD KEY `course9` (`course9`),
  ADD KEY `course10` (`course10`),
  ADD KEY `course11` (`course11`),
  ADD KEY `course12` (`course12`),
  ADD KEY `course13` (`course13`),
  ADD KEY `course14` (`course14`),
  ADD KEY `course15` (`course15`),
  ADD KEY `course16` (`course16`),
  ADD KEY `course17` (`course17`),
  ADD KEY `course18` (`course18`),
  ADD KEY `course19` (`course19`),
  ADD KEY `course20` (`course20`);

--
-- Índices de tabela `reencontrista`
--
ALTER TABLE `reencontrista`
  ADD PRIMARY KEY (`idReencontrista`);

--
-- Índices de tabela `reencontro`
--
ALTER TABLE `reencontro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_reencontro` (`id_reencontro`),
  ADD KEY `reencontro_ibfk_1` (`id_reencontrista`);

--
-- Índices de tabela `tarefas_equipe`
--
ALTER TABLE `tarefas_equipe`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `teste`
--
ALTER TABLE `teste`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `turma`
--
ALTER TABLE `turma`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alunos` (`alunos`),
  ADD KEY `curso` (`curso`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `aceita_jesus`
--
ALTER TABLE `aceita_jesus`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=309;

--
-- AUTO_INCREMENT de tabela `acessoNEW`
--
ALTER TABLE `acessoNEW`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;

--
-- AUTO_INCREMENT de tabela `config_sistem`
--
ALTER TABLE `config_sistem`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `courseName`
--
ALTER TABLE `courseName`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `encontrista`
--
ALTER TABLE `encontrista`
  MODIFY `idEncontrista` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=615;

--
-- AUTO_INCREMENT de tabela `encontro`
--
ALTER TABLE `encontro`
  MODIFY `id_encontro` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=625;

--
-- AUTO_INCREMENT de tabela `equipe`
--
ALTER TABLE `equipe`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de tabela `historico`
--
ALTER TABLE `historico`
  MODIFY `idHist` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=589;

--
-- AUTO_INCREMENT de tabela `igrejas`
--
ALTER TABLE `igrejas`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `infocursos`
--
ALTER TABLE `infocursos`
  MODIFY `idCursos` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `info_encontro`
--
ALTER TABLE `info_encontro`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `info_reencontro`
--
ALTER TABLE `info_reencontro`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `membros`
--
ALTER TABLE `membros`
  MODIFY `idmembros` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=418;

--
-- AUTO_INCREMENT de tabela `nivel_acesso`
--
ALTER TABLE `nivel_acesso`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `prontMembros`
--
ALTER TABLE `prontMembros`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `reencontrista`
--
ALTER TABLE `reencontrista`
  MODIFY `idReencontrista` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `reencontro`
--
ALTER TABLE `reencontro`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tarefas_equipe`
--
ALTER TABLE `tarefas_equipe`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `teste`
--
ALTER TABLE `teste`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `turma`
--
ALTER TABLE `turma`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `acessoNEW`
--
ALTER TABLE `acessoNEW`
  ADD CONSTRAINT `acessoNEW_ibfk_1` FOREIGN KEY (`nivel_acesso`) REFERENCES `nivel_acesso` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `acessoNEW_ibfk_2` FOREIGN KEY (`username`) REFERENCES `membros` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `acessoNEW_ibfk_3` FOREIGN KEY (`userID`) REFERENCES `membros` (`idmembros`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `batizando`
--
ALTER TABLE `batizando`
  ADD CONSTRAINT `batizando_ibfk_1` FOREIGN KEY (`cem`) REFERENCES `cem` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `cem`
--
ALTER TABLE `cem`
  ADD CONSTRAINT `cem_ibfk_1` FOREIGN KEY (`responsavel`) REFERENCES `membros` (`idmembros`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `encontro`
--
ALTER TABLE `encontro`
  ADD CONSTRAINT `fk_enco` FOREIGN KEY (`encontrista`) REFERENCES `encontrista` (`idEncontrista`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_encontro` FOREIGN KEY (`n_encontro`) REFERENCES `info_encontro` (`n_encontro`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `equipe`
--
ALTER TABLE `equipe`
  ADD CONSTRAINT `equipe_ibfk_1` FOREIGN KEY (`membro`) REFERENCES `membros` (`idmembros`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equipe_ibfk_2` FOREIGN KEY (`encontro`) REFERENCES `info_encontro` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equipe_ibfk_3` FOREIGN KEY (`tarefaEnc`) REFERENCES `tarefas_equipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `historico`
--
ALTER TABLE `historico`
  ADD CONSTRAINT `FK_historico_infocursos` FOREIGN KEY (`curso`) REFERENCES `infocursos` (`idCursos`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_historico_membros` FOREIGN KEY (`membroCad`) REFERENCES `membros` (`idmembros`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `membros`
--
ALTER TABLE `membros`
  ADD CONSTRAINT `membros_ibfk_1` FOREIGN KEY (`igreja`) REFERENCES `igrejas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `prontMembros`
--
ALTER TABLE `prontMembros`
  ADD CONSTRAINT `prontMembros_ibfk_1` FOREIGN KEY (`membro`) REFERENCES `membros` (`idmembros`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_10` FOREIGN KEY (`course9`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_11` FOREIGN KEY (`course10`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_12` FOREIGN KEY (`course11`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_13` FOREIGN KEY (`course12`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_14` FOREIGN KEY (`course13`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_15` FOREIGN KEY (`course14`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_16` FOREIGN KEY (`course15`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_17` FOREIGN KEY (`course16`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_18` FOREIGN KEY (`course17`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_19` FOREIGN KEY (`course18`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_2` FOREIGN KEY (`course1`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_20` FOREIGN KEY (`course19`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_21` FOREIGN KEY (`course20`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_3` FOREIGN KEY (`course2`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_4` FOREIGN KEY (`course3`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_5` FOREIGN KEY (`course4`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_6` FOREIGN KEY (`course5`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_7` FOREIGN KEY (`course6`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_8` FOREIGN KEY (`course7`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prontmembros_9` FOREIGN KEY (`course8`) REFERENCES `courseName` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `reencontro`
--
ALTER TABLE `reencontro`
  ADD CONSTRAINT `reencontro_ibfk_1` FOREIGN KEY (`id_reencontrista`) REFERENCES `reencontrista` (`idReencontrista`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reencontro_ibfk_2` FOREIGN KEY (`id_reencontro`) REFERENCES `info_reencontro` (`n_reencontro`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `turma`
--
ALTER TABLE `turma`
  ADD CONSTRAINT `turma_ibfk_1` FOREIGN KEY (`alunos`) REFERENCES `membros` (`idmembros`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `turma_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `infocursos` (`idCursos`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
