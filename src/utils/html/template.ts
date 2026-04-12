export const htmlPdf = (nome: string, data: string, backgroundImage?: string) => `
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Aleo&family=Open+Sans:wght@300&display=swap" rel="stylesheet">

    <title>Certificado</title>
    <style rel="stylesheet">
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            width: 297mm;
            height: 210mm;
            background-image: url("${backgroundImage || "http://localhost:3000/template.png"}");
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        
        .nome {
            color: #2b4961;
            text-align: center;
            font-size: 42px;
            font-family: 'Aleo';
            margin-top: 5px;
            font-weight: 500;
        }
        
        .data {
            font-family: 'Open Sans', sans-serif;
            font-weight: 300;
            font-size: 24px;
            text-align: center;
            margin-top: 0;
            padding: 0;
            color: #2b4961;
        }
        
        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -10%);
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
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

export const htmlMultiCertificados = (batizandos: { nome: string }[], data: string, backgroundImage: string) => `
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Aleo&family=Open+Sans:wght@300&display=swap" rel="stylesheet">

    <title>Certificados</title>
    <style rel="stylesheet">
        @page {
            size: A4 landscape;
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 297mm;
        }
        .page {
            width: 297mm;
            height: 210mm;
            position: relative;
            background-image: url("${backgroundImage}");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            page-break-after: always;
        }
        .page:last-child {
            page-break-after: auto;
        }
        
        .nome {
            color: #2b4961;
            text-align: center;
            font-size: 42px;
            font-family: 'Aleo';
            margin-top: -100px;
            font-weight: 500;
        }
        
        .data {
            font-family: 'Open Sans', sans-serif;
            font-weight: 300;
            font-size: 24px;
            text-align: center;
            margin-top: 0;
            padding: 0;
            color: #2b4961;
        }
        
        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -10%);
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>

<body>
    ${batizandos.map(pessoa => `
    <div class="page">
        <div class="container">
            <p class="data">${data}</p>
            <p class="nome">${pessoa.nome}</p>
        </div>
    </div>
    `).join('')}
</body>

</html>`

