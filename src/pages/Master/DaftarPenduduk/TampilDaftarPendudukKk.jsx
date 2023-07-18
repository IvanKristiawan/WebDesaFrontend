import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader, ButtonModifier, SearchBar } from "../../../components";
import { ShowTablePendudukKk } from "../../../components/ShowTable";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonGroup,
} from "@mui/material";

const TampilDaftarPendudukKk = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idPendudukChild, idDaftarPenduduk } = useParams();
  const [tempIdPendudukChild, setTempIdPendudukChild] = useState("");
  const [kkPenduduk, setKkPenduduk] = useState("");
  const [nikDaftarPenduduk, setNikDaftarPenduduk] = useState("");
  const [namaDaftarPenduduk, setNamaDaftarPenduduk] = useState("");
  const [penduduk, setPenduduk] = useState({});

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDaftarPendudukById();
  }, []);

  const getDaftarPendudukById = async () => {
    if (id) {
      const response = await axios.post(
        `${tempUrl}/daftarPenduduks/${idDaftarPenduduk}`,
        {
          _id: user.id,
          token: user.token,
        }
      );
      setPenduduk(response.data);
      setTempIdPendudukChild(response.data.id);
      setKkPenduduk(response.data.kkPenduduk);
      setNikDaftarPenduduk(response.data.nikDaftarPenduduk);
      setNamaDaftarPenduduk(response.data.namaDaftarPenduduk);
    }
  };

  const deleteDaftarPenduduk = async (id) => {
    try {
      setLoading(true);
      // Delete Penduduk
      await axios.post(`${tempUrl}/deleteDaftarPenduduk/${tempIdPendudukChild}`, {
        _id: user.id,
        token: user.token,
      });
      setLoading(false);
      navigate(`/daftarPenduduk/penduduk/${id}/${idPendudukChild}`);
    } catch (error) {
      alert(error);
    }
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
      <h5 style={{ fontWeight: 400 }}>Detail Daftar Penduduk</h5>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/daftarPenduduk/penduduk/${id}/${idPendudukChild}`)}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={deleteButtonContainer}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {`Yakin ingin menghapus data ${kkPenduduk}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => deleteDaftarPenduduk(id)}>Ok</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={null}
          editLink={`/daftarPenduduk/penduduk/${id}/${idPendudukChild}/${idDaftarPenduduk}/edit`}
          deleteUser={deleteDaftarPenduduk}
          nameUser={nikDaftarPenduduk}
        />
      </Box>
      <hr />
      <Card>
        <Card.Header>Detail Penduduk</Card.Header>
        <Card.Body>
          <Form>
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
                  <Form.Label column sm="3" style={textRight}>
                    NIK :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={nikDaftarPenduduk}
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
                  <Form.Label column sm="3" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaDaftarPenduduk}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TampilDaftarPendudukKk;

const deleteButtonContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};