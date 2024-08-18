import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  InputBase,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import QrReader from "react-qr-scanner";
import { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import DangerousIcon from "@mui/icons-material/Dangerous";
import URI from "src/contexts/url-context";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Swal from "sweetalert2";
import { PacmanLoader } from "react-spinners";

const Page = () => {
  const [result, setResult] = useState(null);
  const [scan, setScan] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState("1");

  const requestAttendance = (event, userID) => {
    const requestBody = { entry: Number(selectedEntry) };
    setScanning(true);

    fetch(URI.attendance(event, userID), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(async (res) => {
        let serverMsg = await res.json();
        if (res.ok) {
          Swal.fire({
            title: "Listo",
            text: serverMsg.message,
            icon: "success",
          });
        } else {
          if (serverMsg.code == 409) {
            Swal.fire({
              title: "Duplicado",
              text: "Ya se marcó asistencia",
              icon: "error",
            });
          } else {
            throw new Error();
          }
        }
      })
      .catch(() =>
        Swal.fire({
          title: "Error",
          text: "Ocurrio un error inesperado",
          icon: "error",
        })
      )
      .finally(() => {
        setResult(null);
        setScanning(false);
      });
  };

  const handleScan = (result) => {
    if (result && result.text) {
      console.log(result);
      try {
        const jsonResult = JSON.parse(result.text);
        if (jsonResult && jsonResult.dni) {
          const dniValue = jsonResult.dni;
          setResult(dniValue);
          // console.log(dniValue);
          requestAttendance(24, dniValue);
        } else {
          console.error("El campo 'dni' no está presente en el objeto JSON.");
        }
      } catch (error) {
        console.error("Error al analizar el JSON:", error);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let dni = event.target.querySelector("input").value;
      requestAttendance(24, dni);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    setResult(null);
  };

  const handleCloseFailure = () => {
    setFailure(false);
    setResult(null);
  };

  return (
    <>
      <Head>Asistencia | CIIS XXIV</Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4">Asistencia</Typography>
            </Box>
            <Box>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Card>
                    <CardContent>
                      <Box component={"form"} onSubmit={handleSubmit}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography variant="h6">Marcar por DNI</Typography>
                        </Box>
                        <Box my={2}>
                          <TextField
                            variant="standard"
                            placeholder="p.e. 77558811"
                            type="number"
                            name="dni"
                            label="Ingrese DNI"
                            fullWidth
                            inputProps={{
                              pattern: "^[0-9]{8}$", // Expresión regular
                              title: "Ingrese un DNI válido",
                            }}
                            required
                          />
                        </Box>
                        <Button
                          type="submit"
                          variant="text"
                          sx={{
                            color: "grey",
                            backgroundColor: "rgba(0,0,0,.02)",
                            borderRadius: 0,
                          }}
                          fullWidth
                        >
                          <HowToRegIcon fontSize="small" />
                          Enviar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item md={4} xs={12}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography variant="h6">Estado de marcar asistencia</Typography>
                        <Box>
                          <RadioGroup
                            aria-label="entry"
                            name="entry"
                            value={selectedEntry}
                            onChange={(event) => {
                              setScan(false);
                              setSelectedEntry(event.target.value);
                              if (scan) {
                                setTimeout(() => setScan(true), 500);
                              }
                            }}
                          >
                            <FormControlLabel
                              value="0"
                              control={<Radio />}
                              label="Deshabilitar marcado de asistencia de usuario"
                            />
                            <FormControlLabel
                              value="1"
                              control={<Radio />}
                              label="Marcar asistencia"
                            />
                            <FormControlLabel
                              value="2"
                              control={<Radio />}
                              label="Habilitar marcado de asistencia de usuario"
                            />
                          </RadioGroup>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography variant="h6">Marcar por scan QR</Typography>

                        <Box>
                          <Typography variant="title2">Habilitar escaner QR</Typography>
                          <Switch
                            inputProps={{ "aria-label": "Color switch demo" }}
                            color="secondary"
                            onChange={() => setScan(!scan)}
                          />
                        </Box>
                      </Box>

                      <Box display={"flex"} justifyContent={"center"}>
                        {scanning ? (
                          <>
                            <PacmanLoader></PacmanLoader>
                          </>
                        ) : !result && scan ? (
                          <QrReader
                            constraints={{
                              video: {
                                facingMode: "environment", // Acceder a la cámara trasera
                              },
                            }}
                            width={200}
                            height={200}
                            onError={(e) => console.log("existe un error al escanear", e)}
                            onScan={handleScan}
                          />
                        ) : (
                          <Box minHeight={200} minWidth={200} backgroundColor="rgba(0,0,0,.1)" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
