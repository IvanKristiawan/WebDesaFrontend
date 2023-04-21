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
          tglInputPosyanduLansia: user.tutupperiode.dariTanggal,
          kkPosyanduLansia,
          nikPosyanduLansia,
          namaPosyanduLansia,
          umurPosyanduLansia,
          tglLahirPosyanduLansia,
          bbPosyanduLansia,
          tensiPosyanduLansia,
          _id: user.id,
          token: user.token
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
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Master</h3>
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
  mt: 4
};

const alertBox = {
  width: "100%"
};
