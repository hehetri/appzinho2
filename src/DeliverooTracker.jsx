import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const daysOfWeek = [
  "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"
];

const defaultDayData = {
  horasTrabalhadas: "",
  ganhosReais: "",
  boosts: "",
  gorjetas: "",
  clima: "",
  area: "",
  entregas: "",
  observacoes: ""
};

export default function DeliverooTracker() {
  const [dados, setDados] = useState(
    daysOfWeek.reduce((acc, dia) => {
      acc[dia] = { ...defaultDayData };
      return acc;
    }, {})
  );

  const handleChange = (dia, campo, valor) => {
    setDados((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor
      }
    }));
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      const page = await pdf.getPage(1);
      const content = await page.getTextContent();
      const text = content.items.map((item) => item.str).join(" ");

      // Aqui é onde você ajusta conforme o layout real do PDF
      const matchDia = /Thursday|Quinta/.exec(text) ? "Quinta" : "Outro";
      const entregas = text.match(/Total Deliveries\s*(\d+)/);
      const ganhos = text.match(/Earnings\s*€?(\d+[.,]?\d*)/);
      const gorjetas = text.match(/Tips\s*€?(\d+[.,]?\d*)/);

      if (matchDia !== "Outro") {
        setDados((prev) => ({
          ...prev,
          [matchDia]: {
            ...prev[matchDia],
            entregas: entregas?.[1] || "0",
            ganhosReais: (
              parseFloat(ganhos?.[1] || 0) + parseFloat(gorjetas?.[1] || 0)
            ).toFixed(2),
            gorjetas: gorjetas?.[1] || "0"
          }
        }));
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Dashboard de Entregas</h1>

      <div className="text-center mb-8 space-y-2">
        <label className="block text-gray-700 font-medium">Importar PDF da Deliveroo</label>
        <input type="file" accept=".pdf" onChange={handlePDFUpload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((dia) => (
          <div key={dia} className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">{dia}</h2>
            <div className="space-y-3">
              {Object.entries(defaultDayData).map(([campo]) => (
                campo !== "observacoes" ? (
                  <input
                    key={campo}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder={campo.charAt(0).toUpperCase() + campo.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={dados[dia][campo]}
                    onChange={(e) => handleChange(dia, campo, e.target.value)}
                  />
                ) : (
                  <textarea
                    key={campo}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Observações"
                    value={dados[dia].observacoes}
                    onChange={(e) => handleChange(dia, campo, e.target.value)}
                  />
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}