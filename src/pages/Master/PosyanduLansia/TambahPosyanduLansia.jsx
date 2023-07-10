import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SaveIcon from "@mui/icons-material/Save";

const TambahPosyanduLansia = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaLansia, setNamaLansia] = useState("");
  const [tglLahirLansia, setTglLahirLansia] = useState(new Date());
  const [umurLansia, setUmurLansia] = useState("");
  const [noRmLansia, setNoRmLansia] = useState("");
  const [tglPemeriksaan, setTglPemeriksaan] = useState("");
  const [tempatPemeriksaanLansia, setTempatPemeriksaanLansia] = useState("");
  const [noJaminanLansia, setNoJaminanLansia] = useState("");
  const [tekananDarahLansia, setTekananDarahLansia] = useState("");
  const [gulaDarahLansia, setGulaDarahLansia] = useState("");
  const [kolesterolLansia, setKolesterolLansia] = useState("");
  const [tbLansia, setTbLansia] = useState("");
  const [bbLansia, setBbLansia] = useState("");
  const [lpLansia, setLpLansia] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const savePosyanduLansia = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/savePosyanduLansia`, {
          tglInputLansia: user.tutupperiode.dariTanggal,
          namaLansia,
          tglLahirLansia,
          umurLansia,
          noRmLansia,
          tglPemeriksaan,
          tempatPemeriksaanLansia,
          noJaminanLansia,
          tekananDarahLansia,
          gulaDarahLansia,
          kolesterolLansia,
          tbLansia,
          bbLansia,
          lpLansia,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate("/posyanduLansia");
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
      <h3>Desa</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Posyandu Lansia</h5>
      <hr />
      <Card>
        <Card.Header>Posyandu Lansia</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={savePosyanduLansia}>
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
                      value={namaLansia}
                      onChange={(e) =>
                        setNamaLansia(e.target.value.toUpperCase())
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
                    Tgl. Lahir :
                  </Form.Label>
                  <Col sm="8">
                    <DatePicker
                      required
                      dateFormat="dd/MM/yyyy"
                      selected={tglLahirLansia}
                      customInput={<Form.Control required />}
                      onChange={(date) => setTglLahirLansia(date)}
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
                    Umur :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      type="number"
                      value={umurLansia}
                      onChange={(e) =>
                        setUmurLansia(e.target.value.toUpperCase())
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
                    No. RM :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={noRmLansia}
                      onChange={(e) =>
                        setNoRmLansia(e.target.value.toUpperCase())
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
                    Tgl. Pemeriksaan :
                  </Form.Label>
                  <Col sm="8">
                    <DatePicker
                      required
                      dateFormat="dd/MM/yyyy"
                      selected={tglPemeriksaan}
                      customInput={<Form.Control required />}
                      onChange={(date) => setTglPemeriksaan(date)}
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
                    Tempat Pemeriksaan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={tempatPemeriksaanLansia}
                      onChange={(e) =>
                        setTempatPemeriksaanLansia(e.target.value.toUpperCase())
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
                    No. Jaminan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={noJaminanLansia}
                      onChange={(e) =>
                        setNoJaminanLansia(e.target.value.toUpperCase())
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
                    Tekanan Darah :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={tekananDarahLansia}
                      onChange={(e) =>
                        setTekananDarahLansia(e.target.value.toUpperCase())
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
                    Gula Darah :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={gulaDarahLansia}
                      onChange={(e) =>
                        setGulaDarahLansia(e.target.value.toUpperCase())
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
                    Kolesterol :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={kolesterolLansia}
                      onChange={(e) =>
                        setKolesterolLansia(e.target.value.toUpperCase())
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
                    Tinggi Badan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={tbLansia}
                      onChange={(e) =>
                        setTbLansia(e.target.value.toUpperCase())
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
                    Berat Badan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={bbLansia}
                      onChange={(e) =>
                        setBbLansia(e.target.value.toUpperCase())
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
                    Lingkar Perut :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={lpLansia}
                      onChange={(e) =>
                        setLpLansia(e.target.value.toUpperCase())
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
                onClick={() => navigate("/posyanduLansia")}
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

export default TambahPosyanduLansia;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
