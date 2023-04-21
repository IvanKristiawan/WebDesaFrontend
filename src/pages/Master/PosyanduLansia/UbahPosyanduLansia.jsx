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
  const [kkPosyanduLansia, setKkPosyanduLansia] = useState("");
  const [nikPosyanduLansia, setNikPosyanduLansia] = useState("");
  const [namaPosyanduLansia, setNamaPosyanduLansia] = useState("");
  const [umurPosyanduLansia, setUmurPosyanduLansia] = useState("");
  const [tglLahirPosyanduLansia, setTglLahirPosyanduLansia] = useState(
    new Date()
  );
  const [bbPosyanduLansia, setBbPosyanduLansia] = useState("");
  const [tensiPosyanduLansia, setTensiPosyanduLansia] = useState("");

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

  useEffect(() => {
    getPosyanduLansiaById();
  }, []);

  const getPosyanduLansiaById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/posyanduLansias/${id}`, {
      _id: user.id,
      token: user.token
    });
    setKkPosyanduLansia(response.data.kkPosyanduLansia);
    setNikPosyanduLansia(response.data.nikPosyanduLansia);
    setNamaPosyanduLansia(response.data.namaPosyanduLansia);
    setUmurPosyanduLansia(response.data.umurPosyanduLansia);
    setTglLahirPosyanduLansia(new Date(response.data.tglLahirPosyanduLansia));
    setBbPosyanduLansia(response.data.bbPosyanduLansia);
    setTensiPosyanduLansia(response.data.tensiPosyanduLansia);
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
            kkPosyanduLansia,
            nikPosyanduLansia,
            namaPosyanduLansia,
            tglLahirPosyanduLansia,
            bbPosyanduLansia,
            tensiPosyanduLansia,
            _id: user.id,
            token: user.token
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
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Master</h3>
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
                  <Form.Label column sm="3" style={textRight}>
                    KK :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={kkPosyanduLansia}
                      onChange={(e) =>
                        setKkPosyanduLansia(e.target.value.toUpperCase())
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
                    NIK :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={nikPosyanduLansia}
                      onChange={(e) =>
                        setNikPosyanduLansia(e.target.value.toUpperCase())
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
                      value={namaPosyanduLansia}
                      onChange={(e) =>
                        setNamaPosyanduLansia(e.target.value.toUpperCase())
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
                    Umur :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={umurPosyanduLansia}
                      onChange={(e) =>
                        setUmurPosyanduLansia(e.target.value.toUpperCase())
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
                    Tgl. Lahir :
                  </Form.Label>
                  <Col sm="9">
                    <DatePicker
                      required
                      dateFormat="dd/MM/yyyy"
                      selected={tglLahirPosyanduLansia}
                      customInput={<Form.Control required />}
                      onChange={(date) => setTglLahirPosyanduLansia(date)}
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
                    Berat Badan :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={bbPosyanduLansia}
                      onChange={(e) =>
                        setBbPosyanduLansia(e.target.value.toUpperCase())
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
                    Tensi :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={tensiPosyanduLansia}
                      onChange={(e) =>
                        setTensiPosyanduLansia(e.target.value.toUpperCase())
                      }
                    />
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
  width: "100%"
};
