export const html = (name: string, qrCode: string) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="src/style.css">

  <style type="text/css">
    table,
    td,
    div,
    h1,
    p {
      font-family: Arial, sans-serif;
    }

    @media screen and (max-width: 530px) {
      .unsub {
        display: block;
        padding: 8px;
        margin-top: 14px;
        border-radius: 6px;
        background-color: #555555;
        text-decoration: none !important;
        font-weight: bold;
      }

      .col-lge {
        max-width: 100% !important;
      }
    }

    @media screen and (min-width: 531px) {
      .col-sml {
        max-width: 27% !important;
      }

      .col-lge {
        max-width: 73% !important;
      }
    }
  </style>
</head>

  <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
    <div role="article" aria-roledescription="email" lang="en"
      style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">
      <table role="presentation" style="width:100%;border:none;border-spacing:0;">
        <tr>
          <td align="center" style="padding:0;">
            <table role="presentation"
              style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
              <tr>
                <td style="padding:20px 30px 20px 30px;text-align:center;font-size:24px;font-weight:bold;">                  
                  <img src="cid:logo" width="165">
                </td>
              </tr>
              <tr  style="text-align: center;">
                <td style="padding:30px;background-color:#ffffff;">
                  <h1
                    style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">
                    Inscrição realizada com sucesso!!!</h1>
                  <p style="margin:0;">${name}, sua presença será registrada pelo qrcode logo abaixo, este qrcode é único para todo este modulo da escola de profeta.
                  Não perca ou apague este e-mail.
                  </p>
                </td>
              </tr>
              <tr style="text-align: center;">
                <td style="padding:0;margin: 0 auto;font-size:24px;line-height:28px;font-weight:bold;background-color:#ffffff;">
                <img src="cid:img" />
                </td>
              </tr>
              
            
            </table>
          </td>
        </tr>
      </table>
    </div>

  </body>

</html>`
