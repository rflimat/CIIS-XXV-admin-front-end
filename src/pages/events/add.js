import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import CustomDialog from "src/components/dialog";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EventsForm } from "src/sections/events/events-form";
import URI from "src/contexts/url-context";
import { useRouter } from "next/router";
import { useDialog } from "src/hooks/use-dialog";

const Page = () => {
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();

  const handleSubmit = (event, selectedFileLogo, selectedFileBrouchure, selectedGalleryEvent) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      data.append("logo", selectedFileLogo);
      data.append("brouchere", selectedFileBrouchure);
      
      fetch(URI.events.src, {
        method: "POST",
        body: data,
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            let serverResponse = await res.json();
            throw new Error(serverResponse);
          }
          
          let data = await res.json();

          if (selectedGalleryEvent.length > 0) {
            let galleryData = new FormData();
            for (let i = 0; i < selectedGalleryEvent.length; i++) {
              console.log(selectedGalleryEvent[i])
              galleryData.append("image", selectedGalleryEvent[i]);
              galleryData.append("name", `flyer${i + 1}`);
              galleryData.append("priority", 1);
            }

            fetch(URI.events.one(data.id_event).src + "/gallery", {
              method: "POST",
              body: galleryData,
              credentials: "include",
            })
              .then(async (res) => {
                if (!res.ok) {
                  let serverResponse = await res.json();
                  throw new Error(serverResponse);
                }
                successDialog.handleToggle();
                router.push("/events");
              })
              .catch((err) => {
                console.log(err);
                errorDialog.handleToggle();
              });

          } else {
            successDialog.handleToggle();
            router.push("/events");
          }
          
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
        <title>Añadir evento</title>
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
              <Typography variant="h4">Añadir evento</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                <EventsForm handleSubmit={handleSubmit} />
              </Grid>
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Evento añadido con éxito"
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
