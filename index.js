// const AWS = require('aws-sdk');
const puppeteer = require('puppeteer');
const express = require('express');
const pdf = require('pdf-creator-node');
const jszip = require('jszip');
const app = express();
const htmlPayMethods = require('./templates/payroll/pay-methods');
const htmlSummary = require('./templates/payroll/summary');
const htmlRegistry = require('./templates/payroll/registry');
const htmlSettlementLetter = require('./templates/settlement/settlementLetter');


async function htmlToPDFBuffer(html, landscape = false) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);

    // Genera el PDF y lo obtiene como buffer
    const pdfBuffer = await page.pdf({ format: 'A4', landscape });

    await browser.close();
    return pdfBuffer;
}


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

  let payrollDay = +payroll.summary.periodInitDate.split("/")[0];
  let payrollMonth = +payroll.summary.periodInitDate.split("/")[1] - 1;
  let payrollYear = +payroll.summary.periodInitDate.split("/")[2];

  if (payroll.summary.periodInitDate.includes("-")) {
    payrollDay = +(payroll.summary.periodInitDate.split("-")[2]);
    payrollMonth = +(payroll.summary.periodInitDate.split("-")[1]) - 1;
    payrollYear = +(payroll.summary.periodInitDate.split("-")[0]);
  } else if (payroll.summary.periodInitDate.includes("/")) {
    payrollDay = +(payroll.summary.periodInitDate.split("/")[0]);
    payrollMonth = +(payroll.summary.periodInitDate.split("/")[1]) - 1;
    payrollYear = +(payroll.summary.periodInitDate.split("/")[2]);
  }


  const payrollDate = new Date(payrollYear, payrollMonth, payrollDay);


  // pay methods
  const documentPayMethods = {
    html: htmlPayMethods({
      date,
      time,
      businessName: payroll.summary.naas.name,
      rfc: payroll.summary.naas.rfc,
      period: payroll.summary.period,
      periodicity: (payroll.payrollInfo && payroll.payrollInfo.periodicity) || "",
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
    }),
    type: "buffer",
  };

  // summary
  const documentSummary = {
    html: htmlSummary({
      date,
      time,
      businessName: payroll.summary.naas.name,
      rfc: payroll.summary.naas.rfc,
      period: payroll.summary.period + " / " + payrollDate.getFullYear(),
      periodicity: (payroll.payrollInfo && payroll.payrollInfo.periodicity) || "",
      process: payroll.summary.payrollType,
      startDate: payroll.summary.periodInitDate,
      endDate: payroll.summary.periodFinalDate,
      perceptions: payroll.summary.earningDetails,
      deductions: payroll.summary.wDeductionDetails,
      totalPerceptions: formatMoney(+payroll.summary.totalEarnings),
      totalDeductions: formatMoney(+payroll.summary.totalWageDeductions),
      netToPay: formatMoney(+payroll.summary.netToPay),
      activeEmployees: payroll.activeEmployees || 0,
      settlementEmployees: payroll.settlementEmployees || 0,
      totalEmployees: payroll.totalEmployees || 0,
      prosecutedEmployees: payroll.prosecutedEmployees || 0,
      registroPatronal: payroll.registroPatronal || "",
      imssCoutaFijaEmpresa: formatMoney(payroll.imssCoutaFijaEmpresa || 0),
      imssCoutaFijaEmpleado: formatMoney(payroll.imssCoutaFijaEmpleado || 0),
      imssCesantiaYVejesEmpresa: formatMoney(payroll.imssCesantiaYVejesEmpresa || 0),
      imssCesantiaYVejesEmpleado: formatMoney(payroll.imssCesantiaYVejesEmpleado || 0),
      imssExcedenteEmpresa: formatMoney(payroll.imssExcedenteEmpresa || 0),
      imssExcedenteEmpleado: formatMoney(payroll.imssExcedenteEmpleado || 0),
      imssGastosMedicosPensionesEmpresa: formatMoney(payroll.imssGastosMedicosPensionesEmpresa || 0),
      imssGastosMedicosPensionesEmpleado: formatMoney(payroll.imssGastosMedicosPensionesEmpleado || 0),
      imssGuarderiaEmpresa: formatMoney(payroll.imssGuarderiaEmpresa || 0),
      imssGuarderiaEmpleado: formatMoney(payroll.imssGuarderiaEmpleado || 0),
      imssInvalidezYVidaEmpresa: formatMoney(payroll.imssInvalidezYVidaEmpresa || 0),
      imssInvalidezYVidaEmpleado: formatMoney(payroll.imssInvalidezYVidaEmpleado || 0),
      imssPrestacionesEnDineroEmpresa: formatMoney(payroll.imssPrestacionesEnDineroEmpresa || 0),
      imssPrestacionesEnDineroEmpleado: formatMoney(payroll.imssPrestacionesEnDineroEmpleado || 0),
      imssRTEmpresa: formatMoney(payroll.imssRTEmpresa || 0),
      imssRTEmpleado: formatMoney(payroll.imssRTEmpleado || 0),
      imssObligacionFondoDeRetiro: formatMoney(payroll.imssObligacionFondoDeRetiro || 0),
      imssObligacionImpuestoEstatal: formatMoney(payroll.imssObligacionImpuestoEstatal || 0),
      imssObligacionImssEmpresa: formatMoney(payroll.imssObligacionImssEmpresa || 0),
      imssObligacionInfonavitEmpresa: formatMoney(payroll.imssObligacionInfonavitEmpresa || 0),
      imssObligacionTotal: formatMoney(payroll.imssObligacionTotal || 0),
      imssVacations: formatMoney(payroll.imssVacations || 0),
      imssVacationsBonus: formatMoney(payroll.imssVacationsBonus || 0),
      imssChristmasBonus: formatMoney(payroll.imssChristmasBonus || 0),
    }),
    type: "buffer",
  };

  // registry
  const documentRegistry = {
    html: htmlRegistry({
      date,
      time,
      businessName: payroll.summary.naas.name,
      rfc: payroll.summary.naas.rfc,
      period: payroll.summary.period + " / " + payrollDate.getFullYear(),
      periodicity: (payroll.payrollInfo && payroll.payrollInfo.periodicity) || "",
      process: payroll.summary.payrollType,
      startDate: payroll.summary.periodInitDate,
      endDate: payroll.summary.periodFinalDate,
      totalEmployees: employees.length,
      employees: employees.map(e => ({
        rfc: e.rfc,
        name: e.fName + " " + e.lName + " " + e.sLName,
        curp: e.curp,
        nss: e.nss,
        aniversary: e.aniversary,
        dailySalary: e.dailySalary,
        sdi: e.sdi,
        listIncidences: e.listIncidences,
        listDeductions: e.listDeductions,
        totalEarnings: e.totalEarnings,
        totalWageDeductions: e.totalWageDeductions,
        netToPay: e.netToPay,
      })),
      netToPay: formatMoney(+payroll.summary.netToPay),
    }),
    data: {},
    type: "buffer",
  }

  const options = {
    format: "A4",
    orientation: "landscape",
  };


  const BufferPayMethods = await htmlToPDFBuffer(documentPayMethods.html, true);
  const BufferSummary = await htmlToPDFBuffer(documentSummary.html, true);
  const BufferRegistry = await htmlToPDFBuffer(documentRegistry.html, true);

  // const BufferPayMethods = await pdf.create(documentPayMethods, options);
  // const BufferSummary = await pdf.create(documentSummary, options);
  // const BufferRegistry = await pdf.create(documentRegistry, options);

  // jszip tow buffers
  const zip = new jszip();
  zip.file("formas-de-pago.pdf", BufferPayMethods);
  zip.file("resumen.pdf", BufferSummary);
  zip.file("registro.pdf", BufferRegistry);

  // generate zip
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return zipBuffer;
}

const generateSettlementLetter = async (data) => {
  const documentSettlementLetter = {
    html: htmlSettlementLetter({
      clientName: data.clientName,
      fechaImpresion: data.fechaImpresion,
      fechaIngreso: data.fechaIngreso,
      rfc: data.rfc,
      fechaBaja: data.fechaBaja,
      nombreCompleto: data.nombreCompleto,
      diasTrabajados: data.diasTrabajados,
      puesto: data.puesto,
      sueldoMensual: data.sueldoMensual,
      percepciones: data.percepciones,
      deducciones: data.deducciones,
      totalPercepciones: data.totalPercepciones,
      totalDeducciones: data.totalDeducciones,
      net: data.net,
      netLetras: data.netLetras,
    }),
    data: {},
    type: "buffer",
  }

  const options = {
    format: "A4",
    orientation: "",
  };

  const BufferSettlementLetter = await htmlToPDFBuffer(documentSettlementLetter.html);
  // const BufferSettlementLetter = await pdf.create(documentSettlementLetter, options);

  // // jszip tow buffers
  // const zip = new jszip();
  // zip.file("liquidacion.pdf", BufferSettlementLetter);
  
  // // generate zip
  // const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return BufferSettlementLetter;
}


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json({ limit: '200mb' }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/', async (req, res) => {
  const zipBuffer = await generatePDFs(req.body.payroll, req.body.employees);

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=nomina-' + req.body.payroll.id + '.zip');

  res.send(zipBuffer);
});

app.post('/settlemet-letter', async (req, res) => {
  const zipBuffer = await generateSettlementLetter(req.body);

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=liquidacion.zip');

  res.send(zipBuffer);
});

app.post('/tradingwiew', async (req, res) => {
  console.log(JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
  }, null, 2));
  res.send('ok');
});

app.listen(process.env.PORT, () => {
  console.log('Server started');
});
