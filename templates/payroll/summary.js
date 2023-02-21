module.exports = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resumen de nómina</title>
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
      vertical-align: text-top;
    }
    .table-header {
      padding: 3px;
      border: solid 1px rgba(0, 0, 0, 0.7);
      /* background-color: rgba(0, 0, 0, 0.3); */
    }
    .table-header .row-1>div {
      display: inline-block;
      text-align: center;
      width: 49%;
      font-weight: bold;
      font-size: 10px;
    }
    .table-header .row-2>div {
      display: inline-block;
      text-align: center;
      width: 49%;
    }
    .table-header .row-2>div>div {
      display: inline-block;
      width: 25%;
      text-align: center;
      font-weight: bold;
    }
    .table-header .row-2>div>div:nth-child(2) {
      width: 48%;
    }
    .table-row {
      padding: 3px;
    }
    .table-row>div {
      display: inline-block;
      width: 49%;
      vertical-align: top;
    }
    .table-row.t-2>div>div>div {
      font-size: 10px;
      font-weight: bold;
    }
    .table-row .d {
      border-left: solid 1px black;
    }
    .table-row>div>div {
      margin-top: 3px;
    }
    .table-row>div>div>div {
      display: inline-block;
      width: 25%;
      text-align: center;
    }
    .table-row>div>div>div:nth-child(2) {
      width: 48%;
    }
    .table-row.t-3>div {
      width: 24%;
      display: inline-block;
      text-align: right;
      font-size: 12px;
      font-weight: bold;
    }
    .table-row.t-3 {
      border-bottom: solid 1px black;
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
        <b>Periodo</b>
        <span>{{ period }}</span>
      </div>
      <div>
        <b>Tipo</b>
        <span>Resumen de nómina</span>
      </div>
    </div>
    <div class="row">
      <div>
        <b>RFC</b>
        <span>{{ rfc }}</span>
      </div>
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
    <div class="row-1">
      <div>PERCEPCIONES</div>
      <div>DEDUCCIONES</div>
    </div>
    <div class="row-2">
      <div>
        <div>Clave</div>
        <div>Descripción</div>
        <div>Importe</div>
      </div>
      <div>
        <div>Clave</div>
        <div>Descripción</div>
        <div>Importe</div>
      </div>
    </div>
  </div>
  <div class="table-row">
    <div class="p">
      {{#each perceptions}}
        <div>
          <div>
            {{ this.key }}
          </div>
          <div>
            {{ this.description }}
          </div>
          <div>
            {{ this.amount }}
          </div>
        </div>
      {{/each}}
    </div>
    <div class="d">
      {{#each deductions}}
        <div>
          <div>
            {{ this.key }}
          </div>
          <div>
            {{ this.description }}
          </div>
          <div>
            {{ this.amount }}
          </div>
        </div>
      {{/each}}
    </div>
  </div>
  <div class="table-row t-2">
    <div>
      <div>
        <div></div>
        <div></div>
        <div>{{ totalPerceptions }}</div>
      </div>
    </div>
    <div>
      <div>
        <div></div>
        <div></div>
        <div>{{ totalDeductions }}</div>
      </div>
    </div>
  </div>
  <div class="table-row t-3">
    <div></div>
    <div></div>
    <div>Neto a pagar</div>
    <div>{{ netToPay }}</div>
  </div>
</body>
</html>
`