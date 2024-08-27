import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersForm } from "src/sections/users/users-form";
import URI from "src/contexts/url-context";
import { FormData2Json } from "src/utils/form-data-json";
import { useRouter } from 'next/router';
import CustomDialog from "src/components/dialog";
import { useDialog } from "src/hooks/use-dialog";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      let jsonData = FormData2Json(data);
      
      fetch(URI.users.one(id), {
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
          router.push("/users");
        })
        .catch((err) => {
          console.log(err);
          errorDialog.handleToggle();
        });
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchUser = async (id) => {
      let data = await fetch(URI.users.one(id), {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setUser(data);

      setLoading(false);
    }

    fetchUser(id);
  }, [id]);

  return (
    <>
      <Head>
        <title>Editar usuario</title>
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
              <Typography variant="h4">Editar usuario</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                {!loading && (
                  <UsersForm user={user} handleSubmit={handleSubmit} />
                )}
              </Grid>
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Cuenta actualizada con éxito"
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
