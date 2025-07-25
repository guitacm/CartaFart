import React, { useState } from 'react';
import Papa from 'papaparse';
import CartaForm from './CartaForm';
import CartaPreview from './CartaPreview';
import '../styles.css';
import { useEffect } from 'react';

const CartaApp = () => {
  const [plats, setPlats] = useState([]);
  const [missatge, setMissatge] = useState('');
  const [vistaPrevia, setVistaPrevia] = useState(true);

  useEffect(() => {
    fetch('/carta-fart-definitiu.csv')
      .then(response => response.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const platsImportats = result.data.map(row => ({
              categoria: row.Categoria?.trim().toLowerCase() || '',
              nom: row.Nom?.trim() || '',
              preu: parseFloat(row.Preu).toFixed(2),
              visible: row.Visible?.toString().toLowerCase().trim() === 'sí'
            }));
            setPlats(platsImportats);
            setVistaPrevia(true);
          }
        });
      });
  }, []);

  const afegirPlat = () => {
    setPlats([
      ...plats,
      { categoria: '', nom: '', preu: '', visible: true }
    ]);
  };

  const actualitzarPlat = (index, camp, valor) => {
    const nousPlats = [...plats];
    nousPlats[index][camp] = valor;
    setPlats(nousPlats);
  };

  const eliminarPlat = (index) => {
    const nousPlats = plats.filter((_, i) => i !== index);
    setPlats(nousPlats);
  };

  const importarCSV = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const platsImportats = result.data.map(row => ({
          categoria: row.Categoria?.trim().toLowerCase() || '',
          nom: row.Nom?.trim() || '',
          preu: parseFloat(row.Preu).toFixed(2),
          visible: row.Visible?.toString().toLowerCase().trim() === 'sí'
        }));
        setPlats(platsImportats);
        setVistaPrevia(true);
      }
    });
  };

  const descarregarCSV = () => {
    const csvData = plats
      .filter(plat => plat.visible)
      .map(({ categoria, nom, preu, visible }) => ({
        Categoria: categoria,
        Nom: nom,
        Preu: parseFloat(preu).toFixed(2),
        Visible: visible ? 'sí' : 'no'
      }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Obtenim la data d’avui en format YYYY-MM-DD
    const avui = new Date();
    const dataFormatada = avui.toISOString().split('T')[0]; // exemple: 2025-07-24
    const nomFitxer = `carta-fart-${dataFormatada}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomFitxer);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMissatge(`✅ CSV "${nomFitxer}" descarregat correctament!`);
    setTimeout(() => setMissatge(''), 3000);
  };

  return (
    <div className="carta-container">
      <h1>La nostra carta</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label><strong>Importar des d'un CSV:</strong></label>{' '}
        <input type="file" accept=".csv" onChange={importarCSV} />
      </div>

      {plats.map((plat, index) => (
        <CartaForm
          key={index}
          index={index}
          plat={plat}
          actualitzarPlat={actualitzarPlat}
          eliminarPlat={eliminarPlat}
        />
      ))}

      <button className="carta-boto" onClick={afegirPlat}>Afegir plat</button>

      <button className="carta-boto" onClick={() => setVistaPrevia(!vistaPrevia)}>
        {vistaPrevia ? 'Sortir de vista prèvia' : 'Vista prèvia de la carta'}
      </button>

      {vistaPrevia && (
        <CartaPreview plats={plats.filter(p => p.visible)} vistaPrevia={vistaPrevia} />
      )}

      <button className="carta-boto" onClick={() => window.print()}>Imprimir carta</button>

      <button className="carta-boto" onClick={descarregarCSV}>
        Descarregar carta com CSV
      </button>

      {missatge && <p style={{ color: 'green', marginTop: '1rem' }}>{missatge}</p>}
    </div>
  );
};

export default CartaApp;
