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
    body {
      margin: 20px;
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
      background-color: #fb8c00;
      /* color: white; */
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
    .imss {
      padding-left: 10%;
      padding-right: 10%;
      margin-top: 10px;
    }
    .imss .row {
      width: 100%;
    }

    .imss .row .col {
      display: inline-block;
      width: 48%;
    }

    .imss .row .col:first-child {
      margin-right: 1%;
    }

    .imss .employeesSumary .col>div {
      margin-bottom: 8px;
      position: relative;
      height: 10px;
    }

    .imss .employeesSumary .col>div b {
      position: absolute;
      left: 0;
    }

    .imss .employeesSumary .col>div span {
      position: absolute;
      right: 0;
    }

    .border-top {
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
  <div class="imss">
    <div class="row employeesSumary">
      <div class="col">
        <div>
          <b>Empleados Activos</b>
          <span>{{ activeEmployees }}</span>
        </div>
        <div>
          <b>Finiquitados</b>
          <span>{{ settlementEmployees }}</span>
        </div>
        <div class="border-top">
          <b>Total de Empleados</b>
          <span>{{ totalEmployees }}</span>
        </div>
      </div>
      <div class="col">
        <div>
          <b>Empleados procesados</b>
          <span>{{ prosecutedEmployees }}</span>
        </div>
      </div>
    </div>
    <br><br><br>
    <div class="row employeesSumary">
      <div class="col">
        <div>
          <b>Regitro Patronal</b>
          <span>{{ registroPatronal }}</span>
        </div>
      </div>
      <div class="col"></div>
    </div>
    <br><br><br>
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col">
            <b>Rubros del I.M.S.S</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">
                <b>Empresa</b>
              </div>
              <div class="col">
                <b>Empleado</b>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b>Cuota fija</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">{{ imssCoutaFijaEmpresa }}</div>
              <div class="col">{{ imssCoutaFijaEmpleado }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b>Cesantia y Vejes</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">{{ imssCesantiaYVejesEmpresa }}</div>
              <div class="col">{{ imssCesantiaYVejesEmpleado }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b>Excedente</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">{{ imssExcedenteEmpresa }}</div>
              <div class="col">{{ imssExcedenteEmpleado }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b>Gastos Médicos Pensionados</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">{{ imssExcedenteEmpresa }}</div>
              <div class="col">{{ imssExcedenteEmpleado }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b>Guarderia y Gastos. Prev. Soc.</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">{{ imssGuarderiaEmpresa }}</div>
              <div class="col">{{ imssGuarderiaEmpleado }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b>Invalidez y Vida</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">{{ imssInvalidezYVidaEmpresa }}</div>
              <div class="col">{{ imssInvalidezYVidaEmpleado }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b>Prestaciones en Dinero</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">{{ imssPrestacionesEnDineroEmpresa }}</div>
              <div class="col">{{ imssPrestacionesEnDineroEmpleado }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b>RT</b>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">{{ imssRTEmpresa }}</div>
              <div class="col">{{ imssRTEmpleado }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col">
            <b>Obligación</b>
            <div class="row">
              <div class="col">
                <b>Fondo de retiro</b>
              </div>
              <div class="col">
                {{ imssObligacionFondoDeRetiro }}
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b>Impuesto Estatal</b>
              </div>
              <div class="col">
                {{ imssObligacionImpuestoEstatal }}
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b>I.M.S.S Empresa</b>
              </div>
              <div class="col">
                {{ imssObligacionImssEmpresa }}
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b>Infonavit Empresa</b>
              </div>
              <div class="col">
                {{ imssObligacionInfonavitEmpresa }}
              </div>
            </div>
            <br>
            <div class="row border-top">
              <div class="col">
                <b>Total de Obligaciones</b>
              </div>
              <div class="col">
                {{ imssObligacionTotal }}
              </div>
            </div>
          </div>
          <div class="col">
            <div><b>Otras Provisiones</b></div>
            <div class="row">
              <div class="col">
                <b>Vacaciones</b>
              </div>
              <div class="col">
                {{ imssVacations }}
              </div>
              <div class="col"></div>
            </div>
            <div class="row">
              <div class="col">
                <b>Prima Vacacional</b>
              </div>
              <div class="col">
                {{ imssVacationsBonus }}
              </div>
              <div class="col"></div>
            </div>
            <div class="row">
              <div class="col">
                <b>Aguinaldo</b>
              </div>
              <div class="col">
                {{ imssChristmasBonus }}
              </div>
              <div class="col"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`