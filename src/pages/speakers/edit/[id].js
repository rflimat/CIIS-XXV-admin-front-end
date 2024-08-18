import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SpeakerForm } from "src/sections/speakers/speaker-form";
import CustomDialog from "src/components/dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDialog } from "src/hooks/use-dialog";
import URI from "src/contexts/url-context";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [speaker, setSpeaker] = useState();
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (event, selectedFile) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      if (selectedFile) data.append("avatar", selectedFile);

      fetch(URI.speakers.one(id), {
        method: "PUT",
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

  useEffect(() => {
    setLoading(true);

    const fetchSpeaker = async (id) => {
      let data = await fetch(URI.speakers.one(id), {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setSpeaker(data);

      setLoading(false);
    };

    fetchSpeaker(id);
  }, [id]);

  return (
    <>
      <Head>
        <title>Editar ponente</title>
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
              <Typography variant="h4">Editar ponente</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                {!loading && <SpeakerForm speaker={speaker} handleSubmit={handleSubmit} />}
              </Grid>
            </div>
            <CustomDialog
              open={successDialog.open}
              onClose={successDialog.handleToggle}
              type="success"
              message="Ponente actualizado con éxito"
            />
            <CustomDialog
              open={errorDialog.open}
              onClose={errorDialog.handleToggle}
              type="error"
              message="Ocurrió un error durante la actualización"
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
