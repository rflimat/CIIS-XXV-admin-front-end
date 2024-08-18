import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import CustomDialog from "src/components/dialog";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersForm } from "src/sections/users/users-form";
import URI from "src/contexts/url-context";
import { FormData2Json } from "src/utils/form-data-json";
import { useRouter } from "next/router";
import { useDialog } from "src/hooks/use-dialog";

const Page = () => {
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      let jsonData = FormData2Json(data);

      fetch(URI.users.src, {
        method: "POST",
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
          router.push("/users");
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
        <title>Añadir usuario</title>
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
              <Typography variant="h4">Añadir usuario</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                <UsersForm handleSubmit={handleSubmit} />
              </Grid>
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Cuenta añadida con éxito"
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
