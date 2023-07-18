import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const UbahDaftarPenduduk = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idPendudukChild, idDaftarPenduduk } = useParams();
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kkPenduduk, setKkPenduduk] = useState("");
  const [nikDaftarPenduduk, setNikDaftarPenduduk] = useState("");
  const [nikDaftarPendudukLama, setNikDaftarPendudukLama] = useState("");
  const [namaDaftarPenduduk, setNamaDaftarPenduduk] = useState("");

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
    getDaftarPendudukById();
  }, []);

  const getDaftarPendudukById = async () => {
    setLoading(true);
    const pickedBeliChild = await axios.post(
      `${tempUrl}/daftarPenduduks/${idDaftarPenduduk}`,
      {
        _id: user.id,
        token: user.token,
      }
    );
    setKkPenduduk(pickedBeliChild.data.kkPenduduk);
    setNikDaftarPendudukLama(pickedBeliChild.data.nikDaftarPendudukLama);
    setNikDaftarPenduduk(pickedBeliChild.data.nikDaftarPenduduk);
    setNamaDaftarPenduduk(pickedBeliChild.data.namaDaftarPenduduk);
    setLoading(false);
  };

  const updateDaftarPenduduk = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateDaftarPenduduk/${idDaftarPenduduk}`, {
          kkPenduduk,
          nikDaftarPendudukLama,
          nikDaftarPenduduk,
          namaDaftarPenduduk,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate(`/daftarPenduduk/penduduk/${id}/${idPendudukChild}/${idDaftarPenduduk}`);
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
      <h5 style={{ fontWeight: 400 }}>Ubah Detail Daftar Penduduk</h5>
      <hr />
      <Card>
        <Card.Header>Detail Daftar Penduduk</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateDaftarPenduduk}>
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
                    <Form.Control
                      value={kkPenduduk}
                      disabled
                      readOnly
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
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  navigate(`/daftarPenduduk/penduduk/${id}/${idPendudukChild}/${idDaftarPenduduk}`)
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

export default UbahDaftarPenduduk;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
