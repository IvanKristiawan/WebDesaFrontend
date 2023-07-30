import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahUser = () => {
  const { screenSize } = useStateContext();
  const { user, setting, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameLama, setUsernameLama] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [password, setPassword] = useState("");

  // Akses Desa
  const [rt, setRt] = useState(false);
  const [penduduk, setPenduduk] = useState(false);

  // Data Web
  const [lokasiPetinggi, setLokasiPetinggi] = useState(false);
  const [lokasiUmkm, setLokasiUmkm] = useState(false);
  const [lokasiWisata, setLokasiWisata] = useState(false);
  const [umkm, setUmkm] = useState(false);

  // Akses Posyandu
  const [posyanduLansia, setPosyanduLansia] = useState(false);
  const [posyanduBalita, setPosyanduBalita] = useState(false);
  const [gantiPeriode, setGantiPeriode] = useState(false);
  const [tutupPeriode, setTutupPeriode] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);
  const [settingAkses, setSettingAkses] = useState(false);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const tipeUserOption = ["MANAGER", "ADMIN"];
  const tipeUserOptionOwner = ["OWNER", "MANAGER", "ADMIN"];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/findUser/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setUsername(response.data.username);
    setUsernameLama(response.data.username);
    setTipeUser(response.data.tipeUser);

    // Akses Desa
    setRt(response.data.akses.rt);
    setPenduduk(response.data.akses.penduduk);

    // Akses Data Web
    setLokasiPetinggi(response.data.akses.lokasiPetinggi);
    setLokasiUmkm(response.data.akses.lokasiUmkm);
    setLokasiWisata(response.data.akses.lokasiWisata);
    setUmkm(response.data.akses.umkm);

    // Akses Posyandu
    setPosyanduLansia(response.data.akses.posyanduLansia);
    setPosyanduBalita(response.data.akses.posyanduBalita);
    setGantiPeriode(response.data.akses.gantiPeriode);
    setTutupPeriode(response.data.akses.tutupPeriode);

    // Akses Utility
    setProfilUser(response.data.akses.profilUser);
    setDaftarUser(response.data.akses.daftarUser);
    setSettingAkses(response.data.akses.setting);

    setLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        let tempUsername = await axios.post(`${tempUrl}/getUsername`, {
          username,
          _id: user.id,
          token: user.token,
        });
        let isUsernameNotValid =
          tempUsername.data.length > 0 && username !== usernameLama;
        if (isUsernameNotValid) {
          handleClickOpenAlert();
        } else {
          setLoading(true);
          if (password.length === 0) {
            setPassword(user.password);
          }
          await axios.post(`${tempUrl}/users/${id}`, {
            username,
            tipeUser,
            password,
            tipeAdmin: user.tipeUser,
            akses: {
              rt,
              penduduk,
              lokasiPetinggi,
              lokasiUmkm,
              lokasiWisata,
              umkm,
              posyanduLansia,
              posyanduBalita,
              gantiPeriode,
              tutupPeriode,
              profilUser,
              daftarUser,
              setting: settingAkses,
            },
            _id: user.id,
            token: user.token,
          });
          setLoading(false);

          if (user.id == id) {
            dispatch({ type: "LOGOUT" });
            navigate("/");
          } else {
            navigate("/daftarUser");
          }
        }
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

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah User</h5>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Username Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Username ${username} sudah ada, ganti Username!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Ok</Button>
        </DialogActions>
      </Dialog>
      <hr />
      <Card>
        <Card.Header>User</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateUser}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Username :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toUpperCase())
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
                    Tipe User :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={tipeUser}
                      onChange={(e) => {
                        setTipeUser(e.target.value);
                      }}
                    >
                      {user.tipeUser === "OWNER"
                        ? tipeUserOptionOwner.map((tipeUser) => (
                          <option value={tipeUser}>{tipeUser}</option>
                        ))
                        : tipeUserOption.map((tipeUser) => (
                          <option value={tipeUser}>{tipeUser}</option>
                        ))}
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
                  <Form.Label column sm="3" style={textRight}>
                    Password :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Container style={{ marginTop: 30 }}>
              <h4>Hak Akses User</h4>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <p style={checkboxTitle}>Desa</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Rt"
                      checked={rt}
                      onChange={() => setRt(!rt)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Penduduk"
                      checked={penduduk}
                      onChange={() => setPenduduk(!penduduk)}
                    />
                  </Form>
                  <p style={checkboxTitle}>Data Web</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Lokasi Petinggi"
                      checked={lokasiPetinggi}
                      onChange={() => setLokasiPetinggi(!lokasiPetinggi)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Lokasi UMKM"
                      checked={lokasiUmkm}
                      onChange={() => setLokasiUmkm(!lokasiUmkm)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Lokasi Wisata"
                      checked={lokasiWisata}
                      onChange={() => setLokasiWisata(!lokasiWisata)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="UMKM"
                      checked={umkm}
                      onChange={() => setUmkm(!umkm)}
                    />
                  </Form>
                  <p style={checkboxTitle}>Posyandu</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Posyandu Lansia"
                      checked={posyanduLansia}
                      onChange={() => setPosyanduLansia(!posyanduLansia)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Posyandu Balita"
                      checked={posyanduBalita}
                      onChange={() => setPosyanduBalita(!posyanduBalita)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Ganti Periode"
                      checked={gantiPeriode}
                      onChange={() => setGantiPeriode(!gantiPeriode)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Tutup Periode"
                      checked={tutupPeriode}
                      onChange={() => setTutupPeriode(!tutupPeriode)}
                    />
                  </Form>
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <p style={secondCheckboxTitle}>Utility</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Profil User"
                      checked={profilUser}
                      onChange={() => setProfilUser(!profilUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Daftar User"
                      checked={daftarUser}
                      onChange={() => setDaftarUser(!daftarUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Setting"
                      checked={settingAkses}
                      onChange={() => setSettingAkses(!settingAkses)}
                    />
                  </Form>
                </Box>
              </Box>
            </Container>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/daftarUser")}
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

export default UbahUser;

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row",
  },
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw",
  },
};

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};

const secondWrapper = {
  marginLeft: {
    sm: 4,
  },
  marginTop: {
    sm: 0,
    xs: 4,
  },
};

const checkboxTitle = {
  marginBottom: 0,
};

const secondCheckboxTitle = {
  marginTop: 15,
  marginBottom: 0,
};
