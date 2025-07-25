import React from 'react';

const categoriesDisponibles = [
  'aperitius',
  'clàssics',
  'bocata fart',
  'from asia con love',
  'rollitos',
  'suggeriments',
  'postres',
  'birra',
  'begudes',
  'vins copa',
  'cafes'
];

const formatCategoria = (cat) => {
  return cat
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
};

const CartaForm = ({ index, plat, actualitzarPlat, eliminarPlat }) => {
  return (
    <div className="carta-form-linea">
      <label className="visible-checkbox">
        <input
          type="checkbox"
          checked={plat.visible}
          onChange={(e) => actualitzarPlat(index, 'visible', e.target.checked)}
        />{' '}
        Visible
      </label>

      <button className="eliminar-btn" onClick={() => eliminarPlat(index)}>
        ✕
      </button>

      <select
        value={plat.categoria}
        onChange={(e) => actualitzarPlat(index, 'categoria', e.target.value)}
      >
        <option value="">Categoria</option>
        {categoriesDisponibles.map((cat) => (
          <option key={cat} value={cat}>
            {formatCategoria(cat)}
          </option>
        ))}
      </select>

      <div className="input-nom">
        <span className="icon">🖉</span>
        <input
          type="text"
          placeholder="Nom del plat"
          value={plat.nom}
          onChange={(e) => actualitzarPlat(index, 'nom', e.target.value)}
        />
      </div>

      <input
        type="number"
        step="0.01"
        placeholder="Preu"
        value={plat.preu}
        onChange={(e) => actualitzarPlat(index, 'preu', e.target.value)}
      />


    </div>
  );
};

export default CartaForm;
