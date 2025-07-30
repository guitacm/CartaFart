import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import CartaForm from './CartaForm';
import CartaPreview from './CartaPreview';
import '../styles.css';

const CartaApp = () => {
  const [plats, setPlats] = useState([]);
  const [vistaPrevia, setVistaPrevia] = useState(true);

  // Carregar dades des del localStorage o del CSV per defecte
  useEffect(() => {
    try {
      const dadesGuardades = localStorage.getItem('cartaFartPlats');
      if (dadesGuardades && JSON.parse(dadesGuardades).length > 0) {
        setPlats(JSON.parse(dadesGuardades));
      } else {
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
                  descripcio: row.Descripcio || '',
                  preu: parseFloat(row.Preu).toFixed(2),
                  visible: row.Visible?.toString().toLowerCase().trim() === 'sí'
                }));
                setPlats(platsImportats);
              }
            });
          });
      }
    } catch (e) {
      console.error('Error llegint el localStorage:', e);
    }
  }, []);

  useEffect(() => {
    if (plats.length > 0) {
      localStorage.setItem('cartaFartPlats', JSON.stringify(plats));
    }
  }, [plats]);

  // Guardar al localStorage cada vegada que es modifica la carta
  useEffect(() => {
    localStorage.setItem('cartaFartPlats', JSON.stringify(plats));
  }, [plats]);

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
          descripcio: row.Descripcio?.trim() || '',
          preu: parseFloat(row.Preu).toFixed(2),
          visible: row.Visible?.toString().toLowerCase().trim() === 'sí'
        }));
        setPlats(platsImportats);
      }
    });
  };

  const descarregarCSV = () => {
    const csvData = plats.map(({ categoria, nom, descripcio, preu, visible }) => ({
      Categoria: categoria,
      Nom: nom,
      Descripcio: descripcio,
      Preu: preu,
      Visible: visible ? 'sí' : 'no'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const avui = new Date().toISOString().split('T')[0];

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `carta_fart_${avui}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="carta-container no-print">
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
        <CartaPreview plats={plats.filter(p => p.visible)} />
      )}

      <button className="carta-boto" onClick={() => window.print()}>
        Imprimir carta
      </button>

      <button className="carta-boto" onClick={descarregarCSV}>
        Descarregar carta com CSV
      </button>

      <button className="carta-boto" onClick={() => {
        localStorage.removeItem('cartaFartPlats');
        window.location.reload();
      }}>
        Reiniciar carta des del CSV
      </button>
    </div>
  );
};

export default CartaApp;
