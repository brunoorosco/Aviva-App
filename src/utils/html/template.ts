export const htmlPdf = (nome: string, data: string) => `
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Aleo&family=Open+Sans:wght@300&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap" rel="stylesheet">

    <title>Pdf Converte</title>
    <style rel="stylesheet">
        body {
            background-image: url("http://localhost:3000/template.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-size: 100%;
            align-items: center;
            align-content: center;
        }
        
        .nome {
            color: #2b4961;
            text-align: center;
            font-size: 30px;
            font-family: 'Aleo';
            margin-top: 4px;
            font-weight: 500;
        }
        
        .data {
            font-family: 'Open Sans', sans-serif;
            font-weight: 300;
            font-size: 20px;
            text-align: center;
            margin-top: 3px;
            padding: 0;
            color: #2b4961;
        }
        
        .container {
            position: fixed;
            top: 210px;
            left: 20px;
            width: 740px;
            height: 90px;
        }
    </style>

</head>

<body>
    <div class="container">
        <p class="data">${data}</p>
        <p class="nome">${nome}</p>
    </div>
</body>

</html>`
