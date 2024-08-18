import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SponsorForm } from "src/sections/sponsors/sponsor-form";
import URI from "src/contexts/url-context";
import CustomDialog from "src/components/dialog";
import { useDialog } from "src/hooks/use-dialog";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [sponsor, setSponsor] = useState();
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (event, selectedFile) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      data.append("logo", selectedFile);
      data.delete("idEvent");

      fetch(URI.sponsors.one(id), {
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
          router.push("/sponsors");
        })
        .catch((err) => {
          console.log(err);
          errorDialog.handleToggle();
        });
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchSponsor = async (id) => {
      let data = await fetch(URI.sponsors.one(id), {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setSponsor(data);

      setLoading(false);
    };

    fetchSponsor(id);
  }, [id]);

  return (
    <>
      <Head>
        <title>Editar sponsor</title>
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
              <Typography variant="h4">Editar sponsor</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                {!loading && <SponsorForm sponsor={sponsor} handleSubmit={handleSubmit} />}
              </Grid>
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Sponsor actualizado con éxito"
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
