import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Button } from "@mui/material";
import CustomDialog from "src/components/dialog";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import URI, { domain } from "src/contexts/url-context";
import { useRouter } from "next/router";
import { useDialog } from "src/hooks/use-dialog";

const Page = () => {
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();
  const { id } = router.query;

  const handleGenerateReportSpeakers = async () => {
    try {
      let data = await fetch(`${URI.events.one(id).reports.speakers}`, {
        method: "GET",
        credentials: "include",
      });
      successDialog.handleOpen();
    } catch (error) {
      console.log(error);
      errorDialog.handleOpen();
    }
  };

  const handleGenerateReportConferences = async () => {
    try {
      let data = await fetch(`${URI.events.one(id).reports.conferences}`, {
        method: "GET",
        credentials: "include",
      });
      successDialog.handleOpen();
    } catch (error) {
      console.log(error);
      errorDialog.handleOpen();
    }
  };

  const handleGenerateReportSponsors = async () => {
    try {
      let data = await fetch(`${URI.events.one(id).reports.sponsors}`, {
        method: "GET",
        credentials: "include",
      });
      successDialog.handleOpen();
    } catch (error) {
      console.log(error);
      errorDialog.handleOpen();
    }
  };

  const handleGenerateReportTalleres = async () => {
    try {
      let data = await fetch(`${URI.events.one(id).reports.taller}`, {
        method: "GET",
        credentials: "include",
      });
      successDialog.handleOpen();
    } catch (error) {
      console.log(error);
      errorDialog.handleOpen();
    }
  };

  return (
    <>
      <Head>
        <title>Generar reporte evento</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Generar reporte evento</Typography>
              <p>Los reportes se generaran en formato JSON para las paginas del evento correspondiente</p>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <span>Reporte de ponentes</span>
                  <Button type="button" variant="contained" style={{marginLeft: 10}} onClick={handleGenerateReportSpeakers}>
                    Generar
                  </Button>
                  <span style={{marginLeft: 20}}>
                    <a href={domain + `/reports/${id}/speakers.json`} target="_blank" rel="noreferrer">{domain + `/reports/${id}/speakers.json`}</a>
                  </span>
                </Grid>
                <Grid xs={12}>
                  <span>Reporte cronograma de conferencias</span>
                  <Button type="button" variant="contained" style={{marginLeft: 10}} onClick={handleGenerateReportConferences}>
                    Generar
                  </Button>
                  <span style={{marginLeft: 20}}>
                    <a href={domain + `/reports/${id}/cronograma.json`} target="_blank" rel="noreferrer">{domain + `/reports/${id}/cronograma.json`}</a>
                  </span>
                </Grid>
                <Grid xs={12}>
                  <span>Reporte de sponsors</span>
                  <Button type="button" variant="contained" style={{marginLeft: 10}} onClick={handleGenerateReportSponsors}>
                    Generar
                  </Button>
                  <span style={{marginLeft: 20}}>
                    <a href={domain + `/reports/${id}/sponsors.json`} target="_blank" rel="noreferrer">{domain + `/reports/${id}/sponsors.json`}</a>
                  </span>
                </Grid>
                <Grid xs={12}>
                  <span>Reporte de talleres</span>
                  <Button type="button" variant="contained" style={{marginLeft: 10}} onClick={handleGenerateReportTalleres}>
                    Generar
                  </Button>
                  <span style={{marginLeft: 20}}>
                    <a href={domain + `/reports/${id}/talleres.json`} target="_blank" rel="noreferrer">{domain + `/reports/${id}/talleres.json`}</a>
                  </span>
                </Grid>
              </Grid>

              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Reporte generado con éxito"
              />
              <CustomDialog
                open={errorDialog.open}
                onClose={errorDialog.handleToggle}
                type="error"
                message="Ocurrió un error al generar reporte"
              />
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
