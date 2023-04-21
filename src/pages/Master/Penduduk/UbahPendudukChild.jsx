import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const UbahPendudukChild = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idPendudukChild } = useParams();
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kkPenduduk, setKkPenduduk] = useState("");
  const [kkPendudukLama, setKkPendudukLama] = useState("");
  const [namaPenduduk, setNamaPenduduk] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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
        token: user.token
      }
    );
    setKkPenduduk(pickedBeliChild.data.kkPenduduk);
    setKkPendudukLama(pickedBeliChild.data.kkPenduduk);
    setNamaPenduduk(pickedBeliChild.data.namaPenduduk);
    setLatitude(pickedBeliChild.data.latitude);
    setLongitude(pickedBeliChild.data.longitude);
    setLoading(false);
  };

  const updatePenduduk = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updatePenduduk/${idPendudukChild}`, {
          kkPenduduk,
          kkPendudukLama,
          namaPenduduk,
          latitude,
          longitude,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate(`/daftarPenduduk/penduduk/${id}`);
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
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Detail Penduduk</h5>
      <hr />
      <Card>
        <Card.Header>Detail Penduduk</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updatePenduduk}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    KK :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={kkPenduduk}
                      onChange={(e) =>
                        setKkPenduduk(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaPenduduk}
                      onChange={(e) =>
                        setNamaPenduduk(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRight}>
                    Latitude :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      type="number"
                      value={latitude}
                      onChange={(e) =>
                        setLatitude(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRight}>
                    Longitude :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      type="number"
                      value={longitude}
                      onChange={(e) =>
                        setLongitude(e.target.value.toUpperCase())
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

export default UbahPendudukChild;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
