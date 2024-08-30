import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Card,
  CardContent,
  Switch,
  FormControl,
  InputLabel,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import QrReader from "react-qr-scanner";
import { UsersForm } from "src/sections/users/users-form";
import { useState } from "react";
import URI from "src/contexts/url-context";
import Swal from "sweetalert2";
import { PacmanLoader } from "react-spinners";

const typeActEvent = "postmaster";

const info = {
  postmaster: {
    planes: [
      {
        id: (new Date("2024-09-12T05:00:00Z") > new Date()) ? 1 : 4,
        name: "Estudiante de la ESIS",
      },
      {
        id: (new Date("2024-09-12T05:00:00Z") > new Date()) ? 2 : 5,
        name: "Estudiante de la UNJBG",
      },
      {
        id: (new Date("2024-09-12T05:00:00Z") > new Date()) ? 3 : 6,
        name: "Público General",
      },
    ],
  },
  ciis: {
    planes: [
      {
        id: 7,
        name: "Público General",
      },
      {
        id: 8,
        name: "Estudiante visitante",
      },
      {
        id: 9,
        name: "Delegaciones"
      },
      {
        id: 10,
        name: "Estudiantes UNJBG"
      }
    ],
    delegaciones: [
      {
        abrev: "CIIS-XXIV-UNASAM",
        name: "Universidad Nacional Santiago Antúnez de Mayolo Huaraz",
      },
      {
        abrev: "CIIS-XXIV-UNP",
        name: "Universidad Nacional de Piura",
      },
    ],
  },
};

const Page = () => {
  const [type, setType] = useState(14);
  const [scan, setScan] = useState(false);
  const [scanning, setScanning] = useState(false);

  function handleChangeModalidad(event) {
    setScan(false);
    setType(Number(event.target.value));
    if (scan) setTimeout(() => setScan(true), 500);
  }

  function handleScan(result) {
    if (result) {
      setScanning(true);
      const user = JSON.parse(result.text);

      fetch(URI.reservation.qr + "?type_event=postmaster", {
        method: "POST",
        body: JSON.stringify({ dni: user.dni, type }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (res.ok)
            Swal.fire({
              title: "Inscripción exitosa",
              text: `¡${user.name} ${user.lastname} es ahora parte de nuestro evento!`,
              icon: "success",
              confirmButtonText: "Aceptar",
            });
          else return res.json();
        })
        .then((res) => {
          if (res && res.code == 409)
            Swal.fire({
              title: "¿Otra vez tú?",
              text: `${user.name} ${user.lastname} ya se ha inscrito anteriormente`,
              icon: "error",
              confirmButtonText: "Aceptar",
            });
        })
        .catch((err) =>
          Swal.fire({
            title: "Ocurrió un error",
            text: `Problema inesperado`,
            icon: "error",
            confirmButtonText: "Aceptar",
          })
        )
        .finally(() => setScanning(false));
    }
  }

  return (
    <>
      <Head>
        <title>Inscripción rápida | CIIS XXIV</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg" sx={{ mx: 0 }}>
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Inscripción rápida</Typography>
            </div>
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" mb={2}>
                        Modalidad
                      </Typography>
                      <RadioGroup onChange={handleChangeModalidad}>
                        {info[`${typeActEvent}`].planes.map((plan, index) => (
                          <FormControlLabel key={index} value={plan.id} control={<Radio />} label={plan.name} />
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={7} md={4}>
                  <Card>
                    <CardContent>
                      <Box textAlign={"center"}>
                        <Typography variant="h6">Inscribir</Typography>
                      </Box>

                      <Box textAlign={"center"}>
                        Habilitar escaner QR
                        <Switch onChange={() => setScan(!scan)} />
                      </Box>
                      {scanning ? (
                        <Box
                          minHeight={200}
                          sx={{
                            aspectRatio: "1/.75",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <PacmanLoader color="#3498eb" />
                        </Box>
                      ) : scan ? (
                        <QrReader
                          constraints={{
                            video: {
                              facingMode: "environment", // Acceder a la cámara trasera
                            },
                          }}
                          width={"100%"}
                          onError={(e) => console.log("existe un error al escanear", e)}
                          onScan={handleScan}
                        />
                      ) : (
                        <Box
                          minHeight={200}
                          sx={{ aspectRatio: "1/.75" }}
                          backgroundColor="rgba(0,0,0,.1)"
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                {typeActEvent === "ciis" && (
                  <Grid item xs={12} sm={5} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" mb={2}>
                          Delegaciones
                        </Typography>
                        {info.ciis.delegaciones.map((delegacion, index) => (
                          <div key={index}>
                            <Typography fontWeight={"bold"}>{delegacion.abrev}</Typography>
                            <Typography>
                              {delegacion.name}
                            </Typography>
                            <br />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
