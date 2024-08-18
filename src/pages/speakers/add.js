import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SpeakerForm } from "src/sections/speakers/speaker-form";
import URI from "src/contexts/url-context";
import CustomDialog from "src/components/dialog";
import { useDialog } from "src/hooks/use-dialog";
import { useRouter } from "next/router";

const Page = () => {
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();

  const handleSubmit = (event, selectedFile) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      data.append("avatar", selectedFile);

      fetch(URI.speakers.src, {
        method: "POST",
        body: data,
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            let serverResponse = await res.json();
            throw new Error(serverResponse);
          }
          successDialog.handleToggle();
          router.push("/speakers");
        })
        .catch((err) => {
          console.log(err);
          errorDialog.handleToggle();
        });
    }
  };

  return (
    <>
      <Head>
        <title>Creación de ponente</title>
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
              <Typography variant="h4">Añadir nuevo ponente</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                <SpeakerForm handleSubmit={handleSubmit} />
              </Grid>
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Ponente añadido con éxito"
              />
              <CustomDialog
                open={errorDialog.open}
                onClose={errorDialog.handleToggle}
                type="error"
                message="Ocurrió un error durante la creación"
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
