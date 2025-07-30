import React from 'react';

const CartaPreview = ({ plats }) => {
  const platsPerCategoria = plats.reduce((acc, plat) => {
    const categoria = plat.categoria || 'Sense categoria';
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(plat);
    return acc;
  }, {});

  const categoriesCol1 = ['aperitius', 'clàssics', 'bocata fart'];
  const categoriesCol2 = ['suggeriments', 'from asia con love', 'rollitos', 'postres'];
  const categoriesCol3 = ['birra', 'begudes', 'cafes'];
  const categoriesCol4 = ['vins copa','vins negres', 'vins blancs', 'altres vins'];

  const renderCategories = (categories) =>
    categories
      .filter((cat) => platsPerCategoria[cat])
      .map((categoria) => (
        <div key={categoria} className="categoria-bloc">
          <h2 className="categoria-titol">{categoria.toUpperCase()}</h2>
          <div className="plats-grid">
            {platsPerCategoria[categoria].map((plat, index) => (
              <div className="plat" key={index}>
                <div className="plat-nom">
                  {plat.nom}
                  {plat.descripcio && (
                    <div className="plat-descripcio">{plat.descripcio}</div>
                  )}
                </div>
                <span className="plat-preu">
                  {parseFloat(plat.preu).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </div>
      ));
console.log('Renderitzant CartaPreview:', plats);
  return (
    <>
      {/* PRIMERA PÀGINA */}
      <div className="carta-imprimible preview-mode">
        <img src="/logofart.jpg" alt="Logotip del restaurant" className="logo" />
        <div className="columnes-carta">
          <div className="columna">{renderCategories(categoriesCol1)}</div>
          <div className="columna">{renderCategories(categoriesCol2)}</div>
        </div>
      </div>

      {/* SEGONA PÀGINA */}
      <div className="carta-imprimible preview-mode">
        <img src="/logofart.jpg" alt="Logotip del restaurant" className="logo" />
        <div className="columnes-carta">
          <div className="columna">{renderCategories(categoriesCol3)}</div>
          <div className="columna">{renderCategories(categoriesCol4)}</div>
        </div>
      </div>
    </>
  );
};

export default CartaPreview;
