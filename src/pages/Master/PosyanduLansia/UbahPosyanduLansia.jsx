import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditIcon from "@mui/icons-material/Edit";

const UbahPosyanduLansia = () => {
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
  const [status, setStatus] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const statusOption = ["ADA", "MENINGGAL", "PINDAH"];

  useEffect(() => {
    getPosyanduLansiaById();
  }, []);

  const getPosyanduLansiaById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/posyanduLansias/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setNamaLansia(response.data.namaLansia);
    setTglLahirLansia(new Date(response.data.tglLahirLansia));
    setUmurLansia(response.data.umurLansia);
    setNoRmLansia(response.data.noRmLansia);
    setTglPemeriksaan(new Date(response.data.tglPemeriksaan));
    setTempatPemeriksaanLansia(response.data.tempatPemeriksaanLansia);
    setNoJaminanLansia(response.data.noJaminanLansia);
    setTekananDarahLansia(response.data.tekananDarahLansia);
    setGulaDarahLansia(response.data.gulaDarahLansia);
    setKolesterolLansia(response.data.kolesterolLansia);
    setTbLansia(response.data.tbLansia);
    setBbLansia(response.data.bbLansia);
    setLpLansia(response.data.lpLansia);
    setStatus(response.data.status);
    setLoading(false);
  };

  const updatePosyanduLansia = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updatePosyanduLansia/${id}`, {
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
            status,
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate(`/posyanduLansia/${id}`);
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
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

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Desa</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Posyandu Lansia</h5>
      <hr />
      <Card>
        <Card.Header>Posyandu Lansia</Card.Header>
        <Card.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={updatePosyanduLansia}
          >
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
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                      }}
                    >
                      {statusOption.map((status) => (
                        <option value={status}>{status}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box>
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
                startIcon={<EditIcon />}
                type="submit"
              >
                Edit
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

export default UbahPosyanduLansia;

const alertBox = {
  width: "100%",
};
