import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahLokasiUmkm = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaLokasiUmkm, setNamaLokasiUmkm] = useState("");
  const [linkGoogleMaps, setLinkGoogleMaps] = useState("");
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

  const saveLokasiUmkm = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveLokasiUmkm`, {
          namaLokasiUmkm,
          linkGoogleMaps,
          latitude,
          longitude,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate("/lokasiUmkm");
      } catch (error) {
        alert(error);
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
      <h3>Lokasi Web</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Lokasi Umkm</h5>
      <hr />
      <Card>
        <Card.Header>Lokasi Umkm</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveLokasiUmkm}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Nama Umkm :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={namaLokasiUmkm}
                      onChange={(e) =>
                        setNamaLokasiUmkm(e.target.value.toUpperCase())
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
                    Link Google Maps :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={linkGoogleMaps}
                      onChange={(e) => setLinkGoogleMaps(e.target.value)}
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
                    Latitude :
                  </Form.Label>
                  <Col sm="8">
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
                  <Form.Label column sm="4" style={textRight}>
                    Longitude :
                  </Form.Label>
                  <Col sm="8">
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
                onClick={() => navigate("/lokasiUmkm")}
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

export default TambahLokasiUmkm;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
