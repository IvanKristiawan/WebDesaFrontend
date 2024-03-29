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

const UbahPosyanduBalita = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kkBalita, setKkBalita] = useState("");
  const [nikBalita, setNikBalita] = useState("");
  const [anakKeBalita, setAnakKeBalita] = useState("");
  const [namaBalita, setNamaBalita] = useState("");
  const [tglLahirBalita, setTglLahirBalita] = useState(new Date());
  const [umurBalita, setUmurBalita] = useState("");
  const [jenisKelaminBalita, setJenisKelaminBalita] = useState("L");
  const [beratBadanLahirBalita, setBeratBadanLahirBalita] = useState("");
  const [panjangBadanLahirBalita, setPanjangBadanLahirBalita] = useState("");
  const [namaAyahBalita, setNamaAyahBalita] = useState("");
  const [namaIbuBalita, setNamaIbuBalita] = useState("");
  const [nikAyahBalita, setNikAyahBalita] = useState("");
  const [pendidikanTerakhirAyahBalita, setPendidikanTerakhirAyahBalita] =
    useState("");
  const [pendidikanTerakhirIbuBalita, setPendidikanTerakhirIbuBalita] =
    useState("");
  const [rtBalita, setRtBalita] = useState("");
  const [beratBadanBalita, setBeratBadanBalita] = useState("");
  const [panjangBadanBalita, setPanjangBadanBalita] = useState("");
  const [lingkarLenganAtasBalita, setLingkarLenganAtasBalita] = useState("");
  const [lingkarKepalaBalita, setLingkarKepalaBalita] = useState("");
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
    getPosyanduBalitaById();
  }, []);

  const getPosyanduBalitaById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/posyanduBalitas/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setKkBalita(response.data.kkBalita);
    setNikBalita(response.data.nikBalita);
    setAnakKeBalita(response.data.anakKeBalita);
    setNamaBalita(response.data.namaBalita);
    setTglLahirBalita(new Date(response.data.tglLahirBalita));
    setUmurBalita(response.data.umurBalita);
    setJenisKelaminBalita(response.data.jenisKelaminBalita);
    setBeratBadanLahirBalita(response.data.beratBadanLahirBalita);
    setPanjangBadanLahirBalita(response.data.panjangBadanLahirBalita);
    setNamaAyahBalita(response.data.namaAyahBalita);
    setNamaIbuBalita(response.data.namaIbuBalita);
    setNikAyahBalita(response.data.nikAyahBalita);
    setPendidikanTerakhirAyahBalita(response.data.pendidikanTerakhirAyahBalita);
    setPendidikanTerakhirIbuBalita(response.data.pendidikanTerakhirIbuBalita);
    setRtBalita(response.data.rtBalita);
    setBeratBadanBalita(response.data.beratBadanBalita);
    setPanjangBadanBalita(response.data.panjangBadanBalita);
    setLingkarLenganAtasBalita(response.data.lingkarLenganAtasBalita);
    setLingkarKepalaBalita(response.data.lingkarKepalaBalita);
    setStatus(response.data.status);
    setLoading(false);
  };

  const updatePosyanduBalita = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updatePosyanduBalita/${id}`, {
            kkBalita,
            nikBalita,
            anakKeBalita,
            namaBalita,
            tglLahirBalita,
            umurBalita,
            jenisKelaminBalita,
            beratBadanLahirBalita,
            panjangBadanLahirBalita,
            namaAyahBalita,
            namaIbuBalita,
            nikAyahBalita,
            pendidikanTerakhirAyahBalita,
            pendidikanTerakhirIbuBalita,
            rtBalita,
            beratBadanBalita,
            panjangBadanBalita,
            lingkarLenganAtasBalita,
            lingkarKepalaBalita,
            status,
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate(`/posyanduBalita/${id}`);
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
      <h5 style={{ fontWeight: 400 }}>Ubah Posyandu Balita</h5>
      <hr />
      <Card>
        <Card.Header>Posyandu Balita</Card.Header>
        <Card.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={updatePosyanduBalita}
          >
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="5" style={textRight}>
                    KK :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      required
                      value={kkBalita}
                      onChange={(e) =>
                        setKkBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    NIK :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      required
                      value={nikBalita}
                      onChange={(e) =>
                        setNikBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Anak Ke :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      type="number"
                      value={anakKeBalita}
                      onChange={(e) =>
                        setAnakKeBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      required
                      value={namaBalita}
                      onChange={(e) =>
                        setNamaBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Tgl. Lahir :
                  </Form.Label>
                  <Col sm="7">
                    <DatePicker
                      required
                      dateFormat="dd/MM/yyyy"
                      selected={tglLahirBalita}
                      customInput={<Form.Control required />}
                      onChange={(date) => setTglLahirBalita(date)}
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
                  <Form.Label column sm="5" style={textRight}>
                    Umur (bulan) :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      required
                      value={umurBalita}
                      onChange={(e) =>
                        setUmurBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Jenis Kelamin :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Select
                      required
                      value={jenisKelaminBalita}
                      onChange={(e) => {
                        setJenisKelaminBalita(e.target.value);
                      }}
                    >
                      <option value={"L"}>L</option>
                      <option value={"P"}>P</option>
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
                  <Form.Label column sm="5" style={textRight}>
                    Berat Badan Lahir :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={beratBadanLahirBalita}
                      type="number"
                      onChange={(e) =>
                        setBeratBadanLahirBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Panjang Badan Lahir :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={panjangBadanLahirBalita}
                      type="number"
                      onChange={(e) =>
                        setPanjangBadanLahirBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Nama Ayah :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={namaAyahBalita}
                      onChange={(e) =>
                        setNamaAyahBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Nama Ibu :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={namaIbuBalita}
                      onChange={(e) =>
                        setNamaIbuBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    NIK Ayah :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={nikAyahBalita}
                      onChange={(e) =>
                        setNikAyahBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Pendidikan Terakhir Ayah :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={pendidikanTerakhirAyahBalita}
                      onChange={(e) =>
                        setPendidikanTerakhirAyahBalita(
                          e.target.value.toUpperCase()
                        )
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
                  <Form.Label column sm="5" style={textRight}>
                    Pendidikan Terakhir Ibu :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={pendidikanTerakhirIbuBalita}
                      onChange={(e) =>
                        setPendidikanTerakhirIbuBalita(
                          e.target.value.toUpperCase()
                        )
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
                  <Form.Label column sm="5" style={textRight}>
                    RT :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={rtBalita}
                      type="number"
                      onChange={(e) =>
                        setRtBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Berat Badan :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={beratBadanBalita}
                      type="number"
                      onChange={(e) =>
                        setBeratBadanBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Panjang Badan :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={panjangBadanBalita}
                      type="number"
                      onChange={(e) =>
                        setPanjangBadanBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Lingkar Lengan Atas :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={lingkarLenganAtasBalita}
                      type="number"
                      onChange={(e) =>
                        setLingkarLenganAtasBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Lingkar Kepala :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={lingkarKepalaBalita}
                      type="number"
                      onChange={(e) =>
                        setLingkarKepalaBalita(e.target.value.toUpperCase())
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
                  <Form.Label column sm="5" style={textRight}>
                    Status :
                  </Form.Label>
                  <Col sm="7">
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
                onClick={() => navigate("/posyanduBalita")}
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

export default UbahPosyanduBalita;

const alertBox = {
  width: "100%",
};
