import React from 'react';

const CartaForm = ({ index, plat, actualitzarPlat, eliminarPlat }) => {
  return (
    <div className="plat-edit">
      <input
        type="text"
        placeholder="Categoria"
        value={plat.categoria}
        onChange={(e) => actualitzarPlat(index, 'categoria', e.target.value)}
      />
      <input
        type="text"
        placeholder="Nom del plat"
        value={plat.nom}
        onChange={(e) => actualitzarPlat(index, 'nom', e.target.value)}
      />
      <input
        type="text"
        placeholder="Descripció"
        value={plat.descripcio}
        onChange={(e) => actualitzarPlat(index, 'descripcio', e.target.value)}
      />
      <input
        type="text"
        placeholder="Preu"
        value={plat.preu}
        onChange={(e) => actualitzarPlat(index, 'preu', e.target.value)}
      />
      <label>
        Visible:
        <input
          type="checkbox"
          checked={plat.visible}
          onChange={(e) => actualitzarPlat(index, 'visible', e.target.checked)}
        />
      </label>
      <button onClick={() => eliminarPlat(index)}>Eliminar</button>
    </div>
  );
};

export default CartaForm;
