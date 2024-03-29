import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaBook,
  FaUserCog,
  FaSignOutAlt,
  FaDochub,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaExchangeAlt,
  FaHandHoldingMedical,
  FaMapMarkerAlt,
} from "react-icons/fa";
import sidebarBg from "../assets/bg1.jpg";

const Sidebar = ({
  image,
  collapsed,
  toggled,
  handleToggleSidebar,
  handleCollapsedChange,
}) => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutButtonHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      onToggle={handleToggleSidebar}
      breakPoint="md"
    >
      {/* Header */}
      <SidebarHeader>
        <Menu iconShape="circle">
          {collapsed ? (
            <MenuItem
              icon={<FaAngleDoubleRight />}
              onClick={handleCollapsedChange}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<FaAngleDoubleLeft />}
              onClick={handleCollapsedChange}
            >
              <div
                style={{
                  padding: "9px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 15,
                  letterSpacing: "1px",
                }}
              >
                Desa
              </div>
            </MenuItem>
          )}
        </Menu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu title={"Desa"} icon={<FaBook />}>
            {user.akses.rt === true && (
              <MenuItem>
                Rt <NavLink to="/rt" />
              </MenuItem>
            )}
            {user.akses.penduduk === true && (
              <MenuItem>
                Penduduk <NavLink to="/daftarPenduduk" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Data Web"} icon={<FaMapMarkerAlt />}>
            {user.akses.lokasiPetinggi === true && (
              <MenuItem>
                Lokasi Petinggi <NavLink to="/lokasiPetinggi" />
              </MenuItem>
            )}
            {user.akses.lokasiUmkm === true && (
              <MenuItem>
                Lokasi UMKM <NavLink to="/lokasiUmkm" />
              </MenuItem>
            )}
            {user.akses.lokasiWisata === true && (
              <MenuItem>
                Lokasi Wisata <NavLink to="/lokasiWisata" />
              </MenuItem>
            )}
            {user.akses.umkm === true && (
              <MenuItem>
                UMKM <NavLink to="/umkm" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Posyandu"} icon={<FaHandHoldingMedical />}>
            {user.akses.posyanduLansia === true && (
              <MenuItem>
                Lansia <NavLink to="/posyanduLansia" />
              </MenuItem>
            )}
            {user.akses.posyanduBalita === true && (
              <MenuItem>
                Balita <NavLink to="/posyanduBalita" />
              </MenuItem>
            )}
            {user.akses.tutupPeriode === true && (
              <MenuItem>
                Tutup Periode
                <NavLink to="/tutupPeriode" />
              </MenuItem>
            )}
            {user.akses.gantiPeriode === true && (
              <MenuItem>
                Ganti Periode <NavLink to="/gantiPeriode" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Setelan"} icon={<FaUserCog />}>
            {user.akses.profilUser === true && (
              <MenuItem>
                Profil User <NavLink to="/profilUser" />
              </MenuItem>
            )}
            {user.akses.daftarUser === true && (
              <MenuItem>
                Daftar User <NavLink to="/daftarUser" />
              </MenuItem>
            )}
            {user.akses.setting === true && (
              <MenuItem>
                Setting <NavLink to="/setting" />
              </MenuItem>
            )}
          </SubMenu>
        </Menu>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", marginTop: "10px" }}>{user.username}</p>
        <div className="sidebar-btn-wrapper" style={{ paddingBottom: "10px" }}>
          <Link
            className="sidebar-btn"
            style={{ cursor: "pointer" }}
            to="/"
            onClick={logoutButtonHandler}
          >
            <span style={{ marginRight: "6px" }}>Logout</span>
            <FaSignOutAlt />
          </Link>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Sidebar;
