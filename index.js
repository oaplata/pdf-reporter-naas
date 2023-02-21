// const AWS = require('aws-sdk');
const express = require('express');
const pdf = require('pdf-creator-node');
const jszip = require('jszip');
const app = express();
const config = require('./.data.js');
const htmlPayMethods = require('./templates/payroll/pay-methods');
const htmlSummary = require('./templates/payroll/summary');

// // configure aws s3
// AWS.config.update({ region: 'us-east-1' });
// const s3 = new AWS.S3({
//   accessKeyId: config.accessKeyId,
//   secretAccessKey: config.secretAccessKey,
// });

const generatePDFs = async (payroll, employees) => {
  const towDigits = (number) => {
    return number < 10 ? "0" + number : number;
  }
  
  const formatMoney = (number) => {
    return "$ " + number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const full_date = new Date();

  // format date DD/MM/YYYY
  const date = towDigits(full_date.getDate()) + "/" + towDigits(full_date.getMonth() + 1) + "/" + full_date.getFullYear();

  // format date HH:mm
  const time = towDigits(full_date.getHours()) + ":" + towDigits(full_date.getMinutes());

  const payrollDay = +payroll.summary.periodInitDate.split("/")[0];
  const payrollMonth = +payroll.summary.periodInitDate.split("/")[1] - 1;
  const payrollYear = +payroll.summary.periodInitDate.split("/")[2];


  const payrollDate = new Date(payrollYear, payrollMonth, payrollDay);


  // pay methods
  const documentPayMethods = {
    html: htmlPayMethods,
    data: {
      date,
      time,
      businessName: payroll.summary.naas.name,
      rfc: payroll.summary.naas.rfc,
      period: payroll.summary.period + " / " + payrollDate.getFullYear(),
      periodicity: payroll.payrollInfo.periodicity,
      process: payroll.summary.payrollType,
      startDate: payroll.summary.periodInitDate,
      endDate: payroll.summary.periodFinalDate,
      employees: employees.map(e => ({
        name: e.fName + " " + e.lName + " " + e.sLName,
        rfc: e.rfc,
        netToPay: e.netToPay,
        clabe: e.clabe,
      })),
      employeesCount: employees.length,
      netToPay: formatMoney(payroll.summary.netToPay),
    },
    type: "buffer",
  };

  // summary
  const documentSummary = {
    html: htmlSummary,
    data: {
      date,
      time,
      businessName: payroll.summary.naas.name,
      rfc: payroll.summary.naas.rfc,
      period: payroll.summary.period + " / " + payrollDate.getFullYear(),
      periodicity: payroll.payrollInfo.periodicity,
      process: payroll.summary.payrollType,
      startDate: payroll.summary.periodInitDate,
      endDate: payroll.summary.periodFinalDate,
      perceptions: payroll.summary.earningDetails,
      deductions: payroll.summary.wDeductionDetails,
      totalPerceptions: formatMoney(+payroll.summary.totalEarnings),
      totalDeductions: formatMoney(+payroll.summary.totalWageDeductions),
      netToPay: formatMoney(+payroll.summary.netToPay),
    },
    type: "buffer",
  };

  const options = {
    format: "A4",
    orientation: "landscape",
  };


  const BufferPayMethods = await pdf.create(documentPayMethods, options);
  const BufferSummary = await pdf.create(documentSummary, options);

  // jszip tow buffers
  const zip = new jszip();
  zip.file("formas-de-pago.pdf", BufferPayMethods);
  zip.file("resumen.pdf", BufferSummary);

  // generate zip
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return zipBuffer;

  // // upload zip to s3
  // const params = {
  //   Bucket: config.bucket,
  //   Key: "pdfs/nomina-" + payroll.id + ".zip",
  //   Body: zipBuffer,
  // };
  // const s3Result = await s3.upload(params).promise();
  // return s3Result;
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/', async (req, res) => {
  const zipBuffer = await generatePDFs(req.body.payroll, req.body.employees);

  // Establecer encabezados para la respuesta
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=nomina-' + req.body.payroll.id + '.zip');

  // Enviar el archivo como descarga en la respuesta
  res.send(zipBuffer);
});

app.listen(80, () => {
  console.log('Server started');
});
