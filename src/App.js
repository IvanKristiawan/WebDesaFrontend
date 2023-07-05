import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar, Footer, ScrollToTop } from "./components";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import "./styles.scss";
import {
  Login,
  ProfilUser,
  UbahProfilUser,
  DaftarUser,
  TambahUser,
  UbahUser,
  TampilSetting,
  UbahSetting,
  TutupPeriode,
  TampilGantiPeriode,
  TampilRt,
  TambahRt,
  UbahRt,
  TampilDaftarPenduduk,
  TampilPenduduk,
  TambahPenduduk,
  TampilPendudukChild,
  UbahPendudukChild,
  TampilPosyanduLansia,
  TambahPosyanduLansia,
  UbahPosyanduLansia,
  TampilLokasiPetinggi,
  UbahLokasiPetinggi,
  TambahLokasiPetinggi,
  TampilLokasiUmkm,
  UbahLokasiUmkm,
  TambahLokasiUmkm,
  TampilLokasiWisata,
  TambahLokasiWisata,
} from "./pages/index";
import { FaBars } from "react-icons/fa";

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const PROFILUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.profilUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DAFTARUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.daftarUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SETTINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.setting) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const TUTUPPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.tutupPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const GANTIPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.gantiPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const RTRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.rt) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PENDUDUKRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.penduduk) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const POSYANDULANSIARoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.posyanduLansia) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LOKASIPETINGGIRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.lokasiPetinggi) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LOKASIUMKMRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.lokasiUmkm) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LOKASIWISATARoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.lokasiWisata) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      {user && (
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
        />
      )}

      <main>
        <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Profil User */}
          <Route
            path="/profilUser"
            element={
              <PROFILUSERRoute>
                <ProfilUser />
              </PROFILUSERRoute>
            }
          />
          <Route
            path="/profilUser/:id/edit"
            element={
              <PROFILUSERRoute>
                <UbahProfilUser />
              </PROFILUSERRoute>
            }
          />
          {/* Daftar User */}
          <Route
            path="/daftarUser"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id/edit"
            element={
              <DAFTARUSERRoute>
                <UbahUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/tambahUser"
            element={
              <DAFTARUSERRoute>
                <TambahUser />
              </DAFTARUSERRoute>
            }
          />
          {/* Setting */}
          <Route
            path="/setting"
            element={
              <SETTINGRoute>
                <TampilSetting />
              </SETTINGRoute>
            }
          />
          <Route
            path="/setting/:id/edit"
            element={
              <SETTINGRoute>
                <UbahSetting />
              </SETTINGRoute>
            }
          />
          {/* Ganti Periode */}
          <Route
            path="/gantiPeriode"
            element={
              <GANTIPERIODERoute>
                <TampilGantiPeriode />
              </GANTIPERIODERoute>
            }
          />
          <Route
            path="/gantiPeriode/:id"
            element={
              <GANTIPERIODERoute>
                <TampilGantiPeriode />
              </GANTIPERIODERoute>
            }
          />
          <Route
            path="/tutupPeriode"
            element={
              <TUTUPPERIODERoute>
                <TutupPeriode />
              </TUTUPPERIODERoute>
            }
          />
          {/* RT */}
          <Route
            path="/rt"
            element={
              <RTRoute>
                <TampilRt />
              </RTRoute>
            }
          />
          <Route
            path="/rt/:id"
            element={
              <RTRoute>
                <TampilRt />
              </RTRoute>
            }
          />
          <Route
            path="/rt/:id/edit"
            element={
              <RTRoute>
                <UbahRt />
              </RTRoute>
            }
          />
          <Route
            path="/rt/tambahRt"
            element={
              <RTRoute>
                <TambahRt />
              </RTRoute>
            }
          />
          {/* Penduduk */}
          <Route
            path="/daftarPenduduk"
            element={
              <PENDUDUKRoute>
                <TampilDaftarPenduduk />
              </PENDUDUKRoute>
            }
          />
          <Route
            path="/daftarPenduduk/penduduk/:id"
            element={
              <PENDUDUKRoute>
                <TampilPenduduk />
              </PENDUDUKRoute>
            }
          />
          <Route
            path="/daftarPenduduk/penduduk/:id/tambahPenduduk"
            element={
              <PENDUDUKRoute>
                <TambahPenduduk />
              </PENDUDUKRoute>
            }
          />
          <Route
            path="/daftarPenduduk/penduduk/:id/:idPendudukChild"
            element={
              <PENDUDUKRoute>
                <TampilPendudukChild />
              </PENDUDUKRoute>
            }
          />
          <Route
            path="/daftarPenduduk/penduduk/:id/:idPendudukChild/edit"
            element={
              <PENDUDUKRoute>
                <UbahPendudukChild />
              </PENDUDUKRoute>
            }
          />
          {/* Posyandu Lansia */}
          <Route
            path="/posyanduLansia"
            element={
              <POSYANDULANSIARoute>
                <TampilPosyanduLansia />
              </POSYANDULANSIARoute>
            }
          />
          <Route
            path="/posyanduLansia/:id"
            element={
              <POSYANDULANSIARoute>
                <TampilPosyanduLansia />
              </POSYANDULANSIARoute>
            }
          />
          <Route
            path="/posyanduLansia/:id/edit"
            element={
              <POSYANDULANSIARoute>
                <UbahPosyanduLansia />
              </POSYANDULANSIARoute>
            }
          />
          <Route
            path="/posyanduLansia/tambahPosyanduLansia"
            element={
              <POSYANDULANSIARoute>
                <TambahPosyanduLansia />
              </POSYANDULANSIARoute>
            }
          />
          {/* Lokasi Petinggi */}
          <Route
            path="/lokasiPetinggi"
            element={
              <LOKASIPETINGGIRoute>
                <TampilLokasiPetinggi />
              </LOKASIPETINGGIRoute>
            }
          />
          <Route
            path="/lokasiPetinggi/:id"
            element={
              <LOKASIPETINGGIRoute>
                <TampilLokasiPetinggi />
              </LOKASIPETINGGIRoute>
            }
          />
          <Route
            path="/lokasiPetinggi/:id/edit"
            element={
              <LOKASIPETINGGIRoute>
                <UbahLokasiPetinggi />
              </LOKASIPETINGGIRoute>
            }
          />
          <Route
            path="/lokasiPetinggi/tambahLokasiPetinggi"
            element={
              <LOKASIPETINGGIRoute>
                <TambahLokasiPetinggi />
              </LOKASIPETINGGIRoute>
            }
          />
          {/* Lokasi Umkm */}
          <Route
            path="/lokasiUmkm"
            element={
              <LOKASIUMKMRoute>
                <TampilLokasiUmkm />
              </LOKASIUMKMRoute>
            }
          />
          <Route
            path="/lokasiUmkm/:id"
            element={
              <LOKASIUMKMRoute>
                <TampilLokasiUmkm />
              </LOKASIUMKMRoute>
            }
          />
          <Route
            path="/lokasiUmkm/:id/edit"
            element={
              <LOKASIUMKMRoute>
                <UbahLokasiUmkm />
              </LOKASIUMKMRoute>
            }
          />
          <Route
            path="/lokasiUmkm/tambahLokasiUmkm"
            element={
              <LOKASIUMKMRoute>
                <TambahLokasiUmkm />
              </LOKASIUMKMRoute>
            }
          />
          {/* Lokasi Wisata */}
          <Route
            path="/lokasiWisata"
            element={
              <LOKASIWISATARoute>
                <TampilLokasiWisata />
              </LOKASIWISATARoute>
            }
          />
          <Route
            path="/lokasiWisata/:id"
            element={
              <LOKASIWISATARoute>
                <TampilLokasiWisata />
              </LOKASIWISATARoute>
            }
          />
          {/* <Route
            path="/lokasiWisata/:id/edit"
            element={
              <LOKASIWISATARoute>
                <UbahLokasiWisata />
              </LOKASIWISATARoute>
            }
          /> */}
          <Route
            path="/lokasiWisata/tambahLokasiWisata"
            element={
              <LOKASIWISATARoute>
                <TambahLokasiWisata />
              </LOKASIWISATARoute>
            }
          />
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default App;
