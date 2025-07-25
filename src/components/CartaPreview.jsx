import React from 'react';

const CartaPreview = ({ plats }) => {
  const platsPerCategoria = plats.reduce((acc, plat) => {
    const categoria = plat.categoria || 'Sense categoria';
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(plat);
    return acc;
  }, {});

  // Ordre fix per cada columna
  const categoriesCol1 = ['aperitius','clàssics', 'bocata fart', 'from asia con love', 'rollitos', 'suggeriments', 'postres'];
  const categoriesCol2 = ['suggeriments', 'postres', 'birra', 'begudes', 'vins copa'];

  const renderCategories = (categories) =>
    categories
      .filter((cat) => platsPerCategoria[cat])
      .map((categoria) => (
        <div key={categoria} className="categoria-bloc">
          <h2 className="categoria-titol">{categoria.toUpperCase()}</h2>
          <div className="plats-grid">
            {platsPerCategoria[categoria].map((plat, index) => (
              <div className="plat" key={index}>
                <span className="plat-nom">{plat.nom}</span>
                <span className="plat-preu">
                  {parseFloat(plat.preu).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </div>
      ));

  return (
    <div className="carta-imprimible preview-mode">
      <img src="/logofart.jpg" alt="Logotip del restaurant" className="logo" />
      <div className="columnes-carta">
        <div className="columna">{renderCategories(categoriesCol1)}</div>
        <div className="columna">{renderCategories(categoriesCol2)}</div>
      </div>
    </div>
  );
};

export default CartaPreview;
