import { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Cracha from "./components/Cracha";
import avatar from "./assets/avatar.png";
import { db } from "./services/db";
import { useLiveQuery } from "dexie-react-hooks";

function App() {
  const inputRef = useRef(null);
  const importRef = useRef(null);

  const initialCracha = {
    foto: "",
    nome: "",
    cargo: "",
  };

  const [cracha, setCracha] = useState(initialCracha);

  const crachas = useLiveQuery(() => db.crachas.toArray());

  const renderCrachas = () => {
    return crachas?.map((cracha) => (
      <Cracha
        key={cracha}
        {...cracha}
        remove={true}
        onRemove={() => {
          confirm("Deseja realmente remover o crachá?") &&
            db.crachas.delete(cracha.id);
        }}
      />
    ));
  };

  const downloadFile = () => {
    // create file in browser
    const fileName = "crachas";
    const json = JSON.stringify(crachas, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const uploadFile = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      JSON.parse(e.target.result).forEach((cracha) => {
        db.crachas.add(cracha);
      });
      importRef.current.value = "";
    };
  };

  const adicionar = async () => {
    await db.crachas.add(cracha);

    setCracha(initialCracha);
    inputRef.current.value = "";
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);

    setCracha({ ...cracha, foto: base64 });
  };

  return (
    <Container className="mt-4">
      <div className="hidden-print">
        <Form.Label htmlFor="basic-url">Adicionar Crachá</Form.Label>
        <Row>
          <InputGroup className="mb-3 d-flex align-items-center justify-content-center text-center">
            <Col>
              <Form.Label htmlFor="basic-url">Importar</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  ref={importRef}
                  type="file"
                  id="foto"
                  onChange={uploadFile}
                  aria-describedby="basic-addon3"
                />
              </InputGroup>
            </Col>
          </InputGroup>
        </Row>
        <div className="d-flex align-items-center justify-content-center">
          <Cracha
            key={cracha}
            foto={cracha.foto ? cracha.foto : avatar}
            nome={cracha.nome ? cracha.nome : "Nome"}
            cargo={cracha.cargo ? cracha.cargo : "Cargo"}
          />
        </div>
        <Row>
          <Col>
            <Form.Label htmlFor="basic-url">Foto</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                ref={inputRef}
                type="file"
                id="foto"
                onChange={(e) => handleFileRead(e)}
                aria-describedby="basic-addon3"
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Label htmlFor="basic-url">Nome</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                id="nome"
                onChange={(e) => {
                  setCracha({ ...cracha, nome: e.target.value });
                }}
                maxLength="16"
                value={cracha.nome}
                aria-describedby="basic-addon3"
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Label htmlFor="basic-url">Cargo</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                id="cargo"
                onChange={(e) => {
                  setCracha({ ...cracha, cargo: e.target.value });
                }}
                maxLength="16"
                value={cracha.cargo}
                aria-describedby="basic-addon3"
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Label htmlFor="basic-url">Ações</Form.Label>
            <InputGroup className="mb-3">
              <Button
                variant="success"
                onClick={adicionar}
                disabled={!cracha.foto || !cracha.nome || !cracha.cargo}
              >
                Adicionar
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <InputGroup className="mb-3 d-flex align-items-center justify-content-center text-center">
          <Button variant="secondary" onClick={downloadFile}>
            Exportar
          </Button>
          <Button
            variant="primary"
            onClick={() => print()}
            disabled={!crachas?.length}
          >
            Imprimir
          </Button>
        </InputGroup>
      </div>
      <div className="d-flex flex-wrap">{renderCrachas()}</div>
    </Container>
  );
}

export default App;
