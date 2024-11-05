import { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import Label from './components/Label';
import ReferenceTable from './components/ReferenceTable';
import { IMCResult, calculateIMC } from './lib/IMC';
import ResultsTable from './components/ResultsTable';

function App() {
  const [IMCData, setIMCData] = useState<null | {
    weight: number;
    height: number;
    IMC: number;
    IMCResult: string;
  }>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // get data from form
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      weight: string;
      height: string;
    };

    // handle empty fields
    const { weight, height } = data;
    if (!weight || !height) {
      alert('Ops... você precisa preencher todos os campos');
      return;
    }

    // parse and handle string to number
    const weightNumber = parseFloat(weight.replace(',', '.'));
    const heightNumber = parseFloat(height.replace(',', '.')) / 100;

    if (isNaN(weightNumber) || isNaN(heightNumber)) {
      alert('Ops... você precisa preencher os campos com números válidos');
      return;
    }
    // handle invalid numbers
    if (weightNumber < 2 || weightNumber > 500) {
      alert('Ops... o peso precisa ser maior que 2kg e menor que 500kg');
    }

    if (heightNumber < 0.5 || heightNumber > 2.5) {
      alert('Ops... a altura precisa ser maior que 50cm e menor que 2,5m');
    }

    // calculate imc
    const IMC = calculateIMC(weightNumber, heightNumber);
    const IMCResultString = IMCResult(IMC);
    console.log(IMC);
    console.log(IMCResultString);

    // set result
    setIMCData({
      weight: weightNumber,
      height: heightNumber,
      IMC: IMC,
      IMCResult: IMCResultString,
    });

    // clear form
    e.currentTarget.reset();
  }

  function handleClickReset(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIMCData(null);
  }

  return (
    <main className="max-w-4xl px-5 py-10 mx-auto bg-white md:py-24 md:px-48">
      <section id="form">
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input disabled={!!IMCData} name="weight" className="mt-1" type="tel" id="weight" />
          </div>
          <div className="mt-4">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input disabled={!!IMCData} name="height" className="mt-1" type="tel" id="height" />
          </div>
          {IMCData ? (
            <Button onClick={handleClickReset} type="button">Refazer</Button>
          ) : (
            <Button type="submit">Calcular</Button>
          )}
        </form>
      </section>
      <section id="result" className="h-40 px-4 py-10">
        {IMCData ? (
          <ResultsTable IMCData={IMCData} />
        ) : (
          <p className="text-xl text-center text-neutral-400">
            Saiba agora se está no seu peso ideal!
          </p>
        )}
      </section>
      <section id="reference-table">
        <ReferenceTable />
      </section>
    </main>
  );
}

export default App;