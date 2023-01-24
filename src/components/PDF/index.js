// import React from "react";
// import pdf from "html-pdf"
// import fs from "fs"
// const html = fs.readFileSync('./test/businesscard.html', 'utf8');

// export default function PDF() {

//        const options = {
//         format: 'A4',
//         orientation: 'portrait',
//         border: '10mm',
//         footer: {
//             height: '10mm',
//         },
//         type: 'pdf',
//         timeout: 30000,
//     };

//     const buffer = pdf.create(html, options).toFile('./businesscard.pdf', function (err, res) {
//         if (err) return console.log(err);
//         console.log(res); // { filename: '/app/businesscard.pdf' }
//     });

//     return (
//         <>
//             <div
//                 id="pageFooter"
//                 style={{
//                     fontSize: '10px',
//                     color: '#666'
//                 }}
//             >
//                 This is a sample footer
//             </div>
//         </>
//     )

// }

var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./businesscard.html', 'utf8');
var options = { format: 'A4' };

pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});