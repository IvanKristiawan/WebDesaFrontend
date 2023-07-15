import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../constants/report.css";
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
import { formatDate } from "../../../constants/helper";
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
  const [namaLansia, setNamaLansia] = useState("");
  const [tglLahirLansia, setTglLahirLansia] = useState("");
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
      val.namaLansia.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tglLahirLansiaFormatted
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.noRmLansia.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tempatPemeriksaanLansia
        .toUpperCase()
        .includes(searchTerm.toUpperCase())
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
      setNamaLansia(response.data.namaLansia);
      setTglLahirLansia(formatDate(response.data.tglLahirLansia));
      setUmurLansia(response.data.umurLansia);
      setNoRmLansia(response.data.noRmLansia);
      setTglPemeriksaan(formatDate(response.data.tglPemeriksaan));
      setTempatPemeriksaanLansia(response.data.tempatPemeriksaanLansia);
      setNoJaminanLansia(response.data.noJaminanLansia);
      setTekananDarahLansia(response.data.tekananDarahLansia);
      setGulaDarahLansia(response.data.gulaDarahLansia);
      setKolesterolLansia(response.data.kolesterolLansia);
      setTbLansia(response.data.tbLansia);
      setBbLansia(response.data.bbLansia);
      setLpLansia(response.data.lpLansia);
      setStatus(response.data.status);
    }
  };

  const deletePosyanduLansia = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deletePosyanduLansia/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setNamaLansia("");
      setTglLahirLansia("");
      setUmurLansia("");
      setNoRmLansia("");
      setTglPemeriksaan("");
      setTempatPemeriksaanLansia("");
      setNoJaminanLansia("");
      setTekananDarahLansia("");
      setGulaDarahLansia("");
      setKolesterolLansia("");
      setTbLansia("");
      setBbLansia("");
      setLpLansia("");
      setStatus("");
      navigate("/posyanduLansia");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaLansia} tidak bisa dihapus karena sudah ada data!`);
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
    const doc = new jsPDF("l", "mm", [350, 210]);
    doc.setFontSize(12);
    doc.text(`${setting.namaDesa} - ${setting.kotaDesa}`, 15, 10);
    doc.text(`${setting.alamatDesa}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar Posyandu Lansia`, 150, 30);
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
      <h3>Desa</h3>
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
          <table class="styled-table" id="table" style={{ fontSize: "10px" }}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Tgl. Lahir</th>
                <th>Umur</th>
                <th>No. RM</th>
                <th>Tgl.</th>
                <th>Tempat Pemeriksaan</th>
                <th>No. Jaminan</th>
                <th>Tekanan Darah</th>
                <th>Gula Darah</th>
                <th>Kolesterol</th>
                <th>TB</th>
                <th>BB</th>
                <th>LP</th>
              </tr>
            </thead>
            <tbody>
              {posyanduLansias.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaLansia}</td>
                  <td>{user.tglLahirLansiaFormatted}</td>
                  <td>{user.umurLansia}</td>
                  <td>{user.noRmLansia}</td>
                  <td>{user.tglPemeriksaanFormatted}</td>
                  <td>{user.tempatPemeriksaanLansia}</td>
                  <td>{user.noJaminanLansia}</td>
                  <td>{user.tekananDarahLansia}</td>
                  <td>{user.gulaDarahLansia}</td>
                  <td>{user.kolesterolLansia}</td>
                  <td>{user.tbLansia}</td>
                  <td>{user.bbLansia}</td>
                  <td>{user.lpLansia}</td>
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
        <table ref={tableRef} class="styled-table" style={{ fontSize: "10px" }}>
          {previewExcel && (
            <tbody>
              <tr>
                <th>Nama</th>
                <th>Tgl. Lahir</th>
                <th>Umur</th>
                <th>No. RM</th>
                <th>Tgl.</th>
                <th>Tempat Pemeriksaan</th>
                <th>No. Jaminan</th>
                <th>Tekanan Darah</th>
                <th>Gula Darah</th>
                <th>Kolesterol</th>
                <th>TB</th>
                <th>BB</th>
                <th>LP</th>
              </tr>
              {posyanduLansias.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaLansia}</td>
                  <td>{user.tglLahirLansiaFormatted}</td>
                  <td>{user.umurLansia}</td>
                  <td>{user.noRmLansia}</td>
                  <td>{user.tglPemeriksaanFormatted}</td>
                  <td>{user.tempatPemeriksaanLansia}</td>
                  <td>{user.noJaminanLansia}</td>
                  <td>{user.tekananDarahLansia}</td>
                  <td>{user.gulaDarahLansia}</td>
                  <td>{user.kolesterolLansia}</td>
                  <td>{user.tbLansia}</td>
                  <td>{user.bbLansia}</td>
                  <td>{user.lpLansia}</td>
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
          nameUser={namaLansia}
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
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={namaLansia} disabled readOnly />
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
                    <Form.Control value={tglLahirLansia} disabled readOnly />
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
                    <Form.Control value={umurLansia} disabled readOnly />
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
                    No. RM :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={noRmLansia} disabled readOnly />
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
                    Tgl. Pemeriksaan :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={tglPemeriksaan} disabled readOnly />
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
                    Tempat Pemeriksaan :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={tempatPemeriksaanLansia}
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
                    No. Jaminan :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={noJaminanLansia} disabled readOnly />
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
                    Tekanan Darah :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={tekananDarahLansia}
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
                    Gula Darah :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={gulaDarahLansia} disabled readOnly />
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
                    Kolesterol :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kolesterolLansia} disabled readOnly />
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
                    Tinggi Badan :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={tbLansia} disabled readOnly />
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
                    <Form.Control value={bbLansia} disabled readOnly />
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
                    Lingkar Perut :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={lpLansia} disabled readOnly />
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
                    Status :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={status} disabled readOnly />
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
