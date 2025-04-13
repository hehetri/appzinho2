
import { useState } from "react";
import Papa from "papaparse";

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

  const preencherDadosDoPDF = () => {
    const dadosExtraidos = {
      diaSemana: "Quinta",
      data: "10 April 2025",
      entregas: "6",
      ganhos: "45.82",
      gorjetas: "5.00"
    };

    const dia = "Quinta";
    setDados((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        entregas: dadosExtraidos.entregas,
        ganhosReais: (parseFloat(dadosExtraidos.ganhos) + parseFloat(dadosExtraidos.gorjetas)).toFixed(2),
        gorjetas: dadosExtraidos.gorjetas
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Dashboard de Entregas</h1>

      <div className="text-center mb-8">
        <button
          onClick={preencherDadosDoPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          Importar dados do PDF (exemplo)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((dia) => (
          <div
            key={dia}
            className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">{dia}</h2>
            <div className="space-y-3">
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Horas Trabalhadas"
                value={dados[dia].horasTrabalhadas}
                onChange={(e) => handleChange(dia, "horasTrabalhadas", e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ganhos Reais (€)"
                value={dados[dia].ganhosReais}
                onChange={(e) => handleChange(dia, "ganhosReais", e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Boosts/Extras (€)"
                value={dados[dia].boosts}
                onChange={(e) => handleChange(dia, "boosts", e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Gorjetas (€)"
                value={dados[dia].gorjetas}
                onChange={(e) => handleChange(dia, "gorjetas", e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Condições Climáticas"
                value={dados[dia].clima}
                onChange={(e) => handleChange(dia, "clima", e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Área de Entrega"
                value={dados[dia].area}
                onChange={(e) => handleChange(dia, "area", e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Número de Entregas"
                value={dados[dia].entregas}
                onChange={(e) => handleChange(dia, "entregas", e.target.value)}
              />
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Observações"
                value={dados[dia].observacoes}
                onChange={(e) => handleChange(dia, "observacoes", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
