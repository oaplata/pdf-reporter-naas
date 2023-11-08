// const AWS = require('aws-sdk');
const express = require('express');
const pdf = require('pdf-creator-node');
const jszip = require('jszip');
const app = express();
const htmlPayMethods = require('./templates/payroll/pay-methods');
const htmlSummary = require('./templates/payroll/summary');
const htmlRegistry = require('./templates/payroll/registry');


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
    html: htmlPayMethods,
    data: {
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
      periodicity: (payroll.payrollInfo && payroll.payrollInfo.periodicity) || "",
      process: payroll.summary.payrollType,
      startDate: payroll.summary.periodInitDate,
      endDate: payroll.summary.periodFinalDate,
      perceptions: payroll.summary.earningDetails,
      deductions: payroll.summary.wDeductionDetails,
      totalPerceptions: formatMoney(+payroll.summary.totalEarnings),
      totalDeductions: formatMoney(+payroll.summary.totalWageDeductions),
      netToPay: formatMoney(+payroll.summary.netToPay),
      activeEmployees: 0,
      settlementEmployees: 0,
      totalEmployees: 0,
      prosecutedEmployees: 0,
      registroPatronal: 0,
      imssCoutaFijaEmpresa: 0,
      imssCoutaFijaEmpleado: 0,
      imssCesantiaYVejesEmpresa: 0,
      imssCesantiaYVejesEmpleado: 0,
      imssExcedenteEmpresa: 0,
      imssExcedenteEmpleado: 0,
      imssGastosMedicosPensionesEmpresa: 0,
      imssGastosMedicosPensionesEmpleado: 0,
      imssGuarderiaEmpresa: 0,
      imssGuarderiaEmpleado: 0,
      imssInvalidezYVidaEmpresa: 0,
      imssInvalidezYVidaEmpleado: 0,
      imssPrestacionesEnDineroEmpresa: 0,
      imssPrestacionesEnDineroEmpleado: 0,
      imssRTEmpresa: 0,
      imssRTEmpleado: 0,
      imssObligacionFondoDeRetiro: 0,
      imssObligacionImpuestoEstatal: 0,
      imssObligacionImssEmpresa: 0,
      imssObligacionInfonavitEmpresa: 0,
      imssObligacionTotal: 0,
      imssVacations: 0,
      imssVacationsBonus: 0,
      imssChristmasBonus: 0,
    },
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


  const BufferPayMethods = await pdf.create(documentPayMethods, options);
  const BufferSummary = await pdf.create(documentSummary, options);
  const BufferRegistry = await pdf.create(documentRegistry, options);

  // jszip tow buffers
  const zip = new jszip();
  zip.file("formas-de-pago.pdf", BufferPayMethods);
  zip.file("resumen.pdf", BufferSummary);
  zip.file("registro.pdf", BufferRegistry);

  // generate zip
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return zipBuffer;
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

app.listen(3000, () => {
  console.log('Server started');
});
