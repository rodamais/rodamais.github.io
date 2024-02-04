import logo_roda from "../../assets/logo_roda.png"; // Tell webpack this JS file uses this image
import logo_br from "../../assets/logo_br.png"; // Tell webpack this JS file uses this image

import style from "./style.module.css";

const Cracha = ({ foto, nome, cargo, remove, onRemove = () => {} }) => {
  return (
    <div className={`card-print ${style.card}`}>
      <img src={logo_roda} alt="logo_rda" width="90%" />
      <img src={logo_br} alt="logo_rda" width={50} />

      <img className={style.foto} src={foto} alt="logo_rda" width={150} />

      <div className={style.label}>{nome}</div>
      <div className={style.label}>{cargo}</div>
      {remove ? (
        <button className={`hidden-print ${style.remove}`} onClick={onRemove}>
          X
        </button>
      ) : null}
    </div>
  );
};

export default Cracha;
