import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { vistaOrganizador, vistaAdministrador, vistaContador, vistaGestorContenido } from "./config";
import { useAuth } from "src/hooks/use-auth";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  let items = [];
  if (user.role == 1) items = vistaAdministrador;
  else if (user.role == 2) items = vistaOrganizador;
  else if (user.role == 4) items = vistaContador;
  else if (user.role == 5) items = vistaGestorContenido;
  
  if (pathname !== "/" && !items.some((el) => pathname.startsWith(el.path))) {
    router.push("/");
    return;
  }

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
});
