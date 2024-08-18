import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import CustomDialog from "src/components/dialog";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ConferenceForm } from "src/sections/conferences/conference-form";
import URI from "src/contexts/url-context";
import { useRouter } from "next/router";
import { useDialog } from "src/hooks/use-dialog";
import { FormData2Json } from "src/utils/form-data-json";
import { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [conference, setConference] = useState();
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (event, idSpeaker) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      data.append("idSpeaker", idSpeaker);
      let jsonData = FormData2Json(data);
      
      fetch(URI.conferences.one(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            let serverResponse = await res.json();
            throw new Error(serverResponse);
          }
            successDialog.handleToggle();
            router.push("/conferences");
        })
        .catch((err) => {
          console.log(err);
          errorDialog.handleToggle();
        });
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchConference = async (id) => {
      let data = await fetch(URI.conferences.one(id), {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setConference(data);

      setLoading(false);
    };

    fetchConference(id);
  }, [id]);

  return (
    <>
      <Head>
        <title>Editar conferencia</title>
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
              <Typography variant="h4">Editar conferencia</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                {!loading && <ConferenceForm conference={conference} handleSubmit={handleSubmit} />}
              </Grid>
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Conferencia actualizado con éxito"
              />
              <CustomDialog
                open={errorDialog.open}
                onClose={errorDialog.handleToggle}
                type="error"
                message="Ocurrió un error durante la actualización"
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
