import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../constants/report.css";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTablePosyanduBalita } from "../../../components/ShowTable";
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

const TampilPosyanduBalita = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kkBalita, setKkBalita] = useState("");
  const [nikBalita, setNikBalita] = useState("");
  const [anakKeBalita, setAnakKeBalita] = useState("");
  const [namaBalita, setNamaBalita] = useState("");
  const [tglLahirBalita, setTglLahirBalita] = useState("");
  const [umurBalita, setUmurBalita] = useState("");
  const [jenisKelaminBalita, setJenisKelaminBalita] = useState("");
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

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [posyanduBalitas, setPosyanduBalitas] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = posyanduBalitas.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kkBalita.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.nikBalita.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaBalita.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tglLahirBalitaFormatted
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.umurBalita.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jenisKelaminBalita.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(posyanduBalitas, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getPosyanduBalitas();
    id && getPosyanduBalitaById();
  }, [id]);

  const getPosyanduBalitas = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/posyanduBalitas`, {
        dariTanggal: user.tutupperiode.dariTanggal,
        sampaiTanggal: user.tutupperiode.sampaiTanggal,
        _id: user.id,
        token: user.token,
      });
      setPosyanduBalitas(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getPosyanduBalitaById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/posyanduBalitas/${id}`, {
        dariTanggal: user.tutupperiode.dariTanggal,
        sampaiTanggal: user.tutupperiode.sampaiTanggal,
        _id: user.id,
        token: user.token,
      });
      setKkBalita(response.data.kkBalita);
      setNikBalita(response.data.nikBalita);
      setAnakKeBalita(response.data.anakKeBalita);
      setNamaBalita(response.data.namaBalita);
      setTglLahirBalita(formatDate(response.data.tglLahirBalita));
      setUmurBalita(response.data.umurBalita);
      setJenisKelaminBalita(response.data.jenisKelaminBalita);
      setBeratBadanLahirBalita(response.data.beratBadanLahirBalita);
      setPanjangBadanLahirBalita(response.data.panjangBadanLahirBalita);
      setNamaAyahBalita(response.data.namaAyahBalita);
      setNamaIbuBalita(response.data.namaIbuBalita);
      setNikAyahBalita(response.data.nikAyahBalita);
      setPendidikanTerakhirAyahBalita(
        response.data.pendidikanTerakhirAyahBalita
      );
      setPendidikanTerakhirIbuBalita(response.data.pendidikanTerakhirIbuBalita);
      setRtBalita(response.data.rtBalita);
      setBeratBadanBalita(response.data.beratBadanBalita);
      setPanjangBadanBalita(response.data.panjangBadanBalita);
      setLingkarLenganAtasBalita(response.data.lingkarLenganAtasBalita);
      setLingkarKepalaBalita(response.data.lingkarKepalaBalita);
      setStatus(response.data.status);
    }
  };

  const deletePosyanduBalita = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deletePosyanduBalita/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setKkBalita("");
      setNikBalita("");
      setAnakKeBalita("");
      setNamaBalita("");
      setTglLahirBalita(formatDate(""));
      setUmurBalita("");
      setJenisKelaminBalita("");
      setBeratBadanLahirBalita("");
      setPanjangBadanLahirBalita("");
      setNamaAyahBalita("");
      setNamaIbuBalita("");
      setNikAyahBalita("");
      setPendidikanTerakhirAyahBalita("");
      setPendidikanTerakhirIbuBalita("");
      setRtBalita("");
      setBeratBadanBalita("");
      setPanjangBadanBalita("");
      setLingkarLenganAtasBalita("");
      setLingkarKepalaBalita("");
      setStatus("");
      navigate("/posyanduBalita");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaBalita} tidak bisa dihapus karena sudah ada data!`);
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
    const doc = new jsPDF("l", "mm", [600, 300]);
    doc.setFontSize(12);
    doc.text(`${setting.namaDesa} - ${setting.kotaDesa}`, 15, 10);
    doc.text(`${setting.alamatDesa}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`FORMULIR PEMANTAUAN PERTUMBUHAN BALITA DI POSYANDU`, 280, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.text(`DESA`, 20, 40);
    doc.text(` : GUWOSARI`, 70, 40);
    doc.text(`HASIL (Wajib Diisi)`, 120, 40);
    doc.text(`Keterangan`, 300, 40);

    doc.text(`NAMA POSYANDU`, 20, 45);
    doc.text(` : ASTER`, 70, 45);
    doc.text(`S : Semua Balita`, 300, 45);
    doc.text(`BB : Berat Badan`, 400, 45);

    doc.text(`NAMA DUSUN`, 20, 50);
    doc.text(` : KEMBANG PUTIHAN`, 70, 50);
    doc.text(`N : Naik`, 300, 50);
    doc.text(`TB : Tinggi Badan diukur 3 bulan 1X (Februari, Mei, Agustus, November)`, 400, 50);

    doc.text(`BULAN PENIMBANGAN`, 20, 55);
    doc.text(`: ${user.tutupperiode.namaPeriode}`, 70, 55);
    doc.text(`T : Turun/Tetap`, 300, 55);
    doc.text(`LLA : Lingkar lengan atas, LK : Lingkar Kepala`, 400, 55);

    doc.text(`TANGGAL PENIMBANGAN`, 20, 60);
    doc.text(`:`, 70, 60);
    doc.text(`O : Bulan kemarin tidak nimbang`, 300, 60);
    doc.text(`ASIE : Air Susu Ibu Saja (Eksklusif)`, 400, 60);

    doc.text(`KADER YANG HADIR`, 20, 65);
    doc.text(`:`, 70, 65);
    doc.text(`B : Baru`, 300, 65);
    doc.text(`BR : Vit A Biru, M ; Vit A Merah`, 400, 65);

    doc.text(``, 20, 70);
    doc.text(``, 70, 70);
    doc.text(`D : Ditimbang`, 300, 70);
    doc.text(`(Vit A diisi hanya bulan Februari & Agustus)`, 400, 70);

    doc.autoTable({
      html: "#table",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 75,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0],
      },
    });
    doc.save("daftarPosyanduBalita.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "PosyanduBalita",
    sheet: "DaftarPosyanduBalita",
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
      <h5 style={{ fontWeight: 400 }}>Daftar Posyandu Balita</h5>
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
                <th>No</th>
                <th>NO KK</th>
                <th>NIK BALITA</th>
                <th>ANAK KE</th>
                <th>NAMA ANAK</th>
                <th>TGL LAHIR</th>
                <th>UMUR (Bln)</th>
                <th>JK</th>
                <th>IMD</th>
                <th>BBL L (kg)</th>
                <th>PBL L (cm)</th>
                <th>NAMA ORTU (AYAH)</th>
                <th>NAMA ORTU (IBU)</th>
                <th>NIK AYAH</th>
                <th>PENDIDIKAN TERAKHIR AYAH</th>
                <th>PENDIDIKAN TERAKHIR IBU</th>
                <th>RIWAYAT KEHAMILAN IBU LILA</th>
                <th>RIWAYAT KEHAMILAN IBU Hb</th>
                <th>RT</th>
                <th>BB (kg)</th>
                <th>PB/TB (cm)</th>
                <th>LLA</th>
                <th>LK</th>
                <th>N</th>
                <th>T/Tt</th>
                <th>O</th>
                <th>B</th>
                <th>ASI</th>
                <th>Vit A</th>
              </tr>
            </thead>
            <tbody>
              {posyanduBalitas.map((user, index) => {
                let no = 1
                return (
                  <tr key={user.id}>
                    <td>{no}</td>
                    <td>{user.kkBalita}</td>
                    <td>{user.nikBalita}</td>
                    <td>{user.anakKeBalita}</td>
                    <td>{user.namaBalita}</td>
                    <td>{user.tglLahirBalitaFormatted}</td>
                    <td>{user.umurBalita}</td>
                    <td>{user.jenisKelaminBalita}</td>
                    <td></td>
                    <td>{user.beratBadanLahirBalita}</td>
                    <td>{user.panjangBadanLahirBalita}</td>
                    <td>{user.namaAyahBalita}</td>
                    <td>{user.namaIbuBalita}</td>
                    <td>{user.nikAyahBalita}</td>
                    <td>{user.pendidikanTerakhirAyahBalita}</td>
                    <td>{user.pendidikanTerakhirIbuBalita}</td>
                    <td></td>
                    <td></td>
                    <td>{user.rtBalita}</td>
                    <td>{user.beratBadanBalita}</td>
                    <td>{user.panjangBadanBalita}</td>
                    <td>{user.lingkarLenganAtasBalita}</td>
                    <td>{user.lingkarKepalaBalita}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )
                no++
              })}
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
        <table ref={tableRef} class="styled-table" style={{ fontSize: "10px", fontWeight: "500" }}>
          {previewExcel && (
            <tbody>
              <tr>
                <th colspan="29" style={{ textAlign: "center" }} >FORMULIR PEMANTAUAN PERTUMBUHAN BALITA DI POSYANDU 2023</th>
              </tr>
              <tr>
                <td colspan="29"></td>
              </tr>
              <tr>
                <td colspan="2">DESA</td>
                <td colspan="2"><b> : GUWOSARI</b></td>
                <td colspan="5"><b>HASIL (Wajib Diisi)</b></td>
                <td colspan="2"><b>Keterangan</b></td>
                <td colspan="18"></td>
              </tr>
              <tr>
                <td colspan="2">NAMA POSYANDU</td>
                <td colspan="2"><b>: ASTER</b></td>
                <td colspan="5"></td>
                <td colspan="2"><b>S</b> : Semua Balita</td>
                <td colspan="2"><b>BB</b> : Berat Badan</td>
                <td colspan="17"></td>
              </tr>
              <tr>
                <td colspan="2">NAMA DUSUN</td>
                <td colspan="2"><b>: KEMBANG PUTIHAN</b></td>
                <td colspan="5"></td>
                <td colspan="2"><b>N</b> : Naik</td>
                <td colspan="2"><b>TB</b> : Tinggi Badan diukur 3 bulan 1X (Februari, Mei, Agustus, November)</td>
                <td colspan="17"></td>
              </tr>
              <tr>
                <td colspan="2">BULAN PENIMBANGAN</td>
                <td colspan="2">: {user.tutupperiode.namaPeriode}</td>
                <td colspan="5"></td>
                <td colspan="2"><b>T</b> : Turun/Tetap</td>
                <td colspan="2"><b>LLA</b> : Lingkar lengan atas, LK : Lingkar Kepala</td>
                <td colspan="17"></td>
              </tr>
              <tr>
                <td colspan="2">TANGGAL PENIMBANGAN</td>
                <td colspan="2">: </td>
                <td colspan="5"></td>
                <td colspan="2"><b>O</b> : Bulan kemarin tidak nimbang</td>
                <td colspan="2"><b>ASIE</b> : Air Susu Ibu Saja (Eksklusif)</td>
                <td colspan="17"></td>
              </tr>
              <tr>
                <td colspan="2">KADER YANG HADIR</td>
                <td colspan="2">: </td>
                <td colspan="5"></td>
                <td colspan="2"><b>B</b> : Baru</td>
                <td colspan="2"><b>BR</b> : Vit A Biru, M ; Vit A Merah</td>
                <td colspan="17"></td>
              </tr>
              <tr>
                <td colspan="2"></td>
                <td colspan="2"></td>
                <td colspan="5"></td>
                <td colspan="2"><b>D</b> : Ditimbang</td>
                <td colspan="2">(Vit A diisi hanya bulan Februari & Agustus)</td>
                <td colspan="17"></td>
              </tr>
              <tr>
                <td colspan="29"></td>
              </tr>
              <tr>
                <th>No</th>
                <th>NO KK</th>
                <th>NIK BALITA</th>
                <th>ANAK KE</th>
                <th>NAMA ANAK</th>
                <th>TGL LAHIR</th>
                <th>UMUR (Bln)</th>
                <th>JK</th>
                <th>IMD</th>
                <th>BBL L (kg)</th>
                <th>PBL L (cm)</th>
                <th>NAMA ORTU (AYAH)</th>
                <th>NAMA ORTU (IBU)</th>
                <th>NIK AYAH</th>
                <th>PENDIDIKAN TERAKHIR AYAH</th>
                <th>PENDIDIKAN TERAKHIR IBU</th>
                <th>RIWAYAT KEHAMILAN IBU LILA</th>
                <th>RIWAYAT KEHAMILAN IBU Hb</th>
                <th>RT</th>
                <th>BB (kg)</th>
                <th>PB/TB (cm)</th>
                <th>LLA</th>
                <th>LK</th>
                <th>N</th>
                <th>T/Tt</th>
                <th>O</th>
                <th>B</th>
                <th>ASI</th>
                <th>Vit A</th>
              </tr>
              {posyanduBalitas.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.kkBalita}</td>
                    <td>{user.nikBalita}</td>
                    <td>{user.anakKeBalita}</td>
                    <td>{user.namaBalita}</td>
                    <td>{user.tglLahirBalitaFormatted}</td>
                    <td>{user.umurBalita}</td>
                    <td>{user.jenisKelaminBalita}</td>
                    <td></td>
                    <td>{user.beratBadanLahirBalita}</td>
                    <td>{user.panjangBadanLahirBalita}</td>
                    <td>{user.namaAyahBalita}</td>
                    <td>{user.namaIbuBalita}</td>
                    <td>{user.nikAyahBalita}</td>
                    <td>{user.pendidikanTerakhirAyahBalita}</td>
                    <td>{user.pendidikanTerakhirIbuBalita}</td>
                    <td></td>
                    <td></td>
                    <td>{user.rtBalita}</td>
                    <td>{user.beratBadanBalita}</td>
                    <td>{user.panjangBadanBalita}</td>
                    <td>{user.lingkarLenganAtasBalita}</td>
                    <td>{user.lingkarKepalaBalita}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/posyanduBalita/tambahPosyanduBalita`}
          editLink={`/posyanduBalita/${id}/edit`}
          deleteUser={deletePosyanduBalita}
          nameUser={namaBalita}
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
                  <Form.Label column sm="5" style={textRight}>
                    kk :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control value={kkBalita} disabled readOnly />
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
                    <Form.Control value={nikBalita} disabled readOnly />
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
                    <Form.Control value={anakKeBalita} disabled readOnly />
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
                    <Form.Control value={namaBalita} disabled readOnly />
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
                    <Form.Control value={tglLahirBalita} disabled readOnly />
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
                    <Form.Control value={umurBalita} disabled readOnly />
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
                    <Form.Control
                      value={jenisKelaminBalita}
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
                  <Form.Label column sm="5" style={textRight}>
                    Berat Badan Lahir :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={beratBadanLahirBalita}
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
                  <Form.Label column sm="5" style={textRight}>
                    Panjang Badan Lahir :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={panjangBadanLahirBalita}
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
                  <Form.Label column sm="5" style={textRight}>
                    Nama Ayah :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control value={namaAyahBalita} disabled readOnly />
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
                    <Form.Control value={namaIbuBalita} disabled readOnly />
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
                    <Form.Control value={nikAyahBalita} disabled readOnly />
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
                  <Form.Label column sm="5" style={textRight}>
                    Pendidikan Terakhir Ibu :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={pendidikanTerakhirIbuBalita}
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
                  <Form.Label column sm="5" style={textRight}>
                    RT :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control value={rtBalita} disabled readOnly />
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
                    <Form.Control value={beratBadanBalita} disabled readOnly />
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
                  <Form.Label column sm="5" style={textRight}>
                    Lingkar Lengan Atas :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={lingkarLenganAtasBalita}
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
                  <Form.Label column sm="5" style={textRight}>
                    Lingkar Kepala :
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      value={lingkarKepalaBalita}
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
                  <Form.Label column sm="5" style={textRight}>
                    Status :
                  </Form.Label>
                  <Col sm="7">
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
        <ShowTablePosyanduBalita
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

export default TampilPosyanduBalita;

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
