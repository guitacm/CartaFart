import React, { useState } from 'react';
import Papa from 'papaparse';
import CartaForm from './CartaForm';
import CartaPreview from './CartaPreview';
import '../styles.css';
import { useEffect } from 'react';

const CartaApp = () => {
  const [plats, setPlats] = useState([]);
  const [vistaPrevia, setVistaPrevia] = useState(true);

  useEffect(() => {
    fetch('/carta_fart_definitiu.csv')
      .then(response => response.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const platsImportats = result.data.map(row => ({
              categoria: row.Categoria || '',
              nom: row.Nom || '',
              preu: row.Preu || '',
              visible: row.Visible?.toString().toLowerCase().trim() === 'sí'
            }));
            setPlats(platsImportats);
          }
        });
      });
  }, []);

  const afegirPlat = () => {
    setPlats([
      ...plats,
      { categoria: '', nom: '', descripcio: '', preu: '', visible: true }
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
      }
    });
  };


  return (
    <div className="carta-container">
      <h1>La nostra carta</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label><strong>Importar des d’un CSV:</strong></label>{' '}
        <input type="file" accept=".csv" onChange={importarCSV} />
      </div>

      <button className="carta-boto" onClick={afegirPlat}>Afegir plat</button>

      {plats.map((plat, index) => (
        <CartaForm
          key={index}
          index={index}
          plat={plat}
          actualitzarPlat={actualitzarPlat}
          eliminarPlat={eliminarPlat}
        />
      ))}
      <button className="carta-boto" onClick={() => setVistaPrevia(!vistaPrevia)}>
        {vistaPrevia ? 'Sortir de vista prèvia' : 'Vista prèvia de la carta'}
      </button>

      <CartaPreview plats={plats.filter(p => p.visible)} vistaPrevia={vistaPrevia} />

      <button className="carta-boto" onClick={() => window.print()}>Imprimir carta</button>
    </div>
  );
};

export default CartaApp;
