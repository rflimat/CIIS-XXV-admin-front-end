import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TopicForm } from "src/sections/topics/topic-form";
import { useRouter } from "next/router";
import { useDialog } from "src/hooks/use-dialog";
import CustomDialog from "src/components/dialog";
import { useEffect, useState } from "react";
import { FormData2Json } from "src/utils/form-data-json";
import URI from "src/contexts/url-context";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState();
  const successDialog = useDialog();
  const errorDialog = useDialog();
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      let jsonData = FormData2Json(data);

      fetch(URI.topics.one(id), {
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
          router.push("/topics");
        })
        .catch((err) => {
          console.log(err);
          errorDialog.handleToggle();
        });
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchTopic = async (id) => {
      let data = await fetch(URI.topics.one(id), {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setTopic(data);

      setLoading(false);
    };

    fetchTopic(id);
  }, [id]);

  return (
    <>
      <Head>
        <title>Editar Topic</title>
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
              <Typography variant="h4">Editar Topic</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                {!loading && <TopicForm topic={topic} handleSubmit={handleSubmit} />}
              </Grid>
            </div>
            <CustomDialog
              open={successDialog.open}
              onClose={successDialog.handleToggle}
              type="success"
              message="Topic actualizado con éxito"
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
