import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTablePosyanduLansia } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier,
} from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Pagination,
  Button,
  ButtonGroup,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilPosyanduLansia = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kkPosyanduLansia, setKkPosyanduLansia] = useState("");
  const [nikPosyanduLansia, setNikPosyanduLansia] = useState("");
  const [namaPosyanduLansia, setNamaPosyanduLansia] = useState("");
  const [umurPosyanduLansia, setUmurPosyanduLansia] = useState("");
  const [tglLahirPosyanduLansia, setTglLahirPosyanduLansia] = useState("");
  const [bbPosyanduLansia, setBbPosyanduLansia] = useState("");
  const [tensiPosyanduLansia, setTensiPosyanduLansia] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [posyanduLansias, setPosyanduLansias] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = posyanduLansias.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kkPosyanduLansia.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.nikPosyanduLansia.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaPosyanduLansia.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(posyanduLansias, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getPosyanduLansias();
    id && getPosyanduLansiaById();
  }, [id]);

  const getPosyanduLansias = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/posyanduLansias`, {
        dariTanggal: user.tutupperiode.dariTanggal,
        sampaiTanggal: user.tutupperiode.sampaiTanggal,
        _id: user.id,
        token: user.token,
      });
      setPosyanduLansias(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getPosyanduLansiaById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/posyanduLansias/${id}`, {
        dariTanggal: user.tutupperiode.dariTanggal,
        sampaiTanggal: user.tutupperiode.sampaiTanggal,
        _id: user.id,
        token: user.token,
      });
      setKkPosyanduLansia(response.data.kkPosyanduLansia);
      setNikPosyanduLansia(response.data.nikPosyanduLansia);
      setNamaPosyanduLansia(response.data.namaPosyanduLansia);
      setUmurPosyanduLansia(response.data.umurPosyanduLansia);
      let newTanggalLahir = new Date(response.data.tglLahirPosyanduLansia);
      let tempTanggalLahir = `${newTanggalLahir
        .getDate()
        .toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}-${(newTanggalLahir.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}-${newTanggalLahir.getFullYear()}`;
      setTglLahirPosyanduLansia(tempTanggalLahir);
      setBbPosyanduLansia(response.data.bbPosyanduLansia);
      setTensiPosyanduLansia(response.data.tensiPosyanduLansia);
    }
  };

  const deletePosyanduLansia = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deletePosyanduLansia/${id}`, {
        _id: user.id,
        token: user.token,
      });
      getPosyanduLansias();
      setKkPosyanduLansia("");
      setNikPosyanduLansia("");
      setNamaPosyanduLansia("");
      setTglLahirPosyanduLansia("");
      setBbPosyanduLansia("");
      setTensiPosyanduLansia("");
      navigate("/posyanduLansia");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${kkPosyanduLansia} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const downloadPdf = () => {
    var date = new Date();
    var current_date =
      date.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "-" +
      (date.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "-" +
      date.getFullYear();
    var current_time =
      date.getHours().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      date.getMinutes().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      date.getSeconds().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${setting.namaDesa} - ${setting.kotaDesa}`, 15, 10);
    doc.text(`${setting.alamatDesa}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar Posyandu Lansia`, 90, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.autoTable({
      html: "#table",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0],
      },
    });
    doc.save("daftarPosyanduLansia.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "PosyanduLansia",
    sheet: "DaftarPosyanduLansia",
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Posyandu Lansia</h5>
      <Typography sx={subTitleText}>
        Periode : {user.tutupperiode.namaPeriode}
      </Typography>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewPdf(!previewPdf);
              setPreviewExcel(false);
            }}
          >
            PDF
          </Button>
          <Button
            color="secondary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewExcel(!previewExcel);
              setPreviewPdf(false);
            }}
          >
            Excel
          </Button>
        </ButtonGroup>
      </Box>
      {previewPdf && (
        <div>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => downloadPdf()}
            style={{ marginTop: 20 }}
          >
            CETAK
          </Button>
          <table class="table" id="table">
            <thead>
              <tr>
                <th>KK</th>
                <th>NIK</th>
                <th>Nama</th>
                <th>Umur</th>
                <th>Tgl. Lahir</th>
                <th>BB</th>
                <th>Tensi</th>
              </tr>
            </thead>
            <tbody>
              {posyanduLansias.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kkPosyanduLansia}</td>
                  <td>{user.nikPosyanduLansia}</td>
                  <td>{user.umurPosyanduLansia}</td>
                  <td>{user.tglLahirPosyanduLansia}</td>
                  <td>{user.bbPosyanduLansia}</td>
                  <td>{user.tensiPosyanduLansia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        {previewExcel && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            style={{ marginTop: 20 }}
          >
            EXCEL
          </Button>
        )}
        <table ref={tableRef}>
          {previewExcel && (
            <tbody>
              <tr>
                <th>KK</th>
                <th>NIK</th>
                <th>Nama</th>
                <th>Umur</th>
                <th>Tgl. Lahir</th>
                <th>BB</th>
                <th>Tensi</th>
              </tr>
              {posyanduLansias.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kkPosyanduLansia}</td>
                  <td>{user.nikPosyanduLansia}</td>
                  <td>{user.namaPosyanduLansia}</td>
                  <td>{user.umurPosyanduLansia}</td>
                  <td>{user.tglLahirPosyanduLansia}</td>
                  <td>{user.bbPosyanduLansia}</td>
                  <td>{user.tensiPosyanduLansia}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/posyanduLansia/tambahPosyanduLansia`}
          editLink={`/posyanduLansia/${id}/edit`}
          deleteUser={deletePosyanduLansia}
          nameUser={kkPosyanduLansia}
        />
      </Box>
      {id && (
        <Container>
          <hr />
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
                    <Form.Control value={kkPosyanduLansia} disabled readOnly />
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
                    <Form.Control value={nikPosyanduLansia} disabled readOnly />
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
                      value={namaPosyanduLansia}
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
                    Umur :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={umurPosyanduLansia}
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
                    Tgl. Lahir :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={tglLahirPosyanduLansia}
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
                    Berat Badan :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={bbPosyanduLansia} disabled readOnly />
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
                      value={tensiPosyanduLansia}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTablePosyanduLansia
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Container>
  );
};

export default TampilPosyanduLansia;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center",
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center",
};

const subTitleText = {
  fontWeight: "900",
};
