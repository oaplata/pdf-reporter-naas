module.exports = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FORMAS DE PAGO</title>
  <style>
    * {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8px;
      border: 0;
      margin: 0;
      box-sizing: border-box;
    }
    .date-time {
      width: 100%;
      text-align: right;
    }
    .header .row, .table-footer {
      padding: 3px;
    }
    .header .row>div {
      width: 33%;
      display: inline-block;
    }
    .table-header {
      padding: 3px;
      border: solid 1px rgba(0, 0, 0, 0.7);
      background-color: rgba(0, 0, 0, 0.3);
    }
    .table-row {
      padding: 3px;
    }
    .table-header>div {
      display: inline-block;
      text-align: center;
    }
    .table-row>div {
      display: inline-block;
      text-align: center;
    }
    .table-header .rfc {
      width: 13%;
    }
    .table-header .employee-name {
      width: 33%;
    }
    .table-header .bank-key {
      width: 23%;
    }
    .table-header .salary {
      width: 23%;
    }
    .table-row .rfc {
      width: 13%;
    }
    .table-row .employee-name {
      width: 33%;
    }
    .table-row .bank-key {
      width: 23%;
    }
    .table-row .salary {
      width: 23%;
    }
    .table-footer .employees {
      width: 72%;
      display: inline-block;
      text-align: center;
    }
    .table-footer .total {
      width: 23%;
      display: inline-block;
      border-top: solid 1px black;
    }
  </style>
</head>
<body>
  <div class="date-time">
    <b>Fecha:</b> {{ date }}<br />
    <b>Hora:</b> {{ time }} 
  </div>
  <div class="header">
    <div class="row">
      <div>
        <b>Razon Social</b>
        <span>{{ businessName }}</span>
      </div>
      <div>
        <b>Tipo</b>
        <span>Formas de Pago</span>
      </div>
      <div></div>
    </div>
    <div class="row">
      <div>
        <b>RFC</b>
        <span>{{ rfc }}</span>
      </div>
      <div>
        <b>Periodo</b>
        <span>{{ period }}</span>
      </div>
      <div>
        <b>Periodicidad</b>
        <span>{{ periodicity }}</span>
      </div>
    </div>
    <div class="row">
      <div></div>
      <div>
        <b>Proceso</b>
        <span>{{ process }}</span>
      </div>
      <div>
        <b>Del</b>
        <span>{{ startDate }}</span>
        <b>Al</b>
        <span>{{ endDate }}</span>
      </div>
    </div>
  </div>
  <div class="table-header">
    <div class="rfc">
      RFC
    </div>
    <div class="employee-name">
      Nombre de empleado
    </div>
    <div class="bank-key">
      Clabe interbancaria
    </div>
    <div class="salary">
      Sueldo neto
    </div>
  </div>
  {{#each employees}}
    <div class="table-row">
      <div class="rfc">
        {{ this.rfc }}
      </div>
      <div class="employee-name">
        {{ this.name }}
      </div>
      <div class="bank-key">
        {{ this.clabe }}
      </div>
      <div class="salary">
        {{ this.netToPay }}
      </div>
    </div>
  {{/each}}
  <div class="table-footer">
    <div class="employees">
      <b>No. de empleados: </b>
      <span>{{ employeesCount }}</span>
    </div>
    <div class="total">
      <b>Total</b>
      <span>{{ netToPay }}</span>
    </div>
  </div>
</body>
</html>
`