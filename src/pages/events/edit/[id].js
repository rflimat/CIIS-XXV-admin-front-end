import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import CustomDialog from "src/components/dialog";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EventsForm } from "src/sections/events/events-form";
import URI from "src/contexts/url-context";
import { useRouter } from "next/router";
import { useDialog } from "src/hooks/use-dialog";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState();
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (event, selectedFileLogo, selectedFileBrouchure, selectedGalleryEvent) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      if (selectedFileLogo) data.append("logo", selectedFileLogo);
      if (selectedFileBrouchure) data.append("brouchere", selectedFileBrouchure);

      fetch(URI.events.one(id).src, {
        method: "PUT",
        body: data,
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            let serverResponse = await res.json();
            throw serverResponse;
          }

          if (selectedGalleryEvent.length > 0) {
            let galleryData = new FormData();
            for (let i = 0; i < selectedGalleryEvent.length; i++) {
              console.log(selectedGalleryEvent[i])
              galleryData.append("image", selectedGalleryEvent[i]);
              galleryData.append("name", `flyer${i + 1}`);
              galleryData.append("priority", 1);
            }

            fetch(URI.events.one(id).src + "/gallery", {
              method: "POST",
              body: galleryData,
              credentials: "include",
            })
              .then(async (res) => {
                if (!res.ok) {
                  let serverResponse = await res.json();
                  throw serverResponse;
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

  useEffect(() => {
    setLoading(true);

    const fetchEvent = async (id) => {
      let data = await fetch(URI.events.one(id).src, {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setEvent(data);

      setLoading(false);
    };

    fetchEvent(id);
  }, [id]);

  return (
    <>
      <Head>
        <title>Editar evento</title>
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
              <Typography variant="h4">Editar evento</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
              {!loading && <EventsForm event={event} handleSubmit={handleSubmit} /> }
              </Grid>
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Evento actualizado con éxito"
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
