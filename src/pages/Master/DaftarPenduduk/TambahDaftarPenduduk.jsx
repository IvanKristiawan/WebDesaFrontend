import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahDaftarPenduduk = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idPendudukChild } = useParams();
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kkPenduduk, setKkPenduduk] = useState("");
  const [nikDaftarPenduduk, setNikDaftarPenduduk] = useState("");
  const [namaDaftarPenduduk, setNamaDaftarPenduduk] = useState("");
  const [jenisKelaminPenduduk, setJenisKelaminPenduduk] = useState("LAKI-LAKI");
  const [statusPenduduk, setStatusPenduduk] = useState("KEPALA KELUARGA");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPendudukChildById();
  }, []);

  const getPendudukChildById = async () => {
    setLoading(true);
    const pickedBeliChild = await axios.post(
      `${tempUrl}/penduduks/${idPendudukChild}`,
      {
        _id: user.id,
        token: user.token,
      }
    );
    setKkPenduduk(pickedBeliChild.data.kkPenduduk);
    setLoading(false);
  };

  const saveDaftarPenduduk = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveDaftarPenduduk`, {
          kkPenduduk,
          nikDaftarPenduduk,
          namaDaftarPenduduk,
          jenisKelaminPenduduk,
          statusPenduduk,
          pendudukId: idPendudukChild,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate(`/daftarPenduduk/penduduk/${id}/${idPendudukChild}`);
      } catch (error) {
        alert(error.response.data.message);
      }
      setLoading(false);
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  return (
    <Container>
      <h3>Desa</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Daftar Penduduk</h5>
      <hr />
      <Card>
        <Card.Header>Daftar Penduduk</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveDaftarPenduduk}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    KK :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kkPenduduk} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={namaDaftarPenduduk}
                      onChange={(e) =>
                        setNamaDaftarPenduduk(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    NIK :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={nikDaftarPenduduk}
                      onChange={(e) =>
                        setNikDaftarPenduduk(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Jenis Kelamin :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={jenisKelaminPenduduk}
                      onChange={(e) => {
                        setJenisKelaminPenduduk(e.target.value);
                      }}
                    >
                      <option value={"LAKI-LAKI"}>LAKI-LAKI</option>
                      <option value={"PEREMPUAN"}>PEREMPUAN</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Status :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={statusPenduduk}
                      onChange={(e) => {
                        setStatusPenduduk(e.target.value);
                      }}
                    >
                      <option value={"KEPALA KELUARGA"}>KEPALA KELUARGA</option>
                      <option value={"ISTRI"}>ISTRI</option>
                      <option value={"ANAK"}>ANAK</option>
                      <option value={"CUCU"}>CUCU</option>
                      <option value={"FAMILI LAIN"}>FAMILI LAIN</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  navigate(`/daftarPenduduk/penduduk/${id}/${idPendudukChild}`)
                }
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
              >
                Simpan
              </Button>
            </Box>
          </Form>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default TambahDaftarPenduduk;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
