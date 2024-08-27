import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
  SvgIcon,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TopicCards } from "src/sections/topics/topic-cards";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import NextLink from "next/link";
import { useRouter } from "next/router";
import URI from "src/contexts/url-context";
import { useEffect, useState } from "react";
import CustomDialog from "src/components/dialog";
import { useDialog } from "src/hooks/use-dialog";

const Page = () => {
  const [topics, setTopics] = useState([]);
  const [toDelete, setToDelete] = useState();
  const deleteDialog = useDialog();
  const successDialog = useDialog();

  useEffect(() => {
    fetchTopics();
  }, []);

  const router = useRouter();

  const fetchTopics = async () => {
    try {
      let data = await fetch(`${URI.topics.src}`, {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setTopics(data);
    } catch (error) {
      console.log(error);
    }
  };

  const topicId = (topic) => {
    router.push(`/topics/edit/${topic.id}`);
  };

  const deleteTopic = (topic) => {
    deleteDialog.handleToggle();
    setToDelete(topic);
  }

  const yesHandle = () => {
    deleteDialog.handleToggle();

    fetch(`${URI.topics.one(toDelete.id)}`, {
      method: "DELETE",
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) {
        let serverResponse = await res.json();
        throw serverResponse;
      }
      successDialog.handleToggle();
      setToDelete(undefined);
      fetchTopics();
    });
  };

  return (
    <>
      <Head>
        <title>Topics</title>
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
              <Typography variant="h4">Topics</Typography>
            </div>
            <div>
              <Button
                component={NextLink}
                href="/topics/add"
                startIcon={
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>
                }
                sx={{ mt: 3 }}
                variant="contained"
              >
                Nuevo
              </Button>
            </div>
            <div>
              <Grid md={12} lg={12}>
                <TopicCards items={topics} topicId={topicId} deleteTopic={deleteTopic} />
              </Grid>
              <CustomDialog
                open={deleteDialog.open}
                onClose={deleteDialog.handleToggle}
                type="none"
                message="¿Esta seguro de eliminar topic?"
                yesorno={true}
                yesHandle={yesHandle}
                noHandle={deleteDialog.handleToggle}
              />
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Topic eliminado con éxito"
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
