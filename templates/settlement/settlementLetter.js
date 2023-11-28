module.exports = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Carta de finiquito</title>
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
    .border {
      border: 1px solid #000;
    }
    .padding {
      padding: 8px;
    }
    .text-center {
      text-align: center;
    }
    .row {
      width: 100%;
    }
    .col, .col-3, .col-4 {
      width: 49.5%;
      padding-left: 4px;
      padding-right: 4px;
      display: inline-block;
    }
    .col-3 {
      width: 28%;
    }
    .col-4 {
      width: 70%;
    }
  </style>
</head>
<body>
  <div class="border padding">
    <h2 class="text-center">${data.clientName}</h2>
    <h2 class="text-center">RECIBO FINIQUITO</h2>
  </div>
  <br>
  <div class="border padding">
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col-3">
            Fecha de Impresión:
          </div>
          <div class="col-4">
            ${data.fechaImpresion}
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-3">
            Fecha de ingreso:
          </div>
          <div class="col-4">
            ${data.fechaIngreso}
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-3">
            Número:
          </div>
          <div class="col-4">
            ${data.rfc}
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-3">
            Fecha de baja:
          </div>
          <div class="col-4">
            ${data.fechaBaja}
          </div>
        </div>
      </div>
      <!-- Nombre completo: Saira Iraly Hernández Santoyo -->
      <div class="col">
        <div class="row">
          <div class="col-3">
            Nombre completo:
          </div>
          <div class="col-4">
            ${data.nombreCompleto}
          </div>
        </div>
      </div>
      <!-- Dias Trabajados: 23 -->
      <div class="col">
        <div class="row">
          <div class="col-3">
            Dias Trabajados:
          </div>
          <div class="col-4">
            ${data.diasTrabajados}
          </div>
        </div>
      </div>
      <!-- Puesto: Auxiliar Administrativo -->
      <div class="col">
        <div class="row">
          <div class="col-3">
            Puesto:
          </div>
          <div class="col-4">
            ${data.puesto}
          </div>
        </div>
      </div>
      <!-- Sueldo Mensual: $7,097.90 -->
      <div class="col">
        <div class="row">
          <div class="col-3">
            Sueldo Mensual:
          </div>
          <div class="col-4">
            ${data.sueldoMensual}
          </div>
        </div>
      </div>
    </div>
  </div>
  <br>
  <div class="border padding">
    <div class="row">
      <div class="col">
        <h3 class="text-center">Percepciones</h3>
      </div>
      <div class="col">
        <h3 class="text-center">Deducciones</h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        ${
          data.percepciones.map((percepcion) => {
            return `
            <div class="row">
              <div class="col-4">
                ${percepcion.concepto}
              </div>
              <div class="col-3">
                ${percepcion.importe}
              </div>
            </div>
            `;
          }).join('')
        }
      </div>
      <div class="col">
        
        ${
          data.deducciones.map((deduccion) => {
            return `
            <div class="row">
              <div class="col-4">
                ${deduccion.concepto}
              </div>
              <div class="col-3">
                ${deduccion.importe}
              </div>
            </div>
            `;
          }).join('')
        }
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col-4">
            <b>Total Percepciones</b>
          </div>
          <div class="col-3">
            <b>${data.totalPercepciones}</b>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-4">
            <b>Total Deducciones</b>
          </div>
          <div class="col-3">
            <b>${data.totalDeducciones}</b>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col">
      </div>
      <div class="col">
        <div class="row">
          <div class="col-4">
            <b>Neto</b>
          </div>
          <div class="col-3">
            <b>${data.net}</b>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br>
  <div class="border padding">
    <p>
      Recibo de ${data.clientName} la cantidad de ${data.net} (${data.netLetras}) por concepto de saldo
      de todas y cada una de las prestaciones derivadas de mi contrato de trabajo y de la Ley Federal del Trabajo, a que tuve derecho, hasta esta
      fecha que renuncio voluntariamente al puesto de ${data.puesto}, que desempeñe en esta Empresa.
    </p>
    <br>
    <p>
      Al recibir la cantidad anterior, manifiesto que no se me adeuda cantidad alguna por concepto de salario ordinario, extraordinario,
      vacaciones, prima vacacional, aguinaldo, dias festivos, septimos dias, prima de antiguedad, de ninguna prestacion derivada de mi trabajo
      por lo que no me reservo ninguna reclamación presente ni futura en contra de ${data.clientName}.
    </p>
  </div>
  <br>
  <div class="border padding">
    <p class="text-center">Firma de Conformidad</p>
    <br><br><br><br>
    <p class="text-center">______________________________________</p>
    <p class="text-center">Nombre Completo y firma</p>
  </div>
</body>
</html>
`