import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import CustomDialog from "src/components/dialog";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TallerForm } from "src/sections/taller/taller-form";
import URI from "src/contexts/url-context";
import { useRouter } from "next/router";
import { useDialog } from "src/hooks/use-dialog";
import { FormData2Json } from "src/utils/form-data-json";
import { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [taller, setTaller] = useState();
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
      
      fetch(URI.taller.one(id), {
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
            throw serverResponse;
          }
            successDialog.handleToggle();
            router.push("/taller");
        })
        .catch((err) => {
          console.log(err);
          errorDialog.handleToggle();
        });
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchTaller = async (id) => {
      let data = await fetch(URI.taller.one(id), {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setTaller(data);

      setLoading(false);
    };

    fetchTaller(id);
  }, [id]);


  return (
    <>
      <Head>
        <title>Añadir taller</title>
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
              <Typography variant="h4">Editar taller</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
              {!loading && <TallerForm taller={taller} handleSubmit={handleSubmit} />}
              </Grid>
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Taller actualizado con éxito"
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
