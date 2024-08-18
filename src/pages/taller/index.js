import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TallerTable } from "src/sections/taller/taller-table";
import URI from "src/contexts/url-context";
import { saveOnChest } from "src/utils/chest";
import { useRouter } from "next/router";
// import { useFormik } from 'formik';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [talleres, setTalleres] = useState([]);

  useEffect(() => {
    setLoading(true);

    const fetchTaller = async () => {
      try {
        let data = await fetch(`${URI.taller}`, {
          method: "GET",
          credentials: "include",
        });

        data = await data.json();
        console.log(data);
        setTalleres(data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchTaller();
  }, []);

  const router = useRouter();

  const tallerId = async (taller) => {
    try {
      let unTaller = await fetch(`${URI.taller}/${taller.id}`, {
        method: "GET",
        credentials: "include",
      });

      unTaller = await unTaller.json();
      saveOnChest("taller", unTaller);
      router.push("/taller/inscritos");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Taller específico</title>
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
              <Typography variant="h4">Lista de talleres</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                <TallerTable items={talleres} tallerId={tallerId} />
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
